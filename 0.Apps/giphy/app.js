                    
                    
                    
                    // GLOBAL VARIABLES



const searchInput = document.querySelector('#search');
const submitBtn =  document.querySelector('#submit-btn');
const clearBtn = document.querySelector('#clear');
const key = 'u8v6k3qKMAYeFL96dCRYyOtUzLf0DxW4';
const gifContainer = document.querySelector('#gif-container');



                    //MAIN FUNCTIONS



//RETURN A RANDOM NUMBER WITHIN THE COUNT OF THE AMOUNT OF GIFS RETURNED TO US
function getRandNumb(gifAmount){
    return parseInt(Math.random() * (gifAmount));
}

//CLEAR ALL GIF DIVS FROM THE CONTAINER
function clearGifs(){
    while (gifContainer.firstChild){
        gifContainer.removeChild(gifContainer.firstChild);
    }
}

//THROW ERROR DIV IF:
    //Search input empty
    //More than 10 gifs are already being shown
    //input too long
// function throwErrDiv(){
// }

//ADD GIF IMG AND DIV TO DOM
function addGif(ourGif){
    console.log(ourGif);
    const newGifDiv = document.createElement('div');
    newGifDiv.classList.add('gif');
    const newGifImg = document.createElement('img');
    newGifImg.src = ourGif;
    newGifDiv.append(newGifImg);
    gifContainer.append(newGifDiv);
}

//INTERACT WITH GIPHY API TO GET GIFS TO USE
async function getGif(searchValue){
    const gifData = await axios.get('http://api.giphy.com/v1/gifs/search', 
    {
        params: {
            api_key: key,
            q: searchValue
        }
    });

    const gifAmount = gifData.data.pagination.count;
    const gifIdx = getRandNumb(gifAmount);
    const ourGifObject = gifData.data.data[gifIdx];
    const ourGif = ourGifObject.images.fixed_height.url

    addGif(ourGif);
}



                    //HANDLERS


//ON SEARCH CLICK, GET GIF INFO FROM API AND CREATE IT ON THE DOM
submitBtn.addEventListener('click', function(e){
    e.preventDefault();
    let searchValue = searchInput.value;
    getGif(searchValue);
});

//ON CLEAR CLICK, CLEAR ALL GIF DIVS FROM THE GIF CONTAINER
clearBtn.addEventListener('click', function(e){
    clearGifs();
})


