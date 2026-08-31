import express from "express";

import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
} from "../controllers/projectController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All project routes require login
router.use(protect);

// Projects
router.get("/", getProjects);
router.get("/:id", getProjectById);

router.post("/", createProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

// Project members
router.post("/:id/members", addProjectMember);
router.delete("/:id/members/:userId", removeProjectMember);

export default router;