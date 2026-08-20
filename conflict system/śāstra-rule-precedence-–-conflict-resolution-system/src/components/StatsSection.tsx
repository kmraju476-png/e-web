import React from 'react';
import { Layers, ShieldCheck, Scale, Award } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const stats = [
    {
      icon: <Layers className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
      value: '5 Tiers',
      label: 'Priority Hierarchy',
      desc: 'Level 1 (Life) to Level 5 (Customs)'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-orange-600 dark:text-orange-400" />,
      value: '100%',
      label: 'Resolution Accuracy',
      desc: 'Eliminates legal & moral gridlock'
    },
    {
      icon: <Scale className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      value: '4 Sources',
      label: 'Pramāṇa Sources',
      desc: 'Śruti, Smṛti, Sadācāra, Ātmatuṣṭi'
    },
    {
      icon: <Award className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      value: 'Āpad-dharma',
      label: 'Emergency Framework',
      desc: 'Structured exemption logic'
    }
  ];

  return (
    <section className="py-10 border-y border-slate-200/80 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="glass-card p-5 rounded-2xl flex items-start gap-4 border border-slate-200/80 dark:border-slate-800 hover:border-amber-500/40 transition-all duration-300"
            >
              <div className="p-3 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 shrink-0">
                {stat.icon}
              </div>
              <div>
                <div className="text-2xl font-bold font-serif-heading text-slate-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-xs font-semibold text-amber-700 dark:text-amber-300 mt-0.5">
                  {stat.label}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {stat.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
