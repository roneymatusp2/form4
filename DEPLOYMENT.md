# Deployment Guide - GCSE Mathematics Practice

## Secure Gemini API Integration

This application uses **Netlify Functions** to keep the Gemini API key secure. The API key is never exposed to the browser.

## How It Works

### Development Mode (localhost)
- Uses `VITE_GEMINI_API_KEY` from `.env` file
- API calls go directly to Gemini (for testing)

### Production Mode (Netlify)
- Uses Netlify Functions as a proxy
- API key stored securely in Netlify environment variables
- Browser never sees the API key

## Deployment Steps

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Deploy to Netlify

1. Go to [Netlify](https://app.netlify.com/)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub repository
4. Netlify will auto-detect the settings from `netlify.toml`

### 3. Add Environment Variable

In Netlify dashboard:

1. Go to **Site settings** → **Environment variables**
2. Click **"Add a variable"**
3. Add:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
4. Click **"Save"**

### 4. Redeploy

Click **"Trigger deploy"** to rebuild with the environment variable.

## Local Development

### Option 1: With Gemini (Recommended)

Create `.env` file:
```env
VITE_GEMINI_API_KEY=your_api_key_here
```

Run:
```bash
npm install
npm run dev
```

### Option 2: Without Gemini

The app works without Gemini using local evaluation:
```bash
npm install
npm run dev
```

## Testing Netlify Functions Locally

Install Netlify CLI:
```bash
npm install -g netlify-cli
```

Run with functions:
```bash
netlify dev
```

This will:
- Start Vite dev server
- Run Netlify Functions locally
- Use environment variables from Netlify

## Environment Variables

### Development (.env)
```env
VITE_GEMINI_API_KEY=your_key_here
```

### Production (Netlify Dashboard)
```
GEMINI_API_KEY=your_key_here
```

**Note**: Different variable names for security!
- `VITE_*` variables are exposed to browser (dev only)
- `GEMINI_API_KEY` is server-side only (production)

## Security Features

✅ API key never exposed in browser (production)
✅ Netlify Functions act as secure proxy
✅ CORS headers properly configured
✅ Rate limiting handled by Netlify
✅ Automatic HTTPS

## Troubleshooting

### "AI Tutor is not configured"
- Check environment variable is set in Netlify
- Redeploy after adding variable
- Check function logs in Netlify dashboard

### Functions not working
- Verify `netlify.toml` is in root
- Check `netlify/functions/` folder exists
- View function logs in Netlify dashboard

### Local development issues
- Make sure `.env` file exists
- Restart dev server after changing `.env`
- Use `netlify dev` to test functions locally

## Cost

- **Netlify**: Free tier includes 125k function requests/month
- **Gemini API**: Free tier includes 1,500 requests/day
- Perfect for educational use!

## Support

For issues:
1. Check Netlify function logs
2. Verify environment variables
3. Test locally with `netlify dev`
