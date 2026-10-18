'use client';

import React, { useState } from 'react';
import { 
  ArrowDownToLine, 
  ArrowUpToLine, 
  Trash2, 
  RotateCcw, 
  ArrowUpDown, 
  Play, 
  Volume2, 
  VolumeX, 
  Search,
  FastForward
} from 'lucide-react';
import { sounds } from '../lib/audio';

interface ControlsPanelProps {
  onInsertHead: () => void;
  onInsertTail: () => void;
  onInsertIndex: (index: number) => void;
  onDeleteHead: () => void;
  onDeleteTail: () => void;
  onReverse: () => void;
  onSort: (type: 'priority' | 'title') => void;
  onTraverse: (direction: 'forward' | 'backward') => void;
  onSearch: (query: string) => void;
  onClear: () => void;
  onLoadPreset: (index: number) => void;
  isTraversing: boolean;
  listLength: number;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  onInsertHead,
  onInsertTail,
  onInsertIndex,
  onDeleteHead,
  onDeleteTail,
  onReverse,
  onSort,
  onTraverse,
  onSearch,
  onClear,
  onLoadPreset,
  isTraversing,
  listLength,
}) => {
  const [insertIdx, setInsertIdx] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(sounds.getIsMuted());

  const handleToggleMute = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <div className="w-full bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl backdrop-blur-xl space-y-4">
      {/* Top Action Row: Insertions, Deletions, Search */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Head Operations O(1) */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-400 font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              HEAD O(1)
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Instant Pointer</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onInsertHead}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <ArrowUpToLine className="w-3.5 h-3.5" />
              Prepend
            </button>
            <button
              onClick={onDeleteHead}
              disabled={listLength === 0}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Pop Head
            </button>
          </div>
        </div>

        {/* Tail Operations O(1) */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-amber-400 font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              TAIL O(1)
            </span>
            <span className="text-[10px] text-slate-500 font-mono">End Reference</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onInsertTail}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <ArrowDownToLine className="w-3.5 h-3.5" />
              Append
            </button>
            <button
              onClick={onDeleteTail}
              disabled={listLength === 0}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Pop Tail
            </button>
          </div>
        </div>

        {/* Index Insertion O(n) */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-cyan-400 font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              INSERT AT K O(n)
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Max: {listLength}</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max={listLength}
              value={insertIdx}
              onChange={(e) => setInsertIdx(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-16 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 text-center focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={() => onInsertIndex(insertIdx)}
              className="flex-1 px-3 py-2 text-xs font-semibold rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 transition-all active:scale-95"
            >
              Insert at #{insertIdx}
            </button>
          </div>
        </div>

        {/* Linear Search O(n) */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-purple-400 font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              SEARCH O(n)
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Animated Scanner</span>
          </div>
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Find title / keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
              />
            </div>
            <button
              type="submit"
              disabled={!searchQuery.trim()}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 transition-all active:scale-95 disabled:opacity-40"
            >
              Scan
            </button>
          </form>
        </div>
      </div>

      {/* Algorithms and Secondary Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {/* Reverse O(n) */}
          <button
            onClick={onReverse}
            disabled={listLength < 2}
            className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reverse Pointers
          </button>

          {/* Sort O(n log n) */}
          <button
            onClick={() => onSort('priority')}
            disabled={listLength < 2}
            className="px-3 py-1.5 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-40"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            Sort by Priority
          </button>

          {/* Traverse Forward */}
          <button
            onClick={() => onTraverse('forward')}
            disabled={isTraversing || listLength === 0}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-40"
          >
            <Play className="w-3.5 h-3.5 text-cyan-400" />
            Traverse Forward
          </button>

          {/* Traverse Backward */}
          <button
            onClick={() => onTraverse('backward')}
            disabled={isTraversing || listLength === 0}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-40"
          >
            <FastForward className="w-3.5 h-3.5 text-purple-400 rotate-180" />
            Traverse Backward
          </button>
        </div>

        {/* Quick Presets & Audio */}
        <div className="flex items-center gap-2">
          {/* Preset Buttons */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 font-mono px-2">Presets:</span>
            <button
              onClick={() => onLoadPreset(0)}
              title="Dev Sprint Pipeline"
              className="px-2 py-1 text-xs rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
            >
              ⚡ Sprint
            </button>
            <button
              onClick={() => onLoadPreset(1)}
              title="Browser History"
              className="px-2 py-1 text-xs rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
            >
              🌐 History
            </button>
            <button
              onClick={() => onLoadPreset(2)}
              title="Music Playlist"
              className="px-2 py-1 text-xs rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
            >
              🎵 Playlist
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleMute}
            title={isMuted ? 'Unmute DSA Sound Effects' : 'Mute DSA Sound Effects'}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Clear List */}
          <button
            onClick={onClear}
            disabled={listLength === 0}
            title="Clear All Nodes"
            className="px-2.5 py-1.5 rounded-xl bg-slate-950 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-800/60 text-slate-500 hover:text-rose-400 text-xs font-semibold transition-all active:scale-95 disabled:opacity-40"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};
