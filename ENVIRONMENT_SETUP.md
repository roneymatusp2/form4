# Environment Variables Setup

## Netlify Environment Variables

You need to configure the following environment variables in your Netlify dashboard:

### Required Variables

1. **GEMINI_FORM4** (Primary AI)
   - Go to: Site settings → Environment variables
   - Variable name: `GEMINI_FORM4`
   - Value: Your Google Gemini API key
   - Scopes: All scopes
   - Get your key at: https://aistudio.google.com/app/apikey

2. **OPENAI_FORM4** (Fallback AI)
   - Go to: Site settings → Environment variables
   - Variable name: `OPENAI_FORM4`
   - Value: Your OpenAI API key
   - Scopes: All scopes
   - Get your key at: https://platform.openai.com/api-keys

### How to Add Variables in Netlify

1. Go to your site dashboard on Netlify
2. Click "Site settings"
3. Click "Environment variables" in the left sidebar
4. Click "Add a variable"
5. Enter the variable name and value
6. Select "All scopes" (or specific deploy contexts)
7. Click "Create variable"
8. Redeploy your site for changes to take effect

### Testing Locally

For local development, create a `.env` file:

```env
VITE_GEMINI_API_KEY=your_gemini_key_here
```

Note: Local development uses `VITE_GEMINI_API_KEY` while production uses `GEMINI_FORM4` and `OPENAI_FORM4`.

### Verification

After adding the variables:
1. Go to "Deploys" tab
2. Click "Trigger deploy" → "Clear cache and deploy site"
3. Check the deploy logs for any API key errors

### Current Status

Based on the screenshot, you have:
- ✅ GEMINI_FORM4 configured
- ✅ OPENAI_FORM4 configured

Both are set to "All scopes" which is correct.

### Troubleshooting

If you see "AI unavailable" errors:
1. Verify the API keys are valid and active
2. Check if you have API quota/credits remaining
3. Redeploy the site after adding variables
4. Check Netlify function logs for detailed errors
