import dotenv from "dotenv";
dotenv.config({
    path:'./.env'
});
import mongoose from 'mongoose';
import {app} from './app.js';

// Set Node.js to use legacy OpenSSL
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const PORT = process.env.PORT || 3000;

// Database configuration and Connection with proper connection management
const connectDB = async () => {
    try {
        // Configure mongoose connection options for better connection management
        const connectionOptions = {
            maxPoolSize: 5, // Limit connection pool size
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        };

        await mongoose.connect(process.env.MONGODB_URI, connectionOptions);
        console.log("✅ MongoDB Connection Established Successfully!");
        
        // Start server only after successful DB connection
        const server = app.listen(PORT, () => {
            console.log(`🚀 Backend Running at: http://localhost:${PORT}`);
        });

        // Graceful shutdown handling
        const gracefulShutdown = async (signal) => {
            console.log(`\n🔄 Received ${signal}. Graceful shutdown initiated...`);
            
            server.close(async () => {
                console.log('🔌 HTTP server closed.');
                
                try {
                    await mongoose.connection.close();
                    console.log('🗄️ MongoDB connection closed.');
                    process.exit(0);
                } catch (error) {
                    console.error('❌ Error during MongoDB disconnection:', error);
                    process.exit(1);
                }
            });
        };

        // Handle process termination signals
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    } catch (error) {
        console.error("❌ Failed to Connect with Database:", error);
        process.exit(1);
    }
};

connectDB();