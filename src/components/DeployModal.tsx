'use client';

import React, { useState } from 'react';
import { X, Check, Copy, Terminal, ExternalLink, ShieldCheck, Rocket } from 'lucide-react';

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeployModal: React.FC<DeployModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyCommand = (cmd: string, index: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden p-6 relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black border border-slate-700 flex items-center justify-center text-white">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 1155 1000">
                <path d="M577.346 0L1154.69 1000H0L577.346 0Z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                Deploy NodeForge to Vercel
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Ready
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Continuous deployment for Next.js App Router applications
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verification Checklist */}
        <div className="mb-5 bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-semibold text-slate-200">Production Build Passed</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 font-mono">
            <div>✓ Next.js App Router</div>
            <div>✓ TypeScript Strict Mode</div>
            <div>✓ Tailwind CSS Bundler</div>
            <div>✓ Zero Server State Leaks</div>
          </div>
        </div>

        {/* Method 1: Instant Vercel CLI */}
        <div className="space-y-4 text-xs">
          <div>
            <h4 className="font-semibold text-slate-200 flex items-center gap-1.5 mb-1.5">
              <Rocket className="w-4 h-4 text-cyan-400" />
              Option 1: Deploy with Vercel CLI (Instant)
            </h4>
            <p className="text-slate-400 text-[11px] mb-2">
              Run this single command inside the project directory:
            </p>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-cyan-300">
              <code>npx vercel --prod</code>
              <button
                onClick={() => copyCommand('npx vercel --prod', 1)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Method 2: GitHub Repository Push */}
          <div>
            <h4 className="font-semibold text-slate-200 flex items-center gap-1.5 mb-1.5">
              <Terminal className="w-4 h-4 text-purple-400" />
              Option 2: Push to GitHub & Connect to Vercel
            </h4>
            <p className="text-slate-400 text-[11px] mb-2">
              Push your Git repository to GitHub and import it on Vercel Dashboard:
            </p>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-purple-300">
              <code>git remote add origin https://github.com/&lt;user&gt;/&lt;repo&gt;.git &amp;&amp; git push -u origin main</code>
              <button
                onClick={() => copyCommand('git remote add origin https://github.com/<user>/<repo>.git && git push -u origin main', 2)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-5 mt-5 border-t border-slate-800 text-xs">
          <a
            href="https://vercel.com/new"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-cyan-400 hover:underline"
          >
            <span>Open Vercel Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
