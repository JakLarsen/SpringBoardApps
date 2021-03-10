"use strict";



                    //GLOBAL VARIABLES



//This is the global list of the stories, an instance of StoryList
let storyList;
//Our mapping to categorize our story ID's that we've gotten from the API
let storyIdxMap = {};



                    //MAIN FUNCTIONS



//GET AND SHOW STORIES ON PAGE LOAD, UPDATE OUR STORYIDXMAP
async function getAndShowStoriesOnStart() {
  console.debug("getAndShowStoriesOnStart");
  storyList = await StoryList.getStories();

  // // //UPDATE UPDATESTORYIDXMAP FROM LOCAL STORAGE TO UPDATE DOM PROPERLY
  // // //UPDATE FAVORITES LIST AND OWNSTORIES LIST TO UPDATE STORY IDX MAP
  let favs = JSON.parse(localStorage.getItem('favorites'));
  let owns = JSON.parse(localStorage.getItem('ownStories'));

  //if the favorites item in local storage isn't empty, update the list
  if (favs != null){
    currentUser.favorites = favs;
  }
  //if the ownStories item in local storage isn't empty, update the list
  if (owns != null){
    currentUser.ownStories = owns;
  }
  initializeStoryIdxMap();
  updateStoryIdxMap();

  $storiesLoadingMsg.remove();
  putStoriesOnPage("all");
}

//REFRESH AFTER ADDITION OF A STORY AND SHOW STORIES UPDATE OUR STORYIDXMAP
async function refreshShowStories() {
  console.debug("refreshShowStories");
  storyList = await StoryList.getStories();
  updateStoryIdxMap();
  $storiesLoadingMsg.remove();
  putStoriesOnPage("all");
}



//RETURNS MARKUP HTML FOR THE STORY BASED ON IF IT'S FAVORITED OR NOT
function generateStoryMarkup(story, id) {
  console.debug("generateStoryMarkup");

  const hostName = story.url;

  if (storyIdxMap[id].fav == undefined && storyIdxMap[id].own == undefined){
    console.log("1: !either fav or own");
    return $(`
      <li id="${story.storyId}">
        <div class="first-row">
          <div class="left-links">
            <span class="fav"><i class="far fa-heart"> </i></i></span>
            <a href="${story.url}" target="a_blank" class="story-link">${story.title}</a>
          </div>
          <div class="right-links">
            <small class="story-author">by ${story.author}</small>
          </div>
        </div>
        <div class="second-row">
          <small class="story-user">posted by ${story.username}</small>
          <small class="story-hostname">(${hostName})</small>
        </div>
      </li>
    `);
  }
  else if(storyIdxMap[id].fav != undefined && storyIdxMap[id].own != undefined){
    console.log("2: Both fav and own");
    return $(`
      <li id="${story.storyId}">
        <div class="first-row">
          <div class="left-links">
            <span class="fav"><i class="fas fa-heart"> </i></i></span>
            <a href="${story.url}" target="a_blank" class="story-link">${story.title}</a>
          </div>
          <div class="right-links">
            <small class="story-author">by ${story.author}</small>
            <span class="delete"><i class="fa fa-trash"></i></i></span>
          </div>
        </div>
        <div class="second-row">
          <small class="story-user">posted by ${story.username}</small>
          <small class="story-hostname">(${hostName})</small>
        </div>
      </li>
    `);
  }
  else if(storyIdxMap[id].fav != undefined){
    console.log("3: Only FAV - should be here");
    return $(`
      <li id="${story.storyId}">
        <div class="first-row">
          <div class="left-links">
            <span class="fav"><i class="fas fa-heart"> </i></i></span>
            <a href="${story.url}" target="a_blank" class="story-link">${story.title}</a>
          </div>
          <div class="right-links">
            <small class="story-author">by ${story.author}</small>
          </div>
        </div>
        <div class="second-row">
          <small class="story-user">posted by ${story.username}</small>
          <small class="story-hostname">(${hostName})</small>
        </div>
      </li>
    `);
  }
  else if(storyIdxMap[id].own != undefined){
    console.log("4: Only own");
    return $(`
      <li id="${story.storyId}">
        <div class="first-row">
          <div class="left-links">
            <span class="fav"><i class="far fa-heart"> </i></i></span>
            <a href="${story.url}" target="a_blank" class="story-link">${story.title}</a>
          </div>
          <div class="right-links">
            <small class="story-author">by ${story.author}</small>
            <span class="delete"><i class="fa fa-trash"></i></i></span>
          </div>
        </div>
        <div class="second-row">
          <small class="story-user">posted by ${story.username}</small>
          <small class="story-hostname">(${hostName})</small>
        </div>
      </li>
    `);
  }
  
}

