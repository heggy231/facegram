# FaceGram

# FaceGram: Part 2

We want to extend the FaceGram app to have a user signup page. This will require express middleware and adding a POST route like we discussed in class today.

You can use your own version of this app to do this or start with this solution. The steps to complete are as follows if you start with this template:

0. `npm install` to get all the dependencies.
1. Add the necessary express middleware for static files ~~and body parsing~~
2. Figure out where to move `./signup.html` so that the link in the index works
3. Export the `style` tags in the html templates to standalone css file(s).

# Didn't Get Here
4. Create a post method that adds a new profile to your dataset when the form is clicked
    1. The existing form will post to the route `/profile`
    2. You can use any method to generate the ID you want.
    3. Store the new profile in your `data` object so that it shows up on the homepage.


## How to run:
1. to practice use dataObject.js 
> npm run start

2. to practice use dataArray.js
> npm run devArray



Your job is to make an address book for your favorite Instagram accounts.

1. A detailed view page for each account.
1. A list of all the accounts you follow. (Just avatar, name and link to detail profile)

Use our examples of server-side rendering with templates and route params to achieve the above results. You can use the data in the dataArray module as your mock database.

1. Start with the detailed view page.
1. You should handle errors if the path is wrong
1. Styling is a bonus, focus on structure.

Remind Dan to show you what he would like this to look like :) 

- 
https://learn.digitalcrafts.com/flex/lessons/back-end-foundations/express-101/#training-exercises

- https://learn.digitalcrafts.com/flex/lessons/back-end-foundations/express-middleware/#learning-objectives

- https://www.notion.so/samuraijane/8-6abf01a329c3485dae556b65e6d93584

- https://www.notion.so/samuraijane/13-c86915d9d47648a8a73ae3a907fe9d32