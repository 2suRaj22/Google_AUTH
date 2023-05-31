require("dotenv").config();

const express = require('express');
const app = express();
const router = express.Router();
require('dotenv').config();
const db = require('./config/mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const localStrategy = require('./config/passport-local');
const GoogleStrategy = require('./config/passport-google');
const User = require('./models/user');




const PORT = process.env.PORT || 8000;

// Use the built-in middleware for parsing incoming request bodies to use req body data
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//set up the view engine to ejs
app.set('view engine','ejs');
app.set('views','./views');


// Configure the session middleware
app.use(session({
    secret: process.env.EXPRESS_SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL, 
        autoRemove: 'native', // remove expired sessions automatically
        ttl: 7 * 24 * 60 * 60 // set session TTL to 7 days
      })
}));


// Initialize Passport and use the local strategy
app.use(passport.initialize());
app.use(passport.session());
passport.use(localStrategy);

// Configure Passport to serialize and deserialize user objects to and from the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
});



//route all req to /routes
app.use('/',require('./routes'));

//listen on PORT
app.listen(PORT,(err)=>{
    if(err){
        console.log('error:${err}');
    }
    console.log(`Server is running on http://localhost:${PORT}`);
})

