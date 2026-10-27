import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import {
  CATEGORIES,
  DEFAULT_SERVER_CONFIG,
  INITIAL_PRODUCTS,
  DEFAULT_RULES_CONFIG,
  DEFAULT_VOTE_CONFIG,
  DEFAULT_STAFF_GROUPS,
  DEFAULT_STAFF_MEMBERS,
  DEFAULT_APPLICATIONS,
  DEFAULT_ANNOUNCEMENTS,
} from '../data/mockData';
import {
  CategoryInfo,
  Product,
  ProductCategory,
  ServerConfig,
  RuleCategoryConfig,
  RuleItem,
  VoteConfig,
  VoteSiteConfig,
  StaffGroupConfig,
  StaffMemberConfig,
  ApplicationConfig,
  AnnouncementItem,
} from '../types';

interface ProductsContextType {
  // Products & Categories
  products: Product[];
  categories: CategoryInfo[];
  addCategory: (category: CategoryInfo) => void;
  updateCategory: (slug: string, updates: Partial<CategoryInfo>) => void;
  deleteCategory: (slug: string) => void;
  addProduct: (product: Omit<Product, 'id' | 'slug'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductsByCategory: (category: ProductCategory) => Product[];
  featuredProducts: Product[];

  // Server Branding & Core Config
  serverConfig: ServerConfig;
  updateServerConfig: (config: Partial<ServerConfig>) => void;

  // Rules Configuration
  rulesConfig: RuleCategoryConfig[];
  updateRulesCategory: (id: string, updates: Partial<RuleCategoryConfig>) => void;
  addRuleItem: (catId: string, item: Omit<RuleItem, 'id'>) => void;
  updateRuleItem: (catId: string, ruleId: string, updates: Partial<RuleItem>) => void;
  deleteRuleItem: (catId: string, ruleId: string) => void;
  addRulesCategory: (category: RuleCategoryConfig) => void;
  deleteRulesCategory: (id: string) => void;

  // Vote Configuration
  voteConfig: VoteConfig;
  updateVoteConfig: (updates: Partial<VoteConfig>) => void;
  addVoteSite: (site: Omit<VoteSiteConfig, 'id'>) => void;
  updateVoteSite: (id: number, updates: Partial<VoteSiteConfig>) => void;
  deleteVoteSite: (id: number) => void;

  // Staff Configuration
  staffGroups: StaffGroupConfig[];
  staffMembers: StaffMemberConfig[];
  addStaffGroup: (group: StaffGroupConfig) => void;
  updateStaffGroup: (id: string, updates: Partial<StaffGroupConfig>) => void;
  deleteStaffGroup: (id: string) => void;
  addStaffMember: (member: Omit<StaffMemberConfig, 'id'>) => void;
  updateStaffMember: (id: string, updates: Partial<StaffMemberConfig>) => void;
  deleteStaffMember: (id: string) => void;

  // Applications Configuration
  applications: ApplicationConfig[];
  addApplication: (app: ApplicationConfig) => void;
  updateApplication: (id: string, updates: Partial<ApplicationConfig>) => void;
  deleteApplication: (id: string) => void;

  // Announcements Configuration
  announcements: AnnouncementItem[];
  addAnnouncement: (ann: Omit<AnnouncementItem, 'id'>) => void;
  updateAnnouncement: (id: string, updates: Partial<AnnouncementItem>) => void;
  deleteAnnouncement: (id: string) => void;

  // Server persistence & Upload helper
  uploadImage: (imageStr: string, filename?: string) => Promise<string>;
  syncStatus: 'synced' | 'saving' | 'error';
  refreshFromServer: () => Promise<void>;

  // Global Reset
  resetToDefaults: () => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('cryon_store_products_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PRODUCTS;
  });

