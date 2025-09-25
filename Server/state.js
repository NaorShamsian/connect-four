const db = require("./db.js");

function state(method, query, res) {
    if (method !== "GET") {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("<h1>404 Not Found</h1>");
        return;
    }

    let username = query.get("username");
    if (!username || username.trim() === "") {
        res.writeHead(400, { "Content-Type": "text/html" });
        res.end("<h1>400 Bad Request — missing parameters</h1>");
        return;
    }

    // נביא את המשחק האחרון של המשתמש לפי מזהה המשחק (id)
    db.query(
        "SELECT * FROM games WHERE player1 = ? OR player2 = ? ORDER BY id DESC LIMIT 1",
        [username, username],
        (err, results) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/html" });
                res.end("<h1>500 DB Error</h1>");
                return;
            }

            if (results.length === 0) {
                res.writeHead(401, { "Content-Type": "text/html" });
                res.end("<h1>401 Unauthorized player</h1>");
                return;
            }

            const game = results[0];

            // להוציא את שם המנצח לפי הצבע
            let winnerName = null;
            if (game.winner === "Y") winnerName = game.player1;
            if (game.winner === "R") winnerName = game.player2;

            // אם רק שחקן אחד מחובר ועדיין אין מנצח → מצב המתנה
            if (!game.player2 && !game.winner) {
                let json = {
                    gameId: game.id,
                    matrix: null,
                    turn: null,
                    whoWon: null,
                    players: [game.player1],
                    you: username,
                    yourColor: "Y",
                    waiting: true,
                    finished: false
                };
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(json));
                return;
            }

            // אחרת – נחזיר את מצב המשחק (כולל אם נגמר)
            let yourColor = (game.player1 === username) ? "Y" : "R";

            let json = {
                gameId: game.id,                // מזהה המשחק
                matrix: game.matrix,            // מטריצה כסטרינג
                turn: game.turn,                // 'Y' או 'R'
                whoWon: winnerName,             // שם המנצח או null
                players: [game.player1, game.player2],
                you: username,
                yourColor: yourColor,
                waiting: !game.player2,         // true אם אין שחקן שני
                finished: !!game.winner         // true אם המשחק נגמר
            };

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(json));
        }
    );
}

module.exports = { state };
