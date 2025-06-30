import { NextFunction, Request, Response } from "express";
import OtpGenerator from "otp-generator"

export const generateOtp=()=>{
    const OTP=OtpGenerator.generate(6,{
        upperCaseAlphabets:false,
        specialChars:false,
        digits:true,
        lowerCaseAlphabets:false
    });
    return OTP
}

export const localvariables=(req:Request,res:Response,next:NextFunction)=>{
    req.app.locals = {
        OTP : null,
        resetSesstion: false,
        user_id:null
    }
    next()
}