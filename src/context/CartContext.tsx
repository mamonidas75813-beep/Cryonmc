import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedBilling?: 'monthly' | 'permanent') => void;
  removeFromCart: (productId: string, selectedBilling?: 'monthly' | 'permanent') => void;
  updateQuantity: (productId: string, quantity: number, selectedBilling?: 'monthly' | 'permanent') => void;
  clearCart: () => void;
  totalUSD: number;
  itemCount: number;
  discountCode: string;
  discountPercent: number;
  applyDiscount: (code: string) => { success: boolean; message: string };
  toastMessage: string | null;
  dismissToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('mc_store_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [discountCode, setDiscountCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('mc_store_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  const dismissToast = () => setToastMessage(null);

  const addToCart = (product: Product, quantity = 1, selectedBilling?: 'monthly' | 'permanent') => {
    const billing = selectedBilling || (product.billingOptions ? 'permanent' : undefined);
    const billingOpt = product.billingOptions?.find((b) => b.type === billing);
    const customPriceUSD = billingOpt ? billingOpt.priceUSD : product.priceUSD;
    const customPricePKR = billingOpt ? billingOpt.pricePKR : product.pricePKR;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedBilling === billing
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [
        ...prev,
        {
          product,
          quantity,
          selectedBilling: billing,
          customPriceUSD,
          customPricePKR,
        },
      ];
    });
    const billingLabel = billing ? ` [${billing.toUpperCase()}]` : '';
    showToast(`Added ${quantity}x "${product.name}${billingLabel}" to cart!`);
  };

  const removeFromCart = (productId: string, selectedBilling?: 'monthly' | 'permanent') => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && (selectedBilling === undefined || item.selectedBilling === selectedBilling))
      )
    );
    showToast('Item removed from cart');
  };

  const updateQuantity = (productId: string, quantity: number, selectedBilling?: 'monthly' | 'permanent') => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedBilling);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId && (selectedBilling === undefined || item.selectedBilling === selectedBilling)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setDiscountCode('');
    setDiscountPercent(0);
  };

  const applyDiscount = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed === 'APPLE20' || trimmed === 'SERVER20' || trimmed === 'SALE20') {
      setDiscountCode(trimmed);
      setDiscountPercent(20);
      showToast('Coupon applied! 20% discount activated.');
      return { success: true, message: '20% discount applied!' };
    }
    if (trimmed === 'VIP50') {
      setDiscountCode(trimmed);
      setDiscountPercent(50);
      showToast('VIP code applied! 50% discount activated.');
      return { success: true, message: '50% discount applied!' };
    }
    return { success: false, message: 'Invalid coupon code. Try: SALE20' };
  };

  const rawTotalUSD = cartItems.reduce(
    (sum, item) => sum + (item.customPriceUSD ?? item.product.priceUSD) * item.quantity,
    0
  );
  const totalUSD = rawTotalUSD * (1 - discountPercent / 100);

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalUSD,
        itemCount,
        discountCode,
        discountPercent,
        applyDiscount,
        toastMessage,
        dismissToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
