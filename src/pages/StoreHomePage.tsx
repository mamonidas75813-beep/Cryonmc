import React from 'react';
import {
  ArrowLeft,
  ShoppingCart,
  Crown,
  Coins,
  PackageOpen,
  Key,
  Gift,
  Sparkles,
  User,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { HeroBanner } from '../components/HeroBanner';
import { AppleFooter } from '../components/AppleFooter';
import { ProductCategory } from '../types';

interface StoreHomePageProps {
  navigate: (path: string) => void;
  onOpenProductModal?: (product: any) => void;
  onDirectBuy?: (product: any) => void;
  onShowToast?: (msg: string) => void;
}

export const StoreHomePage: React.FC<StoreHomePageProps> = ({
  navigate,
  onOpenProductModal,
  onDirectBuy,
  onShowToast,
}) => {
  const { serverConfig, products } = useProducts();
  const { itemCount } = useCart();
  const { convertPrice } = useCurrency();

  // Sidebar realm / category navigation matching Screenshot 6
  const storeCategories = [
    { id: 'home', name: 'Home', path: '/store', isHome: true },
    { id: 'ranks', name: 'Ranks', path: '/store/ranks', icon: Crown, color: '#f59e0b' },
    { id: 'coins', name: 'Coins', path: '/store/coins', icon: Coins, color: '#10b981' },
    { id: 'crates', name: 'Crates & Keys', path: '/store/crates', icon: PackageOpen, color: '#06b6d4' },
    { id: 'banana', name: 'Banana Realm', path: '/store/bundles', icon: Sparkles, color: '#eab308' },
    { id: 'orange', name: 'Orange Realm', path: '/store/bundles', icon: Sparkles, color: '#f97316' },
    { id: 'apple', name: 'Apple Realm', path: '/store/bundles', icon: Sparkles, color: '#ef4444' },
    { id: 'melon', name: 'Melon Realm', path: '/store/bundles', icon: Sparkles, color: '#22c55e' },
    { id: 'lemon', name: 'Lemon Realm', path: '/store/bundles', icon: Sparkles, color: '#facc15' },
    { id: 'mango', name: 'Mango Realm', path: '/store/bundles', icon: Sparkles, color: '#fb923c' },
    { id: 'giftcards', name: 'Gift Cards', path: '/store/other', icon: Gift, color: '#ec4899' },
  ];

  // Featured packages matching Screenshot 6
  const featuredList = products.slice(0, 4);

  return (
    <div className="relative min-h-screen bg-[#080b11] text-slate-200 flex flex-col justify-between">
      {/* Top Bar matching Screenshot 6: Back to home & Cart */}
      <div className="bg-[#060911] border-b border-white/5 py-3 px-4 sm:px-8 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold font-['Rajdhani'] uppercase tracking-wider text-slate-300 hover:text-white transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to home</span>
        </button>

        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-xs font-bold font-['Rajdhani'] uppercase tracking-wider text-red-300 hover:text-white transition-all"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Cart {itemCount}</span>
        </button>
      </div>

      {/* Hero Banner with Cryon MC logo & online widgets */}
      <HeroBanner navigate={navigate} onShowToast={onShowToast} />

      {/* Main Store Layout (Matching Screenshot 6) */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Left Sidebar: Guest Profile + Store Categories (Screenshot 6) */}
          <div className="md:col-span-4 lg:col-span-3 space-y-3">
            
            {/* User Profile Box */}
            <div className="bg-[#0b101c] rounded-2xl border border-white/5 p-3 flex items-center justify-between gap-3 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-black/50 border border-white/10 overflow-hidden flex items-center justify-center">
                  <img
                    src="https://mc-heads.net/avatar/MHF_Steve/40"
                    alt="Guest Avatar"
                    className="w-8 h-8 object-contain image-rendering-pixelated"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-white font-['Rajdhani']">Guest</div>
                  <div className="text-[10px] text-slate-500 font-mono">Not logged in</div>
                </div>
              </div>

              <button
                onClick={() => navigate('/account')}
                className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-bold font-['Rajdhani'] uppercase text-slate-300 hover:text-white transition-colors border border-white/5"
              >
                Login
              </button>
            </div>

            {/* Category Navigation Menu (Screenshot 6) */}
            <div className="bg-[#0b101c] rounded-2xl border border-white/5 p-2 shadow-xl space-y-1">
              {storeCategories.map((cat) => {
                const IconComp = cat.icon;
                const isActive = cat.isHome;

                return (
                  <button
                    key={cat.id}
                    onClick={() => navigate(cat.path)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold font-['Rajdhani'] uppercase tracking-wider transition-all text-left ${
                      isActive
                        ? 'bg-[#151c2e] text-red-400 border-l-4 border-red-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                        : 'text-slate-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {IconComp && (
                        <IconComp
                          className="w-4 h-4"
                          style={{ color: cat.color || '#94a3b8' }}
                        />
                      )}
                      <span>{cat.name}</span>
                    </div>
                    {isActive ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                    )}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Right Column: Featured Packages & Store Info (Screenshot 6) */}
          <div className="md:col-span-8 lg:col-span-9 space-y-6">
            
            {/* FEATURED PACKAGES Section */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono pl-1">
                FEATURED PACKAGES
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {featuredList.map((prod) => {
                  const price = convertPrice(prod.priceUSD, prod.pricePKR);
                  return (
                    <div
                      key={prod.id}
                      onClick={() => onOpenProductModal ? onOpenProductModal(prod) : navigate(`/store/${prod.category}`)}
                      className="bg-[#0b101c] hover:bg-[#111728] border border-white/5 hover:border-red-500/40 rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-all duration-300 shadow-xl group hover:-translate-y-0.5"
                    >
                      <div className="w-16 h-16 rounded-xl bg-black/40 border border-white/10 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold font-['Rajdhani'] text-sm sm:text-base text-white uppercase tracking-wider truncate group-hover:text-red-400 transition-colors">
                          {prod.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-mono font-bold text-xs text-red-400">
                            {price.formatted}
                          </span>
                          {prod.originalPriceUSD && (
                            <span className="font-mono text-[11px] text-slate-500 line-through">
                              ${prod.originalPriceUSD.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onDirectBuy) onDirectBuy(prod);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold font-['Rajdhani'] uppercase tracking-wider text-xs transition-colors flex-shrink-0"
                      >
                        Buy
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CryonMC Store Info Card (Matching Screenshot 6) */}
            <div className="bg-[#0b101c] rounded-2xl border border-white/5 p-6 sm:p-8 shadow-2xl space-y-5 text-left">
              <h2 className="text-xl sm:text-2xl font-black font-['Rajdhani'] uppercase text-white tracking-wide">
                {serverConfig.serverName} Store
              </h2>

              <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                <div>
                  <h4 className="font-bold text-white mb-1">Welcome</h4>
                  <p className="text-slate-400">
                    If you have made a purchase but haven't received it then please make a ticket in our support Discord server for help. Any billing issues or other payment-related inquiries can be sent by creating a ticket on our support Discord server, where you will receive a response within 48 hours.
                  </p>
                  <p className="mt-2 text-slate-400 font-mono text-xs">
                    Or use our Contact Email:{' '}
                    <span className="text-red-400 font-bold">{serverConfig.supportEmail || 'support@cryonmc.net'}</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5">
                  <h4 className="font-bold text-white mb-1">Refund policy</h4>
                  <p className="text-slate-400">
                    All payments are final and non-refundable. Initiating a chargeback or opening a PayPal dispute will result in a permanent and irreversible ban from all of our servers and other Minecraft stores.
                  </p>
                  <p className="mt-2 text-slate-400">
                    Please note that it may take between 1 to 20 minutes for your purchase to be credited in-game. If you haven't been credited after this time frame, kindly create a support ticket on our support Discord with proof of purchase, and we will investigate your issue.
                  </p>
                </div>
              </div>

              {/* Payment Methods Badges (Matching Screenshot 6) */}
              <div className="pt-4 border-t border-white/5">
                <div className="text-[11px] font-mono text-slate-500 uppercase tracking-widest mb-3">
                  Accepted Payment Methods:
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="px-3.5 py-1.5 rounded-lg bg-[#003087]/20 border border-[#003087]/40 text-blue-400 font-bold font-mono text-xs">
                    PayPal
                  </div>
                  <div className="px-3.5 py-1.5 rounded-lg bg-blue-950/40 border border-blue-500/30 text-blue-300 font-bold font-mono text-xs">
                    VISA
                  </div>
                  <div className="px-3.5 py-1.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 font-bold font-mono text-xs">
                    MasterCard
                  </div>
                  <div className="px-3.5 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-bold font-mono text-xs">
                    Maestro
                  </div>
                  <div className="px-3.5 py-1.5 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 font-bold font-mono text-xs">
                    American Express
                  </div>
                  <div className="px-3.5 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-bold font-mono text-xs">
                    UPI
                  </div>
                  <div className="px-3.5 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white font-bold font-mono text-xs">
                    Apple Pay
                  </div>
                  <div className="px-3.5 py-1.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 font-bold font-mono text-xs">
                    Google Pay
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <AppleFooter navigate={navigate} onShowToast={onShowToast} />
    </div>
  );
};
