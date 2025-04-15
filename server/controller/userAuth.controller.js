import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
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
      image: imageUrl?.url || image || "https://media-hosting.imagekit.io//4bc72ff0889f4681/demo.png?Expires=1837020820&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=c3Nq6Mu7wtR7-l57wCuFJDWqnmAYe1mnhTV60rRh~Jbr8iEoriWR0qAXj7ZZTfT4XwDeVixlpLg0spaVCXXnT0PkgZgvPx8uAqEOl2brHCHXKkKbKmE3Szgkh6l~dfwmJhUcL1pLE0v23fLt6xcVnwglPQ~tZ1fmD02KYcjDD1cX8lTGmF2wSHJv0OVScK2Aw4mHuUSvWbBrDsRt7PpFfWskmXiWUG~QuWDgbcHuSrS2r2ffQ98PdMT96uhXeNRwZsmFs8BSzj15gVYC05hBdkk~7uKhWuA6rl5eSh61hqCLvkjElDrHe7wLa7tfJwUVYRcYicu6LTU0UIeNckAViw__",
      role: role || "user",
    });

    // 🔐 Register using passport-local-mongoose
    const registeredUser = await User.register(newUser, password);
    if (!registeredUser) {
      return res.status(400).json(
        new ApiError(400, ["User registration failed"], "Validation Error")
      );
    }

    console.log("✅ User registered successfully!");

    // 🔑 Auto login after registration
    req.login(registeredUser, { session: true }, (err) => {
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
  
      // Step 3: Authenticate using passport-local strategy
      passport.authenticate("user-local", (err, user, info) => {
        if (err) {
          console.error("❌ Error during passport authentication:", err);
          return res.status(500).json(
            new ApiError(500, [err.message], "Unexpected server error occurred!")
          );
        }
  
        if (!user) {
          return res.status(401).json({
            status: 401,
            message: "Invalid Credentials!",
            details: [info?.message || "Authentication failed."],
          });
        }
  
        // Step 4: Log in the user using req.login
        req.login(user, { session: true }, (err) => {
          if (err) {
            return res.status(500).json(
              new ApiError(500, [err.message], "Login failed!")
            );
          }
  
          console.log("✅ Login successful:", user.email);
          return res.status(200).json(
            new ApiResponse(200, { user }, "Successfully logged in the User!")
          );
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
  
          // Clear session cookie
          res.clearCookie("connect.sid", {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true in production
            sameSite: "lax",
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

export { createNewUser , loginUser , logOutUser , checkAuthentication };
