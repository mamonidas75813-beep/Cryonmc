import React from 'react';
import { Crown, Heart, ShieldCheck, ExternalLink, HelpCircle, Sparkles, MessageSquare } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { serverConfig, categories } = useProducts();

  return (
    <footer className="relative mt-24 border-t border-cyan-500/20 bg-[#070a12] text-slate-400 overflow-hidden">
      {/* Glow highlight line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Server Info & Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                  <Crown className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <span className="text-xl font-black tracking-wider text-white font-['Rajdhani'] uppercase group-hover:text-cyan-300 transition-colors">
                {serverConfig.serverName}
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The premier Minecraft gaming network offering competitive gamemodes, balanced economies, custom enchants, and instant automated store deliveries.
            </p>

            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-2 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>IP: {serverConfig.serverIp}</span>
            </div>

            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                256-Bit SSL Encrypted
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Instant Delivery
              </span>
            </div>
          </div>

          {/* Col 2: Store Categories */}
          <div>
            <h4 className="text-xs font-bold tracking-widest text-slate-200 uppercase mb-4 font-['Rajdhani']">
              STORE CATEGORIES
            </h4>
            <ul className="space-y-2 text-sm">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.slug}>
                  <button
                    onClick={() => navigate(`/store/${cat.slug}`)}
                    className="hover:text-cyan-300 transition-colors"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => navigate('/store')}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors text-xs font-semibold"
                >
                  View All Categories →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: More Store & Utilities */}
          <div>
            <h4 className="text-xs font-bold tracking-widest text-slate-200 uppercase mb-4 font-['Rajdhani']">
              MORE PACKAGES
            </h4>
            <ul className="space-y-2 text-sm">
              {categories.slice(5).map((cat) => (
                <li key={cat.slug}>
                  <button
                    onClick={() => navigate(`/store/${cat.slug}`)}
                    className="hover:text-cyan-300 transition-colors"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => navigate('/cart')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Shopping Cart
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/profile')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  My Purchases
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Community & Support */}
          <div>
            <h4 className="text-xs font-bold tracking-widest text-slate-200 uppercase mb-4 font-['Rajdhani']">
              HELP & NETWORK
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => navigate('/support')}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span>Support Center</span>
                </button>
              </li>
              <li>
                <a
                  href={serverConfig.discordUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Join Discord</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <button
                  onClick={() => navigate('/admin')}
                  className="hover:text-cyan-300 transition-colors text-xs text-slate-400"
                >
                  Admin Management
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/terms')}
                  className="hover:text-cyan-300 transition-colors text-xs text-slate-400"
                >
                  Terms & Delivery Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal disclaimer & copyright */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="text-center md:text-left leading-relaxed max-w-2xl">
            {serverConfig.serverName} is not in any way affiliated with or endorsed by Mojang AB or Microsoft Corporation. Minecraft is a registered trademark of Mojang Synergies AB. All purchases are final and support ongoing server infrastructure development.
          </p>
          <div className="flex items-center gap-4 flex-shrink-0 text-slate-400">
            <span>© {new Date().getFullYear()} {serverConfig.serverName}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for players
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
