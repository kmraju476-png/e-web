import React, { useState } from 'react';
import { CASE_STUDIES } from '../data/caseStudiesData';
import { FileText, BookOpen, ShieldCheck, ChevronDown, ChevronUp, Sparkles, Scale } from 'lucide-react';

export const CaseStudies: React.FC = () => {
  const [expandedCaseId, setExpandedCaseId] = useState<string>(CASE_STUDIES[0].id);

  const toggleExpand = (id: string) => {
    setExpandedCaseId((prev) => (prev === id ? '' : id));
  };

  return (
    <section id="casestudies" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" />
            <span>Practical Legal & Classical Applications</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-heading text-slate-900 dark:text-white">
            Case Studies & Real-World Dilemmas
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm">
            Examine how Śāstric rule precedence resolves historical, classical, and modern real-world moral dilemmas.
          </p>
        </div>

        {/* Case Studies Grid */}
        <div className="space-y-6">
          {CASE_STUDIES.map((study) => {
            const isExpanded = expandedCaseId === study.id;
            return (
              <div
                key={study.id}
                className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-md transition-all hover:border-amber-500/40"
              >
                {/* Accordion Header */}
                <div
                  onClick={() => toggleExpand(study.id)}
                  className="p-6 sm:p-8 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-100/60 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        {study.source}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        {study.subtitle}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold font-serif-heading text-slate-900 dark:text-white">
                      {study.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                      <ShieldCheck className="w-4 h-4" />
                      <span>View Precedence Analysis</span>
                    </span>
                    <button className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Accordion Body */}
                {isExpanded && (
                  <div className="p-6 sm:p-8 border-t border-slate-200 dark:border-slate-800 space-y-6 animate-in slide-in-from-top-2 duration-300">
                    
                    {/* Scenario Description */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-amber-500" /> Scenario Narrative
                      </h4>
                      <p className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                        {study.scenario}
                      </p>
                    </div>

                    {/* Precedence Breakdown Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Śāstric Rationale */}
                      <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                        <div className="font-bold text-sm text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-amber-600" />
                          Śāstric Precedence Rationale:
                        </div>
                        <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                          {study.shastricRationale}
                        </p>
                      </div>

                      {/* Modern Parallel */}
                      <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 space-y-2">
                        <div className="font-bold text-sm text-indigo-800 dark:text-indigo-300 flex items-center gap-1.5">
                          <Scale className="w-4 h-4 text-indigo-600" />
                          Modern Legal & Ethical Parallel:
                        </div>
                        <p className="text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed">
                          {study.modernParallel}
                        </p>
                      </div>

                    </div>

                    {/* Key Takeaway Banner */}
                    <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center gap-3 text-xs">
                      <div className="w-8 h-8 rounded-xl saffron-gradient flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <span className="font-bold text-amber-400">Core Jurisprudential Principle: </span>
                        <span>{study.keyTakeaway}</span>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
