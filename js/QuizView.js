// QuizView.js
// Handles quiz mode rendering and logic

export default class QuizView {
  constructor(ui) {
    this.ui = ui;
  }

  renderQuiz() {
    const card = game.getNextQuizCard();
    if (!card) {
      this.ui.elements.panelBody.innerHTML = `
        <div class="text-center">
          <h3>¡Quiz completado!</h3>
          <p>Has completado todas las preguntas de esta región.</p>
          <button class="flashcard-btn primary" onclick="game.resetQuiz(); ui.quizView.renderQuiz()">
            Empezar de nuevo
          </button>
        </div>
      `;
      return;
    }
    this.ui.currentCard = card;
    const options = game.getQuizOptions(card);
    this.ui.elements.panelBody.innerHTML = `
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
    const quizOptions = this.ui.elements.panelBody.querySelector('.quiz-options');
    quizOptions.appendChild(feedback);
    if (isCorrect) {
      game.addLearned(card.front, card.back, game.currentRegionKey, 15);
      this.ui.updateXPDisplay();
      this.ui.progressView.renderProgress();
      this.ui.mapView.renderMap();
    }
    const options = this.ui.elements.panelBody.querySelectorAll('.quiz-option');
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
}
