import { CaseStudy } from '../types';

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'case-1',
    title: 'Confidentiality vs. Life Safety Paradigm',
    subtitle: 'Truthful Non-Disclosure vs. Protecting Human Life',
    source: 'Classical Legal Precedent Paradigm',
    scenario: 'An investigator took a strict pledge of non-disclosure regarding informant locations. Suddenly, violent perpetrators pursuing an innocent witness demand the witness location. Revealing the literal truth causes immediate loss of innocent life, while withholding or misdirecting preserves human life.',
    ruleAId: 'rule-1', // Protect Life (Priority 1)
    ruleBId: 'rule-3', // Veracity (Priority 2)
    winningRuleId: 'rule-1',
    shastricRationale: 'Rule Hierarchy explicit mandate: "Protect Life & Human Safety" holds Priority 1, whereas "Veracity & Honest Testimony" holds Priority 2. When literal disclosure causes the destruction of innocent life, protecting life overrides standard disclosure duties. The higher moral truth lies in preserving human life.',
    modernParallel: 'In modern law and bioethics, patient confidentiality or non-disclosure agreements are lawfully breached under mandatory reporting requirements to prevent imminent bodily harm or crime.',
    keyTakeaway: 'Literal rules must never become instruments of harm; preserving human life is the supreme ethical imperative.'
  },
  {
    id: 'case-2',
    title: 'The Medical Emergency Protocol',
    subtitle: 'Administrative Protocol vs. Life-Saving Duty',
    source: 'Emergency Overriding Protocol Framework',
    scenario: 'A medical practitioner is engaged in an off-duty administrative seclusion procedure. Suddenly, a nearby individual collapses experiencing severe anaphylactic shock. To save the person, the practitioner must immediately break protocol, call for emergency resuscitation equipment, and direct bystanders.',
    ruleAId: 'rule-1', // Protect Life (Priority 1)
    ruleBId: 'rule-9', // Personal Commitments (Priority 4)
    winningRuleId: 'rule-1',
    shastricRationale: 'Administrative protocols and personal routines (Priority 4) yield immediately to emergency exemptions when a human life (Priority 1) is at risk. Suspensions executed during emergencies carry zero penalty and represent the highest fulfillment of duty.',
    modernParallel: 'Standard operating procedures and contract terms are routinely waived in declared state-of-emergency protocols to authorize urgent humanitarian actions.',
    keyTakeaway: 'Routine administrative protocols yield immediately to emergency life-saving actions.'
  },
  {
    id: 'case-3',
    title: 'The Judicial Recusal Dilemma',
    subtitle: 'Impartial Justice vs. Relational Affiliation',
    source: 'Judicial Neutrality & Anti-Nepotism Statute',
    scenario: 'A magistrate presiding over a major corporate financial fraud case discovers that the primary suspect is a close family relative. Family members urge the magistrate to dismiss the charges out of personal loyalty.',
    ruleAId: 'rule-5', // Administer Justice (Priority 2)
    ruleBId: 'rule-6', // Family Care (Priority 3)
    winningRuleId: 'rule-5',
    shastricRationale: 'Priority 2 (Administer Impartial Justice) strictly supersedes Priority 3 (Relational & Familial Loyalty). The fundamental principle of judicial duty requires judges to remain completely blind to personal kinship, applying equal weight of law to all individuals.',
    modernParallel: 'Mandatory recusal protocols and conflict-of-interest statutes in legal systems enforce judicial impartiality over personal or familial affiliations.',
    keyTakeaway: 'Public integrity and justice must never be compromised for nepotism or relational pressure.'
  },
  {
    id: 'case-4',
    title: 'Commercial Covenant vs. Public Welfare',
    subtitle: 'Contractual Pledges vs. Public Safety',
    source: 'Contractual Precedence Matrix',
    scenario: 'A chemical manufacturer signed a firm commercial supply contract with a client (Priority 4: Contractual Covenant). Later, safety tests reveal a storage tank leak posing toxic environmental risks to a nearby community (Priority 3: Public Welfare). Halting operations breaches the commercial supply contract.',
    ruleAId: 'rule-7', // Preserve Public Welfare (Priority 3)
    ruleBId: 'rule-8', // Contractual Covenant (Priority 4)
    winningRuleId: 'rule-7',
    shastricRationale: 'Public Welfare & Social Safety (Priority 3) takes precedence over private commercial covenants (Priority 4). Contracts that pose imminent danger to public health or environmental safety are legally voidable under precedence law.',
    modernParallel: 'The "Public Interest Clause" in modern contract law invalidates private agreements that endanger public safety or environmental health.',
    keyTakeaway: 'Collective public welfare always overrides private contractual obligations.'
  }
];
