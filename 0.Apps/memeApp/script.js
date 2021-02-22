// FORM SUBMISSION

const form = document.querySelector("#meme-form");
const imageInput = document.querySelector("#image-input");
const topTextInput = document.querySelector("#top-text-input");
const botTextInput = document.querySelector("#bottom-text-input");
const delBtn = document.querySelectorAll(".del-button");
const memeWrappers = document.querySelectorAll(".meme-image-wrapper");
const memeContainer = document.querySelector("#meme-wrapper");


form.addEventListener("submit", function(e){
    e.preventDefault();

    const imageLink = imageInput.value;
    const topText = topTextInput.value;
    const botText = botTextInput.value;

    imageInput.value = "";
    topTextInput.value = "";
    botTextInput.value = "";

    console.log(imageLink, topText, botText);
    //Check for no photos added (text is optional)
    if(imageLink.length === 0){
        alert("No image");
    }
    //check for valid image extension in url
    // if (!is_image(imageLink)){
    // }
    else{
        createMeme(imageLink, topText, botText);
    }
})

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

// DELETE MEME FROM PAGE
memeContainer.addEventListener("click", function(e){
    console.log("clicked");
    if(e.target.tagName ==="BUTTON"){
        console.log("BUTTON!");
        e.target.parentElement.remove();
    }
})



//catch for no text
//catch for not valid image address (can check if even a valid url)
    //is the data that you are downloading an image - cehck javascript libraries
//force text to wrap inside of image
//force text limit to 2 lines
//Long string and empty text - skype