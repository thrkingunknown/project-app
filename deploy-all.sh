#!/bin/bash

# FAXRN Complete Deployment Script for Vercel
echo "🚀 Starting complete FAXRN deployment to Vercel..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Installing..."
    npm install -g vercel
    if [ $? -eq 0 ]; then
        print_success "Vercel CLI installed successfully"
    else
        print_error "Failed to install Vercel CLI"
        exit 1
    fi
fi

# Check Vercel authentication
print_status "Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    print_warning "Not logged in to Vercel. Please login..."
    vercel login
fi

print_success "Vercel authentication verified"

# Deploy Backend
print_status "Deploying backend to Vercel..."
cd backend

# Deploy backend
vercel --prod --yes
if [ $? -eq 0 ]; then
    print_success "Backend deployed successfully!"
    
    # Get the deployment URL
    BACKEND_URL=$(vercel --prod --yes 2>/dev/null | grep -o 'https://[^[:space:]]*')
    if [ -n "$BACKEND_URL" ]; then
        print_success "Backend URL: $BACKEND_URL"
        
        # Update frontend environment
        cd ../frontend
        echo "VITE_BACKEND_URL=$BACKEND_URL" > .env.production
        print_success "Frontend environment updated with new backend URL"
        
        # Deploy frontend
        print_status "Deploying frontend to Vercel..."
        vercel --prod --yes
        if [ $? -eq 0 ]; then
            print_success "Frontend deployed successfully!"
            
            # Get frontend URL
            FRONTEND_URL=$(vercel --prod --yes 2>/dev/null | grep -o 'https://[^[:space:]]*')
            if [ -n "$FRONTEND_URL" ]; then
                print_success "Frontend URL: $FRONTEND_URL"
            fi
        else
            print_error "Frontend deployment failed"
            exit 1
        fi
    else
        print_warning "Could not extract backend URL automatically"
        print_warning "Please manually update frontend/.env.production with your backend URL"
    fi
else
    print_error "Backend deployment failed"
    exit 1
fi

cd ..

# Final instructions
echo ""
print_success "🎉 Deployment completed successfully!"
echo ""
print_status "📋 Next steps:"
echo "1. Set environment variables in Vercel dashboard:"
echo "   - MONGODB_URI"
echo "   - JWT_SECRET"
echo "   - JWT_REFRESH_SECRET"
echo "   - EMAIL_USER"
echo "   - EMAIL_PASSWORD"
echo "   - FRONTEND_URLS"
echo ""
echo "2. Test your application:"
if [ -n "$FRONTEND_URL" ]; then
    echo "   Frontend: $FRONTEND_URL"
fi
if [ -n "$BACKEND_URL" ]; then
    echo "   Backend: $BACKEND_URL"
fi
echo ""
print_status "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md"
