// Utility Functions

/**
 * Normalize text for comparison (remove accents, lowercase, etc.)
 * @param {string} str - The string to normalize
 * @returns {string} - Normalized string
 */
const normalize = (str) => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters and punctuation
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
};

/**
 * Calculate Levenshtein distance between two strings
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} - Distance between strings
 */
function levenshtein(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  
  const matrix = Array.from({ length: a.length + 1 }, () => []);
  
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,     // deletion
        matrix[i][j - 1] + 1,     // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }
  
  return matrix[a.length][b.length];
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} - Shuffled array
 */
function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// TTS cache to prevent repeated messages
const ttsCache = {
  messages: new Map()
};

/**
 * Get TTS cooldown time from settings
 * @returns {number} - Cooldown time in milliseconds
 */
function getTTSCooldown() {
  if (typeof game !== 'undefined' && game.getSetting) {
    return game.getSetting('ttsCooldown');
  }
  return 3000; // Default 3 seconds
}

/**
 * Speak Spanish text using Web Speech API
 * @param {string} text - Text to speak
 * @param {string} lang - Language code (default: 'es')
 */
function speakSpanish(text, lang = 'es') {
  if ('speechSynthesis' in window) {
    const messageKey = `${text}_${lang}`;
    const now = Date.now();
    const cooldownTime = getTTSCooldown();

    const lastSpoken = ttsCache.messages.get(messageKey);
    if (lastSpoken && (now - lastSpoken) < cooldownTime) {
      return;
    }

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'en' ? 'en-US' : 'es-ES';

    // Find a preferred voice for English
    if (lang === 'en') {
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith('en') && 
        (voice.name.includes('Google') || voice.name.includes('Microsoft'))
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    }

    if (typeof game !== 'undefined' && game.getSetting) {
      utterance.volume = game.getSetting('ttsVolume');
      utterance.rate = game.getSetting('ttsRate');
      utterance.pitch = game.getSetting('ttsPitch');
    } else {
      utterance.volume = 0.8;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
    }

    ttsCache.messages.set(messageKey, now);

    const oneMinuteAgo = now - 60000;
    for (const [key, timestamp] of ttsCache.messages.entries()) {
      if (timestamp < oneMinuteAgo) {
        ttsCache.messages.delete(key);
      }
    }

    speechSynthesis.speak(utterance);
  }
}

/**
 * Calculate percentage with bounds
 * @param {number} value - Current value
 * @param {number} total - Total value
 * @returns {number} - Percentage between 0 and 100
 */
function calculatePercentage(value, total) {
  return Math.min(Math.max((value / total) * 100, 0), 100);
}

/**
 * Format XP number with commas
 * @param {number} xp - XP value to format
 * @returns {string} - Formatted XP string
 */
function formatXP(xp) {
  return xp.toLocaleString();
}

/**
 * Get random element from array
 * @param {Array} array - Array to get random element from
 * @returns {*} - Random element
 */
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Enhanced answer validation with flexible matching
 * @param {string} userAnswer - User's answer
 * @param {string} correctAnswer - Correct answer
 * @param {number} threshold - Maximum Levenshtein distance (default: 3)
 * @returns {Object} - Validation result with details
 */
function validateAnswer(userAnswer, correctAnswer, threshold = 3) {
  const userNorm = normalize(userAnswer);
  const correctNorm = normalize(correctAnswer);
  
  // Exact match
  if (userNorm === correctNorm) {
    return { isCorrect: true, confidence: 1.0, type: 'exact' };
  }
  
  // Check if user answer contains the correct answer or vice versa
  if (correctNorm.includes(userNorm) && userNorm.length > 3) {
    return { isCorrect: true, confidence: 0.9, type: 'partial' };
  }
  
  if (userNorm.includes(correctNorm) && correctNorm.length > 3) {
    return { isCorrect: true, confidence: 0.8, type: 'partial' };
  }
  
  // Calculate Levenshtein distance
  const distance = levenshtein(userNorm, correctNorm);
  const maxLength = Math.max(userNorm.length, correctNorm.length);
  const similarity = 1 - (distance / maxLength);
  
  // Check if distance is within threshold
  if (distance <= threshold && similarity > 0.7) {
    return { 
      isCorrect: true, 
      confidence: similarity, 
      type: 'fuzzy',
      distance: distance
    };
  }
  
  // Check for common word matches (for longer sentences)
  const userWords = userNorm.split(' ').filter(word => word.length > 2);
  const correctWords = correctNorm.split(' ').filter(word => word.length > 2);
  const matchingWords = userWords.filter(word => correctWords.includes(word));
  
  if (matchingWords.length >= Math.min(2, correctWords.length)) {
    return { 
      isCorrect: true, 
      confidence: 0.7, 
      type: 'word_match',
      matchingWords: matchingWords
    };
  }
  
  return { 
    isCorrect: false, 
    confidence: similarity, 
    type: 'incorrect',
    distance: distance
  };
}

