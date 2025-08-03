// Simple UI without modules - for debugging

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

    this.currentTab = 'map';
    this.currentCardIndex = 0;
    this.currentCards = [];
    this.currentCard = null;
    this.popup = null;
    this.flashcardTipOverlay = null;

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
    
    this.elements.panelBody.innerHTML = `
      <div class="flashcard" onclick="ui.flipFlashcard()">
        <div class="flashcard-inner">
          <div class="flashcard-front">
            <button class="tts-btn" onclick="event.stopPropagation(); ui.speakCard('${card.front}')">🔊</button>
            <div class="flip-indicator">🔄</div>
            ${card.front}
          </div>
          <div class="flashcard-back">
            <button class="tts-btn" onclick="event.stopPropagation(); ui.speakCard('${card.back}', 'en')">🔊</button>
            <div class="flip-indicator">🔄</div>
            ${card.back}
          </div>
        </div>
      </div>
      <div class="flashcard-controls">
        <button class="flashcard-btn secondary" onclick="ui.previousFlashcard()">
          ← Anterior
        </button>
        <button class="flashcard-btn primary" onclick="ui.markAsLearned()">
          ✓ Aprendido
        </button>
        <button class="flashcard-btn secondary" onclick="ui.nextFlashcard()">
          Siguiente →
        </button>
      </div>
    `;
  }

  flipFlashcard() {
    const flashcard = this.elements.panelBody.querySelector('.flashcard');
    if (flashcard) {
      flashcard.classList.toggle('flipped');
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

  renderQuiz() {
    this.elements.panelBody.innerHTML = '<p>Quiz mode - coming soon!</p>';
  }

  renderCallResponse() {
    this.elements.panelBody.innerHTML = '<p>Call & Response mode - coming soon!</p>';
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

  updateXPDisplay() {
    const levelInfo = game.getLevelInfo();
    if (this.elements.xpCounter) {
      this.elements.xpCounter.textContent = `${formatXP(levelInfo.xp)} XP`;
    }
    if (this.elements.levelLabel) {
      this.elements.levelLabel.textContent = `Lvl ${levelInfo.level}`;
    }
    if (this.elements.xpBar) {
      this.elements.xpBar.value = levelInfo.levelProgress;
      this.elements.xpBar.max = 100;
    }
  }

  speakCard(text, lang = 'es') {
    if (window.speakSpanish) {
      window.speakSpanish(text, lang);
    }
  }

  switchMode(mode) {
    if (window.game) {
      game.setCurrentMode(mode);
      this.renderCurrentMode();
    }
  }

  hidePopup() {
    if (this.popup) {
      this.popup.remove();
      this.popup = null;
    }
  }

  initialize() {
    this.updateXPDisplay();
    this.renderMap();

    // Set initial tab
    const savedTab = localStorage.getItem('currentTab') || 'map';
    this.switchTab(savedTab);
  }

  showSettings() {
    alert('Settings modal - coming soon!');
  }
}

// Create and expose UI globally
const ui = new LanguageGameUI();
window.ui = ui;