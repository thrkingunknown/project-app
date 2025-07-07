# 🔧 Vercel Deployment Fix Guide

## Issue Identified
The serverless function was crashing due to improper function export format for Vercel.

## ✅ Fixes Applied

### 1. **Fixed Function Export Format**
- Changed from `module.exports = app` to proper Vercel handler format
- Added database connection initialization in handler

### 2. **Created Simplified Test Function**
- `api/simple.js` - Minimal working serverless function
- Basic CORS handling
- MongoDB connection test
- Health check endpoints

### 3. **Updated Vercel Configuration**
- Modified `vercel.json` to use simplified function
- Proper routing configuration

## 🚀 Deployment Steps

### Step 1: Set Environment Variables in Vercel Dashboard
**CRITICAL**: The environment variables must be set in Vercel dashboard, not in files.

Go to: `https://vercel.com/dashboard` → Your Project → Settings → Environment Variables

Add these variables:
```
MONGODB_URI=mongodb+srv://pict434:user@cluster0.r7sovhx.mongodb.net/Faxrn?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=faxrn_super_secret_key_2024
JWT_REFRESH_SECRET=faxrn_refresh_secret_key_2024
EMAIL_USER=pict434@gmail.com
EMAIL_PASSWORD=vsyi tirg xskb hgub
FRONTEND_URLS=https://project-app-omega-two.vercel.app,http://localhost:5173
NODE_ENV=production
EMAIL_SERVICE=gmail
CORS_CREDENTIALS=true
```

### Step 2: Deploy with Simplified Function
```bash
cd backend
vercel --prod
```

### Step 3: Test the Deployment
After deployment, test these endpoints:
- `https://your-backend.vercel.app/` - Main endpoint
- `https://your-backend.vercel.app/health` - Health check

### Step 4: Switch to Full API (Once Working)
After the simplified version works:

1. Update `vercel.json`:
   ```json
   "rewrites": [{"source": "/(.*)", "destination": "/api"}],
   "functions": {"api/index.js": {"maxDuration": 30}}
   ```

2. Redeploy:
   ```bash
   vercel --prod
   ```

## 🔍 Troubleshooting

### If Still Getting 500 Error:
1. **Check Vercel Function Logs**:
   - Go to Vercel dashboard → Your project → Functions tab
   - Click on the failed function to see logs

2. **Verify Environment Variables**:
   - Ensure all required env vars are set in Vercel dashboard
   - Check for typos in variable names

3. **Test MongoDB Connection**:
   - Verify MongoDB URI is correct
   - Check MongoDB Atlas IP whitelist (should allow 0.0.0.0/0)

### Common Issues:
- **Missing Environment Variables**: Set in Vercel dashboard, not files
- **MongoDB Connection**: Check URI and IP whitelist
- **CORS Issues**: Verify FRONTEND_URLS is set correctly

## 📊 Expected Results

### Simplified Function Response:
```json
{
  "message": "FAXRN Backend API is running!",
  "timestamp": "2025-01-07T...",
  "environment": "production",
  "version": "1.0.0",
  "mongoConnected": true
}
```

### Health Check Response:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-07T...",
  "uptime": 1.234,
  "mongoConnected": true
}
```

## 🎯 Next Steps
1. Deploy simplified function first
2. Verify it works
3. Set all environment variables
4. Switch to full API implementation
5. Test all endpoints

The simplified approach should resolve the 500 error and get your backend working on Vercel! 🚀
