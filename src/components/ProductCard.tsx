import React, { useState } from 'react';
import { ShoppingCart, Eye, Sparkles, Check, Crown, Flame, Moon, Zap, Shield, Home, Coins, Box } from 'lucide-react';
import { Product } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  onDirectBuy?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
  onDirectBuy,
}) => {
  const { convertPrice } = useCurrency();
  const { addToCart } = useCart();
  const [selectedDuration, setSelectedDuration] = useState<'monthly' | 'permanent'>(
    product.billingOptions ? 'permanent' : 'permanent'
  );

  const activeBilling = product.billingOptions?.find((b) => b.type === selectedDuration);
  const activePriceUSD = activeBilling ? activeBilling.priceUSD : product.priceUSD;
  const activePricePKR = activeBilling ? activeBilling.pricePKR : product.pricePKR;
  const activeOriginalUSD = activeBilling?.originalPriceUSD ?? product.originalPriceUSD;
  const activeOriginalPKR = activeBilling?.originalPricePKR ?? product.originalPricePKR;

  const currentPrice = convertPrice(activePriceUSD, activePricePKR);
  const originalPrice = activeOriginalUSD
    ? convertPrice(activeOriginalUSD, activeOriginalPKR)
    : null;

  // Distinctive rank visuals
  const getRankTheme = () => {
    switch (product.id) {
      case 'rank-core':
        return {
          icon: Crown,
          glow: 'from-purple-600/30 to-fuchsia-600/20',
          border: 'border-purple-500/40',
          badgeBg: 'from-purple-500 to-pink-500',
          badgeText: 'text-white',
          titleColor: 'text-purple-300',
          accent: '#a855f7',
        };
      case 'rank-eclipse':
        return {
          icon: Moon,
          glow: 'from-sky-600/30 to-indigo-600/20',
          border: 'border-cyan-500/40',
          badgeBg: 'from-cyan-400 to-blue-500',
          badgeText: 'text-black',
          titleColor: 'text-cyan-300',
          accent: '#38bdf8',
        };
      case 'rank-titan':
        return {
          icon: Flame,
          glow: 'from-amber-600/30 to-orange-600/20',
          border: 'border-orange-500/40',
          badgeBg: 'from-amber-400 to-orange-500',
          badgeText: 'text-black',
          titleColor: 'text-orange-300',
          accent: '#f97316',
        };
      case 'rank-booster':
        return {
          icon: Zap,
          glow: 'from-yellow-500/30 to-amber-600/20',
          border: 'border-yellow-500/40',
          badgeBg: 'from-yellow-400 to-amber-500',
          badgeText: 'text-black',
          titleColor: 'text-yellow-300',
          accent: '#eab308',
        };
      default:
        return {
          icon: Sparkles,
          glow: 'from-cyan-500/20 to-transparent',
          border: 'border-slate-800',
          badgeBg: 'from-amber-400 to-amber-300',
          badgeText: 'text-black',
          titleColor: 'text-cyan-300',
          accent: product.color || '#06b6d4',
        };
    }
  };

  const theme = getRankTheme();
  const RankIcon = theme.icon;

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl bg-gradient-to-b from-[#0f1526]/95 via-[#0b101f]/95 to-[#070b16]/95 border ${theme.border} hover:border-cyan-400/60 hover:shadow-[0_0_35px_rgba(6,182,212,0.25)] transition-all duration-300 overflow-hidden backdrop-blur-md`}
    >
      {/* Top accent glow line based on product theme color */}
      <div
        className="absolute top-0 inset-x-0 h-1 transition-all group-hover:h-1.5 duration-300 z-20"
        style={{
          background: `linear-gradient(90deg, transparent, ${product.color || '#06b6d4'}, transparent)`,
        }}
      />

      <div>
        {/* Image & Rank Photo Banner Container */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-950 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1526] via-[#0f1526]/40 to-black/40 pointer-events-none" />

          {/* Rank Name & Hierarchy Ribbon on Photo (Exact visual photo request) */}
          <div className="absolute inset-x-3 bottom-3 z-10 flex items-center justify-between bg-black/70 backdrop-blur-md p-2.5 rounded-xl border border-white/10 shadow-lg">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shadow-md flex-shrink-0"
                style={{ backgroundColor: `${product.color || '#06b6d4'}25` }}
              >
                <RankIcon className="w-4 h-4" style={{ color: product.color || '#06b6d4' }} />
              </div>
              <div className="leading-tight">
                <div className="text-xs font-black font-['Rajdhani'] uppercase tracking-wider text-white">
                  {product.name}
                </div>
                {product.tierRank && (
                  <div className="text-[10px] font-mono font-semibold" style={{ color: product.color || '#38bdf8' }}>
                    {product.tierRank.toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {product.badge && (
              <span
                className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold tracking-wider uppercase ${theme.badgeText} bg-gradient-to-r ${theme.badgeBg} shadow-sm`}
              >
                {product.badge}
              </span>
            )}
          </div>

          {/* Quick Details Hover Button */}
          <button
            onClick={() => onOpenDetails(product)}
            className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-cyan-500/90 hover:bg-cyan-400 text-black flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200 shadow-[0_0_25px_rgba(6,182,212,0.9)] z-20"
            title="View Rank Details & Perks"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5">
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed min-h-[32px] mb-3">
            {product.shortDesc}
          </p>

          {/* Key Rank Highlights (Coins, Vaults, Homes, Kit) */}
          {(product.weeklyCoins || product.playerVaults || product.setHomes || product.kitName) && (
            <div className="grid grid-cols-2 gap-1.5 mb-4 p-2.5 rounded-xl bg-slate-900/80 border border-white/5 text-[11px] font-mono">
              {product.weeklyCoins && (
                <div className="flex items-center gap-1.5 text-amber-400 truncate">
                  <Coins className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">+{product.weeklyCoins} Coins/wk</span>
                </div>
              )}
              {product.playerVaults && (
                <div className="flex items-center gap-1.5 text-cyan-300 truncate">
                  <Box className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{product.playerVaults} Vaults (/pv)</span>
                </div>
              )}
              {product.setHomes && (
                <div className="flex items-center gap-1.5 text-emerald-400 truncate">
                  <Home className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{product.setHomes} Sethomes</span>
                </div>
              )}
              {product.kitName && (
                <div className="flex items-center gap-1.5 text-purple-300 truncate">
                  <Shield className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{product.kitName}</span>
                </div>
              )}
            </div>
          )}

          {/* Feature List Preview */}
          {product.perks && product.perks.length > 0 && (
            <div className="space-y-1 mb-4 border-t border-slate-800/60 pt-3">
              {product.perks.slice(0, 3).map((perk, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-300 truncate">
                  <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                  <span className="truncate">{perk}</span>
                </div>
              ))}
              {product.perks.length > 3 && (
                <button
                  onClick={() => onOpenDetails(product)}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold pl-4.5 transition-colors cursor-pointer"
                >
                  +{product.perks.length - 3} more exclusive perks & commands
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer / Duration Options & Price & Buy */}
      <div className="p-4 sm:p-5 pt-0 border-t border-slate-800/50 mt-auto">
        {/* Duration Selector Tabs (Monthly vs Permanent) */}
        {product.billingOptions && product.billingOptions.length > 0 && (
          <div className="mb-3 pt-3">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              <span>Select Billing:</span>
              <span className="text-cyan-400 font-bold">
                {selectedDuration === 'monthly' ? 'Monthly Access' : 'Lifetime Permanent'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
              {product.billingOptions.map((opt) => {
                const optPrice = convertPrice(opt.priceUSD, opt.pricePKR);
                const isSelected = selectedDuration === opt.type;
                return (
                  <button
                    key={opt.type}
                    onClick={() => setSelectedDuration(opt.type)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-all flex flex-col items-center leading-tight ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-md font-black'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <span>{opt.type === 'monthly' ? 'Monthly' : 'Permanent'}</span>
                    <span className={`text-[10px] font-mono ${isSelected ? 'text-black/80 font-bold' : 'text-cyan-400/80'}`}>
                      {optPrice.formatted}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Price & Currency Display */}
        <div className="flex items-baseline justify-between py-2 border-t border-white/5">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono tracking-tight">
              {currentPrice.formatted}
            </span>
            {originalPrice && (
              <span className="text-xs text-slate-500 line-through font-mono">
                {originalPrice.formatted}
              </span>
            )}
            {product.billingOptions && (
              <span className="text-[10px] font-mono text-slate-400">
                {selectedDuration === 'monthly' ? '/ mo' : 'one-time'}
              </span>
            )}
          </div>
          <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-widest">
            {currentPrice.code}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <button
            onClick={() => onOpenDetails(product)}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-bold font-['Rajdhani'] uppercase tracking-wider transition-all flex items-center justify-center gap-1"
          >
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span>PERKS</span>
          </button>

          <button
            onClick={() => {
              if (onDirectBuy) {
                onDirectBuy(product);
              } else {
                addToCart(product, 1, selectedDuration);
              }
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-black font-['Rajdhani'] uppercase tracking-wider text-xs transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_25px_rgba(239,68,68,0.6)] flex items-center justify-center gap-1.5"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-white" />
            <span>BUY NOW</span>
          </button>
        </div>
      </div>
    </div>
  );
};
