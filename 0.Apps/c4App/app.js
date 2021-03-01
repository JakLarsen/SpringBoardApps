


                    //GLOBAL VARIABLES




const startButton = document.querySelector('#start-btn');
let p1InputVal = document.getElementById('p1-color').value;
let p2InputVal = document.getElementById('p2-color').value;
let turn = 1;

let gameInProgress = false;
let height = 6;
let width = 7
let playerTurn = 1;



                    //PLAYER CLASS FOR COLOR CHOICE



class Player {
  constructor(color) {
    this.color = color;
  }
}



                    // GAME CLASS



//Game Class for connect 4 game and board
class Game{
  constructor(p1, p2, height = 6, width = 7){
    
    this.p1 = p1;
    this.p2 = p2;

    this.height = height;
    this.width = width;

    this.p1Turn = true;
    this.gameOver = false;
    this.errorDivPresent = false;

    this.c4Board = document.querySelector("#c4-board");
    this.startButton = document.querySelector('#start-btn');
    this.startErrorContainer = document.querySelector('#start-error-container'); 
    
    //used to update css for boards 6x7, 7x8, 8x9 in createBoard()
    if (this.height <= 7){
      this.rowHeight = "25rem";
      this.width === 7 ? this.rowWidth = "30rem" : this.rowWidth = "35rem";
      } 
      else{
        this.rowHeight = "30rem";
        this.rowWidth = "37rem";
      } 
    this.instantiateBoard();
  }



                    //GAME CLASS FUNCTIONS



  //INITIALIZE BOARD ARRAY FILLED WITH 'NULL'
  initializeBoard(){
    this.board = Array.from(Array(this.height), () => new Array(this.width));
    for(let i = 0; i < this.height; i++){
      for(let j = 0; j < this.width; j++){
        this.board[i][j] = null;
      }
    }
    return this.boardArr;
  }

  //CREATE BOARD ON DOM
  createBoard(){

    //UPDATE BOARD SIZE CSS ON DOM
    document.querySelector("#c4-board").style.width = this.rowWidth;
    document.querySelector("#c4-board").style.height = this.rowHeight;
    
    //CREATE PLACEABLE CIRCLE TILES WITH UNIQUE IDS
    for(let i = 0; i < this.board.length; i++){
      for(let j = 0; j < this.board[0].length; j++){
        let newDiv = document.createElement('div');
        newDiv.classList.add('c4-sq');
        newDiv.id = `${i}${j}`;
        this.c4Board.appendChild(newDiv);  
      }
    }
  }

  //INITIALIZE AND CREATE BOARD ON DOM; CREATE EVENT LISTENERS FOR CLICKS
  instantiateBoard(){
    this.createBoard(this.initializeBoard());

    this.handleC4Click = this.handleC4Click.bind(this);
    this.c4Board.addEventListener('click', this.handleC4Click);

    this.handleStartClick = this.handleStartClick.bind(this);
    this.startButton.addEventListener('click', this.handleStartClick);
  }

  //IF PLAYER TRIES TO PLAY A TOKEN IN A FULL COLUMN
  createErrorDiv(){
    if (!this.errorDivPresent){
        let errorDiv = document.createElement('div');
        errorDiv.id = 'error-display';
        errorDiv.innerText = "Sorry, there are no spaces left in that column!"
        this.startErrorContainer.appendChild(errorDiv);
        this.errorDivPresent = true; 
        window.setTimeout(this.removeErrorDiv.bind(this), 1200);
    }
  }

  //REMOVES EITHER ERROR OR WIN DISPLAY AFTER 1200ms
  removeErrorDiv(){
    let errorDivToRemove = document.getElementById("error-display");
    errorDivToRemove.remove();
    this.errorDivPresent = false;
  }

  //FIND THE LOWEST DROPPABLE INDEX IN COLUMN
  //goes bottom to top to find first non-null row index in the column clicked
  //QUESTION: Why do I need to send the `board` as an argument?
  getPieceDropIndex(board, sqId){
    let jdx = parseInt(sqId.slice(1));
    for(let i = this.board.length - 1; i >= 0; i--){
        if(this.board[i][jdx] === null){
            this.updatePlacedBoardIndex(i, jdx);
            return [i, jdx];
        }
    }
  }

  //UPDATE THE BOARD ARRAY WITH PLAYER IDENTIFIERS: 1 OR 2
  updatePlacedBoardIndex(i, jdx){
    this.board[i][jdx] = this.p1Turn === true ? 1 : 2;
  }

  //UPDATE PLAYED TOKEN SPACE ON DOM TO SHOW PLAYER-SPECIFIC TOKEN COLOR
  placePiece(board, index){
    let placedId = index.join('');
    if(this.p1Turn === true){
        let playedSpace = document.getElementById(placedId);
        playedSpace.classList.add("p1");
        playedSpace.style.backgroundColor = p1.color;
        this.p1Turn = false;
    }
    else{
        let playedSpace = document.getElementById(placedId);
        playedSpace.classList.add("p2");
        playedSpace.style.backgroundColor = p2.color;
        this.p1Turn = true;
    }
  }

