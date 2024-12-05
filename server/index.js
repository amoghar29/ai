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

app.server = app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port: ", PORT);
});

// Example: Detecting a person and broadcasting the state
const detectPerson = (detected) => {
  const message = { detected };
  if (detected) {
    message.action = "toggle_on"; // Person detected, toggle light on
  } else {
    message.action = "toggle_off"; // No person detected, toggle light off
  }
  // broadcast(message);
};

// New HTTP endpoint for detection
app.post("/api/detect", (req, res) => {
  const { detected } = req.body;
  detectPerson(detected);
  res.status(200).json({ message: "Detection processed", detected });
});

// Simulate person detection (replace this with your actual detection logic)
setInterval(() => {
  const detected = Math.random() > 0.5; // Randomly simulate detection
  detectPerson(detected);
}, 5000); // Check every 5 seconds
