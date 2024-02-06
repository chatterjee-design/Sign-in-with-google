import cookieParser from "cookie-parser";
import {config } from "dotenv";
import  express  from "express";
import session from "express-session";
import OAuth2Strategy from 'passport-google-oauth20';
import passport from "passport";
import cors from "cors";
import authRouter from "./Router/auth.router.js";
import User from "./Model/user.schema.js";
import { keys } from "./Keys/keys.js";

config()

const app = express();

// Middleware setup
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//define cors 
app.use(cors({ 
    origin:  'http://localhost:5500', 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  }));


// Initialize Passport and restore authentication state if available from the session
app.use(session({ secret: '1234567', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


//outhStrategy for googlelogin
 passport.use(
  new OAuth2Strategy(
    {
      clientID: keys.googleLogin.clientId,
      clientSecret: keys.googleLogin.clientSecret,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            //create a new user instance if user not found 
           const newUser = await User.create({
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails[0].value,
                image: profile.photos[0].value
            })
            await newUser.save();
            return done(null, newUser);
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize user into the session
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialize user from the session
passport.deserializeUser((obj, done) => {
    done(null, obj);
});

//fetching all the endpoints
app.get('/',(req,res)=>{
    res.json({
        success: true,
        message: "welcome to ridan backend"
    })
})
app.use('/', authRouter)

//if page not found
app.all('*', (req, res) => {
    res.status(404).send('OOPS! 404 NOT FOUND');
})

export default app;