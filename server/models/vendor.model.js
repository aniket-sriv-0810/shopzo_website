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

  const { _id: vendorId } = vendor;

  // 1. Find and delete associated bookings
  const bookingsToDelete = await mongoose.model("Booking").find({ vendor: vendorId });
  const bookingIds = bookingsToDelete.map((b) => b._id);

  await mongoose.model("Booking").deleteMany({ _id: { $in: bookingIds } });

  // 2. Remove deleted bookings from users
  await mongoose.model("User").updateMany(
    { bookings: { $in: bookingIds } },
    { $pull: { bookings: { $in: bookingIds } } }
  );

  // 3. Delete vendor's products
  const productsToDelete = await mongoose.model("Product").find({ vendor: vendorId });
  const productIds = productsToDelete.map((p) => p._id);

  await mongoose.model("Product").deleteMany({ _id: { $in: productIds } });

  // 4. Remove product references from users
  await mongoose.model("User").updateMany(
    { wishlists: { $in: productIds } },
    { $pull: { wishlists: { $in: productIds } } }
  );

  // 5. Remove vendor reference from categories (not deleting categories!)
  await mongoose.model("Category").updateMany(
    { vendors: vendorId },
    { $pull: { vendors: vendorId } }
  );

  // 6. Delete reviews left by vendor (optional, if vendors leave reviews)
  await mongoose.model("Review").deleteMany({ _id: { $in: vendor.reviews } });

  // 7. Remove vendor from users' vendorWishlists
  await mongoose.model("User").updateMany(
    { vendorWishlists: vendorId },
    { $pull: { vendorWishlists: vendorId } }
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
