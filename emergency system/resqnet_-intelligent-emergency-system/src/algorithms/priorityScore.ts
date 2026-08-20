/**
 * RESQNET ALGORITHM MODULE 2: PRIORITY SCORING & DECISION SUPPORT ALGORITHM
 * 
 * Mathematical Formulation:
 * The priority score P ∈ [0, 100] is a multi-attribute weighted linear combination:
 * 
 * P = W_sev · S_sev + W_aff · S_aff + W_wait · S_wait + W_res · S_res
 * 
 * Where:
 * 1. S_sev ∈ [0, 40]   : Intrinsic triage severity tier (CRITICAL: 40, HIGH: 28, MEDIUM: 18, LOW: 8)
 * 2. S_aff ∈ [0, 30]   : Human life casualty factor = min(30, 6 * ln(1 + peopleAffected) + min(12, peopleAffected * 0.8))
 * 3. S_wait ∈ [0, 15]  : Time-delay escalation = min(15, (elapsedMinutes / 60) * 15)
 * 4. S_res ∈ [0, 15]   : Hazard & operational urgency (Life-saving rescue / Hazmat / Fire: 15, Medical: 12, Rescue: 10, Other: 6)
 * 
 * Result is clamped to [0, 100] and categorized into priority tiers.
 */

import { IncidentType, PriorityBreakdown, PriorityFactor, ResourceType, SeverityLevel } from '../types';

export interface PriorityParams {
  severity: SeverityLevel;
  peopleAffected: number;
  incidentType: IncidentType;
  requiredResources: { type: ResourceType; quantity: number }[];
  createdTime: string; // ISO string
  currentTime?: Date;
}

export function computeIncidentPriority(params: PriorityParams): PriorityBreakdown {
  const now = params.currentTime ? params.currentTime.getTime() : Date.now();
  const created = new Date(params.createdTime).getTime();
  const elapsedMinutes = Math.max(0, Math.floor((now - created) / (1000 * 60)));

  const factors: PriorityFactor[] = [];
  const reasons: string[] = [];

  // 1. Severity Score (Max 40 points)
  let severityScore = 8;
  if (params.severity === 'CRITICAL') {
    severityScore = 40;
    reasons.push('Critical life-threatening severity rating (Highest urgency)');
  } else if (params.severity === 'HIGH') {
    severityScore = 28;
    reasons.push('High severity with active escalating hazard');
  } else if (params.severity === 'MEDIUM') {
    severityScore = 18;
    reasons.push('Moderate severity requiring prompt stabilization');
  } else {
    severityScore = 8;
    reasons.push('Low severity with localized impact');
  }

  factors.push({
    name: 'Severity Factor (S_sev)',
    weight: 0.40,
    contribution: severityScore,
    description: `Assigned based on triage level: ${params.severity} (${severityScore}/40 pts)`,
  });

  // 2. People Affected Factor (Max 30 points)
  const count = Math.max(0, params.peopleAffected);
  let peopleScore = 0;
  if (count === 0) {
    peopleScore = 2;
  } else if (count === 1) {
    peopleScore = 8;
    reasons.push('1 person actively involved/injured');
  } else if (count <= 5) {
    peopleScore = 14 + (count - 1) * 2;
    reasons.push(`${count} individuals affected (Small group risk)`);
  } else if (count <= 15) {
    peopleScore = 22 + (count - 5) * 0.6;
    reasons.push(`${count} people affected (Mass incident risk)`);
  } else {
    peopleScore = Math.min(30, 27 + Math.log2(count - 14));
    reasons.push(`${count} individuals affected (Severe mass casualty potential)`);
  }
  peopleScore = Number(peopleScore.toFixed(1));

  factors.push({
    name: 'People Affected (S_aff)',
    weight: 0.30,
    contribution: peopleScore,
    description: `Calculated from ${count} casualties/affected persons (${peopleScore}/30 pts)`,
  });

  // 3. Waiting Time Escalation (Max 15 points)
  // Emergencies escalate as response delays mount
  const waitScore = Number(Math.min(15, (elapsedMinutes / 20) * 15).toFixed(1));
  if (elapsedMinutes >= 15) {
    reasons.push(`Waiting time elapsed: ${elapsedMinutes} mins (Critical escalation)`);
  } else if (elapsedMinutes >= 5) {
    reasons.push(`Waiting time elapsed: ${elapsedMinutes} mins (Moderate queue delay)`);
  } else {
    reasons.push(`Recent report: ${elapsedMinutes} mins ago`);
  }

  factors.push({
    name: 'Waiting Time Escalation (S_wait)',
    weight: 0.15,
    contribution: waitScore,
    description: `Elapsed time of ${elapsedMinutes} min since incident creation (${waitScore}/15 pts)`,
  });

  // 4. Resource & Hazard Urgency (Max 15 points)
  let resourceScore = 6;
  const hasMedical = params.requiredResources.some(r => r.type === 'Ambulance' || r.type === 'Medical Team');
  const hasFire = params.requiredResources.some(r => r.type === 'Fire Response Unit');
  const hasRescue = params.requiredResources.some(r => r.type === 'Rescue Team');

  if (params.incidentType === 'Industrial Accident' || params.incidentType === 'Building Collapse') {
    resourceScore = 15;
    reasons.push('Complex structural/hazmat environment requiring specialized heavy rescue');
  } else if (params.incidentType === 'Fire' && hasFire) {
    resourceScore = 14;
    reasons.push('Rapid-spread fire hazard requiring immediate suppression');
  } else if (hasMedical && count > 3) {
    resourceScore = 13;
    reasons.push('Multiple medical dispatch vectors requested (Triage + transport)');
  } else if (hasRescue || hasMedical) {
    resourceScore = 11;
    reasons.push('Active extraction/medical stabilization resources required');
  } else {
    resourceScore = 7;
    reasons.push('Standard tactical resource requirement');
  }

  factors.push({
    name: 'Resource Hazard Urgency (S_res)',
    weight: 0.15,
    contribution: resourceScore,
    description: `Urgency derived from incident type '${params.incidentType}' and required units (${resourceScore}/15 pts)`,
  });

  // Total raw score
  const totalScore = Math.min(100, Math.max(1, Math.round(severityScore + peopleScore + waitScore + resourceScore)));

  const formula = `Score = ${severityScore} (Severity) + ${peopleScore} (People) + ${waitScore} (Wait Time) + ${resourceScore} (Hazard) = ${totalScore}/100`;

  return {
    score: totalScore,
    factors,
    reasons,
    formula,
    computedAt: new Date().toISOString(),
  };
}
