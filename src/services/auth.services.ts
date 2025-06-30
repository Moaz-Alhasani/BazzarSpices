import express,{Request,Response,NextFunction} from "express"
import { prisma } from "../prisma";
import bcrypt from "bcrypt"
import { generateJwt } from "../globals/middlware/auth.middlware";
import { BAD_REQUST_EXCEPTION, NOT_FOUND } from "../globals/middlware/error.middlware";
import { User } from "@prisma/client";
class AuthServices{
    public async loginadmin(requestBody: any) {
        const { email, password } = requestBody; 
        const user = await this.IsEmailAlreadyExist(email);
        if(!user){
            return new NOT_FOUND('Email Not Found')
        }
        if (!user.password) {
            return new BAD_REQUST_EXCEPTION("User registered via OAuth, no password set.");
        }
        const isMatchPassword: boolean = await bcrypt.compare(password, user.password);

        if (!isMatchPassword) {
            throw new BAD_REQUST_EXCEPTION("Password Invalid Credentials");
        }

        const payload = {
            email:user.email,
            role: user.role,
            id: user.id
        };
        const token=await generateJwt(payload)
        return token;
    }


    public async login(requestBody: any) {
        const { email } = requestBody; 
        const user = await this.IsEmailAlreadyExist(email);
        if(!user){
            return new NOT_FOUND('Email Not Found')
        }

        const payload = {
            email:user.email,
            role: user.role,
            id: user.id
        };
        const token=await generateJwt(payload)
        return token;
    }




    private async IsEmailAlreadyExist(email: string) {
      const user = await prisma.user.findFirst({
        where: {
          email: email,
        },
      });
      return user
    }
}

export const authservices:AuthServices=new AuthServices()