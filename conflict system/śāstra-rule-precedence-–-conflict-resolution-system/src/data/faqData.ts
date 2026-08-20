import { FAQItem } from '../types';

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Śāstra Basics',
    question: 'What is Śāstra Rule Precedence and how does it relate to decision systems?',
    answer: 'Śāstra Rule Precedence refers to the classical systematic frameworks of law, ethics, governance, and rule prioritization. Unlike rigid single-command systems, this framework provides structured algorithms for analyzing contextual duties, recognizing that real-world scenarios frequently pit valid rules against one another.'
  },
  {
    id: 'faq-2',
    category: 'Precedence Logic',
    question: 'What is Rule Precedence and why is it necessary?',
    answer: 'Rule Precedence is a formal logical ordering system that assigns explicit priority tiers to rules. When two valid rules conflict in a given scenario (e.g., "Veracity" vs "Protect Innocent Life"), precedence dictates which rule governs the decision, preventing logical gridlock, ambiguity, or indecision.'
  },
  {
    id: 'faq-3',
    category: 'Precedence Logic',
    question: 'What happens when two conflicting rules have the EXACT SAME priority level?',
    answer: 'When two rules share equal priority (e.g., both Priority 2), the system applies secondary resolution criteria: (1) Evidentiary Rank (Constitutional > Statutory > Customary), (2) Contextual Harm Assessment (evaluating relative risk), and (3) Public Interest Balance (choosing the path that yields broader social stability).'
  },
  {
    id: 'faq-4',
    category: 'Precedence Logic',
    question: 'What is an Emergency Exemption Protocol?',
    answer: 'An Emergency Exemption Protocol is a legal doctrine that establishes that standard operational or administrative restrictions can be lawfully suspended during extreme crisis or existential threats to preserve human life and public safety without incurring liability or violation.'
  },
  {
    id: 'faq-5',
    category: 'Modern Relevance',
    question: 'How is Rule Precedence applicable to modern AI & Legal Decision Support Systems?',
    answer: 'Modern AI safety, autonomous systems ethics (e.g., emergency collision mitigation), legal expert systems, and automated policy engines face identical rule-conflict challenges. Structuring AI decision trees using priority tiers ensures deterministic, ethical, and human-centric outcomes in complex decision environments.'
  },
  {
    id: 'faq-6',
    category: 'Project Technicals',
    question: 'Is this project purely theoretical or can it evaluate custom user rules?',
    answer: 'This system includes an interactive Conflict Resolver engine where users can compare built-in rules, select real-world case studies, or define custom priorities to observe how the resolution algorithm determines precedence.'
  }
];
