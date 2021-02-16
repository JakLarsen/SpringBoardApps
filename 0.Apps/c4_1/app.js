


                    //MAIN GLOBAL VARIABLES



let board = initializeBoard(6,7);
const c4Board = document.querySelector("#c4-board");
const startButton = document.querySelector('#start-btn');
const startErrorContainer = document.querySelector('#start-error-container');

let gameInProgress = false;
let p1Turn = true;
let errorDivPresent = false;
let gameOver = false;


                    // MAIN GAME FUNCTIONS



//INITILIZES BOARD ARRAYS
function initializeBoard(height, width){
    let boardArr = Array.from(Array(height), () => new Array(width));
    for(let i = 0; i < height; i++){
        for(let j = 0; j < width; j++){
            boardArr[i][j] = null;
        }
    }
    return boardArr;
}

//CREATE BOARD ON DOM
function createBoard(board){
    for(let i = 0; i < board.length; i++){
        for(let j = 0; j < board[0].length; j++){
            let newDiv = document.createElement('div');
            newDiv.classList.add('c4-sq');
            newDiv.id = `${i}${j}`;
            c4Board.appendChild(newDiv);
        }
    }
}

//INITIALIZE AND CREATE BOARD ON DOM
function instantiateBoard(){
    createBoard(initializeBoard(6,7));
}


//REMOVE PLAYER TOKEN CLASSES
function resetTokens(board){
    for(let i = 0; i < board.length; i++){
        for(let j = 0; j < board[0].length; j++){
            let idVal = i.toString()+j.toString();
            let targetDiv = document.getElementById(idVal);
            targetDiv.classList.remove('p1');
            targetDiv.classList.remove('p2');
        }
    }
}

//RESET BOARD ARRAY AND RESET TOKENS
function resetBoard(){
    board = initializeBoard(6,7);
    resetTokens(board);
    gameOver = false;
}


//FIND THE LOWEST DROPPABLE INDEX IN COLUMN
//GOES BOTTOM TO TOP TO FIND FIRST NON-NULL i INDEX IN jdx'th COLUMN
function getPieceDropIndex(board, sqId){
    let idx = sqId.slice(0);
    let jdx = parseInt(sqId.slice(1));
    for(let i = board.length - 1; i >= 0; i--){
        if(board[i][jdx] === null){
            updatePlacedBoardIndex(i, jdx);
            return [i, jdx];
        }
    }
}

//UPDATE THE BOARD ARRAY WITH PLAYER IDENTIFIERS: 1 OR 2
function updatePlacedBoardIndex(i, jdx){
    board[i][jdx] = p1Turn === true ? 1 : 2;
}

//UPDATE SPACE ON DOM TO SHOW PLAYED SPACE
function placePiece(board, index){
    let placedId = index.join('');
    if(p1Turn === true){
        let playedSpace = document.getElementById(placedId);
        playedSpace.classList.add("p1");
        p1Turn = false;
    }
    else{
        let playedSpace = document.getElementById(placedId);
        playedSpace.classList.add("p2");
        p1Turn = true;
    }
}

function removeErrorDiv(){
    let errorDivToRemove = document.getElementById("error-display");
    errorDivToRemove.remove();
    errorDivPresent = false;
}

//IF PLAYER TRIES TO PLAY A TOKEN IN A FULL COLUMN
function createErrorDiv(){
    if (!errorDivPresent){
        let errorDiv = document.createElement('div');
        errorDiv.id = 'error-display';
        errorDiv.innerText = "Sorry, there are no spaces left in that column!"
        startErrorContainer.appendChild(errorDiv);
        errorDivPresent = true; 
        window.setTimeout(removeErrorDiv, 1500);
    }
}

//SHOW WINNER RECYCLING CSS FROM ERROR DIV
function createWinDiv(){
    let winDiv = document.createElement('div');
    winDiv.id = 'error-display';
    if(!p1Turn){
        winDiv.innerText = "Player 1 wins!"
    }
    else{
        winDiv.innerText = "Player 1 wins!"
    }
    startErrorContainer.appendChild(winDiv);
    errorDivPresent = true;  
    window.setTimeout(removeErrorDiv, 1500);
}

