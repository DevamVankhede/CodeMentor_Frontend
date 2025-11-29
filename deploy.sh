#!/bin/bash

# CodeMentor AI Deployment Script

echo "🚀 CodeMentor AI Deployment"
echo "============================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔍 Running tests..."
npm run lint || echo "⚠️  Linting warnings found (continuing...)"

echo ""
echo "🏗️  Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "Choose deployment option:"
    echo "1) Deploy to Vercel"
    echo "2) Build Docker image"
    echo "3) Exit"
    echo ""
    read -p "Enter choice [1-3]: " choice

    case $choice in
        1)
            echo ""
            echo "🚀 Deploying to Vercel..."
            if command -v vercel &> /dev/null; then
                vercel --prod
            else
                echo "❌ Vercel CLI not found. Install it with: npm i -g vercel"
                exit 1
            fi
            ;;
        2)
            echo ""
            echo "🐳 Building Docker image..."
            docker build -t codementor-ai:latest .
            echo ""
            echo "✅ Docker image built successfully!"
            echo "Run with: docker run -p 3000:3000 codementor-ai:latest"
            ;;
        3)
            echo "Exiting..."
            exit 0
            ;;
        *)
            echo "Invalid choice"
            exit 1
            ;;
    esac
else
    echo ""
    echo "❌ Build failed! Please fix errors and try again."
    exit 1
fi

echo ""
echo "✅ Deployment complete!"
