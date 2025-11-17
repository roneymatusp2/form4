# Script to push Form 4 Mathematics to GitHub
Write-Host "Pushing Form 4 Mathematics to GitHub..." -ForegroundColor Cyan

# Navigate to project directory
Set-Location "C:\Users\roney\WebstormProjects\quadratics"

# Remove temp_quadratics from tracking
Write-Host "Removing temp_quadratics..." -ForegroundColor Yellow
git rm -r --cached temp_quadratics -ErrorAction SilentlyContinue

# Add all files
Write-Host "Adding files..." -ForegroundColor Yellow
git add .

# Commit
Write-Host "Committing..." -ForegroundColor Yellow
git commit -m "Initial commit: GCSE Mathematics Practice with AI Tutor

Features:
- 44 comprehensive exercises organised by topic
- AI Tutor powered by Google Gemini
- Beautiful card-based UI
- Progress tracking
- Secure API key management with Netlify Functions
- Responsive design"

# Push to main branch
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git branch -M main
git push -u origin main --force

Write-Host "Done! Check your repository at: https://github.com/roneymatusp2/form4" -ForegroundColor Green
