#!/bin/bash

# Fundi App Deployment Script
echo "🚀 Preparing Fundi App for deployment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if all required files exist
echo "📋 Checking required files..."
required_files=("Procfile" "requirements.txt" "backend/app.py" "backend/config.py")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Missing required file: $file"
        exit 1
    fi
done

echo "✅ All required files found"

# Check if changes are committed
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes. Please commit them first:"
    echo "   git add ."
    echo "   git commit -m 'Prepare for deployment'"
    exit 1
fi

echo "✅ All changes are committed"

# Display deployment instructions
echo ""
echo "🎯 DEPLOYMENT INSTRUCTIONS:"
echo ""
echo "1. Push to GitHub:"
echo "   git push origin main"
echo ""
echo "2. Deploy to Render.com:"
echo "   - Go to https://render.com"
echo "   - Connect your GitHub repository"
echo "   - Create a new Web Service"
echo "   - Set Build Command: pip install -r requirements.txt"
echo "   - Set Start Command: gunicorn backend.app:app"
echo "   - Add Environment Variables:"
echo "     * DATABASE_URL: your_supabase_connection_string"
echo "     * SECRET_KEY: your_secure_secret_key"
echo "     * FLASK_DEBUG: False"
echo ""
echo "3. Deploy and get your live URL!"
echo ""
echo "🔗 Your app will be available at the URL provided by Render"
echo ""
echo "📝 Remember to:"
echo "   - Test your app thoroughly after deployment"
echo "   - Update your database connection string in Render environment variables"
echo "   - Set a strong SECRET_KEY for production" 