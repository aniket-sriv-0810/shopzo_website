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
      enum: [
        // Clothing sizes
        "XS", "S", "M", "L", "XL", "XXL", "XXXL",
        // Pants & Jeans sizes (waist)
        "28", "30", "32", "34", "36", "38", "40", "42", "44", "46",
        // Shoe sizes
        "6", "7", "8", "9", "10", "11", "12", "13",
        // Kids clothing (age-based)
        "2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y", "14-15Y",
        // Bra sizes
        "32A", "32B", "32C", "34A", "34B", "34C", "36A", "36B", "36C", "38A", "38B", "38C",
        // Special sizes
        "Free Size"
      ],
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

    vendor: {
        type: Schema.Types.ObjectId,
        ref: "Vendor",
        required: [true, "Vendor is required"],
      },
    

    bookings: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    delivery: [
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

  const productId = product._id;

  // 1. Remove product from users’ wishlists and bookings
  await mongoose.model("User").updateMany(
    {
      $or: [
        { wishlists: productId },
        { bookings: productId }
      ]
    },
    {
      $pull: {
        wishlists: productId,
        bookings: productId,
      }
    }
  );

  // 2. Remove product from vendor's product list
  await mongoose.model("Vendor").updateMany(
    { products: productId },
    {
      $pull: {
        products: productId,
      }
    }
  );

  // 3. Delete all bookings that reference this product
  await mongoose.model("Booking").deleteMany({ product: productId });

  // 4. Remove product from category’s products array
  await mongoose.model("Category").updateMany(
    { products: productId },
    {
      $pull: {
        products: productId,
      }
    }
  );

  next();
});


const Product = mongoose.model("Product", productSchema);
export { Product };
