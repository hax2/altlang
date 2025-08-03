
// ProgressView.js
// Handles rendering of progress bars

export default class ProgressView {
  constructor(ui) {
    this.ui = ui;
  }

  renderProgress() {
    this.ui.elements.progressContainer.innerHTML = '';

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

      this.ui.elements.progressContainer.appendChild(progressItem);
    });
  }
}
