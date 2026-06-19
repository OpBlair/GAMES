# 📄 README — Snake & Ladder (Custom Engine)

## 🎮 Overview

This project is a browser-based **Snake & Ladder game engine built with vanilla JavaScript, HTML, and CSS**.

It uses a **lightweight object-oriented architecture** to manage:

* Board generation
* Dice system
* Player movement
* Snakes & ladders logic
* Turn-based gameplay with local AI Bot automation

No frameworks, no libraries — pure DOM + SVG rendering.

---

# 🧱 Tech Stack

* HTML5 (UI structure + custom modal layout)
* CSS3 (grid board + modern setup layout + custom transitions)
* JavaScript (game engine logic, OOP architecture)
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
* Dice UI rendering (3×3 dot pattern system)
* Roll animation state (`rolling`)
* Sound effect trigger (roll.mp3)

---

## 3. `Player`

Responsible for:

* Pawn creation & local state initialization
* Core classification (**Human vs. Computer Bot profiles**)
* Base → board entry logic
* Step-by-step movement animation
* Position tracking (`currentSquare`)

---

## 4. `GameState`

Responsible for:

* Turn management and player sequencing
* Dice control flow locks (`canRoll`)
* **AI Orchestration** (automatically triggering asynchronous bot moves when an AI turn is active)
* Game flow coordination, win execution, and status UI logging

---

# ✅ What is already implemented

## 🎲 Core Gameplay

* [x] Dice roll system (1–6 random)
* [x] Turn-based system (multi-player support)
* [x] Roll restriction (canRoll lock)
* [x] Roll animation + UI feedback
* [x] Win condition checking (reaching square 100)

---

## 🧍 Player & Bot System

* [x] Dynamic player configuration (Configure up to 4 Humans & 3 Computer Bots)
* [x] Automated AI Player logic (Bots auto-roll and move asynchronously on their turn)
* [x] Player lobby (base area visual management)
* [x] Move from base → board (on rolling a 6)
* [x] Step-by-step sequential movement animation

---

## 🧩 Board System

* [x] 10×10 grid generation (100 squares)
* [x] Alternating row numbering layout (Boustrophedon style mapping)
* [x] Square indexing system (`data-index`)
* [x] SVG overlay layer setup for assets

---

## 🐍 Snakes & Ladders

* [x] Ladder rendering (rails + steps dynamically calculated)
* [x] Snake rendering (Bezier curve paths)
* [x] Snake head + eyes + tongue graphics
* [x] Board jump logic integration (players automatically slide down snakes/climb ladders)

---

## 🎨 UI / UX

* [x] Premium Dark-themed Welcome Screen with custom-designed input pickers
* [x] Custom CSS logic hiding raw native browser input arrows
* [x] Dice UI (3×3 dot system)
* [x] Interactive turn tracking indicators
* [x] Rolling animation & Pawn hopping effects
* [x] Responsive canvas scaling via window resize tracking

---

# 🚧 What is NOT yet implemented (important)

## ⚠️ Game Rules Engine (missing logic layer)

* [ ] Exact-roll-to-finish bounding rule (overshooting bounces back)

---

## ⚠️ Core Game Integrity

* [ ] Prevent overlapping moves during animation (race condition hardening)
* [ ] Proper async movement → turn switching sync
* [ ] Movement interruption handling

---

## ⚠️ Advanced Gameplay

* [ ] Capturing / blocking system (optional feature variants)
* [ ] Multiplayer online sync (future scope)

---

## ⚠️ Visual Improvements

* [ ] Dice shake realism (physics feel)
* [ ] Snake slide animation (smooth travel along curve, not instant slide)
* [ ] Ladder climb animation