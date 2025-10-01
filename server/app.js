import dotenv from 'dotenv';
dotenv.config({
  path: './.env',
});
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import passport from './middleware/passport.middleware.js';
import session from 'express-session';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware setup
// Allow configuring additional origins via env (comma-separated)
const extraOrigins = (process.env.CORS_ALLOWED_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://shopzo-website.onrender.com',
  'https://theshopzo.com',
  'https://www.theshopzo.com',
  ...extraOrigins,
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: No access from origin ${origin}`), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposedHeaders: [
    'Authorization',
    'Access-Control-Allow-Credentials'
  ],
  optionsSuccessStatus: 200,
  preflightContinue: false,
  maxAge: 86400, // 24 hours preflight cache
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration for passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());


// Serve static files from the public folder
const clientBuildPath = path.join(__dirname, 'public');
app.use(express.static(clientBuildPath, {
    setHeaders: (res, path) => {
      console.log('Serving static file:', path); // Log all served files
    }
  }));

// Routing for API requests
import userRouter from './router/user.router.js';
import vendorRouter from './router/vendor.router.js';
import adminRouter from './router/admin.router.js';
import categoryRouter from './router/category.router.js';
import productRouter from './router/product.router.js';
import navigationRouter from './router/navigation.router.js';
import internRouter from './router/intern.router.js';

app.use('/api/user', userRouter);
app.use('/api/vendor', vendorRouter);
app.use('/api/admin', adminRouter);
app.use('/api/category', categoryRouter);
app.use('/api/product', productRouter);
app.use('/api/navigation', navigationRouter);
app.use('/api/intern', internRouter);

// React Router Fix - Serves index.html for unhandled routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

export { app };
