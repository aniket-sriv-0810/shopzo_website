import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User Details are required"],
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: [true, "Vendor Details are required"],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product Details are required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category Details are required"],
    },
    sizeSelected: {
      type: String,
      enum: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
      required: [true, "Size Detail is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity Amount is required"],
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: [true, "Final Bill details are required"],
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "cancelled", "completed"],
      default: "pending",
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    address: {
      houseNo: String,
      floorNo: String,
      buildingName: { type: String, required: true },
      fullAddress: { type: String, required: true },
      landmark: { type: String, required: true },
      city: { type: String, required: true },
      pincode: {
        type: String,
        required: true,
        validate: {
          validator: (v) => /^\d{6}$/.test(v),
          message: "Invalid pincode",
        },
      },
    },
  },
  { timestamps: true }
);

const Delivery = mongoose.model("Delivery", deliverySchema);

export { Delivery };
