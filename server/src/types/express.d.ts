import { JwtPayload } from "jsonwebtoken";
//adding a new custom filed(user) in Express's object
declare global{
    namespace Express{
        interface Request{
            user?:string|JwtPayload;
        }
    }
}