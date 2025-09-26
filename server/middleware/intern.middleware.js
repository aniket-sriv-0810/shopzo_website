import { User } from "../models/user.model.js";

const isIntern = async (req, res, next) => {
  try {
    // Ensure user is logged in
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must log in to access this resource." });
    }

    // Fetch the logged-in user's details
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if user is an intern
    if (user.role !== "intern") {
      return res.status(403).json({ message: "Access denied! Only interns can access this resource." });
    }

    // Allow access
    next();
  } catch (error) {
    console.error("Intern authentication error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export { isIntern };
