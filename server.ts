import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const STORE_FILE = path.join(DATA_DIR, 'store_state.json');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const DEFAULT_STATE = {
  products: [
    {
      id: 'rank-core',
      slug: 'core-rank',
      name: 'CORE RANK',
      category: 'ranks',
      tierRank: 'Highest Rank',
      shortDesc: 'The apex pinnacle of CryonMC. Infinite set homes, 10 vaults, 100 weekly coins, and top rank access.',
      fullDesc: 'The supreme summit of CryonMC! The Core Rank grants apex authority, 100 free coins delivered automatically every week, full Core Kit access, 10 private vaults, unlimited /sethome teleports, and exclusive god-tier privileges across all realms.',
      priceUSD: 10.79,
      priceINR: 499,
      pricePKR: 3000,
      originalPriceUSD: 14.99,
      originalPricePKR: 4000,
      billingOptions: [
        { type: 'monthly', label: 'Monthly', pricePKR: 1500, priceUSD: 5.40, originalPricePKR: 1800, originalPriceUSD: 6.50 },
        { type: 'permanent', label: 'Permanent (Lifetime)', pricePKR: 3000, priceUSD: 10.79, originalPricePKR: 4000, originalPriceUSD: 14.99 }
      ],
      weeklyCoins: 100,
      playerVaults: 10,
      setHomes: 'Infinite',
      kitName: 'Core Kit',
      image: '/cryon-logo.png',
      color: '#a855f7',
      badge: 'HIGHEST RANK',
      featured: true,
      perks: [
        '💜 100 Free Coins Every Week (Auto-delivered)',
        '⚔️ Full Core Kit Access (God gear & weapons)',
        '📦 10 Player Vaults (/pv 1-10)',
        '🏠 Infinite Set Homes (/sethome unlimited)',
        '👑 Top Rank & Exclusive Access across all realms',
        '✨ Radiant Amethyst [CORE] prefix & animated title',
        '🕊️ Flight enabled in Hubs and Claims (/fly)',
        '⚡ Instant teleport warmup delay (/tpa instant)',
        '🛠️ Infinite tool repair (/repair hand & /repair all)',
        '💬 Exclusive VIP Discord lounge & direct admin line'
      ],
      commands: ['/kit core', '/pv 1-10', '/sethome (infinite)', '/fly', '/repair all', '/feed', '/heal (non-combat)', '/back'],
      deliveryNote: 'Instant automated delivery in-game within 60 seconds after payment confirmation.',
      inStock: true
    },
    {
      id: 'rank-eclipse',
      slug: 'eclipse-rank',
      name: 'ECLIPSE RANK',
      category: 'ranks',
      tierRank: '2nd Highest',
      shortDesc: 'Stellar prestige with 7 vaults, 15 set homes, 75 weekly coins, and Eclipse Kit access.',
      fullDesc: 'Ascend to cosmic power with Eclipse Rank, the 2nd highest tier on CryonMC. Includes 75 free coins every week, high-tier Eclipse Kit, 7 private vaults, 15 set homes, unique name color, and instant teleports.',
      priceUSD: 8.99,
      priceINR: 399,
      pricePKR: 2500,
      originalPriceUSD: 11.99,
      originalPricePKR: 3200,
      billingOptions: [
        { type: 'monthly', label: 'Monthly', pricePKR: 1000, priceUSD: 3.60, originalPricePKR: 1300, originalPriceUSD: 4.70 },
        { type: 'permanent', label: 'Permanent (Lifetime)', pricePKR: 2500, priceUSD: 8.99, originalPricePKR: 3200, originalPriceUSD: 11.99 }
      ],
      weeklyCoins: 75,
      playerVaults: 7,
      setHomes: 15,
      kitName: 'Eclipse Kit',
      image: '/cryon-logo.png',
      color: '#38bdf8',
      badge: '2ND HIGHEST',
      featured: true,
      perks: [
        '🌌 75 Free Coins Every Week (Auto-delivered)',
        '⚔️ Eclipse Kit Access (Legendary armor & tools)',
        '📦 7 Player Vaults (/pv 1-7)',
        '🏠 15 Set Homes (/sethome 1-15)',
        '💎 Exclusive Rank & Unique Name styling',
        '🌠 Glowing Cosmic [ECLIPSE] chat badge',
        '⚡ Zero teleport warmup delay (/tpa instant)',
        '🛠️ Tool repair access (/repair hand)',
        '🎨 Custom nickname customization (/nick)'
      ],
      commands: ['/kit eclipse', '/pv 1-7', '/sethome 1-15', '/tpa (instant)', '/near', '/repair hand', '/feed'],
      deliveryNote: 'Instant automated delivery in-game within 60 seconds after payment confirmation.',
      inStock: true
    },
    {
      id: 'rank-titan',
      slug: 'titan-rank',
      name: 'TITAN RANK',
      category: 'ranks',
      tierRank: '3rd Highest',
      shortDesc: 'Molten dominance with 5 vaults, 10 set homes, 50 weekly coins, and Titan Kit access.',
      fullDesc: 'Command the battlefield with Titan Rank, the 3rd highest prestige tier on CryonMC. Enjoy 50 free coins every week, exclusive Titan Kit, 5 private vaults, 10 set homes, and unique fiery prefix.',
      priceUSD: 7.19,
      priceINR: 299,
      pricePKR: 2000,
      originalPriceUSD: 9.99,
      originalPricePKR: 2600,
      billingOptions: [
        { type: 'monthly', label: 'Monthly', pricePKR: 500, priceUSD: 1.80, originalPricePKR: 700, originalPriceUSD: 2.50 },
        { type: 'permanent', label: 'Permanent (Lifetime)', pricePKR: 2000, priceUSD: 7.19, originalPricePKR: 2600, originalPriceUSD: 9.99 }
      ],
      weeklyCoins: 50,
      playerVaults: 5,
      setHomes: 10,
      kitName: 'Titan Kit',
      image: '/cryon-logo.png',
      color: '#f97316',
      badge: '3RD HIGHEST',
      featured: true,
      perks: [
        '🔥 50 Free Coins Every Week (Auto-delivered)',
        '⚔️ Titan Kit Access (High-tier Netherite gear)',
        '📦 5 Player Vaults (/pv 1-5)',
        '🏠 10 Set Homes (/sethome 1-10)',
        '🛡️ Exclusive Rank & Unique Name styling',
        '⚡ Fiery Molten [TITAN] chat badge',
        '🕊️ Flight enabled in Hubs and Spawns (/fly)',
        '🎩 Utility commands (/feed, /hat)'
      ],
      commands: ['/kit titan', '/pv 1-5', '/sethome 1-10', '/fly (Hubs)', '/feed', '/hat'],
      deliveryNote: 'Instant automated delivery in-game within 60 seconds after payment confirmation.',
      inStock: true
    },
    {
      id: 'rank-booster',
      slug: 'booster-rank',
      name: 'BOOSTER RANK',
      category: 'ranks',
      tierRank: 'Community Booster',
      shortDesc: 'Support CryonMC & stand out in the community with 3 player vaults and special perks.',
      fullDesc: 'Support CryonMC & stand out in the community! The Booster rank honors our dedicated supporters with 3 private player vaults, unique glowing chat tags, Discord sync, and custom particle trails.',
      priceUSD: 2.88,
      priceINR: 149,
      pricePKR: 800,
      originalPriceUSD: 4.99,
      originalPricePKR: 1200,
      billingOptions: [
        { type: 'monthly', label: 'Monthly', pricePKR: 300, priceUSD: 1.08, originalPricePKR: 450, originalPriceUSD: 1.60 },
        { type: 'permanent', label: 'Permanent (Lifetime)', pricePKR: 800, priceUSD: 2.88, originalPricePKR: 1200, originalPriceUSD: 4.99 }
      ],
      playerVaults: 3,
      image: '/cryon-logo.png',
      color: '#eab308',
      badge: 'COMMUNITY BOOSTER',
      featured: true,
      perks: [
        '📦 3 Player Vaults (/pv 1-3)',
        '⚡ Support CryonMC & stand out in the community',
        '💎 Exclusive Electric [BOOSTER] chat badge & title',
        '🌟 Nitro Booster Discord role synchronization',
        '⚡ Priority server queue access',
        '✨ Electric lightning particle walking trail',
        '🎩 Access to /hat and cosmetic perks'
      ],
      commands: ['/pv 1-3', '/hat', '/booster', '/prefix booster'],
      deliveryNote: 'Delivered automatically upon confirmation. Synced with Discord Server Booster role.',
      inStock: true
    }
  ],
  categories: [
    {
      slug: 'ranks',
      name: 'RANKS',
      iconName: 'Crown',
      description: 'Lifetime VIP privileges, priority server queue, custom prefixes, and god-tier commands.',
      itemCount: 4,
      gradient: 'from-amber-500/20 via-yellow-500/10 to-transparent',
      accentColor: '#f59e0b',
    },
    {
      slug: 'coins',
      name: 'COINS',
      iconName: 'Coins',
      description: 'In-game network balance for purchasing cosmetics, claims, booster passes, and auctions.',
      itemCount: 5,
      gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
      accentColor: '#10b981',
    },
    {
      slug: 'crates',
      name: 'CRATES',
      iconName: 'PackageOpen',
      description: 'Unlock legendary tier armor, spawner packs, rare enchants, and cosmetic loot boxes.',
      itemCount: 4,
      gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
      accentColor: '#06b6d4',
    },
    {
      slug: 'keys',
      name: 'KEYS',
      iconName: 'Key',
      description: 'Special cosmic keys for mystery chests, vote dispensers, and seasonal event crates.',
      itemCount: 3,
      gradient: 'from-violet-500/20 via-purple-500/10 to-transparent',
      accentColor: '#8b5cf6',
    },
    {
      slug: 'tags',
      name: 'TAGS',
      iconName: 'Tag',
      description: 'High-visibility animated chat suffixes and prefixes to flaunt your prestige across all realms.',
      itemCount: 6,
      gradient: 'from-pink-500/20 via-rose-500/10 to-transparent',
      accentColor: '#ec4899',
    },
    {
      slug: 'cosmetics',
      name: 'COSMETICS',
      iconName: 'Sparkles',
      description: 'Glowing dragon cloaks, particle walk trails, morphs, custom pets, and death sound effects.',
      itemCount: 4,
      gradient: 'from-sky-500/20 via-indigo-500/10 to-transparent',
      accentColor: '#38bdf8',
    },
    {
      slug: 'bundles',
      name: 'BUNDLES',
      iconName: 'Layers',
      description: 'All-inclusive value packs combining top rank upgrades, thousands of coins, and mythic crate keys.',
      itemCount: 3,
      gradient: 'from-orange-500/20 via-amber-500/10 to-transparent',
      accentColor: '#f97316',
    },
    {
      slug: 'other',
      name: 'OTHER',
      iconName: 'Sliders',
      description: 'Private vaults, guild expansions, server-wide boost tokens, and account utility services.',
      itemCount: 4,
      gradient: 'from-blue-500/20 via-slate-500/10 to-transparent',
      accentColor: '#3b82f6',
    },
  ],
  serverConfig: {
    serverName: "CryonMC",
    serverIp: "play.cryonmc.net",
    serverPort: 25565,
    bedrockPort: 19132,
    discordUrl: "https://discord.gg/cryonmc",
    discordUsersOnline: 4647,
    storeTagline: "Elevate your journey on CryonMC with exclusive ranks, cosmetics, crate keys, and perks.",
    currentOnline: 1040,
    maxPlayers: 5000,
    tps: 20.0,
    pingMs: 19,
    logoUrl: "/cryon-logo.png",
    bgUrl: "/cryon-bg.jpg",
    supportEmail: "support@cryonmc.net",
    footerNotice: "CryonMC © 2026. All rights reserved. Not affiliated with Mojang or Microsoft.",
    copyrightYear: "2026",
    upiId: "cryonmc@upi",
    upiName: "CryonMC Network",
  },
  orders: [],
  lastUpdated: Date.now(),
};

