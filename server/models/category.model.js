import mongoose from "mongoose";

const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Category title is required!"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      default: "https://media-hosting.imagekit.io//4bc72ff0889f4681/demo.png",
      required: [true, "Category Image is required!"],
    },
    tag: {
      type: String,
      enum: ["male", "female"],
      required: [true, "Tag (male or female) is required"],
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    vendors: [
      {
        type: Schema.Types.ObjectId,
        ref: "Vendor",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// 🧹 Cleanup middleware before deleting a category
categorySchema.pre("findOneAndDelete", async function (next) {
  const category = await this.model.findOne(this.getFilter());
  if (!category) return next();

  const productIds = category.products || [];
  const vendorIds = category.vendors || [];

  // 1. 🗑 Delete associated products
  await mongoose.model("Product").deleteMany({ _id: { $in: productIds } });

  // 2. 🔁 Remove category reference from vendors (NOT deleting vendors)
  await mongoose.model("Vendor").updateMany(
    { _id: { $in: vendorIds } },
    { $pull: { categories: category._id } }
  );

  next();
});


const Category = mongoose.model("Category", categorySchema);
export { Category };
