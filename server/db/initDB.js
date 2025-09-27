import dotenv from 'dotenv';
dotenv.config({
    path:"../.env"
})
import mongoose from "mongoose";

// Database configuration with proper connection management
const connectDB = async () => {
    try {
        // Configure mongoose connection options for better connection management
        const connectionOptions = {
            maxPoolSize: 3, // Smaller pool for initialization script
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        await mongoose.connect(process.env.MONGODB_URI, connectionOptions);
        console.log("✅ DB Connection Success for initialization!");
        return true;
    } catch (error) {
        console.error("❌ DB Connection Error:", error);
        return false;
    }
};

// Initialize database connection
const dbConnected = await connectDB();
if (!dbConnected) {
    console.error("❌ Failed to connect to database. Exiting...");
    process.exit(1);
}

import {Faq} from "../models/faq.model.js";

const faqData = [
    {
        title: "How do I order a product on The Shopzo?",
        solution: "Ordering a product is easy! Browse through the available clothing categories, select the items you're interested in, and click 'In-Store Shopping' or 'Seamless Home Delivery'. You can then proceed to finalize your order, choose the desired pickup location, and confirm your order."
    },
    // {
    //     title: "What payment methods are accepted?",
    //     solution: "We accept various payment options, including major credit/debit cards, UPI, net banking, and mobile wallets. You can securely complete your transaction directly on our platform."
    // },
    {
        title: "Can I change or cancel my order?",
        solution: "Yes, you can cancel or modify your order depending on the vendor’s policy. Please check the specific vendor’s cancellation policy before finalizing your order. For more details, visit the vendor’s page or contact customer support."
    },
    {
        title: "How do I contact a vendor for more details?",
        solution: "You can reach out to the vendor through the contact details provided on the product page. You can also use the messaging feature on our platform to ask the vendor any questions before finalizing your order."
    },
    {
        title: "Is my personal  information secure?",
        solution: "Yes, The Shopzo uses advanced security measures, including encryption and data hashing to ensure that your personal information is fully protected."
    },
    {
        title: "How can I track my product after ordering?",
        solution: "Once your order is confirmed, you will receive a booking reference and details for your pickup location. You can track the status of your order and any updates directly through your account dashboard."
    },
    {
        title: "What happens if I’m unable to pick up my product on time?",
        solution: "We recommend that you pick up your product as soon as possible. If you are unable to collect it on time, contact the vendor directly to discuss any extensions or re-ordering options, based on the vendor's availability and policy."
    },
    {
        title: "Can I exchange or return a product after picking it up?",
        solution: "Exchanges or returns depend on the vendor's policy. Each vendor has their own return and exchange policy, which you can view on the product page. Be sure to check it before confirming your order."
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


// import {Vendor} from "../models/vendor.model.js";
// import {Category} from "../models/category.model.js";
// import {Product} from "../models/product.model.js";
// Storing sample dataset in database
const initDB = async() => {
    try {
        console.log("🔄 Initializing FAQ data...");
        
        // Check if FAQ data already exists
        const existingFaqs = await Faq.countDocuments();
        if (existingFaqs > 0) {
            console.log("✅ FAQ data already exists. Skipping initialization.");
            return;
        }

        // Insert FAQ data
        await Faq.insertMany(faqData);
        console.log("✅ FAQ data initialized successfully!");
        
    } catch (error) {
        console.error("❌ Error initializing FAQ data:", error);
    } finally {
        // Always close the connection after initialization
        try {
            await mongoose.connection.close();
            console.log("🗄️ Database connection closed after initialization.");
        } catch (closeError) {
            console.error("❌ Error closing database connection:", closeError);
        }
        process.exit(0);
    }
}

initDB();