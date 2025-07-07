#!/bin/bash

echo "🔧 Debug Deployment for Posts Endpoint"
echo "======================================"

echo "📁 Current API directory contents:"
ls -la api/

echo ""
echo "📦 Deploying with debugging..."
vercel --prod

echo ""
echo "⏳ Waiting 15 seconds for deployment..."
sleep 15

echo ""
echo "🧪 Testing endpoints..."

# Replace with your actual backend URL
BACKEND_URL="https://faxrn-backend.vercel.app"

echo "1. Testing root endpoint:"
curl -s "$BACKEND_URL/" | jq '.'

echo ""
echo "2. Testing posts endpoint:"
curl -s "$BACKEND_URL/posts" | jq '.'

echo ""
echo "3. Testing with verbose output:"
curl -v "$BACKEND_URL/posts" 2>&1 | head -20

echo ""
echo "🔍 Check Vercel function logs at:"
echo "https://vercel.com/dashboard -> Your Project -> Functions tab"
echo ""
echo "Look for console.log messages to see what's happening!"
