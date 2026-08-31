import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import users from "../data/users.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;

    // -------------------------
    // Validate required fields
    // -------------------------

    if (!name || !email || !role || !password) {
      return res.status(400).json({
        message: "Name, email, role and password are required.",
      });
    }

    // -------------------------
    // Clean input
    // -------------------------

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    // -------------------------
    // Check password length
    // -------------------------

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must contain at least 6 characters.",
      });
    }

    // -------------------------
    // Check if email already exists
    // -------------------------

    const existingUser = users.find(
      (user) => user.email.toLowerCase() === cleanEmail
    );

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    // -------------------------
    // Hash password
    // -------------------------

    const hashedPassword = await bcrypt.hash(password, 10);

    // -------------------------
    // Create new user
    // -------------------------

    const newUser = {
      id: users.length > 0
        ? Math.max(...users.map((user) => user.id)) + 1
        : 1,
      name: cleanName,
      email: cleanEmail,
      role,
      password: hashedPassword,
      image: null,
    };

    users.push(newUser);

    // -------------------------
    // Return safe user data
    // -------------------------

    const { password: _, ...safeUser } = newUser;

    res.status(201).json({
      message: "Account created successfully.",
      user: safeUser,
    });

  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      message: "Server error while creating account.",
    });
  }
};

// ========================================
// LOGIN
// ========================================

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    // Clean email
    const cleanEmail = email.trim().toLowerCase();

    // Find user
    const user = users.find(
      (user) => user.email.toLowerCase() === cleanEmail
    );

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Check password
    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Remove password from response
    const { password: _, ...safeUser } = user;

    res.status(200).json({
      message: "Login successful.",
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error while logging in.",
    });
  }
};