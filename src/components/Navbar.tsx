import React, { useState, useEffect, useCallback } from 'react';
import {
  Home,
  BookOpen,
  Trophy,
  Map,
  ShoppingCart,
  Shield,
  FileText,
  User,
  Search,
  ChevronDown,
  Menu,
  X,
  ExternalLink,
  Layers,
  Sparkles,
  HelpCircle,
  LogOut,
  Sliders,
  Crown,
  Coins,
  PackageOpen,
  Key,
  Tag,
  Activity,
  Wifi,
  RefreshCw,
  Copy,
  Check,
  Zap,
  Server,
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductsContext';
import { CurrencyCode } from '../types';
import { fetchServerStatus, ServerPingStatus } from '../services/serverStatusApi';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
  openSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate, openSearch }) => {
  const { currency, setCurrency, availableCurrencies } = useCurrency();
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { serverConfig, categories } = useProducts();

  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);

  // Real-time server status indicator state (Powered by mock API fetch)
  const [serverStatus, setServerStatus] = useState<ServerPingStatus | null>(null);
  const [isRefreshingStatus, setIsRefreshingStatus] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [copiedType, setCopiedType] = useState<'java' | 'bedrock' | null>(null);

  const loadStatus = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshingStatus(true);
    try {
      const data = await fetchServerStatus(serverConfig);
      setServerStatus(data);
    } catch (err) {
      console.error('Failed to fetch real-time server status:', err);
    } finally {
      if (isManual) {
        setTimeout(() => setIsRefreshingStatus(false), 400);
      }
    }
  }, [serverConfig]);

  useEffect(() => {
    // Initial mock API fetch on mount
    loadStatus();

    // Real-time background polling every 12 seconds
    const interval = setInterval(() => {
      loadStatus();
    }, 12000);

    return () => clearInterval(interval);
  }, [loadStatus]);

  const handleCopyIp = (text: string, type: 'java' | 'bedrock') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2200);
  };

  interface NavLinkItem {
    label: string;
    path: string;
    icon?: React.ComponentType<{ className?: string }>;
    highlight?: boolean;
    isExternal?: boolean;
    hasDropdown?: boolean;
  }

  const navLinks: NavLinkItem[] = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Rules', path: '/rules', icon: BookOpen },
    { label: 'Vote', path: '/vote', icon: Trophy },
    { label: 'Map', path: '/#map', icon: Map },
    { label: 'Store', path: '/store', highlight: true, icon: ShoppingCart, hasDropdown: true },
    { label: 'Staff', path: '/staff', icon: Shield },
    { label: 'Apply', path: '/apply', icon: FileText },
  ];

  const storeCategories = [
    { slug: 'ranks', name: 'Ranks', icon: Crown, color: '#f59e0b' },
    { slug: 'coins', name: 'Coins', icon: Coins, color: '#10b981' },
    { slug: 'crates', name: 'Crates', icon: PackageOpen, color: '#06b6d4' },
    { slug: 'keys', name: 'Keys', icon: Key, color: '#8b5cf6' },
    { slug: 'tags', name: 'Tags', icon: Tag, color: '#ec4899' },
    { slug: 'cosmetics', name: 'Cosmetics', icon: Sparkles, color: '#38bdf8' },
    { slug: 'bundles', name: 'Bundles', icon: Layers, color: '#f97316' },
    { slug: 'other', name: 'Other', icon: Sliders, color: '#a855f7' },
  ];

  const handleNavClick = (link: { label: string; path: string; isExternal?: boolean }) => {
    if (link.isExternal) {
      window.open(serverConfig.discordUrl, '_blank');
      setMobileMenuOpen(false);
      return;
    }
    if (link.path.startsWith('/#')) {
      navigate('/');
      setMobileMenuOpen(false);
      return;
    }
    navigate(link.path);
    setMobileMenuOpen(false);
  };

  const isLinkActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#090d16]/85 border-b border-cyan-500/15 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      {/* Top micro announcement bar */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-blue-900/40 to-slate-950/60 border-b border-cyan-500/10 py-1 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-400 font-medium">
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  serverStatus ? (serverStatus.online ? 'bg-emerald-400' : 'bg-rose-400') : 'bg-emerald-400'
                }`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  serverStatus ? (serverStatus.online ? 'bg-emerald-500' : 'bg-rose-500') : 'bg-emerald-500'
                }`}
              ></span>
            </span>
            <span className="tracking-wider uppercase">
              {serverStatus?.online === false ? (
                <span className="text-rose-400 font-bold">Server Offline • Maintenance</span>
              ) : (
                <>
                  Server Online:{' '}
                  <strong className="text-white font-bold font-mono">
                    {serverStatus
                      ? serverStatus.players.online.toLocaleString()
                      : serverConfig.currentOnline.toLocaleString()}
                  </strong>{' '}
                  players
                </>
              )}
            </span>
            {serverStatus?.online && (
              <>
                <span className="text-slate-500 hidden sm:inline">•</span>
                <span className="text-slate-400 hidden sm:inline">
                  Ping: <span className="text-emerald-400 font-mono font-bold">{serverStatus.ping}ms</span>
                </span>
              </>
            )}
            <span className="text-slate-500 hidden md:inline">•</span>
            <span className="text-slate-400 hidden md:inline">
              20% Autumn Sale Active! Use code <span className="text-amber-400 font-mono font-bold">SALE20</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => navigate('/admin')}
              className="hover:text-cyan-300 transition-colors flex items-center gap-1 text-[11px]"
              title="Admin Dashboard (Manage products & orders)"
            >
              <Sliders className="w-3 h-3 text-cyan-400" />
              <span className="hidden md:inline">Admin</span>
            </button>
            <a
              href={serverConfig.discordUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-300 transition-colors flex items-center gap-1 text-[11px]"
            >
              <span>Discord</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0"
          >
            <div className="relative w-11 h-11 rounded-full p-0.5 shadow-[0_0_20px_rgba(6,182,212,0.5)] group-hover:shadow-[0_0_28px_rgba(6,182,212,0.8)] transition-all bg-gradient-to-tr from-cyan-600 to-blue-400">
              <img
                src={serverConfig.logoUrl || '/cryon-logo.png'}
                alt={serverConfig.serverName}
                className="w-full h-full rounded-full object-contain bg-[#060a12]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/cryon-logo.png';
                }}
              />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-wider text-white font-['Rajdhani'] uppercase block leading-none group-hover:text-cyan-300 transition-colors">
                {serverConfig.serverName}
              </span>
              <span className="text-[10px] tracking-[0.2em] font-semibold text-cyan-400 uppercase block mt-1">
                Official Network
              </span>
            </div>
          </div>

          {/* Desktop Nav Links (AppleMC Style) */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const active = isLinkActive(link.path);
              const IconComp = link.icon;

              if (link.hasDropdown) {
                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setStoreDropdownOpen(true)}
                    onMouseLeave={() => setStoreDropdownOpen(false)}
                  >
                    <button
                      onClick={() => handleNavClick(link)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider transition-all flex items-center gap-1.5 font-['Rajdhani'] uppercase ${
                        link.highlight && !active
                          ? 'text-white bg-red-600 hover:bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                          : active
                          ? 'text-white bg-red-600/30 border border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {IconComp && <IconComp className="w-3.5 h-3.5 text-white" />}
                      <span>{link.label}</span>
                      <ChevronDown className={`w-3 h-3 text-white/80 transition-transform ${storeDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Store Categories Dropdown */}
                    {storeDropdownOpen && (
                      <div className="absolute left-0 mt-1 w-56 rounded-xl bg-[#0c1220] border border-red-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                        <div className="px-3 py-1 text-[10px] font-bold text-red-400 font-mono tracking-widest uppercase border-b border-slate-800 flex items-center justify-between">
                          <span>Store Categories</span>
                          <span className="text-slate-500">8 Categories</span>
                        </div>
                        <div className="py-1">
                          {storeCategories.map((cat) => {
                            const CatIcon = cat.icon;
                            return (
                              <button
                                key={cat.slug}
                                onClick={() => {
                                  navigate(`/store/${cat.slug}`);
                                  setStoreDropdownOpen(false);
                                }}
                                className="w-full px-3 py-1.5 text-left text-xs text-slate-200 hover:text-white hover:bg-red-600/20 flex items-center gap-2.5 transition-colors font-['Rajdhani'] uppercase tracking-wider font-semibold"
                              >
                                <CatIcon className="w-3.5 h-3.5" style={{ color: cat.color }} />
                                <span>{cat.name}</span>
                              </button>
                            );
                          })}
                        </div>
                        <div className="pt-1 mt-1 border-t border-slate-800 px-2">
                          <button
                            onClick={() => {
                              navigate('/store');
                              setStoreDropdownOpen(false);
                            }}
                            className="w-full py-1.5 text-center text-[11px] font-bold text-white bg-red-600/30 hover:bg-red-600/60 rounded-lg transition-colors font-['Rajdhani'] uppercase tracking-wider"
                          >
                            View All Items →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider transition-all flex items-center gap-1.5 font-['Rajdhani'] uppercase ${
                    link.highlight && !active
                      ? 'text-white bg-red-600 hover:bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                      : active
                      ? 'text-white bg-red-600/30 border border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {IconComp && <IconComp className="w-3.5 h-3.5 text-slate-300" />}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* REAL-TIME SERVER STATUS INDICATOR (Powered by mock API fetch) */}
            <div className="relative">
              <button
                id="nav-server-status-pill"
                onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                aria-label="View real-time server status"
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl transition-all border text-xs font-['Rajdhani'] uppercase tracking-wider font-bold shadow-sm ${
                  serverStatus?.online === false
                    ? 'bg-rose-950/40 hover:bg-rose-900/40 border-rose-500/50 text-rose-200'
                    : 'bg-slate-900/90 hover:bg-slate-800/90 border-emerald-500/30 hover:border-emerald-400/60 text-slate-200'
                }`}
                title="Click to view live server status, ping, and copy server IP"
              >
                {/* Live Pulsing Beacon Dot */}
                <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5 flex-shrink-0">
                  {serverStatus?.online === false ? (
                    <>
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-rose-600 shadow-[0_0_8px_rgba(244,63,94,0.9)]"></span>
                    </>
                  ) : (
                    <>
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)]"></span>
                    </>
                  )}
                </span>

                {/* Status & Player Count */}
                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-black tracking-wider text-[11px] sm:text-xs ${
                      serverStatus?.online === false ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {serverStatus?.online === false ? 'OFFLINE' : 'ONLINE'}
                  </span>
                  <span className="text-slate-600 hidden sm:inline">•</span>
                  <span className="text-white font-mono font-bold text-[11px] sm:text-xs">
                    {serverStatus
                      ? serverStatus.players.online.toLocaleString()
                      : serverConfig.currentOnline.toLocaleString()}
                  </span>
                  <span className="text-slate-400 text-[10px] lowercase hidden md:inline">online</span>
                </div>

                {/* Ping latency pill */}
                {serverStatus?.online && (
                  <span className="hidden xl:flex items-center gap-0.5 text-[10px] text-cyan-300 font-mono bg-cyan-950/70 px-1.5 py-0.5 rounded border border-cyan-500/20">
                    <Zap className="w-2.5 h-2.5 text-cyan-400" />
                    {serverStatus.ping}ms
                  </span>
                )}

                {isRefreshingStatus && (
                  <RefreshCw className="w-3 h-3 text-cyan-400 animate-spin flex-shrink-0" />
                )}

                <ChevronDown
                  className={`w-3 h-3 text-slate-400 transition-transform ${
                    statusDropdownOpen ? 'rotate-180 text-cyan-400' : ''
                  }`}
                />
              </button>

              {/* Status Popover Dropdown */}
              {statusDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setStatusDropdownOpen(false)} />
                  <div className="absolute right-0 sm:right-auto sm:left-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0a0f1d] border border-cyan-500/30 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-4 z-40 animate-in fade-in zoom-in-95 duration-150">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center">
                          <Activity className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white uppercase tracking-wider font-['Rajdhani']">
                            Server Real-Time Status
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Auto-refreshed via Minecraft Ping API
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase border ${
                            serverStatus?.online === false
                              ? 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                              : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                          }`}
                        >
                          {serverStatus?.online === false ? 'Offline' : 'Online'}
                        </span>
                        <button
                          onClick={() => loadStatus(true)}
                          disabled={isRefreshingStatus}
                          title="Refresh live server ping now"
                          className="p-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 transition-colors"
                        >
                          <RefreshCw
                            className={`w-3.5 h-3.5 ${isRefreshingStatus ? 'animate-spin text-cyan-400' : ''}`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Live Player Capacity Card */}
                    <div className="my-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Player Capacity</span>
                        </span>
                        <span className="font-mono font-bold text-white">
                          <strong className="text-cyan-400">
                            {serverStatus ? serverStatus.players.online.toLocaleString() : 0}
                          </strong>{' '}
                          / {serverStatus ? serverStatus.players.max.toLocaleString() : 2000}
                        </span>
                      </div>

                      {/* Capacity Progress Bar */}
                      {serverStatus && (
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.6)]"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.max(
                                  3,
                                  Math.round((serverStatus.players.online / serverStatus.players.max) * 100)
                                )
                              )}%`,
                            }}
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono">
                        <span className="flex items-center gap-1">
                          <Wifi className="w-3 h-3 text-emerald-400" />
                          <span>Latency: {serverStatus?.ping || 24}ms (Excellent)</span>
                        </span>
                        <span className="text-cyan-400 font-semibold">
                          Version: {serverStatus?.version || '1.20.4 - 1.21.x'}
                        </span>
                      </div>
                    </div>

                    {/* Sub-servers live breakdown */}
                    {serverStatus?.subServers && serverStatus.subServers.length > 0 && (
                      <div className="mb-3 space-y-1.5">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                          Network Game Modes
                        </div>
                        <div className="grid grid-cols-3 gap-1.5 text-center">
                          {serverStatus.subServers.map((sub) => (
                            <div
                              key={sub.id}
                              className="p-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80"
                            >
                              <div className="text-[10px] font-bold text-slate-200 truncate">
                                {sub.name}
                              </div>
                              <div className="text-[11px] font-mono font-bold text-cyan-400">
                                {sub.players}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick Copy IP Address Section */}
                    <div className="space-y-2 pt-1 border-t border-slate-800">
                      {/* Java Edition */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-cyan-500/20">
                        <div className="overflow-hidden">
                          <div className="text-[9px] uppercase tracking-wider text-cyan-400 font-bold font-mono">
                            Java Edition IP
                          </div>
                          <div className="text-xs font-mono font-bold text-white select-all">
                            {serverConfig.serverIp || 'play.cryonmc.net'}
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleCopyIp(serverConfig.serverIp || 'play.cryonmc.net', 'java')
                          }
                          className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xs flex items-center gap-1 transition-all shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                        >
                          {copiedType === 'java' ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy IP</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Bedrock Edition */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                        <div className="overflow-hidden">
                          <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold font-mono">
                            Bedrock Edition IP & Port
                          </div>
                          <div className="text-xs font-mono font-bold text-slate-200 select-all">
                            {serverConfig.serverIp || 'play.cryonmc.net'}:
                            <span className="text-cyan-400">
                              {serverConfig.bedrockPort || 19132}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleCopyIp(
                              `${serverConfig.serverIp || 'play.cryonmc.net'} (Port: ${
                                serverConfig.bedrockPort || 19132
                              })`,
                              'bedrock'
                            )
                          }
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1 transition-all"
                        >
                          {copiedType === 'bedrock' ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Search Button */}
            <button
              id="nav-search-button"
              onClick={openSearch}
              aria-label="Search store products"
              className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 hover:bg-slate-800/80 transition-all"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Currency Selector Dropdown */}
            <div className="relative">
              <button
                id="currency-selector-button"
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                aria-label="Select store currency"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 hover:border-cyan-500/40 hover:text-cyan-300 transition-all text-xs font-bold font-mono"
              >
                <span className="text-cyan-400">{CURRENCIES_FLAG(currency)}</span>
                <span>{currency}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${currencyDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {currencyDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setCurrencyDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#0e1424] border border-cyan-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 border-b border-slate-800">
                      Select Currency
                    </div>
                    {availableCurrencies.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => {
                          setCurrency(c.code as CurrencyCode);
                          setCurrencyDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-cyan-950/40 transition-colors ${
                          currency === c.code
                            ? 'text-cyan-400 font-bold bg-cyan-500/10'
                            : 'text-slate-300'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-5">{CURRENCIES_FLAG(c.code as CurrencyCode)}</span>
                          <span>{c.code} ({c.symbol})</span>
                        </span>
                        <span className="text-[10px] text-slate-400">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Cart Button with Counter */}
            <button
              id="nav-cart-button"
              onClick={() => navigate('/cart')}
              aria-label="View Shopping Cart"
              className="relative p-2.5 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all text-slate-200 group"
            >
              <ShoppingCart className="w-4 h-4 group-hover:text-cyan-400 transition-colors" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-extrabold text-[10px] h-5 min-w-5 px-1 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.8)] animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Account / User Button */}
            <div className="relative">
              {isAuthenticated && user ? (
                <button
                  id="nav-user-profile-button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 transition-all text-left"
                >
                  <img
                    src={user.avatarUrl || `https://minotar.net/avatar/${user.minecraftUsername}/40.png`}
                    alt={user.minecraftUsername}
                    className="w-7 h-7 rounded-md border border-cyan-500/40 bg-slate-800 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://minotar.net/avatar/Steve/40.png';
                    }}
                  />
                  <div className="hidden sm:block">
                    <div className="text-xs font-bold text-slate-200 truncate max-w-[90px] leading-tight">
                      {user.minecraftUsername}
                    </div>
                    <div className="text-[10px] text-cyan-400 font-semibold font-mono">
                      {user.coinsBalance} Coins
                    </div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
                </button>
              ) : (
                <button
                  id="nav-login-button"
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:text-white transition-all text-xs font-bold tracking-wider"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">LOGIN</span>
                </button>
              )}

              {/* User Dropdown */}
              {userMenuOpen && isAuthenticated && user && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-52 rounded-xl bg-[#0e1424] border border-cyan-500/30 shadow-[0_10px_35px_rgba(0,0,0,0.8)] py-2 z-30 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 border-b border-slate-800 flex items-center gap-2.5">
                      <img
                        src={user.avatarUrl || `https://minotar.net/avatar/${user.minecraftUsername}/40.png`}
                        alt=""
                        className="w-8 h-8 rounded-lg border border-cyan-500/30 bg-slate-800"
                      />
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold text-white truncate">{user.minecraftUsername}</div>
                        <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                      </div>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigate('/profile');
                          setUserMenuOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left text-xs text-slate-200 hover:text-cyan-300 hover:bg-cyan-950/30 flex items-center gap-2"
                      >
                        <User className="w-3.5 h-3.5 text-cyan-400" />
                        <span>My Account & Orders</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate('/admin');
                          setUserMenuOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left text-xs text-slate-200 hover:text-cyan-300 hover:bg-cyan-950/30 flex items-center gap-2"
                      >
                        <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Admin Dashboard</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate('/support');
                          setUserMenuOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left text-xs text-slate-200 hover:text-cyan-300 hover:bg-cyan-950/30 flex items-center gap-2"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                        <span>Help & Support</span>
                      </button>
                    </div>
                    <div className="border-t border-slate-800 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left text-xs text-rose-400 hover:bg-rose-950/30 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              id="mobile-menu-toggle-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Category Ribbon Bar (Available across all pages: Ranks, Coins, Crates, Keys, Tags, Cosmetics, Bundles, Other) */}
      <div className="bg-[#060910] border-t border-white/5 py-1.5 px-4 overflow-x-auto no-scrollbar shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-start md:justify-center gap-1.5 sm:gap-2 text-[11px] font-['Rajdhani'] uppercase tracking-wider min-w-max">
          <span className="text-[10px] font-bold text-red-400/90 flex items-center gap-1 mr-1">
            <ShoppingCart className="w-3 h-3 text-red-500" />
            <span>Store:</span>
          </span>
          {storeCategories.map((cat) => {
            const CatIcon = cat.icon;
            const isCatActive = currentPath === `/store/${cat.slug}`;
            return (
              <button
                key={cat.slug}
                onClick={() => navigate(`/store/${cat.slug}`)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all font-semibold border ${
                  isCatActive
                    ? 'bg-red-600 text-white border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                    : 'bg-[#0c1220]/80 border-slate-800 text-slate-300 hover:text-white hover:border-red-500/40 hover:bg-[#121a2e]'
                }`}
              >
                <CatIcon className="w-3 h-3" style={{ color: isCatActive ? '#ffffff' : cat.color }} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-cyan-500/20 bg-[#090d16]/98 backdrop-blur-2xl px-4 py-5 animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col gap-1.5">
            {/* Mobile Server Status Card */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 mb-2 space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        serverStatus?.online === false ? 'bg-rose-400' : 'bg-emerald-400'
                      }`}
                    ></span>
                    <span
                      className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                        serverStatus?.online === false ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                    ></span>
                  </span>
                  <span className="text-xs font-black uppercase tracking-wider font-['Rajdhani'] text-white">
                    {serverStatus?.online === false ? 'Server Offline' : 'Server Online'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    {serverStatus ? serverStatus.players.online.toLocaleString() : 0} /{' '}
                    {serverStatus ? serverStatus.players.max.toLocaleString() : 2000}
                  </span>
                  <button
                    onClick={() => loadStatus(true)}
                    disabled={isRefreshingStatus}
                    className="p-1 rounded bg-slate-800 text-slate-300 hover:text-cyan-400"
                    title="Refresh server status"
                  >
                    <RefreshCw className={`w-3 h-3 ${isRefreshingStatus ? 'animate-spin text-cyan-400' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="truncate">{serverConfig.serverIp || 'play.cryonmc.net'}</span>
                <button
                  onClick={() => handleCopyIp(serverConfig.serverIp || 'play.cryonmc.net', 'java')}
                  className="px-2 py-0.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-[10px] flex items-center gap-1 transition-all"
                >
                  {copiedType === 'java' ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                  <span>{copiedType === 'java' ? 'Copied' : 'Copy IP'}</span>
                </button>
              </div>
            </div>

            {navLinks.map((link) => {
              const active = isLinkActive(link.path);
              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold tracking-wider flex items-center justify-between transition-all ${
                    active
                      ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30'
                      : 'text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.isExternal && <ExternalLink className="w-3.5 h-3.5 text-slate-400" />}
                </button>
              );
            })}

            {/* Mobile Categories Submenu */}
            <div className="border-t border-slate-800 my-2 pt-2">
              <div className="px-2 pb-1.5 text-[10px] font-bold text-red-400 uppercase tracking-widest font-mono">
                Store Categories
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {storeCategories.map((cat) => {
                  const CatIcon = cat.icon;
                  return (
                    <button
                      key={cat.slug}
                      onClick={() => {
                        navigate(`/store/${cat.slug}`);
                        setMobileMenuOpen(false);
                      }}
                      className="px-3 py-2 rounded-lg bg-[#0e1424] border border-slate-800 hover:border-red-500/40 text-xs text-slate-200 flex items-center gap-2 font-['Rajdhani'] uppercase tracking-wider font-semibold"
                    >
                      <CatIcon className="w-3.5 h-3.5" style={{ color: cat.color }} />
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-slate-800 my-2 pt-3 flex flex-col gap-2">
              <button
                onClick={() => {
                  navigate('/admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800/60 flex items-center gap-2"
              >
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Admin Management</span>
              </button>
              <button
                onClick={() => {
                  navigate('/cart');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800/60 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-cyan-400" />
                  <span>Cart</span>
                </span>
                <span className="bg-cyan-500 text-black font-bold text-xs px-2 py-0.5 rounded-full">
                  {itemCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

function CURRENCIES_FLAG(code: CurrencyCode) {
  switch (code) {
    case 'USD':
      return '$';
    case 'INR':
      return '₹';
    case 'EUR':
      return '€';
    case 'GBP':
      return '£';
    default:
      return '$';
  }
}
