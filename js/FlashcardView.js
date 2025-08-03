// FlashcardView.js
// Handles flashcard mode rendering and logic
import { makeWordsClickable, showPopup } from './uiUtils.js';

export default class FlashcardView {
  constructor(ui) {
    this.ui = ui;
    this.flashcardTipOverlay = null;
  }

  renderFlashcards() {
    const flashcards = game.getCurrentFlashcards();
    if (flashcards.length === 0) {
      this.ui.elements.panelBody.innerHTML = '<p class="text-center">No hay flashcards disponibles.</p>';
      return;
    }
    this.showFirstTimeFlashcardTip();
    this.ui.currentCards = flashcards;
    this.ui.currentCardIndex = 0;
    this.renderCurrentFlashcard();
  }

  renderCurrentFlashcard() {
    if (this.ui.currentCardIndex >= this.ui.currentCards.length) {
      this.ui.elements.panelBody.innerHTML = `
        <div class="text-center">
          <h3>¡Completado!</h3>
          <p>Has revisado todas las flashcards de esta región.</p>
          <button class="flashcard-btn primary" onclick="ui.flashcardView.renderFlashcards()">
            Empezar de nuevo
          </button>
        </div>
      `;
      return;
    }
    const card = this.ui.currentCards[this.ui.currentCardIndex];
    this.ui.currentCard = card;
    const hasEnhancedInfo = card.context || card.grammar || card.breakdown;
    this.ui.elements.panelBody.innerHTML = `
      <div class="flashcard" onclick="ui.flashcardView.flipFlashcard()">
        <div class="flashcard-inner">
          <div class="flashcard-front">
            <button class="tts-btn" onclick="event.stopPropagation(); ui.speakCard('${card.front}')">🔊</button>
            <div class="flip-indicator">🔄</div>
            ${makeWordsClickable(card.front, card.breakdown)}
          </div>
          <div class="flashcard-back">
            <button class="tts-btn" onclick="event.stopPropagation(); ui.speakCard('${card.back}', 'en')">🔊</button>
            <div class="flip-indicator">🔄</div>
            ${makeWordsClickable(card.back, card.breakdown)}
          </div>
        </div>
      </div>
      <div class="flashcard-controls">
        <button class="flashcard-btn secondary" onclick="ui.flashcardView.previousFlashcard()">
          ← Anterior
        </button>
        ${hasEnhancedInfo ? `
          <button class="flashcard-btn secondary" onclick="ui.flashcardView.toggleFlashcardDetails()">
            📖 Detalles
          </button>
        ` : ''}
        <button class="flashcard-btn primary" onclick="ui.flashcardView.markAsLearned()">
          ✓ Aprendido
        </button>
        <button class="flashcard-btn secondary" onclick="ui.flashcardView.nextFlashcard()">
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
        this.ui.speakCard(card.front);
      }, 500);
    }
  }

  flipFlashcard() {
    const flashcard = this.ui.elements.panelBody.querySelector('.flashcard');
    if (flashcard) {
      flashcard.classList.toggle('flipped');
      setTimeout(() => {
        const card = this.ui.currentCards[this.ui.currentCardIndex];
        if (flashcard.classList.contains('flipped')) {
          if (game.getSetting('ttsAutoPlayEnglish')) {
            this.ui.speakCard(card.back, 'en');
          }
        } else {
          if (game.getSetting('ttsAutoPlay')) {
            this.ui.speakCard(card.front, 'es');
          }
        }
      }, game.getSetting('flashcardFlipSpeed') * 1000);
    }
  }

  previousFlashcard() {
    if (this.ui.currentCardIndex > 0) {
      this.ui.currentCardIndex--;
      this.renderCurrentFlashcard();
    }
  }

  nextFlashcard() {
    if (this.ui.currentCardIndex < this.ui.currentCards.length - 1) {
      this.ui.currentCardIndex++;
      this.renderCurrentFlashcard();
    }
  }

  markAsLearned() {
    const card = this.ui.currentCards[this.ui.currentCardIndex];
    const wasNewlyLearned = game.addLearned(card.front, card.back, game.currentRegionKey, 10);
    if (wasNewlyLearned) {
      this.ui.updateXPDisplay();
      this.ui.progressView.renderProgress();
      this.ui.mapView.renderMap();
    }
    this.nextFlashcard();
  }

  toggleFlashcardDetails() {
    const detailsCard = document.getElementById('detailsCard');
    if (detailsCard) {
      const isVisible = detailsCard.style.display !== 'none';
      detailsCard.style.display = isVisible ? 'none' : 'block';
      const detailsBtn = this.ui.elements.panelBody.querySelector('.flashcard-btn[onclick*="toggleFlashcardDetails"]');
      if (detailsBtn) {
        detailsBtn.innerHTML = isVisible ? '📖 Detalles' : '📖 Ocultar';
      }
    }
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
          <button class="modal-close" onclick="ui.flashcardView.hideFlashcardTip()">×</button>
        </div>
        <div class="modal-body">
          <p>You can click on a word in a flashcard to see its meaning, clicking anywhere else within the flashcard flips it</p>
        </div>
        <div class="modal-footer">
          <button class="btn primary" onclick="ui.flashcardView.hideFlashcardTip()">Got it!</button>
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

  addWordClickHandlers() {
    const clickableWords = document.querySelectorAll('.clickable-word');
    clickableWords.forEach(word => {
      word.addEventListener('click', (e) => {
        e.stopPropagation();
        const wordText = word.dataset.word;
        const explanation = word.dataset.explanation;
        const isFront = e.target.closest('.flashcard-front');
        const lang = isFront ? 'es' : 'en';
        speakSpanish(wordText, lang);
        showPopup(wordText, explanation, e);
      });
    });
  }
}
