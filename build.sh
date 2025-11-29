#!/bin/bash
# Clean build script for Render deployment

echo "🧹 Cleaning previous build artifacts..."
rm -rf .next
rm -rf node_modules/.cache

echo "📦 Installing dependencies..."
npm install

echo "🏗️  Building application..."
npm run build

echo "✅ Build complete!"
