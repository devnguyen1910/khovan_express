# MongoDB Setup Script for Kho Vận Express
# Run this script to install MongoDB Community Edition on Windows

Write-Host "Installing MongoDB Community Edition..." -ForegroundColor Green

# Download MongoDB Community Edition
$mongoUrl = "https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.15-signed.msi"
$mongoInstaller = "$env:TEMP\mongodb-installer.msi"

Write-Host "Downloading MongoDB installer..." -ForegroundColor Yellow
Invoke-WebRequest -Uri $mongoUrl -OutFile $mongoInstaller

Write-Host "Installing MongoDB..." -ForegroundColor Yellow
Start-Process -FilePath "msiexec.exe" -ArgumentList "/i", $mongoInstaller, "/quiet", "/norestart" -Wait

# Add MongoDB to PATH if not already there
$mongoPath = "C:\Program Files\MongoDB\Server\7.0\bin"
$currentPath = [Environment]::GetEnvironmentVariable("PATH", [EnvironmentVariableTarget]::User)
if ($currentPath -notlike "*$mongoPath*") {
    [Environment]::SetEnvironmentVariable("PATH", "$currentPath;$mongoPath", [EnvironmentVariableTarget]::User)
    Write-Host "Added MongoDB to PATH" -ForegroundColor Green
}

# Create data directory
$dataDir = "C:\data\db"
if (!(Test-Path $dataDir)) {
    New-Item -ItemType Directory -Path $dataDir -Force
    Write-Host "Created MongoDB data directory: $dataDir" -ForegroundColor Green
}

Write-Host "MongoDB installation completed!" -ForegroundColor Green
Write-Host "Please restart your PowerShell session and run 'mongod --version' to verify installation." -ForegroundColor Cyan