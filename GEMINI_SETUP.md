# Gemini AI Tutor Setup Guide

## Overview

This application includes an intelligent AI tutor powered by Google's Gemini that can:
- Evaluate student answers with flexibility and understanding
- Explain mathematical concepts step-by-step
- Answer questions about specific exercises
- Provide helpful feedback in British English

## Quick Setup

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy your API key

### 2. Add API Key to Your Project

Create a `.env` file in the project root:

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

**Important:** Never commit your `.env` file to Git. It's already in `.gitignore`.

### 3. Restart the Development Server

```bash
npm run dev
```

The AI Tutor will now be available!

## Features

### 1. Intelligent Answer Evaluation
- Accepts multiple answer formats (e.g., "3:4" = "3 to 4" = "three to four")
- Understands mathematical equivalence
- Provides specific, helpful feedback
- Uses British English spelling and terminology

### 2. Interactive Help Panel
Students can ask questions like:
- "What are significant figures?"
- "How do I factorise quadratics?"
- "Explain Pythagoras' theorem"
- "What does inversely proportional mean?"

The AI will provide:
- Clear explanations
- Step-by-step guidance
- Relevant examples

### 3. Automatic Fallback
If Gemini is unavailable, the system automatically uses local evaluation.

## API Limits (Free Tier)

- **15 requests per minute**
- **1,500 requests per day**

Perfect for classroom use!

## Troubleshooting

### "AI Tutor is not configured"
- Check your `.env` file exists
- Verify the API key is correct
- Restart the development server

### "Gemini API error"
- Check your internet connection
- Verify the API key is valid
- Check if you've exceeded rate limits (wait 1 minute)

### Evaluation falls back to local
This is normal if:
- API key is not configured
- Rate limit exceeded
- Network error occurred

The app will still work with local evaluation!

## Privacy & Security

- API key is stored locally in `.env`
- Never exposed in the browser
- Not committed to version control
- Student answers are only sent to Gemini for evaluation

## Cost

The Gemini API is **free** for educational use with generous limits. No credit card required!

## Support

For issues or questions, check:
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Google AI Studio](https://aistudio.google.com/)
