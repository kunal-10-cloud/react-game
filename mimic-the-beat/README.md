# Mimic the Beat

A rhythm game built with React where players listen to and repeat sequences of beats using their keyboard.

## Game Features

- 🎮 Visually appealing rhythm game with glowing beat indicators
- 🎵 Different sound packs (piano, drums, electronic)
- 🔥 Fever Mode - get a 5+ combo to earn double points!
- 📈 Dynamic difficulty scaling - sequences get longer and faster as you progress
- 🌟 Visual feedback and animations for correct and incorrect inputs
- 📱 Responsive design that works on mobile and desktop

## How to Play

1. Watch and listen to the sequence of beats (A, S, D, F keys)
2. Repeat the sequence by pressing the corresponding keys
3. If you make a mistake, you lose a life (you have 3 lives)
4. As you progress, sequences become longer and faster
5. Aim for a high score and try to reach the highest level!

## Controls

- **A, S, D, F keys**: Press these keys to match the beat sequence
- **ESC key**: Exit the current game
- You can also click/tap the on-screen buttons

## Development

### Tech Stack

- React (Hooks for state management)
- Web Audio API for sound synthesis
- CSS animations for visual effects

### Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Future Enhancements

- Additional sound packs
- Customizable difficulty levels
- Global high score leaderboard
- More visual effects and animations
- Custom sequence creator

---

Created by [Your Name] - Enjoy the game!

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
