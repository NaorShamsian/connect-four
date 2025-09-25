function Model() {
    const SIZE = 6;
    const getValue = { EMPTY: 2, Y: 0, R: 1 };
    let turn = getValue.Y;
    let matrix = null;

    newGame();

    function newGame() {
        matrix = [];
        for (let i = 0; i < SIZE; i++) {
            matrix[i] = [];
            for (let j = 0; j < SIZE; j++) {
                matrix[i][j] = getValue.EMPTY;
            }
        }
        turn = getValue.Y;
    }

    function clicked(j) {
        if (whoWon() !== getValue.EMPTY) return false;
        for (let i = SIZE - 1; i >= 0; i--) {
            if (matrix[i][j] === getValue.EMPTY) {
                matrix[i][j] = turn;
                turn = (turn === getValue.Y ? getValue.R : getValue.Y);
                return true;
            }
        }
        return false;
    }

    function whoWon() {
        // אופקי
        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j <= SIZE - 4; j++) {
                let val = matrix[i][j];
                if (val !== getValue.EMPTY &&
                    val === matrix[i][j+1] &&
                    val === matrix[i][j+2] &&
                    val === matrix[i][j+3]) return val;
            }
        }
        // אנכי
        for (let j = 0; j < SIZE; j++) {
            for (let i = 0; i <= SIZE - 4; i++) {
                let val = matrix[i][j];
                if (val !== getValue.EMPTY &&
                    val === matrix[i+1][j] &&
                    val === matrix[i+2][j] &&
                    val === matrix[i+3][j]) return val;
            }
        }
        // אלכסון ↘
        for (let i = 0; i <= SIZE - 4; i++) {
            for (let j = 0; j <= SIZE - 4; j++) {
                let val = matrix[i][j];
                if (val !== getValue.EMPTY &&
                    val === matrix[i+1][j+1] &&
                    val === matrix[i+2][j+2] &&
                    val === matrix[i+3][j+3]) return val;
            }
        }
        // אלכסון ↙
        for (let i = 0; i <= SIZE - 4; i++) {
            for (let j = 3; j < SIZE; j++) {
                let val = matrix[i][j];
                if (val !== getValue.EMPTY &&
                    val === matrix[i+1][j-1] &&
                    val === matrix[i+2][j-2] &&
                    val === matrix[i+3][j-3]) return val;
            }
        }
        return getValue.EMPTY;
    }

    function getTurn() { return turn; }

    function getReadableMatrix() {
        let readableMatrix = [];
        for (let i = 0; i < SIZE; i++) {
            readableMatrix[i] = [];
            for (let j = 0; j < SIZE; j++) {
                readableMatrix[i][j] =
                    matrix[i][j] === getValue.Y ? 'Y' :
                    matrix[i][j] === getValue.R ? 'R' : null;
            }
        }
        return readableMatrix;
    }

    return { 
        clicked, 
        SIZE, 
        getTurn, 
        getValue,
        newGame,
        whoWon,
        getMatrix: getReadableMatrix
     };
}

module.exports = { Model };
