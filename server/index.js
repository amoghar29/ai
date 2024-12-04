import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import authRouter from "./src/routes/auth.route.js";
import { connectDB } from "./src/db/connectdb.js";

config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port: ", PORT);
});
