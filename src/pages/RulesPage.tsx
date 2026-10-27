import React, { useState } from 'react';
import {
  Scale,
  Swords,
  MessageSquare,
  AlertTriangle,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { HeroBanner } from '../components/HeroBanner';
import { AppleFooter } from '../components/AppleFooter';
import { useProducts } from '../context/ProductsContext';

interface RulesPageProps {
  navigate: (path: string) => void;
  onShowToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const RulesPage: React.FC<RulesPageProps> = ({ navigate, onShowToast }) => {
  const { serverConfig, rulesConfig } = useProducts();
  const [activeCategoryId, setActiveCategoryId] = useState<string>(() => {
    return rulesConfig[0]?.id || 'home';
  });

  const getCategoryIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Swords':
        return Swords;
      case 'MessageSquare':
        return MessageSquare;
      case 'AlertTriangle':
        return AlertTriangle;
      case 'Scale':
      default:
        return Scale;
    }
  };

  const currentCategory = rulesConfig.find((c) => c.id === activeCategoryId) || rulesConfig[0];

  return (
    <div className="relative min-h-screen bg-[#080b11] text-slate-200 flex flex-col justify-between">
      {/* 1. Hero Banner with Cryon MC logo & winter bg */}
      <HeroBanner navigate={navigate} onShowToast={onShowToast} />

      {/* 2. Rules Section with Sidebar Categories (matching Screenshots 2, 3, 4) */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Category Selector Sidebar */}
          <div className="md:col-span-4 lg:col-span-3 space-y-3">
            <div className="bg-[#0b101c] rounded-2xl border border-white/5 p-3 shadow-xl">
              <div className="px-3 py-2 text-[11px] font-bold text-red-400 font-mono tracking-widest uppercase flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-red-500" />
                <span>Rules</span>
              </div>
              
              <div className="space-y-1 mt-1">
                {rulesConfig.map((cat) => {
                  const IconComp = getCategoryIcon(cat.iconName);
                  const isActive = activeCategoryId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategoryId(cat.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold font-['Rajdhani'] uppercase tracking-wider transition-all text-left ${
                        isActive
                          ? 'bg-[#151c2e] text-white border-l-4 border-red-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] text-red-400'
                          : 'text-slate-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <IconComp className={`w-4 h-4 ${isActive ? 'text-red-500' : 'text-slate-500'}`} />
                        <span>{cat.name}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-red-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Discord Assistance Card */}
            <div className="bg-[#0b101c]/80 rounded-2xl border border-white/5 p-4 text-xs text-slate-400 space-y-2">
              <div className="font-bold text-white font-['Rajdhani'] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Need Staff Assistance?</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                Found a hacker or suspect rule violation? Record proof and submit a ticket immediately in Discord.
              </p>
              <a
                href={serverConfig.discordUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-3 rounded-lg bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 text-red-300 hover:text-white font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors font-['Rajdhani']"
              >
                <span>Open Discord Ticket</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Right Column: Category Content Panel */}
          <div className="md:col-span-8 lg:col-span-9">
            <div className="bg-[#0b101c] rounded-2xl border border-white/5 p-6 sm:p-8 shadow-2xl min-h-[480px]">
              
              {/* Category 1: HOME (Exact match with Screenshot 3) */}
              {currentCategory?.id === 'home' && (
                <div className="text-center space-y-6 max-w-2xl mx-auto py-4 animate-in fade-in duration-200">
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-['Rajdhani'] uppercase tracking-wider text-white">
                      {currentCategory.title || `${serverConfig.serverName} Official Rules`}
                    </h1>
                    {currentCategory.lastUpdated && (
                      <div className="text-xs text-red-400/90 font-mono mt-1 italic">
                        Last updated: {currentCategory.lastUpdated}
                      </div>
                    )}
                  </div>

                  <div className="text-xs sm:text-sm text-slate-300/90 leading-relaxed text-left space-y-4 bg-black/20 p-5 rounded-xl border border-white/5">
                    {currentCategory.description?.split('\n\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    )) || (
                      <p>
                        Welcome to the official rules page for {serverConfig.serverName}. Here you will find our network-wide guidelines and Discord server rules.
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    <a
                      href={serverConfig.discordUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold font-['Rajdhani'] uppercase tracking-wider text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:scale-105"
                    >
                      <span>Click to join the {serverConfig.serverName} Support server on Discord.</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}

              {/* Other Categories (MINECRAFT SERVER, DISCORD SERVER, etc. - Screenshots 2 & 4) */}
              {currentCategory?.id !== 'home' && currentCategory && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-white/5 pb-4 text-center">
                    <h2 className="text-2xl sm:text-3xl font-black font-['Rajdhani'] uppercase tracking-wider text-white">
                      {currentCategory.title}
                    </h2>
                    {currentCategory.description && (
                      <p className="text-xs sm:text-sm text-slate-400 mt-2 font-['Rajdhani'] tracking-wide">
                        {currentCategory.description}
                      </p>
                    )}
                  </div>

                  {/* Bulleted rules list matching Screenshot 2 & 4 */}
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                    {currentCategory.rules.map((rule) => (
                      <li key={rule.id} className="flex items-start gap-2.5 pl-1 leading-relaxed">
                        <span className="text-slate-500 mt-1 select-none font-bold">•</span>
                        <div>
                          <span>{rule.text}</span>
                          {rule.highlightTag && (
                            <span
                              className={`ml-2 px-2 py-0.5 rounded text-[11px] font-bold font-mono tracking-wide ${
                                rule.highlightColor === 'red'
                                  ? 'bg-red-950/70 border border-red-500/40 text-red-300'
                                  : rule.highlightColor === 'yellow'
                                  ? 'bg-amber-950/70 border border-amber-500/40 text-amber-300'
                                  : 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-400'
                              }`}
                            >
                              ({rule.highlightTag})
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>

                  {currentCategory.id === 'minecraft' && (
                    <div className="pt-4 border-t border-white/5 text-xs text-slate-400 italic">
                      Please also note that blocks may be unclaimed if the claim owner has not logged on in 30 days or more.
                    </div>
                  )}

                  {currentCategory.id === 'discord' && (
                    <div className="pt-4 border-t border-white/5 text-xs text-slate-400 italic">
                      Generally, if it is not acceptable in-game, then it is not acceptable on Discord either.
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>
      </main>

      {/* 3. Footer */}
      <AppleFooter navigate={navigate} onShowToast={onShowToast} />
    </div>
  );
};
