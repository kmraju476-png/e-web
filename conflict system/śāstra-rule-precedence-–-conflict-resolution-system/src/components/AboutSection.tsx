import React, { useState } from 'react';
import { BookOpen, Scale, AlertCircle, ShieldAlert, Sparkles, Check, ChevronRight, Layers } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const [activeSource, setActiveSource] = useState<number>(0);

  const pramanaSources = [
    {
      title: 'Fundamental Rights & Constitutional Statutes',
      sanskrit: 'Primary Mandate (Level 1)',
      level: 'Rank 1 (Supreme Authority)',
      color: 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300',
      description: 'Foundational non-derogable principles protecting life, safety, and basic human dignity. When a primary statute conflicts with lower administrative or custom rules, the primary statute automatically invalidates lesser claims.'
    },
    {
      title: 'Statutory Regulations & Codified Acts',
      sanskrit: 'Statutory Acts (Level 2)',
      level: 'Rank 2 (Derived Statutory Treatises)',
      color: 'border-orange-500 bg-orange-500/10 text-orange-700 dark:text-orange-300',
      description: 'Enacted legislation, professional codes of conduct, and formal regulatory frameworks created to govern public duty and institutional equity.'
    },
    {
      title: 'Customary Law & Established Precedent',
      sanskrit: 'Customary Precedent (Level 3)',
      level: 'Rank 3 (Customary Precedent)',
      color: 'border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300',
      description: 'Established judicial precedent, institutional norms, and community practices applied when explicit written statutes are silent or require interpretation.'
    },
    {
      title: 'Equitable Discretion & Rational Conscience',
      sanskrit: 'Equitable Discretion (Level 4)',
      level: 'Rank 4 (Individual Rational Equity)',
      color: 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
      description: 'The internal application of fairness, moral reason, and proportional justice when evaluating novel, unprecedented edge cases.'
    }
  ];

  return (
    <section id="about" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Theoretical Foundations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-heading text-slate-900 dark:text-white">
            Rule Precedence & Legal Logic Architecture
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base">
            Exploring how rule precedence frameworks build priority algorithms to resolve real-world conflicts, legal paradoxes, and rule contradictions.
          </p>
        </div>

        {/* 4 Core Concept Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: What is Rule Precedence? */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-serif-heading text-slate-900 dark:text-white flex items-center gap-2">
              <span>What is a Rule System?</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-sans font-bold">Expert Logic</span>
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              A <strong>Rule Precedence Framework</strong> structures knowledge into conditional rules (If-Then statements). It provides a transparent, auditable framework for evaluating complex scenarios where multiple regulations or operational policies intersect.
            </p>
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Structured Decision Trees & Formal Logic Systems</span>
            </div>
          </div>

          {/* Card 2: Priority Hierarchy */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-serif-heading text-slate-900 dark:text-white flex items-center gap-2">
              <span>Priority Hierarchy</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 font-sans font-bold">Tiers 1–5</span>
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              <strong>Priority Hierarchy</strong> assigns explicit numeric ranks to rules. Lower numerical ranks (Priority 1: Life Safety) strictly override higher numerical ranks (Priority 4: Personal Commitments, Priority 5: Routine Customs), guaranteeing deterministic outcomes.
            </p>
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>Ordered Ranks: Priority 1 (Highest) &rarr; Priority 5 (Lowest)</span>
            </div>
          </div>

          {/* Card 3: What is Conflict Resolution? */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-serif-heading text-slate-900 dark:text-white flex items-center gap-2">
              <span>Conflict Resolution Engine</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-sans font-bold">Algorithmic</span>
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              <strong>Conflict Resolution</strong> is the computational engine triggered when two active rules require mutually exclusive actions. The engine compares priority ranks, applies emergency overrides, and generates a single authoritative verdict.
            </p>
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Automated Conflict Detection & Precedence Evaluation</span>
            </div>
          </div>

          {/* Card 4: Why Precedence is Necessary */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-serif-heading text-slate-900 dark:text-white flex items-center gap-2">
              <span>Why Precedence Matters</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 font-sans font-bold">Emergency Overrides</span>
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Without defined precedence, decision engines stall in deadlock or produce dangerous contradictions (e.g., maintaining standard non-disclosure policies during an active safety emergency). Emergency protocols grant immediate exemption.
            </p>
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-red-500" />
              <span>Emergency Exemption Protocols Activate Under Crisis</span>
            </div>
          </div>

        </div>

        {/* Interactive Source Hierarchy Timeline / Stack */}
        <div className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Layers className="w-3.5 h-3.5" />
                <span>Epistemological Hierarchy</span>
              </div>
              <h3 className="text-2xl font-bold font-serif-heading text-slate-900 dark:text-white">
                The 4 Evidentiary Sources of Legal Hierarchy
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-1">
                Formal legal systems use an explicit 4-tier evidentiary cascade when determining rule legitimacy and authority.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Stack Controls */}
            <div className="lg:col-span-5 space-y-3">
              {pramanaSources.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSource(index)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    activeSource === index
                      ? `${item.color} shadow-md`
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold tracking-wider opacity-80">
                      {item.level}
                    </div>
                    <div className="font-bold text-sm font-serif-heading">
                      {item.title}
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 transition-transform ${activeSource === index ? 'rotate-90 text-amber-600' : ''}`} />
                </button>
              ))}
            </div>

            {/* Right Detailed Inspector Panel */}
            <div className="lg:col-span-7 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-6 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {pramanaSources[activeSource].level}
                </span>
                <span className="text-sm font-bold text-amber-400">
                  {pramanaSources[activeSource].sanskrit}
                </span>
              </div>

              <div className="space-y-3">
                <h4 className="text-2xl font-bold font-serif-heading text-white">
                  {pramanaSources[activeSource].title}
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {pramanaSources[activeSource].description}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 space-y-2">
                <div className="font-semibold text-amber-400 flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>Rule Hierarchy Application:</span>
                </div>
                <p>
                  In any evidentiary conflict, Rank {activeSource + 1} instantly overrides Rank {Math.min(activeSource + 2, 4)}. This ensures derived administrative customs never override fundamental human safety or basic constitutional rights.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
