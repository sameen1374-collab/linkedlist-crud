'use client';

import React from 'react';
import { SerializedNode, TaskItem, TraversalStep } from '../dsa/types';
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Trash2, 
  Edit3, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

interface VisualizerProps {
  nodes: SerializedNode<TaskItem>[];
  activeStep: TraversalStep | null;
  onSelectNode: (node: SerializedNode<TaskItem>) => void;
  onDeleteNode: (id: string) => void;
  onEditNode: (node: SerializedNode<TaskItem>) => void;
  onInsertAfter: (index: number) => void;
}

export const Visualizer: React.FC<VisualizerProps> = ({
  nodes,
  activeStep,
  onSelectNode,
  onDeleteNode,
  onEditNode,
  onInsertAfter,
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      case 'high':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'medium':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/40';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'in-progress':
        return <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />;
      default:
        return <AlertCircle className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  if (nodes.length === 0) {
    return (
      <div className="w-full rounded-2xl border border-dashed border-slate-800 bg-slate-950/60 p-12 text-center flex flex-col items-center justify-center min-h-[320px]">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 shadow-lg shadow-cyan-500/5">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-slate-200">Linked List is Currently Empty</h3>
        <p className="text-sm text-slate-400 max-w-md mt-1">
          Both <code className="text-emerald-400 font-mono">HEAD</code> and <code className="text-amber-400 font-mono">TAIL</code> pointers are pointing to <code className="text-rose-400 font-mono">NULL</code>. Add a node to initialize the data structure.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full relative rounded-2xl border border-slate-800/80 bg-slate-950/90 shadow-2xl backdrop-blur-xl overflow-hidden">
      {/* Visualizer Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/50">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </span>
          <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            Interactive Pointer Canvas
            <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Doubly Linked
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>HEAD: {nodes[0]?.memoryAddress}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span>TAIL: {nodes[nodes.length - 1]?.memoryAddress}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span>Length: {nodes.length}</span>
          </div>
        </div>
      </div>

      {/* Traversal Step Banner (if stepping) */}
      {activeStep && (
        <div className="px-6 py-2.5 bg-gradient-to-r from-cyan-950/90 via-indigo-950/90 to-purple-950/90 border-b border-cyan-500/30 flex items-center justify-between text-xs font-mono animate-fadeIn">
          <div className="flex items-center gap-2 text-cyan-300">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="font-semibold uppercase tracking-wider text-cyan-400">Step Action:</span>
            <span>{activeStep.message}</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            Node: {activeStep.nodeId.slice(0, 8)}
          </span>
        </div>
      )}

      {/* Horizontal Canvas with Scroll */}
      <div className="p-8 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
        <div className="flex items-center gap-4 min-w-max py-6">
          {/* NULL Sentinel on Left of Head */}
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/40 border border-dashed border-slate-700 text-slate-500 font-mono text-xs select-none">
            <span className="font-bold text-slate-400">NULL</span>
            <span className="text-[10px] text-slate-600">HEAD.prev</span>
          </div>

          <div className="flex items-center text-slate-600">
            <ArrowLeft className="w-5 h-5 text-purple-400/60" />
          </div>

          {/* Render All Linked Nodes */}
          {nodes.map((node, index) => {
            const isHead = index === 0;
            const isTail = index === nodes.length - 1;
            const isActive = activeStep?.nodeId === node.id;

            return (
              <React.Fragment key={node.id}>
                <div
                  onClick={() => onSelectNode(node)}
                  className={`relative group w-72 rounded-2xl transition-all duration-300 cursor-pointer select-none ${
                    isActive
                      ? 'ring-2 ring-cyan-400 ring-offset-4 ring-offset-slate-950 shadow-2xl shadow-cyan-500/30 scale-105 bg-slate-900 border-cyan-400'
                      : 'bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:shadow-xl hover:shadow-black/60'
                  }`}
                >
                  {/* Floating Badges for Head / Tail */}
                  <div className="absolute -top-3 left-4 flex gap-1.5 z-10">
                    {isHead && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 flex items-center gap-1">
                        HEAD
                      </span>
                    )}
                    {isTail && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 flex items-center gap-1">
                        TAIL
                      </span>
                    )}
                  </div>

                  {/* Index Counter on Top Right */}
                  <div className="absolute -top-3 right-4 z-10">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
                      idx: {index}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 pt-5">
                    {/* Memory Address & Actions */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-slate-500 uppercase">Addr:</span>
                        <span className="text-xs font-mono font-semibold text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-900/50">
                          {node.memoryAddress}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditNode(node);
                          }}
                          title="Edit Task Data"
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteNode(node.id);
                          }}
                          title="Delete Node (O(n) or O(1))"
                          className="p-1 rounded hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Task Title & Status */}
                    <div className="mb-2">
                      <div className="flex items-center gap-1.5 mb-1">
                        {getStatusIcon(node.data.status)}
                        <h4 className="text-sm font-semibold text-slate-100 line-clamp-1">
                          {node.data.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 min-h-[32px]">
                        {node.data.description}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getPriorityColor(node.data.priority)}`}>
                        {node.data.priority.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {node.data.category}
                      </span>
                    </div>

                    {/* Pointer Info Box (prev & next addresses) */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 font-mono text-[10px]">
                      <div className="bg-purple-950/30 border border-purple-900/40 rounded-lg p-1.5 text-center">
                        <span className="text-purple-400 block text-[9px] uppercase font-bold">PREV</span>
                        <span className="text-purple-200 truncate block">
                          {node.prevAddress ?? 'NULL'}
                        </span>
                      </div>
                      <div className="bg-cyan-950/30 border border-cyan-900/40 rounded-lg p-1.5 text-center">
                        <span className="text-cyan-400 block text-[9px] uppercase font-bold">NEXT</span>
                        <span className="text-cyan-200 truncate block">
                          {node.nextAddress ?? 'NULL'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Insert After Button Hover Overlay */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onInsertAfter(index + 1);
                    }}
                    title={`Insert new node at index ${index + 1}`}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-800 hover:bg-cyan-500 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-slate-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20 shadow-lg"
                  >
                    <PlusCircle className="w-4 h-4" />
                  </button>
                </div>

                {/* Connecting Bidirectional Pointers Between Nodes */}
                {index < nodes.length - 1 && (
                  <div className="flex flex-col items-center justify-center gap-1.5 px-2 select-none">
                    {/* Next Pointer (Right) */}
                    <div className="flex items-center gap-1 text-cyan-400">
                      <span className="text-[9px] font-mono text-cyan-500/70">next</span>
                      <div className="w-8 h-[2px] bg-cyan-500/60 relative">
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-400 absolute -right-2 -top-[6px]" />
                      </div>
                    </div>
                    {/* Prev Pointer (Left) */}
                    <div className="flex items-center gap-1 text-purple-400">
                      <div className="w-8 h-[2px] bg-purple-500/60 relative">
                        <ArrowLeft className="w-3.5 h-3.5 text-purple-400 absolute -left-2 -top-[6px]" />
                      </div>
                      <span className="text-[9px] font-mono text-purple-500/70">prev</span>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}

          {/* Right Arrow to NULL Sentinel */}
          <div className="flex items-center text-slate-600">
            <ArrowRight className="w-5 h-5 text-cyan-400/60" />
          </div>

          {/* NULL Sentinel on Right of Tail */}
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/40 border border-dashed border-slate-700 text-slate-500 font-mono text-xs select-none">
            <span className="font-bold text-slate-400">NULL</span>
            <span className="text-[10px] text-slate-600">TAIL.next</span>
          </div>
        </div>
      </div>
    </div>
  );
};
