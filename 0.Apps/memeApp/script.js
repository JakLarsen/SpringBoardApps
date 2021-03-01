


                                        //GLOBAL VARIABLES



const form = document.querySelector("#meme-form");
const imageInput = document.querySelector("#image-input");
const topTextInput = document.querySelector("#top-text-input");
const botTextInput = document.querySelector("#bottom-text-input");
const delBtn = document.querySelectorAll(".del-button");
const memeWrappers = document.querySelectorAll(".meme-image-wrapper");
const memeContainer = document.querySelector("#meme-wrapper");
const body = document.querySelector('#body');
let errDivPresent = false;



                                        //MAIN FUNCTIONS


               
// CREATE MEME
function createMeme(imageLink, topText, botText){

    const memeWrapper = document.querySelector("#meme-wrapper");
    const newMeme = document.createElement('div');
    const newImg = document.createElement('img');
    const newTopText = document.createElement('span');
    const newBotText = document.createElement('span');
    const newDelBtn = document.createElement('button');
    
    newMeme.classList.add("meme-image-wrapper");
    newImg.classList.add("meme-img");
    newImg.src = imageLink;
    newTopText.classList.add("top-text");
    newTopText.innerText = topText;
    newBotText.classList.add("bot-text");
    newBotText.innerText = botText;
    newDelBtn.innerText="X";
    newDelBtn.classList.add("del-button");

    newMeme.appendChild(newImg);
    newMeme.appendChild(newTopText);
    newMeme.appendChild(newBotText);
    newMeme.appendChild(newDelBtn);

    memeWrapper.appendChild(newMeme);
}

//REMOVE ERROR DIV
function removeErrDiv(){
    let ourErrDiv = document.querySelector('#err-div');
    ourErrDiv.remove();
    errDivPresent = false;
}

//THROW ERROR DIV
function throwErrDiv(errMessage){
    let errDiv = document.createElement('div');
    errDiv.id = 'err-div';
    errDiv.innerText = errMessage;
    memeContainer.before(errDiv);
}

//VALIDATION CHECKS FOR
    //-MISSING IMAGE
    //-MISSING TOP OR BOTTOM TEXT
    //-TOP OR BOTTOM TEXT > 40 CHARS
function isValidSubmit(imageLink, topText, botText){

    //validates to catch empty inputs
    if(imageLink.length === 0 || topText.length === 0 || botText.length === 0){
        errDivPresent = true;
        throwErrDiv("Missing Field Input");
        return false;
    }
    //validates to catch long strings
    else if(topText.length > 40 || botText.length > 40){
        errDivPresent = true;
        throwErrDiv("Too many characters (Limit: 40)");
        return false;
    }
    // Might need a check that validates on a loaded element instead of form submit 
    // else if(PAGE DOESNT LOAD AN IMAGE ON SUBMIT){
        // throwErrDiv("Image Not Found");
        // return false;
    // }
    //validates to catch improper image formats and URLs
        //--shortfall: if you type anything containing jpg, jpeg, png, or gif in the input
    else if(!imageLink.includes('jpg') && !imageLink.includes('jpeg') && !imageLink.includes('png') && !imageLink.includes('gif')){
        errDivPresent = true;
        throwErrDiv("Not a valid image address");
        return false;
    }
    else{
        return true;
    }
}


                                        //HANDLERS



//MEME SUBMIT
form.addEventListener("submit", function(e){
    e.preventDefault();

    if(errDivPresent){
        removeErrDiv();
    }

    const imageLink = imageInput.value;
    const topText = topTextInput.value;
    const botText = botTextInput.value;
    imageInput.value = "";
    topTextInput.value = "";
    botTextInput.value = "";

    if(isValidSubmit(imageLink, topText, botText)){
        createMeme(imageLink, topText, botText);
    } 
});

// DELETE MEME FROM PAGE
memeContainer.addEventListener("click", function(e){
    if(e.target.tagName ==="BUTTON"){
        e.target.parentElement.remove();
    }
});






            //ACTION ITEMS



// Meme generator - guard against empty text
// Meme generator - handle loooong string 



            //DONE SINCE SKYPE WEEK OF 2/22



//catch for no text
//Long string and empty text
//Force word-break if long, unseparated string
//Standardize image sizes
//organize code
//moved validation logic into its own function
//created throwErrDiv to display errors in a less abraisive way
//Fix error-throwing Logic
//Fix error-throwing removal
//Create an image-extension validation catch



            //TODO - Explore data type load validation on the DOM











            
            //NOTES



//in our catch for not valid image address:
    // - valid URL check is not enough obviously
    // - checking common image extensions could fail if you type in those extensions
    // - might need to get information from the URL request about file type?
        //- is there standardized data that can be validated here? Possibly
        //- is the data that you are downloading an image??
    // - OR check if an image properly loads on the DOM - something read about this seemed promising

    // INTERIM AND SOLID FIX WITHOUT DETRIMENTAL SHORTFALLS FOR OUR PURPOSES
        // - if URL contains "jpg", "jpeg", "gif", or "png" etc.







