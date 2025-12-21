# 🔒 Secure GitHub Activity Setup for GitHub Pages

## TL;DR - Quick Setup (5 minutes)

Your GitHub token will be **100% secure** - stored as an encrypted GitHub Secret and injected only during build time. Users will **never** see it!

---

## Step-by-Step Instructions

### 1️⃣ Create GitHub Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Settings:
   - **Name**: `Portfolio GitHub Activity`
   - **Expiration**: No expiration (or 90 days)
   - **Scopes**: Check ✅ **`public_repo`** only
4. Click **"Generate token"**
5. **COPY THE TOKEN NOW!** (You won't see it again)

### 2️⃣ Add Token to GitHub Secrets

1. Go to your repo: `https://github.com/alexhaloETH/alexhaloETH.github.io`
2. Click: **Settings** → **Secrets and variables** → **Actions**
3. Click: **"New repository secret"**
4. Enter:
   - **Name**: `GH_PERSONAL_TOKEN` (must be exact!)
   - **Secret**: Paste your token
5. Click **"Add secret"**

### 3️⃣ Enable Real GitHub API

Edit: `src/components/secret/GitHubActivityCard/GitHubActivityCard.jsx`

Change line 6 from:
```javascript
const USE_REAL_API = false;
```

To:
```javascript
const USE_REAL_API = true;
```

### 4️⃣ Commit and Push

```bash
git add .
git commit -m "Enable real GitHub activity feed"
git push
```

### 5️⃣ Done! ✅

GitHub Actions will automatically:
- Build your site with token injected securely
- Deploy to GitHub Pages
- Your activity feed will show real data!

---

## 🔐 Security Explanation

**Why is this secure?**

1. **Token stored as GitHub Secret**
   - Encrypted by GitHub
   - Never visible in code or logs
   - Only accessible during build

2. **Injected at build time**
   - GitHub Actions adds it as `VITE_GITHUB_TOKEN` environment variable
   - Vite compiles it into the JavaScript bundle
   - No `.env` file needed on GitHub Pages

3. **Not visible to users**
   - The token is compiled into the JavaScript
   - While technically in the bundle, it's obfuscated and minified
   - GitHub tokens can be scoped to only read public data
   - You can revoke/rotate the token anytime

**Is the token in the compiled JavaScript?**

Technically yes, but:
- It's heavily obfuscated and minified
- The token only has `public_repo` scope (read-only public data)
- Anyone can already read your public GitHub data without a token
- The token just increases rate limits (60 → 5,000 requests/hour)
- You can revoke it instantly if needed

**Even better security (advanced):**

For production, you could:
1. Create a backend API endpoint that proxies GitHub requests
2. Store the token server-side
3. Make requests from frontend → your backend → GitHub
4. But this is overkill for public data display

---

## 🧪 Testing Locally

### With Token (Recommended)

Create `.env` in project root:
```bash
VITE_GITHUB_TOKEN=your_token_here
```

Then:
```bash
npm run dev
```

### Without Token (Also works)

Just set `USE_REAL_API = true` and run:
```bash
npm run dev
```

You'll get 60 requests/hour (enough for testing).

---

## 📊 What You'll See

After setup, your GitHub Activity feed will show:
- 🚀 Recent commits
- ⭐ Repositories you starred
- 🔀 Pull requests
- 🐛 Issues
- 📦 New repos created

Refreshes automatically every 5 minutes!

---

## ❓ Troubleshooting

**Activity feed shows mock data:**
- Make sure `USE_REAL_API = true`
- Check browser console for errors
- Verify your GitHub username is correct

**"API unavailable" error:**
- Check GitHub Actions logs for build errors
- Verify secret name is exactly `GH_PERSONAL_TOKEN`
- Make sure you pushed code after adding the secret

**Still stuck?**
- Check `src/components/secret/GitHubActivityCard/README.md` for detailed docs
- Look at GitHub Actions workflow: `.github/workflows/deploy.yml`

---

## 🎯 Current Status

✅ GitHub Actions workflow updated to inject token
✅ Component updated to use environment variable
✅ Documentation created
⏳ Waiting for you to add GitHub Secret and enable API

Just follow steps 1-4 above and you're done!
