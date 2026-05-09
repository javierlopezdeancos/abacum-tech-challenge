# Abacum test code challenge - Tic Tac Toe

React implementation of a **human vs CPU** tic-tac-toe game.

[![Netlify Status](https://api.netlify.com/api/v1/badges/1c1af3a8-9a7d-4ce3-8ddc-389a4e0417c5/deploy-status)](https://app.netlify.com/projects/abacum/deploys)

**Demo**: [https://abacum.netlify.app](https://abacum.netlify.app)

---

## Stack

- **React** & **Vite**
- **[@hiseb/confetti](https://confettijs.org/)** — win celebration effect

---

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`    | Start dev server (HMR)   |
| `npm run build`  | Production build         |
| `npm run preview`| Preview production build |
| `npm run lint`   | Run ESLint               |

---

## Challenge requirements (reference)

The solution must satisfy the challenge checks where applicable:

- Comment containing **`__define-ocg__`**
- A variable named **`varOcg`**
- A variable named **`varFiltersCg`** (used in reset logic)

---

## Game rules

1. **You** play **X** — click an empty square on your turn.
2. The **computer** plays **O** after a short delay.
3. Turns alternate until someone wins or the board is full (**draw**).
4. When there is a **winner** or **draw**, a message is shown at the top.
5. **Reset** clears the board and starts a new game.
6. You **cannot** overwrite the opponent’s marks or move out of turn.

### Bonus (implemented)

The CPU uses a simple **smart** strategy (win if possible, block you, prefer center, then random empty square) instead of purely random moves.

---

## Project layout

```text
abacum/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx      # App entry
│   ├── App.jsx       # Game UI & logic
│   ├── App.css
│   └── index.css
└── public/
```

---

## ESLint

This project uses ESLint with React Hooks and Vite refresh rules for `*.js` / `*.jsx` files.
