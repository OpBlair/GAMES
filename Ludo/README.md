## 🎲 Ludo – Browser-Based Board Game (Work in Progress)

A browser-based implementation of the **Ludo** board game using **HTML, CSS, and vanilla JavaScript**, currently focused on board rendering, token placement, and dice mechanics.

---

## 🎯 Current Features

* 15×15 Ludo board (225 squares)
* Accurate base zones for all four players:

  * Red
  * Green
  * Yellow
  * Blue
* Home path highlighting
* Token placement in player bases
* Dice roll (1–6) with click interaction
* Responsive, grid-based board layout

---

## 🧠 Game Design Approach

* Board is represented using indexed squares (0–224)
* Color zones and paths are mapped using predefined index arrays
* Tokens are rendered dynamically onto the board
* Dice logic is isolated and reusable

---

## 🛠️ Technologies Used

* HTML5
* CSS Grid
* JavaScript (ES6)
* DOM manipulation

---

## 🧩 Project Structure

```text
ludo/
├── ludo.html
├── ludo.css
└── ludo.js
```

---

## 🚧 Work in Progress / Planned Features

* Centralized game state (single source of truth)
* Turn-based gameplay
* Token movement rules:

  * Exit base on rolling 6
  * Forward movement along paths
  * Safe squares
  * Capturing opponent tokens
  * Extra turns on rolling 6
* Win condition (all tokens home)
* Local multiplayer
* Refactoring the Logic
* Optional AI players

---

## 🧪 Future Technical Improvements

* Separate game logic from DOM rendering
* Introduce pure rule functions for movement and captures
* Add unit tests for dice and movement rules
* Prepare architecture for online multiplayer

---

## 🚀 How to Run

1. Clone or download the project
2. Open `ludo.html` in a modern browser
3. Click the dice to roll

(No installation or build steps required)

---

## 📌 Author Notes

This project is intentionally built **incrementally**, starting with board modeling and visuals before introducing complex game rules. The goal is to create a clean, extensible foundation for a full-featured Ludo game.

---
