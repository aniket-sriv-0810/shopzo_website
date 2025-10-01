import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
import passport from "passport";
// Register a New User
const createNewUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, phone, password, image, role } = req.body;

    // 🔍 Check if email already exists
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({
        status: 400,
        message: "Validation Error",
        details: ["Email is already registered"],
      });
    }

    // 🔍 Check if phone number already exists
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({
        status: 400,
        message: "Validation Error",
        details: ["Phone number already in use"],
      });
    }

    // ☁️ Upload image if file provided (Cloudinary optional)
    const imageUrl = req.file ? await uploadOnCloudinary(req.file.path) : null;

    // 👤 Create new user instance
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      phone,
      image: imageUrl?.url || image || "https://ik.imagekit.io/y5lkgycsj/user%20(1).png?updatedAt=1756832218727",
      role: role || "user",
    });

    // 🔐 Register user using passport-local-mongoose
    const registeredUser = await User.register(newUser, password);

    // ✅ Login using correct { id, type } format for deserializeUser
    req.login({ id: registeredUser._id, type: "user" }, { session: true }, (err) => {
      if (err) {
        return res.status(500).json(
          new ApiError(500, err, "Auto-login after registration failed!")
        );
      }

      console.log("🔐 Auto-login successful!");

      return res.status(201).json(
        new ApiResponse(
          201,
          { user: registeredUser },
          "User registered and logged in successfully!"
        )
      );
    });

  } catch (error) {
    console.error("❌ Error during user registration:", error);
    return res.status(500).json(
      new ApiError(500, error, "Failed to register user!")
    );
  }
});



// Login the Registered User
const loginUser = asyncHandler(async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("📥 Login attempt:", email, password);
  
      // Step 1: Check if fields are present
      if (!email || !password) {
        return res.status(400).json({
          status: 400,
          message: "Validation Error",
          details: ["Email and Password are required!"],
        });
      }
  
      // Step 2: Check if user exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (!existingUser) {
        return res.status(401).json({
          status: 401,
          message: "Invalid Credentials!",
          details: ["Email not found!"],
        });
      }
  
      // Step 3: Authenticate using passport
      passport.authenticate("user-local", (err, user, info) => {
        if (err) {
          console.error("❌ Passport authentication error:", err);
          return res.status(500).json({
            status: 500,
            message: "Authentication Error",
            details: [err.message || "Internal server error during authentication"],
          });
        }
  
        if (!user) {
          console.log("❌ Authentication failed:", info?.message || "Invalid credentials");
          return res.status(401).json({
            status: 401,
            message: "Invalid Credentials!",
            details: [info?.message || "Invalid email or password!"],
          });
        }
  
        // Step 4: Login the user with proper session handling
        req.login({ id: user._id, type: "user" }, { session: true }, (loginErr) => {
          if (loginErr) {
            console.error("❌ Login error:", loginErr);
            return res.status(500).json({
              status: 500,
              message: "Login Error",
              details: ["Failed to establish user session"],
            });
          }
  
          console.log("✅ Login successful:", user.email);
          console.log("✅ Session established for user:", user._id);
          
          // Set iOS-compatible response headers
          if (process.env.NODE_ENV === "production") {
            res.header('Access-Control-Allow-Credentials', 'true');
            res.header('Vary', 'Origin');
          }
          
          return res.status(200).json({
            status: 200,
            message: "Login successful!",
            data: { user },
          });
        });
      })(req, res); // Call the middleware with req/res
  
    } catch (error) {
      console.error("❌ Login error:", error);
      return res.status(500).json(
        new ApiError(500, [error.message], "Failed to log in!")
      );
    }
  });

  // Logout User Controller Code
