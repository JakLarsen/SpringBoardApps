"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;
let storyIdxMap = {};

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  console.debug("getAndShowStoriesOnStart");
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage("all");
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, fav) {
  console.debug("generateStoryMarkup");

  const hostName = story.url;
  console.log(storyIdxMap[story.storyId]);
  if (storyIdxMap[story.storyId] == undefined){
    return $(`
    <li id="${story.storyId}">
      <div class="first-row">
        <div class="left-links">
          <span class="fav"><i class="far fa-heart"> </i></i></span>
          <a href="${story.url}" target="a_blank" class="story-link">${story.title}</a>
        </div>
        <div class="right-links">
          <small class="story-author">by ${story.author}</small>
          <span class="delete"><i class="fas fa-trash-alt"></i></span>
        </div>
      </div>
      <div class="second-row">
        <small class="story-user">posted by ${story.username}</small>
        <small class="story-hostname">(${hostName})</small>
      </div>
    </li>
    `);
  }
  else{
    return $(`
    <li id="${story.storyId}">
    <div class="first-row">
      <div class="left-links">
        <span class="fav"><i class="fas fa-heart"> </i></i></span>
        <a href="${story.url}" target="a_blank" class="story-link">${story.title}</a>
      </div>
      <div class="right-links">
        <small class="story-author">by ${story.author}</small>
        <span class="delete"><i class="fas fa-trash-alt"></i></span>
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

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage(listName) {
  console.debug("putStoriesOnPage");
  $storyForm.hide();

  if(listName == "all"){
    $favStoriesList.hide();
    $ownStoriesList.hide();
    $allStoriesList.empty();
    // loop through all of our stories and generate HTML for them
    for (let story of storyList.stories) {
      const $story = generateStoryMarkup(story, false);
      $allStoriesList.append($story);
    }
    $allStoriesList.show();
  }
  else if(listName == "fav"){
    $allStoriesList.hide();
    $ownStoriesList.hide();
    $favStoriesList.empty();
    for(let story of currentUser.favorites){
      const $story = generateStoryMarkup(story.data.story, true);
      $favStoriesList.append($story);
    }
    $favStoriesList.show();
  }
  else if(listName == "own"){
    $allStoriesList.hide();
    $ownStoriesList.empty();
    $favStoriesList.hide();
    for(let story of currentUser.ownStories){
      // console.log(story);
      const $story = generateStoryMarkup(story, false);
      $ownStoriesList.append($story);
    }
    $ownStoriesList.show();
  }
  
}

//add story to favorite array
function addFavorite(story){
  currentUser.favorites.push(story);
};

//remove story from favorites using a {storyid: favoritesIDX} object mapping
function removeFavorite(storyId){
  console.debug('removeFavorite');
  //remove from favorites
  currentUser.favorites.splice([storyIdxMap[storyId].fav], 1);
  //remove from storyFavIdxMap
  delete storyIdxMap[storyId];
}

//DELETE A STORY

// async function deleteStory(e) {
//   console.log("Removing A Story");

//   // const $closestLi = $(e.target).closest("li");
//   // const storyId = $closestLi.attr("id");

//   //need to delete story from storyList
//   // await storyList.deleteStory(currentUser, storyId);

//   // re-generate story list
//   // await putUserStoriesOnPage();
// }
// $storyContainer.on("click", ".delete", deleteStory);

function addToOwnStories(story){
  currentUser.ownStories.push(story);
  console.log(storyMap[story.storyId]);
  console.log(currentUser.ownStories);
}


//WHEN STORY FORM SUBMITTED, GETS DATA FROM FORM, ADDS STORY, AND DISPLAYS IT ON PAGE
async function submitNewStory(e){
  e.preventDefault();
  console.debug('submitNewStory');

  let author = $authorVal.val();
  let title = $titleVal.val();
  let url = $urlVal.val();

  //Create a New Story Object from submitted values
  let newStory = await storyList.addStory(currentUser, 
    {title: title, author: author, url: "https://www.google.com/"});
  
  addToOwnStories(newStory);
  
  //CLEARLY NOT AS EFFICIENT AS APPENDING A STORY SOMEHOW
  getAndShowStoriesOnStart();

  $storyForm.hide();
}
$storySubmit.on('click', submitNewStory);

//Changed heart icon to solid if favorited, lined if not
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


function updateStoryIdxMap(){
  console.debug('updateStoryIdxMap');
  //iterate through each story in favorites list, and add their mapping
  for(let i = 0; i < currentUser.favorites.length; i++){
    //get the storyIdx at the i'th position
    //set it's fav property in storyIdxMap to it's position in favorites array
    let id = currentUser.favorites[i].data.story.storyId;
    storyIdxMap[id] = {fav: i}
  }
  console.log(storyIdxMap);
}


//WHEN A STORY FAVORITE HEART ICON IS CLICKED
//-ADD STORY TO THE CURRENT USER'S FAVORITES LIST
//-UPDATE CSS OF FAVORITE HEART
//-IF STORY ALREADY FAVORITED, REMOVE CSS AND REMOVE STORY FROM LIST
async function handleFavorites(e){
  e.preventDefault();
  console.debug('handleFavorites');
  
  let storyId = e.target.parentNode.parentNode.parentNode.parentNode.id;

  //If the target is not favorited yet
  if(e.target.classList.contains('far')){
    //changing css of heart icon to be solid
    updateFavoriteCSS(e);

    //get target story by ID from API (better way to do this is to map it as it's created from the storyList)
    const favStory = await axios({
      url: `${BASE_URL}/stories/${storyId}`,
      method: "GET",
    });

    //add target story to favorites list
    currentUser.addFavorite(favStory);

    //update STORYIDXMAP
    updateStoryIdxMap();
  }
  else{
    //change css of heart icon back to lined
    updateFavoriteCSS(e);
    //remove target story from favorites list
    removeFavorite(storyId);

    //update STORYIDXMAP
    updateStoryIdxMap();
  }
}
$storyContainer.on("click", ".fa-heart", handleFavorites);

function displayFavorites(e){
  console.debug('displayFavorites');

  putStoriesOnPage("fav");
}
$favLink.on("click", displayFavorites);

function displayMyStories(e){
  console.debug('displayMyStories');

  putStoriesOnPage("own");
}
$myStories.on('click', displayMyStories);
