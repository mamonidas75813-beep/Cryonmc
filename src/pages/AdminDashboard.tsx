import React, { useState } from 'react';
import {
  Sliders,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Package,
  Server,
  ShoppingBag,
  DollarSign,
  Users,
  Sparkles,
  RefreshCw,
  Search,
  BookOpen,
  Vote,
  Shield,
  FileText,
  Megaphone,
  Eye,
  EyeOff,
  ExternalLink,
  Save,
  Lock,
  KeyRound,
  LogOut,
  ArrowLeft,
  ShieldAlert,
  UserCheck,
  Upload,
  Image as ImageIcon,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Key,
  Coins,
  Crown,
  Tag,
  Filter,
} from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { useAuth } from '../context/AuthContext';
import {
  Product,
  ProductCategory,
  CategoryInfo,
  Order,
  OrderStatus,
  RuleCategoryConfig,
  RuleItem,
  VoteSiteConfig,
  StaffGroupConfig,
  StaffMemberConfig,
  ApplicationConfig,
  AnnouncementItem,
} from '../types';

interface AdminDashboardProps {
  onShowToast: (msg: string) => void;
  navigate?: (path: string) => void;
}

type AdminTab =
  | 'branding'
  | 'rules'
  | 'vote'
  | 'staff'
  | 'apply'
  | 'news'
  | 'products'
  | 'orders'
  | 'security';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onShowToast,
  navigate,
}) => {
  // --- ADMIN AUTHENTICATION STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('cryon_admin_session') === 'true';
  });

  const DEFAULT_ADMIN_CREDS = {
    username: 'cryonmc@1@1',
    password: 'cryon@1!',
  };

  const [adminCreds, setAdminCreds] = useState<{ username: string; password: string }>(() => {
    try {
      const saved = localStorage.getItem('cryon_admin_creds');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.username && parsed.password) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_ADMIN_CREDS;
  });

  // Login Form States
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Security Credentials Form States (Inside dashboard)
  const [newAdminUser, setNewAdminUser] = useState(adminCreds.username);
  const [newAdminPass, setNewAdminPass] = useState(adminCreds.password);
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  const {
    products,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    addProduct,
    updateProduct,
    deleteProduct,
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
    resetToDefaults,
    uploadImage,
    syncStatus,
    refreshFromServer,
  } = useProducts();

  const { orders, updateOrderStatus, sendAndCompleteOrder, deleteOrder } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('branding');

  // --- BRANDING STATE ---
  const [cfg, setCfg] = useState({ ...serverConfig });

  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalLogo = cfg.logoUrl;
    let finalBg = cfg.bgUrl;
    if (finalLogo && finalLogo.startsWith('data:')) {
      finalLogo = await uploadImage(finalLogo, 'cryon_logo');
    }
    if (finalBg && finalBg.startsWith('data:')) {
      finalBg = await uploadImage(finalBg, 'cryon_bg');
    }
    const updated = { ...cfg, logoUrl: finalLogo, bgUrl: finalBg };
    setCfg(updated);
    updateServerConfig(updated);
    onShowToast('Server branding & logo saved! All members and link visitors will now see the new logo.');
  };

  // --- RULES MODALS & FORMS ---
  const [selectedRuleCat, setSelectedRuleCat] = useState<string>(rulesConfig[0]?.id || 'home');
  const [editingRule, setEditingRule] = useState<{ catId: string; item: RuleItem } | null>(null);
  const [newRuleText, setNewRuleText] = useState('');
  const [newRuleTag, setNewRuleTag] = useState('');
  const [newRuleTagColor, setNewRuleTagColor] = useState<'green' | 'red' | 'yellow' | 'cyan'>('green');
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);

  // --- VOTE FORM STATE ---
  const [voteForm, setVoteForm] = useState({
    title: voteConfig.title,
    subtitle: voteConfig.subtitle,
    rewardNotice: voteConfig.rewardNotice,
  });
  const [editingVoteSite, setEditingVoteSite] = useState<VoteSiteConfig | null>(null);

  // --- STAFF FORM STATE ---
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [staffUsername, setStaffUsername] = useState('');
  const [staffRole, setStaffRole] = useState('');
  const [staffGroupId, setStaffGroupId] = useState(staffGroups[0]?.id || 'owner');
  const [staffBadge, setStaffBadge] = useState('');

  // --- APPLICATION FORM STATE ---
  const [editingApp, setEditingApp] = useState<ApplicationConfig | null>(null);

  // --- ANNOUNCEMENT FORM STATE ---
  const [showAddAnnModal, setShowAddAnnModal] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annAuthor, setAnnAuthor] = useState('Admin');
  const [annDate, setAnnDate] = useState('Just now');
  const [annContent, setAnnContent] = useState('');

  // --- PRODUCT FORM STATE & MANAGEMENT ---
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form fields for Add/Edit Product
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<string>('ranks');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCatInput, setCustomCatInput] = useState('');
  const [prodPriceUSD, setProdPriceUSD] = useState<number>(9.99);
  const [prodPriceINR, setProdPriceINR] = useState<number>(499);
  const [prodPricePKR, setProdPricePKR] = useState<number>(1500);
  const [prodImage, setProdImage] = useState<string>('/cryon-logo.png');
  const [prodBadge, setProdBadge] = useState<string>('');
  const [prodTier, setProdTier] = useState<string>('');
  const [prodShortDesc, setProdShortDesc] = useState<string>('');
  const [prodPerksText, setProdPerksText] = useState<string>('');
  const [prodColor, setProdColor] = useState<string>('#06b6d4');

  // Custom Category Creation Modal
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatColor, setNewCatColor] = useState('#06b6d4');

  // --- ORDERS FORM STATE & MANAGEMENT ---
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');
  const [viewingProofOrder, setViewingProofOrder] = useState<Order | null>(null);

  // Open modal to add a brand new product
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdName('');
    setProdCategory('ranks');
    setIsCustomCategory(false);
    setCustomCatInput('');
    setProdPriceUSD(9.99);
    setProdPriceINR(499);
    setProdPricePKR(1500);
    setProdImage('/cryon-logo.png');
    setProdBadge('');
    setProdTier('');
    setProdShortDesc('');
    setProdPerksText('');
    setProdColor('#06b6d4');
    setShowProductModal(true);
  };

  // Open modal to edit existing product
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdCategory(prod.category);
    setIsCustomCategory(false);
    setCustomCatInput('');
    setProdPriceUSD(prod.priceUSD);
    setProdPriceINR(prod.priceINR || Math.round(prod.priceUSD * 86.5));
    setProdPricePKR(prod.pricePKR || Math.round(prod.priceUSD * 278));
    setProdImage(prod.image || '/cryon-logo.png');
    setProdBadge(prod.badge || '');
    setProdTier(prod.tierRank || '');
    setProdShortDesc(prod.shortDesc || '');
    setProdPerksText(prod.perks ? prod.perks.join('\n') : '');
    setProdColor(prod.color || '#06b6d4');
    setShowProductModal(true);
  };

  // Handle local image file upload for product photo
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onShowToast('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        onShowToast('Uploading photo to server...');
        const uploadedUrl = await uploadImage(reader.result, 'prod_' + Date.now());
        setProdImage(uploadedUrl);
        onShowToast('Product photo uploaded & synced to server!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle local file upload for Home Page / Website Logo
  const handleLogoImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onShowToast('Please select a valid image file (PNG, JPG, SVG, WEBP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        onShowToast('Uploading logo to server...');
        const uploadedUrl = await uploadImage(reader.result, 'cryon_logo');
        setCfg((prev) => ({ ...prev, logoUrl: uploadedUrl }));
        updateServerConfig({ logoUrl: uploadedUrl });
        onShowToast('Home Page Logo updated & synced to server! All members can see it now.');
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle local file upload for Hero Background Banner
  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onShowToast('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        onShowToast('Uploading background to server...');
        const uploadedUrl = await uploadImage(reader.result, 'cryon_bg');
        setCfg((prev) => ({ ...prev, bgUrl: uploadedUrl }));
        updateServerConfig({ bgUrl: uploadedUrl });
        onShowToast('Hero background image updated & synced to server!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Save product (Add or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) {
      onShowToast('Product name is required');
      return;
    }

    let finalImage = prodImage || '/cryon-logo.png';
    if (finalImage.startsWith('data:')) {
      onShowToast('Saving product photo to server...');
      finalImage = await uploadImage(finalImage, 'prod_' + Date.now());
    }

    const targetCategory = isCustomCategory
      ? (customCatInput.trim().toLowerCase() || 'other')
      : prodCategory;

    const perksArray = prodPerksText
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: prodName.trim(),
        category: targetCategory,
        priceUSD: Number(prodPriceUSD) || 0,
        priceINR: Number(prodPriceINR) || undefined,
        pricePKR: Number(prodPricePKR) || undefined,
        image: finalImage,
        badge: prodBadge.trim() || undefined,
        tierRank: prodTier.trim() || undefined,
        shortDesc: prodShortDesc.trim() || `Exclusive ${prodName} package`,
        perks: perksArray.length ? perksArray : ['Full server realm access', 'Instant in-game delivery'],
        color: prodColor,
      });
      onShowToast(`Product "${prodName}" updated successfully and broadcasted to all users!`);
    } else {
      addProduct({
        name: prodName.trim(),
        category: targetCategory,
        priceUSD: Number(prodPriceUSD) || 0,
        priceINR: Number(prodPriceINR) || undefined,
        pricePKR: Number(prodPricePKR) || undefined,
        image: finalImage,
        badge: prodBadge.trim() || undefined,
        tierRank: prodTier.trim() || undefined,
        shortDesc: prodShortDesc.trim() || `Exclusive ${prodName} package`,
        fullDesc: prodShortDesc.trim() || `Unlock ${prodName} instantly on CryonMC network.`,
        perks: perksArray.length ? perksArray : ['Full server realm access', 'Instant in-game delivery'],
        color: prodColor,
      });
      onShowToast(`New product "${prodName}" added! Visible to all players visiting link.`);
    }

    setShowProductModal(false);
  };

  // Save new category
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      onShowToast('Category name is required');
      return;
    }

    const slug = (newCatSlug.trim() || newCatName.trim().toLowerCase()).replace(/[^a-z0-9]+/g, '-');
    addCategory({
      slug,
      name: newCatName.trim().toUpperCase(),
      iconName: 'Package',
      description: newCatDesc.trim() || `${newCatName.trim()} packages and perks for CryonMC.`,
      itemCount: 0,
      gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
      accentColor: newCatColor,
    });

    onShowToast(`New category "${newCatName.toUpperCase()}" created!`);
    setShowAddCategoryModal(false);
    setNewCatName('');
    setNewCatSlug('');
    setNewCatDesc('');
  };

  const activeRuleCat = rulesConfig.find((c) => c.id === selectedRuleCat) || rulesConfig[0];

  // --- LOGIN SUBMISSION ---
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const trimmedUser = loginUser.trim().toLowerCase();
    const trimmedPass = loginPass.trim();

    // Verify against user's requested credentials cryonmc@1@1 and cryon@1! or custom saved credentials
    const isUserValid =
      trimmedUser === 'cryonmc@1@1' ||
      trimmedUser === adminCreds.username.toLowerCase();

    const isPassValid =
      trimmedPass === 'cryon@1!' ||
      trimmedPass === adminCreds.password;

    if (isUserValid && isPassValid) {
      if (rememberMe) {
        localStorage.setItem('cryon_admin_session', 'true');
      } else {
        sessionStorage.setItem('cryon_admin_session', 'true');
      }
      setIsAuthenticated(true);
      onShowToast(`Welcome back, ${loginUser}! Admin Console unlocked.`);
    } else {
      setLoginError('Incorrect Administrator Username or Passkey. Please verify your credentials.');
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('cryon_admin_session');
    sessionStorage.removeItem('cryon_admin_session');
    setIsAuthenticated(false);
    setLoginUser('');
    setLoginPass('');
    setLoginError('');
    onShowToast('Successfully logged out of the Admin Console.');
    if (navigate) {
      navigate('/admin');
    }
  };

  const handleUpdateCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminUser.trim() || !newAdminPass.trim()) {
      onShowToast('Username and password cannot be empty.');
      return;
    }

    const updated = { username: newAdminUser.trim(), password: newAdminPass.trim() };
    setAdminCreds(updated);
    localStorage.setItem('cryon_admin_creds', JSON.stringify(updated));
    setShowSecurityModal(false);
    onShowToast('Admin login credentials updated successfully!');
  };

  // --- SCREEN 1: ADMIN LOGIN GATEWAY (If not authenticated) ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#080b11] text-slate-200 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
        {/* Background ambient radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-md bg-[#0b101c]/95 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl space-y-6">
          
          {/* Top Logo & Title */}
          <div className="text-center space-y-3">
            <div className="w-24 h-24 mx-auto relative group flex items-center justify-center">
              <div className="absolute inset-0 bg-red-600/20 rounded-full blur-xl group-hover:bg-red-600/40 transition-all duration-300" />
              <img
                src={serverConfig.logoUrl || '/cryon-logo.png'}
                alt={serverConfig.serverName}
                className="w-20 h-20 object-contain drop-shadow-[0_4px_15px_rgba(239,68,68,0.5)] select-none relative"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/cryon-logo.png';
                }}
              />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/30 text-[10px] font-mono font-bold tracking-widest uppercase text-red-400">
              <Lock className="w-3 h-3 text-red-400" />
              <span>Restricted Executive Gateway</span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black font-['Rajdhani'] uppercase tracking-wider text-white">
                Admin Console Login
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Enter your staff credentials to access {serverConfig.serverName} settings, rules, and store configuration.
              </p>
            </div>
          </div>

          {/* Error Message */}
          {loginError && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 flex items-center gap-2.5 text-xs text-red-300 animate-in fade-in">
              <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase font-mono mb-1.5">
                Staff Username / IGN
              </label>
              <div className="relative flex items-center">
                <input
                  required
                  type="text"
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  placeholder="e.g. admin"
                  className="w-full bg-[#070b14] border border-slate-800 focus:border-red-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase font-mono mb-1.5">
                Secret Passkey / Password
              </label>
              <div className="relative flex items-center">
                <input
                  required
                  type={showPass ? 'text' : 'password'}
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#070b14] border border-slate-800 focus:border-red-500 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-800 bg-[#070b14] text-red-600 focus:ring-0"
                />
                <span className="text-[11px]">Remember session</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black font-['Rajdhani'] uppercase tracking-wider text-sm flex items-center justify-center gap-2 transition-all shadow-[0_4px_20px_rgba(239,68,68,0.4)] hover:scale-[1.02]"
            >
              <KeyRound className="w-4 h-4" />
              <span>Unlock Admin Console</span>
            </button>
          </form>

          {/* Back to Home Button */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => {
                if (navigate) navigate('/');
                else window.location.href = '/';
              }}
              className="text-xs text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5 mx-auto font-['Rajdhani'] uppercase font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // --- SCREEN 2: AUTHENTICATED ADMIN DASHBOARD ---
  return (
    <div className="min-h-screen bg-[#080b11] text-slate-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0b101c] p-6 rounded-2xl border border-white/5 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-400 font-mono tracking-widest uppercase">
              <Sliders className="w-4 h-4 text-red-500" />
              <span>Network Control Panel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-['Rajdhani'] uppercase tracking-wider text-white mt-1">
              Configuration Console
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure every element of {serverConfig.serverName}: branding, rules, vote links, staff team, recruitment, news, and store ranks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Authenticated Staff Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Admin: {adminCreds.username}</span>
            </div>

            {/* Change Password Modal Button */}
            <button
              onClick={() => setShowSecurityModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold font-['Rajdhani'] uppercase transition-colors"
              title="Change admin login password"
            >
              <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
              <span>Security</span>
            </button>

            {/* Reset Defaults Button */}
            <button
              onClick={() => {
                resetToDefaults();
                setCfg({ ...serverConfig });
                onShowToast('Successfully reset network configuration to CryonMC defaults!');
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs font-bold font-['Rajdhani'] uppercase transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleAdminLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/40 border border-red-500/40 text-red-300 hover:text-white text-xs font-bold font-['Rajdhani'] uppercase transition-colors"
              title="Logout from admin session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-white/5">
          {[
            { id: 'branding' as AdminTab, label: '⚙️ Branding & Network', icon: Server },
            { id: 'rules' as AdminTab, label: '⚖️ Server Rules', icon: BookOpen },
            { id: 'vote' as AdminTab, label: '🗳️ Vote Sites', icon: Vote },
            { id: 'staff' as AdminTab, label: '🛡️ Staff Team', icon: Shield },
            { id: 'apply' as AdminTab, label: '📝 Recruitment / Apply', icon: FileText },
            { id: 'news' as AdminTab, label: '📢 Announcements', icon: Megaphone },
            { id: 'products' as AdminTab, label: '💎 Store & Ranks', icon: ShoppingBag },
            { id: 'orders' as AdminTab, label: '📦 Orders Log', icon: Package },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-['Rajdhani'] uppercase tracking-wider whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-red-600 text-white border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                    : 'bg-[#0d1322] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: BRANDING & NETWORK */}
        {activeTab === 'branding' && (
          <form onSubmit={handleSaveBranding} className="bg-[#0b101c] p-6 sm:p-8 rounded-2xl border border-white/5 shadow-xl space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h2 className="text-xl font-bold font-['Rajdhani'] uppercase text-white">
                Server Identity & Global Connections
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                These settings update the hero banner, copy buttons, Discord link, and footers across all pages.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase font-mono mb-1">
                  Server Name
                </label>
                <input
                  type="text"
                  value={cfg.serverName}
                  onChange={(e) => setCfg({ ...cfg, serverName: e.target.value })}
                  className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase font-mono mb-1">
                  Java Server IP
                </label>
                <input
                  type="text"
                  value={cfg.serverIp}
                  onChange={(e) => setCfg({ ...cfg, serverIp: e.target.value })}
                  className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase font-mono mb-1">
                  Bedrock Port
                </label>
                <input
                  type="number"
                  value={cfg.bedrockPort}
                  onChange={(e) => setCfg({ ...cfg, bedrockPort: Number(e.target.value) || 19132 })}
                  className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase font-mono mb-1">
                  Online Players Counter
                </label>
                <input
                  type="number"
                  value={cfg.currentOnline}
                  onChange={(e) => setCfg({ ...cfg, currentOnline: Number(e.target.value) || 1040 })}
                  className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase font-mono mb-1">
                  Discord Users Online
                </label>
                <input
                  type="number"
                  value={cfg.discordUsersOnline}
                  onChange={(e) => setCfg({ ...cfg, discordUsersOnline: Number(e.target.value) || 4647 })}
                  className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase font-mono mb-1">
                  Discord Invite URL
                </label>
                <input
                  type="text"
                  value={cfg.discordUrl}
                  onChange={(e) => setCfg({ ...cfg, discordUrl: e.target.value })}
                  className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  required
                />
              </div>
            </div>

            {/* DEDICATED SECTION 1: HOME PAGE & GLOBAL LOGO CONFIGURATION */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#070b14] border border-cyan-500/20 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-['Rajdhani'] uppercase tracking-wider text-white">
                      Home Page &amp; Website Logo Configuration
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Change the main 3D logo displayed on the home page hero banner, top navigation bar, and footer.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                    Active Logo Preview
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                {/* Visual Live Preview of Home Page Logo */}
                <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-[#05080f] border border-slate-800/80 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-radial-gradient from-cyan-500/20 via-blue-500/5 to-transparent blur-xl pointer-events-none" />
                  
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-blue-500/20 to-indigo-500/30 rounded-full blur-xl animate-pulse pointer-events-none" />
                    <img
                      src={cfg.logoUrl || '/cryon-logo.png'}
                      alt="Logo Live Preview"
                      className="w-full h-full object-contain filter drop-shadow-[0_8px_20px_rgba(6,182,212,0.6)] group-hover:scale-105 transition-transform duration-300 select-none relative z-10"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/cryon-logo.png';
                      }}
                    />
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 mt-2 block">
                    {cfg.serverName} Logo (Hero &amp; Navbar)
                  </span>
                </div>

                {/* Upload & Controls */}
                <div className="lg:col-span-8 space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Device Upload Button */}
                    <label className="border border-dashed border-cyan-500/40 hover:border-cyan-400 rounded-xl p-3 flex items-center gap-3 cursor-pointer bg-cyan-950/20 hover:bg-cyan-950/40 transition-all">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoImageUpload}
                        className="hidden"
                      />
                      <Upload className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-white block">
                          Upload Custom Logo Photo
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          PNG, JPG, WEBP, SVG (Device file)
                        </span>
                      </div>
                    </label>

                    {/* Image URL Input */}
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                        Or Paste Custom Logo URL:
                      </label>
                      <input
                        type="text"
                        value={cfg.logoUrl}
                        onChange={(e) => setCfg({ ...cfg, logoUrl: e.target.value })}
                        placeholder="https://... or /cryon-logo.png"
                        className="w-full bg-[#05080f] border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Preset Logos */}
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1.5">
                      Quick Preset Logos:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setCfg({ ...cfg, logoUrl: '/cryon-logo.png' })}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                          cfg.logoUrl === '/cryon-logo.png'
                            ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        <span>👑 Cryon Crest (Official)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCfg({ ...cfg, logoUrl: '/etheria-logo.jpg' })}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                          cfg.logoUrl === '/etheria-logo.jpg'
                            ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        <span>🍎 Etheria Style</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCfg({ ...cfg, logoUrl: '/crate-keys.jpg' })}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                          cfg.logoUrl === '/crate-keys.jpg'
                            ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        <span>🔑 Mystical Keys</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCfg({ ...cfg, logoUrl: '/gold-coins.jpg' })}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                          cfg.logoUrl === '/gold-coins.jpg'
                            ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        <span>🪙 Gold Coins</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* DEDICATED SECTION 2: UPI PAYMENT & STORE QR SETTINGS */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#070b14] border border-emerald-500/20 space-y-4">
              <div className="flex items-center gap-2.5 border-b border-white/5 pb-3">
                <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-['Rajdhani'] uppercase tracking-wider text-white">
                    Store UPI &amp; QR Payment Gateway Settings
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Configure your UPI ID and Payee Name for instantaneous QR payments on the store checkout page.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase font-mono mb-1">
                    Store UPI ID (VPA) *
                  </label>
                  <input
                    type="text"
                    value={cfg.upiId || 'cryonmc@upi'}
                    onChange={(e) => setCfg({ ...cfg, upiId: e.target.value })}
                    placeholder="e.g. cryonmc@upi or yourname@okhdfcbank"
                    className="w-full bg-[#05080f] border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-emerald-400 font-mono font-bold"
                    required
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Players will scan a QR code pointing directly to this UPI address.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase font-mono mb-1">
                    UPI Payee Name / Business Name *
                  </label>
                  <input
                    type="text"
                    value={cfg.upiName || 'CryonMC Network'}
                    onChange={(e) => setCfg({ ...cfg, upiName: e.target.value })}
                    placeholder="e.g. CryonMC Network"
                    className="w-full bg-[#05080f] border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                    required
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Receiver name displayed in Google Pay, PhonePe, and Paytm apps.
                  </span>
                </div>
              </div>
            </div>

            {/* DEDICATED SECTION 3: HERO BANNER & GENERAL CONFIGURATION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase font-mono mb-1">
                  Support Email
                </label>
                <input
                  type="email"
                  value={cfg.supportEmail}
                  onChange={(e) => setCfg({ ...cfg, supportEmail: e.target.value })}
                  className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase font-mono mb-1">
                  Hero Background Image (Winter Village / Arena)
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <label className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-cyan-400 font-mono font-bold hover:bg-slate-800 cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBgImageUpload}
                      className="hidden"
                    />
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Banner</span>
                  </label>
                  <input
                    type="text"
                    value={cfg.bgUrl}
                    onChange={(e) => setCfg({ ...cfg, bgUrl: e.target.value })}
                    placeholder="/cryon-bg.jpg or image URL"
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setCfg({ ...cfg, bgUrl: '/cryon-bg.jpg' })}
                    className="px-2.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-[10px] text-cyan-400 font-mono font-bold whitespace-nowrap hover:bg-slate-800"
                  >
                    Winter Village
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase font-mono mb-1">
                Store Tagline
              </label>
              <input
                type="text"
                value={cfg.storeTagline}
                onChange={(e) => setCfg({ ...cfg, storeTagline: e.target.value })}
                className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold font-['Rajdhani'] uppercase tracking-wider text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
              >
                <Save className="w-4 h-4" />
                <span>Save Branding Settings</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: RULES MANAGEMENT */}
        {activeTab === 'rules' && (
          <div className="bg-[#0b101c] p-6 sm:p-8 rounded-2xl border border-white/5 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
              <div>
                <h2 className="text-xl font-bold font-['Rajdhani'] uppercase text-white">
                  Server Rules Configuration
                </h2>
                <p className="text-xs text-slate-400">
                  Manage categories (Home, Minecraft, Discord), edit intro descriptions, and add/edit rules with highlighted conditions.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddRuleModal(true)}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold font-['Rajdhani'] uppercase text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Rule</span>
                </button>
              </div>
            </div>

            {/* Category Switcher */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {rulesConfig.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedRuleCat(c.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-['Rajdhani'] uppercase tracking-wider border transition-all ${
                    selectedRuleCat === c.id
                      ? 'bg-[#151c2e] text-red-400 border-red-500'
                      : 'bg-[#0d1322] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {c.name} ({c.rules.length})
                </button>
              ))}
            </div>

            {/* Category Header Edit */}
            {activeRuleCat && (
              <div className="bg-[#070b14] p-4 rounded-xl border border-slate-800/80 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase font-mono mb-1">
                      Category Display Title
                    </label>
                    <input
                      type="text"
                      value={activeRuleCat.title}
                      onChange={(e) => updateRulesCategory(activeRuleCat.id, { title: e.target.value })}
                      className="w-full bg-[#0b101c] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  {activeRuleCat.lastUpdated !== undefined && (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase font-mono mb-1">
                        Last Updated Date
                      </label>
                      <input
                        type="text"
                        value={activeRuleCat.lastUpdated}
                        onChange={(e) => updateRulesCategory(activeRuleCat.id, { lastUpdated: e.target.value })}
                        className="w-full bg-[#0b101c] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase font-mono mb-1">
                    Description / Subtitle
                  </label>
                  <textarea
                    rows={2}
                    value={activeRuleCat.description || ''}
                    onChange={(e) => updateRulesCategory(activeRuleCat.id, { description: e.target.value })}
                    className="w-full bg-[#0b101c] border border-slate-800 rounded-lg p-2 text-xs text-white"
                  />
                </div>
              </div>
            )}

            {/* Rules List Table */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase font-mono">
                Rules in {activeRuleCat?.name} ({activeRuleCat?.rules.length}):
              </h3>

              <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
                {activeRuleCat?.rules.map((rule, idx) => (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#070b14] border border-slate-800/80 hover:border-slate-700"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-slate-500 font-mono text-xs">{idx + 1}.</span>
                      <span className="text-xs text-slate-200 truncate">{rule.text}</span>
                      {rule.highlightTag && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex-shrink-0">
                          ({rule.highlightTag})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => {
                          setEditingRule({ catId: activeRuleCat.id, item: rule });
                        }}
                        className="p-1 text-slate-400 hover:text-white"
                        title="Edit rule"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          deleteRuleItem(activeRuleCat.id, rule.id);
                          onShowToast('Rule deleted');
                        }}
                        className="p-1 text-red-400 hover:text-red-300"
                        title="Delete rule"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Rule Modal */}
            {showAddRuleModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-[#0b101c] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold font-['Rajdhani'] uppercase text-white">
                      Add New Rule to {activeRuleCat.name}
                    </h3>
                    <button onClick={() => setShowAddRuleModal(false)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Rule Description *
                    </label>
                    <input
                      type="text"
                      value={newRuleText}
                      onChange={(e) => setNewRuleText(e.target.value)}
                      placeholder="e.g. Griefing/Stealing"
                      className="w-full bg-[#070b14] border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Highlight Tag (Optional)
                    </label>
                    <input
                      type="text"
                      value={newRuleTag}
                      onChange={(e) => setNewRuleTag(e.target.value)}
                      placeholder="e.g. BOTH ARE ALLOWED ON LIFESTEAL"
                      className="w-full bg-[#070b14] border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowAddRuleModal(false)}
                      className="px-4 py-2 border border-slate-800 rounded-xl text-xs text-slate-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (!newRuleText.trim()) return;
                        addRuleItem(activeRuleCat.id, {
                          text: newRuleText,
                          highlightTag: newRuleTag ? newRuleTag : undefined,
                          highlightColor: newRuleTagColor,
                        });
                        setNewRuleText('');
                        setNewRuleTag('');
                        setShowAddRuleModal(false);
                        onShowToast('New rule added!');
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold font-['Rajdhani'] uppercase"
                    >
                      Save Rule
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Rule Modal */}
            {editingRule && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-[#0b101c] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold font-['Rajdhani'] uppercase text-white">
                      Edit Rule
                    </h3>
                    <button onClick={() => setEditingRule(null)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Rule Description
                    </label>
                    <input
                      type="text"
                      value={editingRule.item.text}
                      onChange={(e) =>
                        setEditingRule({
                          ...editingRule,
                          item: { ...editingRule.item, text: e.target.value },
                        })
                      }
                      className="w-full bg-[#070b14] border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Highlight Tag (e.g. BOTH ARE ALLOWED ON LIFESTEAL)
                    </label>
                    <input
                      type="text"
                      value={editingRule.item.highlightTag || ''}
                      onChange={(e) =>
                        setEditingRule({
                          ...editingRule,
                          item: { ...editingRule.item, highlightTag: e.target.value },
                        })
                      }
                      className="w-full bg-[#070b14] border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setEditingRule(null)}
                      className="px-4 py-2 border border-slate-800 rounded-xl text-xs text-slate-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        updateRuleItem(editingRule.catId, editingRule.item.id, {
                          text: editingRule.item.text,
                          highlightTag: editingRule.item.highlightTag || undefined,
                        });
                        setEditingRule(null);
                        onShowToast('Rule updated!');
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold font-['Rajdhani'] uppercase"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: VOTE SITES CONFIG */}
        {activeTab === 'vote' && (
          <div className="bg-[#0b101c] p-6 sm:p-8 rounded-2xl border border-white/5 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
              <div>
                <h2 className="text-xl font-bold font-['Rajdhani'] uppercase text-white">
                  Vote Sites & Rewards
                </h2>
                <p className="text-xs text-slate-400">
                  Configure the 6 vote buttons, URLs, and key rewards shown on the /vote page.
                </p>
              </div>

              <button
                onClick={() => {
                  updateVoteConfig(voteForm);
                  onShowToast('Vote titles and notice updated!');
                }}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold font-['Rajdhani'] uppercase flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Header Notice</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase font-mono mb-1">
                  Vote Page Heading
                </label>
                <input
                  type="text"
                  value={voteForm.title}
                  onChange={(e) => setVoteForm({ ...voteForm, title: e.target.value })}
                  className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase font-mono mb-1">
                  Reward Box Notice (Green Banner)
                </label>
                <input
                  type="text"
                  value={voteForm.rewardNotice}
                  onChange={(e) => setVoteForm({ ...voteForm, rewardNotice: e.target.value })}
                  className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            {/* Vote Sites List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase font-mono">
                Active Vote Links:
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {voteConfig.voteSites.map((site) => (
                  <div
                    key={site.id}
                    className="p-3.5 rounded-xl bg-[#070b14] border border-slate-800/80 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-red-400 font-['Rajdhani'] text-sm uppercase">
                        {site.label} — {site.siteName}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono truncate max-w-xs">
                        {site.url}
                      </div>
                    </div>

                    <button
                      onClick={() => setEditingVoteSite(site)}
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Edit Vote Site Modal */}
            {editingVoteSite && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-[#0b101c] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold font-['Rajdhani'] uppercase text-white">
                      Edit {editingVoteSite.label}
                    </h3>
                    <button onClick={() => setEditingVoteSite(null)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Button Label
                    </label>
                    <input
                      type="text"
                      value={editingVoteSite.label}
                      onChange={(e) => setEditingVoteSite({ ...editingVoteSite, label: e.target.value })}
                      className="w-full bg-[#070b14] border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Vote Site URL
                    </label>
                    <input
                      type="url"
                      value={editingVoteSite.url}
                      onChange={(e) => setEditingVoteSite({ ...editingVoteSite, url: e.target.value })}
                      className="w-full bg-[#070b14] border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setEditingVoteSite(null)}
                      className="px-4 py-2 border border-slate-800 rounded-xl text-xs text-slate-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        updateVoteSite(editingVoteSite.id, editingVoteSite);
                        setEditingVoteSite(null);
                        onShowToast('Vote site updated!');
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold font-['Rajdhani'] uppercase"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: STAFF TEAM */}
        {activeTab === 'staff' && (
          <div className="bg-[#0b101c] p-6 sm:p-8 rounded-2xl border border-white/5 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
              <div>
                <h2 className="text-xl font-bold font-['Rajdhani'] uppercase text-white">
                  Staff Team Management
                </h2>
                <p className="text-xs text-slate-400">
                  Manage Owner, Manager, Administrator groups, roles, and members with instant 3D skin previews.
                </p>
              </div>

              <button
                onClick={() => setShowAddStaffModal(true)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold font-['Rajdhani'] uppercase text-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Staff Member</span>
              </button>
            </div>

            {/* Groups and Members List */}
            <div className="space-y-6">
              {staffGroups.map((group) => {
                const members = staffMembers.filter((m) => m.groupId === group.id);
                return (
                  <div key={group.id} className="bg-[#070b14] p-4 rounded-xl border border-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: group.titleColor }} />
                        <span className="font-bold font-['Rajdhani'] text-white uppercase text-base">
                          {group.title}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">({members.length} members)</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={group.titleColor}
                          onChange={(e) => updateStaffGroup(group.id, { titleColor: e.target.value })}
                          className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                          title="Change group header color"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {members.map((m) => (
                        <div
                          key={m.id}
                          className="p-2.5 rounded-lg bg-[#0b101c] border border-slate-800 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={`https://mc-heads.net/avatar/${m.username}/40`}
                              alt={m.username}
                              className="w-8 h-8 rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://mc-heads.net/avatar/Steve/40';
                              }}
                            />
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-white truncate">{m.username}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{m.role}</div>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              deleteStaffMember(m.id);
                              onShowToast(`Removed ${m.username} from staff`);
                            }}
                            className="p-1 text-red-400 hover:text-red-300"
                            title="Remove member"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Staff Modal */}
            {showAddStaffModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-[#0b101c] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold font-['Rajdhani'] uppercase text-white">
                      Add Staff Member
                    </h3>
                    <button onClick={() => setShowAddStaffModal(false)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Minecraft Username *
                    </label>
                    <input
                      type="text"
                      value={staffUsername}
                      onChange={(e) => setStaffUsername(e.target.value)}
                      placeholder="e.g. Noxillio"
                      className="w-full bg-[#070b14] border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Staff Group *
                    </label>
                    <select
                      value={staffGroupId}
                      onChange={(e) => setStaffGroupId(e.target.value)}
                      className="w-full bg-[#070b14] border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                    >
                      {staffGroups.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Custom Role Title
                    </label>
                    <input
                      type="text"
                      value={staffRole}
                      onChange={(e) => setStaffRole(e.target.value)}
                      placeholder="e.g. Lead Moderator"
                      className="w-full bg-[#070b14] border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowAddStaffModal(false)}
                      className="px-4 py-2 border border-slate-800 rounded-xl text-xs text-slate-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (!staffUsername.trim()) return;
                        addStaffMember({
                          username: staffUsername,
                          groupId: staffGroupId,
                          role: staffRole || staffGroups.find((g) => g.id === staffGroupId)?.title || 'Staff',
                          badge: staffBadge || undefined,
                        });
                        setStaffUsername('');
                        setStaffRole('');
                        setShowAddStaffModal(false);
                        onShowToast('Staff member added!');
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold font-['Rajdhani'] uppercase"
                    >
                      Save Member
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: RECRUITMENT / APPLY */}
        {activeTab === 'apply' && (
          <div className="bg-[#0b101c] p-6 sm:p-8 rounded-2xl border border-white/5 shadow-xl space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h2 className="text-xl font-bold font-['Rajdhani'] uppercase text-white">
                Application Positions Configuration
              </h2>
              <p className="text-xs text-slate-400">
                Toggle applications OPEN / CLOSED and adjust requirements for Helper, Builder, Media, and Developer.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="p-5 rounded-2xl bg-[#070b14] border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-red-400 font-bold">
                        {app.category}
                      </span>
                      <h3 className="text-base font-bold font-['Rajdhani'] text-white">
                        {app.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => {
                        const newStatus = app.status === 'OPEN' ? 'CLOSED' : 'OPEN';
                        updateApplication(app.id, { status: newStatus });
                        onShowToast(`${app.title} marked as ${newStatus}`);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border ${
                        app.status === 'OPEN'
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                          : 'bg-red-950/60 text-red-400 border-red-500/40'
                      }`}
                    >
                      {app.status}
                    </button>
                  </div>

                  <p className="text-xs text-slate-400">{app.subtitle}</p>

                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-mono uppercase">Requirements:</span>
                    {app.requirements.map((req, i) => (
                      <div key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                        <span className="text-emerald-400">•</span>
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: ANNOUNCEMENTS */}
        {activeTab === 'news' && (
          <div className="bg-[#0b101c] p-6 sm:p-8 rounded-2xl border border-white/5 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
              <div>
                <h2 className="text-xl font-bold font-['Rajdhani'] uppercase text-white">
                  Announcements & Home Posts
                </h2>
                <p className="text-xs text-slate-400">
                  Manage the homepage announcement cards, authors, dates, and view counters.
                </p>
              </div>

              <button
                onClick={() => setShowAddAnnModal(true)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold font-['Rajdhani'] uppercase text-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post New Announcement</span>
              </button>
            </div>

            <div className="space-y-4">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="p-5 rounded-2xl bg-[#070b14] border border-slate-800 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-red-400 font-bold uppercase font-mono">{ann.tag}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">{ann.author}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-500 font-mono">{ann.date}</span>
                    </div>

                    <h3 className="text-lg font-bold font-['Rajdhani'] uppercase text-white">
                      {ann.title}
                    </h3>

                    <p className="text-xs text-slate-300 line-clamp-2">
                      {ann.content || ann.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        deleteAnnouncement(ann.id);
                        onShowToast('Announcement deleted');
                      }}
                      className="p-2 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Announcement Modal */}
            {showAddAnnModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-[#0b101c] border border-white/10 rounded-2xl p-6 w-full max-w-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold font-['Rajdhani'] uppercase text-white">
                      Create Announcement
                    </h3>
                    <button onClick={() => setShowAddAnnModal(false)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={annTitle}
                      onChange={(e) => setAnnTitle(e.target.value)}
                      placeholder="e.g. 🧊 THE END OPENING + CASH PRIZE"
                      className="w-full bg-[#070b14] border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                        Author Name
                      </label>
                      <input
                        type="text"
                        value={annAuthor}
                        onChange={(e) => setAnnAuthor(e.target.value)}
                        className="w-full bg-[#070b14] border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                        Display Date
                      </label>
                      <input
                        type="text"
                        value={annDate}
                        onChange={(e) => setAnnDate(e.target.value)}
                        className="w-full bg-[#070b14] border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Post Content *
                    </label>
                    <textarea
                      rows={5}
                      value={annContent}
                      onChange={(e) => setAnnContent(e.target.value)}
                      placeholder="Write your news post here..."
                      className="w-full bg-[#070b14] border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowAddAnnModal(false)}
                      className="px-4 py-2 border border-slate-800 rounded-xl text-xs text-slate-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (!annTitle.trim()) return;
                        addAnnouncement({
                          title: annTitle,
                          author: annAuthor,
                          date: annDate,
                          tag: 'UPDATE',
                          tagColor: '#ef4444',
                          summary: annContent.slice(0, 100),
                          content: annContent,
                          views: 1040,
                          comments: 0,
                        });
                        setAnnTitle('');
                        setAnnContent('');
                        setShowAddAnnModal(false);
                        onShowToast('Announcement published!');
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold font-['Rajdhani'] uppercase"
                    >
                      Publish
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 7: STORE PRODUCTS & RANKS */}
        {activeTab === 'products' && (
          <div className="bg-[#0b101c] p-6 sm:p-8 rounded-2xl border border-white/5 shadow-xl space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/5 pb-4">
              <div>
                <h2 className="text-xl font-bold font-['Rajdhani'] uppercase text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-red-500" />
                  <span>Store Products &amp; Ranks Catalog ({products.length})</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Add and configure Ranks, Coins, Crate Keys, Tags, or custom categories with custom photos and INR/USD/PKR pricing.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  placeholder="Search catalog..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />

                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold font-['Rajdhani'] uppercase text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ New Category</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold font-['Rajdhani'] uppercase text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Item / Rank / Keys / Coins</span>
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all whitespace-nowrap ${
                  selectedCategoryFilter === 'all'
                    ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                    : 'bg-[#070b14] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                All Products ({products.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => setSelectedCategoryFilter(cat.slug)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all whitespace-nowrap ${
                    selectedCategoryFilter === cat.slug
                      ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                      : 'bg-[#070b14] text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat.name} ({cat.itemCount})
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products
                .filter((p) => {
                  const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase());
                  const matchesCategory =
                    selectedCategoryFilter === 'all' ||
                    p.category.toLowerCase() === selectedCategoryFilter.toLowerCase();
                  return matchesSearch && matchesCategory;
                })
                .map((prod) => (
                  <div
                    key={prod.id}
                    className="p-4 rounded-2xl bg-[#070b14] border border-slate-800 hover:border-slate-700 transition-all space-y-3 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Product Image & Badges */}
                      <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-950 border border-slate-800 mb-3 flex items-center justify-center">
                        <img
                          src={prod.image || '/cryon-logo.png'}
                          alt={prod.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/cryon-logo.png';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                        {prod.badge && (
                          <div className="absolute top-2 left-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase bg-amber-500 text-black shadow">
                              {prod.badge}
                            </span>
                          </div>
                        )}

                        <div className="absolute bottom-2 left-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-black/60 border border-white/10 text-cyan-300">
                            {prod.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold font-['Rajdhani'] text-white uppercase text-base truncate">
                          {prod.name}
                        </h3>
                        {prod.tierRank && (
                          <span className="text-[10px] font-mono text-slate-400 font-bold whitespace-nowrap">
                            {prod.tierRank}
                          </span>
                        )}
                      </div>

                      {/* Pricing list */}
                      <div className="flex flex-wrap items-baseline gap-2 mt-1 text-xs font-mono font-bold">
                        <span className="text-red-400">${prod.priceUSD.toFixed(2)} USD</span>
                        {prod.priceINR && (
                          <span className="text-emerald-400">/ ₹{prod.priceINR} INR</span>
                        )}
                        {prod.pricePKR && (
                          <span className="text-slate-400">/ {prod.pricePKR.toLocaleString()} PKR</span>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                        {prod.shortDesc}
                      </p>

                      {/* Perks snippets */}
                      {prod.perks && prod.perks.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-slate-800/80 space-y-1">
                          {prod.perks.slice(0, 2).map((perk, i) => (
                            <div key={i} className="text-[11px] text-slate-300 flex items-center gap-1.5 truncate">
                              <span className="text-cyan-400">•</span>
                              <span className="truncate">{perk}</span>
                            </div>
                          ))}
                          {prod.perks.length > 2 && (
                            <div className="text-[10px] text-slate-500 font-mono">
                              +{prod.perks.length - 2} more benefits
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => handleOpenEditProduct(prod)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold font-['Rajdhani'] uppercase flex items-center gap-1 transition-colors"
                      >
                        <Edit2 className="w-3 h-3 text-cyan-400" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          deleteProduct(prod.id);
                          onShowToast(`Deleted ${prod.name}`);
                        }}
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 8: ORDERS & TRANSACTIONS LOG */}
        {activeTab === 'orders' && (
          <div className="bg-[#0b101c] p-6 sm:p-8 rounded-2xl border border-white/5 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
              <div>
                <h2 className="text-xl font-bold font-['Rajdhani'] uppercase text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <span>Orders &amp; Payment Ledger ({orders.length})</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Inspect player UPI QR receipts, verify transaction proofs, and send ranks &amp; crate keys in-game.
                </p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-2 bg-[#070b14] p-1.5 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setOrderFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                    orderFilter === 'all'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All ({orders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setOrderFilter('pending')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 ${
                    orderFilter === 'pending'
                      ? 'bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                      : 'text-amber-400 hover:text-amber-300'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>Pending ({orders.filter((o) => o.status === 'pending').length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOrderFilter('completed')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                    orderFilter === 'completed'
                      ? 'bg-emerald-600 text-white'
                      : 'text-emerald-400 hover:text-emerald-300'
                  }`}
                >
                  Completed ({orders.filter((o) => o.status === 'completed').length})
                </button>
              </div>
            </div>

            {/* Orders List */}
            {orders.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs font-mono">
                No orders registered. Purchases submitted via store or UPI QR will appear here.
              </div>
            ) : (
              <div className="space-y-4">
                {orders
                  .filter((ord) => {
                    if (orderFilter === 'all') return true;
                    return ord.status === orderFilter;
                  })
                  .map((ord) => {
                    const isPending = ord.status === 'pending';

                    return (
                      <div
                        key={ord.id}
                        className={`p-5 rounded-2xl bg-[#070b14] border ${
                          isPending
                            ? 'border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                            : 'border-slate-800'
                        } flex flex-col lg:flex-row lg:items-center justify-between gap-5 transition-all`}
                      >
                        {/* Player & Order Meta */}
                        <div className="flex items-start sm:items-center gap-4">
                          <img
                            src={`https://minotar.net/avatar/${encodeURIComponent(ord.minecraftUsername)}/52.png`}
                            alt={ord.minecraftUsername}
                            className="w-12 h-12 rounded-xl border border-slate-700 bg-slate-900 flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://minotar.net/avatar/Steve/52.png';
                            }}
                          />

                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono font-bold text-white text-base">
                                {ord.minecraftUsername}
                              </span>
                              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                                {ord.id}
                              </span>
                              <span
                                className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                                  isPending
                                    ? 'bg-amber-950/60 text-amber-400 border-amber-500/40'
                                    : ord.status === 'completed'
                                    ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                                    : 'bg-red-950/60 text-red-400 border-red-500/40'
                                }`}
                              >
                                {isPending ? '⏳ PENDING VERIFICATION' : ord.status.toUpperCase()}
                              </span>
                            </div>

                            <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2">
                              <span>Email: {ord.userEmail}</span>
                              <span>•</span>
                              <span className="font-mono">{ord.date}</span>
                            </div>

                            {/* Items in order */}
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {ord.items.map((it, idx) => (
                                <span
                                  key={idx}
                                  className="text-[11px] font-mono bg-[#0c1322] border border-slate-800 text-slate-200 px-2 py-0.5 rounded"
                                >
                                  {it.quantity}x {it.productName} ({it.category})
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Payment & Proof Details */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:self-center border-t lg:border-t-0 border-slate-800 pt-3 lg:pt-0">
                          {/* Payment amount & method */}
                          <div className="text-left sm:text-right">
                            <div className="text-base font-black font-mono text-emerald-400">
                              {ord.currency === 'INR' ? `₹${ord.totalAmount}` : `$${ord.totalAmount.toFixed(2)} ${ord.currency}`}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate max-w-xs font-mono">
                              {ord.paymentMethod}
                            </div>
                            {ord.utrNumber && (
                              <div className="text-[10px] text-cyan-400 font-mono">
                                UTR: {ord.utrNumber}
                              </div>
                            )}
                          </div>

                          {/* Screenshot Proof Button */}
                          {ord.paymentScreenshot && (
                            <button
                              type="button"
                              onClick={() => setViewingProofOrder(ord)}
                              className="px-3 py-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/50 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                            >
                              <ImageIcon className="w-3.5 h-3.5" />
                              <span>View Proof</span>
                            </button>
                          )}

                          {/* Actions: Send & Complete */}
                          <div className="flex items-center gap-2">
                            {isPending ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    sendAndCompleteOrder(ord.id, 'Verified payment proof screenshot & sent items via console');
                                    onShowToast(`Order ${ord.id} marked complete! Ranks & perks sent to ${ord.minecraftUsername}.`);
                                  }}
                                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black font-['Rajdhani'] uppercase text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all"
                                >
                                  <CheckCircle2 className="w-4 h-4 text-black" />
                                  <span>Send &amp; Complete</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    updateOrderStatus(ord.id, 'cancelled', 'Rejected by staff: invalid payment proof');
                                    onShowToast(`Order ${ord.id} cancelled.`);
                                  }}
                                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-xl transition-colors"
                                  title="Reject Order"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5" /> Delivered
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    deleteOrder(ord.id);
                                    onShowToast(`Deleted order ${ord.id}`);
                                  }}
                                  className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg transition-colors"
                                  title="Delete Record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* MODAL 1: ADD / EDIT PRODUCT MODAL */}
        {showProductModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
            <div className="bg-[#0b101c] border border-white/10 rounded-3xl p-6 sm:p-8 w-full max-w-2xl my-8 space-y-6 shadow-2xl">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-red-500" />
                  <h3 className="font-bold font-['Rajdhani'] uppercase text-white text-xl">
                    {editingProduct ? 'Edit Catalog Product' : 'Add New Item / Rank / Keys / Coins'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-5">
                {/* Product Name & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Package / Product Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      placeholder="e.g. TITAN RANK or 10x CRATE KEYS"
                      className="w-full bg-[#070b14] border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Category *
                    </label>
                    <select
                      value={isCustomCategory ? 'custom' : prodCategory}
                      onChange={(e) => {
                        if (e.target.value === 'custom') {
                          setIsCustomCategory(true);
                        } else {
                          setIsCustomCategory(false);
                          setProdCategory(e.target.value);
                        }
                      }}
                      className="w-full bg-[#070b14] border border-slate-800 rounded-xl p-2.5 text-xs text-white uppercase font-mono"
                    >
                      <option value="ranks">👑 Ranks (ranks)</option>
                      <option value="coins">🪙 In-Game Coins (coins)</option>
                      <option value="crates">📦 Crates (crates)</option>
                      <option value="keys">🔑 Crate Keys (keys)</option>
                      <option value="tags">🏷️ Chat Tags (tags)</option>
                      <option value="cosmetics">✨ Cosmetics (cosmetics)</option>
                      <option value="bundles">🎁 Bundles (bundles)</option>
                      {categories
                        .filter(
                          (c) =>
                            !['ranks', 'coins', 'crates', 'keys', 'tags', 'cosmetics', 'bundles'].includes(
                              c.slug.toLowerCase()
                            )
                        )
                        .map((c) => (
                          <option key={c.slug} value={c.slug}>
                            📁 {c.name} ({c.slug})
                          </option>
                        ))}
                      <option value="custom">➕ + Custom New Category</option>
                    </select>

                    {isCustomCategory && (
                      <input
                        type="text"
                        value={customCatInput}
                        onChange={(e) => setCustomCatInput(e.target.value)}
                        placeholder="Enter category name (e.g. weapons, perks)"
                        className="mt-2 w-full bg-[#070b14] border border-red-500/50 rounded-xl p-2 text-xs text-white font-mono"
                      />
                    )}
                  </div>
                </div>

                {/* Photo / Image Selection */}
                <div className="p-4 rounded-2xl bg-[#070b14] border border-slate-800 space-y-3">
                  <label className="block text-[11px] font-mono text-slate-400 uppercase">
                    Product Photo / Image *
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                    {/* Image Preview Box */}
                    <div className="relative rounded-xl overflow-hidden bg-black/60 border border-slate-700 aspect-square flex items-center justify-center p-2">
                      <img
                        src={prodImage || '/cryon-logo.png'}
                        alt="Product Preview"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/cryon-logo.png';
                        }}
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-3">
                      {/* Upload File Input */}
                      <div>
                        <label className="border border-dashed border-slate-700 hover:border-red-500 rounded-xl p-3 flex items-center gap-3 cursor-pointer bg-[#0c1322] hover:bg-[#0f172a] transition-all">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProductImageUpload}
                            className="hidden"
                          />
                          <Upload className="w-5 h-5 text-red-400 flex-shrink-0" />
                          <div>
                            <span className="text-xs font-bold text-white block">
                              Upload Photo from Device
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              PNG, JPG, WEBP (Instant preview)
                            </span>
                          </div>
                        </label>
                      </div>

                      {/* Image URL Input */}
                      <div>
                        <input
                          type="text"
                          value={prodImage}
                          onChange={(e) => setProdImage(e.target.value)}
                          placeholder="Or paste image URL (e.g. /crate-keys.jpg)"
                          className="w-full bg-[#0b101c] border border-slate-800 rounded-xl p-2 text-xs text-white font-mono"
                        />
                      </div>

                      {/* Quick Presets */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-500 font-mono uppercase block">
                          Quick Preset Photos:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() => setProdImage('/crate-keys.jpg')}
                            className="px-2 py-1 rounded bg-slate-800 text-[10px] text-slate-300 hover:text-white"
                          >
                            🔑 Crate Keys
                          </button>
                          <button
                            type="button"
                            onClick={() => setProdImage('/gold-coins.jpg')}
                            className="px-2 py-1 rounded bg-slate-800 text-[10px] text-slate-300 hover:text-white"
                          >
                            🪙 Gold Coins
                          </button>
                          <button
                            type="button"
                            onClick={() => setProdImage('/cryon-logo.png')}
                            className="px-2 py-1 rounded bg-slate-800 text-[10px] text-slate-300 hover:text-white"
                          >
                            🛡️ Cryon Logo
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      USD Price ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={prodPriceUSD}
                      onChange={(e) => setProdPriceUSD(parseFloat(e.target.value) || 0)}
                      className="w-full bg-[#070b14] border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      INR Price (₹) [UPI] *
                    </label>
                    <input
                      type="number"
                      value={prodPriceINR}
                      onChange={(e) => setProdPriceINR(parseInt(e.target.value, 10) || 0)}
                      className="w-full bg-[#070b14] border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      PKR Price
                    </label>
                    <input
                      type="number"
                      value={prodPricePKR}
                      onChange={(e) => setProdPricePKR(parseInt(e.target.value, 10) || 0)}
                      className="w-full bg-[#070b14] border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                {/* Badge & Tier Rank */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Badge (e.g. HOT, POPULAR)
                    </label>
                    <input
                      type="text"
                      value={prodBadge}
                      onChange={(e) => setProdBadge(e.target.value)}
                      placeholder="e.g. POPULAR"
                      className="w-full bg-[#070b14] border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Tier Rank (e.g. 1st Highest)
                    </label>
                    <input
                      type="text"
                      value={prodTier}
                      onChange={(e) => setProdTier(e.target.value)}
                      placeholder="e.g. Highest Rank"
                      className="w-full bg-[#070b14] border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Accent Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={prodColor}
                        onChange={(e) => setProdColor(e.target.value)}
                        className="w-10 h-9 rounded cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={prodColor}
                        onChange={(e) => setProdColor(e.target.value)}
                        className="w-full bg-[#070b14] border border-slate-800 rounded-xl p-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Short Description */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                    Short Summary Description
                  </label>
                  <input
                    type="text"
                    value={prodShortDesc}
                    onChange={(e) => setProdShortDesc(e.target.value)}
                    placeholder="Brief overview of features included in this package..."
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>

                {/* Perks / Benefits list */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                    Included Perks &amp; Commands (One benefit per line)
                  </label>
                  <textarea
                    rows={4}
                    value={prodPerksText}
                    onChange={(e) => setProdPerksText(e.target.value)}
                    placeholder={`Access to /fly and /feed\nExclusive Discord VIP role\n5x Mythic Crate Keys on delivery\nPriority queue on full realms`}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setShowProductModal(false)}
                    className="px-5 py-2.5 border border-slate-800 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-xs font-bold font-['Rajdhani'] uppercase shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                  >
                    {editingProduct ? 'Save Changes' : 'Create & Publish Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: ADD NEW CATEGORY MODAL */}
        {showAddCategoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#0b101c] border border-white/10 rounded-2xl p-6 sm:p-8 w-full max-w-md space-y-4 shadow-2xl">
              <div className="flex justify-between items-center">
                <h3 className="font-bold font-['Rajdhani'] uppercase text-white text-lg">
                  Create Store Category
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                    Category Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="e.g. CRATE KEYS, BOOSTER PACKS"
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                    Slug / URL identifier
                  </label>
                  <input
                    type="text"
                    value={newCatSlug}
                    onChange={(e) => setNewCatSlug(e.target.value)}
                    placeholder="e.g. keys or boosters (leave blank for auto)"
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    placeholder="Describe this product category..."
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCategoryModal(false)}
                    className="px-4 py-2 border border-slate-800 rounded-xl text-xs text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold font-['Rajdhani'] uppercase"
                  >
                    Save Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 3: PAYMENT SCREENSHOT PROOF VIEWER MODAL */}
        {viewingProofOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
            <div className="bg-[#0b101c] border border-amber-500/40 rounded-3xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-5 shadow-[0_0_50px_rgba(245,158,11,0.3)]">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-amber-400">
                    PAYMENT VERIFICATION PROOF
                  </span>
                  <h3 className="font-bold font-['Rajdhani'] uppercase text-white text-xl">
                    Order {viewingProofOrder.id} ({viewingProofOrder.minecraftUsername})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setViewingProofOrder(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Order Details Header */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#070b14] p-3 rounded-xl border border-slate-800 text-xs font-mono">
                <div>
                  <div className="text-[10px] text-slate-500">IGN</div>
                  <div className="text-white font-bold">{viewingProofOrder.minecraftUsername}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">Amount Paid</div>
                  <div className="text-emerald-400 font-bold">
                    {viewingProofOrder.currency === 'INR' ? `₹${viewingProofOrder.totalAmount}` : `$${viewingProofOrder.totalAmount.toFixed(2)}`}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">UTR / Ref</div>
                  <div className="text-cyan-300 font-bold truncate">
                    {viewingProofOrder.utrNumber || viewingProofOrder.transactionRef}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">Status</div>
                  <div className="text-amber-400 font-bold uppercase">{viewingProofOrder.status}</div>
                </div>
              </div>

              {/* Full Screenshot Image */}
              <div className="rounded-2xl overflow-hidden border border-amber-500/30 bg-black/80 flex items-center justify-center p-2">
                <img
                  src={viewingProofOrder.paymentScreenshot}
                  alt="Full Payment Screenshot Proof"
                  className="max-h-[50vh] object-contain w-full rounded-xl"
                />
              </div>

              {/* Action Buttons in Modal */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/5">
                <div className="text-xs text-slate-400">
                  Verify the amount &amp; UTR number before granting ranks in-game.
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setViewingProofOrder(null)}
                    className="px-4 py-2 border border-slate-800 rounded-xl text-xs text-slate-400"
                  >
                    Close
                  </button>

                  {viewingProofOrder.status === 'pending' && (
                    <button
                      type="button"
                      onClick={() => {
                        sendAndCompleteOrder(
                          viewingProofOrder.id,
                          'Payment proof verified in screenshot inspector'
                        );
                        onShowToast(
                          `Order ${viewingProofOrder.id} completed! Perks sent to ${viewingProofOrder.minecraftUsername}.`
                        );
                        setViewingProofOrder(null);
                      }}
                      className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black font-['Rajdhani'] uppercase text-xs rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.5)] flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-black" />
                      <span>Approve &amp; Send Perks Now</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECURITY & CREDENTIALS MODAL */}
        {showSecurityModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#0b101c] border border-white/10 rounded-2xl p-6 sm:p-8 w-full max-w-md space-y-5 shadow-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-red-500" />
                  <h3 className="font-bold font-['Rajdhani'] uppercase text-white text-lg">
                    Admin Passkey Security
                  </h3>
                </div>
                <button
                  onClick={() => setShowSecurityModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-400">
                Update the executive credentials required to unlock the Admin Console. Changes take effect immediately.
              </p>

              <form onSubmit={handleUpdateCredentials} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                    Admin Username
                  </label>
                  <input
                    required
                    type="text"
                    value={newAdminUser}
                    onChange={(e) => setNewAdminUser(e.target.value)}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                    New Secret Passkey / Password
                  </label>
                  <input
                    required
                    type="text"
                    value={newAdminPass}
                    onChange={(e) => setNewAdminPass(e.target.value)}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSecurityModal(false)}
                    className="px-4 py-2 border border-slate-800 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold font-['Rajdhani'] uppercase flex items-center gap-1.5 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save New Credentials</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
