import React, { useState } from 'react';
import {
  X,
  ShoppingCart,
  Check,
  Zap,
  Terminal,
  ShieldCheck,
  AlertCircle,
  Gift,
  Coins,
} from 'lucide-react';
import { Product } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';
import { TagPreviewBox } from './TagPreviewBox';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onBuyNow: (product: Product, quantity: number, selectedBilling?: 'monthly' | 'permanent') => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onBuyNow,
}) => {
  const { convertPrice } = useCurrency();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedBilling, setSelectedBilling] = useState<'monthly' | 'permanent'>('permanent');

  if (!product) return null;

  const activeBilling = product.billingOptions?.find((b) => b.type === selectedBilling);
  const activePriceUSD = activeBilling ? activeBilling.priceUSD : product.priceUSD;
  const activePricePKR = activeBilling ? activeBilling.pricePKR : product.pricePKR;
  const activeOriginalUSD = activeBilling?.originalPriceUSD ?? product.originalPriceUSD;
  const activeOriginalPKR = activeBilling?.originalPricePKR ?? product.originalPricePKR;

  const currentPrice = convertPrice(activePriceUSD * quantity, activePricePKR ? activePricePKR * quantity : undefined);
  const singlePrice = convertPrice(activePriceUSD, activePricePKR);
  const originalPrice = activeOriginalUSD
    ? convertPrice(activeOriginalUSD * quantity, activeOriginalPKR ? activeOriginalPKR * quantity : undefined)
    : null;

  const handleAddToCart = () => {
    addToCart(product, quantity, product.billingOptions ? selectedBilling : undefined);
    onClose();
  };

  const handleBuyNow = () => {
    onBuyNow(product, quantity, product.billingOptions ? selectedBilling : undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#0c1222] border border-cyan-500/30 shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden z-10 my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Top glow accent */}
        <div
          className="h-1.5 w-full"
          style={{
            background: `linear-gradient(90deg, #06b6d4, ${product.color || '#3b82f6'}, #8b5cf6)`,
          }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 border border-slate-700 text-slate-400 hover:text-white hover:border-cyan-500/50 transition-all z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="max-h-[85vh] overflow-y-auto p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Product Image & Badges */}
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-slate-950/80 border border-slate-800 aspect-square flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c1222] via-transparent to-transparent opacity-80" />

                {product.badge && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase text-black bg-gradient-to-r from-amber-400 to-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.6)]">
                      {product.badge}
                    </span>
                  </div>
                )}

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 backdrop-blur-md">
                    CATEGORY: {product.category.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Tag preview if it's a tag */}
              {product.tagPreview && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-400 tracking-wider uppercase font-['Rajdhani']">
                    Live Chat Suffix Preview:
                  </span>
                  <TagPreviewBox
                    tag={product.tagPreview.tag}
                    tagColor={product.tagPreview.tagColor}
                    chatColor={product.tagPreview.chatColor}
                  />
                </div>
              )}

              {/* Delivery info box */}
              <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-3.5 text-xs text-slate-300 space-y-1.5">
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Important Delivery & Access Information</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  {product.deliveryNote ||
                    'Instant automatic delivery within 60 seconds after payment confirmation. Please ensure your Minecraft character is typed correctly at checkout.'}
                </p>
              </div>
            </div>

            {/* Right: Info, Perks, Price & Action Buttons */}
            <div className="flex flex-col justify-between space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black font-['Rajdhani'] text-white tracking-wide uppercase">
                  {product.name}
                </h2>

                <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                  {product.fullDesc || product.shortDesc}
                </p>

                {/* Billing Selector for Ranks */}
                {product.billingOptions && product.billingOptions.length > 0 && (
                  <div className="mt-4 p-3.5 rounded-2xl bg-slate-900/90 border border-cyan-500/30">
                    <div className="flex items-center justify-between text-xs font-mono mb-2">
                      <span className="text-slate-400 font-bold uppercase">Select Billing Duration:</span>
                      <span className="text-cyan-400 font-extrabold">
                        {selectedBilling === 'monthly' ? 'Monthly Access' : 'Permanent Lifetime'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {product.billingOptions.map((opt) => {
                        const optPrice = convertPrice(opt.priceUSD, opt.pricePKR);
                        const isSelected = selectedBilling === opt.type;
                        return (
                          <button
                            key={opt.type}
                            type="button"
                            onClick={() => setSelectedBilling(opt.type)}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              isSelected
                                ? 'bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                                : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-black font-['Rajdhani'] uppercase tracking-wider ${isSelected ? 'text-cyan-300' : 'text-slate-300'}`}>
                                {opt.type === 'monthly' ? 'Monthly' : 'Permanent'}
                              </span>
                              {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />}
                            </div>
                            <div className="text-lg font-black font-mono text-white mt-1">
                              {optPrice.formatted}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {opt.type === 'monthly' ? 'Billed every 30 days' : 'Permanent one-time'}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Key Rank Metrics (Coins, Vaults, Homes, Kit) */}
                {(product.weeklyCoins || product.playerVaults || product.setHomes || product.kitName) && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {product.weeklyCoins && (
                      <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/20 text-center">
                        <div className="text-[10px] font-mono uppercase text-amber-400/80">Weekly Coins</div>
                        <div className="text-base font-black font-mono text-amber-300">+{product.weeklyCoins}</div>
                      </div>
                    )}
                    {product.playerVaults && (
                      <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-center">
                        <div className="text-[10px] font-mono uppercase text-cyan-400/80">Player Vaults</div>
                        <div className="text-base font-black font-mono text-cyan-300">{product.playerVaults} /pv</div>
                      </div>
                    )}
                    {product.setHomes && (
                      <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-center">
                        <div className="text-[10px] font-mono uppercase text-emerald-400/80">Set Homes</div>
                        <div className="text-base font-black font-mono text-emerald-300">{product.setHomes}</div>
                      </div>
                    )}
                    {product.kitName && (
                      <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/20 text-center">
                        <div className="text-[10px] font-mono uppercase text-purple-400/80">Kit Access</div>
                        <div className="text-xs font-black font-['Rajdhani'] text-purple-300 mt-1 truncate">{product.kitName}</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Perks Section */}
                {product.perks && product.perks.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h4 className="text-xs font-bold tracking-widest text-cyan-400 uppercase font-['Rajdhani'] flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      <span>PERKS & PRIVILEGES</span>
                    </h4>
                    <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                      {product.perks.map((perk, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-xs text-slate-200 bg-slate-900/40 p-2 rounded-lg border border-slate-800/60"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Commands Section if any */}
                {product.commands && product.commands.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-xs font-bold tracking-widest text-slate-400 uppercase font-['Rajdhani'] flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                      <span>INCLUDED COMMANDS</span>
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {product.commands.map((cmd, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300"
                        >
                          {cmd}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rewards table if crate */}
                {product.rewards && product.rewards.length > 0 && (
                  <div className="mt-5 space-y-2">
                    <h4 className="text-xs font-bold tracking-widest text-purple-400 uppercase font-['Rajdhani'] flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 text-purple-400" />
                      <span>POSSIBLE CRATE REWARDS & DROP RATES</span>
                    </h4>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {product.rewards.map((rew, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900/50 border border-slate-800"
                        >
                          <span className="text-slate-200 font-medium truncate pr-2">{rew.name}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950/60 border border-purple-500/30 text-purple-300">
                            {rew.chance}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Price, Quantity, and Action Buttons */}
              <div className="border-t border-slate-800 pt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">Total Price</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black font-mono text-white">
                        {currentPrice.formatted}
                      </span>
                      {originalPrice && (
                        <span className="text-sm text-slate-500 line-through font-mono">
                          {originalPrice.formatted}
                        </span>
                      )}
                    </div>
                    {quantity > 1 && (
                      <span className="text-[11px] text-slate-400">
                        ({singlePrice.formatted} each)
                      </span>
                    )}
                  </div>

                  {/* Quantity selector */}
                  <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-mono font-bold text-sm text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleAddToCart}
                    className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 hover:text-white font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4 text-cyan-400" />
                    <span>ADD TO CART</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 text-black" />
                    <span>BUY NOW</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
