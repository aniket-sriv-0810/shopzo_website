import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required!"],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Email is required!"],
      validate: {
        validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: "Invalid email format",
      },
    },
    phone: {
      type: String,
      unique: true,
      required: [true, "Phone number is required!"],
      validate: {
        validator: (v) => /^[0-9]{10}$/.test(v),
        message: "Phone number must be a 10-digit number.",
      },
    },
    image: {
      type: String,
      default: "https://ik.imagekit.io/y5lkgycsj/user%20(1).png?updatedAt=1756832218727",
    },
    role: {
      type: String,
      enum: ["admin", "user", "vendor" ,"team"],
      default: "user",
    },
    bookings: [
      {
        type: Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
    delivery: [
      {
        type: Schema.Types.ObjectId,
        ref: "Delivery",
      },
    ],
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    feedbacks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Contact",
      },
    ],
    wishlists: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    vendorWishlists: [
      {
        type: Schema.Types.ObjectId,
        ref: "Vendor",
      },
    ],
    // userSchema additions
resetPasswordToken: {
  type: String,
  default: null,
},
resetPasswordExpires: {
  type: Date,
  default: null,
},
  },
  {
    timestamps: true,
  }
);

// Convert email to lowercase
userSchema.pre("save", function (next) {
  if (this.isModified("email")) {
    this.email = this.email.toLowerCase();
  }
  next();
});

// 🧹 Cleanup middleware on user deletion
userSchema.pre("findOneAndDelete", async function (next) {
  const user = await this.model.findOne(this.getFilter());
  if (!user) return next();

  await Promise.all([
    mongoose.model("Review").deleteMany({ _id: { $in: user.reviews } }),
    mongoose.model("Booking").deleteMany({ _id: { $in: user.bookings } }),
    mongoose.model("Contact").deleteMany({ _id: { $in: user.feedbacks } }),

    mongoose.model("Product").updateMany(
      { _id: { $in: user.wishlists } },
      { $pull: { wishlists: user._id } }
    ),

    mongoose.model("Vendor").updateMany(
      { _id: { $in: user.vendorWishlists } },
      { $pull: { wishlists: user._id } }
    ),
  ]);

  next();
});

// Use email for login
userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
});

const User = mongoose.model("User", userSchema);
export { User };
