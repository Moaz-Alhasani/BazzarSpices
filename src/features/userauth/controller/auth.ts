import express,{Request,Response,NextFunction} from "express"
import { HTTB_STATUS } from "../../../globals/constants/http";
import { date } from "joi";
import { authservices } from "../../../services/auth.services";
class AuthControllers{
    public async sing_inAdmin(req:Request,res:Response,next:NextFunction){
        const token=await authservices.loginadmin(req.body)

        const options={
            MaxAge:process.env.LOGIN_EXPIRES,
            secure:true,
            httpOnly:true
        }
        res.cookie('jwt',token,options)

        res.status(HTTB_STATUS.OK).json({
            message:"Admin login successfly",
            date:token
        })   
    }


    public async sing_in(req:Request,res:Response,next:NextFunction){
        const token=await authservices.login(req.body)

        const options={
            MaxAge:process.env.LOGIN_EXPIRES,
            secure:true,
            httpOnly:true
        }
        res.cookie('jwt',token,options)

        res.status(HTTB_STATUS.OK).json({
            message:"Admin login successfly",
            date:token
        })   
    }

}

export const authcontrollers:AuthControllers=new AuthControllers()