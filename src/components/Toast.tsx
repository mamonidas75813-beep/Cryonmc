import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#0e1628] border border-cyan-500/50 shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-slate-100 backdrop-blur-xl">
        <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" />
        <span className="text-xs sm:text-sm font-semibold tracking-wide pr-2">
          {message}
        </span>
        <button
          onClick={onDismiss}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
