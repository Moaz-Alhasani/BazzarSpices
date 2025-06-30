import express,{ Application, NextFunction, Request, Response } from "express";
import Server from "./server";
import "./features/userGoogleAuth/config/passport-setup"
class ShopApplication{
    public run():void{
        const app:Application=express()
        const server:Server=new Server(app)
        server.start()
    }
}
const app:Application=express()

export const shopApplication:ShopApplication=new ShopApplication()
shopApplication.run()
