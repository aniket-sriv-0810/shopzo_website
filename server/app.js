import dotenv from "dotenv";
dotenv.config({
    path:'./.env'
});
import express from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from './middleware/passport.middleware.js';

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

//  Set trust proxy before session middleware
app.set("trust proxy", 1);  // Required for Render & secure cookies

// Middleware setup
const corsSessionOption = {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
};

const expressSessionOption = {
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
        mongoUrl: process.env.MONGODB_URI,  // Use your MongoDB connection URL
        collectionName: 'sessions', // Optional: Specify collection name
        autoRemove: 'disabled',
    }),
    cookie: {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day expiry time
        secure: isProduction, // Secure only in production
        sameSite: isProduction ? 'none' : 'lax',
    },
};

app.use(cors(corsSessionOption));
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session(expressSessionOption));
app.use(passport.initialize());
app.use(passport.session());

// Debugging Middleware
app.use((req, res, next) => {
    console.log("Cookies Received:", req.cookies);
    console.log("Session ID:", req.sessionID);
    console.log("Session Data:", req.session);
    next();
});


app.get("/" , (req , res) => {
    res.status(200).json({"message" : "Everything working well ! Lets Go !"})
})

import userRouter from "./router/user.router.js";
import vendorRouter from "./router/vendor.router.js";
import adminRouter from "./router/admin.router.js";
import categoryRouter from "./router/category.router.js";
import productRouter from "./router/product.router.js";
import navigationRouter from "./router/navigation.router.js";


app.use('/api/user' , userRouter);
app.use('/api/vendor' , vendorRouter);
app.use('/api/admin' , adminRouter);
app.use('/api/category' , categoryRouter);
app.use('/api/product' , productRouter);
app.use('/api/navigation' , navigationRouter);


export { app };