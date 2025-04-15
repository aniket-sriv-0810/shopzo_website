import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const Schema = mongoose.Schema;

const vendorSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required!"],
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Username is required!"],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Email is required!"],
      lowercase: true,
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
    address: {
      area: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
    },
    image: {
      type: String,
      default: "https://media-hosting.imagekit.io//4bc72ff0889f4681/demo.png",
      required: [true, "Vendor Image is required!"],
    },
    role: {
      type: String,
      enum: ["vendor"],
      default: "vendor",
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    vendor_wishlists: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    bookings: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Normalize username and email before saving
vendorSchema.pre("save", function (next) {
  if (this.isModified("username")) this.username = this.username.toLowerCase();
  if (this.isModified("email")) this.email = this.email.toLowerCase();
  next();
});

// 🧹 Cleanup middleware before deletion
vendorSchema.pre("findOneAndDelete", async function (next) {
  const vendor = await this.model.findOne(this.getFilter());
  if (!vendor) return next();

  const { products, reviews, bookings } = vendor;

  await mongoose.model("Product").deleteMany({ _id: { $in: products } });
  await mongoose.model("Review").deleteMany({ _id: { $in: reviews } });
  await mongoose.model("User").deleteMany({ _id: { $in: bookings } });

  // Optional: remove vendor reference from categories
  await mongoose.model("Category").updateMany(
    { vendors: vendor._id },
    { $pull: { vendors: vendor._id } }
  );

  // Optional: remove vendor from user wishlists
  await mongoose.model("User").updateMany(
    { vendor_wishlists: vendor._id },
    { $pull: { vendor_wishlists: vendor._id } }
  );

  next();
});

// Enable username/password authentication
vendorSchema.plugin(passportLocalMongoose, {
  usernameField: "username", // could use "email" if desired
  errorMessages: {
    UserExistsError: "A vendor with the given username already exists.",
  },
});

const Vendor = mongoose.model("Vendor", vendorSchema);
export { Vendor };
