# Clean push to GitHub - only project files
Write-Host "Creating clean repository..." -ForegroundColor Cyan

# Remove .git folder
Remove-Item -Recurse -Force .git -ErrorAction SilentlyContinue

# Initialize new repo
git init
git add README.md package.json .gitignore netlify.toml
git add src/ netlify/ public/ index.html
git add vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json
git add tailwind.config.js postcss.config.js eslint.config.js
git add DEPLOYMENT.md GEMINI_SETUP.md .env.example

# Commit
git commit -m "Initial commit: GCSE Mathematics Practice with AI Tutor"

# Set branch and remote
git branch -M main
git remote add origin https://github.com/roneymatusp2/form4.git

# Push
git push -u origin main --force

Write-Host "Done! Repository is clean and pushed!" -ForegroundColor Green
Write-Host "Visit: https://github.com/roneymatusp2/form4" -ForegroundColor Cyan
