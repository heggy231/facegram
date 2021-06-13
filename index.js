require("dotenv").config();
// 1. initialize express and templates
const express = require("express");
const cors = require("cors");
const es6Renderer = require("express-es6-template-engine");
// named export: v4 but rename it uuidv4
const { v4: uuidv4 } = require("uuid");
const session = require("express-session");
const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;
const pgp = require("pg-promise")(); // create pgp instance to get ready for db connection

const app = express();

// const data = require('./dataObject') // no longer need; since real db to save data
// console.log(data)

// pg-promise config obj https://github.com/vitaly-t/pg-promise/wiki/connection-syntax
const cn = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS
};
const db = pgp(cn); // faceGram db obj created

// when you see app.use - it is middleware, specify static directory
// add express middleware for body parsing when getting req.body also for form urlencoded
app.use(cors()); // allow cors
app.use(express.static("public")); // assign static public folder
// middleware for body parsing
app.use(express.json()); // for req.body parsing
app.use(express.urlencoded({ extended: true })); // for req.body parsing application/x-www-form-urlencoded (converts str => json)

// Configure Template Engine
app.engine("html", es6Renderer);
app.set("views", "templates");
app.set("view engine", "html");

// Place session middleware before passport
// set cookie expiration maxAge so re-login.
// secret is key that lets browser know I am the server.
const sess = {
  secret: "keyborad penguin",
  cookie: { maxAge: 60000 }
};
app.use(session(sess));

// ----------------------------------------------------------------------------
//                                PASSPORT
// ----------------------------------------------------------------------------
// http://www.passportjs.org/packages/passport-github/
// creating a new instance of
//  Remember callbackURL is what I set when signed up for Github OauthApp
// Setting up Passport & passport strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3030/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
      // user profile
      console.log(JSON.stringify(profile));

      // ASIDE: Access Tokens are super important!! Treat them like pwd (never store in plain text)
      // You can use this to talk to Github API
      console.log("Access Token: " + accessToken);

      // Tell passport job is done. Move on, I got user profile
      // this callback runs when someone logs-in
      // cb(errorMessage = Null No error here, profile=>save the profile info)
      cb(null, profile);
    }
  )
);

// Attach the passport middleware to express
app.use(passport.initialize());

// BEGIN these next lines make it work with the session middleware
app.use(passport.session());

passport.serializeUser(function(user, done) {
  //What goes INTO the session here; right now it's everything in User
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  done(null, id);
  //This is looking up the User in the database using the information from the session "id"
});

// process.env.<key>
console.log("GITHUB_CLIENT_ID: ===>", process.env.GITHUB_CLIENT_ID);
// result => GITHUB_CLIENT_ID: ===> 6593c4b7e0153e4378b3

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login.html");
}

app.get("/auth/github", passport.authenticate("github"));

// Callback: this must match the name in the GitHubStrategy above AND the one we typed in Github UI
app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

// 6. Post Method to handle new user
app.post("/profile", ensureAuthenticated, async (req, res) => {
  console.log("full req.body: =====>", req.body);
  /**
   * req.body is what I put in my form or postman = {
      name: 'Kang',
      email: 'Dog@gmail.com',
      avatar: 'https://placeimg.com/128/128/arch/sepia'
    }
  */

  // grab form data, req.body
  const profile = req.body;

  try {
    // save to db and get the pk (profiles.id)
    let dbRes = await db.one(`
      INSERT INTO profiles (name, email, avatar)
      VALUES ($1, $2, $3) RETURNING id;`,
      [profile.name, profile.email, profile.avatar]
    );

    profile.id = dbRes.id;  // dbRes => {id : 1}
    console.log("$$$$$$ newly profile: ====>", JSON.stringify(profile));
    /**
     * profile obj => {
     * "name":"Kang",
     * "email":"Dog@gmail.com",
     * "avatar":"https://placeimg.com/128/128/arch/sepia",
     * "id":7
     * }
     */
    res.status(200).send(profile);
  } catch (err) {
    res.status(500).send("server error creating profile");
  }
});

// 4. Detail page here.
app.get("/profile/:id", ensureAuthenticated, async (req, res) => {
  let profile = {};

  try {
    // dbRes db.any() => [{}, {}]
    let dbRes = await db.any(`
      SELECT * FROM profiles
      WHERE id = $1;`,
      [req.params.id]);
    
    // no result came back for the id, 404 pg doesn't exist
    if (dbRes.length === 0) {
      res.status(404).send("profile id not found");
      return
    }

    // When duplicate user id
    if (dbRes.length > 1) {
      res.status(500).send("server error: duplicate profile id");
      return
    }

    // select first item from dbRes [{id: 4, "name": "Kang", ...},{}]
    profile = dbRes[0];

    // images = [{id: 4, "name": "Kang", url: "www.placeimage.com"},{}]
    const images = await db.any(`
      SELECT * FROM images
      WHERE profile_id = $1`,
      [profile.id]);

    // returns array of ["image.url.com", "", ""]
    profile.images = images.map(image => image.url);
    console.log('$$$$$$$$ final profile with img url $$$$$$ ===>', JSON.stringify(profile));
    /**
     * final resulting `profile` obj after adding images
     * {"id":3,
     * "name":"Minnie Hessel",
     * "email":"Ron40@gmail.com",
     * "avatar":"https://cdn.fakercloud.com/avatars/jervo_128.jpg",
     * "images":["http://placeimg.com/640/480/food"]}
     */
  }
  catch (err) {
    res.status(500).send("server error: could not query db");
  }

  res.render("profile", {
    locals: {
      profile,
      title: "FaceGram APP"
    }
  });
});

// this route logs you out and redirect to home /
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// show the req.session data
app.get("/sessiondata", ensureAuthenticated, (req, res) => {
  console.log(`
    You are on session data page req.session
  `);
  res.send(`
    <h1>Session Data (from the server) req.session:</h1>
    <pre>${JSON.stringify(req.session, null, "\t")}</pre>
  `);
});

app.get("/kdrama", ensureAuthenticated, (req, res) => {
  res.send(`<h1>Heggy's super secret best kdrama list:</h1>
    <ul>
      <li>Autum in My Heart</li>
      <li>Full House</li>
      <li>Stairway to Heaven</li>
    </ul>
  `);
});

// 5. List page here
app.get("/", ensureAuthenticated, async (req, res) => {
  /**
   * return array [] of obj from db.any()
   */
  let profileArray = [];

  try {
    profileArray = await db.any(`SELECT * FROM profiles;`);
    console.log('####### !!!!!!! profileArray data => !!!!! #####', profileArray);
    /** profileArray from database
     * [{
          id: 1,
          name: 'Ricky Berge',
          email: 'Lexie.Parisian@yahoo.com',
          avatar: 'https://cdn.fakercloud.com/avatars/edgarchris99_128.jpg'
        }, {...}, {...}]
     */
  }
  catch (err) {
    res.status(500).send("server error: could not query db");
  }

  res.render("home", {
    locals: {
      profileArray,
      title: "FaceGram APP",
      path: req.path
    }
  });
});

// 3. Write out a route to test your server is working
app.get("*", (req, res) => {
  res.send("catch all");
});

// 2. Start your express server
app.listen(3030, () => {
  console.log("running on port http://localhost:3030");
});
