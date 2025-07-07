// Simplified Vercel Serverless Function for FAXRN
const mongoose = require('mongoose');

// MongoDB connection with caching
let cachedConnection = null;

async function connectToDatabase() {
    if (cachedConnection && mongoose.connection.readyState === 1) {
        return cachedConnection;
    }

    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            bufferCommands: false
        });
        
        cachedConnection = connection;
        return connection;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

// CORS helper
function setCorsHeaders(res) {
    const allowedOrigins = process.env.FRONTEND_URLS 
        ? process.env.FRONTEND_URLS.split(',').map(url => url.trim())
        : ['https://project-app-omega-two.vercel.app'];
    
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
}

// Main serverless function handler
module.exports = async (req, res) => {
    try {
        // Set CORS headers
        setCorsHeaders(res);
        
        // Handle preflight requests
        if (req.method === 'OPTIONS') {
            res.status(200).end();
            return;
        }
        
        // Connect to database
        await connectToDatabase();
        
        // Simple routing
        if (req.url === '/' || req.url === '') {
            res.status(200).json({
                message: "FAXRN Backend API is running!",
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV || 'development',
                version: '1.0.0',
                mongoConnected: mongoose.connection.readyState === 1
            });
            return;
        }
        
        // Health check
        if (req.url === '/health') {
            res.status(200).json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                mongoConnected: mongoose.connection.readyState === 1
            });
            return;
        }
        
        // For now, return a simple response for other routes
        res.status(200).json({
            message: "FAXRN API endpoint",
            url: req.url,
            method: req.method,
            note: "Full API implementation coming soon"
        });
        
    } catch (error) {
        console.error('Serverless function error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
};
