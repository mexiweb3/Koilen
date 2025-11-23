# Koilen Dashboard - Vercel Deployment Guide

Deploy the Koilen Dashboard to Vercel in minutes.

---

## 🚀 Quick Deploy

### Option 1: Deploy from GitHub (Recommended)

1. **Push to GitHub** (if not already done):
   ```bash
   cd koilen-dashboard
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `koilen-dashboard` folder as root directory

3. **Configure Build Settings**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `koilen-dashboard`
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install --legacy-peer-deps`
   - **Output Directory**: `.next` (auto-detected)

4. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Get your live URL: `https://koilen-dashboard.vercel.app`

---

### Option 2: Deploy with Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   cd koilen-dashboard
   vercel
   ```

4. **Follow prompts**:
   - Set up and deploy? `Y`
   - Which scope? (Select your account)
   - Link to existing project? `N`
   - What's your project's name? `koilen-dashboard`
   - In which directory is your code located? `./`
   - Want to override settings? `N`

5. **Production Deployment**:
   ```bash
   vercel --prod
   ```

---

## ⚙️ Configuration Files

### vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install --legacy-peer-deps"
}
```

### next.config.ts
Already configured with:
- React Strict Mode
- SWC Minification
- Web3 library optimizations
- Webpack fallbacks for Node.js modules

---

## 🔧 Environment Variables (Optional)

The Koilen Dashboard doesn't require any environment variables for basic functionality. All contract addresses and RPC endpoints are hardcoded.

If you want to add custom configuration:

1. **In Vercel Dashboard**:
   - Go to Project Settings → Environment Variables
   - Add variables if needed

2. **Example (optional)**:
   ```
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
   NEXT_PUBLIC_KOILEN_CONTRACT=0x0EA04c33d1e50dba7cE53f51CCA5Af3B0De65642
   ```

---

## 📦 Build Process

### What Happens During Build:

1. **Install Dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```
   - Installs all packages from package.json
   - Uses `--legacy-peer-deps` for compatibility

2. **Next.js Build**:
   ```bash
   npm run build
   ```
   - Compiles TypeScript
   - Bundles React components
   - Optimizes for production
   - Generates static assets

3. **Output**:
   - `.next/` directory with optimized build
   - Serverless functions for API routes
   - Static assets in `.next/static/`

---

## 🌐 Post-Deployment

### Verify Deployment

1. **Visit your URL**: `https://your-project.vercel.app`

2. **Test wallet connection**:
   - Click "Connect Wallet"
   - Connect MetaMask
   - Verify Sepolia network detection

3. **Test event logging**:
   - Adjust temperature/humidity
   - See event type auto-detection
   - Submit test transaction

### Custom Domain (Optional)

1. **In Vercel Dashboard**:
   - Go to Project Settings → Domains
   - Add custom domain: `koilen.yourdomain.com`
   - Follow DNS configuration instructions

2. **Example domains**:
   - `dashboard.koilen.io`
   - `koilen-dashboard.yourdomain.com`

---

## 🐛 Troubleshooting

### Build Failures

**Error: "Cannot find module"**
- **Solution**: Verify all dependencies in package.json
- Run `npm install --legacy-peer-deps` locally to test

**Error: "Webpack compilation failed"**
- **Solution**: Check next.config.ts webpack configuration
- Ensure all Web3 libraries are properly externalized

**Error: "Out of memory"**
- **Solution**: This shouldn't happen with Koilen Dashboard
- If it does, contact Vercel support for memory increase

### Runtime Issues

**RainbowKit not connecting**
- **Cause**: WalletConnect project ID issues (warnings only)
- **Impact**: Minimal - wallet connection still works
- **Solution**: Can be ignored or add proper WalletConnect project ID

**Contract calls failing**
- **Cause**: RPC endpoint issues or network problems
- **Solution**: Verify Sepolia RPC is accessible
- Check browser console for detailed errors

**Styles not loading**
- **Cause**: Tailwind CSS build issue
- **Solution**: Ensure Tailwind v4 is properly configured
- Verify `@tailwindcss/postcss` in devDependencies

---

## 📊 Performance Optimization

### Vercel automatically provides:

✅ **Global CDN**: Instant page loads worldwide
✅ **Edge caching**: Static assets cached at edge
✅ **Image optimization**: Automatic image compression
✅ **Code splitting**: Optimized bundle sizes
✅ **Analytics**: Built-in performance monitoring

### Lighthouse Scores (Expected):

- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 90+
- **SEO**: 90+

---

## 🔐 Security

### Vercel provides:

✅ **HTTPS by default**: All deployments use SSL
✅ **DDoS protection**: Automatic traffic filtering
✅ **No secrets in frontend**: All code is public

### Important Notes:

⚠️ **Smart contract addresses are public** (by design)
⚠️ **No private keys in code** (users provide via MetaMask)
⚠️ **RPC endpoints are public** (Sepolia testnet)

---

## 🚀 Continuous Deployment

### Automatic Deploys

Once connected to GitHub, Vercel automatically deploys:

1. **Production**: Every push to `main` branch
2. **Preview**: Every pull request
3. **Rollback**: One-click rollback in Vercel Dashboard

### GitHub Integration Features:

- ✅ Deployment status checks on PRs
- ✅ Preview URLs for each commit
- ✅ Automatic HTTPS certificates
- ✅ Branch-based deployments

---

## 📝 Deployment Checklist

Before deploying to production:

- [ ] Code pushed to GitHub
- [ ] `package.json` has all dependencies
- [ ] `vercel.json` configured
- [ ] `next.config.ts` optimized
- [ ] Build tested locally (`npm run build`)
- [ ] Contract addresses verified
- [ ] Documentation updated
- [ ] README.md includes deployment URL

---

## 🎯 Example Deployment URLs

### For Hackathon Submission:

- **Production**: `https://koilen-dashboard.vercel.app`
- **GitHub**: `https://github.com/mexiweb3/Koilen`
- **Etherscan (Contract)**: `https://sepolia.etherscan.io/address/0x0EA04c33d1e50dba7cE53f51CCA5Af3B0De65642`

### Preview Deployments:

- Each PR gets unique URL
- Example: `https://koilen-dashboard-pr-123.vercel.app`

---

## 📚 Additional Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js on Vercel**: https://vercel.com/docs/frameworks/nextjs
- **Vercel CLI**: https://vercel.com/docs/cli
- **Custom Domains**: https://vercel.com/docs/custom-domains

---

## 🆘 Support

### Vercel Issues:
- Vercel Support: https://vercel.com/support
- Vercel Discord: https://vercel.com/discord

### Koilen Issues:
- GitHub Issues: https://github.com/mexiweb3/Koilen/issues
- Documentation: [FRONTEND_QUICKSTART.md](../FRONTEND_QUICKSTART.md)

---

**Built with ❤️ on EVVM** | **Deployed on Vercel** | **Status**: Production Ready ✅
