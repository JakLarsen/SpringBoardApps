            
            

                                        //GLOBAL VARIABLES 



const startBtn = document.querySelector('#start-btn');
const numbers = Array.from(Array(30).keys());
const gameTable = document.querySelector('#game-table');
let ourClueObj = {};
let gameon = false;



                                        //MAIN FUNCTIONS



//SHUFFLE AN ARRAY OF 30 NUMBERS USING FISHER YATES ALG
//RETURNS FIRST 6 RANDOMIZED NUMBERS
function shuffle(numbers){

    let idx = numbers.length;
    let tempVal = 0;
    let randomIdx = 0;

    while(0 !== idx){
        randomIdx = Math.floor(Math.random()*idx);
        idx -= 1;
        tempVal = numbers[idx];
        numbers[idx] = numbers[randomIdx];
        numbers[randomIdx] = tempVal;
    }
    return numbers.slice(0,6);
}

//TAKES IN OUR API CATEGORY DATA AND OUR 6 RANDOMIZED NUMBERS 0-29
//RETURNS 6 CORRESPONDING CATEGORY STRINGS IN AN ARRAY WITH IDS
function getSixCategories(categoryData, ourCategoryIdxs){
    
    let ourCategoryArr = categoryData.data;
    let ourCategories = [];
    let ourCategoryIds = [];

    for (let idx of ourCategoryIdxs){
        ourCategories.push(ourCategoryArr[idx].title);
        ourCategoryIds.push(ourCategoryArr[idx].id);
    }
    return [ourCategories, ourCategoryIds];
}

//CREATES THE CATEGORY HEADERS ON THE DOM USING OUR CATEGORIES ARRAY
function createCategoryHeaders(ourCategories){
    //div acting as table header container
    let trTh = document.createElement('div');
    trTh.id = "tr-header";
    gameTable.append(trTh);
    //created elements for headers
    for (let i = 0; i < 6; i++){
        let newTh = document.createElement('th');
        newTh.id = `th${i}`;
        newTh.innerText = ourCategories[i];
        newTh.classList.add('tr-th')
        trTh.appendChild(newTh);
    }
}

//CREATE THE BOARD OF CLUE SQUARES
//BOARD SETUP BY ID VALUES
    //00 01 02 03 04 05
    //10 21 22 23 24 25
    //ETC.
function createClueDivs(){
    
    //row containers
    for(let i = 0; i < 5; i++ ){
        let newRow = document.createElement('div');
        newRow.classList.add('row');

        //creating 6 cards across within each row container
        for(let j=0; j < 6; j++){
            let newTd = document.createElement('div');
            newTd.id = `${i}${j}`;
            newTd.innerText = '?'
            newTd.classList.add('tr-td');
            newRow.append(newTd);
            gameTable.append(newRow);
        }
    }
}   

//GRAB CLUE QUESTIONS AND ANSWER DATA FROM THE API ACCORDING TO OUR RANDOM CATEGORY IDS
async function createClues(ids){
    
    let questions = [];
    let answers = [];

    //FOR EACH CATEGORY ID
    for(let id of ids){
        //GET THE QUESTION/ANSWER DATA
        const clueData = await axios.get(`http://jservice.io/api/clues/?category=${id}`);

        //FOR EACH TAKE FIRST 5 QUESTIONS - EXTRACT THE QUESTION AND ANSWER DATA
        //Wanted to randomize this, but many categories only had 5 questions
        for(let i = 0; i < 5; i++){
            questions.push(clueData.data[i].question);
            answers.push(clueData.data[i].answer);
        }
    }
    return [questions, answers];
}

//CREATE A CONTAINER OBJ TO HOLD OUR CLUE OBJECTS - ACCESSIBLE USING THEIR BOARD INDEX AS A KEY
    // {BoardIDX: {
    //                 idx: :boardIDX,
    //                 clue: :clueString,
    //                 answer: :answerString
    //             }
    // }
    //BOARD SETUP
    //00 01 02 03 04 05
    //10 21 22 23 24 25
    //ETC.
function createClueObj(rows = 5, cols = 6, questions, answers){
    let counter = 0;
    for (let i = 0; i < cols; i ++){
        for (let j = 0; j < rows; j++){
            ourClueObj[`${j}${i}`] = {
                idx: `${j}${i}`,
                clue: `${questions[counter]}`,
                answer: `${answers[counter]}`
            }
            //using premade arrays of 30 question elements and a separate one with 30 answers
            //those two arrays are set up so that every 6th is within the same category
            //in order, so we just scroll through all 30 with a counter
            //and index every 6 with a new row value
            //(i.e. 00 01 02 03 04 05
            //      10 11 12 13 14 15)
            counter += 1;
        }
    }

    //gives us a clueObj that should look like this:
    //ourClueObj = {
    //  00: {clue: 'clue for category0(column0)', answer: 'answer for that clue'}
    //  01: {clue: 'clue for category1(column1)', answer: 'answer for that clue'}
    //  02: {clue: 'clue for category2', answer: 'answer for that clue'}
    //  03: {clue: 'clue for category3', answer: 'answer for that clue'}
    //  04: {clue: 'clue for category4', answer: 'answer for that clue'}
    //  05: {clue: 'clue for category5', answer: 'answer for that clue'}
    //  10: {clue: 'clue for category0(column0)', answer: 'answer for that clue'}
    //  11: {clue: 'clue for category1(column1)', answer: 'answer for that clue'}
    //  12: {clue: 'clue for category2', answer: 'answer for that clue'}
    //  13: {clue: 'clue for category4', answer: 'answer for that clue'}
    //etc.
    //}   
    return ourClueObj;
}

