import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required!"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required!"],
      trim: true,
    },

    originalPrice: {
      type: Number,
      required: [true, "Original price is required!"],
      min: [0, "Price must be a positive number"],
    },
    discountedPrice: {
      type: Number,
      required: [true, "Discounted price is required!"],
      min: [0, "Price must be a positive number"],
      validate: {
        validator: function (v) {
          return v < this.originalPrice;
        },
        message: "Discounted price must be less than the original price",
      },
    },

    images: {
      type: [String],
      validate: [
        {
          validator: function (arr) {
            return arr.length <= 7;
          },
          message: "A maximum of 7 images are allowed per product.",
        },
      ],
      default: [
        "https://media-hosting.imagekit.io//4bc72ff0889f4681/demo.png",
      ],
    },

    sizes: {
      type: [String],
      enum: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
      default: "M",
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product must belong to a category"],
    },

    tag: {
      type: String,
      enum: ["male", "female"],
      required: [true, "Tag (male or female) is required"],
    },

    wishlists: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    vendor: [
      {
        type: Schema.Types.ObjectId,
        ref: "Vendor",
        required: [true, "Vendor is required"],
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

productSchema.pre("findOneAndDelete", async function (next) {
  const product = await this.model.findOne(this.getFilter());
  if (!product) return next();

  const ProductID = product._id;

  // Remove product from all users' wishlists and bookings
  await mongoose.model("User").updateMany(
    {},
    {
      $pull: {
        wishlists: ProductID,
        bookings: ProductID,
      },
    }
  );

  // Remove product from all vendors' products array
  await mongoose.model("Vendor").updateMany(
    {},
    {
      $pull: {
        products: ProductID,
      },
    }
  );

  // Optional: Remove product from any category if needed
  await mongoose.model("Category").updateMany(
    {},
    {
      $pull: {
        products: ProductID,
      },
    }
  );

  next();
});

const Product = mongoose.model("Product", productSchema);
export { Product };
