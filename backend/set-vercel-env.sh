#!/bin/bash

# Script to set Vercel environment variables
echo "🔧 Setting Vercel environment variables..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Please install it first:"
    echo "npm install -g vercel"
    exit 1
fi

# Set environment variables
echo "Setting environment variables..."

vercel env add MONGODB_URI production
vercel env add JWT_SECRET production
vercel env add JWT_REFRESH_SECRET production
vercel env add EMAIL_USER production
vercel env add EMAIL_PASSWORD production
vercel env add FRONTEND_URLS production
vercel env add NODE_ENV production
vercel env add EMAIL_SERVICE production
vercel env add CORS_CREDENTIALS production

echo "✅ Environment variables setup complete!"
echo "📝 Please enter the values when prompted by Vercel CLI"
echo ""
echo "💡 Tip: You can also set these in the Vercel dashboard at:"
echo "   https://vercel.com/dashboard -> Your Project -> Settings -> Environment Variables"
