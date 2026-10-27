import React, { useState } from 'react';
import { Key, ExternalLink, User, Check, Sparkles } from 'lucide-react';
import { HeroBanner } from '../components/HeroBanner';
import { AppleFooter } from '../components/AppleFooter';
import { useProducts } from '../context/ProductsContext';

interface VotePageProps {
  navigate: (path: string) => void;
  onShowToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const VotePage: React.FC<VotePageProps> = ({ navigate, onShowToast }) => {
  const { serverConfig, voteConfig } = useProducts();
  const [username, setUsername] = useState('');
  const [votedSites, setVotedSites] = useState<number[]>([]);

  const handleVoteClick = (siteId: number, url: string, siteName: string) => {
    if (!username.trim()) {
      if (onShowToast) {
        onShowToast('Tip: Enter your Minecraft IGN below so vote keys are sent to your account!', 'info');
      }
    }
    
    // Open vote URL in new tab
    if (url.startsWith('http')) {
      window.open(url, '_blank');
    }
    
    if (!votedSites.includes(siteId)) {
      setVotedSites((prev) => [...prev, siteId]);
      if (onShowToast) {
        onShowToast(`Vote registered on ${siteName}! Vote key queued for ${username || 'your account'}.`, 'success');
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-[#080b11] text-slate-200 flex flex-col justify-between">
      {/* 1. Hero Banner with Cryon MC logo & winter bg */}
      <HeroBanner navigate={navigate} onShowToast={onShowToast} />

      {/* 2. Vote Main Content (Matching Screenshot 5) */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full flex-grow">
        
        {/* Card Body matching Screenshot 5 */}
        <div className="bg-[#0b101c] rounded-2xl border border-white/5 p-6 sm:p-12 shadow-2xl space-y-7 text-center">
          
          {/* Header */}
          <div>
            <div className="text-xs font-bold text-red-500 font-mono tracking-widest uppercase">
              Vote
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-['Rajdhani'] uppercase tracking-wider text-white mt-1">
              Vote for {serverConfig.serverName}!
            </h1>
          </div>

          {/* Minecraft Username input */}
          <div className="max-w-md mx-auto">
            <div className="relative flex items-center">
              <User className="absolute left-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Minecraft Username for keys..."
                className="w-full bg-[#070b14] border border-slate-800 focus:border-red-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors font-mono"
              />
              {username && (
                <span className="absolute right-3 text-[10px] text-emerald-400 font-mono flex items-center gap-1 font-bold">
                  <Check className="w-3 h-3" /> Ready
                </span>
              )}
            </div>
          </div>

          {/* Green Key Reward Banner (Matching Screenshot 5) */}
          <div className="bg-[#071318]/90 border border-emerald-500/30 rounded-xl p-4 flex items-center justify-center gap-3.5 text-left max-w-2xl mx-auto shadow-lg">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
              <Key className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-200">
              {voteConfig.rewardNotice || 'You can receive up to 6 VOTE KEYS by voting for our server!'}
            </div>
          </div>

          {/* 6 Big Action Buttons in 2 columns (Matching Screenshot 5) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-2">
            {voteConfig.voteSites.map((site) => {
              const hasVoted = votedSites.includes(site.id);
              return (
                <button
                  key={site.id}
                  onClick={() => handleVoteClick(site.id, site.url, site.siteName)}
                  className={`w-full py-4 px-6 rounded-xl font-black font-['Rajdhani'] uppercase tracking-wider text-sm flex items-center justify-center gap-2.5 transition-all duration-200 shadow-lg ${
                    hasVoted
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
                      : 'bg-[#ef4444] hover:bg-[#dc2626] text-white shadow-[0_4px_20px_rgba(239,68,68,0.35)] hover:scale-[1.02]'
                  }`}
                >
                  <span>{site.label}</span>
                  {hasVoted ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <ExternalLink className="w-4 h-4 stroke-[2.5]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Voting streak reminder */}
          <div className="text-xs text-slate-500 font-mono pt-2">
            Votes reset every 24 hours. Vote on all {voteConfig.voteSites.length} lists to maximize your daily crates & rewards!
          </div>

        </div>
      </main>

      {/* 3. Footer */}
      <AppleFooter navigate={navigate} onShowToast={onShowToast} />
    </div>
  );
};
