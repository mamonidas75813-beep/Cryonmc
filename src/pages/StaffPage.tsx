import React from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { AppleFooter } from '../components/AppleFooter';
import { useProducts } from '../context/ProductsContext';

interface StaffPageProps {
  navigate: (path: string) => void;
  onShowToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const StaffPage: React.FC<StaffPageProps> = ({ navigate, onShowToast }) => {
  const { staffGroups, staffMembers } = useProducts();

  // Sort groups by order
  const sortedGroups = [...staffGroups].sort((a, b) => a.order - b.order);

  return (
    <div className="relative min-h-screen bg-[#080b11] text-slate-200 flex flex-col justify-between">
      {/* 1. Hero Banner with Cryon MC logo & winter bg */}
      <HeroBanner navigate={navigate} onShowToast={onShowToast} />

      {/* 2. Staff Team Display (Matching Screenshot 7) */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10 w-full flex-grow space-y-8">
        {sortedGroups.map((group) => {
          const membersInGroup = staffMembers.filter((m) => m.groupId === group.id);
          if (membersInGroup.length === 0) return null;

          return (
            <div key={group.id} className="space-y-3">
              {/* Category Group Header Title (e.g. Owner in Cyan, Manager in Red - Screenshot 7) */}
              <h2
                className="text-lg sm:text-xl font-bold font-['Rajdhani'] uppercase tracking-wider pl-1"
                style={{ color: group.titleColor || '#ef4444' }}
              >
                {group.title}
              </h2>

              {/* Members 3-column Grid (Screenshot 7) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {membersInGroup.map((member) => {
                  const avatarSrc =
                    member.avatarUrl ||
                    `https://mc-heads.net/avatar/${member.username}/64`;

                  return (
                    <div
                      key={member.id}
                      className="bg-[#0b101c] hover:bg-[#111728] border border-white/5 hover:border-white/10 rounded-xl p-3 flex items-center gap-3.5 transition-all shadow-md group"
                    >
                      {/* Avatar Skin Head */}
                      <div className="w-12 h-12 rounded-lg bg-black/40 p-1 border border-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden">
                        <img
                          src={avatarSrc}
                          alt={member.username}
                          className="w-10 h-10 object-contain image-rendering-pixelated group-hover:scale-110 transition-transform"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://mc-heads.net/avatar/Steve/64';
                          }}
                        />
                      </div>

                      {/* Username with category color */}
                      <div className="min-w-0 flex-1">
                        <div
                          className="font-bold text-sm sm:text-base font-['Rajdhani'] tracking-wide truncate group-hover:brightness-125 transition-all"
                          style={{ color: group.titleColor || '#ef4444' }}
                        >
                          {member.username}
                        </div>
                        {member.badge && (
                          <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-white/5 text-slate-400 uppercase tracking-widest mt-0.5 border border-white/5">
                            {member.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </main>

      {/* 3. Footer */}
      <AppleFooter navigate={navigate} onShowToast={onShowToast} />
    </div>
  );
};
