# Language Map Quest - Spanish Learning Game

A modern, interactive Spanish learning application built with vanilla JavaScript, HTML, and CSS. Learn Spanish vocabulary through flashcards, quizzes, and call & response exercises organized by thematic regions.

## 🌟 Features

### Learning Modes
- **📚 Flashcards**: Interactive flip cards with text-to-speech
- **❓ Quiz**: Multiple choice questions to test your knowledge
- **💬 Call & Response**: Type Spanish translations with smart answer validation

### Thematic Regions
- **Básicos**: Essential everyday phrases
- **Saludos**: Greetings and introductions
- **Viaje**: Travel and transportation
- **Comida**: Food and dining vocabulary
- **Emergencias**: Emergency and safety phrases
- **Compras**: Shopping and commerce
- **Salud**: Health and medical vocabulary
- **Negocios**: Business and professional vocabulary

### Progress Tracking
- XP system with points for each learned item
- Progress bars for each region
- Persistent learning state (saves to localStorage)
- Overall progress statistics

### Interactive Features
- Text-to-speech for pronunciation
- Smart answer validation with fuzzy matching
- Responsive design for all devices
- Keyboard shortcuts for quick navigation
- Smooth animations and transitions

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software required!

### Installation
1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start learning Spanish!

### Development Setup
If you want to modify or extend the application:

```bash
# Clone the repository
git clone <repository-url>
cd language-map-quest

# Open in your preferred code editor
code .  # VS Code
# or
subl .  # Sublime Text
```

## 📁 Project Structure

```
language-map-quest/
├── index.html              # Main HTML file
├── styles/
│   ├── main.css           # Base styles and layout
│   └── components.css     # Component-specific styles
├── js/
│   ├── data.js           # Spanish vocabulary data
│   ├── utils.js          # Utility functions
│   ├── game.js           # Game logic and state management
│   ├── ui.js             # UI components and rendering
│   └── main.js           # Application initialization
└── README.md             # This file
```

## 🎮 How to Use

### Getting Started
1. **Select a Region**: Click on any colored region card on the left
2. **Choose a Mode**: Use the mode buttons (Flashcards, Quiz, Call & Response)
3. **Start Learning**: Follow the on-screen instructions for each mode

### Learning Modes

#### Flashcards Mode
- Click the card to flip between Spanish and English
- Click the 🔊 button to hear pronunciation
- Use navigation buttons or arrow keys to move between cards
- Mark cards as "Learned" to gain XP

#### Quiz Mode
- Read the English phrase
- Click the correct Spanish translation
- Get immediate feedback and XP for correct answers

#### Call & Response Mode
- Read or listen to the English phrase
- Type the Spanish translation
- Smart validation accepts close matches and partial answers

### Keyboard Shortcuts
- `1`: Switch to Flashcards mode
- `2`: Switch to Quiz mode
- `3`: Switch to Call & Response mode
- `Space`: Flip flashcard (in Flashcards mode)
- `←/→`: Navigate between flashcards

## 🛠️ Technical Details

### Architecture
- **Modular Design**: Separated concerns with dedicated files for data, logic, UI, and utilities
- **Object-Oriented**: Uses classes for game state and UI management
- **Event-Driven**: Responsive UI with event listeners and callbacks

### Data Management
- **Local Storage**: Saves progress automatically
- **State Management**: Centralized game state with the `LanguageGame` class
- **Data Structure**: Organized vocabulary by regions with metadata

### Performance Features
- **Lazy Loading**: Components render on demand
- **Efficient DOM Updates**: Minimal re-rendering
- **Memory Management**: Proper cleanup and state persistence

### Browser Compatibility
- Modern browsers with ES6+ support
- Responsive design for mobile and desktop
- Progressive Web App features (service worker ready)

## 🎯 Learning Features

### Smart Answer Validation
- **Fuzzy Matching**: Uses Levenshtein distance for typo tolerance
- **Normalization**: Removes accents and special characters for comparison
- **Partial Matching**: Accepts partial answers and synonyms

### Progress Tracking
- **XP System**: Gain points for each learned item
- **Regional Progress**: Track completion for each vocabulary region
- **Overall Statistics**: View total progress across all regions

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Friendly**: Proper ARIA labels and semantic HTML
- **High Contrast**: Clear visual feedback for all interactions

## 🔧 Customization

### Adding New Vocabulary
Edit `js/data.js` to add new regions or vocabulary:

```javascript
const REGIONS = {
  newRegion: {
    name: 'New Region',
    color: '#FF6B6B',
    description: 'Description of the region',
    flashcards: [
      { front: 'Spanish phrase', back: 'English translation' },
      // ... more cards
    ]
  }
};
```

### Styling Customization
Modify CSS variables in `styles/main.css`:

```css
:root {
  --clr-primary: #your-color;
  --clr-secondary: #your-secondary-color;
  /* ... other variables */
}
```

### Adding New Learning Modes
1. Add mode logic to `js/game.js`
2. Add UI rendering to `js/ui.js`
3. Update mode switching in the UI class

## 🐛 Debugging

### Console Commands
Open browser console for debugging commands:

```javascript
// Reset all progress
debugGame.resetProgress();

// Export game data
debugGame.exportData();

// Get statistics
debugGame.getStats();
```

### Common Issues
- **Progress not saving**: Check localStorage permissions
- **Audio not working**: Ensure browser supports speech synthesis
- **Styling issues**: Check CSS variable compatibility

## 📈 Future Enhancements

### Planned Features
- [ ] Audio pronunciation for all phrases
- [ ] Spaced repetition algorithm
- [ ] Multiple language support
- [ ] Offline mode with service worker
- [ ] Social features (leaderboards, sharing)
- [ ] Advanced statistics and analytics
- [ ] Custom vocabulary import/export

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Spanish vocabulary curated for practical learning
- Built with modern web standards
- Inspired by gamified language learning apps
- Community feedback and suggestions welcome!

---

**Happy Learning! ¡Feliz aprendizaje!** 🎓 