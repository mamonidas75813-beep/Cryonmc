import React from 'react';
import {
  ChevronRight,
  ArrowLeft,
  Crown,
  Coins,
  PackageOpen,
  Key,
  Tag,
  Sparkles,
  Layers,
  Sliders,
  Check,
} from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { useCurrency } from '../context/CurrencyContext';
import { ProductCard } from '../components/ProductCard';
import { Product, ProductCategory, CurrencyCode } from '../types';

interface CategoryPageProps {
  categorySlug: ProductCategory;
  navigate: (path: string) => void;
  onOpenProductModal: (product: Product) => void;
  onDirectBuy: (product: Product) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  categorySlug,
  navigate,
  onOpenProductModal,
  onDirectBuy,
}) => {
  const { categories, getProductsByCategory } = useProducts();
  const { currency, setCurrency, availableCurrencies } = useCurrency();

  const currentCategory = categories.find((c) => c.slug === categorySlug) || {
    slug: categorySlug,
    name: categorySlug.toUpperCase(),
    description: 'Browse our exclusive server packages and items.',
    itemCount: 0,
    gradient: 'from-cyan-500/20 to-transparent',
    accentColor: '#06b6d4',
  };

  const products = getProductsByCategory(categorySlug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumbs & Currency Switcher Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <button
            onClick={() => navigate('/')}
            className="hover:text-cyan-300 transition-colors"
          >
            HOME
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <button
            onClick={() => navigate('/store')}
            className="hover:text-cyan-300 transition-colors"
          >
            STORE
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-cyan-400 uppercase font-bold">
            {currentCategory.name}
          </span>
        </div>

        {/* Currency Selector */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl p-1 text-xs self-start sm:self-auto">
          <span className="text-slate-400 px-2 font-medium">Currency:</span>
          {availableCurrencies.map((c) => (
            <button
              key={c.code}
              onClick={() => setCurrency(c.code as CurrencyCode)}
              className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all ${
                currency === c.code
                  ? 'bg-cyan-500 text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {c.code} ({c.symbol})
            </button>
          ))}
        </div>
      </div>

      {/* Category Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0d162a] via-[#09101f] to-[#070b14] border border-cyan-500/25 p-8 sm:p-10 mb-10 overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest text-black bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.5)]">
              CATEGORY: {currentCategory.name}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ({products.length} {products.length === 1 ? 'Package' : 'Packages'})
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black font-['Rajdhani'] uppercase tracking-wider text-white">
            {currentCategory.name} PACKAGES
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            {currentCategory.description}
          </p>
        </div>
      </div>

      {/* Quick Category Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {categories.map((cat) => {
          const isActive = cat.slug === categorySlug;
          return (
            <button
              key={cat.slug}
              onClick={() => navigate(`/store/${cat.slug}`)}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
          <p className="text-slate-400 text-sm">
            No products currently in this category. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetails={onOpenProductModal}
              onDirectBuy={onDirectBuy}
            />
          ))}
        </div>
      )}

      {/* Rank Comparison table if Ranks category */}
      {categorySlug === 'ranks' && (
        <div className="mt-20 border border-slate-800 rounded-3xl bg-[#0a0f1d] p-6 sm:p-10">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">
              SPECIFICATION MATRIX
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-['Rajdhani'] uppercase text-white mt-1">
              Rank Perks Comparison
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase">
                  <th className="py-3 px-4">Feature / Privilege</th>
                  <th className="py-3 px-4 text-amber-400 font-bold">KING</th>
                  <th className="py-3 px-4 text-rose-400 font-bold">SUPREME</th>
                  <th className="py-3 px-4 text-purple-400 font-bold">LEGEND</th>
                  <th className="py-3 px-4 text-cyan-400 font-bold">IMMORTAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Hub Flight (/fly)</td>
                  <td className="py-3.5 px-4"><Check className="w-4 h-4 text-emerald-400" /></td>
                  <td className="py-3.5 px-4"><Check className="w-4 h-4 text-emerald-400" /></td>
                  <td className="py-3.5 px-4"><Check className="w-4 h-4 text-emerald-400" /></td>
                  <td className="py-3.5 px-4"><Check className="w-4 h-4 text-emerald-400" /></td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Private Vaults (/pv)</td>
                  <td className="py-3.5 px-4 font-mono font-bold">2 Vaults</td>
                  <td className="py-3.5 px-4 font-mono font-bold">4 Vaults</td>
                  <td className="py-3.5 px-4 font-mono font-bold">8 Vaults</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">15 Vaults</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Set-Homes Capacity</td>
                  <td className="py-3.5 px-4 font-mono">5 Homes</td>
                  <td className="py-3.5 px-4 font-mono">10 Homes</td>
                  <td className="py-3.5 px-4 font-mono">20 Homes</td>
                  <td className="py-3.5 px-4 font-mono text-cyan-400 font-bold">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Tool Repair (/repair)</td>
                  <td className="py-3.5 px-4 text-slate-500">—</td>
                  <td className="py-3.5 px-4 font-mono">1h Cooldown</td>
                  <td className="py-3.5 px-4 font-mono">30m Cooldown</td>
                  <td className="py-3.5 px-4 font-mono text-cyan-400 font-bold">Zero Cooldown</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Teleport Delay</td>
                  <td className="py-3.5 px-4 font-mono">3 Seconds</td>
                  <td className="py-3.5 px-4 font-mono">2 Seconds</td>
                  <td className="py-3.5 px-4 font-mono text-purple-400">Instant (0s)</td>
                  <td className="py-3.5 px-4 font-mono text-cyan-400 font-bold">Instant (0s)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Priority Queue Bypass</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-bold">Tier 1</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-bold">Tier 2</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-bold">Tier 3</td>
                  <td className="py-3.5 px-4 text-cyan-400 font-black">Supreme Override</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
