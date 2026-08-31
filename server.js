import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// -------------------------
// Middleware
// -------------------------

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

// -------------------------
// User routes
// -------------------------
app.use("/api/users", userRoutes);

app.use("/api/tasks", taskRoutes);

app.use("/api/projects", projectRoutes);
app.use("/api/groups", groupRoutes);


// -------------------------
// Test API route
// -------------------------

app.get("/api/test", (req, res) => {
  res.json({
    message: "CollabBoard backend is running!"
  });
});

// -------------------------
// Start server
// -------------------------

app.listen(PORT, () => {
  console.log(`CollabBoard backend running on http://localhost:${PORT}`);
});