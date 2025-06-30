import { NextFunction, Request, Response, Router } from "express";
import { asyncWapper } from "../../../globals/middlware/error.middlware";
import { user_auth } from "../controller/user_auth";


const authCheck=(req:Request,res:Response,next:NextFunction)=>{
    if(!req.user){
        res.redirect('/login')
    }else{
        next();
    }
}


const ProfileRoute=Router();

ProfileRoute.get('/',authCheck,asyncWapper(user_auth.profileredirect))


export default ProfileRoute;