//-GETS LIST OF STORIES ("all", "fav", or "own")
//-HIDES OTHER LISTS
//-CALLS TO GENERATE PROPER LIST'S HTML
//-DISPLAYS LIST TO DOM
function putStoriesOnPage(listName) {
  console.debug("putStoriesOnPage");

  $storyForm.hide();

  let list = storyList.stories;
  let listToShow = $allStoriesList;

  if(listName == "all"){
    $favStoriesList.hide();
    $ownStoriesList.hide();
    $allStoriesList.empty();
  }
  else if(listName == "fav"){
    list = currentUser.favorites;
    listToShow = $favStoriesList;
    $allStoriesList.hide();
    $ownStoriesList.hide();
    $favStoriesList.empty();
  }
  else if(listName == "own"){
    list = currentUser.ownStories;
    listToShow = $ownStoriesList;
    $allStoriesList.hide();
    $ownStoriesList.empty();
    $favStoriesList.hide();
  }

  //Loop through stories of corresponding array
  //-Append story to that a corresponding list
  //-Generate HTML for it and display to DOM
  for(let story of list){
    let id = story.storyId;
    const $story = generateStoryMarkup(story, id);
    listToShow.append($story);
  }
  listToShow.show();

}

//DISPLAY FAVORITES ON DOM
function displayFavorites(e){
  console.debug('displayFavorites');
  putStoriesOnPage("fav");
}
$favLink.on("click", displayFavorites);

//DISPLAY OWNSTORIES ON DOM
function displayMyStories(e){
  console.debug('displayMyStories');
  putStoriesOnPage("own");
}
$myStories.on('click', displayMyStories);

//ADD STORY TO FAVORITES ARRAY FOR CURRENT USER
function addFavorite(story){
  currentUser.favorites.push(story);
  updateStoryIdxMap();
  localStorage.setItem(`favorites`, JSON.stringify(currentUser.favorites));
};

//ADD A STORY TO OWNSTORIES ARRAY FOR CURRENT USER
function addToOwnStories(story){
  currentUser.ownStories.push(story);
  localStorage.setItem(`ownStories`, JSON.stringify(currentUser.ownStories));
}

//REMOVE STORY FROM FAVORITE ARRAY USING STORYIDXMAP OBJECT
function removeFavorite(storyId){
  console.debug('removeFavorite');
  console.log(storyIdxMap[storyId].fav)
  if(storyIdxMap[storyId].fav != undefined){
    //remove from favorites array
    currentUser.favorites.splice([storyIdxMap[storyId].fav], 1);
    //set fav attribute to undefined
    storyIdxMap[storyId].fav = undefined;
    localStorage.setItem(`favorites`, JSON.stringify(currentUser.favorites));
  }
}

//REMOVE STORY FROM OWNSTORY ARRAY USING STORYIDXMAP OBJECT
function removeFromOwnStoriesArr(storyId){
  console.debug('removeFromOwnStoriesArr');
  //remove from favorites array
  currentUser.ownStories.splice([storyIdxMap[storyId].own], 1);
  //set own attribute to undefined
  storyIdxMap[storyId].own = undefined;
  localStorage.setItem(`ownStories`, JSON.stringify(currentUser.ownStories));
}

//DELETE A STORY
async function deleteStory(e) {
  console.debug("deleteStory");

  const token = currentUser.loginToken;
  let storyToDelete = e.target.parentNode.parentNode.parentNode.parentNode;
  let idToDelete = storyToDelete.id;

  //Need to remove it from DOM
  storyToDelete.remove();

  //Delete Story from API
    const deleteStory = await axios({
      method: 'DELETE',
      url: `${BASE_URL}/stories/${idToDelete}`,
      data: {
        token,
        user: currentUser
      }
    });

  //REMOVE IT FROM THE LISTS IT'S IN, THEN UPDATE IDX MAP
  removeFavorite(idToDelete);
  removeFromOwnStoriesArr(idToDelete);

  //Force reload so it isn't on the DOM
  document.location.reload() 
}
$storyContainer.on("click", ".delete", deleteStory);

