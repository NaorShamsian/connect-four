const { Model } = require("./model.js");

// מערך משחקים – כל אינדקס זה חדר
const games = [];

function getGame(roomIndex) {
    if (!games[roomIndex]) {
        games[roomIndex] = new Model(); // יוצרים מופע חדש של משחק
    }
    return games[roomIndex];
}

module.exports = { games, getGame };
