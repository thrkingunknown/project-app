// Minimal Vercel test function - no database connection
module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // Simple response without database
    res.status(200).json({
        message: "FAXRN Backend is working on Vercel!",
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        environment: process.env.NODE_ENV || 'development',
        envVarsSet: {
            mongoUri: !!process.env.MONGODB_URI,
            jwtSecret: !!process.env.JWT_SECRET,
            emailUser: !!process.env.EMAIL_USER,
            frontendUrls: !!process.env.FRONTEND_URLS
        }
    });
};
