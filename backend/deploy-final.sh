#!/bin/bash

echo "🚀 FINAL DEPLOYMENT - Backend Fix"
echo "================================="

echo "📦 Deploying backend to project-app-back.vercel.app..."
vercel --prod

echo ""
echo "⏳ Waiting 10 seconds for deployment..."
sleep 10

echo ""
echo "🧪 Testing endpoints..."

BACKEND_URL="https://project-app-back.vercel.app"

echo "1. Health check:"
curl -s "$BACKEND_URL/" | jq '.'

echo ""
echo "2. Posts endpoint:"
curl -s "$BACKEND_URL/posts" | jq '.'

echo ""
echo "3. CORS preflight test:"
curl -X OPTIONS \
     -H "Origin: https://project-app-omega-two.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     "$BACKEND_URL/login" \
     -v 2>&1 | grep -E "(HTTP|Access-Control)"

echo ""
echo "🔧 CRITICAL NEXT STEP:"
echo "Set environment variables in Vercel Dashboard:"
echo "https://vercel.com/dashboard → project-app-back → Settings → Environment Variables"
echo ""
echo "Required variables:"
echo "MONGODB_URI, JWT_SECRET, JWT_REFRESH_SECRET, EMAIL_USER, EMAIL_PASSWORD"
echo "FRONTEND_URLS=https://project-app-omega-two.vercel.app,http://localhost:5173"
echo "NODE_ENV=production, EMAIL_SERVICE=gmail, CORS_CREDENTIALS=true"
echo ""
echo "Then redeploy: vercel --prod"
