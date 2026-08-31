import users from "../data/users.js";
import bcrypt from "bcryptjs";

// ========================================
// GET ALL USERS
// ========================================

export const getUsers = (req, res) => {
  const safeUsers = users.map(
    ({ password, ...user }) => user
  );

  res.status(200).json(safeUsers);
};

// ========================================
// GET USER BY ID
// ========================================

export const getUserById = (req, res) => {
  const userId = Number(req.params.id);

  const user = users.find(
    (user) => user.id === userId
  );

  if (!user) {
    return res.status(404).json({
      message: "User not found.",
    });
  }

  const { password, ...safeUser } = user;

  res.status(200).json(safeUser);
};

// ========================================
// ADD TEAM MEMBER
// TEAM LEADER ONLY
// ========================================

export const addUser = (req, res) => {
  const {
    name,
    email,
    role,
  } = req.body;

  // Validate required fields
  if (!name || !email || !role) {
    return res.status(400).json({
      message: "Name, email and role are required.",
    });
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

  // Check duplicate email
  const existingUser = users.find(
    (user) =>
      user.email.toLowerCase() === cleanEmail
  );

  if (existingUser) {
    return res.status(409).json({
      message: "A member with this email already exists.",
    });
  }

  // Allowed roles
  const validRoles = [
    "Team Lead",
    "Team Member",
    "Developer",
    "Tester",
    "UI/UX Designer",
  ];

  if (!validRoles.includes(role)) {
    return res.status(400).json({
      message: "Invalid role.",
    });
  }

  // Create member
  const newUser = {
    id:
      users.length > 0
        ? Math.max(
            ...users.map((user) => user.id)
          ) + 1
        : 1,

    name: cleanName,
    email: cleanEmail,
    role,
    password: null,
    image: null,
  };

  users.push(newUser);

  const { password, ...safeUser } = newUser;

  res.status(201).json({
    message: "Member added successfully.",
    user: safeUser,
  });
};

export const updateUser = (req, res) => {
  const userId = Number(req.params.id);

  const user = users.find(
    (user) => user.id === userId
  );

  if (!user) {
    return res.status(404).json({
      message: "User not found.",
    });
  }

  const {
    name,
    email,
    role,
    image,
  } = req.body;

  if (name !== undefined) {
    if (!name.trim()) {
      return res.status(400).json({
        message: "Name cannot be empty.",
      });
    }

    user.name = name.trim();
  }

  if (email !== undefined) {
    const cleanEmail =
      email.trim().toLowerCase();

    const emailExists = users.some(
      (existingUser) =>
        existingUser.id !== user.id &&
        existingUser.email.toLowerCase() === cleanEmail
    );

    if (emailExists) {
      return res.status(409).json({
        message:
          "A member with this email already exists.",
      });
    }

    user.email = cleanEmail;
  }

  if (role !== undefined) {
    const validRoles = [
      "Team Lead",
      "Team Member",
      "Developer",
      "Tester",
      "UI/UX Designer",
    ];

    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role.",
      });
    }

    user.role = role;
  }

  if (image !== undefined) {
    user.image = image;
  }

  const { password, ...safeUser } = user;

  res.status(200).json({
    message: "Member updated successfully.",
    user: safeUser,
  });
};

// ========================================
// REMOVE TEAM MEMBER
// TEAM LEADER ONLY
// ========================================

export const deleteUser = (req, res) => {
  const userId = Number(req.params.id);

  const userIndex = users.findIndex(
    (user) => user.id === userId
  );

  if (userIndex === -1) {
    return res.status(404).json({
      message: "User not found.",
    });
  }

  const deletedUser = users.splice(
    userIndex,
    1
  )[0];

  const { password, ...safeUser } = deletedUser;

  res.status(200).json({
    message: "Member removed successfully.",
    user: safeUser,
  });
};


// ========================================
// GET CURRENT LOGGED-IN USER
// ========================================

export const getCurrentUser = (req, res) => {
  const userId = Number(req.user.userId);

  const user = users.find(
    (user) => user.id === userId
  );

  if (!user) {
    return res.status(404).json({
      message: "User not found.",
    });
  }

  // Never return password
  const {
    password,
    ...safeUser
  } = user;

  res.status(200).json(safeUser);
};


// ========================================
// UPDATE CURRENT LOGGED-IN USER
// ========================================

export const updateCurrentUser = (req, res) => {
  const userId = Number(req.user.userId);

  const user = users.find(
    (user) => user.id === userId
  );

  if (!user) {
    return res.status(404).json({
      message: "User not found.",
    });
  }

  const {
    name,
    email,
    image,
  } = req.body;

  // Update name
  if (name !== undefined) {
    if (!name.trim()) {
      return res.status(400).json({
        message: "Name cannot be empty.",
      });
    }

    user.name = name.trim();
  }

  // Update email
  if (email !== undefined) {
    const cleanEmail =
      email.trim().toLowerCase();

    const emailExists = users.some(
      (existingUser) =>
        existingUser.id !== user.id &&
        existingUser.email.toLowerCase() ===
          cleanEmail
    );

    if (emailExists) {
      return res.status(409).json({
        message:
          "A member with this email already exists.",
      });
    }

    user.email = cleanEmail;
  }

  // Update profile image
  if (image !== undefined) {
    user.image = image;
  }

  // IMPORTANT:
  // Role is intentionally NOT updated here.
  // A user cannot change their own role.

  const {
    password,
    ...safeUser
  } = user;

  res.status(200).json({
    message: "Profile updated successfully.",
    user: safeUser,
  });
};


// ========================================
// CHANGE CURRENT USER PASSWORD
// ========================================

export const changePassword = async (req, res) => {
  const userId = Number(req.user.userId);

  const user = users.find(
    (user) => user.id === userId
  );

  if (!user) {
    return res.status(404).json({
      message: "User not found.",
    });
  }

  const {
    currentPassword,
    newPassword,
  } = req.body;

  // Validate fields
  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      message:
        "Current password and new password are required.",
    });
  }

  // Validate new password length
  if (newPassword.length < 6) {
    return res.status(400).json({
      message:
        "New password must contain at least 6 characters.",
    });
  }

  // Make sure the user has a password
  if (!user.password) {
    return res.status(400).json({
      message:
        "This account does not have a password set.",
    });
  }

  // Check current password
  const passwordMatches =
    await bcrypt.compare(
      currentPassword,
      user.password
    );

  if (!passwordMatches) {
    return res.status(401).json({
      message:
        "Current password is incorrect.",
    });
  }

  // Hash the new password
  const hashedPassword =
    await bcrypt.hash(
      newPassword,
      10
    );

  // Save new password
  user.password = hashedPassword;

  res.status(200).json({
    message:
      "Password changed successfully.",
  });
};


// ========================================
// DELETE CURRENT LOGGED-IN USER
// ========================================

export const deleteCurrentUser = (req, res) => {
  const userId = Number(req.user.userId);

  const userIndex = users.findIndex(
    (user) => user.id === userId
  );

  if (userIndex === -1) {
    return res.status(404).json({
      message: "User not found.",
    });
  }

  const deletedUser =
    users.splice(userIndex, 1)[0];

  const {
    password,
    ...safeUser
  } = deletedUser;

  res.status(200).json({
    message:
      "Account deleted successfully.",
    user: safeUser,
  });
};