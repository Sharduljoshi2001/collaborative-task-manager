import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
export const authenticatedUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      status: "fail",
      message: "Access denied, unauthorized user",
    });
    return;
  }
  //removing "Bearer" and extracting the token only
  const token = authHeader.split(" ")[1];
  try {
    const secret = process.env.JWT_SECRET || "default_secret";

    //verifying the token
    //if the toke is expired jwt will throw an error
    const decoded = jwt.verify(token, secret);
    // console.log("REQ USER BEFORE:", req.user);
    //attaching user info into request
    req.user = decoded;
    // console.log("\nREQ USER AFTER:", req.user);
    //moving onto next user
    next();
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: "Access denied. No token provided",
    });
    return;
  }
};
