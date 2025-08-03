// Game State and Logic

class LanguageGame {
  constructor() {
    this.xp = 0;
    this.currentRegionKey = null;
    this.currentMode = 'flashcard';
    this.learnedByRegion = {};
    this.learnedMap = new Map();
    this.quizRemaining = [];
    this.crRemaining = [];
    this.settings = this.loadSettings();
    
    // Load saved state
    this.loadGameState();
  }

  /**
   * Load settings from localStorage or use defaults
   */
  loadSettings() {
    const saved = localStorage.getItem('languageGameSettings');
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {
        console.warn('Failed to load settings, using defaults');
        return { ...DEFAULT_SETTINGS };
      }
    }
    return { ...DEFAULT_SETTINGS };
  }

  /**
   * Save settings to localStorage
   */
  saveSettings() {
    try {
      localStorage.setItem('languageGameSettings', JSON.stringify(this.settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }

  /**
   * Update a setting
   */
  updateSetting(key, value) {
    this.settings[key] = value;
    this.saveSettings();
  }

  /**
   * Get a setting value
   */
  getSetting(key) {
    return this.settings[key];
  }

  /**
   * Reset settings to defaults
   */
  resetSettings() {
    this.settings = { ...DEFAULT_SETTINGS };
    this.saveSettings();
  }

  /**
   * Load game state from localStorage
   */
  loadGameState() {
    this.xp = loadFromStorage('languageGame_xp', 0);
    this.learnedByRegion = loadFromStorage('languageGame_learnedByRegion', {});
    this.learnedMap = new Map(loadFromStorage('languageGame_learnedMap', []));
  }

  /**
   * Save game state to localStorage
   */
  saveGameState() {
    saveToStorage('languageGame_xp', this.xp);
    saveToStorage('languageGame_learnedByRegion', this.learnedByRegion);
    saveToStorage('languageGame_learnedMap', Array.from(this.learnedMap.entries()));
  }

  /**
   * Add XP and mark item as learned
   * @param {string} spanish - Spanish text
   * @param {string} english - English text
   * @param {string} regionKey - Region key
   * @param {number} xpGain - XP to gain
   */
  addLearned(spanish, english, regionKey, xpGain = 10) {
    const key = `${spanish}|${english}`;
    
    if (!this.learnedMap.has(key)) {
      this.learnedMap.set(key, {
        spanish,
        english,
        regionKey,
        learnedAt: Date.now(),
        xpGained: xpGain
      });
      
      this.xp += xpGain;
      
      if (!this.learnedByRegion[regionKey]) {
        this.learnedByRegion[regionKey] = 0;
      }
      this.learnedByRegion[regionKey]++;
      
      this.saveGameState();
      return true; // Newly learned
    }
    
    return false; // Already learned
  }

  /**
   * Get progress for a specific region
   * @param {string} regionKey - Region key
   * @returns {Object} - Progress information
   */
  getRegionProgress(regionKey) {
    const region = REGIONS[regionKey];
    if (!region) return null;
    
    const learned = this.learnedByRegion[regionKey] || 0;
    const total = region.flashcards.length;
    const percentage = calculatePercentage(learned, total);
    
    return {
      learned,
      total,
      percentage,
      region: region
    };
  }

  /**
   * Get overall progress across all regions
   * @returns {Object} - Overall progress
   */
  getOverallProgress() {
    const regions = Object.keys(REGIONS);
    let totalLearned = 0;
    let totalCards = 0;
    
    regions.forEach(regionKey => {
      const progress = this.getRegionProgress(regionKey);
      if (progress) {
        totalLearned += progress.learned;
        totalCards += progress.total;
      }
    });
    
    return {
      totalLearned,
      totalCards,
      percentage: calculatePercentage(totalLearned, totalCards)
    };
  }

  /**
   * Set current region
   * @param {string} regionKey - Region key
   */
  setCurrentRegion(regionKey) {
    this.currentRegionKey = regionKey;
  }

  /**
   * Set current mode
   * @param {string} mode - Game mode
   */
  setCurrentMode(mode) {
    this.currentMode = mode;
  }

  /**
   * Get current region data
   * @returns {Object|null} - Current region data
   */
  getCurrentRegion() {
    return this.currentRegionKey ? REGIONS[this.currentRegionKey] : null;
  }

  /**
   * Get flashcards for current region
   * @returns {Array} - Flashcards array
   */
  getCurrentFlashcards() {
    const region = this.getCurrentRegion();
    return region ? region.flashcards : [];
  }

  /**
   * Get unlearned flashcards for current region
   * @returns {Array} - Unlearned flashcards
   */
  getUnlearnedFlashcards() {
    const flashcards = this.getCurrentFlashcards();
    return flashcards.filter(card => {
      const key = `${card.front}|${card.back}`;
      return !this.learnedMap.has(key);
    });
  }

  /**
   * Get quiz options for a given card
   * @param {Object} correctCard - The correct card
   * @returns {Array} - Quiz options including the correct answer
   */
  getQuizOptions(correctCard) {
    const currentCards = this.getCurrentFlashcards();
    const otherCards = currentCards.filter(card => 
      card.front !== correctCard.front
    );
    
    // Get 3 random wrong answers
    const wrongAnswers = shuffle(otherCards).slice(0, 3);
    const options = [...wrongAnswers, correctCard];
    
    return shuffle(options);
  }

  /**
   * Check if answer is correct for quiz
   * @param {string} userAnswer - User's selected answer
   * @param {Object} correctCard - The correct card
   * @returns {boolean} - Whether answer is correct
   */
  checkQuizAnswer(userAnswer, correctCard) {
    return userAnswer === correctCard.front;
  }

  /**
   * Check if answer is correct for call & response with enhanced validation
   * @param {string} userAnswer - User's typed answer
   * @param {Object} correctCard - The correct card
   * @returns {Object} - Validation result with details
   */
  checkCRAnswer(userAnswer, correctCard) {
    return validateAnswer(userAnswer, correctCard.front);
  }

  /**
   * Get next quiz card
   * @returns {Object|null} - Next quiz card or null if none left
   */
  getNextQuizCard() {
    if (this.quizRemaining.length === 0) {
      this.quizRemaining = shuffle([...this.getCurrentFlashcards()]);
    }
    
    return this.quizRemaining.length > 0 ? this.quizRemaining.pop() : null;
  }

  /**
   * Get next call & response card
   * @returns {Object|null} - Next CR card or null if none left
   */
  getNextCRCard() {
    if (this.crRemaining.length === 0) {
      this.crRemaining = shuffle([...this.getCurrentFlashcards()]);
    }
    
    return this.crRemaining.length > 0 ? this.crRemaining.pop() : null;
  }

  /**
   * Reset quiz for current region
   */
  resetQuiz() {
    this.quizRemaining = shuffle([...this.getCurrentFlashcards()]);
  }

  /**
   * Reset call & response for current region
   */
  resetCR() {
    this.crRemaining = shuffle([...this.getCurrentFlashcards()]);
  }

  /**
   * Get XP display value
   * @returns {string} - Formatted XP
   */
  getXPDisplay() {
    return formatXP(this.xp);
  }

  /**
   * Get level information
   * @returns {Object} - Level information
   */
  getLevelInfo() {
    return getLevelInfo(this.xp);
  }

  /**
   * Get all regions with their progress
   * @returns {Object} - Regions with progress data
   */
  getAllRegionsWithProgress() {
    const regionsWithProgress = {};
    
    Object.keys(REGIONS).forEach(regionKey => {
      const progress = this.getRegionProgress(regionKey);
      if (progress) {
        regionsWithProgress[regionKey] = {
          ...REGIONS[regionKey],
          progress
        };
      }
    });
    
    return regionsWithProgress;
  }

  /**
   * Reset all progress (for testing/debugging)
   */
  resetProgress() {
    this.xp = 0;
    this.learnedByRegion = {};
    this.learnedMap.clear();
    this.saveGameState();
  }

  /**
   * Export game data
   * @returns {Object} - Game data for export
   */
  exportGameData() {
    return {
      xp: this.xp,
      levelInfo: this.getLevelInfo(),
      learnedByRegion: this.learnedByRegion,
      learnedMap: Array.from(this.learnedMap.entries()),
      overallProgress: this.getOverallProgress(),
      exportDate: new Date().toISOString()
    };
  }

  /**
   * Import game data
   * @param {Object} data - Game data to import
   */
  importGameData(data) {
    if (data.xp !== undefined) this.xp = data.xp;
    if (data.learnedByRegion) this.learnedByRegion = data.learnedByRegion;
    if (data.learnedMap) this.learnedMap = new Map(data.learnedMap);
    
    this.saveGameState();
  }
}

// Create global game instance
const game = new LanguageGame(); 