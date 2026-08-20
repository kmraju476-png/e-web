import React, { useState } from 'react';
import { Rule } from '../types';
import { PRIORITY_TIERS } from '../data/rulesData';
import { Scale, Zap, ShieldCheck, AlertTriangle, ArrowRight, Sparkles, CheckCircle, RefreshCw, Award, BookOpen, Layers } from 'lucide-react';

interface ConflictResolverProps {
  rules: Rule[];
}

export const ConflictResolver: React.FC<ConflictResolverProps> = ({ rules }) => {
  const [ruleAId, setRuleAId] = useState<string>(rules[0]?.id || 'rule-1');
  const [ruleBId, setRuleBId] = useState<string>(rules[2]?.id || 'rule-3');
  const [isComparing, setIsComparing] = useState(false);
  const [hasCompared, setHasCompared] = useState(false);

  const ruleA = rules.find((r) => r.id === ruleAId) || rules[0];
  const ruleB = rules.find((r) => r.id === ruleBId) || rules[1];

  // Quick Dilemma Presets
  const presets = [
    { label: "Sage Kausika (Truth vs Life)", idA: 'rule-1', idB: 'rule-3' },
    { label: "Emergency Exemption (Vow vs Life)", idA: 'rule-1', idB: 'rule-9' },
    { label: "Magistrate's Duty (Justice vs Family)", idA: 'rule-5', idB: 'rule-6' },
    { label: "Public Interest (Safety vs Promise)", idA: 'rule-7', idB: 'rule-8' },
  ];

  const handleApplyPreset = (idA: string, idB: string) => {
    setRuleAId(idA);
    setRuleBId(idB);
    setHasCompared(false);
  };

  const handleCompare = () => {
    setIsComparing(true);
    setHasCompared(false);
    setTimeout(() => {
      setIsComparing(false);
      setHasCompared(true);
    }, 600);
  };

  // Precedence Logic Calculation
  const winner = ruleA && ruleB
    ? ruleA.priority < ruleB.priority
      ? ruleA
      : ruleB.priority < ruleA.priority
      ? ruleB
      : null // Tie condition
    : null;

  const loser = winner ? (winner.id === ruleA.id ? ruleB : ruleA) : null;
  const priorityDiff = winner && loser ? Math.abs(winner.priority - loser.priority) : 0;

  const getTierInfo = (p: number) => PRIORITY_TIERS.find((t) => t.level === p);

  return (
    <section id="resolver" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Interactive Decision Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-heading text-slate-900 dark:text-white">
            Śāstra Conflict Resolver
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm">
            Select any two conflicting rules from the Śāstric catalog or test custom parameters to observe how priority values dynamically resolve rule contradictions.
          </p>
        </div>

        {/* Quick Presets Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Classical Dilemma Presets:
          </span>
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(preset.idA, preset.idB)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                ruleAId === preset.idA && ruleBId === preset.idB
                  ? 'saffron-gradient text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Main Selection & Comparison Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Rule A Card */}
          <div className="lg:col-span-5 glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between shadow-md">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
                  Rule Option A
                </span>
                <span className="text-xs font-bold text-slate-400">Candidate 1</span>
              </div>

              {/* Select Dropdown A */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                  Select Rule A:
                </label>
                <select
                  value={ruleAId}
                  onChange={(e) => {
                    setRuleAId(e.target.value);
                    setHasCompared(false);
                  }}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-amber-500"
                >
                  {rules.map((r) => (
                    <option key={r.id} value={r.id} disabled={r.id === ruleBId}>
                      {r.name} (Priority {r.priority})
                    </option>
                  ))}
                </select>
              </div>

              {/* Display Details for Rule A */}
              {ruleA && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif-heading font-bold text-base text-slate-900 dark:text-white">
                      {ruleA.name}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                      Priority {ruleA.priority}
                    </span>
                  </div>
                  {ruleA.sanskritTerm && (
                    <p className="font-sanskrit text-xs text-amber-600 dark:text-amber-400">
                      {ruleA.sanskritTerm}
                    </p>
                  )}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                    {ruleA.description}
                  </p>
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-2">
              <BookOpen className="w-3.5 h-3.5 text-amber-500" />
              <span>Category: {ruleA?.category}</span>
            </div>
          </div>

          {/* VS Action Column */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center gap-4 py-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold font-serif-heading text-lg flex items-center justify-center border border-amber-500/30 shadow-inner">
              VS
            </div>

            <button
              onClick={handleCompare}
              disabled={isComparing || ruleAId === ruleBId}
              className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm text-white saffron-gradient saffron-glow flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 ${
                isComparing ? 'opacity-70 animate-pulse' : 'hover:opacity-95'
              }`}
            >
              {isComparing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Evaluating...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Compare Priority</span>
                </>
              )}
            </button>
          </div>

          {/* Rule B Card */}
          <div className="lg:col-span-5 glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between shadow-md">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                  Rule Option B
                </span>
                <span className="text-xs font-bold text-slate-400">Candidate 2</span>
              </div>

              {/* Select Dropdown B */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                  Select Rule B:
                </label>
                <select
                  value={ruleBId}
                  onChange={(e) => {
                    setRuleBId(e.target.value);
                    setHasCompared(false);
                  }}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-blue-500"
                >
                  {rules.map((r) => (
                    <option key={r.id} value={r.id} disabled={r.id === ruleAId}>
                      {r.name} (Priority {r.priority})
                    </option>
                  ))}
                </select>
              </div>

              {/* Display Details for Rule B */}
              {ruleB && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif-heading font-bold text-base text-slate-900 dark:text-white">
                      {ruleB.name}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                      Priority {ruleB.priority}
                    </span>
                  </div>
                  {ruleB.sanskritTerm && (
                    <p className="font-sanskrit text-xs text-blue-600 dark:text-blue-400">
                      {ruleB.sanskritTerm}
                    </p>
                  )}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                    {ruleB.description}
                  </p>
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-2">
              <BookOpen className="w-3.5 h-3.5 text-blue-500" />
              <span>Category: {ruleB?.category}</span>
            </div>
          </div>

        </div>

        {/* Result Card Section */}
        {hasCompared && (
          <div className="animate-in slide-in-from-bottom duration-500">
            <div className="glass-card p-8 rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/5 via-amber-500/5 to-slate-900/10 dark:from-emerald-500/10 dark:via-slate-900 dark:to-slate-900 shadow-2xl relative overflow-hidden">
              
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-6 relative z-10">
                
                {/* Result Status Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Precedence Verdict Issued</span>
                      </div>
                      <h3 className="text-2xl font-bold font-serif-heading text-slate-900 dark:text-white">
                        {winner ? winner.name : 'Equal Priority Matrix (Tie)'} Takes Precedence
                      </h3>
                    </div>
                  </div>

                  <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold text-sm text-center">
                    {winner ? `Winning Priority: Level ${winner.priority}` : 'Priority Level Conflict'}
                  </div>
                </div>

                {/* Resolution Explanation Grid */}
                {winner && loser ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Left: Decision Analysis */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-sm font-serif-heading text-slate-900 dark:text-white flex items-center gap-2">
                        <Award className="w-4 h-4 text-emerald-500" />
                        <span>Precedence Decision Analysis:</span>
                      </h4>

                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                        <p>
                          <strong className="text-emerald-600 dark:text-emerald-400">{winner.name}</strong> holds an assigned priority index of <strong>Level {winner.priority}</strong>, whereas <strong className="text-slate-400">{loser.name}</strong> holds an index of <strong>Level {loser.priority}</strong>.
                        </p>
                        <p>
                          In Śāstric conflict resolution mathematics, lower priority indices (Level 1 &gt; Level 2 &gt; Level 3 &gt; Level 4 &gt; Level 5) signify higher normative authority. Thus, <strong>{winner.name}</strong> takes absolute precedence by a margin of <strong>{priorityDiff} level(s)</strong>.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs font-medium space-y-1">
                        <div className="font-bold flex items-center gap-1 text-amber-700 dark:text-amber-300">
                          <BookOpen className="w-3.5 h-3.5" /> Śāstric Maxim (Apad-dharma Principle):
                        </div>
                        <p>
                          "{loser.name}" is temporarily suspended under the doctrine of <em>Āpad-dharma</em> to fulfill the higher obligation of "{winner.name}". No moral sin or legal fault is incurred by the actor.
                        </p>
                      </div>
                    </div>

                    {/* Right: Comparative Breakdown */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-sm font-serif-heading text-slate-900 dark:text-white flex items-center gap-2">
                        <Layers className="w-4 h-4 text-amber-500" />
                        <span>Comparative Precedence Matrix:</span>
                      </h4>

                      <div className="space-y-3">
                        
                        {/* Winner Tier */}
                        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                          <div>
                            <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                              Governing Priority (Level {winner.priority})
                            </div>
                            <div className="font-bold text-sm text-slate-900 dark:text-white">
                              {winner.name}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {getTierInfo(winner.priority)?.title}
                            </div>
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-sm">
                            GOVERNS
                          </span>
                        </div>

                        {/* Loser Tier */}
                        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between opacity-70">
                          <div>
                            <div className="text-[11px] font-bold text-slate-400 uppercase">
                              Subordinated Priority (Level {loser.priority})
                            </div>
                            <div className="font-bold text-sm text-slate-700 dark:text-slate-300">
                              {loser.name}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {getTierInfo(loser.priority)?.title}
                            </div>
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            SUSPENDED
                          </span>
                        </div>

                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-sm space-y-2">
                    <div className="font-bold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Equal Priority Tie-Breaker Activated:</span>
                    </div>
                    <p className="text-xs leading-relaxed">
                      Both rules share an identical Priority Level ({ruleA?.priority}). In Śāstra, when two rules have identical priority, the secondary tie-breaker sequence applies: (1) Check Pramāṇa hierarchy (Śruti &gt; Smṛti), (2) Evaluate broader Loka-saṅgraha (public benefit), and (3) Seek consensus among virtuous elders (Sadācāra).
                    </p>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
