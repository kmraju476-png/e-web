import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  id?: string;
  title: string;
  value: number | string;
  icon: LucideIcon;
  colorScheme: 'rose' | 'amber' | 'emerald' | 'blue' | 'purple' | 'slate';
  subText?: string;
  trend?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  title,
  value,
  icon: Icon,
  colorScheme,
  subText,
  trend,
  onClick,
}) => {
  const schemeStyles = {
    rose: {
      bg: 'bg-rose-950/20 border-rose-900/40 hover:border-rose-700/60',
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      text: 'text-rose-400',
      glow: 'shadow-rose-950/20',
    },
    amber: {
      bg: 'bg-amber-950/20 border-amber-900/40 hover:border-amber-700/60',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      text: 'text-amber-400',
      glow: 'shadow-amber-950/20',
    },
    emerald: {
      bg: 'bg-emerald-950/20 border-emerald-900/40 hover:border-emerald-700/60',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      text: 'text-emerald-400',
      glow: 'shadow-emerald-950/20',
    },
    blue: {
      bg: 'bg-blue-950/20 border-blue-900/40 hover:border-blue-700/60',
      iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      text: 'text-blue-400',
      glow: 'shadow-blue-950/20',
    },
    purple: {
      bg: 'bg-purple-950/20 border-purple-900/40 hover:border-purple-700/60',
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      text: 'text-purple-400',
      glow: 'shadow-purple-950/20',
    },
    slate: {
      bg: 'bg-slate-900/50 border-slate-800 hover:border-slate-700',
      iconBg: 'bg-slate-800 text-slate-400 border-slate-700',
      text: 'text-slate-200',
      glow: 'shadow-slate-950/20',
    },
  };

  const current = schemeStyles[colorScheme] || schemeStyles.slate;

  return (
    <div
      id={id}
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border p-4 transition-all duration-200 ${current.bg} ${
        onClick ? 'cursor-pointer transform hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{value}</span>
            {trend && <span className="text-xs font-medium text-slate-400">{trend}</span>}
          </div>
        </div>
        <div className={`rounded-lg border p-2.5 ${current.iconBg}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {subText && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>{subText}</span>
        </div>
      )}
    </div>
  );
};
