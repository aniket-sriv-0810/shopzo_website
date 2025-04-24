import {asyncHandler} from "../utils/asyncHandler.js";
import { Vendor } from "../models/vendor.model.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import passport from "passport";
const addNewVendor = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      phone,
      password,
      role,
      address = {},
      products = [],
      categories = [],
      reviews = [],
      bookings = [],
    } = req.body;

    const { area, city, pincode, state, country } = address;

    // ✅ Validate image
    if (!req.file) {
      return res.status(400).json(
        new ApiError(400, ["Image is required"], "Validation Error")
      );
    }

    // 🔍 Check for duplicates in Vendor model
    const [existingEmail, existingUsername, existingPhone] = await Promise.all([
      Vendor.findOne({ email: email.toLowerCase() }),
      Vendor.findOne({ username: username.toLowerCase() }),
      Vendor.findOne({ phone }),
    ]);

    if (existingEmail) {
      return res.status(400).json(
        new ApiError(400, ["Email is already registered"], "Validation Error")
      );
    }

    if (existingUsername) {
      return res.status(400).json(
        new ApiError(400, ["Username is already taken"], "Validation Error")
      );
    }

    if (existingPhone) {
      return res.status(400).json(
        new ApiError(400, ["Phone number already in use"], "Validation Error")
      );
    }

    // ☁️ Upload image
    const uploadedImage = await uploadOnCloudinary(req.file.path);
    const imageUrl = uploadedImage?.url;

    if (!imageUrl) {
      return res.status(500).json(
        new ApiError(500, ["Image upload failed"], "Cloudinary Error")
      );
    }

    // 👤 Create new Vendor document
    const newVendor = new Vendor({
      name,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      phone,
      address: { area, city, pincode, state, country },
      image: imageUrl,
      role: role || "vendor",
      products,
      categories,
      reviews,
      bookings,
    });

    // 🔐 Register the vendor
    const registeredVendor = await Vendor.register(newVendor, password);
    if (!registeredVendor) {
      return res.status(400).json(
        new ApiError(400, ["Vendor registration failed"], "Validation Error")
      );
    }

    console.log("✅ Vendor registered successfully!");

    // 🧠 Save vendor to User model if not already there
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (!userExists) {
      const newUser = new User({
        name,
        email: email.toLowerCase(),
        phone,
        image: imageUrl,
        role: "vendor",
      });
      await User.register(newUser, password);
      console.log("📦 Vendor also added to User model");
    } else {
      console.warn("⚠️ Email already exists in User model — skipping user creation");
    }

    // 🛑 DO NOT AUTO-LOGIN if an admin is creating the vendor
    if (!req.user || req.user.role !== "admin") {
      // User is self-registering, allow auto-login
      req.login(registeredVendor, { session: true }, (err) => {
        if (err) {
          return res.status(500).json(
            new ApiError(500, err, "Auto-login after registration failed!")
          );
        }

        console.log("🔐 Vendor auto-login successful!");
        return res.status(201).json(
          new ApiResponse(
            201,
            { vendor: registeredVendor },
            "Vendor registered and logged in successfully!"
          )
        );
      });
    } else {
      // Admin registered the vendor, skip login
      return res.status(201).json(
        new ApiResponse(
          201,
          { vendor: registeredVendor },
          "Vendor registered successfully by admin"
        )
      );
    }
  } catch (error) {
    console.error("❌ Error during vendor registration:", error);
    return res.status(500).json(
      new ApiError(500, error, "Failed to register vendor!")
    );
  }
});



// ✅ Vendor Login Controller
const loginVendor = asyncHandler(async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log("📥 Vendor login attempt:", username, password);
  
      // Step 1: Validate required fields
      if (!username || !password) {
        return res.status(400).json({
          status: 400,
          message: "Validation Error",
          details: ["Username and Password are required!"],
        });
      }
  
      // Step 2: Check if vendor exists
      const existingVendor = await Vendor.findOne({ username: username.toLowerCase() });
      if (!existingVendor) {
        return res.status(401).json({
          status: 401,
          message: "Invalid Credentials!",
          details: ["Username not found!"],
        });
      }
  
      // Step 3: Authenticate using vendor-local passport strategy
      passport.authenticate("vendor-local", (err, vendor, info) => {
        if (err) {
          console.error("❌ Error during passport authentication:", err);
          return res.status(500).json(
            new ApiError(500, [err.message], "Unexpected server error occurred!")
          );
        }
  
        if (!vendor) {
          return res.status(401).json({
            status: 401,
            message: "Invalid Credentials!",
            details: [info?.message || "Authentication failed."],
          });
        }
  
        // Step 4: Log in the vendor using req.login
        req.login(vendor, { session: true }, (err) => {
          if (err) {
            return res.status(500).json(
              new ApiError(500, [err.message], "Login failed!")
            );
          }
  
          console.log("✅ Vendor login successful:", vendor.username);
          return res.status(200).json(
            new ApiResponse(200, { vendor }, "Successfully logged in the Vendor!")
          );
        });
      })(req, res); // invoke the passport middleware
  
    } catch (error) {
      console.error("❌ Vendor login error:", error);
      return res.status(500).json(
        new ApiError(500, [error.message], "Failed to log in vendor!")
      );
    }
  });
  
  // ✅ Logout Controller for Both User & Vendor
