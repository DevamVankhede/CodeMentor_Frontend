#!/bin/bash

# CodeMentor AI - Quick Start Script

echo "🚀 CodeMentor AI - Quick Start"
echo "=============================="
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found!"
    echo ""
    echo "Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo ""
    echo "✅ .env.local created!"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env.local and add your API keys:"
    echo "   - NEXT_PUBLIC_GEMINI_API_KEY"
    echo "   - NEXT_PUBLIC_API_URL"
    echo ""
    read -p "Press Enter after you've updated .env.local..."
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "🔍 Checking environment..."
if grep -q "your_gemini_api_key" .env.local; then
    echo "⚠️  WARNING: Gemini API key not set in .env.local"
    echo "   Please update NEXT_PUBLIC_GEMINI_API_KEY"
    echo ""
fi

echo "✅ Starting development server..."
echo ""
echo "📱 Frontend will be available at: http://localhost:3000"
echo "🔧 Backend should be running at: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
