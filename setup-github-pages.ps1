# TikTok Analytics Tool - GitHub Pages Setup Script (Windows)
# This script hosts Terms of Service and Privacy Policy pages on GitHub Pages
# for TikTok for Developers app registration

Write-Host "=== TikTok Analytics Tool - GitHub Pages Setup ===" -ForegroundColor Green
Write-Host ""

# Check for required files
$requiredFiles = @("terms-of-service.html", "privacy-policy.html")
$missingFiles = @()

foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host "Error: The following files are missing:" -ForegroundColor Red
    foreach ($file in $missingFiles) {
        Write-Host "  - $file" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Please create the required files before running this script." -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Required files found" -ForegroundColor Green
Write-Host ""

# Get user information
$GITHUB_USERNAME = Read-Host "Enter your GitHub username"
$REPO_NAME = Read-Host "Enter repository name (e.g., tiktok-analytics-tool)"

# Set default values
if ([string]::IsNullOrWhiteSpace($REPO_NAME)) {
    $REPO_NAME = "tiktok-analytics-tool"
}

Write-Host ""
Write-Host "Configuration:" -ForegroundColor Cyan
Write-Host "  GitHub Username: $GITHUB_USERNAME"
Write-Host "  Repository Name: $REPO_NAME"
Write-Host ""

# Confirmation
$confirm = Read-Host "Continue with these settings? (y/N)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "Setup cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "=== Starting GitHub Pages Setup ===" -ForegroundColor Green

# 1. Create GitHub repository
Write-Host "1. Creating GitHub repository..." -ForegroundColor Yellow

# Check if GitHub CLI is installed
try {
    $ghVersion = gh --version
    Write-Host "✓ GitHub CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "⚠️ GitHub CLI is not installed" -ForegroundColor Yellow
    Write-Host "Please install GitHub CLI: https://cli.github.com/" -ForegroundColor Cyan
    Write-Host "Or create the repository manually." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Manual creation steps:" -ForegroundColor Cyan
    Write-Host "1. Go to https://github.com/new"
    Write-Host "2. Repository name: $REPO_NAME"
    Write-Host "3. Select Public"
    Write-Host "4. Check 'Add a README file'"
    Write-Host "5. Create repository"
    Write-Host ""
    $manualConfirm = Read-Host "Did you create the repository manually? (y/N)"
    if ($manualConfirm -ne "y" -and $manualConfirm -ne "Y") {
        Write-Host "Setup aborted." -ForegroundColor Yellow
        exit 1
    }
}

# 2. Initialize local repository
Write-Host "2. Initializing local repository..." -ForegroundColor Yellow

if (Test-Path ".git") {
    Write-Host "✓ Git repository is already initialized" -ForegroundColor Green
} else {
    git init
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
}

# 3. Create and configure files
Write-Host "3. Setting up files..." -ForegroundColor Yellow

# Create index.html
$indexContent = @"
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TikTok Analytics Tool</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
            color: #333;
        }
        .container {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2c3e50;
            text-align: center;
            margin-bottom: 30px;
        }
        .nav {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-bottom: 30px;
        }
        .nav a {
            padding: 10px 20px;
            background: #3498db;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            transition: background 0.3s;
        }
        .nav a:hover {
            background: #2980b9;
        }
        .description {
            background: white;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>TikTok Analytics Tool</h1>
        
        <div class="description">
            <p>This tool is a Google Apps Script program that analyzes video impressions using the TikTok official API.</p>
            <p>You can check the Terms of Service and Privacy Policy on the following pages.</p>
        </div>
        
        <div class="nav">
            <a href="terms-of-service.html">Terms of Service</a>
            <a href="privacy-policy.html">Privacy Policy</a>
        </div>
        
        <div class="description">
            <h3>Features</h3>
            <ul>
                <li>Retrieve your posted videos</li>
                <li>Analyze video impressions, reach, and engagement rate</li>
                <li>Automatic output to Google Spreadsheet</li>
                <li>Secure API access with OAuth authentication</li>
            </ul>
        </div>
    </div>
</body>
</html>
"@

$indexContent | Out-File -FilePath "index.html" -Encoding UTF8
Write-Host "✓ Created index.html" -ForegroundColor Green

# Update README.md
$readmeContent = @"
# TikTok Analytics Tool

A Google Apps Script program that analyzes video impressions using the TikTok official API.

## Features

- Retrieve your posted videos
- Analyze video impressions, reach, and engagement rate
- Automatic output to Google Spreadsheet
- Secure API access with OAuth authentication

## Terms of Service and Privacy Policy

- [Terms of Service](terms-of-service.html)
- [Privacy Policy](privacy-policy.html)

## Setup

For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md).

