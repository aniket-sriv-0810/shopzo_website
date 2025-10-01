import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { Vendor } from '../models/vendor.model.js';

// Generate JWT token
export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: '7d', // 7 days expiry
  });
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// JWT Authentication middleware for users
export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(
        new ApiError(401, ['No token provided'], 'Authentication required')
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = verifyToken(token);

    if (decoded.type !== 'user') {
      return res.status(401).json(
        new ApiError(401, ['Invalid token type'], 'User authentication required')
      );
    }

    // Fetch user from database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json(
        new ApiError(401, ['User not found'], 'Invalid token')
      );
    }

    // Attach user to request object
    req.user = user;
    req.isAuthenticated = () => true;
    
    next();
  } catch (error) {
    console.error('JWT Authentication Error:', error);
    return res.status(401).json(
      new ApiError(401, [error.message], 'Authentication failed')
    );
  }
};

// JWT Authentication middleware for vendors
export const authenticateVendor = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(
        new ApiError(401, ['No token provided'], 'Authentication required')
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = verifyToken(token);

    if (decoded.type !== 'vendor') {
      return res.status(401).json(
        new ApiError(401, ['Invalid token type'], 'Vendor authentication required')
      );
    }

    // Fetch vendor from database
    const vendor = await Vendor.findById(decoded.id);
    if (!vendor) {
      return res.status(401).json(
        new ApiError(401, ['Vendor not found'], 'Invalid token')
      );
    }

    // Attach vendor to request object
    req.vendor = vendor;
    req.isAuthenticated = () => true;
    
    next();
  } catch (error) {
    console.error('JWT Vendor Authentication Error:', error);
    return res.status(401).json(
      new ApiError(401, [error.message], 'Authentication failed')
    );
  }
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.isAuthenticated = () => false;
      return next();
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (decoded.type === 'user') {
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
        req.isAuthenticated = () => true;
      }
    } else if (decoded.type === 'vendor') {
      const vendor = await Vendor.findById(decoded.id);
      if (vendor) {
        req.vendor = vendor;
        req.isAuthenticated = () => true;
      }
    }

    if (!req.isAuthenticated) {
      req.isAuthenticated = () => false;
    }

    next();
  } catch (error) {
    // If token is invalid, just continue without authentication
    req.isAuthenticated = () => false;
    next();
  }
};