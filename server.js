// 1. initialize express and templates
const express = require("express");
const cors = require('cors');
const es6Renderer = require('express-es6-template-engine');

// name export v4 but rename it uuidv4
const { v4: uuidv4 } = require('uuid');

const app = express();

// when you see app.use - it is middleware, specify static directory
app.use(cors());
app.use(express.static('public'));
// middleware for body parsing
app.use(express.json());
// for parsing application/x-www-form-urlencoded (converts str => json)
// app.use(express.urlencoded({ extended: true })) 

// Configure Template Engine
app.engine('html', es6Renderer);
app.set('views', 'templates');
app.set('view engine', 'html');

const data = require('./dataObject')
// console.log(data)

// 6. Post Method to handle new user
app.post("/profile", (req, res) => {
    console.log('full req.body: =====>', req.body);

    // Create ID
    const id = uuidv4();

    // setting keys
    req.body.id = id;
    req.body.images = [];
    // Save data server memory only exists during server is on
    data[id] = req.body;
    console.log('after ___full data transform: ===>', data);
    console.log('after ___full id transform: ===>', id);
    console.log('after ___full data[id] transform: ===>', data[id]);
    console.log('after ___full req.body transform: ===>', req.body);
    res.status(200).send()

});

// 4. Detail page here. 
app.get("/profile/:id", (req, res) => {
    const profile = data[req.params.id];
    // const {id} = req.params  // same as set let id = req.params.id (the value of :id passed into the route)

    if(!profile){
        res.status(404).render("notfound");
    } else {
      res.render("profile", {
        locals: {
            profile,
            title: 'FaceGram APP'
        }
      });
    }
})

// 5. List page here
app.get("/", (req, res)=>{
    const profileIds = Object.keys(data);
    const profilesArray = profileIds.map( id => data[id]);
    // console.log(profilesArray)

    res.render('home', {
        locals: {
            profilesArray,
            title: 'FaceGram APP',
            path: req.path
        }
    })
})

// 3. Write out a route to test your server is working
app.get("*", (req, res)=>{
    res.send("catch all")
})

// 2. Start your express server
app.listen(3030, ()=>{
    console.log("running on port http://localhost:3030")
})
