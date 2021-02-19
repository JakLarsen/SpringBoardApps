let gameContainer = document.getElementById("game");
const body = document.querySelector('body');
const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];
const colorIdMap = {
  'red': 1,
  'blue': 2,
  'green': 3,
  'purple': 4,
  'orange': 5
};

let matches = 0
let card = 0;
let firstCardTarget = "";
let secondCardTarget = "";
let firstCard = "";
let secondCard = "";
let checkingCards = false;

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray, colorIdMap) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    //GIVE THIS READONLY NONSENSE A USABLE ID
    newDiv.id = colorIdMap[color];
    console.log(color)
    console.log(`id: ${newDiv.id}`)

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

function checkMatch(firstCard,secondCard){
  if (firstCard == secondCard){
    return true;
  }
  return false;
}

function resetPair(firstCardTarget, secondCardTarget){
  firstCardTarget.classList.replace("red-clicked", "red");
  firstCardTarget.classList.replace("green-clicked", "green");
  firstCardTarget.classList.replace("orange-clicked", "orange");
  firstCardTarget.classList.replace("purple-clicked", "purple");
  firstCardTarget.classList.replace("blue-clicked", "blue");

  secondCardTarget.classList.replace("red-clicked", "red");
  secondCardTarget.classList.replace("green-clicked", "green");
  secondCardTarget.classList.replace("orange-clicked", "orange");
  secondCardTarget.classList.replace("purple-clicked", "purple");
  secondCardTarget.classList.replace("blue-clicked", "blue");

}

function checkWin(matches){
  return matches === 5 ? true : false;
}

function resetCheckingCards(){
  window.setTimeout(function(){
    checkingCards = false;
    card = 0;
  }, 1000);
}

function resetBoard(){
  //can always have a simple container to remove game
  gameContainer.remove();
  //create new container
  let newDiv = document.createElement('div');
  newDiv.id = "game";
  body.append(newDiv);
  //make sure variable is updated to new container
  gameContainer = document.getElementById("game");
  //reshuffle
  shuffledColors = shuffle(COLORS);
  //recreate divs
  createDivsForColors(shuffledColors, colorIdMap);
}

function checkSameCard(firstCardTarget,secondCardTarget){
  if (firstCardTarget === secondCardTarget){
    return true;
  }
  return false;
}

// TODO: Implement this function!
function handleCardClick(event) {
 
  //AS LONG AS CARDS ARE NOT CURRENTLY BEING CHECKED
  if (!checkingCards){

    //set whichever card was clicked to display color
    event.target.classList.replace("red", "red-clicked");
    event.target.classList.replace("green", "green-clicked");
    event.target.classList.replace("orange", "orange-clicked");
    event.target.classList.replace("purple", "purple-clicked");
    event.target.classList.replace("blue", "blue-clicked");
  
    card += 1;
    console.log(card);

    if (card === 1){
      firstCardTarget = event.target;
      firstCard = event.target.id;
    }
    if (card === 2){
      //checking cards set in progress
      checkingCards = true;
      secondCardTarget = event.target;
      secondCard = event.target.id;
    
      //check if you clicked the exact same card
      if(checkSameCard(firstCardTarget, secondCardTarget)){
        console.log('same card');
        window.setTimeout(function(){
          resetPair(firstCardTarget, secondCardTarget);
        }, 1000);
        resetCheckingCards();
      }
      //not same card
      else{
        console.log(`checking match first card: ${firstCard} and second card: ${secondCard}`)
        if(!checkMatch(firstCard, secondCard)){
          window.setTimeout(function(){
            resetPair(firstCardTarget, secondCardTarget);
          }, 1000);
          resetCheckingCards();
        }
        else{
          matches += 1;
          console.log(matches);
          if(checkWin(matches)){
            console.log('You Win!');
            window.setTimeout(function(){
              resetBoard();
            }, 1500);
          resetCheckingCards();
          }
        resetCheckingCards();
        }
      }
    }
  }
}

// when the DOM loads

createDivsForColors(shuffledColors, colorIdMap);
