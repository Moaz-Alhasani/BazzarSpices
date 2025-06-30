import express, { Application, Request,Response } from 'express'
import { asyncWapper } from '../../../globals/middlware/error.middlware';
import { validateSchema } from '../../../globals/middlware/validate.middlware';
import upload from '../../../globals/constants/mluter';
import { checkPermission, vrefiyUser } from '../../../globals/middlware/auth.middlware';
import { authcontrollers } from '../controller/auth';
import path from 'path';


const authRouter=express.Router();
authRouter.post('/login-admin',asyncWapper(authcontrollers.sing_inAdmin))

authRouter.get('/login-admin', (req: Request, res: Response) => {
  const filePath = path.join(process.cwd(), 'static', 'admin-sign-up.html');
  res.sendFile(filePath);
}); 
authRouter.get('/dashborad', (req: Request, res: Response) => {
  const filePath = path.join(process.cwd(), 'static', 'dashborad.html');
  res.sendFile(filePath);
}); 




authRouter.post('/login',asyncWapper(authcontrollers.sing_in))
authRouter.get('/login', (req: Request, res: Response) => {
  const filePath = path.join(process.cwd(), 'static', 'sign-in.html');
  res.sendFile(filePath);
}); 

export default authRouter