# Clear Next.js Cache and Restart
Write-Host "🧹 Clearing Next.js cache..." -ForegroundColor Cyan

# Stop any running processes
Write-Host "Stopping Node processes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Remove cache directories
Write-Host "Removing .next directory..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next
    Write-Host "✅ .next removed" -ForegroundColor Green
}

Write-Host "Removing node_modules/.cache..." -ForegroundColor Yellow
if (Test-Path "node_modules/.cache") {
    Remove-Item -Recurse -Force node_modules/.cache
    Write-Host "✅ Cache removed" -ForegroundColor Green
}

Write-Host ""
Write-Host "✨ Cache cleared successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Now run: npm run dev" -ForegroundColor Cyan
