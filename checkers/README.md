## Checkers (Draughts) – Vanilla JavaScript

A browser-based implementation of the classic **Checkers** game built using **HTML, CSS, and vanilla JavaScript**, featuring full game rules, move validation, forced captures, multi-jumps, and visual move highlighting.

---

## 🎮 Features

* 8×8 Checkers board
* Two-player (local) gameplay
* Legal move validation
* **Forced capture rule**
* **Multi-jump enforcement**
* King promotion with visual feedback
* Turn indication
* Game-over detection
* Visual highlighting of:

  * Legal moves
  * Mandatory jumps
  * Attackable opponent pieces

---

## 🧠 Game Rules Implemented

* Diagonal movement only
* Forward movement for regular pieces
* Backward movement for kings
* Mandatory jumps when available
* Multiple jumps required when possible
* Promotion to king upon reaching the far row
* Game ends when a player has no legal moves or no pieces

---

## 🛠️ Technologies Used

* HTML5
* CSS3
* JavaScript (ES6)
* DOM manipulation (no frameworks)

---

## 🧩 Project Structure

```text
checkers/
├── index.html
├── styles.css
└── script.js
```

---

## 🧪 Internal Design Notes

* The game uses a **2D array (`boardState`)** as the source of truth for piece positions.
* DOM elements reflect the board state rather than defining it.
* Move logic, jump detection, and win conditions are handled through pure helper functions.
* Visual feedback is layered on top of game logic to keep rules and UI concerns separate.

---

## 🚀 How to Run

1. Clone or download the project
2. Open `index.html` in a modern browser
3. Click a piece to see legal moves
4. Click a highlighted square to move

No build tools or dependencies required.

---

## 🔮 Possible Improvements

* Refactoring the code
* AI opponent
* Move animations
* Undo / replay support
* Online multiplayer
* Unit tests for move validation logic

---

## 📌 Author Notes

This project focuses on **game logic correctness and state management** rather than external libraries. It serves as a foundation for exploring AI, testing, and refactoring into a more modular architecture.

---