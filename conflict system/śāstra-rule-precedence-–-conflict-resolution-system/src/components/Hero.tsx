import React from 'react';
import { ActivePage } from '../types';
import { Zap, ArrowRight, BookOpen } from 'lucide-react';

interface HeroProps {
  setActivePage: (page: ActivePage) => void;
}

export const Hero: React.FC<HeroProps> = ({ setActivePage }) => {
  const handleNav = (page: ActivePage) => {
    setActivePage(page);
    const elem = document.getElementById(page);
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative pt-12 sm:pt-16 pb-16 sm:pb-20 overflow-hidden">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 text-left space-y-6">
            {/* 1. Project Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Śāstra Rule Precedence <br />
              <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 bg-clip-text text-transparent">
                – Conflict Resolution System
              </span>
            </h1>

            {/* 2. One Short Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl font-normal leading-relaxed">
              A rule-based framework for resolving conflicts between multiple rules using precedence hierarchy.
            </p>

            {/* 3 & 4. Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => handleNav('resolver')}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold text-white saffron-gradient saffron-glow hover:opacity-95 transition-all transform active:scale-95 shadow-md"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Try Conflict Resolver</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleNav('about')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 transition-all"
              >
                <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Learn More</span>
              </button>
            </div>
          </div>

          {/* Right Vector Graphic: Clean Scales of Precedence */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl glass-card p-6 sm:p-8 flex flex-col items-center justify-center shadow-xl border border-amber-500/20 dark:border-amber-500/30 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 via-orange-500/10 to-indigo-500/5 pointer-events-none" />

              {/* Central Vector SVG Illustration */}
              <div className="relative z-10 my-4 flex flex-col items-center">
                <svg
                  viewBox="0 0 200 200"
                  className="w-52 h-52 sm:w-60 sm:h-60 drop-shadow-md"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="100" cy="100" r="90" fill="url(#saffronGlow)" opacity="0.15" />
                  <circle cx="100" cy="100" r="80" stroke="#f97316" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.4" />

                  {/* Base Platform */}
                  <path d="M70 160 C85 145, 115 145, 130 160 C115 170, 85 170, 70 160 Z" fill="#d97706" opacity="0.8" />
                  <path d="M85 155 C92 140, 108 140, 115 155 Z" fill="#ea580c" />

                  {/* Central Pillar */}
                  <rect x="96" y="50" width="8" height="95" rx="4" fill="url(#pillarGrad)" />
                  <circle cx="100" cy="45" r="10" fill="#f97316" />

                  {/* Scales Beam */}
                  <path d="M40 70 L160 70" stroke="#d97706" strokeWidth="5" strokeLinecap="round" />
                  <circle cx="100" cy="70" r="6" fill="#1e3a8a" />

                  {/* Left Scale Pan */}
                  <path d="M40 70 L25 110 L55 110 Z" stroke="#ea580c" strokeWidth="1.5" fill="none" opacity="0.6" />
                  <path d="M20 110 C20 122, 60 122, 60 110 Z" fill="url(#saffronGrad)" />

                  {/* Right Scale Pan */}
                  <path d="M160 70 L145 95 L175 95 Z" stroke="#64748b" strokeWidth="1.5" fill="none" opacity="0.6" />
                  <path d="M140 95 C140 107, 180 107, 180 95 Z" fill="#334155" opacity="0.8" />

                  {/* Rule Codex Symbol Overlay */}
                  <path d="M60 135 C80 125, 100 135, 100 135 C100 135, 120 125, 140 135 L140 150 C120 140, 100 150, 100 150 C100 150, 80 140, 60 150 Z" fill="#ffffff" stroke="#d97706" strokeWidth="1.5" />
                  <line x1="70" y1="140" x2="90" y2="140" stroke="#94a3b8" strokeWidth="1" />
                  <line x1="110" y1="140" x2="130" y2="140" stroke="#94a3b8" strokeWidth="1" />

                  {/* Gradients */}
                  <defs>
                    <linearGradient id="saffronGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                    <linearGradient id="pillarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1e3a8a" />
                      <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>
                    <radialGradient id="saffronGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                </svg>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
