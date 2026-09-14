$ErrorActionPreference = "Stop"

Write-Host "Installing dependencies..."
npm install

Write-Host "Building SPLIT RUN..."
npm run build

Write-Host "Packaging Windows portable EXE..."
npx electron-builder --win portable

Write-Host ""
Write-Host "Done. Look in the release folder for the .exe"
