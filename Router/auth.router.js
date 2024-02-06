import { Router } from "express";
import passport from "passport";
import { getUserData, logout } from "../Controller/auth.controller.js";



const authRouter = Router();

authRouter.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

authRouter.get('/auth/google/callback',
passport.authenticate('google', {
    failureRedirect: 'http://localhost:5500',
    successRedirect: "http://localhost:7000/user"
})
);

// Route to get user details
authRouter.get('/user', getUserData);
authRouter.get('/logout', logout)
export default authRouter