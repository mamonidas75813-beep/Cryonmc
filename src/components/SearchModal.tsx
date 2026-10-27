import React, { useState, useMemo } from 'react';
import { Search, X, ShoppingCart, ArrowRight } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { useCurrency } from '../context/CurrencyContext';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  navigate: (path: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  navigate,
}) => {
  const { products, categories } = useProducts();
  const { convertPrice } = useCurrency();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q)
    );
  }, [query, products]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0d1322] border border-cyan-500/40 shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-cyan-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ranks, coins, crates, tags, cosmetics..."
            className="w-full bg-transparent border-none text-white text-base focus:outline-none placeholder:text-slate-500 font-medium"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
          >
            ESC
          </button>
        </div>

        {/* Categories Quick Links */}
        <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-500 text-[11px] font-semibold">Categories:</span>
          {categories.slice(0, 6).map((c) => (
            <button
              key={c.slug}
              onClick={() => {
                navigate(`/store/${c.slug}`);
                onClose();
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-950/50 hover:text-cyan-300 text-slate-300 text-[11px] font-medium transition-colors whitespace-nowrap"
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {query.trim() === '' ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              Type something to search our entire server product catalog...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No products found for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((item) => {
                const price = convertPrice(item.priceUSD);
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectProduct(item);
                      onClose();
                    }}
                    className="p-3 rounded-xl hover:bg-slate-900/80 border border-transparent hover:border-cyan-500/30 flex items-center justify-between cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover bg-slate-950 border border-slate-800"
                      />
                      <div>
                        <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {item.name}
                        </div>
                        <div className="text-xs text-slate-400 truncate max-w-xs">
                          {item.shortDesc}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono font-bold text-white">
                        {price.formatted}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
