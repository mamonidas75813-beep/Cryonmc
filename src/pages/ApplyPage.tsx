import React, { useState } from 'react';
import {
  FileText,
  Video,
  Shield,
  Hammer,
  Code,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  ChevronRight,
  Send,
  Check,
} from 'lucide-react';
import { HeroBanner } from '../components/HeroBanner';
import { AppleFooter } from '../components/AppleFooter';
import { useProducts } from '../context/ProductsContext';
import { ApplicationConfig } from '../types';

interface ApplyPageProps {
  navigate: (path: string) => void;
  onShowToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const ApplyPage: React.FC<ApplyPageProps> = ({ navigate, onShowToast }) => {
  const { serverConfig, applications } = useProducts();
  const [selectedApp, setSelectedApp] = useState<ApplicationConfig | null>(null);
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('ALL');

  // Form input states
  const [formData, setFormData] = useState({
    ign: '',
    discord: '',
    age: '',
    timezone: '',
    link: '',
    experience: '',
    reason: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);

  const getApplicationIcon = (category: string) => {
    switch (category.toUpperCase()) {
      case 'MEDIA':
        return Video;
      case 'BUILDER':
        return Hammer;
      case 'DEVELOPER':
        return Code;
      case 'STAFF':
      default:
        return Shield;
    }
  };

  const categoriesList = ['ALL', ...Array.from(new Set(applications.map((a) => a.category.toUpperCase())))];

  const filteredApplications =
    activeCategoryTab === 'ALL'
      ? applications
      : applications.filter((app) => app.category.toUpperCase() === activeCategoryTab);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ign.trim() || !formData.discord.trim()) {
      if (onShowToast) {
        onShowToast('Please fill out all required fields (IGN and Discord tag)', 'error');
      }
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedAppId(selectedApp?.id || 'done');
      if (onShowToast) {
        onShowToast(`Application submitted! Our team will review your application on Discord.`, 'success');
      }
    }, 1200);
  };

  return (
    <div className="relative min-h-screen bg-[#080b11] text-slate-200 flex flex-col justify-between">
      {/* 1. Hero Banner with Cryon MC logo & winter bg */}
      <HeroBanner navigate={navigate} onShowToast={onShowToast} />

      {/* 2. Main Application Portal */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10 w-full flex-grow space-y-8">
        
        {/* Title Header */}
        <div className="text-center space-y-2">
          <div className="text-xs font-bold text-red-500 font-mono tracking-widest uppercase">
            Recruitment Portal
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-['Rajdhani'] uppercase tracking-wider text-white">
            Join the {serverConfig.serverName} Staff Team
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            We are always seeking passionate individuals to help protect our community, create events, build realms, and develop features.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryTab(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-['Rajdhani'] uppercase tracking-wider transition-all border ${
                activeCategoryTab === cat
                  ? 'bg-red-600 text-white border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                  : 'bg-[#0d1322] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat} POSITIONS
            </button>
          ))}
        </div>

        {/* Application Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredApplications.map((app) => {
            const IconComp = getApplicationIcon(app.category);
            const isOpen = app.status === 'OPEN';

            return (
              <div
                key={app.id}
                className="bg-[#0b101c] rounded-2xl border border-white/5 hover:border-red-500/40 p-6 flex flex-col justify-between transition-all duration-300 shadow-xl group hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                        style={{
                          backgroundColor: `${app.color}20`,
                          border: `1px solid ${app.color}40`,
                        }}
                      >
                        <IconComp className="w-6 h-6" style={{ color: app.color }} />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-white/5 text-slate-400">
                          {app.category}
                        </span>
                        <h3 className="text-lg font-bold font-['Rajdhani'] uppercase text-white mt-0.5">
                          {app.title}
                        </h3>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border ${
                        isOpen
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                          : 'bg-red-950/60 text-red-400 border-red-500/30'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mb-4">{app.subtitle}</p>

                  <div className="space-y-2 mb-6 bg-black/20 p-3.5 rounded-xl border border-white/5">
                    <div className="text-[11px] font-bold text-slate-400 uppercase font-mono tracking-wider">
                      Requirements:
                    </div>
                    {app.requirements.map((req, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  disabled={!isOpen}
                  onClick={() => {
                    setSelectedApp(app);
                    setSubmittedAppId(null);
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all ${
                    isOpen
                      ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                      : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span>{isOpen ? 'Apply Now' : 'Applications Closed'}</span>
                  {isOpen && <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            );
          })}
        </div>

        {/* Modal: Application Submission Form */}
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-xl bg-[#0b101c] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
              
              <button
                onClick={() => setSelectedApp(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {submittedAppId ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black font-['Rajdhani'] uppercase text-white">
                    Application Received!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                    Thank you for applying for <strong>{selectedApp.title}</strong>! Our management team will review your application and contact you on Discord within 48-72 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedApp(null);
                      setSubmittedAppId(null);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold font-['Rajdhani'] uppercase tracking-wider text-xs"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest">
                      {selectedApp.category} APPLICATION
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black font-['Rajdhani'] uppercase text-white mt-0.5">
                      {selectedApp.title}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase font-mono mb-1">
                        Minecraft IGN *
                      </label>
                      <input
                        required
                        type="text"
                        value={formData.ign}
                        onChange={(e) => setFormData({ ...formData, ign: e.target.value })}
                        placeholder="e.g. AmanWastaken"
                        className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase font-mono mb-1">
                        Discord Username *
                      </label>
                      <input
                        required
                        type="text"
                        value={formData.discord}
                        onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
                        placeholder="e.g. aman#0001 or @aman"
                        className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase font-mono mb-1">
                        Age
                      </label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        placeholder="e.g. 17"
                        className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase font-mono mb-1">
                        Portfolio / Channel Link
                      </label>
                      <input
                        type="url"
                        value={formData.link}
                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        placeholder="https://youtube.com/@channel"
                        className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase font-mono mb-1">
                      Past Experience & Staff History
                    </label>
                    <textarea
                      rows={3}
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      placeholder="List any servers you have previously worked on or relevant experience..."
                      className="w-full bg-[#070b14] border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase font-mono mb-1">
                      Why should we choose you?
                    </label>
                    <textarea
                      rows={3}
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      placeholder="What makes you a great fit for the CryonMC team?"
                      className="w-full bg-[#070b14] border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedApp(null)}
                      className="px-4 py-2 rounded-xl border border-slate-800 text-xs font-bold font-['Rajdhani'] uppercase text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold font-['Rajdhani'] uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                    >
                      <span>{isSubmitting ? 'Submitting...' : 'Submit Application'}</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        )}

      </main>

      {/* 3. Footer */}
      <AppleFooter navigate={navigate} onShowToast={onShowToast} />
    </div>
  );
};
