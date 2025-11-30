# Complete Restart Script
Write-Host "🔄 Restarting CodeMentor AI..." -ForegroundColor Cyan
Write-Host ""

# Stop all node processes
Write-Host "1. Stopping Node processes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1
Write-Host "   ✅ Processes stopped" -ForegroundColor Green

# Remove .next directory
Write-Host "2. Removing .next cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
    Write-Host "   ✅ Cache cleared" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  No cache to clear" -ForegroundColor Gray
}

# Remove node_modules cache
Write-Host "3. Clearing node_modules cache..." -ForegroundColor Yellow
if (Test-Path "node_modules/.cache") {
    Remove-Item -Recurse -Force node_modules/.cache -ErrorAction SilentlyContinue
    Write-Host "   ✅ Module cache cleared" -ForegroundColor Green
}

Write-Host ""
Write-Host "✨ Ready to start!" -ForegroundColor Green
Write-Host ""
Write-Host "Starting dev server..." -ForegroundColor Cyan
Write-Host ""

# Start dev server
npm run dev
