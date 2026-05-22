# 📄 README — Snake & Ladder (Custom Engine)

## 🎮 Overview

This project is a browser-based **Snake & Ladder game engine built with vanilla JavaScript, HTML, and CSS**.

It uses a **lightweight object-oriented architecture** to manage:

* Board generation
* Dice system
* Player movement
* Snakes & ladders logic
* Turn-based gameplay

No frameworks, no libraries — pure DOM + SVG rendering.

---

# 🧱 Tech Stack

* HTML5 (UI structure)
* CSS3 (grid board + animations)
* JavaScript (game engine logic)
* SVG (snakes, ladders overlay rendering)

---

# 🧠 Architecture

The system is split into 4 core modules:

## 1. `Board`

Responsible for:

* Generating 10×10 grid (100 squares)
* Creating square elements dynamically
* Calculating square positions
* Rendering:

  * ladders (SVG lines)
  * snakes (SVG Bézier curves + head)

---

## 2. `Dice`

Responsible for:

* Random number generation (1–6)
* Dice UI rendering (dot pattern system)
* Roll animation state (`rolling`)
* Sound effect trigger (roll.mp3)

---

## 3. `Player`

Responsible for:

* Pawn creation
* Base → board entry logic
* Step-by-step movement animation
* Position tracking (`currentSquare`)
* Basic DOM-based state

---

## 4. `GameState`

Responsible for:

* Turn management
* Dice control flow
* Player sequencing
* Game flow coordination

---

# ✅ What is already implemented

## 🎲 Core Gameplay

* [x] Dice roll system (1–6 random)
* [x] Turn-based system (multi-player support)
* [x] Roll restriction (canRoll lock)
* [x] Roll animation + UI feedback

---

## 🧍 Player System

* [x] Player creation (dynamic colors)
* [x] Player lobby (base area)
* [x] Move from base → board (on rolling 6)
* [x] Step-by-step movement animation

---

## 🧩 Board System

* [x] 10×10 grid generation (100 squares)
* [x] Alternating row numbering layout
* [x] Square indexing system (`data-index`)
* [x] SVG overlay layer setup

---

## 🐍 Snakes & Ladders

* [x] Ladder rendering (rails + steps)
* [x] Snake rendering (Bezier curve)
* [x] Snake head + eyes + tongue graphics
* [x] Visual-only placement (no gameplay effect yet)

---

## 🎨 UI / UX

* [x] Dice UI (3×3 dot system)
* [x] Rolling animation
* [x] Pawn hopping animation
* [x] Responsive board scaling
* [x] Player lobby UI

---

# 🚧 What is NOT yet implemented (important)

## ⚠️ Game Rules Engine (missing logic layer)

* [ ] Win condition (reach 100)
* [ ] Exact-roll-to-finish rule

---

## ⚠️ Core Game Integrity

* [ ] Prevent overlapping moves during animation (race condition hardening)
* [ ] Proper async movement → turn switching sync
* [ ] Movement interruption handling

---

## ⚠️ Advanced Gameplay

* [ ] Capturing / blocking system (not needed for Snakes & Ladder but future reuse)
* [ ] AI player (bot)
* [ ] Multiplayer online sync (future scope)

---

## ⚠️ Visual Improvements

* [ ] Dice shake realism (physics feel)
* [ ] Snake slide animation (smooth travel, not teleport)
* [ ] Ladder climb animation
* [ ] Highlight active player turn
