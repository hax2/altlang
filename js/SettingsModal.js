
// SettingsModal.js
// Handles settings modal UI and logic

export default class SettingsModal {
  constructor(ui) {
    this.ui = ui;
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

    document.body.appendChild(modal);
    
    // Add event listeners for range inputs
    this.setupSettingsListeners();
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
    this.ui.applySettings();

    this.closeSettings();
  }

  resetSettings() {
    game.resetSettings();
    this.ui.applySettings();
    this.closeSettings();
  }

  closeSettings() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
      modal.remove();
    }
  }
}
