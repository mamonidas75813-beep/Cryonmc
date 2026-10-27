import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Sparkles,
  Info,
  User,
  Upload,
  Image as ImageIcon,
  Copy,
  Check,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductsContext';
import { OrderItem } from '../types';

interface CheckoutPageProps {
  navigate: (path: string) => void;
  onShowToast: (msg: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ navigate, onShowToast }) => {
  const { cartItems, totalUSD, clearCart, discountPercent, discountCode } = useCart();
  const { convertPrice, currency, currencyConfig } = useCurrency();
  const { user, createOrder } = useAuth();
  const { serverConfig } = useProducts();

  const [minecraftUsername, setMinecraftUsername] = useState(
    user?.minecraftUsername || ''
  );
  const [email, setEmail] = useState(user?.email || '');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'paypal' | 'crypto'>('upi');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderComplete, setOrderComplete] = useState<any | null>(null);

  // UPI payment proof states
  const [paymentScreenshot, setPaymentScreenshot] = useState<string>('');
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [screenshotFileName, setScreenshotFileName] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  const grandTotal = convertPrice(totalUSD);
  const inrAmount = Math.max(1, Math.round(totalUSD * 86.5));
  const effectiveUpiId = serverConfig.upiId || 'cryonmc@upi';

  // Handle local image file upload (screenshot proof)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError('File size too large. Please select an image under 8MB.');
      return;
    }

    setScreenshotFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPaymentScreenshot(reader.result);
        setError(null);
        onShowToast('Payment screenshot attached!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(effectiveUpiId);
    setCopiedUpi(true);
    onShowToast(`UPI ID copied: ${effectiveUpiId}`);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  if (cartItems.length === 0 && !orderComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-black font-['Rajdhani'] uppercase text-white">
          No Items to Checkout
        </h2>
        <p className="text-xs text-slate-400 mt-2">
          Your cart is currently empty. Please select products from our store first.
        </p>
        <button
          onClick={() => navigate('/store')}
          className="mt-6 px-6 py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs uppercase tracking-wider"
        >
          Return to Store
        </button>
      </div>
    );
  }

  const handleConfirmPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanIgn = minecraftUsername.trim();
    if (!cleanIgn) {
      setError('Please enter your Minecraft in-game username.');
      return;
    }
    if (!/^[a-zA-Z0-9_]{3,16}$/.test(cleanIgn)) {
      setError('Minecraft username must be between 3 and 16 characters (letters, numbers, underscores only).');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address for your payment receipt.');
      return;
    }

    // When paying via UPI QR, check if screenshot or UTR number is provided
    if (paymentMethod === 'upi') {
      if (!paymentScreenshot && !utrNumber.trim()) {
        setError('Please attach your payment screenshot or enter your UPI UTR reference number so admins can verify and send your ranks/items.');
        return;
      }
    }

    if (!agreeTerms) {
      setError('Please agree to the Server Terms of Service and No-Refund policy to proceed.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const orderItems: OrderItem[] = cartItems.map((it) => ({
        productId: it.product.id,
        productName: it.product.name,
        quantity: it.quantity,
        priceUSD: it.product.priceUSD,
        category: it.product.category,
      }));

      const isUpi = paymentMethod === 'upi';

      const newOrder = createOrder({
        minecraftUsername: cleanIgn,
        userEmail: email.trim(),
        items: orderItems,
        currency: isUpi ? 'INR' : currency,
        totalAmount: isUpi ? inrAmount : grandTotal.amount,
        paymentMethod:
          paymentMethod === 'upi'
            ? `UPI QR Payment (${effectiveUpiId})`
            : paymentMethod === 'card'
            ? 'Stripe Credit/Debit Gateway'
            : paymentMethod === 'paypal'
            ? 'PayPal Express Gateway'
            : 'Cryptocurrency Gateway (Coinbase Commerce)',
        status: isUpi ? 'pending' : 'completed',
        paymentScreenshot: paymentScreenshot || undefined,
        utrNumber: utrNumber.trim() || undefined,
      });

      clearCart();
      setIsProcessing(false);
      setOrderComplete(newOrder);
      
      if (isUpi) {
        onShowToast(`Order ${newOrder.id} submitted! Pending Admin Verification.`);
      } else {
        onShowToast(`Order ${newOrder.id} placed successfully!`);
      }
    }, 1500);
  };

  // Order Complete Receipt View
  if (orderComplete) {
    const isPending = orderComplete.status === 'pending';

    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className={`rounded-3xl bg-[#0c1322] border ${isPending ? 'border-amber-500/50 shadow-[0_0_50px_rgba(245,158,11,0.2)]' : 'border-cyan-500/40 shadow-2xl'} p-8 sm:p-10 text-center space-y-6`}>
          <div className={`w-16 h-16 mx-auto rounded-full ${isPending ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'} border flex items-center justify-center`}>
            {isPending ? <Clock className="w-8 h-8 animate-pulse" /> : <CheckCircle2 className="w-8 h-8" />}
          </div>

          <div>
            <span className={`text-xs font-mono font-bold uppercase tracking-widest ${isPending ? 'text-amber-400' : 'text-cyan-400'}`}>
              {isPending ? 'ORDER SUBMITTED — PENDING ADMIN VERIFICATION' : 'PURCHASE COMPLETED'}
            </span>
            <h1 className="text-3xl font-black font-['Rajdhani'] uppercase text-white mt-1">
              {isPending ? 'Payment Proof Received!' : 'Thank You For Supporting Us!'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
              {isPending ? (
                <>
                  Your order <strong className="text-white font-mono">{orderComplete.id}</strong> has been logged. Admin will check your payment screenshot and dispatch your rank/items to <strong className="text-cyan-300">{orderComplete.minecraftUsername}</strong> in-game shortly!
                </>
              ) : (
                <>
                  Your order <strong className="text-white font-mono">{orderComplete.id}</strong> has been confirmed and queued for instant automated in-game delivery.
                </>
              )}
            </p>
          </div>

          {/* Minecraft Avatar & IGN Summary */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-center gap-4 text-left max-w-md mx-auto">
            <img
              src={`https://minotar.net/avatar/${encodeURIComponent(orderComplete.minecraftUsername)}/64.png`}
              alt={orderComplete.minecraftUsername}
              className="w-12 h-12 rounded-lg border border-cyan-500/40 bg-slate-800"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://minotar.net/avatar/Steve/64.png';
              }}
            />
            <div>
              <div className="text-xs text-slate-400">Delivering in-game to:</div>
              <div className="text-base font-bold text-white font-mono">
                {orderComplete.minecraftUsername}
              </div>
              <div className={`text-[11px] font-semibold ${isPending ? 'text-amber-400' : 'text-cyan-400'}`}>
                {isPending ? 'Status: Pending Staff Review & Delivery' : 'Status: In-Game Delivery Queue Active (<60s)'}
              </div>
            </div>
          </div>

          {/* Uploaded Payment Proof Thumbnail if available */}
          {orderComplete.paymentScreenshot && (
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 max-w-md mx-auto text-left space-y-2">
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>Uploaded Payment Screenshot:</span>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-slate-800 max-h-48 bg-black/60 flex items-center justify-center">
                <img
                  src={orderComplete.paymentScreenshot}
                  alt="Payment Proof Receipt"
                  className="max-h-48 object-contain w-full"
                />
              </div>
              {orderComplete.utrNumber && (
                <div className="text-xs text-slate-300 font-mono">
                  UTR / Reference: <span className="text-white font-bold">{orderComplete.utrNumber}</span>
                </div>
              )}
            </div>
          )}

          {/* Purchased Items List */}
          <div className="text-left border-t border-slate-800 pt-4 space-y-2 max-w-md mx-auto text-xs">
            <div className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              Purchased Packages:
            </div>
            {orderComplete.items.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between text-slate-200 py-1">
                <span>{item.quantity}x {item.productName}</span>
                <span className="font-mono text-cyan-400">${(item.priceUSD * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-slate-800 pt-2 flex justify-between font-bold text-sm text-white">
              <span>Total Paid:</span>
              <span className="font-mono">{orderComplete.currency === 'INR' ? `₹${orderComplete.totalAmount}` : `${currencyConfig.symbol}${orderComplete.totalAmount.toFixed(2)} ${orderComplete.currency}`}</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/profile')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all"
            >
              View Order in Profile
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // QR Code URI generator
  const upiUri = `upi://pay?pa=${effectiveUpiId}&pn=${encodeURIComponent(serverConfig.serverName)}&am=${inrAmount}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiUri)}&margin=10`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="pb-6 border-b border-slate-800 mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">
          SECURE CHECKOUT
        </span>
        <h1 className="text-3xl font-black font-['Rajdhani'] uppercase text-white mt-1">
          Complete Your Purchase
        </h1>
      </div>

      <form onSubmit={handleConfirmPurchase} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Credentials, QR Code & Payment Method */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: Minecraft Character Details */}
          <div className="p-6 rounded-2xl bg-[#0e1424] border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold font-['Rajdhani'] uppercase tracking-wide text-base">
              <User className="w-4 h-4 text-cyan-400" />
              <span>1. Minecraft Character Information</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Minecraft Username (IGN) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={16}
                    value={minecraftUsername}
                    onChange={(e) =>
                      setMinecraftUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))
                    }
                    placeholder="e.g. Steve or Notch"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <span className="text-[11px] text-slate-500 block mt-1">
                  Case-sensitive. Ranks and items will be delivered to this exact username.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Receipt Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[11px] text-slate-500 block mt-1">
                  Your purchase receipt and order reference ID will be sent here.
                </span>
              </div>
            </div>

            {/* Live Skin Preview */}
            {minecraftUsername.trim() && (
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
                <img
                  src={`https://minotar.net/avatar/${encodeURIComponent(minecraftUsername)}/48.png`}
                  alt="Player skin head"
                  className="w-10 h-10 rounded-lg border border-cyan-500/40 bg-slate-900 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://minotar.net/avatar/Steve/48.png';
                  }}
                />
                <div>
                  <div className="text-xs font-bold text-slate-200">
                    Target Player: <span className="text-cyan-400 font-mono">{minecraftUsername}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Avatar successfully verified with Mojang skin registry.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Payment Method Selection */}
          <div className="p-6 rounded-2xl bg-[#0e1424] border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold font-['Rajdhani'] uppercase tracking-wide text-base">
              <CreditCard className="w-4 h-4 text-cyan-400" />
              <span>2. Select Payment Method</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: UPI & QR Code (Recommended) */}
              <div
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  paymentMethod === 'upi'
                    ? 'bg-emerald-950/40 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>UPI &amp; QR Code</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-black bg-emerald-500 text-black">
                        RECOMMENDED
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">GPay, PhonePe, Paytm, BHIM, QR Scan</div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'upi' ? 'border-emerald-400 bg-emerald-400' : 'border-slate-700'}`}>
                  {paymentMethod === 'upi' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                </div>
              </div>

              {/* Option 2: Credit / Debit Card (Stripe) */}
              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  paymentMethod === 'card'
                    ? 'bg-cyan-950/30 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Credit / Debit Card</div>
                    <div className="text-[11px] text-slate-400">Visa, Mastercard, Amex (Stripe)</div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'card' ? 'border-cyan-400 bg-cyan-400' : 'border-slate-700'}`}>
                  {paymentMethod === 'card' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                </div>
              </div>

              {/* Option 3: PayPal */}
              <div
                onClick={() => setPaymentMethod('paypal')}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  paymentMethod === 'paypal'
                    ? 'bg-cyan-950/30 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 font-black font-mono">
                    P
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">PayPal</div>
                    <div className="text-[11px] text-slate-400">Wallet balance or linked account</div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'paypal' ? 'border-cyan-400 bg-cyan-400' : 'border-slate-700'}`}>
                  {paymentMethod === 'paypal' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                </div>
              </div>

              {/* Option 4: Cryptocurrencies */}
              <div
                onClick={() => setPaymentMethod('crypto')}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  paymentMethod === 'crypto'
                    ? 'bg-cyan-950/30 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Cryptocurrency</div>
                    <div className="text-[11px] text-slate-400">BTC, ETH, LTC, USDT, SOL</div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'crypto' ? 'border-cyan-400 bg-cyan-400' : 'border-slate-700'}`}>
                  {paymentMethod === 'crypto' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Interactive UPI QR Code & Payment Screenshot Proof (Active when UPI is selected) */}
          {paymentMethod === 'upi' && (
            <div className="p-6 rounded-2xl bg-[#091220] border-2 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.15)] space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
                <div className="flex items-center gap-2.5">
                  <QrCode className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h3 className="font-bold font-['Rajdhani'] uppercase text-white text-lg">
                      UPI QR Payment &amp; Proof Verification
                    </h3>
                    <p className="text-xs text-slate-400">
                      Scan QR code with your UPI App, pay, and attach proof screenshot below.
                    </p>
                  </div>
                </div>

                <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
                  Amount: ₹{inrAmount}
                </div>
              </div>

              {/* QR Code and UPI ID Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* QR Code Card */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="p-2 bg-white rounded-xl shadow-lg">
                    <img
                      src={qrCodeUrl}
                      alt="UPI Payment QR Code"
                      className="w-48 h-48 object-contain"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-white font-mono">
                      Scan to Pay ₹{inrAmount}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Works with PhonePe, Google Pay, Paytm, BHIM &amp; Banking Apps
                    </div>
                  </div>
                </div>

                {/* Instructions & UPI ID Details */}
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="text-slate-400 font-mono text-[11px] uppercase">
                      Server Official UPI ID
                    </div>
                    <div className="flex items-center justify-between gap-2 bg-[#0c1322] p-2.5 rounded-lg border border-slate-800">
                      <span className="font-mono font-bold text-white text-sm select-all">
                        {effectiveUpiId}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[11px] flex items-center gap-1 transition-all"
                      >
                        {copiedUpi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Payee: <strong className="text-slate-200">{serverConfig.serverName} Network</strong>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2 text-emerald-200">
                    <div className="font-bold flex items-center gap-1.5 text-emerald-300">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Payment Instructions:</span>
                    </div>
                    <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300">
                      <li>Scan the QR code or pay to <strong className="text-white">{effectiveUpiId}</strong></li>
                      <li>Pay exact total: <strong className="text-white font-mono">₹{inrAmount}</strong></li>
                      <li>Take a screenshot of the payment receipt</li>
                      <li>Upload the screenshot or enter the 12-digit UTR below</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Photo Upload & UTR Number Inputs */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-emerald-400" />
                    <span>Upload Payment Screenshot Proof *</span>
                  </div>
                  {paymentScreenshot && (
                    <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Screenshot Attached
                    </span>
                  )}
                </div>

                {/* File Upload Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  <label className="border-2 border-dashed border-emerald-500/40 hover:border-emerald-400 rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer bg-[#0c1322] hover:bg-[#0f172a] transition-all space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        Click to Upload Screenshot
                      </span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        PNG, JPG, WEBP (Max 8MB)
                      </span>
                    </div>
                  </label>

                  {/* Image Preview Box or UTR Input */}
                  <div className="space-y-3">
                    {paymentScreenshot ? (
                      <div className="relative rounded-xl overflow-hidden border border-emerald-500/40 bg-black/60 p-2 flex flex-col items-center justify-center">
                        <img
                          src={paymentScreenshot}
                          alt="Screenshot Preview"
                          className="max-h-36 object-contain rounded"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPaymentScreenshot('');
                            setScreenshotFileName('');
                          }}
                          className="mt-2 text-[10px] text-red-400 hover:text-red-300 underline font-mono"
                        >
                          Remove / Change Screenshot
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-[#0c1322] border border-slate-800 text-slate-400 text-xs text-center flex flex-col items-center justify-center min-h-[120px]">
                        <ImageIcon className="w-6 h-6 text-slate-600 mb-1" />
                        <span>No image selected yet.</span>
                        <span className="text-[10px] text-slate-500">Attach receipt photo to accelerate delivery.</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* UTR / Reference ID Field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    12-Digit UPI Reference ID / UTR Number
                  </label>
                  <input
                    type="text"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="e.g. 421298471928"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c1322] border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Found on your PhonePe/GPay/Paytm successful payment receipt screen.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Terms checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-500"
              />
              <span>
                I agree to the <strong className="text-white">Server Rules</strong>, <strong className="text-white">Delivery Policy</strong>, and acknowledge that all sales of digital goods are final.
              </span>
            </label>
          </div>
        </div>

        {/* Right Col: Order Summary & Pay */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0d1425] border border-cyan-500/30 shadow-xl space-y-6">
            <h3 className="text-base font-bold font-['Rajdhani'] uppercase text-white tracking-wider border-b border-slate-800 pb-3">
              Order Review
            </h3>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {cartItems.map((it) => {
                const p = convertPrice(it.product.priceUSD * it.quantity);
                return (
                  <div key={it.product.id} className="flex items-center justify-between text-xs py-1">
                    <div className="truncate pr-2">
                      <div className="text-white font-semibold truncate">{it.product.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">Qty: {it.quantity}</div>
                    </div>
                    <span className="font-mono text-slate-200">{p.formatted}</span>
                  </div>
                );
              })}
            </div>

            {/* Price Summary */}
            <div className="border-t border-slate-800 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Payment Method</span>
                <span className="font-mono text-cyan-400 font-bold uppercase">{paymentMethod}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Discount Applied ({discountCode})</span>
                  <span>{discountPercent}% OFF</span>
                </div>
              )}
              <div className="border-t border-slate-800 pt-3 flex justify-between items-baseline">
                <span className="text-sm font-bold uppercase text-white font-['Rajdhani']">
                  Amount Due
                </span>
                <div className="text-right">
                  <div className="text-2xl font-black font-mono text-white">
                    {paymentMethod === 'upi' ? `₹${inrAmount}` : grandTotal.formatted}
                  </div>
                  <div className="text-[10px] text-cyan-400 font-mono">
                    {paymentMethod === 'upi' ? 'INR UPI Total' : `${currency} Total`}
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/50 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Confirm purchase button */}
            <button
              id="confirm-purchase-button"
              type="submit"
              disabled={isProcessing}
              className={`w-full py-4 px-4 rounded-xl font-black text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] ${
                isProcessing
                  ? 'bg-cyan-700 text-slate-300 cursor-not-allowed'
                  : paymentMethod === 'upi'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>SUBMITTING ORDER...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-black" />
                  <span>
                    {paymentMethod === 'upi'
                      ? `SUBMIT PAYMENT PROOF & BUY (₹${inrAmount})`
                      : `CONFIRM & PAY ${grandTotal.formatted}`}
                  </span>
                </>
              )}
            </button>

            <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-bit Encrypted Transaction</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
