/**
 * RESQNET ALGORITHM MODULE 4: INTELLIGENT RESOURCE MATCHING ENGINE
 * 
 * Mathematical Formulation & Multi-Criteria Decision Making (MCDM):
 * For an incident I and candidate resource R, the Suitability Score S(I, R) ∈ [0, 100] is:
 * 
 * S(I, R) = TypeFeasibility · [
 *   W_dist · DistScore(d) +
 *   W_cap  · CapScore(c_R, c_I) +
 *   W_spec · SpecScore(R_spec, I_type) +
 *   W_read · ReadinessScore(R_status)
 * ]
 * 
 * Where:
 * - TypeFeasibility = 1.0 (exact type match or superset), 0.0 (incompatible type)
 * - DistScore(d) = max(0, 100 · exp(-d / 12))  (Exponential decay penalizing distant units)
 * - CapScore = min(100, (R.capacity / max(1, reqCapacity)) * 100)
 * - SpecScore = domain relevance matching table between incident profile and unit capabilities
 * - ReadinessScore = AVAILABLE (100%), EN_ROUTE (30% if re-routable), ASSIGNED (10%), UNAVAILABLE (0%)
 */

import { Incident, Resource, ResourceRecommendation, ResourceType } from '../types';
import { calculateHaversineDistance, calculateEstimatedTravelTimeMinutes } from './haversine';

export function matchResourcesForIncident(
  incident: Incident,
  allResources: Resource[],
  targetType?: ResourceType
): ResourceRecommendation[] {
  const recommendations: ResourceRecommendation[] = [];

  const requiredTypes = targetType 
    ? [targetType]
    : (incident.requiredResources.length > 0 ? incident.requiredResources.map(r => r.type) : ['Ambulance', 'Rescue Team', 'Fire Response Unit', 'Medical Team'] as ResourceType[]);

  const candidates = allResources.filter(res => {
    // If target type is specified or incident requires this type
    if (requiredTypes.length > 0 && !requiredTypes.includes(res.type)) {
      return false;
    }
    // Only available or currently assigned (to allow comparison)
    return res.status !== 'UNAVAILABLE';
  });

  for (const res of candidates) {
    const reasons: string[] = [];

    // 1. Haversine Distance & ETA Calculation
    const distanceKm = calculateHaversineDistance(
      res.latitude,
      res.longitude,
      incident.latitude,
      incident.longitude
    );
    const etaMinutes = calculateEstimatedTravelTimeMinutes(distanceKm, res.speedKmh || 45, 1.1);

    // 2. Distance Score (0 - 100): Exponential decay
    // Within 2km: ~85-100 pts, 5km: ~65 pts, 10km: ~43 pts, 20km: ~18 pts
    const distanceScore = Math.max(5, Math.min(100, Math.round(100 * Math.exp(-distanceKm / 10))));
    if (distanceKm < 3.0) {
      reasons.push(`Immediate proximity (${distanceKm.toFixed(1)} km, ~${etaMinutes} min ETA)`);
    } else if (distanceKm < 8.0) {
      reasons.push(`Moderate transit range (${distanceKm.toFixed(1)} km, ~${etaMinutes} min ETA)`);
    } else {
      reasons.push(`Extended transit distance (${distanceKm.toFixed(1)} km)`);
    }

    // 3. Capacity Score (0 - 100)
    let capacityScore = 80;
    if (res.capacity >= incident.peopleAffected && incident.peopleAffected > 0) {
      capacityScore = 100;
      reasons.push(`Full patient/squad capacity match (Unit capacity: ${res.capacity}, Affected: ${incident.peopleAffected})`);
    } else if (res.capacity >= Math.ceil(incident.peopleAffected / 2)) {
      capacityScore = 85;
      reasons.push(`Supports partial extraction quota (Capacity: ${res.capacity})`);
    } else {
      capacityScore = 65;
      reasons.push(`Standard tactical deployment capacity (${res.capacity} crew/berths)`);
    }

    // 4. Specialization & Equipment Match (0 - 100)
    let specializationScore = 70;
    const specLower = (res.specialization || '').toLowerCase();
    const incTypeLower = incident.incidentType.toLowerCase();

    if (
      (incTypeLower.includes('fire') && specLower.includes('fire')) ||
      (incTypeLower.includes('flood') && (specLower.includes('water') || specLower.includes('boat') || specLower.includes('dive'))) ||
      (incTypeLower.includes('collapse') && (specLower.includes('heavy') || specLower.includes('urban') || specLower.includes('search'))) ||
      (incTypeLower.includes('medical') && (specLower.includes('icu') || specLower.includes('trauma') || specLower.includes('cardiac') || specLower.includes('als'))) ||
      (incTypeLower.includes('industrial') && (specLower.includes('hazmat') || specLower.includes('chemical')))
    ) {
      specializationScore = 100;
      reasons.push(`Direct tactical specialty match: "${res.specialization}"`);
    } else if (specLower.includes('advanced') || specLower.includes('als') || specLower.includes('trauma')) {
      specializationScore = 90;
      reasons.push(`High-tier tactical capability: "${res.specialization}"`);
    } else {
      specializationScore = 75;
      reasons.push(`General emergency response readiness`);
    }

    // 5. Readiness & Status Score (0 - 100)
    let readinessScore = 0;
    if (res.status === 'AVAILABLE') {
      readinessScore = 100;
      reasons.push('Unit is active, fueled, and on standby');
    } else if (res.status === 'ASSIGNED') {
      readinessScore = 35;
      reasons.push('Currently assigned to another incident (Requires diversion)');
    } else if (res.status === 'EN_ROUTE') {
      readinessScore = 25;
      reasons.push('Unit en-route (May be re-routed if higher priority)');
    } else if (res.status === 'ON_SCENE') {
      readinessScore = 10;
      reasons.push('Currently engaged on scene');
    } else {
      readinessScore = 0;
      reasons.push('Unit unavailable or in maintenance');
    }

    // 6. Weighted Aggregate Suitability
    // W_dist: 0.35, W_spec: 0.25, W_read: 0.25, W_cap: 0.15
    const aggregate =
      distanceScore * 0.35 +
      specializationScore * 0.25 +
      readinessScore * 0.25 +
      capacityScore * 0.15;

    const finalSuitability = Math.max(5, Math.min(100, Math.round(aggregate)));

    recommendations.push({
      resource: res,
      distanceKm,
      estimatedTimeMinutes: etaMinutes,
      estimatedEtaMinutes: etaMinutes,
      suitabilityScore: finalSuitability,
      matchScore: finalSuitability,
      breakdown: {
        distanceScore,
        capacityScore,
        specializationScore,
        readinessScore,
        statusFactor: readinessScore / 100,
      },
      factors: {
        distanceScore,
        capacityScore,
        specializationScore,
        readinessScore,
      },
      reasons,
    });
  }

  // Sort descending by suitability score
  recommendations.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
  return recommendations;
}

export const recommendResourcesForIncident = (
  incident: Incident,
  allResources: Resource[],
  _limit?: number
) => matchResourcesForIncident(incident, allResources);

