import React, { useState } from 'react';
import {
  ShoppingCart,
  BookOpen,
  Trophy,
  Map,
  FileText,
  Shield,
  Eye,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  Flame,
  X,
} from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { HeroBanner } from '../components/HeroBanner';
import { AppleFooter } from '../components/AppleFooter';

interface HomePageProps {
  navigate: (path: string) => void;
  onOpenProductModal: (product: any) => void;
  onDirectBuy: (product: any) => void;
  onShowToast: (msg: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  navigate,
  onShowToast,
}) => {
  const { serverConfig, announcements } = useProducts();
  const [activeAnnouncementModal, setActiveAnnouncementModal] = useState<any | null>(null);

  // Take the primary announcement matching Screenshot 1
  const primaryAnnouncement = announcements[0] || {
    id: 'ann-default',
    title: '🍎🧊 THE END OPENING + CASH PRIZE',
    author: 'Noxillio',
    date: '4 months ago',
    views: 11664,
    comments: 1,
    content: `🔥 Hello everyone!\nWe are opening The End on Apple & Melon realms this Sunday!\n\nEnd Information:\nThe End will open May 31 at 4:30 PM (Indian Time)!\nThere is also a $20 CASH PRIZE on each realm for the Dragon Egg holder!\nMake sure to be there for a chance to win.\n\nIP: play.cryonmc.net | Bedrock Port: 19132\nStore: store.cryonmc.net`,
  };

  return (
    <div className="relative min-h-screen bg-[#080b11] text-slate-200 flex flex-col justify-between">
      {/* 1. Hero Banner with Cryon MC logo & winter bg */}
      <HeroBanner navigate={navigate} onShowToast={onShowToast} />

      {/* 2. Main Announcement Section (Matching Screenshot 1) */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full flex-grow">
        
        {/* Featured Announcement Post Card */}
        <div className="bg-[#0b101c] rounded-2xl border border-white/5 shadow-2xl overflow-hidden hover:border-white/10 transition-all">
          
          {/* Post Header */}
          <div className="p-5 sm:p-7 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h1 className="text-base sm:text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-red-500 hover:text-red-400 transition-colors cursor-pointer flex items-center gap-2">
              <span>{primaryAnnouncement.title}</span>
            </h1>

            <div className="flex items-center gap-2.5 text-xs text-slate-400">
              <div className="text-right">
                <div className="text-red-400 font-bold font-['Rajdhani'] tracking-wide">
                  {primaryAnnouncement.author}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {primaryAnnouncement.date}
                </div>
              </div>

              {/* Author Minecraft Skin Avatar */}
              <div className="w-9 h-9 rounded-lg bg-black/40 border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
                <img
                  src={
                    primaryAnnouncement.authorAvatar ||
                    `https://mc-heads.net/avatar/${primaryAnnouncement.author}/48`
                  }
                  alt={primaryAnnouncement.author}
                  className="w-8 h-8 object-contain image-rendering-pixelated"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://mc-heads.net/avatar/Steve/48';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Post Body Content */}
          <div className="p-6 sm:p-8 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            {primaryAnnouncement.content ? (
              primaryAnnouncement.content.split('\n\n').map((paragraph: string, idx: number) => {
                if (paragraph.startsWith('End Information:')) {
                  return (
                    <div key={idx} className="space-y-2 pt-1">
                      <h3 className="text-lg sm:text-2xl font-bold font-['Rajdhani'] text-white">
                        End Information:
                      </h3>
                      <div className="space-y-1 text-slate-300">
                        {paragraph
                          .replace('End Information:\n', '')
                          .split('\n')
                          .map((line: string, i: number) => (
                            <p key={i}>{line}</p>
                          ))}
                      </div>
                    </div>
                  );
                }
                return (
                  <p key={idx} className={idx === 0 ? 'text-center font-medium' : ''}>
                    {paragraph}
                  </p>
                );
              })
            ) : (
              <p>{primaryAnnouncement.summary}</p>
            )}

            {/* IP and Store Notice separator */}
            <div className="pt-4 border-t border-white/5 text-center text-xs text-slate-400 font-mono space-y-1">
              <div>
                IP: <span className="text-red-400 font-bold">{serverConfig.serverIp}</span> | Bedrock Port: <span className="text-red-400 font-bold">{serverConfig.bedrockPort}</span>
              </div>
              <div>
                Store: <span className="text-slate-300">store.cryonmc.net</span>
              </div>
            </div>
          </div>

          {/* Post Bottom Bar (Matching Screenshot 1: Views, Comments, Read Full Post) */}
          <div className="bg-[#080c16] px-5 sm:px-7 py-3.5 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-mono">
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>{primaryAnnouncement.views?.toLocaleString() || 11664}</span>
              </span>
              <span className="flex items-center gap-1.5 font-mono">
                <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                <span>{primaryAnnouncement.comments || 1}</span>
              </span>
            </div>

            <button
              onClick={() => setActiveAnnouncementModal(primaryAnnouncement)}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-all text-xs font-['Rajdhani'] uppercase tracking-wider flex items-center gap-1.5"
            >
              <span>Read full post</span>
              <ExternalLink className="w-3 h-3 text-red-400" />
            </button>
          </div>

        </div>

        {/* More announcements list if available */}
        {announcements.length > 1 && (
          <div className="mt-8 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono pl-1">
              Recent News & Updates
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {announcements.slice(1).map((ann) => (
                <div
                  key={ann.id}
                  onClick={() => setActiveAnnouncementModal(ann)}
                  className="bg-[#0b101c] hover:bg-[#101726] border border-white/5 hover:border-red-500/40 rounded-xl p-4 cursor-pointer transition-all shadow-md group"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mb-1.5">
                    <span className="text-red-400 font-bold uppercase">{ann.tag || 'UPDATE'}</span>
                    <span>{ann.date}</span>
                  </div>
                  <h4 className="text-sm font-bold font-['Rajdhani'] uppercase text-white group-hover:text-red-300 transition-colors line-clamp-1">
                    {ann.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {ann.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal for full announcement view */}
        {activeAnnouncementModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="relative w-full max-w-2xl bg-[#0b101c] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl max-h-[85vh] overflow-y-auto">
              <button
                onClick={() => setActiveAnnouncementModal(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl sm:text-2xl font-black font-['Rajdhani'] uppercase text-red-500 pr-8">
                {activeAnnouncementModal.title}
              </h2>
              <div className="text-xs text-slate-400 font-mono mt-1 mb-4">
                Posted by {activeAnnouncementModal.author} · {activeAnnouncementModal.date}
              </div>

              <div className="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed bg-black/30 p-4 rounded-xl border border-white/5">
                {activeAnnouncementModal.content || activeAnnouncementModal.summary}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setActiveAnnouncementModal(null)}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold font-['Rajdhani'] uppercase text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* 3. Footer matching Screenshot 1 */}
      <AppleFooter navigate={navigate} onShowToast={onShowToast} />
    </div>
  );
};
