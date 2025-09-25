function Controller(view) {
    let usernameInput = document.getElementById('input-username');
    let username = '';
    let renderTimeout = null;
    let currentGameId = null;

    function init() {
        view.setOnClickNewGame(newGame);
    }

    function newGame() {
        if (renderTimeout) clearTimeout(renderTimeout);

        const name = usernameInput.value.trim();
        if (name !== '') {
            username = name;
            sendHttpGetRequest(`http://localhost:3000/newGame?username=${username}`, (data, status) => {
                if (status === 200) {
                    let json = {};
                    try { json = JSON.parse(data); } catch { json = {}; }

                    currentGameId = (json.gameId != null ? json.gameId : null);
                    console.log("New game started:", json);

                    resetBoard();
                    render();
                } else {
                    console.error("Failed to start new game");
                    alert('Failed to start new game');
                }
            });
        } else {
            alert('Please enter your name first');
        }
    }

    function clickedByView(i, j) {
        if (!currentGameId) return; // אין משחק פעיל

        sendHttpGetRequest(
            `http://localhost:3000/turn?username=${username}&i=${i}&j=${j}`,
            (data, status) => {
                if (status === 200) {
                    console.log("Turn submitted:", data);
                } else {
                    console.error("Error submitting turn:", data);
                }
            }
        );
    }

    function render() {
        sendHttpGetRequest(`http://localhost:3000/state?username=${username}`, (data, status) => {
            if (status === 200 && data !== '') {
                let json = JSON.parse(data);
                currentGameId = json.gameId;

                if (json.waiting) {
                    view.setStatus("מחכה לשחקן נוסף...");
                    view.setNames("יריב: לא קיים");
                    renderTimeout = setTimeout(render, 2000);
                    return;
                }

                // ציור מטריצה
                if (json.matrix) {
                    const SIZE = 6;
                    let matrix = [];
                    for (let i = 0; i < SIZE; i++) {
                        matrix[i] = [];
                        for (let j = 0; j < SIZE; j++) {
                            const idx = i * SIZE + j;
                            let val = json.matrix[idx];
                            matrix[i][j] = val === "0" ? "Y" : (val === "1" ? "R" : null);
                        }
                    }

                    view.createTable(SIZE, clickedByView);

                    for (let i = 0; i < SIZE; i++) {
                        for (let j = 0; j < SIZE; j++) {
                            if (matrix[i][j] === 'Y') {
                                view.drawCol(i, j, "🟡");
                                view.lockCol(i, j);
                            } else if (matrix[i][j] === 'R') {
                                view.drawCol(i, j, "🔴");
                                view.lockCol(i, j);
                            } else {
                                view.drawCol(i, j, "");
                            }
                        }
                    }
                }

                if (json.players && json.players.length === 2) {
                    let opponent = json.players.find(p => p !== username);
                    view.setNames("יריב: " + opponent);
                }

                if (json.finished) {
                    if (renderTimeout) clearTimeout(renderTimeout);
                    view.setStatus("המשחק נגמר! המנצח: " + json.whoWon);
                    view.setNames("יריב: לא קיים");
                    //resetBoard();
                    return;
                }

                if (json.turn) {
                    if (json.turn === json.yourColor) {
                        view.setStatus("תורי");
                    } else {
                        view.setStatus("תור היריב");
                    }
                }
            }
            renderTimeout = setTimeout(render, 2000);
        });
    }

    function resetBoard() {
        currentGameId = null;
        view.createTable(6, clickedByView);
        view.setStatus("מחכה למשחק חדש...");
    }

    return { init };
}
