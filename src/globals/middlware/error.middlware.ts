import { NextFunction, Request, Response } from "express";
import { HTTB_STATUS } from "../constants/http";  


export interface IError extends Error { 
    status: string;
    statusCode: number;  
    message: string;
}

export abstract class CustomError extends Error {
    public status: string;
    public statusCode: number;

    constructor(message: string, status: string = "error", statusCode: number = 500) {
        super(message);
        this.status = status;
        this.statusCode = statusCode;
    }

    public getErrorResponse() {
        return {
            status: this.status,
            statusCode: this.statusCode,
            message: this.message,
        };
    }
}

export class BAD_REQUST_EXCEPTION extends CustomError{
    status: string="error";
    statusCode: number=HTTB_STATUS.BAD_REQEST;
    
    constructor(message:string){
        super(message)
    }
    public getErrorResponse(){
        return super.getErrorResponse()
    }
}

export class UNAUTHORIZED_Exception extends CustomError{
    status: string="error";
    statusCode: number=HTTB_STATUS.UNAUTHORIZED;
    constructor(message:string){
        super(message)
    }
    public getErrorResponse(){
        return super.getErrorResponse()
    }
}

export class forbiddenExcption extends CustomError{
    status: string="error";
    statusCode: number=HTTB_STATUS.FORRIDDEN;
    constructor(message:string){
        super(message)
    }
    public getErrorResponse(){
        return super.getErrorResponse()
    }
}

export class NOT_FOUND extends CustomError{
    status: string="error";
    statusCode: number=HTTB_STATUS.NOT_FOUND;

    constructor(message:string){
        super(message)
    }
    public getErrorResponse(){
        return super.getErrorResponse()
    }
}

export class internal_server extends CustomError{
    status: string="error";
    statusCode: number=HTTB_STATUS.INTERNAL_SERVER;

    constructor(message:string){
        super(message)
    }
    public getErrorResponse(){
        return super.getErrorResponse()
    }
}

export function asyncWapper(callback:any){
    return async (req:Request,res:Response,next:NextFunction)=>{
        try{
            await callback(req,res,next)
        }
        catch(error:any){
            next(new internal_server(error.message))
        }
    }
}