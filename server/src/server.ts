import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import authRoute from "./routes/authRoute";
import taskRoute from "./routes/taskRoute";
import userRoute from "./routes/userRoute";
import { prisma } from "./config/db";
import jwt, { JwtPayload } from "jsonwebtoken";
dotenv.config();
// const app = express();
// const PORT = process.env.PORT || 3000;
// //middleware
// app.use(express.json());
// app.use(cors());
// //creating raw http server so we can wrap express for real time socket
// const httpServer = createServer(app);
// //initializing socket ioc
// const io = new Server(httpServer, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   },
// });
const app = express();
const PORT = process.env.PORT || 3000;

// 1. Updated Express CORS
app.use(
  cors({
    origin: [true],
    credentials: true,
  })
);

app.use(express.json());

const httpServer = createServer(app);

// 2. Updated Socket.io CORS
const io = new Server(httpServer, {
  cors: {
    origin: [true],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});
//socket middleware
io.use((socket, next) => {
  let token =
    socket.handshake.auth.token ||
    socket.handshake.headers.authorization ||
    socket.handshake.query.token;
  if (!token) {
    return next(new Error("Authentication error: no token provided"));
  }
  if (typeof token === "string" && token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }
  try {
    const secret = process.env.JWT_SECRET || "default_secret";
    //verifying the token
    const decoded = jwt.verify(token, secret) as JwtPayload;
    //storing user info in socket object
    (socket as any).user = decoded;
    //moving to next if authentication passes
    next();
  } catch (error: any) {
    return next(new Error("Authentication error: invalid token"));
  }
});
//setting up the socket io connection(jb koi frontend connect hoga ye fn chlega)
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});
//making io globally accessible so that the controller can use it
app.set("io", io);
//routes mounting section
app.use("/api/auth", authRoute);
app.use("/api/tasks", taskRoute);
app.use("/api/users", userRoute);
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
