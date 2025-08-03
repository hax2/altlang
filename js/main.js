// Main Application Entry Point

/**
 * Initialize the application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize UI
  ui.initialize();
  
  // Apply settings on startup
  ui.applySettings();
  
  // Initialize theme
  initializeTheme();
  initializeDarkModeToggle();
  
  // Add settings button event listener
  const settingsBtn = document.getElementById('settingsBtn');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      ui.showSettings();
    });
  }
  
  // Debug commands
  window.debugGame = {
    addXP: (amount) => {
      game.addXP(amount);
      ui.updateXPDisplay();
      ui.renderMap();
    },
    resetProgress: () => {
      game.resetProgress();
      ui.renderMap();
      ui.renderPlaceholder();
    },
    exportData: () => {
      const data = game.exportGameData();
      console.log('Game Data:', data);
      return data;
    },
    toggleTheme: () => {
      toggleTheme();
    },
    switchTab: (tabName) => {
      ui.switchTab(tabName);
    }
  };
  
  // Visibility change handling
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      ui.renderMap();
    }
  });
  
  // Before unload handling
  window.addEventListener('beforeunload', () => {
    game.saveGameState();
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + D for dark mode
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
      e.preventDefault();
      toggleTheme();
    }
    
    // Ctrl/Cmd + , for settings
    if ((e.ctrlKey || e.metaKey) && e.key === ',') {
      e.preventDefault();
      ui.showSettings();
    }
    
    // Tab switching shortcuts
    if (e.altKey) {
      switch(e.key) {
        case '1':
          e.preventDefault();
          ui.switchTab('map');
          break;
        case '2':
          e.preventDefault();
          ui.switchTab('game');
          break;
        case '3':
          e.preventDefault();
          ui.switchTab('progress');
          break;
      }
    }
  });
  
  // Service Worker registration
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  }
  
  // Performance monitoring
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
      }, 0);
    });
  }
  
  // Error handling
  window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
  });
  
  console.log('🚀 Language Map Quest initialized successfully!');
  console.log('💡 Debug commands available: debugGame.addXP(100), debugGame.resetProgress(), debugGame.exportData(), debugGame.switchTab("map")');
  console.log('⌨️ Keyboard shortcuts: Alt+1 (Map), Alt+2 (Game), Alt+3 (Progress), Ctrl/Cmd+D (Dark Mode), Ctrl/Cmd+, (Settings)');
});

/**
 * Initialize dark mode toggle functionality
 */
function initializeDarkModeToggle() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      const newTheme = toggleTheme();
      console.log('Theme switched to:', newTheme);
    });
  }
}

/**
 * Handle page visibility changes to save state
 */
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    game.saveGameState();
  }
});

/**
 * Handle beforeunload to save state
 */
window.addEventListener('beforeunload', function() {
  game.saveGameState();
});

/**
 * Add keyboard shortcuts
 */
document.addEventListener('keydown', function(event) {
  // Only handle shortcuts when not typing in an input
  if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
    return;
  }
  
  switch(event.key) {
    case '1':
      if (ui.getCurrentTab() === 'game') {
        ui.switchMode('flashcard');
      }
      break;
    case '2':
      if (ui.getCurrentTab() === 'game') {
        ui.switchMode('quiz');
      }
      break;
    case '3':
      if (ui.getCurrentTab() === 'game') {
        ui.switchMode('call-response');
      }
      break;
    case ' ':
      // Space to flip flashcard
      if (ui.getCurrentTab() === 'game' && game.currentMode === 'flashcard') {
        ui.flipFlashcard();
      }
      event.preventDefault();
      break;
    case 'ArrowLeft':
      if (ui.getCurrentTab() === 'game' && game.currentMode === 'flashcard') {
        ui.previousFlashcard();
      }
      break;
    case 'ArrowRight':
      if (ui.getCurrentTab() === 'game' && game.currentMode === 'flashcard') {
        ui.nextFlashcard();
      }
      break;
    case 'd':
    case 'D':
      // Toggle dark mode with 'd' key
      if (event.ctrlKey || event.metaKey) {
        toggleTheme();
        event.preventDefault();
      }
      break;
  }
});

/**
 * Add service worker for offline support (if supported)
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        console.log('ServiceWorker registration successful');
      })
      .catch(function(err) {
        console.log('ServiceWorker registration failed');
      });
  });
}

/**
 * Add performance monitoring
 */
window.addEventListener('load', function() {
  // Log performance metrics
  if ('performance' in window) {
    const perfData = performance.getEntriesByType('navigation')[0];
    console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
  }
});

/**
 * Add error handling
 */
window.addEventListener('error', function(event) {
  console.error('Application Error:', event.error);
});

/**
 * Add unhandled promise rejection handling
 */
window.addEventListener('unhandledrejection', function(event) {
  console.error('Unhandled Promise Rejection:', event.reason);
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { game, ui };
} 