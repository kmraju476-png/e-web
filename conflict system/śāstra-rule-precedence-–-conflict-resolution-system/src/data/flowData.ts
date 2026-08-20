import { FlowStep } from '../types';

export const FLOW_STEPS: FlowStep[] = [
  {
    stepNumber: 1,
    title: 'Conflict Detected',
    subtitle: 'Identification of Opposing Mandates',
    description: 'The system identifies a scenario where two or more active rules dictate mutually exclusive actions (e.g. Rule A: Action X vs Rule B: Action Y).',
    iconName: 'AlertTriangle',
    technicalLogic: 'Input evaluation triggers an intersection check: ActiveRules.filter(r => r.applies) yields > 1 contradictory mandates.'
  },
  {
    stepNumber: 2,
    title: 'Compare Priorities',
    subtitle: 'Hierarchical Level Evaluation',
    description: 'The system reads the numerical priority score associated with each candidate rule based on Śāstric tiering (1 = Highest, 5 = Lowest).',
    iconName: 'GitCompare',
    technicalLogic: 'Priority Comparison: min(RuleA.priority, RuleB.priority). Lower numerical value represents higher normative precedence.'
  },
  {
    stepNumber: 3,
    title: 'Apply Highest Priority Rule',
    subtitle: 'Execution of Governed Outcome',
    description: 'The rule with the lowest priority index (highest precedence) is selected as the winning mandate. The lower priority rule is suspended via Āpad-dharma.',
    iconName: 'ShieldCheck',
    technicalLogic: 'RuleSelection = CandidateRules.sort((a,b) => a.priority - b.priority)[0]. Lower rule logged as "Suspended under Apad-dharma".'
  },
  {
    stepNumber: 4,
    title: 'Generate Final Decision',
    subtitle: 'Audit Trail & Rationale Output',
    description: 'A comprehensive decision report is issued, detailing the winning rule, the suppressed rule, the priority difference, and Śāstric justification.',
    iconName: 'FileText',
    technicalLogic: 'Output JSON / UI Card rendered with win state, priority badge, justification excerpt, and modern legal parallel.'
  }
];
