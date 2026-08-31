import express from "express";

import {
  getGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
  addGroupMember,
  removeGroupMember,
} from "../controllers/groupController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All group routes require authentication
router.use(protect);

// Groups
router.get("/", getGroups);
router.get("/:id", getGroupById);

router.post("/", createGroup);
router.put("/:id", updateGroup);
router.delete("/:id", deleteGroup);

// Group members
router.post("/:id/members", addGroupMember);
router.delete("/:id/members/:userId", removeGroupMember);

export default router;