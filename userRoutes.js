import express from "express";

import {
  getUsers,
  getUserById,
  getCurrentUser,
  updateCurrentUser,
  changePassword,
  deleteCurrentUser,
  addUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ========================================
// All user routes require authentication
// ========================================

router.use(protect);

// ========================================
// Everyone can view users
// ========================================

router.get("/", getUsers);

// ========================================
// Current logged-in user
// IMPORTANT: /me before /:id
// ========================================

router.get("/me", getCurrentUser);

router.put(
  "/me",
  updateCurrentUser
);

router.put(
  "/me/password",
  changePassword
);

router.delete(
  "/me",
  deleteCurrentUser
);

// ========================================
// Get a specific user
// ========================================

router.get("/:id", getUserById);

// ========================================
// TEAM LEADER ONLY
// ========================================

// Add member
router.post(
  "/",
  authorize("Team Lead"),
  addUser
);

// Edit another member
router.put(
  "/:id",
  authorize("Team Lead"),
  updateUser
);

// Remove member
router.delete(
  "/:id",
  authorize("Team Lead"),
  deleteUser
);

export default router;