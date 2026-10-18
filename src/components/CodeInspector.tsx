'use client';

import React, { useState } from 'react';
import { OperationLog } from '../dsa/types';
import { Terminal, Code2, Cpu, History, Zap, Copy, Check } from 'lucide-react';

interface CodeInspectorProps {
  logs: OperationLog[];
  currentLog: OperationLog | null;
}

export const CodeInspector: React.FC<CodeInspectorProps> = ({ logs, currentLog }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [viewTab, setViewTab] = useState<'code' | 'logs'>('code');

  const active = currentLog || logs[0];

  const handleCopyCode = () => {
    if (active?.codeSnippet) {
      navigator.clipboard.writeText(active.codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col h-full">
      {/* Header with Complexity Badges */}
      <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 p-1 bg-slate-900 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewTab('code')}
              className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
                viewTab === 'code' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              DSA Algorithm
            </button>
            <button
              onClick={() => setViewTab('logs')}
              className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
                viewTab === 'logs' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Logs ({logs.length})
            </button>
          </div>
        </div>

        {active && (
          <div className="flex items-center gap-3">
            {/* Time Complexity */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-900/40 text-[11px] font-mono text-emerald-300">
              <Zap className="w-3 h-3 text-emerald-400" />
              <span>Time: {active.timeComplexity}</span>
            </div>
            {/* Space Complexity */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-950/40 border border-indigo-900/40 text-[11px] font-mono text-indigo-300">
              <Cpu className="w-3 h-3 text-indigo-400" />
              <span>Space: {active.spaceComplexity}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Body */}
      {viewTab === 'code' ? (
        <div className="p-4 flex-1 flex flex-col">
          {active ? (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/60">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-200">{active.title}</span>
                  <span className="text-[10px] font-mono text-slate-500">{active.description}</span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                  title="Copy code"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Code Snippet Box with Syntax Highlight Style */}
              <div className="flex-1 rounded-xl bg-slate-950 p-4 border border-slate-800/80 font-mono text-xs text-slate-300 overflow-x-auto overflow-y-auto max-h-72">
                <pre className="leading-relaxed">
                  <code>{active.codeSnippet}</code>
                </pre>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-xs font-mono">
              Execute any CRUD or DSA operation to inspect the pointer logic.
            </div>
          )}
        </div>
      ) : (
        /* Operations Log List */
        <div className="p-4 flex-1 overflow-y-auto max-h-80 space-y-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs font-mono"
            >
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold text-slate-200">{log.title}</span>
                <span className="text-[10px] text-slate-500">{log.description}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-emerald-400 font-semibold">{log.timeComplexity}</span>
                <span className="text-[10px] text-slate-600">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
