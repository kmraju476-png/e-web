export interface Rule {
  id: string;
  name: string;
  priority: number; // 1 = Highest, 5 = Lowest
  category: 'Ethics & Life' | 'Truth & Speech' | 'Duty & Justice' | 'Relationships' | 'Vows & Promises' | 'Custom';
  description: string;
  sanskritTerm?: string;
  shlokaSource?: string;
  originalText?: string;
  contextExample: string;
  keywords: string[];
}

export interface PriorityTier {
  level: number;
  title: string;
  sanskritName: string;
  badgeColor: string;
  description: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  source: string;
  scenario: string;
  ruleAId: string;
  ruleBId: string;
  winningRuleId: string;
  shastricRationale: string;
  modernParallel: string;
  keyTakeaway: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Śāstra Basics' | 'Precedence Logic' | 'Modern Relevance' | 'Project Technicals';
}

export interface FlowStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  technicalLogic: string;
}

export type ActivePage = 'home' | 'about' | 'rules' | 'resolver' | 'flowchart' | 'casestudies' | 'faq' | 'contact';
