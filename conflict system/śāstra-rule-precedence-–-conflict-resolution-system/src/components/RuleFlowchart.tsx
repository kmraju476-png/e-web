import React, { useState } from 'react';
import { FLOW_STEPS } from '../data/flowData';
import { GitBranch, AlertTriangle, GitCompare, ShieldCheck, FileText, ArrowDown, Check, Sparkles, Code } from 'lucide-react';

export const RuleFlowchart: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState<number>(1);

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'AlertTriangle':
        return <AlertTriangle className="w-6 h-6 text-amber-500" />;
      case 'GitCompare':
        return <GitCompare className="w-6 h-6 text-orange-500" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-emerald-500" />;
      case 'FileText':
        return <FileText className="w-6 h-6 text-indigo-500" />;
      default:
        return <GitBranch className="w-6 h-6 text-amber-500" />;
    }
  };

  return (
    <section id="flowchart" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
            <GitBranch className="w-3.5 h-3.5" />
            <span>Process Flow & System Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-heading text-slate-900 dark:text-white">
            Rule Precedence Flowchart
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm">
            Visualizing the step-by-step algorithm executed when evaluating and resolving rule conflicts under Śāstric logic.
          </p>
        </div>

        {/* Visual Flowchart Stack & Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Flow Diagram Column (Left) */}
          <div className="lg:col-span-6 space-y-4">
            {FLOW_STEPS.map((step, idx) => {
              const isSelected = selectedStep === step.stepNumber;
              return (
                <React.Fragment key={step.stepNumber}>
                  {/* Step Card Node */}
                  <div
                    onClick={() => setSelectedStep(step.stepNumber)}
                    className={`glass-card p-5 sm:p-6 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-amber-500 saffron-glow bg-amber-500/10 dark:bg-amber-500/15 ring-2 ring-amber-500/30'
                        : 'border-slate-200 dark:border-slate-800 hover:border-amber-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                        {getStepIcon(step.iconName)}
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                          Step 0{step.stepNumber}
                        </div>
                        <h3 className="text-lg font-bold font-serif-heading text-slate-900 dark:text-white">
                          {step.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {step.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className={`p-2 rounded-xl transition-all ${isSelected ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                      <Check className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Connecting Connector Arrow */}
                  {idx < FLOW_STEPS.length - 1 && (
                    <div className="flex justify-center py-1">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 animate-bounce">
                        <ArrowDown className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Detailed Inspector Panel (Right) */}
          <div className="lg:col-span-6 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl relative overflow-hidden border border-slate-800 lg:sticky lg:top-28">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Selected Step Header */}
            {(() => {
              const currentStep = FLOW_STEPS.find((s) => s.stepNumber === selectedStep) || FLOW_STEPS[0];
              return (
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Phase 0{currentStep.stepNumber} Analysis
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" /> System State Active
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold font-serif-heading text-white">
                      {currentStep.title}
                    </h3>
                    <p className="text-xs text-amber-400 font-medium mt-0.5">
                      {currentStep.subtitle}
                    </p>
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed">
                    {currentStep.description}
                  </p>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 font-mono text-xs text-emerald-400">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                      <Code className="w-3.5 h-3.5 text-emerald-500" />
                      Technical Implementation Logic:
                    </div>
                    <p className="leading-relaxed text-slate-200">
                      {currentStep.technicalLogic}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-400">
                    <span className="font-semibold text-white">Śāstric Correlation: </span>
                    Matches the <em>Pūrva Mīmāṁsā Nyāya</em> resolution sequence defined in the Jaimini Sūtras.
                  </div>
                </div>
              );
            })()}
          </div>

        </div>

      </div>
    </section>
  );
};