const logOutAccount = asyncHandler(async (req, res) => {
    try {
      // Logout via Passport
      req.logout((err) => {
        if (err) {
          console.error("❌ Error during logout:", err);
          return res.status(400).json(
            new ApiError(400, [err.message], "Failed to log out!")
          );
        }
  
        // Destroy Session
        req.session.destroy((err) => {
          if (err) {
            console.error("❌ Session destruction failed:", err);
            return res.status(500).json(
              new ApiError(500, [err.message], "Failed to destroy session!")
            );
          }
  
          // Clear Cookie
          res.clearCookie("connect.sid", {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Use HTTPS in prod
            sameSite: "lax",
          });
  
          console.log("✅ Logout successful for user/vendor");
          return res
            .status(200)
            .json(new ApiResponse(200, null, "Logged out successfully from account!"));
        });
      });
  
    } catch (error) {
      console.error("❌ Logout error:", error);
      return res.status(500).json(
        new ApiError(500, [error.message], "Logout failed!")
      );
    }
  });
  
// Check if Vendor is Authenticated (Login check)
const checkVendorAuthentication = asyncHandler(async (req, res) => {
    try {
      if (req.isAuthenticated()) {
        console.log("✅ Vendor is authenticated:", req.user);
        return res.status(200).json(
          new ApiResponse(200, { isAuthenticated: true, vendor: req.user }, "Vendor is authenticated.")
        );
      } else {
        console.log("❌ Vendor is not authenticated.");
        return res.status(200).json(
          new ApiResponse(200, { isAuthenticated: false }, "Vendor is not authenticated.")
        );
      }
    } catch (error) {
      console.error("❌ Error checking vendor authentication:", error);
      return res
        .status(400)
        .json(new ApiError(400, error.message || error, "Failed to check vendor authentication."));
    }
  });
  
  const changePassword = async (req, res) => {
    try {
      const { id } = req.params;
      const { oldPassword, newPassword } = req.body;
  
      if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: "Both old and new passwords are required." });
      }
  
      // 1. Find Vendor by ID
      const vendor = await Vendor.findById(id);
      if (!vendor) {
        return res.status(404).json({ error: "Vendor not found!" });
      }
  
      // 2. Authenticate old password
      const isMatch = await new Promise((resolve, reject) => {
        vendor.authenticate(oldPassword, (err, matched) => {
          if (err) return reject(new Error("Error during password authentication."));
          resolve(matched);
        });
      }).catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.message });
      });
  
      if (!isMatch) {
        return res.status(400).json({ error: "Incorrect old password." });
      }
  
      // 3. Set new password for Vendor
      const updatedVendor = await new Promise((resolve, reject) => {
        vendor.setPassword(newPassword, (err, updatedVendor) => {
          if (err) return reject(new Error("Error updating vendor password."));
          resolve(updatedVendor);
        });
      }).catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.message });
      });
  
      if (!updatedVendor) return; // Response already sent in .catch()
  
      await updatedVendor.save();
  
      // 4. Find linked User account (by vendor's email or phone)
      const user = await User.findOne({
        role: "vendor",
        $or: [{ email: vendor.email }, { phone: vendor.phone }],
      });
  
      if (!user) {
        return res.status(404).json({ error: "Linked user account not found!" });
      }
  
      // 5. Update password in User model
      const updatedUser = await new Promise((resolve, reject) => {
        user.setPassword(newPassword, (err, updatedUser) => {
          if (err) return reject(new Error("Error updating user password."));
          resolve(updatedUser);
        });
      }).catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.message });
      });
  
      if (!updatedUser) return; // Response already sent in .catch()
  
      await updatedUser.save();
  
      return res.status(200).json({
        message: "Password successfully changed for both Vendor and linked User account.",
      });
  
    } catch (error) {
      console.error("Change Vendor Password Error:", error);
      return res.status(500).json({ error: "Unexpected server error occurred." });
    }
  };
  
  
export { addNewVendor , loginVendor , logOutAccount , checkVendorAuthentication ,  changePassword};
