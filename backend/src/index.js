import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

// Importing custom modules
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import { app, server } from "./lib/socket.js";

// Load environment variables
dotenv.config();

// Constants
const PORT = process.env.PORT || 5002;
const __dirname = path.resolve();

// Middleware setup
app.use(express.json({ limit: "50mb" })); // Increased payload size limit
app.use(express.urlencoded({ limit: "50mb", extended: true })); // For URL-encoded data
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true,
  })
);

// Routes setup
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Static file serving for production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
  connectDB();
});