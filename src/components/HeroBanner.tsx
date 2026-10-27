import React, { useState } from 'react';
import { Play, Check, MessageSquare, Copy } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';

interface HeroBannerProps {
  navigate: (path: string) => void;
  onShowToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ navigate, onShowToast }) => {
  const { serverConfig } = useProducts();
  const [copiedIp, setCopiedIp] = useState(false);
  const [copiedDiscord, setCopiedDiscord] = useState(false);

  const handleCopyIp = () => {
    navigator.clipboard.writeText(serverConfig.serverIp);
    setCopiedIp(true);
    if (onShowToast) {
      onShowToast(`Copied server IP: ${serverConfig.serverIp}`, 'success');
    }
    setTimeout(() => setCopiedIp(false), 2500);
  };

  const handleDiscordClick = () => {
    if (serverConfig.discordUrl.startsWith('http')) {
      window.open(serverConfig.discordUrl, '_blank');
    } else {
      navigator.clipboard.writeText(serverConfig.discordUrl);
      setCopiedDiscord(true);
      if (onShowToast) {
        onShowToast(`Copied Discord invite: ${serverConfig.discordUrl}`, 'success');
      }
      setTimeout(() => setCopiedDiscord(false), 2500);
    }
  };

  return (
    <div className="relative w-full overflow-hidden select-none bg-[#06080f]">
      {/* Background Banner with Winter Landscape */}
      <div className="relative w-full h-[380px] sm:h-[430px] md:h-[480px] overflow-hidden">
        <img
          src={serverConfig.bgUrl || '/cryon-bg.jpg'}
          alt={`${serverConfig.serverName} Background`}
          className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.08] select-none transition-all duration-700"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/hero-banner.jpg';
          }}
        />

        {/* Cinematic gradient overlays matching AppleMC/CryonMC screenshots */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080b11] via-[#080b11]/40 to-black/30 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/50 pointer-events-none" />

        {/* Floating Widgets & Centered Cryon Logo */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-center gap-5 sm:gap-8 lg:gap-14 pt-2">
            
            {/* Left Widget: Connect / Players Online */}
            <div
              onClick={handleCopyIp}
              className="order-2 md:order-1 flex items-center gap-3.5 bg-black/75 hover:bg-black/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 hover:border-red-500/70 cursor-pointer transition-all duration-300 group shadow-2xl hover:scale-105 flex-shrink-0 min-w-[260px] sm:min-w-[280px]"
              title="Click to copy server IP"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.7)] group-hover:shadow-[0_0_28px_rgba(239,68,68,1)] transition-all flex-shrink-0">
                {copiedIp ? (
                  <Check className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[3]" />
                ) : (
                  <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                )}
              </div>

              <div className="text-left font-['Rajdhani']">
                <div className="text-[11px] font-bold text-red-400 uppercase tracking-widest leading-none flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping inline-block" />
                  <span>{serverConfig.currentOnline.toLocaleString()} PLAYERS ONLINE</span>
                </div>
                <div className="text-base sm:text-lg font-black text-white tracking-wider uppercase leading-tight font-mono mt-1 group-hover:text-red-300 transition-colors">
                  {serverConfig.serverIp}
                </div>
              </div>
            </div>

            {/* Center Widget: Cryon MC 3D Crystalline Logo (Fixed PC Aspect Ratio - Never Squished) */}
            <div className="order-1 md:order-2 flex flex-col items-center flex-shrink-0">
              <div
                className="relative group cursor-pointer flex-shrink-0 w-40 h-40 sm:w-52 sm:h-52 md:w-60 md:h-60 lg:w-64 lg:h-64 flex items-center justify-center"
                onClick={() => navigate('/store')}
                title={`Visit ${serverConfig.serverName} Store`}
              >
                {/* Glowing icy ambient aura behind the logo */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/40 via-blue-500/30 to-indigo-500/40 rounded-full blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 animate-pulse pointer-events-none" />
                
                <img
                  src={serverConfig.logoUrl || '/cryon-logo.png'}
                  alt={`${serverConfig.serverName} Logo`}
                  className="relative w-full h-full object-contain filter drop-shadow-[0_10px_25px_rgba(6,182,212,0.6)] group-hover:scale-105 transition-transform duration-300 select-none"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/cryon-logo.png';
                  }}
                />
              </div>
            </div>

            {/* Right Widget: Discord Community & Users Online */}
            <div
              onClick={handleDiscordClick}
              className="order-3 flex items-center gap-3.5 bg-black/75 hover:bg-black/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 hover:border-red-500/70 cursor-pointer transition-all duration-300 group shadow-2xl hover:scale-105 flex-shrink-0 min-w-[260px] sm:min-w-[280px]"
              title="Join CryonMC Discord Server"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.7)] group-hover:shadow-[0_0_28px_rgba(239,68,68,1)] transition-all flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>

              <div className="text-left font-['Rajdhani']">
                <div className="text-[11px] font-bold text-red-400 uppercase tracking-widest leading-none flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                  <span>{serverConfig.discordUsersOnline.toLocaleString()} USERS ONLINE</span>
                </div>
                <div className="text-base sm:text-lg font-black text-white tracking-wider uppercase leading-tight font-mono mt-1 group-hover:text-red-300 transition-colors truncate max-w-[170px]">
                  {serverConfig.discordUrl.replace(/^https?:\/\//, '')}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
