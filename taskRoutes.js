import express from "express";

import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All task routes require authentication
router.use(protect);

// Get all tasks
router.get("/", getTasks);

// Get one task
router.get("/:id", getTaskById);

// Create task
router.post("/", createTask);

// Update task
router.put("/:id", updateTask);

// Delete task
router.delete("/:id", deleteTask);

export default router;