import { User } from "../models/user.model.js";

const isAdmin = async (req, res, next) => {
  try {
    // req.user should already be populated by isLoggedIn middleware
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied! Admins only." });
    }

    next(); // User is admin, continue
  } catch (error) {
    console.error("Admin check error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export { isAdmin };