function checkDiagonal(idx, player){

    //12/24 checks done with one algorithm (j decrement by 9) 
    //EXAMPLE WIN = BOARD[5][0] = 50, BOARD [4][1] = 41, BOARD [3][2] = 32, BOARD[2][3] = 23.
    if(idx >= 30){
        for(let i = idx; i < idx+4; i++){
            counter = 1;
            let checked = 1;
            let j = i;

            while (checked < 4){
                let boardI = Math.floor(j/10);
                let boardJ = j % 10;
                if (board[boardI][boardJ] === player && board[boardI][boardJ] === board[boardI -1][boardJ +1]){
                    counter += 1;
                    if (counter >=4){
                        return [true, !p1Turn];
                    }
                }
                checked += 1;
                j -= 9;
            }
        }
    }

    //other 12/24 done with another (j incrementing by 11)
    //EXAMPLE WIN = BOARD[0][0] = 0, BOARD [1][1] = 11, BOARD [2][2] = 22, BOARD[3][3] = 33.
    else{
        for(let i = idx; i < idx+4; i++){
            counter = 1;
            console.log(`i: ${i}`);
            console.log(`counter: ${counter}`);
            let checked = 1;
            console.log(`checked: ${checked}`);
            let j = i;
            console.log(`j: ${j}`);
            while (checked < 4){
                let boardI = Math.floor(j/10);
                console.log(`boardI ${boardI}`);
                let boardJ = j % 10;
                console.log(`boardJ ${boardJ}`);
                if (board[boardI][boardJ] === player && board[boardI][boardJ] === board[boardI +1][boardJ +1]){
                    counter += 1;
                    console.log(`counter: ${counter}`);
                    if (counter >=4){
                        return [true, !p1Turn];
                    }
                }
                checked += 1;
                console.log(`checked: ${checked}`);
                j += 11;
                console.log(`j: ${j}`);
            }
        }
    }
    return false;
}


//If I had more time I'd do a check in all directions only from the last played piece I think
//horizontal and vertical checks are scalable with different-sized boards
//diagnonals are specific to the board - I'd fix this as well
function hasWon(board, index, sqId){
    let counter = 1;
    let player = 0;
    //p1Turn means Player 2 played last coin (last coin played is checked for win)
    p1Turn ? player = 2 : player = 1;

        //HORIZONTAL WIN CHECKS

    for(let i = 0; i < board.length; i++){
        counter = 1;
        for(let j = 0; j < board[0].length - 1; j++){
            if (board[i][j] === player && board[i][j] === board [i][j+1]){
                counter += 1;
                if (counter >=4){
                    return [true, !p1Turn]
                }
            }
        }
    }
    
        //VERTICAL WIN CHECKS

    for(let j = 0; j < board[0].length; j++){
        counter = 1;
        for (let i = board.length - 1; i > 0; i --){
            if (board[i][j] === player && board[i][j] === board[i-1][j]){
                counter += 1;
                if (counter >=4){
                    return [true, !p1Turn]
                }
            }
        
        }
    
    }

     //DIAGONAL WIN CHECKS

    //FIRST 3 CHECK FROM TOP LEFT TO BOTTOM RIGHT WITH 1 ALGORITHM \\\\\\
    let zeroCheck = checkDiagonal(00, player);
    if (zeroCheck){return zeroCheck}
    let tenCheck = checkDiagonal(10, player);
    if (tenCheck){return tenCheck}
    let twentyCheck = checkDiagonal(20, player);
    if (twentyCheck){return twentyCheck}
    //LAST 3 CHECK FROM BOTTOM LEFT TO TOP RIGHT WITH A DIF ALGORITHM  //////
    let thirtyCheck = checkDiagonal(30, player);
    if (thirtyCheck){return thirtyCheck}
    let fourtyCheck = checkDiagonal(40, player);
    if (fourtyCheck){return fourtyCheck}
    let fiftyCheck = checkDiagonal(50, player);
    if (fiftyCheck){return fiftyCheck}
    
    return false;
}



                    //HANDLERS



//START BUTTON CALLS TO START OR RESTART
startButton.addEventListener('click', function(e){
    if(gameInProgress){
        resetBoard();
    }
    else{
        instantiateBoard();
        gameInProgress = true;
    }
});  

//SQCLICK = PLACE PIECE
c4Board.addEventListener('click', function(e){
    if(e.target.classList.contains('c4-sq') && !gameOver){
        let sqId = e.target.id;
        let index = getPieceDropIndex(board, sqId);
        
        if(index === undefined){
            createErrorDiv();
        }
        else{
            placePiece(board, index);
            
            let winnerFound = hasWon(board, index, sqId);
            if(winnerFound[0]){
                gameOver = true;
                !p1Turn ? console.log("Player 1 wins!") : console.log("Player 2 wins!");
                createWinDiv();
                window.setTimeout(resetBoard, 1500);
                
             }
        }
    }
});










