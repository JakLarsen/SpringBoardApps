"use strict";

// So we don't have to keep re-finding things on page, find DOM elements once:

const $body = $("body");

const $storiesLoadingMsg = $("#stories-loading-msg");
const $allStoriesList = $("#all-stories-list");
const $favStoriesList = $('#fav-stories-list');
const $ownStoriesList = $('#my-stories-list');

const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");

const $navLogin = $("#nav-login");
const $navUserProfile = $("#nav-user-profile");
const $navLogOut = $("#nav-logout");

const $navAddStory = $("#nav-add-story");
const $storyForm = $('#story-form');
const $storySubmit = $('#submit-button');

let $authorVal = $('#author');
let $titleVal = $('#title');
let $urlVal = $('#url');

const $storyContainer = $('.stories-container');
const $favLink = $('#nav-fav');
const $myStories = $('#nav-my-stories');


/** To make it easier for individual components to show just themselves, this
 * is a useful function that hides pretty much everything on the page. After
 * calling this, individual components can re-show just what they want.
 */

function hidePageComponents() {
  const components = [
    $allStoriesList,
    $loginForm,
    $signupForm,
  ];
  components.forEach(c => c.hide());
}

/** Overall function to kick off the app. */

async function start() {
  console.debug("start");

  // "Remember logged-in user" and log in, if credentials in localStorage
  await checkForRememberedUser();
  await getAndShowStoriesOnStart();

  // if we got a logged-in user
  if (currentUser) updateUIOnUserLogin();
}

// Once the DOM is entirely loaded, begin the app

console.warn("HEY STUDENT: This program sends many debug messages to" +
  " the console. If you don't see the message 'start' below this, you're not" +
  " seeing those helpful debug messages. In your browser console, click on" +
  " menu 'Default Levels' and add Verbose");
$(start);




//RUNNING INTO A FEW MAJOR PROBLEMS

//LOOKS LIKE ADDSTORY CLASS IS RETURNING AN OBJECT? NOT A STORY INSTANCE?
//HAD TO CHANGE getHostName BECAUSE I WAS NO LONGER WORKING WITH AN ISNTANCE THAT COULD CALL IT
//WHAT IS GOING WRONG THERE?????

//HOW TO ADD A CREATED STORY TO THE DOM IMMEDIATELY ON SUBMIT USING THEIR CODE...
//