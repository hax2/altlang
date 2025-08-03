// CallResponseView.js
// Handles call & response mode rendering and logic
import { makeWordsClickable, showPopup } from './uiUtils.js';

export default class CallResponseView {
  constructor(ui) {
    this.ui = ui;
  }

  renderCallResponse() {
    const card = game.getNextCRCard();
    if (!card) {
      this.ui.elements.panelBody.innerHTML = `
        <div class="text-center">
          <h3>¡Call & Response completado!</h3>
          <p>Has completado todas las preguntas de esta región.</p>
          <button class="flashcard-btn primary" onclick="game.resetCR(); ui.callResponseView.renderCallResponse()">
            Empezar de nuevo
          </button>
        </div>
      `;
      return;
    }
    this.ui.currentCard = card;
    this.ui.elements.panelBody.innerHTML = `
      <div class="cr-prompt">
        <button class="tts-btn" onclick="speakSpanish('${card.back}')">🔊</button>
        ${makeWordsClickable(card.back, card.breakdown)}
      </div>
      <input type="text" class="cr-input" placeholder="Escribe la respuesta en español" 
             onkeypress="if(event.key === 'Enter') ui.callResponseView.checkCRAnswer(this.value, '${card.front}')">
      <button class="cr-submit" onclick="ui.callResponseView.checkCRAnswer(this.previousElementSibling.value, '${card.front}')">
        Comprobar
      </button>
      <div id="crFeedback" style="margin-top: 0.6rem; text-align: center;"></div>
    `;
    this.addWordClickHandlers();
  }

  addWordClickHandlers() {
    const clickableWords = document.querySelectorAll('.clickable-word');
    clickableWords.forEach(word => {
      word.addEventListener('click', (e) => {
        e.stopPropagation();
        const wordText = word.dataset.word;
        const explanation = word.dataset.explanation;
        speakSpanish(wordText, 'es');
        showPopup(wordText, explanation, e);
      });
    });
  }

  checkCRAnswer(userAnswer, correctAnswer) {
    const validation = game.checkCRAnswer(userAnswer, { front: correctAnswer });
    const feedback = document.getElementById('crFeedback');
    const input = this.ui.elements.panelBody.querySelector('.cr-input');
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
      this.ui.updateXPDisplay();
      this.ui.progressView.renderProgress();
      this.ui.mapView.renderMap();
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
            <button class="cr-try-again" onclick="ui.callResponseView.clearCRAnswer()">Intentar de nuevo</button>
            <button class="cr-continue" onclick="ui.callResponseView.renderCallResponse()">Continuar →</button>
          </div>
        </div>
      `;
      feedback.style.color = 'var(--clr-error)';
      const submitBtn = this.ui.elements.panelBody.querySelector('.cr-submit');
      input.disabled = true;
      submitBtn.disabled = true;
    }
  }

  clearCRAnswer() {
    const input = this.ui.elements.panelBody.querySelector('.cr-input');
    const submitBtn = this.ui.elements.panelBody.querySelector('.cr-submit');
    const feedback = document.getElementById('crFeedback');
    input.value = '';
    input.disabled = false;
    input.style.borderColor = '';
    input.focus();
    submitBtn.disabled = false;
    feedback.innerHTML = '';
  }
}
