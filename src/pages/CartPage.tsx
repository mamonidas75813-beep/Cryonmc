import React, { useState } from 'react';
import {
  Trash2,
  ArrowRight,
  ShoppingCart,
  ShieldCheck,
  Tag,
  ArrowLeft,
  Zap,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

interface CartPageProps {
  navigate: (path: string) => void;
  onShowToast: (msg: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ navigate, onShowToast }) => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalUSD,
    discountCode,
    discountPercent,
    applyDiscount,
  } = useCart();
  const { convertPrice, currency, currencyConfig } = useCurrency();
  const [couponInput, setCouponInput] = useState(discountCode || '');
  const [couponError, setCouponError] = useState<string | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    if (!couponInput.trim()) return;
    const res = applyDiscount(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    }
  };

  const rawSubtotalUSD = cartItems.reduce(
    (sum, item) => sum + item.product.priceUSD * item.quantity,
    0
  );
  const discountAmountUSD = rawSubtotalUSD * (discountPercent / 100);

  const subtotal = convertPrice(rawSubtotalUSD);
  const discountFormatted = convertPrice(discountAmountUSD);
  const grandTotal = convertPrice(totalUSD);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-6 shadow-inner">
          <ShoppingCart className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black font-['Rajdhani'] uppercase text-white">
          Your Shopping Cart is Empty
        </h2>
        <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
          Looks like you haven&apos;t added any Minecraft ranks, coins, crates, or tags to your cart yet.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => navigate('/store')}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center gap-2"
          >
            <span>Explore Store Categories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">
            SHOPPING CART
          </span>
          <h1 className="text-3xl font-black font-['Rajdhani'] uppercase text-white mt-1">
            Review Your Items
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-rose-400 hover:text-rose-300 font-semibold transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Cart Items Table */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const itemPrice = convertPrice(item.product.priceUSD * item.quantity);
            const unitPrice = convertPrice(item.product.priceUSD);

            return (
              <div
                key={item.product.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#0e1424] border border-slate-800 hover:border-cyan-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover bg-slate-950 border border-slate-800 flex-shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
                      {item.product.category}
                    </span>
                    <h3 className="text-base font-bold font-['Rajdhani'] text-white uppercase">
                      {item.product.name}
                    </h3>
                    <div className="text-xs text-slate-400 font-mono">
                      {unitPrice.formatted} each
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800/80">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg p-1">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center justify-center text-xs"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-mono font-bold text-xs text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center justify-center text-xs"
                    >
                      +
                    </button>
                  </div>

                  {/* Price in selected currency */}
                  <div className="text-right min-w-[80px]">
                    <div className="text-base font-black font-mono text-white">
                      {itemPrice.formatted}
                    </div>
                    <div className="text-[10px] text-cyan-400 font-mono">
                      {currency}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="pt-4 flex justify-between items-center text-xs text-slate-400">
            <button
              onClick={() => navigate('/store')}
              className="flex items-center gap-1 hover:text-cyan-300 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </button>
            <span>Instant delivery upon order completion</span>
          </div>
        </div>

        {/* Right: Order Summary Box */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0d1425] border border-cyan-500/30 shadow-xl space-y-6">
            <h3 className="text-lg font-bold font-['Rajdhani'] uppercase text-white tracking-wider border-b border-slate-800 pb-3">
              Order Summary
            </h3>

            {/* Coupon input */}
            <div>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Coupon code (SALE20)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono uppercase"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white font-bold text-xs uppercase"
                >
                  Apply
                </button>
              </form>
              {couponError && (
                <div className="text-[11px] text-rose-400 mt-1.5">{couponError}</div>
              )}
              {discountPercent > 0 && (
                <div className="text-[11px] text-emerald-400 mt-1.5 font-semibold flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  <span>Coupon {discountCode} ({discountPercent}% OFF) applied</span>
                </div>
              )}
            </div>

            {/* Breakdown */}
            <div className="space-y-3 text-xs border-t border-slate-800/80 pt-4">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-mono text-slate-200">{subtotal.formatted}</span>
              </div>

              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount ({discountPercent}%)</span>
                  <span className="font-mono">-{discountFormatted.formatted}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-400">
                <span>Selected Currency</span>
                <span className="font-mono text-cyan-400 font-semibold">{currency} ({currencyConfig.symbol})</span>
              </div>

              <div className="border-t border-slate-800 pt-3 flex justify-between items-baseline">
                <span className="text-base font-bold text-white uppercase font-['Rajdhani']">
                  Grand Total
                </span>
                <div className="text-right">
                  <div className="text-2xl font-black font-mono text-white">
                    {grandTotal.formatted}
                  </div>
                  <div className="text-[10px] text-cyan-400 font-mono">
                    Calculated in {currency}
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              id="cart-checkout-button"
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-[11px] text-slate-400 space-y-1 text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SSL Encrypted Checkout</span>
              </div>
              <p>Ready to deliver to your Minecraft IGN</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