/**
 * Check if two strings are similar (for answer validation) - Legacy function
 * @param {string} userAnswer - User's answer
 * @param {string} correctAnswer - Correct answer
 * @param {number} threshold - Maximum Levenshtein distance (default: 2)
 * @returns {boolean} - Whether answers are similar enough
 */
function isSimilarAnswer(userAnswer, correctAnswer, threshold = 2) {
  const result = validateAnswer(userAnswer, correctAnswer, threshold);
  return result.isCorrect;
}

/**
 * Get current level and progress based on XP
 * @param {number} xp - Current XP
 * @returns {Object} - Level information
 */
function getLevelInfo(xp) {
  const levels = Object.keys(XP_LEVELS).map(Number).sort((a, b) => a - b);
  let currentLevel = 1;
  let nextLevel = 2;
  
  for (let i = 0; i < levels.length - 1; i++) {
    const level = levels[i];
    const nextLevelXP = XP_LEVELS[level + 1].xp;
    
    if (xp >= XP_LEVELS[level].xp && xp < nextLevelXP) {
      currentLevel = level;
      nextLevel = level + 1;
      break;
    }
  }
  
  const currentLevelInfo = XP_LEVELS[currentLevel];
  const nextLevelInfo = XP_LEVELS[nextLevel];
  
  const xpForCurrentLevel = currentLevelInfo.xp;
  const xpForNextLevel = nextLevelInfo ? nextLevelInfo.xp : xpForCurrentLevel;
  const xpProgress = xp - xpForCurrentLevel;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  const levelProgress = xpNeeded > 0 ? (xpProgress / xpNeeded) * 100 : 100;
  
  return {
    level: currentLevel,
    title: currentLevelInfo.title,
    xp: xp,
    xpForCurrentLevel: xpForCurrentLevel,
    xpForNextLevel: xpForNextLevel,
    xpProgress: xpProgress,
    xpNeeded: xpNeeded,
    levelProgress: Math.min(levelProgress, 100),
    isMaxLevel: currentLevel === Math.max(...levels)
  };
}

/**
 * Generate a unique ID
 * @returns {string} - Unique ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {*} data - Data to save
 */
function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

/**
 * Load data from localStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} - Loaded data or default value
 */
function loadFromStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
}

/**
 * Dark mode utilities
 */

/**
 * Get current theme from localStorage or system preference
 * @returns {string} - Current theme ('light' or 'dark')
 */
function getCurrentTheme() {
  const savedTheme = loadFromStorage('languageGame_theme');
  if (savedTheme) {
    return savedTheme;
  }
  
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
}

/**
 * Set theme and save to localStorage
 * @param {string} theme - Theme to set ('light' or 'dark')
 */
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  saveToStorage('languageGame_theme', theme);
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  return newTheme;
}

/**
 * Initialize theme on page load
 */
function initializeTheme() {
  const theme = getCurrentTheme();
  setTheme(theme);
}

// Export utilities for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    normalize,
    levenshtein,
    shuffle,
    speakSpanish,
    calculatePercentage,
    formatXP,
    getRandomElement,
    debounce,
    validateAnswer,
    isSimilarAnswer,
    getLevelInfo,
    generateId,
    saveToStorage,
    loadFromStorage,
    getCurrentTheme,
    setTheme,
    toggleTheme,
    initializeTheme
  };
} 