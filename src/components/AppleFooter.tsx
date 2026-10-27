import React, { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';

interface AppleFooterProps {
  navigate: (path: string) => void;
  onShowToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const AppleFooter: React.FC<AppleFooterProps> = ({ navigate, onShowToast }) => {
  const { serverConfig } = useProducts();
  const [copiedIp, setCopiedIp] = useState(false);

  const handleCopyIp = () => {
    navigator.clipboard.writeText(serverConfig.serverIp);
    setCopiedIp(true);
    if (onShowToast) {
      onShowToast(`Copied server IP: ${serverConfig.serverIp}`, 'success');
    }
    setTimeout(() => setCopiedIp(false), 3000);
  };

  return (
    <footer className="w-full border-t border-white/5 bg-[#06080e] pt-14 pb-12 mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 text-left">
          {/* Column 1: Play Now - */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold font-['Rajdhani'] uppercase tracking-wider text-white flex items-center gap-2">
              <span>Play Now</span>
              <span className="w-3 h-0.5 bg-red-500 rounded-full inline-block"></span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Start your journey today! Join the server now to play the best Lifesteal, Earth SMP, and FFA!
            </p>
            <div className="pt-2">
              <button
                onClick={handleCopyIp}
                className="px-4 py-2 rounded-lg bg-[#0e1424] hover:bg-[#152038] border border-slate-800 hover:border-red-500/50 text-xs font-mono text-slate-300 hover:text-white uppercase tracking-wider transition-all flex items-center gap-2 group"
              >
                <span>{serverConfig.serverIp}</span>
                {copiedIp ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <span className="text-red-400 group-hover:translate-x-0.5 transition-transform">»</span>
                )}
              </button>
            </div>
          </div>

          {/* Column 2: Links - */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold font-['Rajdhani'] uppercase tracking-wider text-white flex items-center gap-2">
              <span>Links</span>
              <span className="w-3 h-0.5 bg-red-500 rounded-full inline-block"></span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => navigate('/rules')}
                  className="hover:text-red-400 transition-colors"
                >
                  Server Rules
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/vote')}
                  className="hover:text-red-400 transition-colors"
                >
                  Vote Rewards
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/#map')}
                  className="hover:text-red-400 transition-colors"
                >
                  Interactive Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/staff')}
                  className="hover:text-red-400 transition-colors"
                >
                  Staff Members
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/apply')}
                  className="hover:text-red-400 transition-colors"
                >
                  Recruitment & Applications
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/admin')}
                  className="hover:text-red-400 transition-colors flex items-center gap-1 text-slate-500 hover:text-slate-300"
                >
                  <span>Staff / Admin Console</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Store Categories - */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold font-['Rajdhani'] uppercase tracking-wider text-white flex items-center gap-2">
              <span>Store Categories</span>
              <span className="w-3 h-0.5 bg-red-500 rounded-full inline-block"></span>
            </h3>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-slate-400 pt-0.5">
              {[
                { slug: 'ranks', name: 'Ranks' },
                { slug: 'coins', name: 'Coins' },
                { slug: 'crates', name: 'Crates' },
                { slug: 'keys', name: 'Keys' },
                { slug: 'tags', name: 'Tags' },
                { slug: 'cosmetics', name: 'Cosmetics' },
                { slug: 'bundles', name: 'Bundles' },
                { slug: 'other', name: 'Other' },
              ].map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => navigate(`/store/${cat.slug}`)}
                  className="text-left hover:text-red-400 transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1 h-1 rounded-full bg-red-500"></span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
            <div className="pt-2">
              <button
                onClick={() => navigate('/store')}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold font-['Rajdhani'] uppercase tracking-wider transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
              >
                <span>Shop All Packages</span>
                <ShoppingCart className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Mojang Disclaimer & Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-900 text-left text-[11px] text-slate-500 space-y-1">
          <p className="font-['Rajdhani'] text-slate-400">
            <strong className="text-white">Etheria SMP © 2026.</strong> All rights reserved.
          </p>
          <p className="text-[10px] text-slate-600">
            Not affiliated with Mojang or Microsoft.
          </p>
        </div>
      </div>
    </footer>
  );
};
