# 🚨 CORS and 404 Error Fix Guide

## 🔍 **Issue Analysis**
The error shows two problems:
1. **404 Error**: `GET https://project-app-3dzn.vercel.app/posts net::ERR_FAILED 404 (Not Found)`
2. **CORS Error**: `No 'Access-Control-Allow-Origin' header is present`

## ✅ **Root Cause**
The frontend is trying to access `https://project-app-3dzn.vercel.app` but:
- This might be the wrong backend URL
- The backend was deployed with minimal function (no `/posts` endpoint)
- CORS headers aren't properly configured

## 🚀 **Complete Fix Steps**

### Step 1: Deploy Full Backend API
```bash
cd backend
vercel --prod
```

**Expected Output**: Note the deployment URL (should be something like `https://faxrn-backend-xxx.vercel.app`)

### Step 2: Set Environment Variables in Vercel Dashboard
Go to: https://vercel.com/dashboard → Your Backend Project → Settings → Environment Variables

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

### Step 3: Test Backend Endpoints
```bash
# Test main endpoint
curl https://your-backend-url.vercel.app/

# Test posts endpoint
curl https://your-backend-url.vercel.app/posts

# Test CORS
curl -H "Origin: https://project-app-omega-two.vercel.app" \
     -X OPTIONS \
     https://your-backend-url.vercel.app/posts \
     -v
```

### Step 4: Update Frontend Configuration
If the backend URL is different from `https://faxrn-backend.vercel.app`, update:

**frontend/.env.production**:
```
VITE_BACKEND_URL=https://your-actual-backend-url.vercel.app
```

### Step 5: Redeploy Frontend
```bash
cd frontend
vercel --prod
```

## 🧪 **Testing the Fix**

### Test 1: Backend Health
Visit: `https://your-backend-url.vercel.app/`
Expected: JSON response with "FAXRN Backend API is running!"

### Test 2: Posts Endpoint
Visit: `https://your-backend-url.vercel.app/posts`
Expected: JSON array of posts (might be empty)

### Test 3: CORS Headers
Open browser dev tools → Network tab → Visit your frontend
Expected: No CORS errors in console

## 🔧 **If Still Getting Errors**

### Error: "Cannot GET /posts"
- Backend not fully deployed
- Environment variables not set
- Database connection failed

### Error: "CORS policy"
- Frontend URL not in FRONTEND_URLS environment variable
- CORS_CREDENTIALS not set to true
- Wrong backend URL in frontend

### Error: "404 Not Found"
- Wrong backend URL in frontend .env.production
- Backend deployment failed
- Vercel routing not working

## 📋 **Quick Verification Checklist**
- ✅ Backend deployed with full API (not minimal function)
- ✅ Environment variables set in Vercel dashboard
- ✅ Frontend .env.production has correct backend URL
- ✅ Frontend redeployed after URL update
- ✅ CORS origins include frontend URL
- ✅ Database connection working

## 🎯 **Expected Final Result**
- Frontend: `https://project-app-omega-two.vercel.app`
- Backend: `https://faxrn-backend.vercel.app` (or similar)
- No CORS errors
- Posts load successfully
- All API endpoints working

The key is ensuring the frontend knows the correct backend URL and the backend allows the frontend's origin! 🚀
