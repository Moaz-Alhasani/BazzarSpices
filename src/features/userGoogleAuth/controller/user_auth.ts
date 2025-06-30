import { NextFunction, Request, Response } from "express";
import { user_auth_services } from "../../../services/User_Auth_services";

class User_Auth{
    
    public async auth_with_google_redirect(req:Request,res:Response,next:NextFunction){
        await user_auth_services.google_auth_redirect(req,res)
    }
    

    public async profileredirect(req:Request,res:Response,next:NextFunction){
        await user_auth_services.profilepage(req,res)
    }
}

export const user_auth:User_Auth=new User_Auth();