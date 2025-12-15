import { prisma } from "../config/db";
import { RegisterInput } from "../validators/authValidator";

//checking if the user exists or not
export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};
//function to create new user
export const createUser = async (data:RegisterInput)=>{
    return await prisma.user.create({
        data:{
            email:data.email,
            name:data.name,
            password:data.password,
        },
    });
};