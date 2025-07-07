#!/bin/bash

echo "🔧 CORS and 404 Fix Deployment"
echo "==============================="

# Step 1: Deploy backend with full API
echo "📦 Deploying backend with full API..."
cd backend
echo "Current directory: $(pwd)"
echo "Vercel config:"
cat vercel.json
echo ""

echo "Deploying to Vercel..."
vercel --prod

# Get the deployment URL
echo ""
echo "✅ Backend deployed!"
echo ""

# Step 2: Test backend
echo "🧪 Testing backend endpoints..."
echo "Waiting 10 seconds for deployment to be ready..."
sleep 10

# You'll need to replace this with the actual deployment URL
BACKEND_URL="https://faxrn-backend.vercel.app"

echo "Testing main endpoint:"
curl -s "$BACKEND_URL/" | head -5

echo ""
echo "Testing posts endpoint:"
curl -s "$BACKEND_URL/posts" | head -5

echo ""
echo "🎯 Next Steps:"
echo "1. Verify the backend URL above is correct"
echo "2. Update frontend/.env.production if needed"
echo "3. Set environment variables in Vercel dashboard"
echo "4. Redeploy frontend: cd ../frontend && vercel --prod"
echo ""
echo "📝 Environment Variables to set in Vercel Dashboard:"
echo "MONGODB_URI, JWT_SECRET, JWT_REFRESH_SECRET, EMAIL_USER, EMAIL_PASSWORD"
echo "FRONTEND_URLS=https://project-app-omega-two.vercel.app,http://localhost:5173"
echo "NODE_ENV=production, EMAIL_SERVICE=gmail, CORS_CREDENTIALS=true"
