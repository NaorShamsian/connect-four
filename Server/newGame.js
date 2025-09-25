const db = require("./db.js");

function newGame(method, query, res) {
    if (method !== 'GET') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
        return;
    }

    let username = query.get('username');
    if (!username || username.trim() === "") {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end('<h1>400 Bad Request — missing parameters</h1>');
        return;
    }

    // לבדוק אם המשתמש כבר במשחק כלשהו
    db.query(
        "SELECT * FROM games WHERE player1 = ? OR player2 = ? ORDER BY id DESC LIMIT 1",
        [username, username],
        (err, results) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('<h1>500 Can not connect to db</h1>');
                return;
            }

            if (results.length > 0) {
                const game = results[0];

                if (game.winner === null) {
                    // אם עדיין אין מנצח – השחקן בתוך משחק קיים
                    res.writeHead(200, { "Content-Type": "text/plain" });
                    res.end("OK (already in game " + game.id + ")");
                    return;
                }
                // אם יש מנצח – נמשיך הלאה ליצירת משחק חדש
            }

            // לחפש משחק פנוי שמחכה לשחקן שני
            db.query(
                "SELECT * FROM games WHERE player2 IS NULL AND winner IS NULL LIMIT 1",
                [],
                (err2, freeGames) => {
                    if (err2) {
                        res.writeHead(500, { 'Content-Type': 'text/html' });
                        res.end('<h1>500 Can not connect to db</h1>');
                        return;
                    }

                    if (freeGames.length > 0) {
                        // יש משחק פנוי – נכניס את המשתמש כשחקן שני
                        const game = freeGames[0];
                        db.query(
                            "UPDATE games SET player2 = ? WHERE id = ?",
                            [username, game.id],
                            (err3) => {
                                if (err3) {
                                    res.writeHead(500, { 'Content-Type': 'text/html' });
                                    res.end('<h1>500 DB Error</h1>');
                                    return;
                                }
                                res.writeHead(200, { "Content-Type": "text/plain" });
                                res.end("Found game, joined room " + game.id);
                            }
                        );
                    } else {
                        // אין משחק פנוי אז ניצור משחק חדש
                        const emptyMatrix = "2".repeat(36); // מטריצת משחק חדשה
                        db.query(
                            "INSERT INTO games (player1, matrix, turn) VALUES (?, ?, 'Y')",
                            [username, emptyMatrix],
                            (err4, result) => {
                                if (err4) {
                                    res.writeHead(500, { 'Content-Type': 'text/html' });
                                    res.end('<h1>500 DB Error</h1>');
                                    return;
                                }
                                res.writeHead(200, { "Content-Type": "text/plain" });

                                res.end(JSON.stringify({
                                message: "Game has been created",
                                gameId: result.insertId
                                }));

                                // res.end("Game has been created.. (GameId = " + result.insertId + ")");
                            }
                        );
                    }
                }
            );
        }
    );
}

module.exports = { newGame };
