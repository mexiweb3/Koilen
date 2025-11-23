# Deploy Koilen Dashboard to Vercel

## Quick Deploy (Recommended)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "feat: Configure Koilen Dashboard for Vercel deployment"
git push
```

### Step 2: Deploy on Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. **Important Settings**:
   - **Root Directory**: `koilen-dashboard`
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install --legacy-peer-deps`
   - **Node Version**: 20.x (recommended)

4. Click "Deploy"
5. Wait 2-3 minutes
6. Get your live URL!

## Alternative: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (from koilen-dashboard directory)
cd koilen-dashboard
vercel

# Production deploy
vercel --prod
```

## Files Configured for Vercel

- ✅ `vercel.json` - Vercel configuration
- ✅ `next.config.ts` - Next.js optimizations
- ✅ `.npmrc` - NPM configuration
- ✅ `package.json` - Build scripts

## Post-Deployment

Your dashboard will be live at:
- `https://koilen-dashboard.vercel.app` (or your custom URL)
- Test wallet connection
- Verify Sepolia network works
- Log test events

## Troubleshooting

**Build fails with Turbopack errors**:
- Vercel should use webpack automatically
- Build command uses `--no-lint` flag
- Webpack config handles Web3 libraries

**RPC errors on deployment**:
- Normal - Sepolia RPC works from browser
- Frontend-only, no server-side calls

**WalletConnect warnings**:
- Safe to ignore
- Wallet connection still works

## Support

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for complete guide.