//CHANGE HEART ICON CSS TO MATCH FAVORITED STATUS
function updateFavoriteCSS(e){
  if (e.target.classList.contains("fas")){
    e.target.classList.remove("fas");
    e.target.classList.add("far");
  }
  else{
    e.target.classList.remove("far");
    e.target.classList.add("fas");
  }
}

//INITIALIZE AN INDEXMAP (storyIdxMap) OF ALL STORIES IN STORY LIST TO HOLD AN OBJECT
//{
//  STORY ID: {}
//}
//EVENTUALLY TO HOLD ARRAY INDICES OF FAVORITE AND OWNSTORIES
//{
//  STORY ID: {fav: 0, own: 1}
//} etc.
function initializeStoryIdxMap(){
  //Iterate through each Story in the StoryList and add their ID to the storyIdxMap
  for(let i = 0; i < storyList.stories.length; i++){
  let id = storyList.stories[i].storyId;
  storyIdxMap[id] = {};
  }
}



//UPDATE OUR STORYIDXMAP FOR FAVORITES AND OWNSTORIES
function updateStoryIdxMap(){

  //Iterate through each Story held in user.favorites array, adding their mapping to storyIdxMap
  for(let i = 0; i < currentUser.favorites.length; i++){
    //Get the storyId at the i'th position
    let id = currentUser.favorites[i].storyId;
    //Set it's fav property in storyIdxMap to it's position in favorites array

    //ERRORS
    //I WANT TO CREATE A FAV ATTRIBUTE WITHIN THE OBJECT AT ID KEY IF IT DOESN'T EXIST ALREADY
    let storyIdObj = storyIdxMap[id];
    console.log(storyIdObj);
    storyIdObj.fav = i;
  }

  //Iterate through each Story held in user.ownStories array, adding their mapping to storyIdxMap
  for(let i = 0; i < currentUser.ownStories.length; i++){
    //Get the storyId at the i'th position
    let id = currentUser.ownStories[i].storyId;

    //ERRORS
    //I WANT TO CREATE AN OWN ATTRIBUTE FOR OBJECT AT ID KEY IF DOESNT ALREADY EXIST
    let storyIdObj = storyIdxMap[id];
    console.log(storyIdObj);
    storyIdObj.own = i;
  }
  console.log(storyIdxMap);

  localStorage.setItem(`idxMap`, JSON.stringify(storyIdxMap));
}

 

                    //HANDLERS



//HANDLES FAVORITE HEART ICON CLICK                   
//-Add story to the currentUser's favorite list
//-Update css of the heart icon to show favorited or removed favorited
async function handleFavorites(e){
  e.preventDefault();
  console.debug('handleFavorites');
  
  let storyId = e.target.parentNode.parentNode.parentNode.parentNode.id;

  //If the target is not favorited yet
  if(e.target.classList.contains('far')){
    updateFavoriteCSS(e);

    const favStory = await axios({
      url: `${BASE_URL}/stories/${storyId}`,
      method: "GET",
    });

    addFavorite(favStory.data.story);

  }
  else{
    updateFavoriteCSS(e);
    removeFavorite(storyId);
    updateStoryIdxMap();
  }
}
$storyContainer.on("click", ".fa-heart", handleFavorites);

//WHEN STORY FORM SUBMITTED, GETS DATA FROM FORM, ADDS STORY, AND DISPLAYS IT ON PAGE
async function submitNewStory(e){
  e.preventDefault();
  console.debug('submitNewStory');

  let author = $authorVal.val();
  let title = $titleVal.val();
  let url = $urlVal.val();

  //Create new Story instance from submit form input values
  let newStory = await storyList.addStory(currentUser, 
    {title: title, author: author, url: "https://www.google.com/"});
  
  addToOwnStories(newStory);
  updateStoryIdxMap();
  
  //CLEARLY NOT AS EFFICIENT AS APPENDING A STORY SOMEHOW
  refreshShowStories();
  $storyForm.hide();
}
$storySubmit.on('click', submitNewStory);