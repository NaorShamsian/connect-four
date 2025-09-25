const db = require("./db.js");

function turn(method, query, res) {
    if (method !== "GET") {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("<h1>404 Not Found</h1>");
        return;
    }

    let i = parseInt(query.get("i"));
    let j = parseInt(query.get("j"));
    let username = query.get("username");

    if (!username || isNaN(i) || isNaN(j)) {
        res.writeHead(400, { "Content-Type": "text/html" });
        res.end("<h1>400 Bad Request — missing parameters</h1>");
        return;
    }

    // נאתר את המשחק שבו השחקן נמצא
    db.query(
        "SELECT * FROM games WHERE (player1 = ? OR player2 = ?) AND winner IS NULL",
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
            let yourColor = (game.player1 === username) ? "Y" : "R";

            // בדיקה שזה באמת התור שלך
            if (game.turn !== yourColor) {
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end("It's not your move");
                return;
            }

            // המטריצה נשמרת כמחרוזת (36 תווים)
            let matrixArr = game.matrix.split("");

            // חישוב אינדקס: (שורה * 6 + עמודה)
            const SIZE = 6;
            let placed = false;
            for (let row = SIZE - 1; row >= 0; row--) {
                let idx = row * SIZE + j;
                if (matrixArr[idx] === "2") { // EMPTY
                    matrixArr[idx] = (yourColor === "Y" ? "0" : "1");
                    placed = true;
                    break;
                }
            }

            if (!placed) {
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end("Column is full");
                return;
            }

            // להפוך חזרה למחרוזת
            let newMatrix = matrixArr.join("");

            // תור חדש
            let nextTurn = (yourColor === "Y") ? "R" : "Y";

            // בדיקת ניצחון
            let winner = checkWinner(matrixArr, SIZE);

            // עדכון המשחק אחרי תור
            db.query(
                "UPDATE games SET matrix = ?, turn = ?, winner = ? WHERE id = ?",
                [newMatrix, nextTurn, winner, game.id],
                (err2) => {
                    if (err2) {
                        res.writeHead(500, { "Content-Type": "text/html" });
                        res.end("<h1>500 DB Error</h1>");
                        return;
                    }

                    res.writeHead(200, { "Content-Type": "text/plain" });
                    res.end("true");
                }
            );
        }
    );
}

// פונקציה  לבדוק ניצחון
function checkWinner(matrixArr, SIZE) {
    const getVal = (row, col) => {
        return matrixArr[row * SIZE + col];
    };

    // אופקי
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j <= SIZE - 4; j++) {
            let val = getVal(i, j);
            if (val !== "2" &&
                val === getVal(i, j + 1) &&
                val === getVal(i, j + 2) &&
                val === getVal(i, j + 3)) {
                return (val === "0" ? "Y" : "R");
            }
        }
    }

    // אנכי
    for (let j = 0; j < SIZE; j++) {
        for (let i = 0; i <= SIZE - 4; i++) {
            let val = getVal(i, j);
            if (val !== "2" &&
                val === getVal(i + 1, j) &&
                val === getVal(i + 2, j) &&
                val === getVal(i + 3, j)) {
                return (val === "0" ? "Y" : "R");
            }
        }
    }

    // אלכסון ראשון
    for (let i = 0; i <= SIZE - 4; i++) {
        for (let j = 0; j <= SIZE - 4; j++) {
            let val = getVal(i, j);
            if (val !== "2" &&
                val === getVal(i + 1, j + 1) &&
                val === getVal(i + 2, j + 2) &&
                val === getVal(i + 3, j + 3)) {
                return (val === "0" ? "Y" : "R");
            }
        }
    }

    // אלכסון שני
    for (let i = 0; i <= SIZE - 4; i++) {
        for (let j = 3; j < SIZE; j++) {
            let val = getVal(i, j);
            if (val !== "2" &&
                val === getVal(i + 1, j - 1) &&
                val === getVal(i + 2, j - 2) &&
                val === getVal(i + 3, j - 3)) {
                return (val === "0" ? "Y" : "R");
            }
        }
    }

    return null; // אין מנצח עדיין
}

module.exports = { turn };
