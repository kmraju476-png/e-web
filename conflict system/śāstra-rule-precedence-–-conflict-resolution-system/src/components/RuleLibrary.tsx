import React, { useState, useMemo } from 'react';
import { Rule } from '../types';
import { PRIORITY_TIERS } from '../data/rulesData';
import { Search, Filter, Layers, BookOpen, Plus, X, Sparkles, Check, Info, ChevronRight, RefreshCw } from 'lucide-react';

interface RuleLibraryProps {
  rules: Rule[];
  onAddRule: (rule: Rule) => void;
  onResetRules: () => void;
}

export const RuleLibrary: React.FC<RuleLibraryProps> = ({ rules, onAddRule, onResetRules }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<number | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [inspectRule, setInspectRule] = useState<Rule | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Rule Form State
  const [newRuleName, setNewRuleName] = useState('');
  const [newRulePriority, setNewRulePriority] = useState<number>(3);
  const [newRuleCategory, setNewRuleCategory] = useState<Rule['category']>('Duty & Justice');
  const [newRuleDesc, setNewRuleDesc] = useState('');
  const [newRuleSanskrit, setNewRuleSanskrit] = useState('');
  const [newRuleExample, setNewRuleExample] = useState('');

  const categories = ['all', 'Ethics & Life', 'Truth & Speech', 'Duty & Justice', 'Relationships', 'Vows & Promises', 'Custom'];

  const filteredRules = useMemo(() => {
    return rules.filter((rule) => {
      const matchesSearch =
        rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (rule.sanskritTerm && rule.sanskritTerm.toLowerCase().includes(searchQuery.toLowerCase())) ||
        rule.keywords.some((kw) => kw.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesPriority = selectedPriority === 'all' || rule.priority === selectedPriority;
      const matchesCategory = selectedCategory === 'all' || rule.category === selectedCategory;

      return matchesSearch && matchesPriority && matchesCategory;
    });
  }, [rules, searchQuery, selectedPriority, selectedCategory]);

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim() || !newRuleDesc.trim()) return;

    const created: Rule = {
      id: `custom-rule-${Date.now()}`,
      name: newRuleName.trim(),
      priority: newRulePriority,
      category: newRuleCategory,
      description: newRuleDesc.trim(),
      sanskritTerm: newRuleSanskrit.trim() || 'स्वाभाविक नियम',
      contextExample: newRuleExample.trim() || 'Custom contextual application defined by user.',
      keywords: ['custom', newRuleCategory.toLowerCase()]
    };

    onAddRule(created);
    setShowAddModal(false);
    // Reset Form
    setNewRuleName('');
    setNewRuleDesc('');
    setNewRuleSanskrit('');
    setNewRuleExample('');
  };

  const getTierBadge = (priority: number) => {
    const tier = PRIORITY_TIERS.find((t) => t.level === priority);
    if (!tier) return <span className="px-2 py-1 rounded text-xs">P-{priority}</span>;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${tier.badgeColor}`}>
        <span>Priority {priority}</span>
        <span className="opacity-75 font-normal">({tier.sanskritName.split('&')[0]})</span>
      </span>
    );
  };

  return (
    <section id="rules" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>Catalog & Priority Tiers</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif-heading text-slate-900 dark:text-white">
              Śāstra Rule Library
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm max-w-2xl">
              Search and filter canonical Śāstric rules classified by their explicit priority levels (1 = Highest Priority, 5 = Routine Custom).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white saffron-gradient saffron-glow hover:opacity-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Rule</span>
            </button>
            <button
              onClick={onResetRules}
              title="Reset to default canonical rules"
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar & Filter Controls */}
        <div className="glass-card p-5 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rule name, Sanskrit term, or keyword (e.g., 'Life', 'Satya', 'Duty')..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Priority Filter Buttons */}
            <div className="md:col-span-6 flex flex-wrap items-center gap-1.5 justify-start md:justify-end">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Priority:
              </span>
              <button
                onClick={() => setSelectedPriority('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedPriority === 'all'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                All (1–5)
              </button>
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedPriority(level)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedPriority === level
                      ? 'saffron-gradient text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  Priority {level}
                </button>
              ))}
            </div>

          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-200/60 dark:border-slate-800 scrollbar-none">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All Categories' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Rules Table / Card Grid */}
        <div className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg">
          
          {/* Table for Large Screens */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <th className="py-4 px-6">Rule Name</th>
                  <th className="py-4 px-6">Priority Level</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Description</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/80 text-sm">
                {filteredRules.length > 0 ? (
                  filteredRules.map((rule) => (
                    <tr
                      key={rule.id}
                      className="hover:bg-amber-500/5 dark:hover:bg-amber-500/10 transition-colors group cursor-pointer"
                      onClick={() => setInspectRule(rule)}
                    >
                      <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                        <div className="flex flex-col">
                          <span className="font-serif-heading text-base">{rule.name}</span>
                          {rule.sanskritTerm && (
                            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                              {rule.sanskritTerm}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        {getTierBadge(rule.priority)}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {rule.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-300 text-xs max-w-xs truncate">
                        {rule.description}
                      </td>
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectRule(rule);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                        >
                          <span>Inspect</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500 dark:text-slate-400">
                      No rules match your search or filter parameters. Try clearing your filters!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Cards Layout for Mobile / Tablet */}
          <div className="lg:hidden p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredRules.length > 0 ? (
              filteredRules.map((rule) => (
                <div
                  key={rule.id}
                  onClick={() => setInspectRule(rule)}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 cursor-pointer hover:border-amber-500/50 transition-all shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold font-serif-heading text-slate-900 dark:text-white text-base">
                        {rule.name}
                      </h4>
                      {rule.sanskritTerm && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                          {rule.sanskritTerm}
                        </p>
                      )}
                    </div>
                    {getTierBadge(rule.priority)}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {rule.description}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{rule.category}</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-0.5">
                      Details <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-12 text-center text-slate-500">
                No matching rules found.
              </div>
            )}
          </div>

        </div>

        {/* Rule Inspection Drawer / Modal */}
        {inspectRule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="glass-card max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setInspectRule(null)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {getTierBadge(inspectRule.priority)}
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {inspectRule.category}
                  </span>
                </div>
                <h3 className="text-2xl font-bold font-serif-heading text-slate-900 dark:text-white">
                  {inspectRule.name}
                </h3>
                {inspectRule.sanskritTerm && (
                  <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                    {inspectRule.sanskritTerm}
                  </p>
                )}
              </div>

              <div className="space-y-4 text-sm text-slate-700 dark:text-slate-200">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-1">
                    Canonical Rule Description
                  </h4>
                  <p className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 leading-relaxed">
                    {inspectRule.description}
                  </p>
                </div>

                {inspectRule.shlokaSource && (
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                      Jurisprudential Citation ({inspectRule.shlokaSource})
                    </h4>
                    {inspectRule.originalText && (
                      <p className="p-3 rounded-xl bg-amber-500/10 text-amber-800 dark:text-amber-200 font-semibold text-center text-sm my-2">
                        "{inspectRule.originalText}"
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-blue-500" />
                    Practical Context Example
                  </h4>
                  <p className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    {inspectRule.contextExample}
                  </p>
                </div>

                {inspectRule.keywords && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-2">
                    <span className="text-xs text-slate-400 font-bold mr-1">Tags:</span>
                    {inspectRule.keywords.map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                        #{kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => setInspectRule(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white saffron-gradient"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Custom Rule Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="glass-card max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-2xl relative">
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                  <Sparkles className="w-4 h-4" /> Custom Rule Builder
                </div>
                <h3 className="text-xl font-bold font-serif-heading text-slate-900 dark:text-white">
                  Add New Rule to Library
                </h3>
              </div>

              <form onSubmit={handleCreateRule} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Rule Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newRuleName}
                    onChange={(e) => setNewRuleName(e.target.value)}
                    placeholder="e.g. Preserve Environmental Ecology"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Priority Level (1-5) *
                    </label>
                    <select
                      value={newRulePriority}
                      onChange={(e) => setNewRulePriority(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value={1}>Priority 1 (Life & Emergency)</option>
                      <option value={2}>Priority 2 (Truth & Core Duty)</option>
                      <option value={3}>Priority 3 (Social & Family)</option>
                      <option value={4}>Priority 4 (Promises & Vows)</option>
                      <option value={5}>Priority 5 (Customs & Rituals)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Category *
                    </label>
                    <select
                      value={newRuleCategory}
                      onChange={(e) => setNewRuleCategory(e.target.value as Rule['category'])}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="Ethics & Life">Ethics & Life</option>
                      <option value="Truth & Speech">Truth & Speech</option>
                      <option value="Duty & Justice">Duty & Justice</option>
                      <option value="Relationships">Relationships</option>
                      <option value="Vows & Promises">Vows & Promises</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Sanskrit / Traditional Term (Optional)
                  </label>
                  <input
                    type="text"
                    value={newRuleSanskrit}
                    onChange={(e) => setNewRuleSanskrit(e.target.value)}
                    placeholder="e.g. पर्यावरण-रक्षणम्"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-sanskrit"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Rule Description *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={newRuleDesc}
                    onChange={(e) => setNewRuleDesc(e.target.value)}
                    placeholder="Briefly explain what this rule commands or prohibits..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Context Example (Optional)
                  </label>
                  <input
                    type="text"
                    value={newRuleExample}
                    onChange={(e) => setNewRuleExample(e.target.value)}
                    placeholder="Describe a scenario where this rule applies..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl saffron-gradient text-white font-bold shadow-md"
                  >
                    Save Rule
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
