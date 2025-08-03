// MapView.js
// Handles rendering and interaction for the map view

export default class MapView {
  constructor(ui) {
    this.ui = ui;
  }

  renderMap() {
    this.ui.elements.mapContainer.innerHTML = '';
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
      this.ui.elements.mapContainer.appendChild(categorySection);
    });
  }

  selectRegion(regionKey) {
    game.setCurrentRegion(regionKey);
    // Update map selection
    const regionCards = this.ui.elements.mapContainer.querySelectorAll('.region-card');
    regionCards.forEach(card => card.classList.remove('selected'));
    const selectedCard = this.ui.elements.mapContainer.querySelector(`[data-region="${regionKey}"]`);
    if (selectedCard) selectedCard.classList.add('selected');
    // Update panel title
    const region = REGIONS[regionKey];
    this.ui.elements.panelTitle.textContent = region.name;
    // Switch to game tab and render current mode
    this.ui.switchTab('game');
    this.ui.renderCurrentMode();
  }
}
