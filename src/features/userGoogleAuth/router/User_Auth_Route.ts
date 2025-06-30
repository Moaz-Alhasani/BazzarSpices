import { NextFunction, Request, Response, Router } from "express";
import { asyncWapper } from "../../../globals/middlware/error.middlware";
import { user_auth } from "../controller/user_auth";
import passport from "passport";

const User_Auth_Router=Router();

User_Auth_Router.get('/google',passport.authenticate('google',{
    scope:['profile','email']
}))

User_Auth_Router.get('/google/redirect',
  passport.authenticate('google', { failureRedirect: '/login' }),
  asyncWapper(user_auth.auth_with_google_redirect)
);

export default User_Auth_Router
