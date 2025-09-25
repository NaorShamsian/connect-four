function View() {
    const boardContainer = document.getElementById('boardBody');
    const status = document.getElementById('status');
    const labelNames = document.getElementById('labelNames');
    const newGameBtn = document.getElementById('newGame');

    function setOnClickNewGame(fun) {
        newGameBtn.onclick = fun;
    }

    let _size = 0;
    let _matrix = null;

    function createTable(size, onclick) {
        _size = size;
        _matrix = [_size];
        boardContainer.innerHTML = '';
        for (let i = 0; i < _size; i++) {
            _matrix[i] = [];
            let row = document.createElement('tr');
            for (let j = 0; j < _size; j++) {
                let col = document.createElement('td');
                col.textContent = '';
                col.onclick = onclick.bind(this, i, j);
                row.appendChild(col);
                _matrix[i][j] = col;
            }
            boardContainer.appendChild(row);
        }
    }

    function setStatus(text) {
        status.innerHTML = text; 
    }
    function setNames (text) {
        labelNames.innerHTML = text;
    }

    function drawCol(i, j, value) {
        if (_matrix != null && i < _size && j < _size) {
            _matrix[i][j].innerHTML = value;
        }
    }

    function lockCol(i, j) {
        if (_matrix != null && i < _size && j < _size) {
            _matrix[i][j].className = 'locked';
        }
    }

    return {
        createTable,
        drawCol,
        setStatus,
        lockCol,
        setOnClickNewGame,
        setNames
    };
}
