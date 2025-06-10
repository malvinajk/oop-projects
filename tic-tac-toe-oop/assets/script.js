// classes: Game, Player, Bot, Board. game: turns, checks winner, resets, tracks current turn. Player: which symbol, click event for move. Bot: which symbol, makes move using random logic. Board: boxes and winning patters, initBoard, reset board, update board(index, symbol), check empty cells, check win. 


class Board {

    constructor() {

        this.boxes = [];
        this.boardElement = document.getElementById("game-board");
        this.winningPatterns = [
            [0, 1, 2],
            [0, 3, 6],
            [0, 4, 8],
            [1, 4, 7],
            [2, 5, 8],
            [2, 4, 6],
            [3, 4, 5],
            [6, 7, 8]
        ];

        // this.initBoard();
    }

    initBoard() {
        this.boardElement.innerHTML = "";
        this.boxes = [];

        for (let i = 0; i < 3; i++) {
            let row = document.createElement("div")
            row.className = "board-row";

            for (let j = 0; j < 3; j++) {
                let box = document.createElement("div")
                box.className = "board-box"
                box.dataset.index = i * 3 + j;
                row.appendChild(box)
                this.boxes.push(box)
            }

            this.boardElement.appendChild(row)
        }
    }

    getEmptyBoxes() {
        return this.boxes.filter(box => box.textContent === "");
    }

    resetBoard() {
        this.boardElement.innerHTML = "";
        this.boxes = [];
        this.initBoard();
    }

    arrayContainsAll(array, subArray) {
        return subArray.every(elem => array.includes(elem));
    }

    updateBox (index, symbol) {
        if(index >= 0 && index < this.boxes.length && this.boxes[index].textContent === "") {
            this.boxes[index].textContent = symbol;
            return true;
        }
        return false;

    }

    checkWin(playerArr, botArr) {

        for(let pattern of this.winningPatterns) {
            if(this.arrayContainsAll(playerArr, pattern)){
                return "Player wins!"
            } else if (this.arrayContainsAll(botArr, pattern)) {
                return "Bot wins!"
            }
        }
        return null;
    }
}


// so "O" goes second, how to reprogram so if player chooses "O" bot goes first?

class Player {
    constructor() {
        this.selectBox = document.getElementById("player-choice");
        this.playerChoice = "X"
        this.botChoice = "O"
        this.whichSymbol();
    }

    whichSymbol(){
        this.selectBox.addEventListener("change", (e) => {
            this.playerChoice = e.target.value;
            this.botChoice = this.playerChoice === "X" ? "O" : "X"
            console.log("Player symbol is now:", this.playerChoice);
            console.log(this.botChoice)
        })
    }

    getPlayerChoice() {
        return this.playerChoice;
    }

    getBotChoice() {
        return this.botChoice;
    }

    // reset the player choice, bot choice and dropdown select box:

    resetChoices() {
        this.playerChoice = "X";
        this.botChoice = "O";
        this.selectBox.value = "X";
    }
}

class Game {
    constructor() {
        // initialise the new board and player:

        this.board = new Board();
        this.player = new Player;
        this.playerArr = [];
        this.botArr = [];
        this.gameOver = false;
        this.resetButton = document.getElementById("reset")

        this.initGame();
    }

    initGame() {
        this.board.initBoard()
        this.setupGame();
        this.setupResetButton();
    }

    // make all boxes clickable:
    setupGame() {
        this.board.boxes.forEach((box) => {
            box.addEventListener("click", (e) => this.playerClick(e))
        });
    }

    // setup your reset button:
    setupResetButton() {
        this.resetButton.addEventListener("click", () => this.resetGame())
    }


    //player click logic, add player symbol to chosen box and add the index to the player arr
    playerClick(e){
        console.log("Player clicked")
        if(this.gameOver) return;

        const clickedBox = e.target;
        if(clickedBox.textContent === "") {
            clickedBox.textContent = this.player.getPlayerChoice();

            const index = this.board.boxes.indexOf(clickedBox);
            this.playerArr.push(index);
            console.log(`Player choices are: ${this.playerArr}`);

            let result = this.board.checkWin(this.playerArr, this.botArr);
            // console.log("Winner evaluation result:", result)
            if(result) {
                alert(result);
                this.gameOver = true;
                return;
            }
            

            // console.log("About to call botClick")
            this.botClick();
        }
    }


    //bot click logic, same as the player logic

    botClick() {
        const emptyBoxes = this.board.getEmptyBoxes();

        // if no empty boxes found and no winner, return no winner
        if(emptyBoxes.length === 0){
            alert("No winner!");
            return;
        }

        //bot chooses a random empty box and puts its symbol

        let randomBox = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
        randomBox.textContent = this.player.getBotChoice();

        const index = this.board.boxes.indexOf(randomBox);
        this.botArr.push(index);
        console.log(`Bot choices are: ${this.botArr}`);

        //check win of both arrays

        let result = this.board.checkWin(this.playerArr, this.botArr);
        if(result) {
            alert(result);
            this.gameOver = true;
            return;
        }
    }


    // resets the board and the arrays

    resetGame() {
        this.board.resetBoard();
        this.playerArr = [];
        this.botArr = [];
        this.gameOver = false;
        this.player.resetChoices();
        this.initGame();
    }

}

// remember to call new game!
const game = new Game();