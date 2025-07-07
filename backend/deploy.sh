#!/bin/bash

# FAXRN Backend Deployment Script for Vercel
echo "🚀 Starting FAXRN Backend deployment to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "🔐 Checking Vercel authentication..."
vercel whoami || vercel login

# Set environment variables
echo "⚙️ Setting up environment variables..."
echo "Please make sure to set these environment variables in your Vercel dashboard:"
echo "- MONGODB_URI"
echo "- JWT_SECRET"
echo "- JWT_REFRESH_SECRET"
echo "- EMAIL_USER"
echo "- EMAIL_PASSWORD"
echo "- FRONTEND_URLS"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your backend is now live on Vercel!"
echo ""
echo "📝 Next steps:"
echo "1. Update your frontend BACKEND_URL to point to the new Vercel URL"
echo "2. Test all API endpoints"
echo "3. Monitor performance in Vercel dashboard"
