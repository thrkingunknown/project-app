// Performance monitoring middleware for Vercel
const performanceMiddleware = (req, res, next) => {
    const startTime = Date.now();
    
    // Add performance headers
    res.setHeader('X-Powered-By', 'FAXRN-Vercel');
    res.setHeader('X-Response-Time', '0ms');
    
    // Override res.end to calculate response time
    const originalEnd = res.end;
    res.end = function(...args) {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        // Set actual response time
        res.setHeader('X-Response-Time', `${responseTime}ms`);
        
        // Log performance metrics (only in development)
        if (process.env.NODE_ENV !== 'production') {
            console.log(`${req.method} ${req.path} - ${responseTime}ms`);
        }
        
        // Call original end method
        originalEnd.apply(this, args);
    };
    
    next();
};

// Request size limiter for Vercel
const requestSizeLimiter = (req, res, next) => {
    const maxSize = 10 * 1024 * 1024; // 10MB limit for Vercel
    
    if (req.headers['content-length'] && parseInt(req.headers['content-length']) > maxSize) {
        return res.status(413).json({
            error: 'Request too large',
            message: 'Request size exceeds 10MB limit'
        });
    }
    
    next();
};

// Cache headers for static responses
const cacheMiddleware = (req, res, next) => {
    // Cache static endpoints for 5 minutes
    if (req.path === '/' || req.path === '/config-check') {
        res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
    }
    
    // Don't cache API responses
    if (req.path.startsWith('/api') || req.path.includes('login') || req.path.includes('register')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }
    
    next();
};

module.exports = {
    performanceMiddleware,
    requestSizeLimiter,
    cacheMiddleware
};