function readStoreData(): any {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return parsed;
    }
  } catch (err) {
    console.error('Error reading store data file:', err);
  }
  writeStoreData(DEFAULT_STATE);
  return DEFAULT_STATE;
}

function writeStoreData(data: any): boolean {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing store data file:', err);
    return false;
  }
}

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '60mb' }));
  app.use(express.urlencoded({ extended: true, limit: '60mb' }));

  app.use('/uploads', express.static(UPLOADS_DIR));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', server: 'CryonMC Store API', uptime: process.uptime() });
  });

  app.get('/api/store', (_req: Request, res: Response) => {
    const data = readStoreData();
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.json(data);
  });

  app.post('/api/store', (req: Request, res: Response) => {
    try {
      const current = readStoreData();
      const updates = req.body;
      const updated = {
        ...current,
        ...updates,
        lastUpdated: Date.now(),
      };
      const ok = writeStoreData(updated);
      if (ok) {
        res.json({ success: true, lastUpdated: updated.lastUpdated });
      } else {
        res.status(500).json({ error: 'Failed to save store state' });
      }
    } catch (err: any) {
      console.error('Failed to update store:', err);
      res.status(500).json({ error: err.message || 'Server error' });
    }
  });

  app.post('/api/upload', (req: Request, res: Response) => {
    try {
      const { image, filename } = req.body;
      if (!image) {
        return res.status(400).json({ error: 'No image data provided' });
      }

      let buffer: Buffer;
      let extension = 'png';

      if (image.startsWith('data:')) {
        const matches = image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
        if (matches) {
          extension = matches[1] === 'jpeg' ? 'jpg' : matches[1];
          buffer = Buffer.from(matches[2], 'base64');
        } else {
          return res.status(400).json({ error: 'Invalid data URL format' });
        }
      } else {
        buffer = Buffer.from(image, 'base64');
      }

      const safeName = (filename ? filename.replace(/[^a-zA-Z0-9-_]/g, '_') : 'img') + `_${Date.now()}.${extension}`;
      const destPath = path.join(UPLOADS_DIR, safeName);
      fs.writeFileSync(destPath, buffer);

      const publicUrl = `/uploads/${safeName}`;
      console.log(`Image saved: ${publicUrl}`);
      res.json({ success: true, url: publicUrl });
    } catch (err: any) {
      console.error('Error saving uploaded image:', err);
      res.status(500).json({ error: err.message || 'Failed to save image' });
    }
  });

  app.get('/api/orders', (_req: Request, res: Response) => {
    const data = readStoreData();
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.json(data.orders || []);
  });

  app.post('/api/orders', (req: Request, res: Response) => {
    try {
      const newOrder = req.body;
      if (!newOrder.id) {
        newOrder.id = `ord_${Date.now()}`;
      }
      newOrder.createdAt = newOrder.createdAt || new Date().toISOString();
      const current = readStoreData();
      const orders = [newOrder, ...(current.orders || [])];
      current.orders = orders;
      current.lastUpdated = Date.now();
      writeStoreData(current);
      res.json({ success: true, order: newOrder });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to create order' });
    }
  });

  app.put('/api/orders/:id', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const current = readStoreData();
      let found = false;
      const orders = (current.orders || []).map((ord: any) => {
        if (ord.id === id) {
          found = true;
          return { ...ord, status: status || 'completed', updatedAt: new Date().toISOString() };
        }
        return ord;
      });
      if (!found) {
        return res.status(404).json({ error: 'Order not found' });
      }
      current.orders = orders;
      current.lastUpdated = Date.now();
      writeStoreData(current);
      res.json({ success: true, orders });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to update order' });
    }
  });

  app.post('/api/store/reset', (_req: Request, res: Response) => {
    writeStoreData(DEFAULT_STATE);
    res.json({ success: true, message: 'Store reset to defaults' });
  });

  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Full-stack CryonMC Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
