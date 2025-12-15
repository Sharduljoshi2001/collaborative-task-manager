import bcrypt from "bcrypt";
import * as userRepository from "../repositories/userRepository";
import { RegisterInput } from "../validators/authValidator";
export const registerUser = async(data:RegisterInput)=>{
    //checking if the user already exists 
    const existingUser = await userRepository.findUserByEmail(data.email);
    if(existingUser){
        throw new Error("User already exists");
    }
    //salting the password using bcrypt
    const hashedPassword = await bcrypt.hash(data.password,10);
    const newUser = await userRepository.createUser({
        ...data,
        password:hashedPassword,
    });
    //removing the password from the user object
    const{password, ...userWithoutPassword} = newUser;
    return userWithoutPassword;
}