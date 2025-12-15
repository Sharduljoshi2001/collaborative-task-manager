import {Request, Response} from 'express';
import { registerSchema } from '../validators/authValidator';
import * as authService from '../services/authService';

export const register = async (req:Request, res:Response):Promise<void>=>{
    try{
        //validation first
        const validatedData = registerSchema.parse(req.body);
        //passing data to service layer for business logic implementation
        const user = await authService.registerUser(validatedData);
        //sending response if user is legit
        res.status(200).json({
            status:"success",
            message:"Registration successful",
            data: user,
        })
    }catch(error:any){
        //zod validation error case
        if(error.errors){
            res.status(400).json({
                status:"fail",
                message:"Validation error",
                error:error.errors,
            });
            return;
        }
        //business logic error case
        res.status(400).json({
            status:"Fail",
            message:error.message||"Internal server error",
        });
    }
};