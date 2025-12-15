import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoute from "./routes/authRoute";
import { prisma } from "./config/db";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
//middleware
app.use(express.json());
app.use(cors());

//routes mounting section
app.use("/api/auth",authRoute);
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
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`TEST HEALTH: http://localhost:${PORT}/health`);
});
