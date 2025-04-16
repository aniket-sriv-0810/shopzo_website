import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../models/user.model.js";
import { Vendor } from "../models/vendor.model.js";

// 📌 USER Local Strategy
passport.use("user-local", new LocalStrategy(
  { usernameField: "email" , passwordField : "password" },
  User.authenticate()
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
