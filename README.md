# Tenzies

A fun dice game built with React where the goal is to roll until all dice show the same value. Click on individual dice to "freeze" them between rolls.

## How to Play

1. Click **Roll** to roll all unfrozen dice
2. Click on a die to freeze/unfreeze it at its current value
3. Keep rolling until all 10 dice show the same number
4. Celebrate with confetti when you win! 🎉

## Technologies Used

- **React 19** - UI library with hooks (useState, useRef, useEffect)
- **Vite 7** - Fast build tool and dev server
- **nanoid** - Generating unique IDs for each die
- **react-confetti** - Celebration animation on game win
- **ESLint** - Code linting

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Features

- 10 interactive dice
- Hold/release dice between rolls
- Win detection when all dice match
- Confetti celebration on win
- Accessible with screen reader support

---

## About Scrimba

This project was built as part of learning React through [Scrimba](https://scrimba.com/?via=u42c5f8e) - an interactive learning platform for developers. Scrimba offers hands-on coding courses where you can pause videos and edit the code directly in the browser.
