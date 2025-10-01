import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../models/user.model.js";
import { Vendor } from "../models/vendor.model.js";

// 📌 USER Local Strategy with custom authentication
passport.use("user-local", new LocalStrategy(
  { usernameField: "email", passwordField: "password" },
  async (email, password, done) => {
    try {
      console.log("🔍 Passport strategy executing for:", email);
      
      // Find user by email
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        console.log("❌ User not found in passport strategy");
        return done(null, false, { message: "User not found" });
      }

      console.log("🔍 User found in passport strategy, checking password");
      
      // Use passport-local-mongoose's authenticate method
      console.log("🔍 About to call user.authenticate() method");
      
      try {
        const result = user.authenticate(password, (err, authenticatedUser, passwordErr) => {
          console.log("🔍 Authentication callback executed!");
          console.log("🔍 Password check result - err:", err, "user:", !!authenticatedUser, "passwordErr:", passwordErr);
          
          if (err) {
            console.error("❌ Authentication error:", err);
            return done(err);
          }
          
          if (!authenticatedUser) {
            console.log("❌ Password authentication failed");
            return done(null, false, { message: passwordErr?.message || "Invalid password" });
          }
          
          console.log("✅ Password authentication successful");
          return done(null, authenticatedUser);
        });
        
        console.log("🔍 user.authenticate() returned:", result);
        
        // If authenticate doesn't use callback pattern, handle synchronously
        if (result && typeof result.then === 'function') {
          console.log("🔍 Detected promise-based authentication");
          result.then(authResult => {
            console.log("🔍 Promise resolved with:", authResult);
            if (authResult) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Invalid password" });
            }
          }).catch(err => {
            console.error("❌ Promise authentication error:", err);
            return done(err);
          });
        }
        
      } catch (syncError) {
        console.error("❌ Synchronous authentication error:", syncError);
        return done(syncError);
      }
      
    } catch (error) {
      console.error("❌ Passport strategy error:", error);
      return done(error);
    }
  }
));

// 📌 VENDOR Local Strategy
passport.use("vendor-local", new LocalStrategy(
  { usernameField: "username" , passwordField : "password"},
  Vendor.authenticate()
));

// 📌 Serialize (store ID + type in session)
passport.serializeUser((entity, done) => {
  // Default to "user" unless proven otherwise
  if (entity instanceof Vendor) {
    done(null, { id: entity.id, type: "vendor" });
  } else if (entity instanceof User) {
    done(null, { id: entity.id, type: "user" });
  } else if (entity?.type && entity?.id) {
    // Handles custom objects passed manually (like in req.login)
    done(null, entity);
  } else {
    done(new Error("Cannot serialize unknown entity"));
  }
});

// 📌 Deserialize (based on type, fetch correct model)
passport.deserializeUser(async (key, done) => {
  try {
    if (key.type === "user") {
      const user = await User.findById(key.id);
      return done(null, user);
    } else if (key.type === "vendor") {
      const vendor = await Vendor.findById(key.id);
      return done(null, vendor);
    } else {
      return done(new Error("Unknown user type"));
    }
  } catch (err) {
    return done(err);
  }
});

export default passport;
