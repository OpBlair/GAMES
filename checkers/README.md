## Checkers (Draughts) – Vanilla JavaScript + Online Multiplayer

A browser-based implementation of the classic **Checkers** game built using **HTML, CSS, and vanilla JavaScript**, with a backend **Web API** to support **online multiplayer** using **SignalR**.

The game supports **local gameplay** using the browser and allows **real-time multiplayer** over the internet by connecting players via a backend server.

---

## 🎮 Features

* **8×8 Checkers board**
* **Two-player (local) gameplay**
* **Real-time online multiplayer** with **SignalR** backend
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

* **Frontend (Client-Side)**

  * HTML5
  * CSS3
  * JavaScript (ES6)
  * DOM manipulation (no frameworks)
* **Backend (Server-Side)**

  * **.NET 6** (Web API)
  * **SignalR** for real-time multiplayer
* **Hosting**

  * Local environment for development

---

## 🧩 Project Structure

```text
checkers/
│   ├── Checkers.Backend/
│   │   ├── Controllers/
│   │   ├── GameHub.cs        # SignalR hub for multiplayer
│   │   ├── Program.cs         # API setup and routing
│   │   └── appsettings.json   # Configuration
├── index.html
├── styles.css
└── script.js                   # Frontend game logic
```

---

## 🧪 Internal Design Notes

* The frontend uses a **2D array (`boardState`)** as the source of truth for piece positions.
* **SignalR** is used to facilitate real-time communication between players through the backend server.
* The game logic and board state are managed in the frontend JavaScript file, while multiplayer functionalities are handled on the backend using **ASP.NET Core Web API** and **SignalR**.
* Visual feedback and UI updates are sent to the players via the SignalR connections.

---

## 🚀 How to Run

### **1. Clone or Download the Project**

```bash
git clone https://github.com/OpBlair/GAMES.git
cd checkers
```

### **2. Run the Frontend (Client-Side)**

1. Open `index.html` in a modern browser
2. Click a piece to see legal moves
3. Click a highlighted square to move

### **3. Run the Backend (Server-Side)**

To run the backend server (Web API + SignalR):

1. Open a terminal and navigate to the backend folder:

```bash
cd backend/Checkers.Backend
```

2. Install the necessary dependencies:

```bash
dotnet restore
```

3. Run the backend server:

```bash
dotnet run
```

The backend will start listening at `http://localhost:5271`.

### **4. Playing Online Multiplayer**

* Once the backend is running, you can open the frontend in two separate browser tabs or windows.
* The frontend will establish a SignalR connection to the backend server and allow real-time multiplayer gameplay.

---

## 🔮 Possible Improvements

* **AI opponent** for solo play
* **Move animations** for a smoother experience
* **Undo / replay support**
* **Unit tests** for backend and frontend logic
* **Advanced matchmaking** and lobby system for multiplayer games

---

## 📌 Author Notes

This project serves as a foundation for both **local** and **online multiplayer** gameplay. The backend integration using **SignalR** ensures a smooth real-time experience, and the frontend focuses on correct game logic and smooth UI updates.

---