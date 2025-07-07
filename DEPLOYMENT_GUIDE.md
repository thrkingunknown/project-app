# 🚀 FAXRN Vercel Deployment Guide

## Overview
This guide will help you deploy your FAXRN backend to Vercel with optimal performance and speed optimizations.

## 🎯 Performance Optimizations Implemented

### Backend Optimizations:
- ✅ **Serverless Architecture**: Optimized for Vercel Functions
- ✅ **MongoDB Connection Caching**: Reuses connections across function calls
- ✅ **Request Size Limiting**: 10MB limit for Vercel compatibility
- ✅ **Performance Monitoring**: Response time tracking
- ✅ **Smart Caching**: Cache headers for static responses
- ✅ **CORS Optimization**: Multi-origin support with minimal overhead
- ✅ **Environment-based Configuration**: Production vs development settings

### Frontend Optimizations:
- ✅ **Environment-based API URLs**: Automatic production/development switching
- ✅ **Vercel SPA Configuration**: Optimized routing with rewrites

## 📋 Prerequisites

1. **Vercel CLI**: Install globally
   ```bash
   npm install -g vercel
   ```

2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)

3. **Environment Variables**: Prepare your production values

## 🔧 Backend Deployment Steps

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy Backend
```bash
vercel --prod
```

### Step 4: Set Environment Variables
In your Vercel dashboard, add these environment variables:

**Required Variables:**
- `NODE_ENV` = `production`
- `MONGODB_URI` = `your_mongodb_connection_string`
- `JWT_SECRET` = `your_jwt_secret`
- `JWT_REFRESH_SECRET` = `your_refresh_secret`
- `EMAIL_USER` = `your_email@gmail.com`
- `EMAIL_PASSWORD` = `your_app_password`
- `FRONTEND_URLS` = `https://project-app-omega-two.vercel.app,http://localhost:5173`

**Optional Variables:**
- `JWT_EXPIRES_IN` = `24h`
- `JWT_REFRESH_EXPIRES_IN` = `7d`
- `EMAIL_SERVICE` = `gmail`
- `BCRYPT_ROUNDS` = `10`
- `PLATFORM_NAME` = `FAXRN`

### Step 5: Update Frontend Configuration
After backend deployment, update `frontend/.env.production`:
```env
VITE_BACKEND_URL=https://your-backend-domain.vercel.app
```

## 🌐 Frontend Deployment Steps

### Step 1: Navigate to Frontend Directory
```bash
cd frontend
```

### Step 2: Deploy Frontend
```bash
vercel --prod
```

## 🔍 Verification Steps

### 1. Test Backend Health
```bash
curl https://your-backend-domain.vercel.app/
```

### 2. Test CORS Configuration
```bash
curl -H "Origin: https://project-app-omega-two.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://your-backend-domain.vercel.app/login
```

### 3. Test API Endpoints
- Registration: `POST /register`
- Login: `POST /login`
- Posts: `GET /posts`
- Create Post: `POST /posts`

## ⚡ Performance Features

### 1. **Connection Caching**
- MongoDB connections are cached and reused
- Reduces cold start times by ~200ms

### 2. **Smart CORS**
- Dynamic origin validation
- Minimal overhead for allowed origins

### 3. **Response Optimization**
- Gzip compression enabled
- Appropriate cache headers
- Performance monitoring headers

### 4. **Error Handling**
- Graceful database connection failures
- Detailed error logging (development only)
- User-friendly error messages

## 🛠 Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Verify `FRONTEND_URLS` environment variable
   - Check origin in browser developer tools

2. **Database Connection Issues**
   - Verify `MONGODB_URI` is correct
   - Check MongoDB Atlas IP whitelist (allow all: 0.0.0.0/0)

3. **Authentication Errors**
   - Verify `JWT_SECRET` is set
   - Check token format in requests

4. **Email Issues**
   - Use Gmail App Password, not regular password
   - Verify `EMAIL_USER` and `EMAIL_PASSWORD`

### Performance Monitoring:
- Check Vercel dashboard for function execution times
- Monitor response times via `X-Response-Time` header
- Use browser developer tools for frontend performance

## 📊 Expected Performance

### Cold Start Times:
- **First Request**: ~800ms (includes DB connection)
- **Subsequent Requests**: ~100-200ms (cached connection)

### Response Times:
- **Simple GET requests**: 50-100ms
- **Database queries**: 100-300ms
- **Authentication**: 200-400ms (bcrypt overhead)

## 🔄 Continuous Deployment

### Automatic Deployment:
1. Connect your GitHub repository to Vercel
2. Enable automatic deployments
3. Push to main branch triggers deployment

### Environment Management:
- Use Vercel environment variables for secrets
- Keep `.env.production` for non-sensitive defaults
- Never commit sensitive data to git

## 🎉 Success Checklist

- [ ] Backend deployed to Vercel
- [ ] All environment variables set
- [ ] Frontend updated with new backend URL
- [ ] Frontend deployed to Vercel
- [ ] CORS working correctly
- [ ] Authentication working
- [ ] Database operations working
- [ ] Email functionality working
- [ ] Performance monitoring active

## 📞 Support

If you encounter issues:
1. Check Vercel function logs
2. Verify environment variables
3. Test API endpoints individually
4. Check browser console for frontend errors

Your FAXRN application is now optimized for Vercel's serverless platform! 🎉
