import React from 'react';
import { ShieldCheck, HardDrive } from 'lucide-react';

interface HeaderProps {
  onBackToHome: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  activeCategory: string;
  setActiveCategory: (cat: 'all' | 'pdf' | 'image' | 'document') => void;
  isInWorkspace: boolean;
}

export default function Header({
  onBackToHome,
  activeCategory,
  setActiveCategory,
  isInWorkspace,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/20 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Branding */}
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2.5 group cursor-pointer text-left"
          id="header-logo-btn"
        >
          <div className="flex h-8 h-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold shadow-lg shadow-indigo-500/20 transition-transform duration-300 group-hover:scale-105">
            D
          </div>
          <div>
            <span className="font-sans text-xl font-bold tracking-tight text-white italic">
              DocConvert<span className="text-indigo-400">Hub</span>
            </span>
            <div className="hidden sm:block text-[9px] font-mono text-slate-500 font-medium tracking-wider">
              100% PRIVATE CLIENT PROCESSING
            </div>
          </div>
        </button>

        {/* Categories Bar (hidden when in active workspace to prevent distraction) */}
        {!isInWorkspace && (
          <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5 backdrop-blur-sm">
            {(['all', 'pdf', 'image', 'document'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-white/10 text-white border border-white/5 shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
                id={`cat-nav-${cat}`}
              >
                {cat === 'all' ? 'All Tools' : `${cat} tools`}
              </button>
            ))}
          </nav>
        )}

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          {/* Trust Badges */}
          <div className="hidden lg:flex items-center gap-1.5 rounded-full bg-emerald-500/5 text-emerald-400 px-3 py-1 text-xs font-medium border border-emerald-500/10">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Browser-Safe (No Uploads)</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-indigo-500/5 text-indigo-400 px-3 py-1 text-xs font-medium border border-indigo-500/10">
            <HardDrive className="h-3.5 w-3.5 text-indigo-400" />
            <span>No Signup</span>
          </div>

          {/* Elegant Dark Live Status Badge */}
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-400 px-3 py-1 text-xs font-medium border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Status: Online</span>
          </div>
        </div>

      </div>
    </header>
  );
}
