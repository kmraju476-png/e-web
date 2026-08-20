/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Rule, ActivePage } from './types';
import { INITIAL_RULES } from './data/rulesData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { RuleLibrary } from './components/RuleLibrary';
import { ConflictResolver } from './components/ConflictResolver';
import { RuleFlowchart } from './components/RuleFlowchart';
import { CaseStudies } from './components/CaseStudies';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [rules, setRules] = useState<Rule[]>(() => {
    const saved = localStorage.getItem('sastra_rules');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_RULES;
      }
    }
    return INITIAL_RULES;
  });

  // Handle dark mode class toggle on root html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Persist rules in local storage
  useEffect(() => {
    localStorage.setItem('sastra_rules', JSON.stringify(rules));
  }, [rules]);

  // Scrollspy to set active page based on scroll position
  useEffect(() => {
    const sections: ActivePage[] = ['home', 'about', 'rules', 'resolver', 'flowchart', 'casestudies', 'faq', 'contact'];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActivePage(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddRule = (newRule: Rule) => {
    setRules((prev) => [newRule, ...prev]);
  };

  const handleResetRules = () => {
    setRules(INITIAL_RULES);
    localStorage.removeItem('sastra_rules');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 selection:bg-amber-500 selection:text-white">
      {/* Sticky Navigation Header */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Content Sections */}
      <main className="flex-1 space-y-12">
        {/* 1. Hero Section */}
        <Hero setActivePage={setActivePage} />

        {/* 2. About Section */}
        <AboutSection />

        {/* 3. Rule Library */}
        <RuleLibrary
          rules={rules}
          onAddRule={handleAddRule}
          onResetRules={handleResetRules}
        />

        {/* 4. Conflict Resolver Engine */}
        <ConflictResolver rules={rules} />

        {/* 5. Rule Precedence Flowchart */}
        <RuleFlowchart />

        {/* 6. Case Studies */}
        <CaseStudies />

        {/* 7. FAQ Section */}
        <FAQSection />

        {/* 8. Contact Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer setActivePage={setActivePage} />
    </div>
  );
}
