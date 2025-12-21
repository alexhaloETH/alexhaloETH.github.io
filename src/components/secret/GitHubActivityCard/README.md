# GitHub Activity Card - API Integration Guide

## 🔒 Secure Setup for GitHub Pages (Recommended)

Your site is hosted on GitHub Pages, so the token will be injected **securely at build time** via GitHub Actions. **The token is never exposed in your code or to users!**

### Step 1: Create a GitHub Personal Access Token

1. Go to [GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens)
2. Click **"Generate new token (classic)"**
3. Give it a name like **"Portfolio GitHub Activity"**
4. **Expiration**: Choose 90 days or No expiration
5. **Select scopes**: ✅ **public_repo** only (for reading public data)
6. Click **"Generate token"**
7. **Copy the token immediately** (you won't see it again!)

### Step 2: Add Token as GitHub Secret

1. Go to **your repository** on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. **Name**: `GH_PERSONAL_TOKEN`
5. **Value**: Paste your token
6. Click **"Add secret"**

### Step 3: Enable Real API

In `src/components/secret/GitHubActivityCard/GitHubActivityCard.jsx`, change:

```javascript
const USE_REAL_API = true; // Enable real GitHub API
```

### Step 4: Deploy

Commit and push your changes to GitHub:

```bash
git add .
git commit -m "Enable real GitHub activity feed"
git push
```

The GitHub Actions workflow will automatically:
1. ✅ Build your site with the token injected securely (via `VITE_GITHUB_TOKEN`)
2. ✅ Deploy to GitHub Pages
3. ✅ **The token is NEVER exposed in the final build or to users!**

---

## How It Works

**Security Flow:**
1. Token is stored as GitHub Secret (encrypted, never visible in code)
2. During build, GitHub Actions injects it as environment variable
3. Vite includes it in the build as `import.meta.env.VITE_GITHUB_TOKEN`
4. API calls use the token for authentication
5. Users **never see the token** (it's compiled into the code)

**Rate Limits:**
- Without token: 60 requests/hour
- With token: 5,000 requests/hour
- Your site refreshes every 5 minutes = 12 requests/hour ✅

---

## For Local Development

### Option A: Use `.env` file (Secure)

Create a `.env` file in your project root:

```bash
VITE_GITHUB_TOKEN=your_token_here
```

⚠️ **Make sure `.env` is in your `.gitignore`!**

Check your `.gitignore`:
```bash
# Local env files
.env
.env.local
.env.*.local
```

### Option B: No token (works but limited)

Set `USE_REAL_API = true` without a token. It will work with 60 requests/hour limit.

---

## Quick Start (No Token)

The GitHub Activity Card can display real-time data from your GitHub account even without a token:

1. In `GitHubActivityCard.jsx`, update:
   ```javascript
   const GITHUB_USERNAME = 'alexhaloETH'; // Your GitHub username
   const USE_REAL_API = true; // Enable real API calls
   ```

2. That's it! The component will fetch your public GitHub activity (60 requests/hour).

---

## Supported Activity Types

The component displays these GitHub events:
- 🚀 **PushEvent** - Commits pushed to repositories
- ⭐ **WatchEvent** - Starred repositories
- 🔀 **PullRequestEvent** - Pull requests created/merged
- 🐛 **IssuesEvent** - Issues opened/closed
- 📦 **CreateEvent** - New repositories created

---

## Fallback Behavior

If the API fails (network error, rate limit, etc.), the component automatically falls back to **mock data**, so your portfolio always looks good!

---

## API Documentation

For more information:
- [GitHub Events API](https://docs.github.com/en/rest/activity/events)
- [GitHub API Rate Limits](https://docs.github.com/en/rest/overview/rate-limits-for-the-rest-api)

---

## Troubleshooting

**Q: I see "API unavailable" message**
- Check your internet connection
- Verify your GitHub username is correct
- Check browser console for detailed error messages
- Verify the token is set correctly in GitHub Secrets

**Q: No activity showing**
- Make sure you have recent public activity on GitHub
- Private events won't show without proper authentication

**Q: Rate limit exceeded**
- Add a GitHub token following the steps above
- Or reduce refresh frequency by increasing the interval in `useEffect`

**Q: Token not working on GitHub Pages**
- Verify the secret name is exactly `GH_PERSONAL_TOKEN`
- Check the GitHub Actions workflow logs for errors
- Make sure you pushed the code after adding the secret