//RESET BOOLEANS, OUR CLUE OBJ, AND DELETE ALL CHILD NODES FROM GAMETABLE TO RESET BOARD
function resetBoard(){
    while (gameTable.firstChild) {
        gameTable.removeChild(gameTable.firstChild);
    } 
    ourClueObj = {};
    gameon = false;
}



                                        //HANDLERS



//ON NEW GAME CLICK
startBtn.addEventListener('click', async function(e){

    if(!gameon){

        gameon = true;
        
        //SHUFFLE AN ARRAY OF NUMBERS 0-29, RETURNING AN ARRAY OF THE FIRST 6 RANDOMIZED NUMBERS
        let ourCategoryIdxs = shuffle(numbers);

        //GET THE CATEGORY DATA FROM THE API
        const categoryData = await axios.get('http://jservice.io/api/categories/?count=30');

        //USING OUR ARRAY OF 6 RANDOM NUMBERS 0-29, GET THE CORRESPONDING CATEGORIES AND IDS
        //RETURNS A 2D ARR CONTAIING [[CATEGORY TITLE], [ID]]
        let ourCategories = getSixCategories(categoryData, ourCategoryIdxs);
        const [categories, ids] = ourCategories;

        //CREATE THE CATEGORY HEADERS ON THE DOM
        createCategoryHeaders(categories);

        //CREATE THE CLUECARD DATA FOR 5 QUESTIONS WITHIN A CATEGORY AND RECEIVE CLUES AND ANSWERS
        let ourClues = await createClues(ids);
        const [questions, answers] = ourClues;

        //CREATE A CONTAINER OBJ TO HOLD OUR CLUES OBJECTS - ACCESSIBLE USING THEIR BOARD INDEX AS A KEY
        // {BoardIDX: {
        //                 idx: :boardIDX,
        //                 clue: :clueString,
        //                 answer: :answerString
        //             }
        // }
        ourClueObj = createClueObj(5, 6, questions, answers);

        //CREATE THE ARRAY OF DIVS ON THE BOARD
        createClueDivs(); 
    }
    else{
        resetBoard();
    }   
});

//CARD CLICK LOGIC HANDLER
let checkingQuestion = false;
let showingAnswer = false;
let checkedCard = "";

gameTable.addEventListener('click', function(e){

    let targetCard = e.target;
    let targetId = e.target.id;

    //IF NOT CURRENTLY ON A QUESTION CARD, START A NEW ONE
    if(!checkingQuestion && targetCard.id != 99){
        targetCard.innerText = ourClueObj[targetId].clue;
        checkingQuestion = true;
        checkedCard = e.target.id;
    }
    //IF ON A QUESTION CARD NOT ANSWERED, OR ON AN ALREADY ANSWERED CARD(99)
    //OR ATTEMPTING TO START A NEW ONE WHILE ONE IS OPENED
    else{
        //IF ON A QUESTION CARD NOT ANSWERED YET
        if(e.target.id == checkedCard && targetCard.id != 99){
            targetCard.innerText = ourClueObj[targetId].answer;
            checkingQuestion = false;
            checkedCard = "";
            //CARD IS ANSWERED
            targetCard.classList.add('answered');
            targetCard.id = 99;
        }
        //IF ON A QUESTION CARD THAT HAS BEEN ANSWERED, OR STARTING A NEW ONE WHILE ONE IS OPEN
        else{
            // throwErrDiv();
            alert('Please finish card you are on. If answered, try a new card');
        }
    }

})





                                    //WAYS TO IMPROVE:





//THROW ERROR DIV INSTEAD OF ALERT
//CHECK LOGIC TO SEE IF YOU CAN MAKE MORE EFFECTIVE
//REFACTOR SO THAT WE CAN DYNAMICALL CHANGE THE SIZE OF THE BOARD
    //- right now, we take 30 categories, 30 questions and answers, 
    //- take 6 random categories from a pool of 30, and fit it to a 6x5 board
    //- could probably use a single variable: boardSize = cols*rows which would be used for all of the 30s
    //- then use cols and rows to define the rest - would have to make the css fit based on sizes
    //- would have to make the css resize based on screens, etc. CSS scaling would be most of the work here
//FORCEWRAP CONTENT IF IT IS TOO WIDE - one or two of the strings peak just outside of the card divs instead of wrapping
    //-I'm assuming they are strings without separators, so they don't wrap...or something
//Capitalize the Headers 
    //-const UpperHeader = header[0].toUpperCase() + header.slice(1);
//Maybe learn to show a loading circle while dom loads??? Sometimes it takes 1-3sec
//If an answer is enclosed in <i>answer</i> italicize it
//ASK USER INPUT IF THEY GOT IT RIGHT OR WRONG, UPDATE CARD WITH COLORS ACCORDINGLY
    //- ADD A SCORE COUNTER
//ADD A BEST SCORE: WITH A BEST TIME AT YOUR HIGH SCORE
    //-Means adding a timer
//Could make NEW GAME reset the board with one click as well instead of 2







                                    //DONE:
// -create a board, start button
// -create a table for cards
// -figue out why styling isn't working with table
// --use divs instead, tables are lame and restrictive
// -look into advantageous uses of tables in the future
// -create some CSS
// -make it look at least presentable - BETTER
// -use FISHER YATES for shuffle funct
// 
//
// 
// [insert 10 hours of working without notating steps taken or saving branches hmm...]
//
// 
//
// -CHANGE CLUE 2D ARR TO OBJ INDEXABLE BY KEYS REPRESENTED BY BOARD INDEX VALUES
    //-WAYYYY BETTER TO ACCESS INDEXES
// -make an array to hold the corresponding questions and answers for the correct header id
// -on first click, show question 
// --catch trying to click another card while on a question
// -on second click, show answer
// -update question card on DOM
// -update clickableness of question card
// -remove all divs when hitting 'new game'
// -organize
// -done
