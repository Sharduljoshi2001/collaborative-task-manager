import {Request, Response} from 'express';
import { registerSchema, loginSchema } from '../validators/authValidator';
import * as authService from '../services/authService';
//user registration conteoller
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

//user login controller
export const login = async(req:Request, res:Response):Promise<void>=>{
    try{
        //validation first
        const validatedData = loginSchema.parse(req.body);
        //calling service layer for tokenization and user data for furthur use
        const{user, token} = await authService.loginUser(validatedData); 
        //sending response if user is legit
        res.status(200).json({
            status:"success",
            message:"Login successful",
            token, //token passed for frontend purpose
            data:user,
        })      
    }catch(error:any){
        //validation error response
        if(error.errors){
            res.status(400).json({
                status:"fail",
                message:"validation error",
                error:error.errors,
            });
            return;
        }
        //authentication error
        res.status(401).json({
            status:"fail",
            message:error.message||"authentication failed",
        });
    }
};