/**
 * RESQNET ALGORITHM MODULE 1: HAVERSINE DISTANCE ENGINE
 * 
 * Mathematical Formulation:
 * The Haversine formula determines the great-circle distance between two points on a sphere
 * given their longitudes and latitudes.
 * 
 * Formula:
 * a = sin²(Δφ / 2) + cos(φ₁) · cos(φ₂) · sin²(Δλ / 2)
 * c = 2 · atan2( √a, √(1−a) )
 * d = R · c
 * 
 * Where:
 * φ = latitude in radians
 * λ = longitude in radians
 * R = Earth's mean radius = 6,371.0088 kilometers
 */

const EARTH_RADIUS_KM = 6371.0088;

/**
 * Converts degrees to radians.
 */
export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Converts radians to degrees.
 */
export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Computes exact great-circle distance in kilometers using the Haversine Formula.
 * 
 * @param lat1 Latitude of Origin (Decimal Degrees)
 * @param lon1 Longitude of Origin (Decimal Degrees)
 * @param lat2 Latitude of Destination (Decimal Degrees)
 * @param lon2 Longitude of Destination (Decimal Degrees)
 * @returns Distance in kilometers, rounded to 2 decimal places
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  }

  const phi1 = degreesToRadians(lat1);
  const phi2 = degreesToRadians(lat2);
  const deltaPhi = degreesToRadians(lat2 - lat1);
  const deltaLambda = degreesToRadians(lon2 - lon1);

  // Haversine core equation
  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  // Angular distance in radians
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distance in kilometers
  const distanceKm = EARTH_RADIUS_KM * c;
  return Number(distanceKm.toFixed(2));
}

/**
 * Computes estimated travel time (ETA) based on distance, resource transit speed,
 * and urban road traffic impedance factor.
 * 
 * @param distanceKm Distance in kilometers
 * @param baseSpeedKmh Base average operational speed (default 45 km/h for emergency vehicle)
 * @param trafficMultiplier Road congestion penalty multiplier (1.0 = clear, 1.5 = moderate, 2.5 = heavy)
 * @returns Estimated travel time in minutes (minimum 1 minute if distance > 0)
 */
export function calculateEstimatedTravelTimeMinutes(
  distanceKm: number,
  baseSpeedKmh = 45,
  trafficMultiplier = 1.0
): number {
  if (distanceKm <= 0.05) return 1;
  const effectiveSpeed = Math.max(15, baseSpeedKmh / trafficMultiplier);
  const hours = distanceKm / effectiveSpeed;
  const minutes = Math.ceil(hours * 60);
  return Math.max(1, minutes);
}

/**
 * Computes forward compass azimuth / bearing in degrees (0° to 360°).
 */
export function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const phi1 = degreesToRadians(lat1);
  const phi2 = degreesToRadians(lat2);
  const deltaLambda = degreesToRadians(lon2 - lon1);

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

  const theta = Math.atan2(y, x);
  const bearing = (radiansToDegrees(theta) + 360) % 360;
  return Number(bearing.toFixed(1));
}
