import { Rule, PriorityTier } from '../types';

export const PRIORITY_TIERS: PriorityTier[] = [
  {
    level: 1,
    title: 'Absolute Priority (Life & Safety)',
    sanskritName: 'Emergency & Life Protection',
    badgeColor: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
    description: 'Rules essential to preserving human life, preventing imminent harm, and responding to extreme distress. Overrides all lower duties.'
  },
  {
    level: 2,
    title: 'High Priority (Statutory & Integrity)',
    sanskritName: 'Truth & Constitutional Duty',
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    description: 'Core ethical duties like speaking truth, performing statutory duties, and maintaining institutional integrity.'
  },
  {
    level: 3,
    title: 'Medium Priority (Relational & Public Interest)',
    sanskritName: 'Public Interest & Civic Welfare',
    badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
    description: 'Duties owed to family, mentors, community, and public social harmony.'
  },
  {
    level: 4,
    title: 'Conditional Priority (Covenants & Pledges)',
    sanskritName: 'Contracts & Personal Commitments',
    badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
    description: 'Personal commitments, contractual covenants, and solemn pledges.'
  },
  {
    level: 5,
    title: 'Routine Priority (Customs & Protocols)',
    sanskritName: 'Standard Administrative Protocols',
    badgeColor: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30',
    description: 'Daily operational procedures, minor etiquette, and flexible secondary customs.'
  }
];

export const INITIAL_RULES: Rule[] = [
  {
    id: 'rule-1',
    name: 'Protect Life & Human Safety',
    priority: 1,
    category: 'Ethics & Life',
    description: 'The fundamental obligation to preserve human life and shield living beings from imminent physical harm or death.',
    sanskritTerm: 'Life Preservation Rule',
    shlokaSource: 'Universal Legal Maxim (Salus Populi Suprema Lex)',
    originalText: 'The safety and preservation of life is the supreme law.',
    contextExample: 'If a witness knows where an innocent fugitive is hiding from violent assailants, protecting life overrides standard disclosure duties.',
    keywords: ['life', 'protection', 'safety', 'survival', 'innocent', 'emergency']
  },
  {
    id: 'rule-2',
    name: 'Emergency Exemption Protocol',
    priority: 1,
    category: 'Ethics & Life',
    description: 'In times of extreme crisis or existential threat, standard restrictive procedural rules may be suspended to ensure survival.',
    sanskritTerm: 'Emergency Overriding Exemption',
    shlokaSource: 'Necessity Defense Paradigm',
    originalText: 'Necessity knows no law in emergency situations threatening survival.',
    contextExample: 'Utilizing reserved emergency resources during extreme disaster conditions to sustain human life.',
    keywords: ['emergency', 'crisis', 'exemption', 'survival', 'exception']
  },
  {
    id: 'rule-3',
    name: 'Veracity & Honest Testimony',
    priority: 2,
    category: 'Truth & Speech',
    description: 'The fundamental moral requirement to speak truth, uphold transparency, and refrain from fraudulent deception.',
    sanskritTerm: 'Veracity Standard',
    shlokaSource: 'Ethical Jurisprudence Statute',
    originalText: 'Truthfulness and integrity form the cornerstone of legal justice.',
    contextExample: 'Giving honest testimony under oath in court or maintaining full financial audit transparency.',
    keywords: ['truth', 'honesty', 'speech', 'integrity', 'verity']
  },
  {
    id: 'rule-4',
    name: 'Perform Obligatory Duty',
    priority: 2,
    category: 'Duty & Justice',
    description: 'Execution of obligatory duties assigned by one’s role, statutory mandate, or professional code of conduct.',
    sanskritTerm: 'Statutory Obligation Rule',
    shlokaSource: 'Professional Ethics Standard',
    originalText: 'Professional duty must be discharged faithfully without bias or dereliction.',
    contextExample: 'A doctor performing emergency medical treatment regardless of personal scheduling conflicts.',
    keywords: ['duty', 'obligation', 'responsibility', 'profession', 'statute']
  },
  {
    id: 'rule-5',
    name: 'Administer Impartial Justice',
    priority: 2,
    category: 'Duty & Justice',
    description: 'Upholding impartial justice without fear, favor, prejudice, or personal conflict of interest.',
    sanskritTerm: 'Impartial Adjudication Standard',
    shlokaSource: 'Judicial Neutrality Doctrine',
    originalText: 'Justice must be administered impartially and consistently across all parties.',
    contextExample: 'A magistrate recusing themselves or ruling strictly according to evidence regardless of personal relationships.',
    keywords: ['justice', 'impartiality', 'fairness', 'law', 'adjudication']
  },
  {
    id: 'rule-6',
    name: 'Familial Care & Respect for Elders',
    priority: 3,
    category: 'Relationships',
    description: 'Honoring, supporting, and providing care for parents, mentors, dependents, and senior family members.',
    sanskritTerm: 'Relational Responsibility Rule',
    shlokaSource: 'Family & Elder Protection Canon',
    originalText: 'Care for dependents and elders is a fundamental relational obligation.',
    contextExample: 'Caring for aging parents and fulfilling family welfare responsibilities.',
    keywords: ['elders', 'parents', 'respect', 'mentors', 'family']
  },
  {
    id: 'rule-7',
    name: 'Preserve Public Welfare & Social Order',
    priority: 3,
    category: 'Duty & Justice',
    description: 'Actions directed toward social cohesion, environmental protection, and collective public welfare.',
    sanskritTerm: 'Public Welfare Standard',
    shlokaSource: 'Civic Duty Framework',
    originalText: 'Individual convenience yields to broader public welfare and safety.',
    contextExample: 'Complying with public health quarantine directives during a viral outbreak.',
    keywords: ['harmony', 'society', 'welfare', 'public', 'peace']
  },
  {
    id: 'rule-8',
    name: 'Fulfill Contractual Pledges & Covenants',
    priority: 4,
    category: 'Vows & Promises',
    description: 'Honor solemn commitments, written covenants, formal promises, and explicit contract terms.',
    sanskritTerm: 'Contractual Covenant Rule',
    shlokaSource: 'Pacta Sunt Servanda Principle',
    originalText: 'Agreements faithfully entered into must be honored and kept.',
    contextExample: 'Fulfilling commercial contract terms on the agreed deadline despite minor market cost fluctuations.',
    keywords: ['promise', 'vow', 'covenant', 'pledge', 'commitment']
  },
  {
    id: 'rule-9',
    name: 'Observe Personal Commitments',
    priority: 4,
    category: 'Vows & Promises',
    description: 'Adhering to voluntary personal disciplines, professional oaths, and ethical self-commitments.',
    sanskritTerm: 'Personal Discipline Protocol',
    shlokaSource: 'Ethical Self-Regulation Canon',
    originalText: 'Self-imposed ethical standards build personal and professional reliability.',
    contextExample: 'Maintaining a voluntary pledge of confidentiality during sensitive negotiations.',
    keywords: ['vow', 'discipline', 'commitment', 'oath', 'ethics']
  },
  {
    id: 'rule-10',
    name: 'Standard Operating Customs',
    priority: 5,
    category: 'Vows & Promises',
    description: 'Executing routine administrative protocols, standard operating procedures, and institutional customs.',
    sanskritTerm: 'Routine Custom Rule',
    shlokaSource: 'Administrative Procedure Guideline',
    originalText: 'Standard operating procedures ensure order during normal operations.',
    contextExample: 'Submitting routine weekly status reports according to standard departmental schedule.',
    keywords: ['customs', 'protocol', 'daily', 'routine', 'procedure']
  }
];
