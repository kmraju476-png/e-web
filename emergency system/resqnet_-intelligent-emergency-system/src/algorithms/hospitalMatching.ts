/**
 * RESQNET ALGORITHM MODULE 5: HOSPITAL MATCHING & CASUALTY ROUTING ENGINE
 * 
 * Mathematical Formulation:
 * For a medical incident I with casualty count C and trauma severity S, the Hospital Suitability H(I, Hosp) is:
 * 
 * H(I, Hosp) = W_dist · (1 - d / d_max) + W_icu · (ICU_avail / ICU_total) + W_bed · (Beds_avail / Beds_total) + W_trauma · TraumaFit
 * 
 * Where:
 * - Distance Weight (0.35): Closeness minimizes transport golden hour mortality
 * - ICU Weight (0.30 for Critical/High, 0.15 for Low/Med): Critical care buffer
 * - General Bed Weight (0.20): Surge admission capacity
 * - Trauma Fit Weight (0.15): Level 1 vs 2 vs 3 readiness match
 */

import { Hospital, HospitalRecommendation, Incident } from '../types';
import { calculateHaversineDistance, calculateEstimatedTravelTimeMinutes } from './haversine';

export function matchHospitalsForIncident(
  incident: Incident,
  allHospitals: Hospital[]
): HospitalRecommendation[] {
  const recommendations: HospitalRecommendation[] = [];

  for (const hosp of allHospitals) {
    const reasons: string[] = [];

    // 1. Distance & ETA Calculation
    const distanceKm = calculateHaversineDistance(
      incident.latitude,
      incident.longitude,
      hosp.latitude,
      hosp.longitude
    );
    const etaMinutes = calculateEstimatedTravelTimeMinutes(distanceKm, 50, 1.15);

    // Distance Score (0 - 100)
    const distanceScore = Math.max(10, Math.min(100, Math.round(100 * Math.exp(-distanceKm / 8))));
    if (distanceKm < 3.0) {
      reasons.push(`Closest medical facility (${distanceKm.toFixed(1)} km, ~${etaMinutes} min)`);
    } else if (distanceKm < 7.0) {
      reasons.push(`Within primary transit zone (${distanceKm.toFixed(1)} km)`);
    } else {
      reasons.push(`Secondary perimeter (${distanceKm.toFixed(1)} km)`);
    }

    // 2. Bed Availability Ratio (0 - 100)
    const bedRatio = hosp.totalBeds > 0 ? (hosp.availableBeds / hosp.totalBeds) : 0;
    const bedAvailabilityScore = Math.round(bedRatio * 100);
    if (hosp.availableBeds > 10) {
      reasons.push(`High bed capacity: ${hosp.availableBeds}/${hosp.totalBeds} general beds available`);
    } else if (hosp.availableBeds > 0) {
      reasons.push(`Moderate bed capacity: ${hosp.availableBeds}/${hosp.totalBeds} beds available`);
    } else {
      reasons.push(`CRITICAL: 0 general beds currently available`);
    }

    // 3. ICU Bed Availability Ratio (0 - 100)
    const icuRatio = hosp.icuBeds > 0 ? (hosp.availableIcuBeds / hosp.icuBeds) : 0;
    const icuAvailabilityScore = Math.round(icuRatio * 100);
    if (hosp.availableIcuBeds > 3) {
      reasons.push(`Optimal ICU headroom: ${hosp.availableIcuBeds}/${hosp.icuBeds} ICU units free`);
    } else if (hosp.availableIcuBeds > 0) {
      reasons.push(`Limited ICU: ${hosp.availableIcuBeds}/${hosp.icuBeds} ICU units free`);
    } else {
      reasons.push(`Zero ICU beds available — severe risk for acute critical intake`);
    }

    // 4. Trauma Center Match & Operational Status
    let traumaMatchScore = 70;
    if (hosp.traumaLevel === 1) {
      traumaMatchScore = 100;
      reasons.push('Level 1 Comprehensive Trauma Center (Highest surgical readiness)');
    } else if (hosp.traumaLevel === 2) {
      traumaMatchScore = 85;
      reasons.push('Level 2 Regional Trauma Center (Full emergency surgical capability)');
    } else {
      traumaMatchScore = 70;
      reasons.push('Level 3 Community Hospital (Initial stabilization and urgent care)');
    }

    // Operational penalty
    let statusPenalty = 1.0;
    if (hosp.status === 'DIVERTING') {
      statusPenalty = 0.4;
      reasons.push('WARNING: Facility is actively diverting non-extreme trauma');
    } else if (hosp.status === 'AT_CAPACITY') {
      statusPenalty = 0.5;
      reasons.push('WARNING: Facility operating at surge capacity');
    } else if (hosp.status === 'MAINTENANCE') {
      statusPenalty = 0.1;
      reasons.push('ALERT: Surgical wing in partial maintenance');
    }

    // Dynamic weights based on incident severity
    const isCritical = incident.severity === 'CRITICAL' || incident.severity === 'HIGH';
    const wDist = isCritical ? 0.35 : 0.40;
    const wIcu = isCritical ? 0.35 : 0.15;
    const wBed = isCritical ? 0.15 : 0.30;
    const wTrauma = 0.15;

    const rawScore = (
      distanceScore * wDist +
      icuAvailabilityScore * wIcu +
      bedAvailabilityScore * wBed +
      traumaMatchScore * wTrauma
    ) * statusPenalty;

    const suitabilityScore = Math.max(5, Math.min(100, Math.round(rawScore)));

    recommendations.push({
      hospital: hosp,
      distanceKm,
      estimatedTimeMinutes: etaMinutes,
      suitabilityScore,
      factors: {
        distanceScore,
        bedAvailabilityScore,
        icuAvailabilityScore,
        traumaMatchScore,
      },
      reasons,
    });
  }

  recommendations.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
  return recommendations;
}

export const recommendHospitalsForIncident = (
  incident: Incident,
  allHospitals: Hospital[]
) => matchHospitalsForIncident(incident, allHospitals);

