# 🎮 Connect Four – Real-Time Multiplayer Game (Node.js)

A real-time Connect Four game built with a Node.js backend and a browser-based
HTML/CSS client. The project focuses on server-side game logic, multiplayer support,
and client-server communication.

---

## 🛠️ Technologies
- Node.js
- JavaScript
- HTML / CSS
- MySQL

---

## ✨ Key Features
- Real-time multiplayer gameplay
- Server-side game logic and validation
- Client-server communication
- Persistent game data using MySQL

---

## ▶️ How to Run

The project is divided into two separate parts:
- `Server` – Node.js backend
- `Client` – browser-based client

Open each folder as a separate project.

Install dependencies:

```bash
npm install


---

```md
## ▶️ Run the Client

Open the following file in your browser:

```text
Client/gameplay.html



## 🗄️ Database Setup

Make sure you have a MySQL database available.

A table named `games` is required to store game data.

Example table structure:

```sql
CREATE TABLE games (
    id INT PRIMARY KEY AUTO_INCREMENT,
    game_state TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

