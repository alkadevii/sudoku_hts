class SudokuGame {
    constructor() {
        this.grid = Array(9).fill().map(() => Array(9).fill(0));
        this.solution = Array(9).fill().map(() => Array(9).fill(0));
        this.originalPuzzle = Array(9).fill().map(() => Array(9).fill(0));
        this.givenCells = new Set();
        this.selectedCell = null;
        this.timer = 0;
        this.timerInterval = null;
        this.isGameComplete = false;
        this.difficulty = 'medium'; // default difficulty
        
        this.initializeGame();
        this.setupEventListeners();
        this.startTimer();
    }
    
    getDifficultyCount() {
        switch (this.difficulty) {
            case 'easy':   return 30;
            case 'medium': return 45;
            case 'hard':   return 55;
            default:       return 45;
        }
    }
    
    initializeGame() {
        this.generateNewPuzzle();
        this.renderGrid();
        this.updateStatus("Good luck!");
    }
    
    generateNewPuzzle() {
        this.grid = Array(9).fill().map(() => Array(9).fill(0));
        this.givenCells.clear();
        
        this.generateSolution();
        
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.grid[i][j] = this.solution[i][j];
            }
        }
        
        this.removeNumbers(this.getDifficultyCount());
        
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.originalPuzzle[i][j] = this.grid[i][j];
            }
        }
        
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.grid[i][j] !== 0) {
                    this.givenCells.add(`${i}-${j}`);
                }
            }
        }
    }
    
    generateSolution() {
        for (let i = 0; i < 9; i += 3) {
            this.fillBox(i, i);
        }
        this.solveRemaining(0, 0);
    }
    
    fillBox(row, col) {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        this.shuffleArray(numbers);
        
        let index = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.solution[row + i][col + j] = numbers[index++];
            }
        }
    }
    
    solveRemaining(row, col) {
        if (row === 9) return true;
        if (col === 9) return this.solveRemaining(row + 1, 0);
        if (this.solution[row][col] !== 0) return this.solveRemaining(row, col + 1);
        
        for (let num = 1; num <= 9; num++) {
            if (this.isValidMove(this.solution, row, col, num)) {
                this.solution[row][col] = num;
                if (this.solveRemaining(row, col + 1)) return true;
                this.solution[row][col] = 0;
            }
        }
        return false;
    }
    
    removeNumbers(count) {
        const positions = [];
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                positions.push([i, j]);
            }
        }
        this.shuffleArray(positions);
        
        for (let i = 0; i < count && i < positions.length; i++) {
            const [row, col] = positions[i];
            this.grid[row][col] = 0;
        }
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    isValidMove(grid, row, col, num) {
        for (let j = 0; j < 9; j++) {
            if (grid[row][j] === num) return false;
        }
        for (let i = 0; i < 9; i++) {
            if (grid[i][col] === num) return false;
        }
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let i = boxRow; i < boxRow + 3; i++) {
            for (let j = boxCol; j < boxCol + 3; j++) {
                if (grid[i][j] === num) return false;
            }
        }
        return true;
    }
    
    renderGrid() {
        const gridElement = document.getElementById('sudoku-grid');
        gridElement.innerHTML = '';
        
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                if (this.grid[i][j] !== 0) {
                    cell.textContent = this.grid[i][j];
                }
                
                if (this.givenCells.has(`${i}-${j}`)) {
                    cell.classList.add('given');
                }
                
                cell.addEventListener('click', () => this.selectCell(i, j));
                gridElement.appendChild(cell);
            }
        }
    }
    
    selectCell(row, col) {
        if (this.isGameComplete) return;
        
        if (this.selectedCell) {
            const prevCell = document.querySelector(`[data-row="${this.selectedCell.row}"][data-col="${this.selectedCell.col}"]`);
            if (prevCell) prevCell.classList.remove('selected');
        }
        
        this.selectedCell = { row, col };
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (cell) cell.classList.add('selected');
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (!this.selectedCell || this.isGameComplete) return;
            
            const { row, col } = this.selectedCell;
            const cellKey = `${row}-${col}`;
            
            if (this.givenCells.has(cellKey)) return;
            
            if (e.key >= '1' && e.key <= '9') {
                const num = parseInt(e.key);
                this.grid[row][col] = num;
                this.updateCell(row, col, num);
                this.checkForCompletion();
            } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
                this.grid[row][col] = 0;
                this.updateCell(row, col, 0);
            }
        });
        
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetGame();
        });
        
        document.getElementById('newGameBtn').addEventListener('click', () => {
            this.newGame();
        });

        // ✅ Difficulty selector event listener
        document.getElementById('difficultySelect').addEventListener('change', (e) => {
            this.difficulty = e.target.value;
            this.newGame();
        });
    }
    
    updateCell(row, col, value) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cell.textContent = value || '';
        cell.classList.remove('error', 'completed');
        
        if (value !== 0 && !this.isValidMove(this.grid, row, col, value)) {
            cell.classList.add('error');
        } else if (value !== 0) {
            cell.classList.add('completed');
        }
    }
    
    checkForCompletion() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.grid[i][j] === 0) return;
            }
        }
        
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.grid[i][j] !== this.solution[i][j]) {
                    this.updateStatus("Almost there! Check for errors.");
                    return;
                }
            }
        }
        
        this.isGameComplete = true;
        this.stopTimer();
        this.updateStatus("Congratulations! You solved it!", "success");
        
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => cell.classList.add('completed'));
    }
    
    resetGame() {
        this.stopTimer();
        this.timer = 0;
        this.updateTimer();
        this.startTimer();
        
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.grid[i][j] = this.originalPuzzle[i][j];
            }
        }
        
        this.selectedCell = null;
        this.isGameComplete = false;
        this.renderGrid();
        this.updateStatus("Game reset! Same puzzle, fresh start!");
    }
    
    newGame() {
        this.stopTimer();
        this.timer = 0;
        this.updateTimer();
        this.startTimer();
        
        this.selectedCell = null;
        this.isGameComplete = false;
        this.generateNewPuzzle();
        this.renderGrid();
        this.updateStatus(`New ${this.difficulty} game! Good luck!`);
    }
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateTimer();
        }, 1000);
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    updateTimer() {
        const minutes = Math.floor(this.timer / 60);
        const seconds = this.timer % 60;
        const timerElement = document.getElementById('timer');
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updateStatus(message, type = '') {
        const statusElement = document.getElementById('status');
        statusElement.textContent = message;
        statusElement.className = `status ${type}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SudokuGame();
});
