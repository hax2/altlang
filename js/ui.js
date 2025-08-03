// UI Components and Rendering - Consolidated Version

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

    // Initialize view state
    this.flashcardTipOverlay = null;

    this.currentTab = 'map';
    this.currentCardIndex = 0;
    this.currentCards = [];
    this.currentCard = null;
    this.popup = null;

    this.initializeEventListeners();
  }

  initializeEventListeners() {
    this.elements.flashcardBtn.addEventListener('click', () => this.switchMode('flashcard'));
    this.elements.quizBtn.addEventListener('click', () => this.switchMode('quiz'));
    this.elements.crBtn.addEventListener('click', () => this.switchMode('call-response'));

    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');
        this.switchTab(tabName);
      });
    });

    document.addEventListener('click', (e) => {
      if (this.popup && !this.popup.contains(e.target) && !e.target.classList.contains('clickable-word')) {
        this.hidePopup();
      }
    });
  }

  switchTab(tabName) {
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-tab') === tabName) {
        btn.classList.add('active');
      }
    });

    // Update tab panels
    const tabPanels = document.querySelectorAll('.tab-panel');
    tabPanels.forEach(panel => {
      panel.classList.remove('active');
    });

    const activePanel = document.getElementById(`${tabName}-tab`);
    if (activePanel) {
      activePanel.classList.add('active');
    }

    // Render content for the active tab
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

    this.currentTab = tabName;
    localStorage.setItem('currentTab', tabName);
  }

  renderCurrentMode() {
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

  renderFlashcards() {
    const flashcards = game.getCurrentFlashcards();
    if (flashcards.length === 0) {
      this.elements.panelBody.innerHTML = '<p class="text-center">No hay flashcards disponibles.</p>';
      return;
    }
    this.showFirstTimeFlashcardTip();
    this.currentCards = flashcards;
    this.currentCardIndex = 0;
    this.renderCurrentFlashcard();
  }

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
    this.currentCard = card;
    const hasEnhancedInfo = card.context || card.grammar || card.breakdown;
    this.elements.panelBody.innerHTML = `
      <div class="flashcard" onclick="ui.flipFlashcard()">
        <div class="flashcard-inner">
          <div class="flashcard-front">
            <button class="tts-btn" onclick="event.stopPropagation(); ui.speakCard('${card.front}')">🔊</button>
            <div class="flip-indicator">🔄</div>
            ${this.makeWordsClickable(card.front, card.breakdown)}
          </div>
          <div class="flashcard-back">
            <button class="tts-btn" onclick="event.stopPropagation(); ui.speakCard('${card.back}', 'en')">🔊</button>
            <div class="flip-indicator">🔄</div>
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
    this.addWordClickHandlers();
    if (game.getSetting('ttsAutoPlay')) {
      setTimeout(() => {
        this.speakCard(card.front);
      }, 500);
    }
  }

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
    this.currentCard = card;
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
    this.addQuizOptionHandlers();
  }

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
    this.currentCard = card;
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
    this.addWordClickHandlers();
  }

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
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn secondary" onclick="ui.resetSettings()">Restablecer</button>
          <button class="btn primary" onclick="ui.saveSettings()">Guardar</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.setupSettingsListeners();
  }

  saveSettings() {
    const settings = {};
    settings.ttsAutoPlay = document.getElementById('ttsAutoPlay').checked;
    settings.ttsAutoPlayEnglish = document.getElementById('ttsAutoPlayEnglish').checked;
    settings.ttsVolume = parseFloat(document.getElementById('ttsVolume').value);
    settings.ttsRate = parseFloat(document.getElementById('ttsRate').value);
    settings.animationsEnabled = document.getElementById('animationsEnabled').checked;
    settings.flashcardFlipSpeed = parseFloat(document.getElementById('flashcardFlipSpeed').value);
    settings.showProgressBars = document.getElementById('showProgressBars').checked;
    settings.showXP = document.getElementById('showXP').checked;

    Object.entries(settings).forEach(([key, value]) => {
      game.updateSetting(key, value);
    });

    this.applySettings();
    this.closeSettings();
  }

  resetSettings() {
    game.resetSettings();
    this.applySettings();
    this.closeSettings();
  }

  closeSettings() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
      modal.remove();
    }
  }

  // Missing methods that are called by components and main.js
  updateXPDisplay() {
    const levelInfo = game.getLevelInfo(); // Get the level info object
    if (this.elements.xpCounter) {
      // game.xp is correct, but we can use the formatted value from levelInfo
      this.elements.xpCounter.textContent = `${formatXP(levelInfo.xp)} XP`;
    }
    if (this.elements.levelLabel) {
      // Use levelInfo.level for the current level
      this.elements.levelLabel.textContent = `Lvl ${levelInfo.level}`;
    }
    if (this.elements.xpBar) {
      // Use the pre-calculated levelProgress percentage
      this.elements.xpBar.value = levelInfo.levelProgress;
      this.elements.xpBar.max = 100;
    }
  }

  speakCard(text, lang = 'es') {
    if (window.speakSpanish) {
      window.speakSpanish(text, lang);
    }
  }

  applySettings() {
    // Apply theme and other UI settings
    if (window.applyTheme) {
      window.applyTheme();
    }
    // Update UI based on settings
    this.updateXPDisplay();
  }

  getCurrentTab() {
    return this.currentTab;
  }

  switchMode(mode) {
    if (window.game) {
      game.setCurrentMode(mode);
      this.renderCurrentMode();
    }
  }

  // Flashcard methods
  flipFlashcard() {
    const flashcard = this.elements.panelBody.querySelector('.flashcard');
    if (flashcard) {
      flashcard.classList.toggle('flipped');
      setTimeout(() => {
        const card = this.currentCards[this.currentCardIndex];
        if (flashcard.classList.contains('flipped')) {
          if (game.getSetting('ttsAutoPlayEnglish')) {
            this.speakCard(card.back, 'en');
          }
        } else {
          if (game.getSetting('ttsAutoPlay')) {
            this.speakCard(card.front, 'es');
          }
        }
      }, game.getSetting('flashcardFlipSpeed') * 1000);
    }
  }

  previousFlashcard() {
    if (this.currentCardIndex > 0) {
      this.currentCardIndex--;
      this.renderCurrentFlashcard();
    }
  }

  nextFlashcard() {
    if (this.currentCardIndex < this.currentCards.length - 1) {
      this.currentCardIndex++;
      this.renderCurrentFlashcard();
    }
  }

  markAsLearned() {
    const card = this.currentCards[this.currentCardIndex];
    const wasNewlyLearned = game.addLearned(card.front, card.back, game.currentRegionKey, 10);
    if (wasNewlyLearned) {
      this.updateXPDisplay();
      this.renderProgress();
      this.renderMap();
    }
    this.nextFlashcard();
  }

  toggleFlashcardDetails() {
    const detailsCard = document.getElementById('detailsCard');
    if (detailsCard) {
      const isVisible = detailsCard.style.display !== 'none';
      detailsCard.style.display = isVisible ? 'none' : 'block';
      const detailsBtn = this.elements.panelBody.querySelector('.flashcard-btn[onclick*="toggleFlashcardDetails"]');
      if (detailsBtn) {
        detailsBtn.innerHTML = isVisible ? '📖 Detalles' : '📖 Ocultar';
      }
    }
  }

  hidePopup() {
    if (this.popup) {
      this.popup.remove();
      this.popup = null;
    }
  }

  // Map rendering
  renderMap() {
    this.elements.mapContainer.innerHTML = '';
    const regionsWithProgress = game.getAllRegionsWithProgress();
    // Group regions by category
    const groupedRegions = {};
    Object.entries(regionsWithProgress).forEach(([regionKey, regionData]) => {
      const category = regionData.category || 'Otros';
      if (!groupedRegions[category]) groupedRegions[category] = [];
      groupedRegions[category].push({ key: regionKey, data: regionData });
    });
    // Define category order and emojis
    const categoryOrder = ['Fundamentos', 'Situaciones', 'Conversación', 'Gramática'];
    const categoryEmojis = {
      'Fundamentos': '🌟',
      'Situaciones': '🎯',
      'Conversación': '💬',
      'Gramática': '📚'
    };
    // Render each category
    categoryOrder.forEach(category => {
      if (!groupedRegions[category]) return;
      const categorySection = document.createElement('div');
      categorySection.className = 'category-section';
      const categoryHeader = document.createElement('div');
      categoryHeader.className = 'category-header';
      categoryHeader.innerHTML = `<h3>${categoryEmojis[category]} ${category}</h3>`;
      const categoryGrid = document.createElement('div');
      categoryGrid.className = 'category-grid';
      groupedRegions[category].forEach(({ key: regionKey, data: regionData }) => {
        const regionCard = document.createElement('div');
        regionCard.className = 'region-card';
        regionCard.style.backgroundColor = regionData.color;
        regionCard.setAttribute('data-region', regionKey);
        const progress = regionData.progress;
        const percentage = Math.round(progress.percentage);
        regionCard.innerHTML = `
          <div class="region-content">
            <div class="region-emoji">${regionData.emoji}</div>
            <div class="region-info">
              <h4>${regionData.name}</h4>
              <div class="progress-info">
                ${progress.learned}/${progress.total} (${percentage}%)
              </div>
            </div>
          </div>
          <div class="region-progress-bar">
            <div class="region-progress-fill" style="width: ${percentage}%"></div>
          </div>
        `;
        regionCard.addEventListener('click', () => this.selectRegion(regionKey));
        categoryGrid.appendChild(regionCard);
      });
      categorySection.appendChild(categoryHeader);
      categorySection.appendChild(categoryGrid);
      this.elements.mapContainer.appendChild(categorySection);
    });
  }

  selectRegion(regionKey) {
    game.setCurrentRegion(regionKey);
    // Update map selection
    const regionCards = this.elements.mapContainer.querySelectorAll('.region-card');
    regionCards.forEach(card => card.classList.remove('selected'));
    const selectedCard = this.elements.mapContainer.querySelector(`[data-region="${regionKey}"]`);
    if (selectedCard) selectedCard.classList.add('selected');
    // Update panel title
    const region = REGIONS[regionKey];
    this.elements.panelTitle.textContent = region.name;
    // Switch to game tab and render current mode
    this.switchTab('game');
    this.renderCurrentMode();
  }

  renderPlaceholder() {
    if (this.elements.panelBody) {
      this.elements.panelBody.innerHTML = '<p class="placeholder-text">Elige una región del mapa para comenzar a aprender español.</p>';
    }
  }

  initialize() {
    // Initialize the UI - called by some test files
    this.updateXPDisplay();
    this.renderMap();

    // Set initial tab
    const savedTab = localStorage.getItem('currentTab') || 'map';
    this.switchTab(savedTab);
  }

  // Utility methods
  makeWordsClickable(text, breakdown = {}) {
    if (!breakdown || Object.keys(breakdown).length === 0) return text;
    let processedText = text;
    const replacements = new Map();
    let placeholderIndex = 0;
    
    // Handle multi-word phrases first
    const sortedKeys = Object.keys(breakdown).sort((a, b) => b.length - a.length);
    sortedKeys.forEach(phrase => {
      if (!phrase.includes(' ')) return;
      const explanation = breakdown[phrase];
      const escapedPhrase = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const prefix = /^\w/.test(phrase) ? '\\b' : '';
      const suffix = /\w$/.test(phrase) ? '\\b' : '';
      const regex = new RegExp(`${prefix}${escapedPhrase}${suffix}`, 'gi');
      processedText = processedText.replace(regex, (match) => {
        const placeholder = `__PLACEHOLDER_${placeholderIndex++}__`;
        const replacementHtml = `<span class="clickable-word multi-word-phrase" data-word="${match}" data-explanation="${explanation}">${match}</span>`;
        replacements.set(placeholder, replacementHtml);
        return placeholder;
      });
    });
    
    // Handle single words
    const tokens = processedText.split(/(\s+)/);
    const newTokens = tokens.map(token => {
      if (/^\s+$/.test(token) || token.startsWith('__PLACEHOLDER_')) return token;
      const cleanToken = token.replace(/[.,!?;:¿¡]+$/, '');
      const punctuation = token.substring(cleanToken.length);
      const explanation = breakdown[token] || breakdown[cleanToken];
      if (explanation) {
        const wordToWrap = breakdown[token] ? token : cleanToken;
        const remainingPunctuation = breakdown[token] ? '' : punctuation;
        const placeholder = `__PLACEHOLDER_${placeholderIndex++}__`;
        const replacementHtml = `<span class="clickable-word" data-word="${wordToWrap}" data-explanation="${explanation}">${wordToWrap}</span>${remainingPunctuation}`;
        replacements.set(placeholder, replacementHtml);
        return placeholder;
      }
      return token;
    });
    processedText = newTokens.join('');
    
    // Replace placeholders with HTML
    replacements.forEach((html, placeholder) => {
      processedText = processedText.replace(placeholder, html);
    });
    return processedText;
  }

  addWordClickHandlers() {
    const clickableWords = document.querySelectorAll('.clickable-word');
    clickableWords.forEach(word => {
      word.addEventListener('click', (e) => {
        e.stopPropagation();
        const wordText = word.dataset.word;
        const explanation = word.dataset.explanation;
        const isFront = e.target.closest('.flashcard-front');
        const lang = isFront ? 'es' : 'en';
        if (window.speakSpanish) {
          window.speakSpanish(wordText, lang);
        }
        this.showPopup(wordText, explanation, e);
      });
    });
  }

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

  checkQuizAnswer(userAnswer, correctAnswer) {
    const isCorrect = userAnswer === correctAnswer;
    const card = { front: correctAnswer, back: '' };
    const feedback = document.createElement('div');
    feedback.className = `quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    feedback.textContent = isCorrect ? '¡Correcto!' : `Incorrecto. La respuesta correcta es: ${correctAnswer}`;
    const quizOptions = this.elements.panelBody.querySelector('.quiz-options');
    quizOptions.appendChild(feedback);
    if (isCorrect) {
      game.addLearned(card.front, card.back, game.currentRegionKey, 15);
      this.updateXPDisplay();
      this.renderProgress();
      this.renderMap();
    }
    const options = this.elements.panelBody.querySelectorAll('.quiz-option');
    options.forEach(option => {
      option.style.pointerEvents = 'none';
      if (option.textContent.trim() === userAnswer) {
        option.classList.add(isCorrect ? 'correct' : 'incorrect');
      }
    });
    setTimeout(() => {
      this.renderQuiz();
    }, 2000);
  }

  checkCRAnswer(userAnswer, correctAnswer) {
    const validation = game.checkCRAnswer(userAnswer, { front: correctAnswer });
    const feedback = document.getElementById('crFeedback');
    const input = this.elements.panelBody.querySelector('.cr-input');
    if (validation.isCorrect) {
      input.style.borderColor = 'var(--clr-success)';
      const showCorrectAnswer = validation.confidence < 0.99;
      feedback.innerHTML = `
        <div class="cr-feedback correct">
          <strong>¡Correcto!</strong>
          ${showCorrectAnswer ? `<div class="correct-answer">Respuesta ideal: <strong>${correctAnswer}</strong></div>` : ''}
          <div class="feedback-details">
            ${validation.type === 'exact' ? 'Respuesta perfecta' :
          validation.type === 'partial' ? 'Respuesta parcial aceptada' :
            validation.type === 'fuzzy' ? `Respuesta aceptada (similitud: ${Math.round(validation.confidence * 100)}%)` :
              'Respuesta aceptada'}
          </div>
          ${showCorrectAnswer ? `<div class="feedback-details">Tu respuesta: "${userAnswer}"</div>` : ''}
        </div>
      `;
      feedback.style.color = 'var(--clr-success)';
      const card = { front: correctAnswer, back: '' };
      game.addLearned(card.front, card.back, game.currentRegionKey, 15);
      this.updateXPDisplay();
      this.renderProgress();
      this.renderMap();
      setTimeout(() => {
        this.renderCallResponse();
      }, 2000);
    } else {
      input.style.borderColor = 'var(--clr-error)';
      feedback.innerHTML = `
        <div class="cr-feedback incorrect">
          <strong>Incorrecto</strong>
          <div class="correct-answer">Respuesta correcta: <strong>${correctAnswer}</strong></div>
          <div class="feedback-details">Tu respuesta: "${userAnswer}"<br>Similitud: ${Math.round(validation.confidence * 100)}%</div>
          <div class="cr-controls">
            <button class="cr-try-again" onclick="ui.clearCRAnswer()">Intentar de nuevo</button>
            <button class="cr-continue" onclick="ui.renderCallResponse()">Continuar →</button>
          </div>
        </div>
      `;
      feedback.style.color = 'var(--clr-error)';
      const submitBtn = this.elements.panelBody.querySelector('.cr-submit');
      input.disabled = true;
      submitBtn.disabled = true;
    }
  }

  clearCRAnswer() {
    const input = this.elements.panelBody.querySelector('.cr-input');
    const submitBtn = this.elements.panelBody.querySelector('.cr-submit');
    const feedback = document.getElementById('crFeedback');
    input.value = '';
    input.disabled = false;
    input.style.borderColor = '';
    input.focus();
    submitBtn.disabled = false;
    feedback.innerHTML = '';
  }

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

  showFirstTimeFlashcardTip() {
    const hasSeenTip = localStorage.getItem('flashcardTipSeen');
    if (hasSeenTip) return;
    const tipOverlay = document.createElement('div');
    tipOverlay.className = 'modal-overlay';
    tipOverlay.innerHTML = `
      <div class="modal-content flashcard-tip-modal">
        <div class="modal-header">
          <h2>💡 Helpful Tip</h2>
          <button class="modal-close" onclick="ui.hideFlashcardTip()">×</button>
        </div>
        <div class="modal-body">
          <p>You can click on a word in a flashcard to see its meaning, clicking anywhere else within the flashcard flips it</p>
        </div>
        <div class="modal-footer">
          <button class="btn primary" onclick="ui.hideFlashcardTip()">Got it!</button>
        </div>
      </div>
    `;
    document.body.appendChild(tipOverlay);
    this.flashcardTipOverlay = tipOverlay;
    localStorage.setItem('flashcardTipSeen', 'true');
  }

  hideFlashcardTip() {
    if (this.flashcardTipOverlay) {
      this.flashcardTipOverlay.remove();
      this.flashcardTipOverlay = null;
    }
  }

  showPopup(word, explanation, event) {
    this.hidePopup();
    const popup = document.createElement('div');
    popup.className = 'word-popup';
    popup.innerHTML = `
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
    const rect = event.target.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    let top = rect.bottom + scrollTop + 5;
    let left = rect.left + scrollLeft;
    document.body.appendChild(popup);
    const popupRect = popup.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    if (left + popupRect.width > viewportWidth + scrollLeft) {
      left = viewportWidth + scrollLeft - popupRect.width - 10;
    }
    if (left < scrollLeft) {
      left = scrollLeft + 10;
    }
    if (top + popupRect.height > viewportHeight + scrollTop) {
      top = rect.top + scrollTop - popupRect.height - 5;
    }
    if (top < scrollTop) {
      top = scrollTop + 10;
    }
    popup.style.position = 'absolute';
    popup.style.top = `${top}px`;
    popup.style.left = `${left}px`;
    popup.addEventListener('click', (e) => {
      if (e.target.classList.contains('popup-close')) {
        this.hidePopup();
      }
    });
    this.popup = popup;
  }

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

    // Flip speed range
    const flipSpeedInput = document.getElementById('flashcardFlipSpeed');
    const flipSpeedValue = document.getElementById('flashcardFlipSpeedValue');
    if (flipSpeedInput) {
      flipSpeedInput.addEventListener('input', (e) => {
        flipSpeedValue.textContent = e.target.value + 's';
      });
    }
  }
}

const ui = new LanguageGameUI();

// We still need to expose `ui` globally for the inline `onclick` handlers in the HTML.
window.ui = ui;

// ===================== FIX =====================
// Add this line to make the `ui` instance available for other modules to import.
export default ui;
// ===============================================