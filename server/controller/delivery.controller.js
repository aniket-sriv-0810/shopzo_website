import { Delivery } from "../models/delivery.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";

const createDelivery = async (req, res) => {
  try {
    const { product, sizeSelected, quantity, address } = req.body;
    const user = req.user._id;

    if (!product || !sizeSelected || !quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: "Invalid input." });
    }

    const foundProduct = await Product.findById(product).populate("vendor category");
    if (!foundProduct) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    const totalPrice = quantity * foundProduct.discountedPrice;

    const newDelivery = await Delivery.create({
      user,
      vendor: foundProduct.vendor._id,
      product,
      category: foundProduct.category._id,
      sizeSelected,
      quantity,
      totalPrice,
      address,
    });

    await User.findByIdAndUpdate(user, {
      $push: { bookings: newDelivery._id }, // optional: keep deliveries in bookings array too
    });

    return res.status(201).json({
      success: true,
      message: "Delivery created successfully.",
      data: newDelivery,
    });
  } catch (err) {
    console.error("Delivery error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const getDeliveryConfirmation = async (req, res) => {
  try {
    const { id } = req.params;
    const delivery = await Delivery.findById(id)
      .populate("user product vendor category");

    if (!delivery) {
      return res.status(404).json({ success: false, message: "Delivery not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Delivery confirmation details",
      data: delivery,
    });
  } catch (err) {
    console.error("Delivery confirmation error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export { createDelivery, getDeliveryConfirmation };
