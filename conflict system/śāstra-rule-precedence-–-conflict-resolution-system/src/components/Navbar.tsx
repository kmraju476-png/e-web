import React, { useState, useEffect } from 'react';
import { ActivePage } from '../types';
import { Scale, BookOpen, GitBranch, HelpCircle, Mail, Sun, Moon, Menu, X, Shield, Layers, FileText, Zap } from 'lucide-react';

interface NavbarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, setActivePage, darkMode, setDarkMode }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: ActivePage; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Scale className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> },
    { id: 'about', label: 'About', icon: <BookOpen className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> },
    { id: 'rules', label: 'Rules', icon: <Layers className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> },
    { id: 'resolver', label: 'Resolver', icon: <Zap className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> },
    { id: 'flowchart', label: 'Flow', icon: <GitBranch className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> },
    { id: 'casestudies', label: 'Cases', icon: <FileText className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> },
    { id: 'faq', label: 'FAQ', icon: <HelpCircle className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> },
    { id: 'contact', label: 'Contact', icon: <Mail className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> },
  ];

  const handleNavClick = (id: ActivePage) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-md border-b border-slate-200/80 dark:border-slate-800/80'
          : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-800/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[76px] flex items-center justify-between gap-3 md:gap-4">
        {/* Left Branding: Logo + Sanskrit Quote + Website Title */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-4 sm:gap-5 text-left group focus:outline-none min-w-0 shrink-0 sm:shrink"
        >
          {/* Logo with fixed width & height (44px x 44px) */}
          <div className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl saffron-gradient flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform shrink-0">
            <Shield className="w-6 h-6 stroke-[2.5]" />
          </div>

          {/* Website Title beside Logo */}
          <div className="flex flex-col justify-center min-w-0">
            <div className="font-serif-heading font-bold text-sm sm:text-base md:text-lg text-slate-900 dark:text-white leading-snug truncate">
              Śāstra Rule Precedence <span className="text-amber-600 dark:text-amber-400 font-sans font-semibold text-xs sm:text-sm">– Conflict Resolution System</span>
            </div>
          </div>
        </button>

        {/* Desktop Navigation Links (Visible on 768px/md and above) */}
        <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 bg-slate-100/80 dark:bg-slate-800/60 p-1 lg:p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shrink-0">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-1 lg:gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-xl text-xs lg:text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'saffron-gradient text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle Dark/Light Mode"
            className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all shrink-0"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-indigo-900" />}
          </button>

          {/* Quick CTA button */}
          <button
            onClick={() => handleNavClick('resolver')}
            className="hidden xl:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white saffron-gradient saffron-glow hover:opacity-95 transition-all transform active:scale-95 shrink-0"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Try Resolver</span>
          </button>

          {/* Mobile Hamburger Toggle (Visible on screens below 768px/md) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer (Below 768px/md) */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 pt-3 pb-6 space-y-3 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                    isActive
                      ? 'saffron-gradient text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => handleNavClick('resolver')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-white saffron-gradient saffron-glow"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Launch Conflict Resolver Engine</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
