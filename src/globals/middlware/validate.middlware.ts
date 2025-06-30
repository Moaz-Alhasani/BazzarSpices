import { NextFunction, Request, Response } from "express";
import { Schema, ValidationErrorItem } from "joi";

const formJoiMessage = (joiMessages: ValidationErrorItem[]) => {
    return joiMessages.map(msgObject => msgObject.message.replace(/['"]/g,''));
}

export const validateSchema = (schema: Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.file){
            req.body.main_image=req.file.fieldname
        }
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const messages = formJoiMessage(error.details);
            res.status(400).json({ error: messages });
            return;
        }
        next();
    }
}