import React, { useState } from 'react';
import {
  User,
  Shield,
  Crown,
  Coins,
  History,
  LogOut,
  Check,
  Tag,
  Key,
  PackageCheck,
  Calendar,
  Sparkles,
  Edit2,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductsContext';

interface UserAccountPageProps {
  viewMode: 'login' | 'register' | 'profile';
  navigate: (path: string) => void;
  onShowToast: (msg: string) => void;
}

export const UserAccountPage: React.FC<UserAccountPageProps> = ({
  viewMode,
  navigate,
  onShowToast,
}) => {
  const {
    user,
    orders,
    login,
    register,
    logout,
    updateMinecraftUsername,
    isAuthenticated,
  } = useAuth();
  const { serverConfig } = useProducts();

  // Form states for login/register
  const [usernameInput, setUsernameInput] = useState('');
  const [ignInput, setIgnInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isEditingIgn, setIsEditingIgn] = useState(false);
  const [newIgn, setNewIgn] = useState(user?.minecraftUsername || '');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(usernameInput || 'Player', ignInput || usernameInput || 'Steve');
    onShowToast(`Welcome back, ${ignInput || usernameInput || 'Player'}!`);
    navigate('/profile');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(
      usernameInput || 'NewPlayer',
      emailInput || `${(usernameInput || 'player').toLowerCase()}@domain.com`,
      ignInput || usernameInput || 'Steve'
    );
    onShowToast('Account registered successfully!');
    navigate('/profile');
  };

  const handleUpdateIgn = () => {
    if (newIgn.trim()) {
      updateMinecraftUsername(newIgn.trim());
      setIsEditingIgn(false);
      onShowToast(`Linked Minecraft IGN updated to ${newIgn.trim()}`);
    }
  };

  // If view is Login and not authenticated
  if (viewMode === 'login' && !isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="rounded-3xl bg-[#0e1424] border border-cyan-500/30 p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mx-auto">
              <User className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black font-['Rajdhani'] uppercase text-white tracking-wider">
              Player Login
            </h1>
            <p className="text-xs text-slate-400">
              Sign in to view your orders, claimed ranks, and coin balances.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Account Username
              </label>
              <input
                type="text"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Your website username"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Minecraft Username (IGN)
              </label>
              <input
                type="text"
                required
                value={ignInput}
                onChange={(e) => setIgnInput(e.target.value)}
                placeholder="e.g. Steve"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              Sign In
            </button>
          </form>

          <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
            Don&apos;t have an account yet?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-cyan-400 font-bold hover:underline"
            >
              Register here
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If view is Register
  if (viewMode === 'register' && !isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="rounded-3xl bg-[#0e1424] border border-cyan-500/30 p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black font-['Rajdhani'] uppercase text-white tracking-wider">
              Create Player Account
            </h1>
            <p className="text-xs text-slate-400">
              Link your Minecraft character to unlock order sync &amp; coin wallets.
            </p>
          </div>

          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Account Username
              </label>
              <input
                type="text"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Desired account username"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="name@domain.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Minecraft IGN
              </label>
              <input
                type="text"
                required
                value={ignInput}
                onChange={(e) => setIgnInput(e.target.value)}
                placeholder="e.g. Alex"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              Create Account
            </button>
          </form>

          <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-cyan-400 font-bold hover:underline"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Profile View (or fallback if authenticated)
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Profile Card */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0d162a] via-[#091120] to-[#070b14] border border-cyan-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={
                  user?.avatarUrl ||
                  `https://minotar.net/avatar/${encodeURIComponent(
                    user?.minecraftUsername || 'Steve'
                  )}/96.png`
                }
                alt={user?.minecraftUsername || 'Player'}
                className="w-20 h-20 rounded-2xl border-2 border-cyan-500/50 bg-slate-800 object-cover shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://minotar.net/avatar/Steve/96.png';
                }}
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#090d16] flex items-center justify-center">
                <Check className="w-3 h-3 text-black stroke-[3]" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black font-['Rajdhani'] uppercase text-white tracking-wide">
                  {user?.minecraftUsername || 'Steve'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold uppercase bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
                  {user?.role === 'admin' ? 'ADMINISTRATOR' : 'VERIFIED PLAYER'}
                </span>
              </div>

              <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3 font-mono">
                <span>Account: {user?.username}</span>
                <span>•</span>
                <span>Email: {user?.email}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  Joined {user?.joinedDate}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={() => {
                logout();
                onShowToast('Signed out successfully');
                navigate('/');
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 border border-slate-700 hover:border-rose-500/40 text-slate-300 hover:text-rose-300 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Change IGN link */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          {isEditingIgn ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newIgn}
                onChange={(e) =>
                  setNewIgn(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))
                }
                placeholder="New Minecraft IGN"
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-cyan-500/50 text-white font-mono text-xs focus:outline-none"
              />
              <button
                onClick={handleUpdateIgn}
                className="px-3 py-1.5 rounded-lg bg-cyan-500 text-black font-bold text-xs"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditingIgn(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-400">
              <span>Linked Minecraft Character:</span>
              <strong className="text-white font-mono">{user?.minecraftUsername}</strong>
              <button
                onClick={() => setIsEditingIgn(true)}
                className="text-cyan-400 hover:underline flex items-center gap-1 ml-2 font-semibold"
              >
                <Edit2 className="w-3 h-3" />
                <span>Change Character</span>
              </button>
            </div>
          )}

          <div className="text-slate-500 text-[11px]">
            Server: {serverConfig.serverName} ({serverConfig.serverIp})
          </div>
        </div>
      </div>

      {/* Overview Cards: Balance, Active Ranks, Owned Tags */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Card 1: Coins Balance */}
        <div className="p-6 rounded-2xl bg-[#0e1424] border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-['Rajdhani']">
              In-Game Coins Balance
            </div>
            <div className="text-3xl font-black font-mono text-emerald-400 mt-1">
              {user?.coinsBalance?.toLocaleString() || 0}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Usable on /shop and cosmetics in-game
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Coins className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Active Ranks */}
        <div className="p-6 rounded-2xl bg-[#0e1424] border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-['Rajdhani']">
              Active Lifetime Ranks
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {user?.ownedRanks && user.ownedRanks.length > 0 ? (
                user.ownedRanks.map((r, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded-md text-xs font-black uppercase font-mono bg-amber-500/20 border border-amber-500/40 text-amber-300"
                  >
                    {r}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">No ranks unlocked</span>
              )}
            </div>
            <div className="text-[11px] text-slate-500 mt-1.5">
              Synced across all server realms
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Crown className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Owned Tags */}
        <div className="p-6 rounded-2xl bg-[#0e1424] border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-['Rajdhani']">
              Unlocked Chat Tags
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {user?.ownedTags && user.ownedTags.length > 0 ? (
                user.ownedTags.map((t, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md text-xs font-bold font-mono bg-pink-500/20 border border-pink-500/40 text-pink-300"
                  >
                    {t}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">No chat tags unlocked</span>
              )}
            </div>
            <div className="text-[11px] text-slate-500 mt-1.5">
              Equip in-game with /tags
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
            <Tag className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Purchase History Ledger */}
      <div className="rounded-3xl bg-[#0e1424] border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xl font-bold font-['Rajdhani'] uppercase text-white tracking-wider">
              Purchase History &amp; Delivery Ledger
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {orders.length} Records
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No purchase records found on your account.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold text-[11px]">
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Date (UTC)</th>
                  <th className="py-3 px-3">Minecraft IGN</th>
                  <th className="py-3 px-3">Items Purchased</th>
                  <th className="py-3 px-3">Total Paid</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-900/40">
                    <td className="py-3.5 px-3 font-mono font-bold text-cyan-400">
                      {ord.id}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-400 text-[11px]">
                      {ord.date}
                    </td>
                    <td className="py-3.5 px-3 font-mono font-semibold text-white">
                      {ord.minecraftUsername}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="space-y-0.5">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="truncate max-w-xs text-slate-200">
                            {it.quantity}x {it.productName}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-white">
                      {ord.currency === 'INR' ? `₹${ord.totalAmount}` : `$${ord.totalAmount.toFixed(2)} ${ord.currency}`}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase border ${
                          ord.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : ord.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-red-500/20 text-red-300 border-red-500/40'
                        }`}
                      >
                        {ord.status === 'pending' ? '⏳ PENDING' : ord.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-500 text-[11px]">
                      {ord.transactionRef}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