  //WINCHECK - USED SOLUTION ALGORITHMS HERE IN PLACE OF MY OWN DUE TO OPTIMIZATION
  hasWon(){
      // Check four cells to see if they're all the player number
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match player
      let player = 0;
      // If it's p1Turn, that means p2 just played and is the player being checked for win
      !this.p1Turn ? player = 1: player = 2;
      const _win = cells =>
        cells.every(
          ([y, x]) =>
            y >= 0 &&
            y < this.height &&
            x >= 0 &&
            x < this.width &&
            this.board[y][x] === player
        );
  
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          // get "check list" of 4 cells (starting here) for each of the different
          // ways to win
          const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
          const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
          const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
          const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
          // find winner (only checking each win-possibility as needed)
          if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
            return true;
          }
        }
      }
    }

  //RECYCLES ERROR-DISPLAY CSS TO SHOW A PLAYER HAS WON
  createWinDiv(){
    let winDiv = document.createElement('div');
    winDiv.id = 'error-display';
    if(!this.p1Turn){
        winDiv.innerText = "Player 1 wins!"
    }
    else{
        winDiv.innerText = "Player 2 wins!"
    }
    this.startErrorContainer.appendChild(winDiv);
    this.errorDivPresent = true;  
    window.setTimeout(this.removeErrorDiv.bind(this), 1200);
  }

  //REMOVE PLAYER TOKEN CLASSES
  resetTokens(){
    for(let i = 0; i < this.board.length; i++){
      for(let j = 0; j < this.board[0].length; j++){
        let idVal = i.toString()+j.toString();
        let targetDiv = document.getElementById(idVal);
        targetDiv.classList.remove('p1');
        targetDiv.style.backgroundColor = "";
        targetDiv.classList.remove('p2');
      }
    }
  }

  //RESET BOARD ARRAY AND RESET TOKENS
  resetBoard(){
    this.initializeBoard();
    this.resetTokens();
    this.gameOver = false;
  }

  //RESETS BOARD AFTER A WIN
  resetTimer(){
    window.setTimeout(this.resetBoard.bind(this), 1200);
  }



                    //HANDLERS



  //BOARD CLICK HANDLER - HANDLES PLACEMENT OF TOKEN
  handleC4Click(e){
    if(e.target.classList.contains('c4-sq') && !this.gameOver){
      let sqId = e.target.id;
      let index = this.getPieceDropIndex(this.board, sqId);
      //catching trying to play a piece in full column
      if(index === undefined){
        this.createErrorDiv();
      }
      else{
        this.placePiece(this.board, index);
        let winnerFound = this.hasWon(this.board, index, sqId);
        if(winnerFound){
          this.gameOver = true;
          this.createWinDiv();
          this.resetTimer();
        }
      }
    }
  };

  //RESET BOARD
  handleStartClick(e){
    this.resetBoard();
  }



                    //END GAME CLASS



} 



                    //VALIDATION ON COLOR INPUTS



function isValidInputs(p1InputVal, p2InputVal){
  //IF INPUT CONTAINS A NUMBER
  if(/\d/.test(p1InputVal) == true || /\d/.test(p2InputVal) == true){
    return false;
  }
  //IF INPUT CONTAINS SPACES
  else if(p1InputVal.indexOf(' ') >= 0 || p2InputVal.indexOf(' ') >= 0){
    return false;
  }
  //IF INPUT IS > 15 CHARS
  else if(p1InputVal.length > 15 || p2InputVal.length > 15){
    return false;
  }
  return true;
}

                    //START BUTTON HANDLER




//START BUTTON CALLS TO RESET BOARD AND GAME AND INITIALIZE COLORS
startButton.addEventListener('click', function(e){
  p1InputVal = document.getElementById('p1-color').value;
  p2InputVal = document.getElementById('p2-color').value;

  p1 = new Player(p1InputVal);
  p2 = new Player(p2InputVal);

  if(!gameInProgress){
    if(isValidInputs(p1InputVal, p2InputVal)){

      //Games takes a rectangular height(row), width(cols) - restricted options: (6x7, 7x8, or 8x9);
      new Game(p1, p2, height, width);
      gameInProgress = true;
    }
    else{
      alert("Not a valid input. Try a basic color, like red or blue!");
    }
  }
});  




                    //NOTES



//spend more time with `this` and `bind`
//--difficulties with parameters and functions before I moved event handlers into Game class
//spend more time with event handlers within classes
//--definitely don't have strong grasp of this yet, i.e. what does binding them like you did actually do?
//? - binds the function to this class' `this` so if it is called by another function, the `this` is stil the class'
//implement the hasWon log a few times to be able to manipulate and recreate it for other uses
//--using a localized check using cells like that seems useful and outwardly applicable to other scenarios
//Figure out why everything works fine if random inputs are put into the color input areas
//--set up validation for these input values
//Why do I need to send the `board` as an argument to getPieceDropIndex()?





                    //FURTHER IMPROVEMENTS



//Validation of color input
//Change p1Turn from boolean to playerTurn = 1 or 2

//Animate dropdown of tokens  
//Styling in general or trying out different types of aesthetics
//Making it responsive and mobile first
//Scoreboard
//Token to be played or player turn indicator
//Timer
//Color picker instead of typing color name
//Darkmode
//Update Game Class to take board size values chosen by the users
  //-either input, button selection, menu selection
//Create more games (checkers, etc) and display gameboard