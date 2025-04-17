import dotenv from 'dotenv';
dotenv.config({
    path:"../.env"
})
import mongoose from "mongoose";
import {categories} from "./category.js";
import { products } from './products (1).js';
import { vendors } from './vendors (1).js';
// Database configuration
main()
.then(() =>{
    console.log("DB Success !");
})
.catch((err) =>{
    console.error("DB Error !" , err);
})

async function main(){
    await mongoose.connect(process.env.MONGODB_URI);
}

import {Faq} from "../models/faq.model.js";

const faqData = [
    {
        title: "How do I book a product on The Shopzo?",
        solution: "Booking a product is easy! Browse through the available clothing categories, select the items you're interested in, and click 'Book Now.' You can then proceed to finalize your booking, choose the desired pickup location, and confirm your order."
    },
    {
        title: "What payment methods are accepted?",
        solution: "We accept various payment options, including major credit/debit cards, UPI, net banking, and mobile wallets. You can securely complete your transaction directly on our platform."
    },
    {
        title: "Can I change or cancel my order?",
        solution: "Yes, you can cancel or modify your order depending on the vendor’s policy. Please check the specific vendor’s cancellation policy before finalizing your booking. For more details, visit the vendor’s page or contact customer support."
    },
    {
        title: "How do I contact a vendor for more details?",
        solution: "You can reach out to the vendor through the contact details provided on the product page. You can also use the messaging feature on our platform to ask the vendor any questions before finalizing your booking."
    },
    {
        title: "Is my personal and payment information secure?",
        solution: "Yes, The Shopzo uses advanced security measures, including encryption and secure payment gateways, to ensure that your personal and financial information is fully protected."
    },
    {
        title: "How can I track my product after booking?",
        solution: "Once your order is confirmed, you will receive a booking reference and details for your pickup location. You can track the status of your booking and any updates directly through your account dashboard."
    },
    {
        title: "What happens if I’m unable to pick up my product on time?",
        solution: "We recommend that you pick up your product as soon as possible. If you are unable to collect it on time, contact the vendor directly to discuss any extensions or rebooking options, based on the vendor's availability and policy."
    },
    {
        title: "Can I exchange or return a product after picking it up?",
        solution: "Exchanges or returns depend on the vendor's policy. Each vendor has their own return and exchange policy, which you can view on the product page. Be sure to check it before confirming your booking."
    },
    {
        title: "How do I become a vendor on The Shopzo?",
        solution: "To become a vendor on The Shopzo, sign up by visiting our vendor registration page. You’ll need to provide details about your store, products, and agree to our terms. Once approved, you can start listing your products and start receiving orders."
    },
    {
        title: "Are the products listed on The Shopzo authentic?",
        solution: "Yes, all products listed on The Shopzo are from verified local vendors. We ensure that each vendor follows our standards for quality and authenticity, and that products are sourced directly from trusted suppliers."
    }
];


import {Vendor} from "../models/vendor.model.js";
import {Category} from "../models/category.model.js";
import {Product} from "../models/product.model.js";
// Storing sample dataset in database
const initDB = async() => {
    // await Hotel.deleteMany({});
    // await User.deleteMany({});
    // await Booking.deleteMany({});
    // await Review.deleteMany({});
    await Category.deleteMany({});
    console.log("Category deleted successfully 01 !");
    await Vendor.deleteMany({});
    console.log("Vendor deleted successfully 01 !");
    // await Faq.deleteMany({});
    // console.log("Data deleted successfully 01 !");
    await Product.deleteMany({});
    console.log("Product deleted successfully 01 !");
    // await Hotel.insertMany(sampleData);
    // await Category.insertMany(categories);
    // console.log("Data inserted successfully 01 !");
    // await Vendor.insertMany(vendors);
    // console.log("Data inserted successfully  02 !");
    // await Product.insertMany(products);
    // console.log("Data inserted successfully 03!");
    // await Faq.insertMany(faqData);
    // console.log("Data inserted successfully 03!");
    // await Blog.deleteMany({});
}

initDB();