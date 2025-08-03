// UI Components and Rendering

class LanguageGameUI {
  constructor() {
    this.elements = {
      xpCounter: document.getElementById('xpCounter'),
      mapContainer: document.getElementById('mapContainer'),
      panelTitle: document.getElementById('panelTitle'),
      panelBody: document.getElementById('panelBody'),
      progressContainer: document.getElementById('progressContainer'),
      flashcardBtn: document.getElementById('flashcardBtn'),
      quizBtn: document.getElementById('quizBtn'),
      crBtn: document.getElementById('crBtn'),
      levelLabel: document.getElementById('levelLabel'),
      xpBar: document.getElementById('xpBar')
    };

    this.currentCardIndex = 0;
    this.currentCards = [];
    this.currentCard = null; // Store current card for word lookups
    this.popup = null; // Store popup element
    this.currentTab = 'map'; // Track current active tab

    this.initializeEventListeners();
  }

  /**
   * Initialize event listeners
   */
  initializeEventListeners() {
    // Mode button listeners
    this.elements.flashcardBtn.addEventListener('click', () => this.switchMode('flashcard'));
    this.elements.quizBtn.addEventListener('click', () => this.switchMode('quiz'));
    this.elements.crBtn.addEventListener('click', () => this.switchMode('call-response'));

    // Tab navigation listeners
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');
        this.switchTab(tabName);
      });
    });

    // Close popup when clicking outside
    document.addEventListener('click', (e) => {
      if (this.popup && !this.popup.contains(e.target) && !e.target.classList.contains('clickable-word')) {
        this.hidePopup();
      }
    });
  }

  /**
   * Switch between tabs
   * @param {string} tabName - Name of the tab to switch to
   */
  switchTab(tabName) {
    // Update tab button states
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-tab') === tabName) {
        btn.classList.add('active');
      }
    });

    // Update tab panel visibility
    const tabPanels = document.querySelectorAll('.tab-panel');
    tabPanels.forEach(panel => {
      panel.classList.remove('active');
      if (panel.id === `${tabName}-tab`) {
        panel.classList.add('active');
      }
    });

    this.currentTab = tabName;

    // Update content based on tab
    switch (tabName) {
      case 'map':
        this.renderMap();
        break;
      case 'game':
        this.renderCurrentMode();
        break;
      case 'progress':
        this.renderProgress();
        break;
    }

    // Save current tab to localStorage
    localStorage.setItem('currentTab', tabName);
  }

  /**
   * Get the current active tab
   * @returns {string} Current tab name
   */
  getCurrentTab() {
    return this.currentTab;
  }

  /**
   * Create clickable word spans from text
   * @param {string} text - Text to make clickable
   * @param {Object} breakdown - Word breakdown object
   * @returns {string} - HTML with clickable words
   */
  makeWordsClickable(text, breakdown = {}) {
    if (!breakdown || Object.keys(breakdown).length === 0) {
      return text; // Return original text if no breakdown available
    }

    let processedText = text;

    // First, identify and process multi-word phrases
    // Sort breakdown keys by length (longest first) to handle overlapping phrases correctly
    const sortedKeys = Object.keys(breakdown).sort((a, b) => b.length - a.length);

    sortedKeys.forEach(phrase => {
      // Only process phrases that contain spaces (multi-word phrases)
      if (phrase.includes(' ')) {
        const explanation = breakdown[phrase];
        // Create a regex that matches the phrase, handling punctuation at start/end
        // Escape special regex characters
        const escapedPhrase = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // For phrases that start with punctuation, don't use word boundary at the start
        // For phrases that end with punctuation, don't use word boundary at the end
        const startsWithPunctuation = /^[¿¡.,!?;:]/.test(phrase);
        const endsWithPunctuation = /[.,!?;:]$/.test(phrase);

        let regexPattern;
        if (startsWithPunctuation && endsWithPunctuation) {
          regexPattern = escapedPhrase; // No word boundaries
        } else if (startsWithPunctuation) {
          regexPattern = `${escapedPhrase}\\b`; // Only end boundary
        } else if (endsWithPunctuation) {
          regexPattern = `\\b${escapedPhrase}`; // Only start boundary
        } else {
          regexPattern = `\\b${escapedPhrase}\\b`; // Both boundaries
        }

        const regex = new RegExp(regexPattern, 'gi');

        processedText = processedText.replace(regex, (match) => {
          return `<span class="clickable-word multi-word-phrase" data-word="${phrase}" data-explanation="${explanation}">${match}</span>`;
        });
      }
    });

    // Then process individual words that haven't been wrapped yet
    // Use a more careful approach that preserves spacing
    const tokens = processedText.split(/(\s+)/); // Split only on whitespace, preserve spaces

    const result = tokens.map(token => {
      // If it's just whitespace, return as-is
      if (/^\s+$/.test(token)) {
        return token;
      }

      // If it already contains a span (already processed), return as-is
      if (token.includes('<span')) {
        return token;
      }

      // Split the token by punctuation while preserving the punctuation
      const parts = token.split(/([.,!?;:])/);

      return parts.map(part => {
        if (!part || /^[.,!?;:]$/.test(part)) {
          return part; // Return punctuation as-is
        }

        const cleanPart = part.trim();
        if (!cleanPart) {
          return part;
        }

        // Check if this individual word exists in breakdown (and isn't a multi-word phrase)
        const explanation = breakdown[cleanPart] || breakdown[part];
        if (explanation && !cleanPart.includes(' ')) {
          return `<span class="clickable-word" data-word="${cleanPart}" data-explanation="${explanation}">${part}</span>`;
        }

        return part; // Return part as-is if no explanation
      }).join('');
    }).join('');

    return result;
  }

  /**
   * Show word popup
   * @param {string} word - The word clicked
   * @param {string} explanation - The explanation for the word
   * @param {Event} event - Click event
   */
  showPopup(word, explanation, event) {
    // Hide existing popup
    this.hidePopup();

    // Create popup element
    this.popup = document.createElement('div');
    this.popup.className = 'word-popup';
    this.popup.innerHTML = `
      <div class="popup-content">
        <div class="popup-header">
          <span class="popup-word">${word}</span>
          <button class="popup-close" onclick="ui.hidePopup()">×</button>
        </div>
        <div class="popup-body">
          <div class="popup-explanation">${explanation}</div>
        </div>
      </div>
    `;

    // Position popup near the clicked word
    const rect = event.target.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    // Calculate initial position
    let top = rect.bottom + scrollTop + 5;
    let left = rect.left + scrollLeft;

    // Add to body first to get popup dimensions
    document.body.appendChild(this.popup);

    // Adjust position to keep popup on screen
    const popupRect = this.popup.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Adjust horizontal position
    if (left + popupRect.width > viewportWidth + scrollLeft) {
      left = viewportWidth + scrollLeft - popupRect.width - 10;
    }
    if (left < scrollLeft) {
      left = scrollLeft + 10;
    }

    // Adjust vertical position
    if (top + popupRect.height > viewportHeight + scrollTop) {
      // Show above the word if there's not enough space below
      top = rect.top + scrollTop - popupRect.height - 5;
    }
    if (top < scrollTop) {
      top = scrollTop + 10;
    }

    this.popup.style.position = 'absolute';
    this.popup.style.top = `${top}px`;
    this.popup.style.left = `${left}px`;

    // Add click event to close popup
    this.popup.addEventListener('click', (e) => {
      if (e.target.classList.contains('popup-close')) {
        this.hidePopup();
      }
    });
  }

  /**
   * Hide word popup
   */
  hidePopup() {
    if (this.popup) {
      this.popup.remove();
      this.popup = null;
    }
  }

  /**
   * Add click handlers to clickable words
   */
  addWordClickHandlers() {
    const clickableWords = document.querySelectorAll('.clickable-word');
    clickableWords.forEach(word => {
      word.addEventListener('click', (e) => {
        e.stopPropagation();
        const wordText = word.dataset.word;
        const explanation = word.dataset.explanation;

        // Determine language by checking if the word is on the front or back of the card
        const isFront = e.target.closest('.flashcard-front');
        const lang = isFront ? 'es' : 'en';

        // Speak the clicked word
        speakSpanish(wordText, lang);

        // Show the definition popup
        this.showPopup(wordText, explanation, e);
      });
    });
  }

  /**
   * Add click handlers to quiz options
   */
  addQuizOptionHandlers() {
    const quizOptions = document.querySelectorAll('.quiz-option');
    quizOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        const userAnswer = option.dataset.answer;
        const correctAnswer = option.dataset.correct;
        this.checkQuizAnswer(userAnswer, correctAnswer);
      });
    });
  }

  /**
   * Update XP display with level information
   */
  updateXPDisplay() {
    const lvl = game.getLevelInfo();
    this.elements.xpCounter.textContent = `${formatXP(game.xp)} XP`;
    document.getElementById('levelLabel').textContent = `Lvl ${lvl.level}`;
    const bar = document.getElementById('xpBar');
    bar.max = lvl.xpNeeded;
    bar.value = lvl.xpProgress;
  }

  /**
   * Render the map with all regions
   */
  renderMap() {
    this.elements.mapContainer.innerHTML = '';

    const regionsWithProgress = game.getAllRegionsWithProgress();

    Object.entries(regionsWithProgress).forEach(([regionKey, regionData]) => {
      const regionCard = document.createElement('div');
      regionCard.className = 'region-card';
      regionCard.style.backgroundColor = regionData.color;
      regionCard.setAttribute('data-region', regionKey);

      const progress = regionData.progress;
      const percentage = Math.round(progress.percentage);

      regionCard.innerHTML = `
        <div>
          <h3>${regionData.name}</h3>
          <div class="progress-info">
            ${progress.learned}/${progress.total} (${percentage}%)
          </div>
        </div>
        <div class="region-progress-bar">
          <div class="region-progress-fill" style="width: ${percentage}%"></div>
        </div>
      `;

      regionCard.addEventListener('click', () => this.selectRegion(regionKey));

      this.elements.mapContainer.appendChild(regionCard);
    });
  }

  /**
   * Select a region and update UI
   * @param {string} regionKey - Region key
   */
  selectRegion(regionKey) {
    game.setCurrentRegion(regionKey);

    // Update map selection
    const regionCards = this.elements.mapContainer.querySelectorAll('.region-card');
    regionCards.forEach(card => card.classList.remove('selected'));

    const selectedCard = this.elements.mapContainer.querySelector(`[data-region="${regionKey}"]`);
    if (selectedCard) {
      selectedCard.classList.add('selected');
    }

    // Update panel title
    const region = REGIONS[regionKey];
    this.elements.panelTitle.textContent = region.name;

    // Switch to game tab and render current mode
    this.switchTab('game');
    this.renderCurrentMode();
  }

  /**
   * Switch game mode
   * @param {string} mode - New mode
   */
  switchMode(mode) {
    game.setCurrentMode(mode);

    // Update button states
    const modeButtons = [this.elements.flashcardBtn, this.elements.quizBtn, this.elements.crBtn];
    modeButtons.forEach(btn => btn.classList.remove('active'));

    const activeButton = this.elements[`${mode.replace('-', '')}Btn`];
    if (activeButton) {
      activeButton.classList.add('active');
    }

    // Render the new mode
    this.renderCurrentMode();
  }

  /**
   * Render the current game mode
   */
  renderCurrentMode() {
    if (!game.currentRegionKey) {
      this.renderPlaceholder();
      return;
    }

    switch (game.currentMode) {
      case 'flashcard':
        this.renderFlashcards();
        break;
      case 'quiz':
        this.renderQuiz();
        break;
      case 'call-response':
        this.renderCallResponse();
        break;
    }
  }

  /**
   * Render placeholder when no region is selected
   */
  renderPlaceholder() {
    this.elements.panelBody.innerHTML = `
      <p class="placeholder-text">Elige una región del mapa para comenzar a aprender español.</p>
    `;
  }

  /**
   * Render flashcards mode
   */
  renderFlashcards() {
    const flashcards = game.getCurrentFlashcards();
    if (flashcards.length === 0) {
      this.elements.panelBody.innerHTML = '<p class="text-center">No hay flashcards disponibles.</p>';
      return;
    }

    this.currentCards = flashcards;
    this.currentCardIndex = 0;
    this.renderCurrentFlashcard();
  }

  /**
   * Render current flashcard
   */
  renderCurrentFlashcard() {
    if (this.currentCardIndex >= this.currentCards.length) {
      this.elements.panelBody.innerHTML = `
        <div class="text-center">
          <h3>¡Completado!</h3>
          <p>Has revisado todas las flashcards de esta región.</p>
          <button class="flashcard-btn primary" onclick="ui.renderFlashcards()">
            Empezar de nuevo
          </button>
        </div>
      `;
      return;
    }

    const card = this.currentCards[this.currentCardIndex];
    this.currentCard = card; // Store current card for word lookups

    // Check if card has enhanced information
    const hasEnhancedInfo = card.context || card.grammar || card.breakdown;

    this.elements.panelBody.innerHTML = `
      <div class="flashcard" onclick="ui.flipFlashcard()">
        <div class="flashcard-inner">
          <div class="flashcard-front">
            <button class="tts-btn" onclick="event.stopPropagation(); ui.speakCard('${card.front}')">🔊</button>
            ${this.makeWordsClickable(card.front, card.breakdown)}
          </div>
          <div class="flashcard-back">
            <button class="tts-btn" onclick="event.stopPropagation(); ui.speakCard('${card.back}', 'en')">🔊</button>
            ${this.makeWordsClickable(card.back, card.breakdown)}
          </div>
        </div>
      </div>
      <div class="flashcard-controls">
        <button class="flashcard-btn secondary" onclick="ui.previousFlashcard()">
          ← Anterior
        </button>
        ${hasEnhancedInfo ? `
          <button class="flashcard-btn secondary" onclick="ui.toggleFlashcardDetails()">
            📖 Detalles
          </button>
        ` : ''}
        <button class="flashcard-btn primary" onclick="ui.markAsLearned()">
          ✓ Aprendido
        </button>
        <button class="flashcard-btn secondary" onclick="ui.nextFlashcard()">
          Siguiente →
        </button>
      </div>
      ${hasEnhancedInfo ? `
        <div class="flashcard-details-card" id="detailsCard" style="display: none;">
          <div class="details-content">
            ${card.context ? `<div class="context-note"><strong>📝 Cuándo usar:</strong> ${card.context}</div>` : ''}
            ${card.grammar ? `<div class="grammar-note"><strong>📚 Gramática:</strong> ${card.grammar}</div>` : ''}
            ${card.breakdown ? `
              <div class="word-breakdown">
                <strong>🔍 Desglose:</strong>
                <div class="breakdown-items">
                  ${Object.entries(card.breakdown).map(([word, explanation]) =>
      `<div class="breakdown-item"><span class="word">${word}</span>: ${explanation}</div>`
    ).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      ` : ''}
    `;

    // Add click handlers to clickable words
    this.addWordClickHandlers();

    // Auto-play TTS for the Spanish phrase (if enabled)
    if (game.getSetting('ttsAutoPlay')) {
      setTimeout(() => {
        this.speakCard(card.front);
      }, 500);
    }
  }

  /**
   * Speak the card text
   * @param {string} text - Text to speak
   * @param {string} lang - Language code (default: 'es')
   */
  speakCard(text, lang = 'es') {
    speakSpanish(text, lang);
  }

  /**
   * Flip the current flashcard
   */
  flipFlashcard() {
    const flashcard = this.elements.panelBody.querySelector('.flashcard');
    if (flashcard) {
      flashcard.classList.toggle('flipped');

      // Auto-play TTS based on settings
      setTimeout(() => {
        const card = this.currentCards[this.currentCardIndex];
        if (flashcard.classList.contains('flipped')) {
          // Speak the English translation when flipped (if enabled)
          if (game.getSetting('ttsAutoPlayEnglish')) {
            this.speakCard(card.back, 'en');
          }
        } else {
          // Speak the Spanish phrase when flipped back (if enabled)
          if (game.getSetting('ttsAutoPlay')) {
            this.speakCard(card.front, 'es');
          }
        }
      }, game.getSetting('flashcardFlipSpeed') * 1000);
    }
  }

  /**
   * Toggle flashcard details visibility
   */
  toggleFlashcardDetails() {
    const detailsCard = document.getElementById('detailsCard');
    if (detailsCard) {
      const isVisible = detailsCard.style.display !== 'none';
      detailsCard.style.display = isVisible ? 'none' : 'block';

      // Update button text
      const detailsBtn = this.elements.panelBody.querySelector('.flashcard-btn[onclick*="toggleFlashcardDetails"]');
      if (detailsBtn) {
        detailsBtn.innerHTML = isVisible ? '📖 Detalles' : '📖 Ocultar';
      }
    }
  }

  /**
   * Go to previous flashcard
   */
  previousFlashcard() {
    if (this.currentCardIndex > 0) {
      this.currentCardIndex--;
      this.renderCurrentFlashcard();
    }
  }

  /**
   * Go to next flashcard
   */
  nextFlashcard() {
    if (this.currentCardIndex < this.currentCards.length - 1) {
      this.currentCardIndex++;
      this.renderCurrentFlashcard();
    }
  }

  /**
   * Mark current flashcard as learned
   */
  markAsLearned() {
    const card = this.currentCards[this.currentCardIndex];
    const wasNewlyLearned = game.addLearned(card.front, card.back, game.currentRegionKey, 10);

    if (wasNewlyLearned) {
      this.updateXPDisplay();
      this.renderProgress();
      this.renderMap(); // Update map progress
    }

    this.nextFlashcard();
  }

  /**
   * Render quiz mode
   */
  renderQuiz() {
    const card = game.getNextQuizCard();
    if (!card) {
      this.elements.panelBody.innerHTML = `
        <div class="text-center">
          <h3>¡Quiz completado!</h3>
          <p>Has completado todas las preguntas de esta región.</p>
          <button class="flashcard-btn primary" onclick="game.resetQuiz(); ui.renderQuiz()">
            Empezar de nuevo
          </button>
        </div>
      `;
      return;
    }

    this.currentCard = card; // Store current card for word lookups
    const options = game.getQuizOptions(card);

    this.elements.panelBody.innerHTML = `
      <div class="quiz-question">
        <h4>¿Cómo se dice "${card.back}" en español?</h4>
      </div>
      <div class="quiz-options">
        ${options.map(option => `
          <div class="quiz-option" data-answer="${option.front}" data-correct="${card.front}">
            ${option.front}
          </div>
        `).join('')}
      </div>
    `;

    // Add click handlers for quiz options (not for words)
    this.addQuizOptionHandlers();
  }

  /**
   * Check quiz answer
   * @param {string} userAnswer - User's answer
   * @param {string} correctAnswer - Correct answer
   */
  checkQuizAnswer(userAnswer, correctAnswer) {
    const isCorrect = userAnswer === correctAnswer;
    const card = { front: correctAnswer, back: '' };

    // Add feedback
    const feedback = document.createElement('div');
    feedback.className = `quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    feedback.textContent = isCorrect ? '¡Correcto!' : `Incorrecto. La respuesta correcta es: ${correctAnswer}`;

    const quizOptions = this.elements.panelBody.querySelector('.quiz-options');
    quizOptions.appendChild(feedback);

    // Mark as learned if correct
    if (isCorrect) {
      game.addLearned(card.front, card.back, game.currentRegionKey, 15);
      this.updateXPDisplay();
      this.renderProgress();
      this.renderMap(); // Update map progress
    }

    // Disable all options
    const options = this.elements.panelBody.querySelectorAll('.quiz-option');
    options.forEach(option => {
      option.style.pointerEvents = 'none';
      if (option.textContent.trim() === userAnswer) {
        option.classList.add(isCorrect ? 'correct' : 'incorrect');
      }
    });

    // Continue after delay
    setTimeout(() => {
      this.renderQuiz();
    }, 2000);
  }

  /**
   * Render call & response mode
   */
  renderCallResponse() {
    const card = game.getNextCRCard();
    if (!card) {
      this.elements.panelBody.innerHTML = `
        <div class="text-center">
          <h3>¡Call & Response completado!</h3>
          <p>Has completado todas las preguntas de esta región.</p>
          <button class="flashcard-btn primary" onclick="game.resetCR(); ui.renderCallResponse()">
            Empezar de nuevo
          </button>
        </div>
      `;
      return;
    }

    this.currentCard = card; // Store current card for word lookups

    this.elements.panelBody.innerHTML = `
      <div class="cr-prompt">
        <button class="tts-btn" onclick="speakSpanish('${card.back}')">🔊</button>
        ${this.makeWordsClickable(card.back, card.breakdown)}
      </div>
      <input type="text" class="cr-input" placeholder="Escribe la respuesta en español" 
             onkeypress="if(event.key === 'Enter') ui.checkCRAnswer(this.value, '${card.front}')">
      <button class="cr-submit" onclick="ui.checkCRAnswer(this.previousElementSibling.value, '${card.front}')">
        Comprobar
      </button>
      <div id="crFeedback" style="margin-top: 0.6rem; text-align: center;"></div>
    `;

    // Add click handlers to clickable words
    this.addWordClickHandlers();
  }

  /**
   * Clear call & response answer to allow retry
   */
  clearCRAnswer() {
    const input = this.elements.panelBody.querySelector('.cr-input');
    const submitBtn = this.elements.panelBody.querySelector('.cr-submit');
    const feedback = document.getElementById('crFeedback');

    // Clear and re-enable input
    input.value = '';
    input.disabled = false;
    input.style.borderColor = '';
    input.focus();

    // Re-enable submit button
    submitBtn.disabled = false;

    // Clear feedback
    feedback.innerHTML = '';
  }

  /**
   * Check call & response answer with enhanced feedback
   * @param {string} userAnswer - User's answer
   * @param {string} correctAnswer - Correct answer
   */
  checkCRAnswer(userAnswer, correctAnswer) {
    const validation = game.checkCRAnswer(userAnswer, { front: correctAnswer });
    const feedback = document.getElementById('crFeedback');
    const input = this.elements.panelBody.querySelector('.cr-input');

    if (validation.isCorrect) {
      input.style.borderColor = 'var(--clr-success)';

      // Show correct answer if confidence is less than 99% (not perfect)
      const showCorrectAnswer = validation.confidence < 0.99;

      feedback.innerHTML = `
        <div class="cr-feedback correct">
          <strong>¡Correcto!</strong>
          ${showCorrectAnswer ? `
            <div class="correct-answer">
              Respuesta ideal: <strong>${correctAnswer}</strong>
            </div>
          ` : ''}
          <div class="feedback-details">
            ${validation.type === 'exact' ? 'Respuesta perfecta' :
          validation.type === 'partial' ? 'Respuesta parcial aceptada' :
            validation.type === 'fuzzy' ? `Respuesta aceptada (similitud: ${Math.round(validation.confidence * 100)}%)` :
              'Respuesta aceptada'}
          </div>
          ${showCorrectAnswer ? `
            <div class="feedback-details">
              Tu respuesta: "${userAnswer}"
            </div>
          ` : ''}
        </div>
      `;
      feedback.style.color = 'var(--clr-success)';

      const card = { front: correctAnswer, back: '' };
      game.addLearned(card.front, card.back, game.currentRegionKey, 15);
      this.updateXPDisplay();
      this.renderProgress();
      this.renderMap(); // Update map progress

      // Auto-advance to next question after correct answer
      setTimeout(() => {
        this.renderCallResponse();
      }, 2000);
    } else {
      input.style.borderColor = 'var(--clr-error)';
      feedback.innerHTML = `
        <div class="cr-feedback incorrect">
          <strong>Incorrecto</strong>
          <div class="correct-answer">
            Respuesta correcta: <strong>${correctAnswer}</strong>
          </div>
          <div class="feedback-details">
            Tu respuesta: "${userAnswer}"
            <br>
            Similitud: ${Math.round(validation.confidence * 100)}%
          </div>
          <div class="cr-controls">
            <button class="cr-try-again" onclick="ui.clearCRAnswer()">
              Intentar de nuevo
            </button>
            <button class="cr-continue" onclick="ui.renderCallResponse()">
              Continuar →
            </button>
          </div>
        </div>
      `;
      feedback.style.color = 'var(--clr-error)';

      // Disable the submit button and input after wrong answer
      const submitBtn = this.elements.panelBody.querySelector('.cr-submit');
      input.disabled = true;
      submitBtn.disabled = true;
    }
  }

  /**
   * Render progress bars
   */
  renderProgress() {
    this.elements.progressContainer.innerHTML = '';

    const regionsWithProgress = game.getAllRegionsWithProgress();

    Object.entries(regionsWithProgress).forEach(([regionKey, regionData]) => {
      const progress = regionData.progress;
      const percentage = Math.round(progress.percentage);

      const progressItem = document.createElement('div');
      progressItem.className = 'progress-item';
      progressItem.innerHTML = `
        <div class="progress-header">
          <span class="progress-title">${regionData.name}</span>
          <span class="progress-percentage">${progress.learned}/${progress.total}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${percentage}%"></div>
        </div>
      `;

      this.elements.progressContainer.appendChild(progressItem);
    });
  }

  /**
   * Initialize the UI
   */
  initialize() {
    this.updateXPDisplay();
    this.renderMap();
    this.renderProgress();
    this.renderPlaceholder();

    // Restore last active tab
    const lastTab = localStorage.getItem('currentTab') || 'map';
    this.switchTab(lastTab);
  }

  /**
   * Show settings modal
   */
  showSettings() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content settings-modal">
        <div class="modal-header">
          <h2>⚙️ Configuración</h2>
          <button class="modal-close" onclick="ui.closeSettings()">×</button>
        </div>
        <div class="modal-body">
          <div class="settings-section">
            <h3>🔊 Text-to-Speech</h3>
            <div class="setting-item">
              <label>
                <input type="checkbox" id="ttsAutoPlay" ${game.getSetting('ttsAutoPlay') ? 'checked' : ''}>
                Auto-reproducir español
              </label>
            </div>
            <div class="setting-item">
              <label>
                <input type="checkbox" id="ttsAutoPlayEnglish" ${game.getSetting('ttsAutoPlayEnglish') ? 'checked' : ''}>
                Auto-reproducir inglés
              </label>
            </div>
            <div class="setting-item">
              <label>Volumen: <input type="range" id="ttsVolume" min="0" max="1" step="0.1" value="${game.getSetting('ttsVolume')}"></label>
              <span id="ttsVolumeValue">${Math.round(game.getSetting('ttsVolume') * 100)}%</span>
            </div>
            <div class="setting-item">
              <label>Velocidad: <input type="range" id="ttsRate" min="0.5" max="2" step="0.1" value="${game.getSetting('ttsRate')}"></label>
              <span id="ttsRateValue">${game.getSetting('ttsRate')}x</span>
            </div>
            <div class="setting-item">
              <label>Tiempo de espera: <input type="range" id="ttsCooldown" min="1000" max="10000" step="500" value="${game.getSetting('ttsCooldown')}"></label>
              <span id="ttsCooldownValue">${game.getSetting('ttsCooldown') / 1000}s</span>
            </div>
          </div>
          
          <div class="settings-section">
            <h3>🎬 Animaciones</h3>
            <div class="setting-item">
              <label>
                <input type="checkbox" id="animationsEnabled" ${game.getSetting('animationsEnabled') ? 'checked' : ''}>
                Habilitar animaciones
              </label>
            </div>
            <div class="setting-item">
              <label>Velocidad de flip: <input type="range" id="flashcardFlipSpeed" min="0.3" max="2" step="0.1" value="${game.getSetting('flashcardFlipSpeed')}"></label>
              <span id="flashcardFlipSpeedValue">${game.getSetting('flashcardFlipSpeed')}s</span>
            </div>
          </div>
          
          <div class="settings-section">
            <h3>🎮 Juego</h3>
            <div class="setting-item">
              <label>
                <input type="checkbox" id="showProgressBars" ${game.getSetting('showProgressBars') ? 'checked' : ''}>
                Mostrar barras de progreso
              </label>
            </div>
            <div class="setting-item">
              <label>
                <input type="checkbox" id="showXP" ${game.getSetting('showXP') ? 'checked' : ''}>
                Mostrar XP
              </label>
            </div>
            <div class="setting-item">
              <label>
                <input type="checkbox" id="showCorrectAnswers" ${game.getSetting('showCorrectAnswers') ? 'checked' : ''}>
                Mostrar respuestas correctas
              </label>
            </div>
            <div class="setting-item">
              <label>
                <input type="checkbox" id="flexibleAnswerValidation" ${game.getSetting('flexibleAnswerValidation') ? 'checked' : ''}>
                Validación flexible de respuestas
              </label>
            </div>
          </div>
          
          <div class="settings-section">
            <h3>🎨 Interfaz</h3>
            <div class="setting-item">
              <label>Modo oscuro:
                <select id="darkMode">
                  <option value="auto" ${game.getSetting('darkMode') === 'auto' ? 'selected' : ''}>Automático</option>
                  <option value="light" ${game.getSetting('darkMode') === 'light' ? 'selected' : ''}>Claro</option>
                  <option value="dark" ${game.getSetting('darkMode') === 'dark' ? 'selected' : ''}>Oscuro</option>
                </select>
              </label>
            </div>
            <div class="setting-item">
              <label>
                <input type="checkbox" id="compactMode" ${game.getSetting('compactMode') ? 'checked' : ''}>
                Modo compacto
              </label>
            </div>
            <div class="setting-item">
              <label>
                <input type="checkbox" id="largeText" ${game.getSetting('largeText') ? 'checked' : ''}>
                Texto grande
              </label>
            </div>
          </div>
          
          <div class="settings-section">
            <h3>♿ Accesibilidad</h3>
            <div class="setting-item">
              <label>
                <input type="checkbox" id="highContrast" ${game.getSetting('highContrast') ? 'checked' : ''}>
                Alto contraste
              </label>
            </div>
            <div class="setting-item">
              <label>
                <input type="checkbox" id="reduceMotion" ${game.getSetting('reduceMotion') ? 'checked' : ''}>
                Reducir movimiento
              </label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn secondary" onclick="ui.resetSettings()">Restablecer</button>
          <button class="btn primary" onclick="ui.saveSettings()">Guardar</button>
        </div>
      </div>
    `;

    // Add event listeners for range inputs
    this.setupSettingsListeners();
  }

  /**
   * Setup settings modal event listeners
   */
  setupSettingsListeners() {
    // Volume range
    const volumeInput = document.getElementById('ttsVolume');
    const volumeValue = document.getElementById('ttsVolumeValue');
    if (volumeInput) {
      volumeInput.addEventListener('input', (e) => {
        volumeValue.textContent = Math.round(e.target.value * 100) + '%';
      });
    }

    // Rate range
    const rateInput = document.getElementById('ttsRate');
    const rateValue = document.getElementById('ttsRateValue');
    if (rateInput) {
      rateInput.addEventListener('input', (e) => {
        rateValue.textContent = e.target.value + 'x';
      });
    }

    // Cooldown range
    const cooldownInput = document.getElementById('ttsCooldown');
    const cooldownValue = document.getElementById('ttsCooldownValue');
    if (cooldownInput) {
      cooldownInput.addEventListener('input', (e) => {
        cooldownValue.textContent = (e.target.value / 1000) + 's';
      });
    }

    // Flip speed range
    const flipSpeedInput = document.getElementById('flashcardFlipSpeed');
    const flipSpeedValue = document.getElementById('flashcardFlipSpeedValue');
    if (flipSpeedInput) {
      flipSpeedInput.addEventListener('input', (e) => {
        flipSpeedValue.textContent = e.target.value + 's';
      });
    }
  }

  /**
   * Save settings from modal
   */
  saveSettings() {
    const settings = {};

    // TTS Settings
    settings.ttsAutoPlay = document.getElementById('ttsAutoPlay').checked;
    settings.ttsAutoPlayEnglish = document.getElementById('ttsAutoPlayEnglish').checked;
    settings.ttsVolume = parseFloat(document.getElementById('ttsVolume').value);
    settings.ttsRate = parseFloat(document.getElementById('ttsRate').value);
    settings.ttsCooldown = parseInt(document.getElementById('ttsCooldown').value);

    // Animation Settings
    settings.animationsEnabled = document.getElementById('animationsEnabled').checked;
    settings.flashcardFlipSpeed = parseFloat(document.getElementById('flashcardFlipSpeed').value);

    // Game Settings
    settings.showProgressBars = document.getElementById('showProgressBars').checked;
    settings.showXP = document.getElementById('showXP').checked;
    settings.showCorrectAnswers = document.getElementById('showCorrectAnswers').checked;
    settings.flexibleAnswerValidation = document.getElementById('flexibleAnswerValidation').checked;

    // UI Settings
    settings.darkMode = document.getElementById('darkMode').value;
    settings.compactMode = document.getElementById('compactMode').checked;
    settings.largeText = document.getElementById('largeText').checked;

    // Accessibility
    settings.highContrast = document.getElementById('highContrast').checked;
    settings.reduceMotion = document.getElementById('reduceMotion').checked;

    // Update game settings
    Object.entries(settings).forEach(([key, value]) => {
      game.updateSetting(key, value);
    });

    // Apply settings immediately
    this.applySettings();

    this.closeSettings();
  }

  /**
   * Reset settings to defaults
   */
  resetSettings() {
    game.resetSettings();
    this.applySettings();
    this.closeSettings();
  }

  /**
   * Close settings modal
   */
  closeSettings() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
      modal.remove();
    }
  }

  /**
   * Apply current settings to the UI
   */
  applySettings() {
    // Apply dark mode
    const darkMode = game.getSetting('darkMode');
    if (darkMode === 'auto') {
      setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    } else {
      setTheme(darkMode);
    }

    // Apply animations
    const animationsEnabled = game.getSetting('animationsEnabled');
    document.body.style.setProperty('--transition-speed', animationsEnabled ? game.getSetting('transitionSpeed') + 's' : '0s');

    // Apply compact mode
    const compactMode = game.getSetting('compactMode');
    document.body.classList.toggle('compact-mode', compactMode);

    // Apply large text
    const largeText = game.getSetting('largeText');
    document.body.classList.toggle('large-text', largeText);

    // Apply high contrast
    const highContrast = game.getSetting('highContrast');
    document.body.classList.toggle('high-contrast', highContrast);

    // Apply reduce motion
    const reduceMotion = game.getSetting('reduceMotion');
    document.body.classList.toggle('reduce-motion', reduceMotion);

    // Re-render UI elements that depend on settings
    this.renderMap();
    this.updateXPDisplay();
  }
}

// Create global UI instance
const ui = new LanguageGameUI();