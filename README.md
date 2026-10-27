# 🎮 CryonMC Network - Official Minecraft Server Website & Store

A modern, high-performance Minecraft Server Website & Store built with **React 19**, **Vite**, **Tailwind CSS**, and optional **Express Full-Stack Persistence**.

---

## 🚀 GitHub par Setup aur Run karne ka Tarika (Local Run)

1. **Repository Clone karein:**
   ```bash
   git clone https://github.com/<your-username>/<your-repo-name>.git
   cd <your-repo-name>
   ```

2. **Dependencies Install karein:**
   ```bash
   npm install
   ```

3. **Dev Server Start karein:**
   ```bash
   npm run dev
   ```
   Server `http://localhost:3000` par run hoga!

4. **Production Build banayein:**
   ```bash
   npm run build
   ```

---

## 🌐 GitHub Pages par Deploy karne ka Tarika (Free Website Hosting)

Is project me **GitHub Actions Workflow** already configure kiya gaya hai (`.github/workflows/deploy.yml`).

1. Apna code GitHub repository ke `main` ya `master` branch par push karein:
   ```bash
   git add .
   git commit -m "Deploy CryonMC Store"
   git push origin main
   ```
2. GitHub par repository me jayein:
   - **Settings** tab par click karein.
   - Left sidebar me **Pages** par click karein.
   - **Build and deployment** section me **Source** ko **GitHub Actions** select karein.
3. Push hote hi GitHub Actions automatically site ko build karke publish kar dega:
   - URL: `https://<your-username>.github.io/<your-repo-name>/`
4. Is repo me **`base: './'`**, **`public/404.html`** aur **SPA route restore** setup hai, isliye subpath ya page refresh karne par koi 404 error nahi aayega!

---

## ⚡ Full-Stack Deployment (Render / Railway / VPS / Docker)

Agar aap chahte hain ki Admin Panel se photo/rank change karne par wo bina database setup ke directly server file par persist rahe (`data/store_state.json`):

- **Build Command:** `npm run build`
- **Start Command:** `npm start` (ya `npx tsx server.ts`)
- **Port:** `3000` (ya `$PORT`)

---

## 🔑 Admin Dashboard Login Credentials

- **Username:** `cryonmc@1@1`
- **Password:** `cryon@1!`

---

## ✨ Features Included:
- 👑 Ranks, Coins, Crates, Keys, Tags, Bundles & Cosmetics Catalog
- 🇮🇳 Default Indian Rupee (₹ INR) + Multi-Currency Switcher (USD, PKR, EUR, GBP)
- 💳 UPI QR Code & Instant Checkout with Payment Screenshot Upload
- 📊 Real-Time Server Ping & Online Status Indicator
- 🛠️ Full Admin Panel: Add Ranks, Upload Photos/Logos, Manage UPI ID, Approve Orders
- 📱 100% Responsive for Mobile, Tablet, and Desktop
