import express, { Request, Response } from "express";
import {createServer} from 'http';
import {Server} from 'socket.io';
import cors from "cors";
import dotenv from "dotenv";
import authRoute from "./routes/authRoute";
import taskRoute from "./routes/taskRoute"
import { prisma } from "./config/db";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
//middleware
app.use(express.json());
app.use(cors());
//creating raw http server so we can wrap express for real time socket
const httpServer = createServer(app)
//initializing socket ioc
const io = new Server(httpServer,{
  cors:{
    origin:"*",
    methods:['GET','POST','PUT','DELETE']
  },
});
//setting up the socket io connection(jb koi frontend connect hoga ye fn chlega)
io.on('connection', (socket)=>{
  console.log('new client connected:', socket.id);
  socket.on('disconnect',()=>{
    console.log('client disconnected', socket.id);
  });
})
//making io globally accessible so that the controller can use it
app.set('io',io);
//routes mounting section
app.use("/api/auth",authRoute);
app.use("/api/tasks",taskRoute);
//health check for DB connection
app.get("/health", async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: "ok", message: "DBconnection successful" });
  } catch (error) {
    console.log("Database Connection Error", error);
    res.status(500).json({ status: "error", message: "DB connection failed" });
  }
});
//listening for the server
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`TEST HEALTH: http://localhost:${PORT}/health`);
});
