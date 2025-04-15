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

  // Delete all associated products
  await mongoose.model("Product").deleteMany({ _id: { $in: category.products } });

  // Optional: If you just want to unset category field from products
  await mongoose.model("Product").updateMany(
    { _id: { $in: category.products } },
    { $unset: { category: "" } }
  );

  // Delete all associated vendors
  await mongoose.model("Vendor").deleteMany({ _id: { $in: category.vendors } });

  // Optional: If you just want to remove category reference from vendors
  await mongoose.model("Vendor").updateMany(
    { _id: { $in: category.vendors } },
    { $unset: { category: "" } }
  );

  next();
});

const Category = mongoose.model("Category", categorySchema);
export { Category };
