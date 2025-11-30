#!/bin/bash
# Clean build script for Linux/Mac

echo "Cleaning .next directory..."
rm -rf .next

echo "Running build..."
npm run build

if [ $? -eq 0 ]; then
    echo "Build completed successfully!"
else
    echo "Build failed!"
    exit 1
fi