  // 1b. Dynamic Categories
  const [categories, setCategories] = useState<CategoryInfo[]>(() => {
    try {
      const saved = localStorage.getItem('cryon_store_categories_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return CATEGORIES;
  });

  // 2. Server Config
  const [serverConfig, setServerConfig] = useState<ServerConfig>(() => {
    try {
      const saved = localStorage.getItem('cryon_server_config_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        const resolvedLogo = (!parsed.logoUrl || parsed.logoUrl.includes('etheria')) ? '/cryon-logo.png' : parsed.logoUrl;
        return {
          ...DEFAULT_SERVER_CONFIG,
          ...parsed,
          logoUrl: resolvedLogo,
          bgUrl: parsed.bgUrl || '/cryon-bg.jpg',
        };
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SERVER_CONFIG;
  });

  // 3. Rules Config
  const [rulesConfig, setRulesConfig] = useState<RuleCategoryConfig[]>(() => {
    try {
      const saved = localStorage.getItem('cryon_rules_config_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_RULES_CONFIG;
  });

  // 4. Vote Config
  const [voteConfig, setVoteConfig] = useState<VoteConfig>(() => {
    try {
      const saved = localStorage.getItem('cryon_vote_config_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_VOTE_CONFIG;
  });

  // 5. Staff Groups & Members
  const [staffGroups, setStaffGroups] = useState<StaffGroupConfig[]>(() => {
    try {
      const saved = localStorage.getItem('cryon_staff_groups_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_STAFF_GROUPS;
  });

  const [staffMembers, setStaffMembers] = useState<StaffMemberConfig[]>(() => {
    try {
      const saved = localStorage.getItem('cryon_staff_members_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_STAFF_MEMBERS;
  });

  // 6. Applications
  const [applications, setApplications] = useState<ApplicationConfig[]>(() => {
    try {
      const saved = localStorage.getItem('cryon_applications_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_APPLICATIONS;
  });

  // 7. Announcements
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(() => {
    try {
      const saved = localStorage.getItem('cryon_announcements_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_ANNOUNCEMENTS;
  });

  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'error'>('synced');
  const lastSyncTimestampRef = useRef<number>(0);
  const isSyncingRef = useRef<boolean>(false);

  // Sync state to backend server so EVERY member & device sees updates instantly
  const syncToServer = useCallback(async (overrides?: Record<string, any>) => {
    try {
      setSyncStatus('saving');
      const payload = {
        products,
        categories,
        serverConfig,
        rulesConfig,
        voteConfig,
        staffGroups,
        staffMembers,
        applications,
        announcements,
        ...overrides,
      };

      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.lastUpdated) {
          lastSyncTimestampRef.current = result.lastUpdated;
        }
        setSyncStatus('synced');
      } else {
        setSyncStatus('error');
      }
    } catch (err) {
      console.error('Failed to sync store state to server:', err);
      setSyncStatus('error');
    }
  }, [products, categories, serverConfig, rulesConfig, voteConfig, staffGroups, staffMembers, applications, announcements]);

  // Fetch full store data from server (called on load & periodic poll)
  const refreshFromServer = useCallback(async () => {
    if (isSyncingRef.current) return;
    try {
      isSyncingRef.current = true;
      const res = await fetch('/api/store?t=' + Date.now());
      if (!res.ok) return;
      const data = await res.json();

      // If server has updated data, hydrate it into state
      if (data && data.lastUpdated && data.lastUpdated > lastSyncTimestampRef.current) {
        lastSyncTimestampRef.current = data.lastUpdated;

        if (Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
          localStorage.setItem('cryon_store_products_v3', JSON.stringify(data.products));
        }
        if (Array.isArray(data.categories) && data.categories.length > 0) {
          setCategories(data.categories);
          localStorage.setItem('cryon_store_categories_v3', JSON.stringify(data.categories));
        }
        if (data.serverConfig && data.serverConfig.serverName) {
          setServerConfig(data.serverConfig);
          localStorage.setItem('cryon_server_config_v3', JSON.stringify(data.serverConfig));
        }
        if (Array.isArray(data.rulesConfig) && data.rulesConfig.length > 0) {
          setRulesConfig(data.rulesConfig);
          localStorage.setItem('cryon_rules_config_v3', JSON.stringify(data.rulesConfig));
        }
        if (data.voteConfig && data.voteConfig.voteSites) {
          setVoteConfig(data.voteConfig);
          localStorage.setItem('cryon_vote_config_v3', JSON.stringify(data.voteConfig));
        }
        if (Array.isArray(data.staffGroups) && data.staffGroups.length > 0) {
          setStaffGroups(data.staffGroups);
          localStorage.setItem('cryon_staff_groups_v3', JSON.stringify(data.staffGroups));
        }
        if (Array.isArray(data.staffMembers) && data.staffMembers.length > 0) {
          setStaffMembers(data.staffMembers);
          localStorage.setItem('cryon_staff_members_v3', JSON.stringify(data.staffMembers));
        }
        if (Array.isArray(data.applications) && data.applications.length > 0) {
          setApplications(data.applications);
          localStorage.setItem('cryon_applications_v3', JSON.stringify(data.applications));
        }
        if (Array.isArray(data.announcements) && data.announcements.length > 0) {
          setAnnouncements(data.announcements);
          localStorage.setItem('cryon_announcements_v3', JSON.stringify(data.announcements));
        }
        setSyncStatus('synced');
      } else if (data && (!data.products || data.products.length === 0)) {
        // Seed server with initial products if server is fresh
        syncToServer();
      }
    } catch (err) {
      console.warn('Could not fetch store from server:', err);
    } finally {
      isSyncingRef.current = false;
    }
  }, [syncToServer]);

  // Initial fetch and polling every 5 seconds so changes on admin appear for all members
  useEffect(() => {
    refreshFromServer();

    const interval = setInterval(() => {
      refreshFromServer();
    }, 5000);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        refreshFromServer();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [refreshFromServer]);

  // Image upload helper that turns local base64/files into permanent shared static URLs
  const uploadImage = async (imageStr: string, filename?: string): Promise<string> => {
    if (!imageStr) return '/cryon-logo.png';
    // If it's already a server URL or external http URL, keep as is
    if (!imageStr.startsWith('data:')) {
      return imageStr;
    }

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageStr,
          filename: filename || 'upload',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          return data.url;
        }
      }
    } catch (err) {
      console.error('Failed to upload image to server:', err);
    }
    return imageStr;
  };

  // LocalStorage synchronizations as offline fallback
  useEffect(() => {
    localStorage.setItem('cryon_store_products_v3', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('cryon_store_categories_v3', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('cryon_server_config_v3', JSON.stringify(serverConfig));
  }, [serverConfig]);

  useEffect(() => {
    localStorage.setItem('cryon_rules_config_v3', JSON.stringify(rulesConfig));
  }, [rulesConfig]);

  useEffect(() => {
    localStorage.setItem('cryon_vote_config_v3', JSON.stringify(voteConfig));
  }, [voteConfig]);

  useEffect(() => {
    localStorage.setItem('cryon_staff_groups_v3', JSON.stringify(staffGroups));
  }, [staffGroups]);

  useEffect(() => {
    localStorage.setItem('cryon_staff_members_v3', JSON.stringify(staffMembers));
  }, [staffMembers]);

  useEffect(() => {
    localStorage.setItem('cryon_applications_v3', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('cryon_announcements_v3', JSON.stringify(announcements));
  }, [announcements]);

  // Methods with immediate Server Sync
  const updateServerConfig = (updates: Partial<ServerConfig>) => {
    const updated = { ...serverConfig, ...updates };
    setServerConfig(updated);
    syncToServer({ serverConfig: updated });
  };

  // Category methods
  const addCategory = (cat: CategoryInfo) => {
    setCategories((prev) => {
      let next: CategoryInfo[];
      if (prev.some((c) => c.slug.toLowerCase() === cat.slug.toLowerCase())) {
        next = prev.map((c) => (c.slug.toLowerCase() === cat.slug.toLowerCase() ? cat : c));
      } else {
        next = [...prev, cat];
      }
      syncToServer({ categories: next });
      return next;
    });
  };

  const updateCategory = (slug: string, updates: Partial<CategoryInfo>) => {
    setCategories((prev) => {
      const next = prev.map((c) => (c.slug === slug ? { ...c, ...updates } : c));
      syncToServer({ categories: next });
      return next;
    });
  };

  const deleteCategory = (slug: string) => {
    setCategories((prev) => {
      const next = prev.filter((c) => c.slug !== slug);
      syncToServer({ categories: next });
      return next;
    });
  };

  const addProduct = (item: Omit<Product, 'id' | 'slug'>): Product => {
    const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newProd: Product = {
      ...item,
      id: `prod_${Date.now()}`,
      slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
      inStock: item.inStock ?? true,
    };

    let nextCategories = categories;
    if (item.category) {
      const exists = categories.some((c) => c.slug.toLowerCase() === item.category.toLowerCase());
      if (!exists) {
        const formattedName = item.category.toUpperCase();
        const newCat: CategoryInfo = {
          slug: item.category.toLowerCase(),
          name: formattedName,
          iconName: 'Package',
          description: `Exclusive ${formattedName} packages for ${serverConfig.serverName}`,
          itemCount: 1,
          gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
          accentColor: item.color || '#06b6d4',
        };
        nextCategories = [...categories, newCat];
        setCategories(nextCategories);
      }
    }

    const nextProducts = [newProd, ...products];
    setProducts(nextProducts);
    syncToServer({ products: nextProducts, categories: nextCategories });
    return newProd;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      syncToServer({ products: next });
      return next;
    });
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => {
      const next = prev.filter((p) => p.id !== id);
      syncToServer({ products: next });
      return next;
    });
  };

  const getProductById = (id: string) => products.find((p) => p.id === id);
  const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug || p.id === slug);

  const getProductsByCategory = (category: ProductCategory) =>
    products.filter((p) => p.category === category);

  const featuredProducts = products.filter((p) => p.featured);

  // Rules methods
  const updateRulesCategory = (id: string, updates: Partial<RuleCategoryConfig>) => {
    setRulesConfig((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
      syncToServer({ rulesConfig: next });
      return next;
    });
  };

  const addRuleItem = (catId: string, item: Omit<RuleItem, 'id'>) => {
    setRulesConfig((prev) => {
      const next = prev.map((c) => {
        if (c.id !== catId) return c;
        const newRule: RuleItem = {
          ...item,
          id: `r_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        };
        return { ...c, rules: [...c.rules, newRule] };
      });
      syncToServer({ rulesConfig: next });
      return next;
    });
  };

  const updateRuleItem = (catId: string, ruleId: string, updates: Partial<RuleItem>) => {
    setRulesConfig((prev) => {
      const next = prev.map((c) => {
        if (c.id !== catId) return c;
        return {
          ...c,
          rules: c.rules.map((r) => (r.id === ruleId ? { ...r, ...updates } : r)),
        };
      });
      syncToServer({ rulesConfig: next });
      return next;
    });
  };

  const deleteRuleItem = (catId: string, ruleId: string) => {
    setRulesConfig((prev) => {
      const next = prev.map((c) => {
        if (c.id !== catId) return c;
        return {
          ...c,
          rules: c.rules.filter((r) => r.id !== ruleId),
        };
      });
      syncToServer({ rulesConfig: next });
      return next;
    });
  };

  const addRulesCategory = (category: RuleCategoryConfig) => {
    setRulesConfig((prev) => {
      const next = [...prev, category];
      syncToServer({ rulesConfig: next });
      return next;
    });
  };

  const deleteRulesCategory = (id: string) => {
    setRulesConfig((prev) => {
      const next = prev.filter((c) => c.id !== id);
      syncToServer({ rulesConfig: next });
      return next;
    });
  };

  // Vote methods
  const updateVoteConfig = (updates: Partial<VoteConfig>) => {
    const updated = { ...voteConfig, ...updates };
    setVoteConfig(updated);
    syncToServer({ voteConfig: updated });
  };

  const addVoteSite = (site: Omit<VoteSiteConfig, 'id'>) => {
    setVoteConfig((prev) => {
      const next = {
        ...prev,
        voteSites: [
          ...prev.voteSites,
          { ...site, id: (prev.voteSites.length ? Math.max(...prev.voteSites.map((v) => v.id)) : 0) + 1 },
        ],
      };
      syncToServer({ voteConfig: next });
      return next;
    });
  };

  const updateVoteSite = (id: number, updates: Partial<VoteSiteConfig>) => {
    setVoteConfig((prev) => {
      const next = {
        ...prev,
        voteSites: prev.voteSites.map((s) => (s.id === id ? { ...s, ...updates } : s)),
      };
      syncToServer({ voteConfig: next });
      return next;
    });
  };

  const deleteVoteSite = (id: number) => {
    setVoteConfig((prev) => {
      const next = {
        ...prev,
        voteSites: prev.voteSites.filter((s) => s.id !== id),
      };
      syncToServer({ voteConfig: next });
      return next;
    });
  };

  // Staff methods
  const addStaffGroup = (group: StaffGroupConfig) => {
    setStaffGroups((prev) => {
      const next = [...prev, group];
      syncToServer({ staffGroups: next });
      return next;
    });
  };

  const updateStaffGroup = (id: string, updates: Partial<StaffGroupConfig>) => {
    setStaffGroups((prev) => {
      const next = prev.map((g) => (g.id === id ? { ...g, ...updates } : g));
      syncToServer({ staffGroups: next });
      return next;
    });
  };

  const deleteStaffGroup = (id: string) => {
    const nextGroups = staffGroups.filter((g) => g.id !== id);
    const nextMembers = staffMembers.filter((m) => m.groupId !== id);
    setStaffGroups(nextGroups);
    setStaffMembers(nextMembers);
    syncToServer({ staffGroups: nextGroups, staffMembers: nextMembers });
  };

  const addStaffMember = (member: Omit<StaffMemberConfig, 'id'>) => {
    const newMember: StaffMemberConfig = {
      ...member,
      id: `sm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    const nextMembers = [...staffMembers, newMember];
    setStaffMembers(nextMembers);
    syncToServer({ staffMembers: nextMembers });
  };

  const updateStaffMember = (id: string, updates: Partial<StaffMemberConfig>) => {
    setStaffMembers((prev) => {
      const next = prev.map((m) => (m.id === id ? { ...m, ...updates } : m));
      syncToServer({ staffMembers: next });
      return next;
    });
  };

  const deleteStaffMember = (id: string) => {
    setStaffMembers((prev) => {
      const next = prev.filter((m) => m.id !== id);
      syncToServer({ staffMembers: next });
      return next;
    });
  };

  // Application methods
  const addApplication = (app: ApplicationConfig) => {
    setApplications((prev) => {
      const next = [...prev, app];
      syncToServer({ applications: next });
      return next;
    });
  };

  const updateApplication = (id: string, updates: Partial<ApplicationConfig>) => {
    setApplications((prev) => {
      const next = prev.map((a) => (a.id === id ? { ...a, ...updates } : a));
      syncToServer({ applications: next });
      return next;
    });
  };

  const deleteApplication = (id: string) => {
    setApplications((prev) => {
      const next = prev.filter((a) => a.id !== id);
      syncToServer({ applications: next });
      return next;
    });
  };

  // Announcement methods
  const addAnnouncement = (ann: Omit<AnnouncementItem, 'id'>) => {
    const newAnn: AnnouncementItem = {
      ...ann,
      id: `ann_${Date.now()}`,
    };
    const next = [newAnn, ...announcements];
    setAnnouncements(next);
    syncToServer({ announcements: next });
  };

  const updateAnnouncement = (id: string, updates: Partial<AnnouncementItem>) => {
    setAnnouncements((prev) => {
      const next = prev.map((a) => (a.id === id ? { ...a, ...updates } : a));
      syncToServer({ announcements: next });
      return next;
    });
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => {
      const next = prev.filter((a) => a.id !== id);
      syncToServer({ announcements: next });
      return next;
    });
  };

  // Reset to defaults
  const resetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setServerConfig(DEFAULT_SERVER_CONFIG);
    setRulesConfig(DEFAULT_RULES_CONFIG);
    setVoteConfig(DEFAULT_VOTE_CONFIG);
    setStaffGroups(DEFAULT_STAFF_GROUPS);
    setStaffMembers(DEFAULT_STAFF_MEMBERS);
    setApplications(DEFAULT_APPLICATIONS);
    setAnnouncements(DEFAULT_ANNOUNCEMENTS);
    localStorage.removeItem('cryon_store_products_v3');
    localStorage.removeItem('cryon_server_config_v3');
    localStorage.removeItem('cryon_rules_config_v3');
    localStorage.removeItem('cryon_vote_config_v3');
    localStorage.removeItem('cryon_staff_groups_v3');
    localStorage.removeItem('cryon_staff_members_v3');
    localStorage.removeItem('cryon_applications_v3');
    localStorage.removeItem('cryon_announcements_v3');
    localStorage.removeItem('cryon_store_categories_v3');

    fetch('/api/store/reset', { method: 'POST' }).catch((err) =>
      console.error('Reset error:', err)
    );
  };

  // Provide categories with dynamic item counts matching current products catalog
  const dynamicCategories = categories.map((cat) => ({
    ...cat,
    itemCount: products.filter(
      (p) => p.category.toLowerCase() === cat.slug.toLowerCase()
    ).length,
  }));

  return (
    <ProductsContext.Provider
      value={{
        products,
        categories: dynamicCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        getProductBySlug,
        getProductsByCategory,
        featuredProducts,

        serverConfig,
        updateServerConfig,

        rulesConfig,
        updateRulesCategory,
        addRuleItem,
        updateRuleItem,
        deleteRuleItem,
        addRulesCategory,
        deleteRulesCategory,

        voteConfig,
        updateVoteConfig,
        addVoteSite,
        updateVoteSite,
        deleteVoteSite,

        staffGroups,
        staffMembers,
        addStaffGroup,
        updateStaffGroup,
        deleteStaffGroup,
        addStaffMember,
        updateStaffMember,
        deleteStaffMember,

        applications,
        addApplication,
        updateApplication,
        deleteApplication,

        announcements,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,

        uploadImage,
        syncStatus,
        refreshFromServer,

        resetToDefaults,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};
