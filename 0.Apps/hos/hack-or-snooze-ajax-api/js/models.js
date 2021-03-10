"use strict";



const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";



                    //STORY CLASS




class Story {

      //STORY INSTANCE

  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }

  //GOING TO DELETE? - Story.url is the same thing? 
  getHostName() {
    let hostname = this.url;
    return hostname;
  }
}



                    //STORYLIST CLASS



class StoryList {
  constructor(stories) {
    this.stories = stories;
  }

  /*
    -Gets story data from API
    -Creates a new Story instance for each
    -Creates a single StoryList instance to hold them
    -Returns this StoryList
  */
  static async getStories() {

    //QUERY - /stories endpoint of the Hack or Snooze API
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "GET",
    });

    //CREATE NEW STORY INSTANCE FOR EACH OF THE STORIES FROM API DATA
    const stories = response.data.stories.map(story => new Story(story));

    //CREATE A STORYLIST INSTANCE FOR THIS LIST OF STORIES
    return new StoryList(stories);
  }

  /*
  - POST (AUTH REQ)
  - Takes a user with an auth token and 3 pieces of story Data: {title, author, and url}
  - Posts it to the api /stories endpoint
  - Creates a new Story instance from the data and returns it
  */
  async addStory(user, newStory) {
    const token = user.loginToken;
    const storyData = await axios({
      method: 'POST',
      url: `${BASE_URL}/stories`,
      data: {
        token,
        story: { 
          title: newStory.title,
          author: newStory.author,
          url: newStory.url
        }
      }
    });
    const ourStory = new Story(storyData.data.story);

    storyIdxMap[ourStory.storyId] = {};
    return ourStory;
  }



            //END STORYLIST CLASS



}



/******************************************************************************
 * User: a user in the system (only used to represent the current user)
 */

class User {
  /** Make user instance from obj of user data and a token:
   *   - {username, name, createdAt, favorites[], ownStories[]}
   *   - token
   */

  constructor({
              username,
              name,
              createdAt,
              favorites = [],
              ownStories = []
              },
              token) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;


    // instantiate Story instances for the user's favorites and ownStories
    this.favorites = favorites.map(s => new Story(s));
    this.ownStories = ownStories.map(s => new Story(s));

    // store the login token on the user so it's easy to find for API calls.
    this.loginToken = token;
  }

  /** Register new user in API, make User instance & return it.
   *
   * - username: a new username
   * - password: a new password
   * - name: the user's full name
   */

  static async signup(username, password, name) {
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: "POST",
      data: { user: { username, password, name } },
    });

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** Login in user with API, make User instance & return it.

   * - username: an existing user's username
   * - password: an existing user's password
   */

  static async login(username, password) {
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: "POST",
      data: { user: { username, password } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** When we already have credentials (token & username) for a user,
   *   we can log them in automatically. This function does that.
   */

  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      let { user } = response.data;
      
      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }


}
