import React, { useState, useEffect } from 'react';
import { ActivePage } from '../types';
import { Shield, ArrowUp, Heart, BookOpen, Layers, Zap, GitBranch, FileText, HelpCircle, Mail } from 'lucide-react';

interface FooterProps {
  setActivePage: (page: ActivePage) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage }) => {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (page: ActivePage) => {
    setActivePage(page);
    const elem = document.getElementById(page);
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Synopsis */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl saffron-gradient flex items-center justify-center text-white shadow-md">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <span className="font-serif-heading font-bold text-xl text-white">
                  Śāstra Rule Precedence
                </span>
                <p className="text-xs text-amber-400 font-medium">
                  Conflict Resolution System
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              An educational research applet demonstrating deterministic conflict resolution between contradictory mandates using classical Indian Śāstric precedence tiers (Pūrva Mīmāṁsā & Apad-dharma).
            </p>

            <div className="text-xs text-slate-500 font-mono pt-1">
              Final Year College Project • Computer Science & Ancient Logic
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-serif-heading text-sm font-bold text-white uppercase tracking-wider">
              Quick Navigation
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button onClick={() => handleNav('home')} className="text-left text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Home
              </button>
              <button onClick={() => handleNav('about')} className="text-left text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> About Śāstra
              </button>
              <button onClick={() => handleNav('rules')} className="text-left text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Rule Library
              </button>
              <button onClick={() => handleNav('resolver')} className="text-left text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Conflict Resolver
              </button>
              <button onClick={() => handleNav('flowchart')} className="text-left text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5" /> Precedence Flow
              </button>
              <button onClick={() => handleNav('casestudies')} className="text-left text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Case Studies
              </button>
              <button onClick={() => handleNav('faq')} className="text-left text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" /> FAQ
              </button>
              <button onClick={() => handleNav('contact')} className="text-left text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Contact
              </button>
            </div>
          </div>

          {/* Col 3: Academic Citation Note */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-serif-heading text-sm font-bold text-white uppercase tracking-wider">
              Project Architecture
            </h4>
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 space-y-2">
              <span className="text-amber-400 block font-bold text-sm">
                Rule-Based Decision Logic
              </span>
              <p className="text-[11px] leading-relaxed text-slate-400">
                Rule Precedence & Emergency Exemption Algorithms designed to eliminate ambiguity and produce deterministic, auditable decisions in automated expert architectures.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Credits Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Śāstra Rule Precedence System. Academic College Project.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> for Indian Heritage & Modern Technology
          </p>
        </div>

      </div>

      {/* Back to Top Floating Button */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 p-3.5 rounded-2xl saffron-gradient text-white shadow-2xl hover:scale-110 active:scale-95 transition-all z-40 border border-amber-400/30"
        >
          <ArrowUp className="w-5 h-5 stroke-[2.5]" />
        </button>
      )}
    </footer>
  );
};
