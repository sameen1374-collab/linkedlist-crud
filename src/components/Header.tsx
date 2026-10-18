'use client';

import React from 'react';
import { Network, LayoutGrid, Monitor, Split, ExternalLink } from 'lucide-react';

interface HeaderProps {
  viewMode: 'visualizer' | 'crud' | 'split';
  onChangeViewMode: (mode: 'visualizer' | 'crud' | 'split') => void;
  onOpenDeployModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onChangeViewMode,
  onOpenDeployModal,
}) => {
  return (
    <header className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-[1.5px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-cyan-400">
              <Network className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                NODEFORGE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                DSA • LINKED LIST
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Full-Stack Next.js CRUD Application Powered by In-Memory Doubly Linked List
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => onChangeViewMode('split')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              viewMode === 'split' ? 'bg-cyan-500/20 text-cyan-300 font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Split Studio</span>
          </button>
          <button
            onClick={() => onChangeViewMode('visualizer')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              viewMode === 'visualizer' ? 'bg-cyan-500/20 text-cyan-300 font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Visualizer</span>
          </button>
          <button
            onClick={() => onChangeViewMode('crud')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              viewMode === 'crud' ? 'bg-cyan-500/20 text-cyan-300 font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden md:inline">CRUD Dashboard</span>
          </button>
        </div>

        {/* Deploy & Agent Badges */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDeployModal}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md group"
          >
            <svg className="w-3.5 h-3.5 fill-current text-white" viewBox="0 0 1155 1000">
              <path d="M577.346 0L1154.69 1000H0L577.346 0Z" />
            </svg>
            <span>Deploy to Vercel</span>
            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-cyan-400 transition-colors" />
          </button>
        </div>
      </div>
    </header>
  );
};
