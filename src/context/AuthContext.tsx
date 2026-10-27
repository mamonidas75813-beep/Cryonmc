import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { CurrencyCode, Order, OrderItem, OrderStatus, UserAccount } from '../types';

interface AuthContextType {
  user: UserAccount | null;
  orders: Order[];
  login: (username: string, minecraftIgn?: string) => void;
  register: (username: string, email: string, minecraftIgn: string) => void;
  logout: () => void;
  updateMinecraftUsername: (ign: string) => void;
  createOrder: (data: {
    minecraftUsername: string;
    userEmail: string;
    items: OrderItem[];
    currency: CurrencyCode;
    totalAmount: number;
    paymentMethod: string;
    status?: OrderStatus;
    paymentScreenshot?: string;
    utrNumber?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, adminNotes?: string) => void;
  sendAndCompleteOrder: (orderId: string, adminNotes?: string) => void;
  deleteOrder: (orderId: string) => void;
  refreshOrders: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('mc_store_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Default demo user so testing is smooth right away!
    return {
      id: 'usr_demo_101',
      username: 'SteveCrafter',
      email: 'steve@yourserver.com',
      minecraftUsername: 'Steve',
      role: 'admin',
      joinedDate: 'Aug 14, 2026',
      ownedRanks: ['KING'],
      ownedTags: ['[VIP]'],
      coinsBalance: 1250,
      avatarUrl: 'https://minotar.net/avatar/Steve/100.png',
    };
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('mc_store_orders');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'ORD-89241',
        date: '2026-09-12 14:22 UTC',
        minecraftUsername: 'Steve',
        userEmail: 'steve@yourserver.com',
        items: [
          {
            productId: 'rank-core',
            productName: 'CORE RANK',
            quantity: 1,
            priceUSD: 10.79,
            category: 'ranks',
          },
          {
            productId: 'tag-vip',
            productName: '[VIP] TAG',
            quantity: 1,
            priceUSD: 2.99,
            category: 'tags',
          },
        ],
        currency: 'INR',
        totalAmount: 999,
        paymentMethod: 'UPI QR Pay (Manual Verification)',
        status: 'completed',
        transactionRef: 'txn_mc_live_89127814',
      },
    ];
  });

  const isFetchingOrdersRef = useRef<boolean>(false);

  // Sync orders from server so all devices & admin see them
  const refreshOrders = useCallback(async () => {
    if (isFetchingOrdersRef.current) return;
    try {
      isFetchingOrdersRef.current = true;
      const res = await fetch('/api/orders?t=' + Date.now());
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setOrders(data);
          localStorage.setItem('mc_store_orders', JSON.stringify(data));
        }
      }
    } catch (err) {
      console.warn('Could not sync orders from server:', err);
    } finally {
      isFetchingOrdersRef.current = false;
    }
  }, []);

  useEffect(() => {
    refreshOrders();
    const interval = setInterval(refreshOrders, 6000);
    return () => clearInterval(interval);
  }, [refreshOrders]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('mc_store_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('mc_store_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('mc_store_orders', JSON.stringify(orders));
  }, [orders]);

  const login = (username: string, minecraftIgn = 'Steve') => {
    const newUser: UserAccount = {
      id: `usr_${Date.now()}`,
      username: username || 'Player',
      email: `${(username || 'player').toLowerCase()}@player.net`,
      minecraftUsername: minecraftIgn || username || 'Steve',
      role: username.toLowerCase() === 'admin' ? 'admin' : 'user',
      joinedDate: 'Sep 20, 2026',
      ownedRanks: ['KING'],
      ownedTags: ['[PRO]'],
      coinsBalance: 500,
      avatarUrl: `https://minotar.net/avatar/${encodeURIComponent(minecraftIgn || 'Steve')}/100.png`,
    };
    setUser(newUser);
  };

  const register = (username: string, email: string, minecraftIgn: string) => {
    const newUser: UserAccount = {
      id: `usr_${Date.now()}`,
      username,
      email,
      minecraftUsername: minecraftIgn,
      role: 'user',
      joinedDate: 'Today',
      ownedRanks: [],
      ownedTags: [],
      coinsBalance: 100,
      avatarUrl: `https://minotar.net/avatar/${encodeURIComponent(minecraftIgn || 'Steve')}/100.png`,
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateMinecraftUsername = (ign: string) => {
    if (!user) return;
    setUser({
      ...user,
      minecraftUsername: ign,
      avatarUrl: `https://minotar.net/avatar/${encodeURIComponent(ign)}/100.png`,
    });
  };

  const awardUserPerks = (items: OrderItem[]) => {
    if (!user) return;
    const addedRanks: string[] = [];
    const addedTags: string[] = [];
    let addedCoins = 0;

    items.forEach((it) => {
      if (it.category === 'ranks') addedRanks.push(it.productName);
      if (it.category === 'tags') addedTags.push(it.productName);
      if (it.category === 'coins') {
        const matchedNum = parseInt(it.productName.replace(/[^0-9]/g, ''), 10) || 0;
        addedCoins += matchedNum * it.quantity;
      }
    });

    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        ownedRanks: Array.from(new Set([...prev.ownedRanks, ...addedRanks])),
        ownedTags: Array.from(new Set([...prev.ownedTags, ...addedTags])),
        coinsBalance: prev.coinsBalance + addedCoins,
      };
    });
  };

  const createOrder = (data: {
    minecraftUsername: string;
    userEmail: string;
    items: OrderItem[];
    currency: CurrencyCode;
    totalAmount: number;
    paymentMethod: string;
    status?: OrderStatus;
    paymentScreenshot?: string;
    utrNumber?: string;
  }): Order => {
    const newOrder: Order = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
      minecraftUsername: data.minecraftUsername,
      userEmail: data.userEmail,
      items: data.items,
      currency: data.currency,
      totalAmount: data.totalAmount,
      paymentMethod: data.paymentMethod,
      status: data.status || 'pending',
      transactionRef: data.utrNumber || `txn_${Math.random().toString(36).substring(2, 12)}`,
      paymentScreenshot: data.paymentScreenshot,
      utrNumber: data.utrNumber,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Send order to server so Admin and everyone can track it
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder),
    }).catch((err) => console.error('Failed to post order to server:', err));

    // If order is completed, award perks immediately
    if (newOrder.status === 'completed' && user) {
      awardUserPerks(data.items);
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, adminNotes?: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const updatedOrder: Order = {
          ...o,
          status,
          adminNotes: adminNotes !== undefined ? adminNotes : o.adminNotes,
          deliveredAt: status === 'completed' ? new Date().toISOString() : o.deliveredAt,
        };

        if (status === 'completed' && user && user.minecraftUsername.toLowerCase() === o.minecraftUsername.toLowerCase()) {
          awardUserPerks(o.items);
        }

        return updatedOrder;
      })
    );

    // Sync status change to backend server
    fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminNotes }),
    }).catch((err) => console.error('Failed to sync order update to server:', err));
  };

  const sendAndCompleteOrder = (orderId: string, adminNotes = 'Verified by Admin & Delivered in-game via Console') => {
    updateOrderStatus(orderId, 'completed', adminNotes);
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        orders,
        login,
        register,
        logout,
        updateMinecraftUsername,
        createOrder,
        updateOrderStatus,
        sendAndCompleteOrder,
        deleteOrder,
        refreshOrders,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
