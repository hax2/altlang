// uiUtils.js
// Utility functions for UI (e.g., makeWordsClickable, popup logic)

export function makeWordsClickable(text, breakdown = {}) {
  if (!breakdown || Object.keys(breakdown).length === 0) return text;
  let processedText = text;
  const replacements = new Map();
  let placeholderIndex = 0;
  // 1. First Pass: Handle multi-word phrases (longest first to handle overlaps)
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
  // 2. Second Pass: Handle single words.
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
  // 3. Final Pass: Replace all placeholders with their final HTML
  replacements.forEach((html, placeholder) => {
    processedText = processedText.replace(placeholder, html);
  });
  return processedText;
}

export function showPopup(word, explanation, event) {
  // Hide existing popup
  if (window.ui && window.ui.popup) window.ui.hidePopup();
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
      if (window.ui) window.ui.hidePopup();
      popup.remove();
    }
  });
  if (window.ui) window.ui.popup = popup;
}

export function hidePopup() {
  if (window.ui && window.ui.popup) {
    window.ui.popup.remove();
    window.ui.popup = null;
  }
}
