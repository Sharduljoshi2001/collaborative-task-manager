import bcrypt from "bcrypt";
import * as userRepository from "../repositories/userRepository";
import { LoginInput, RegisterInput } from "../validators/authValidator";
import { generateToken } from "../utils/jwt";
export const registerUser = async (data: RegisterInput) => {
  //checking if the user already exists
  const existingUser = await userRepository.findUserByEmail(data.email);
  if (existingUser) {
    throw new Error("User already exists");
  }
  //salting the password using bcrypt
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const newUser = await userRepository.createUser({
    ...data,
    password: hashedPassword,
  });
  //removing the password from the user object
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};
export const loginUser = async (data: LoginInput) => {
  //checking if the user exsts or not
  const existingUser = await userRepository.findUserByEmail(data.email);
  if (!existingUser) {
    throw new Error("Invalid credentials");
  }
  //checking if the password is correct
  const isPasswordCorrect = await bcrypt.compare(
    data.password,
    existingUser.password
  );
  if (!isPasswordCorrect) {
    throw new Error("Invalid credentials");
  }
  const token = generateToken(existingUser.id);
  //   console.log("TOKEN GENERATED:", token);
  //returning user data without password
  const { password, ...userDataWithoutPassword } = existingUser;
  return { user: userDataWithoutPassword, token };
};
