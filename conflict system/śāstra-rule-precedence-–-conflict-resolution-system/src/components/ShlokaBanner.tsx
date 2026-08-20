import React from 'react';
import { Cpu, ShieldCheck, GitCommit, Layers } from 'lucide-react';

export const ShlokaBanner: React.FC = () => {
  return (
    <div className="bg-slate-900 text-slate-100 py-2.5 px-4 shadow-sm border-b border-slate-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
        
        {/* Left Project Tagline */}
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 font-bold tracking-wide uppercase text-[10px] border border-amber-500/30 shrink-0">
            Final Year CS Project
          </span>
          <div className="flex items-center gap-2 text-slate-300 font-medium truncate">
            <Cpu className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">Rule-Based Decision Support System & Conflict Resolution Engine</span>
          </div>
        </div>

        {/* Right Status Metrics / Highlights */}
        <div className="flex items-center gap-4 text-slate-400 text-[11px] font-medium shrink-0">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>5 Priority Tiers</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Deterministic Resolution</span>
          </div>
          <span className="text-slate-700 hidden md:inline">|</span>
          <div className="hidden md:flex items-center gap-1.5">
            <GitCommit className="w-3.5 h-3.5 text-indigo-400" />
            <span>Priority Hierarchy</span>
          </div>
        </div>

      </div>
    </div>
  );
};

