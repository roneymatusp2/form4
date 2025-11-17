# Netlify Deployment Setup

## ✅ Quick Setup Guide

### 1. Deploy to Netlify

Your repository is already connected! Netlify will auto-deploy from:
- **Repository**: https://github.com/roneymatusp2/form4
- **Branch**: main

### 2. Add Environment Variable

In your Netlify dashboard:

1. Go to **Site settings** → **Environment variables**
2. Click **"Add a variable"**
3. Add:
   - **Key**: `GEMINI_FORM4`
   - **Value**: `AIzaSyD9ydADCEqVkc93Ft0T8iFzgT-Yxd-TMdc`
4. Click **"Save"**

### 3. Redeploy

Click **"Trigger deploy"** to rebuild with the environment variable.

## 🎯 That's It!

The AI Tutor will now work in production!

## 🔒 Security

- ✅ API key is stored securely in Netlify
- ✅ Never exposed to browser
- ✅ Netlify Functions act as secure proxy
- ✅ Automatic HTTPS

## 🧪 Testing

After deployment, test the AI Tutor:

1. Open your Netlify site
2. Click on any topic card
3. Answer a question
4. Click "Need Help?" and ask a question
5. You should see AI-powered responses!

## 📊 Monitoring

Check function logs in Netlify dashboard:
- **Functions** → **gemini-evaluate**
- **Functions** → **gemini-help**

## 🆘 Troubleshooting

### "AI Tutor is not configured"
- ✅ Check environment variable is set: `GEMINI_FORM4`
- ✅ Redeploy after adding variable
- ✅ Check function logs for errors

### Functions not working
- ✅ Verify `netlify.toml` is in root
- ✅ Check `netlify/functions/` folder exists
- ✅ View function logs in Netlify dashboard

## 💰 Cost

- **Netlify**: Free tier (125k function requests/month)
- **Gemini API**: Free tier (1,500 requests/day)
- **Perfect for educational use!**

## 🚀 Next Steps

1. Add custom domain (optional)
2. Enable form submissions (optional)
3. Add analytics (optional)

Your IGCSE Mathematics Practice app is now live! 🎉
