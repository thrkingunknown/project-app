#!/bin/bash

echo "🔧 Quick Fix for CORS and 404 Issues"
echo "======================================"

# Deploy the full API
echo "📦 Deploying full API to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🧪 Testing endpoints..."
echo ""

# Get the deployment URL (you'll need to replace this with actual URL)
BACKEND_URL="https://faxrn-backend.vercel.app"

echo "Testing main endpoint:"
curl -s "$BACKEND_URL/" | jq '.'

echo ""
echo "Testing CORS with frontend origin:"
curl -s -H "Origin: https://project-app-omega-two.vercel.app" \
     -X OPTIONS \
     "$BACKEND_URL/posts" \
     -v

echo ""
echo "Testing posts endpoint:"
curl -s "$BACKEND_URL/posts" | jq '.'

echo ""
echo "🎯 Next Steps:"
echo "1. Update frontend to use: $BACKEND_URL"
echo "2. Redeploy frontend if needed"
echo "3. Test CORS in browser"
