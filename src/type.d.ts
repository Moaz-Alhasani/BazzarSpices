import { Request } from "express";

interface USERPAYLOAD {
    email: string;
    id: string;
    role:string;
    firstName:string;
    lastName:string;
}

declare global {
    namespace Express {
        interface Request {
            currentuser?: any;
        }
    }
}
