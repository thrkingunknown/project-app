// Simple test endpoint for Vercel
module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // Simple response
    res.status(200).json({
        message: 'FAXRN Backend is working!',
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        environment: process.env.NODE_ENV || 'development',
        mongoConfigured: !!process.env.MONGODB_URI,
        jwtConfigured: !!process.env.JWT_SECRET
    });
};
