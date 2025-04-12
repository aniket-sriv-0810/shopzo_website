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

// import {Faq} from "../models/faq.model.js";

// const faqData = [
//     {
//         title: "How do I book a stay on Urbanhaven?",
//         solution: "Booking with Urbanhaven is simple. Enter your destination, travel dates, and preferences in the search bar. Browse through verified accommodations, select your ideal stay, and proceed with secure checkout."
//     },
//     {
//         title: "What payment options are available?",
//         solution: "We support multiple payment methods, including major credit/debit cards, net banking, UPI, PayPal, and digital wallets. Transactions are encrypted for a seamless and secure payment experience."
//     },
//     {
//         title: "Can I modify or cancel my booking?",
//         solution: "Yes, cancellation and modification policies vary by property. Some stays allow free cancellation within a specified timeframe, while others may have stricter terms. Check the cancellation policy before booking for details."
//     },
//     {
//         title: "Is my personal and payment information secure?",
//         solution: "Absolutely. Urbanhaven employs advanced security protocols, encrypted payments, and data protection measures to ensure your personal and financial details remain confidential and secure."
//     },
//     {
//         title: "What if I need assistance during my stay?",
//         solution: "Our 24/7 customer support team is always available to assist you. If you face any issues, reach out through our helpline, live chat, or email for immediate support."
//     },
//     {
//         title: "Are the accommodations verified for quality and safety?",
//         solution: "Yes, every listing on Urbanhaven goes through a thorough verification process. We ensure all accommodations meet high standards of safety, comfort, and authenticity."
//     },
//     {
//         title: "How do I leave a review after my stay?",
//         solution: "After your stay, you’ll receive an email invitation to rate and review your experience. Your feedback helps us maintain quality and assists future travelers in making informed decisions."
//     }
// ];

import {Vendor} from "../models/vendor.model.js";
import {Category} from "../models/category.model.js";
import {Product} from "../models/product.model.js";
// Storing sample dataset in database
const initDB = async() => {
    // await Hotel.deleteMany({});
    // await User.deleteMany({});
    // await Booking.deleteMany({});
    // await Review.deleteMany({});
    // await Category.deleteMany({});
    // console.log("Data deleted successfully 01 !");
    // await Vendor.deleteMany({});
    // console.log("Data deleted successfully 01 !");
    await Product.deleteMany({});
    console.log("Data deleted successfully 01 !");
    // await Hotel.insertMany(sampleData);
    // await Category.insertMany(categories);
    // console.log("Data inserted successfully 01 !");
    // await Vendor.insertMany(vendors);
    // console.log("Data inserted successfully  02 !");
    await Product.insertMany(products);
    console.log("Data inserted successfully 03!");
    // await Blog.deleteMany({});
}

initDB();