//says to use starter code in zip, but I'd rather NOT rebuild c4, 
//which isn't the point of this exercise, in order to do the refactoring exercise.


                    //MAIN GLOBAL VARIABLES




const c4Board = document.querySelector("#c4-board");
const startButton = document.querySelector('#start-btn');



                    // GAME CLASS



class Game{
  constructor(height = 6, width = 7){
    this.p1 = '#52ffb1';
    this.p2 = '#ff06c9';
    this.p1Turn = true;
    this.height = height;
    this.width = width;
    this.gameInProgress = false;
    this.gameOver = false;
    this.errorDivPresent = false;
    this.c4Board = document.querySelector("#c4-board");
    this.startErrorContainer = document.querySelector('#start-error-container'); 
    this.instantiateBoard();
  }
  

  //GAME CLASS FUNCTIONS

  //INITIALIZE BOARD ARRAY
  initializeBoard(){
    this.board = Array.from(Array(this.height), () => new Array(this.width));
    console.log(this.height);
    console.log(this.width);
    for(let i = 0; i < this.height; i++){
      for(let j = 0; j < this.width; j++){
        this.board[i][j] = null;
      }
    }
    return this.boardArr;
  }

  //CREATE BOARD ON DOM
  createBoard(){
    for(let i = 0; i < this.board.length; i++){
      for(let j = 0; j < this.board[0].length; j++){
        let newDiv = document.createElement('div');
        newDiv.classList.add('c4-sq');
        newDiv.id = `${i}${j}`;
        this.c4Board.appendChild(newDiv);
      }
    }
  }

  //INITIALIZE AND CREATE BOARD ON DOM
  instantiateBoard(){
    this.createBoard(this.initializeBoard());
  }

  //FIND THE LOWEST DROPPABLE INDEX IN COLUMN
  //GOES BOTTOM TO TOP TO FIND FIRST NON-NULL i INDEX IN jdx'th COLUMN
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
  //IF PLAYER TRIES TO PLAY A TOKEN IN A FULL COLUMN
  createErrorDiv(){
    if (!this.errorDivPresent){
        let errorDiv = document.createElement('div');
        errorDiv.id = 'error-display';
        errorDiv.innerText = "Sorry, there are no spaces left in that column!"
        this.startErrorContainer.appendChild(errorDiv);
        myGame.errorDivPresent = true; 
        //This line uses wrong 'this'? 
        window.setTimeout(this.removeErrorDiv.bind(this), 1500);
    }
  }
  removeErrorDiv(){
    console.log(`in removeErrorDiv function: this: ${this}`);
    let errorDivToRemove = document.getElementById("error-display");
    errorDivToRemove.remove();
    this.errorDivPresent = false;
  }

  //UPDATE SPACE ON DOM TO SHOW PLAYED SPACE
  placePiece(board, index){
    let placedId = index.join('');
    if(this.p1Turn === true){
        let playedSpace = document.getElementById(placedId);
        playedSpace.classList.add("p1");
        document.querySelector(".p1").style.backgroundColor = this.p1.color;
        this.p1Turn = false;
    }
    else{
        let playedSpace = document.getElementById(placedId);
        playedSpace.classList.add("p2");
        document.querySelector(".p2").style.backgroundColor = this.p2.color;
        this.p1Turn = true;
    }
  }

  //WINCHECK
  hasWon(){
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match player
      let player = 0;
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
    window.setTimeout(this.removeErrorDiv.bind(this), 1500);
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
    // this = this;
    console.log(`in resetBoard function: this: ${this}`);
    this.initializeBoard();
    this.resetTokens();
    this.gameOver = false;
  }

  //RESETS BOARD AFTER A WIN
  resetTimer(){
    window.setTimeout(this.resetBoard.bind(this), 1500);
  }




      //END GAME CLASS
} 




          //HANDLERS AND NEW GAME INSTANCE

//I didn't figure out how to put the event handlers inside of the class
//was struggling with getting the startbutton.addEvent... to work within it
//I get that this means that the handlers are specific to the instance...
///I guess it's simple enough to put input of size to create a new instance
//and give that to the myGame variable, so I don't think this is a problem

// const myC4 = new Game(6,7);

// const mySevenByEight = new Game(7,8);
//something in my placement/update logic is only set for 6x7...can fix



class Player {
  constructor(color) {
    this.color = color;
  }
}

const myGame = new Game(6,7);

//START BUTTON CALLS TO INITIALIZE COLORS OR RESET BOARD
startButton.addEventListener('click', function(e){
  myGame.gameInProgress = true;
  myGame.resetBoard();
  myGame.p1 = new Player(document.getElementById('p1-color').value);
  myGame.p2 = new Player(document.getElementById('p2-color').value);
});  

//SQCLICK = PLACE PIECE
c4Board.addEventListener('click', function(e){
  if(e.target.classList.contains('c4-sq') && !myGame.gameOver){
      let sqId = e.target.id;
      let index = myGame.getPieceDropIndex(myGame.board, sqId);
      if(index === undefined){
        myGame.createErrorDiv();
      }
      else{
        myGame.placePiece(myGame.board, index);
          let winnerFound = myGame.hasWon(myGame.board, index, sqId);
          if(winnerFound){
            myGame.gameOver = true;
              !myGame.p1Turn ? console.log("Player 1 wins!") : console.log("Player 2 wins!");
              myGame.createWinDiv();
              //check what 'this' is and how to make sure it's proper
              //moved window.setTimeout inside of function inside of Class...15MINUTE MESS TO FIGURE THAT OUT
              myGame.resetTimer();
           }
      }
  }
});