## Usage

1. Create an app on TikTok for Developers
2. Get access token
3. Run code in Google Apps Script
4. Check results in spreadsheet

## License

MIT License
"@

$readmeContent | Out-File -FilePath "README.md" -Encoding UTF8
Write-Host "✓ Updated README.md" -ForegroundColor Green

# Create .gitignore
$gitignoreContent = @"
# Environment configuration files
.env
config.local.js

# Log files
*.log

# Temporary files
*.tmp
*.temp

# OS generated files
.DS_Store
Thumbs.db

# IDE settings
.vscode/
.idea/
"@

$gitignoreContent | Out-File -FilePath ".gitignore" -Encoding UTF8
Write-Host "✓ Created .gitignore" -ForegroundColor Green

# 4. Add files and commit
Write-Host "4. Adding files to Git..." -ForegroundColor Yellow

git add .
git commit -m "Initial commit: TikTok Analytics Tool with Terms and Privacy Policy"

Write-Host "✓ Files committed" -ForegroundColor Green

# 5. Connect to GitHub repository
Write-Host "5. Connecting to GitHub repository..." -ForegroundColor Yellow

# Try to create repository using GitHub CLI
try {
    gh repo create "$GITHUB_USERNAME/$REPO_NAME" --public --source=. --remote=origin --push
    Write-Host "✓ Created GitHub repository and pushed files" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Failed to create repository automatically with GitHub CLI" -ForegroundColor Yellow
    Write-Host "Please add remote repository manually:" -ForegroundColor Cyan
    Write-Host "git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git" -ForegroundColor Cyan
    Write-Host "git branch -M main" -ForegroundColor Cyan
    Write-Host "git push -u origin main" -ForegroundColor Cyan
}

# 6. Enable GitHub Pages
Write-Host "6. Enabling GitHub Pages..." -ForegroundColor Yellow

Write-Host ""
Write-Host "=== Manual Setup Required ===" -ForegroundColor Yellow
Write-Host "Please follow these steps to enable GitHub Pages:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Go to https://github.com/$GITHUB_USERNAME/$REPO_NAME/settings/pages" -ForegroundColor Cyan
Write-Host "2. Select 'Deploy from a branch' in Source" -ForegroundColor Cyan
Write-Host "3. Select 'main' in Branch" -ForegroundColor Cyan
Write-Host "4. Click Save" -ForegroundColor Cyan
Write-Host ""
Write-Host "After enabling, you can access at:" -ForegroundColor Green
Write-Host "https://$GITHUB_USERNAME.github.io/$REPO_NAME/" -ForegroundColor Green
Write-Host ""

# 7. TikTok for Developers configuration information
Write-Host "=== TikTok for Developers Configuration ===" -ForegroundColor Green
Write-Host ""
Write-Host "Use the following URLs in your TikTok for Developers app settings:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Terms of Service URL:" -ForegroundColor Yellow
Write-Host "https://$GITHUB_USERNAME.github.io/$REPO_NAME/terms-of-service.html" -ForegroundColor Green
Write-Host ""
Write-Host "Privacy Policy URL:" -ForegroundColor Yellow
Write-Host "https://$GITHUB_USERNAME.github.io/$REPO_NAME/privacy-policy.html" -ForegroundColor Green
Write-Host ""

Write-Host "=== Setup Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Wait a few minutes for GitHub Pages to be enabled" -ForegroundColor Cyan
Write-Host "2. Verify the URLs above are accessible" -ForegroundColor Cyan
Write-Host "3. Create an app on TikTok for Developers and set the URLs" -ForegroundColor Cyan
Write-Host "4. Get Client Key and Client Secret" -ForegroundColor Cyan
Write-Host "5. Complete GAS program configuration" -ForegroundColor Cyan 