const logOutUser = asyncHandler(async (req, res) => {
    try {
      // Passport logout
      req.logout((err) => {
        if (err) {
          console.error("❌ Error during logout:", err);
          return res.status(400).json(
            new ApiError(400, [err.message], "Failed to log out!")
          );
        }
  
        // Destroy session
        req.session.destroy((err) => {
          if (err) {
            console.error("❌ Session destruction failed:", err);
            return res.status(500).json(
              new ApiError(500, [err.message], "Failed to destroy session!")
            );
          }
  
          // Clear session cookie with iOS-compatible settings
          res.clearCookie("shopzo.sid", {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true in production
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            // iOS Safari compatibility
            ...(process.env.NODE_ENV === "production" && {
              partitioned: false,
            }),
          });
  
          console.log("✅ Logout successful");
          return res
            .status(200)
            .json(new ApiResponse(200, null, "Logged out successfully!"));
        });
      });
    } catch (error) {
      console.error("❌ Logout error:", error);
      return res
        .status(500)
        .json(new ApiError(500, [error.message], "Logout failed!"));
    }
  });

  // Check if User is Authenticated (Login check)
const checkAuthentication = asyncHandler(async (req, res) => {
    try {
      if (req.isAuthenticated()) {
        console.log("✅ User is authenticated:", req.user);
        return res
          .status(200)
          .json(new ApiResponse(200, { isAuthenticated: true, user: req.user }, "User is authenticated."));
      } else {
        console.log("❌ User is not authenticated.");
        return res
          .status(200)
          .json(new ApiResponse(200, { isAuthenticated: false }, "User is not authenticated."));
      }
    } catch (error) {
      console.error("❌ Error checking authentication:", error);
      return res
        .status(400)
        .json(new ApiError(400, error.message || error, "Failed to check authentication."));
    }
  });

  const changeUserPassword = async (req, res) => {
    try {
      const { id } = req.params;
      const { oldPassword, newPassword } = req.body;
  
      if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: "Both old and new passwords are required." });
      }
  
      // 1. Find User by ID
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: "User not found!" });
      }
  
      // 2. Authenticate old password
      user.authenticate(oldPassword, async (err, isMatch) => {
        if (err || !isMatch) {
          return res.status(400).json({ error: "Incorrect old password." });
        }
  
        // 3. If old password matches, change to new password
        user.setPassword(newPassword, async (err, updatedUser) => {
          if (err) {
            return res.status(500).json({ error: "Error updating password." });
          }
  
          await updatedUser.save();
          return res.status(200).json({ message: "Password successfully changed!" });
        });
      });
    } catch (error) {
      console.error("Change User Password Error:", error);
      return res.status(500).json({ error: error.message || "Server Error" });
    }
  };
  // 1. Forget password request
 const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email is not registered" });

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    // Reset link
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log("reset URL => ", resetURL);
    
    // Send Email
   await sendEmail({
  to: user.email,
  subject: "🔒 Password Reset Instructions | The Shopzo",
  text: `Greetings,

We received a request to reset your password for your The Shopzo account. 
If you made this request, please use the link below to securely reset your password:

${resetURL}

⚠️ This link will expire in 15 minutes for your security.

If you did not request a password reset, please ignore this email. Your account will remain secure.

Best regards,  
The Shopzo Security Team`,
  html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background: #f9f9f9;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #ff6600;">The Shopzo</h2>
      </div>

      <p style="font-size: 16px; color: #333;">Greetings,</p>
      <p style="font-size: 16px; color: #333;">
        We received a request to reset your password for your <strong>The Shopzo</strong> account. 
        If this was you, please click the button below to securely reset your password:
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetURL}" style="background: linear-gradient(to right, #ff6600, #ff3300); color: #fff; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-size: 16px; font-weight: bold;">
          Reset My Password
        </a>
      </div>

      <p style="font-size: 14px; color: #666;">⚠️ This link will expire in <strong>15 minutes</strong> for your security.</p>
      <p style="font-size: 14px; color: #666;">
        If you did not request a password reset, you can safely ignore this email. Your account will remain secure.
      </p>

      <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />

      <p style="font-size: 13px; color: #999; text-align: center;">
        &copy; ${new Date().getFullYear()} The Shopzo. All rights reserved.  
      </p>
    </div>
  `,
});


    res.status(200).json({ message: "Reset link sent to your email" });
  } catch (err) {
    res.status(500).json({ message: "Error sending reset email", error: err.message });
  }
};

// 2. Reset password
 const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) return res.status(400).json({ message: "Password is required" });

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    // passport-local-mongoose provides setPassword
    await user.setPassword(password);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Error resetting password", error: err.message });
  }
};

export { createNewUser , loginUser , logOutUser , checkAuthentication , changeUserPassword , forgotPassword , resetPassword };
