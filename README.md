# FaceGram

# FaceGram: Part 4 - Database Devastation

Going back in time before we added authentication, we were using fake data to run our server. Now is the time to use a real database. Your job is to take the code provided and instead of using fake data, use `pg-promise` to manipulate a real database. Requirements:

1. The `/profile` page displays all users in the db
1. The `/profile/:id` route displays an individual user from the db
1. The signup page creates a new profile.

Don't forget to handle input errors in your express routes, like  what happens if a user doesn't exist but is requested by the APIi?

Hints for where to start:
1. Add NPM script commands to create/delete the database per the [Learning Portal DataModeling Page](https://learn.digitalcrafts.com/flex/lessons/databases/data-modeling/)
1. Install `pg-promise`
1. Test the database connection in you server.js
1. Try writing a query to handle `/profile`
1. Try writing a query to handle `/profile/:"id`
1. Try writing a query to insert a record for POST `/profile`

# Bonus Points!
1. Add a "Delete" button to each profile on the `/profile` view and on the edit profile page. 
    1. Add a new route to handle this delete.
    1. Add code in the frontend to handle the delete request (review how the signup page works for more details).
    1. Create a SQL statement to delete the record from the database.
    1. Refresh the view.

```js
var myData = [
    {name: 'Ricky Berge'},
    {name: 'Jorge Abbott'},
    {name: 'Minnie Hessel'}
];

// forEach doesn't return any new array
//  but only mutate the original array
var korean = myData.forEach(profile => profile.name = 'kim jigae');
// korean => undefined
// myData 
// [ 
//   {name: "kim jigae"},
//   {name: "kim jigae"},
//   {name: "kim jigae"}
// ]
```
- How to post using POSTMAN Posting
![postman setting](https://cdn.glitch.com/cb093bfd-142f-45b3-bdb4-52ff49e0a1c2%2FScreen%20Shot%202021-06-12%20at%204.20.53%20AM.png?v=1623486275557)

# FaceGram: Part 3 - Authentication Anarchy

FaceGram is blowing up. But right now access is ANONYMOUS - no one needs to login to create an account or view content. This is bad for business. Your job is to require a login for the site. Use the following steps to work through this new feature request.

The previous solution is included here for you to use as a starting point. You should be able to run this project as-is to start.

1. Add a "login" page/route that simply has a FaceGram heading and a button to login with Github.
    1. What kind of HTTP method do you think this should be?
    1. What URL should this button hit? Can you test this with a `console.log`?
2. Generate the secrets needed to talk with Github OAuth2 API
    1. Create an [OAUTH2 Application in Github](https://github.com/settings/developers).
    2. Add dotenv module to your project with the credentials
2. Add and configure the Passport JS Middleware.
    4. Use the class notes and the passport github strategy notes to implement the passport middleware
        1. `passport.use`
        2. `passport.initialize` and `passport.session`
        2. login route
        3. callback route
        4. logout route
3. If you're not logged in, redirect to the login page.
4. Add a logout button/anchor tag in the other template views.

# Bonus Points!
1. Automatically add a user to the dataset after they log in to your service.
2. Create a "Profile Update" page so that users can edit content (Hint: use PUT request)
3. Add a "delete profile" button that will let users delete unused profiles (Hint: use DELETE request) 
4. Use the built-in express router to move all of the authentication routes into a new file.

_
http://localhost:3000/auth/github/callback

```js
{
	"cookie": {
		"originalMaxAge": 60000,
		"expires": "2021-06-08T02:07:58.489Z",
		"httpOnly": true,
		"path": "/"
	},
	"passport": {
		"user": {
			"id": "12738884",
			"displayName": "Castaneda",
			"username": "heggy231",
			"profileUrl": "https://github.com/heggy231",
			"photos": [
				{
					"value": "https://avatars.githubusercontent.com/u/12738884?v=4"
				}
			],
			.....
				"type": "User",
				"site_admin": false,
				"name": "Castaneda",
				"company": null,
				"blog": "",
				"location": "San Francisco, Bay Area",
				"email": null,
				"hireable": true,
				"bio": "Javascript Developer",
				"twitter_username": null,
				"public_repos": 410,
				"public_gists": 115,
				"followers": 81,
				"following": 189,
				"created_at": "2015-06-03T23:22:12Z",
				"updated_at": "2021-06-07T23:25:32Z"
			}
		}
	}
}
```

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