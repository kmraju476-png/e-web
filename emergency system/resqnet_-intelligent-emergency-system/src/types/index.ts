/**
 * RESQNET — INTELLIGENT EMERGENCY RESOURCE COORDINATION SYSTEM
 * TypeScript Types and Data Contracts for Academic Emergency Response Simulation
 */

export type UserRole = 'Admin / Coordinator' | 'Resource Operator' | 'Viewer';

export type IncidentType =
  | 'Fire'
  | 'Flood'
  | 'Road Accident'
  | 'Building Collapse'
  | 'Medical Emergency'
  | 'Industrial Accident'
  | 'Natural Disaster'
  | 'Other';

export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type IncidentStatus =
  | 'REPORTED'
  | 'VERIFIED'
  | 'PRIORITIZED'
  | 'RESOURCE_ASSIGNED'
  | 'EN_ROUTE'
  | 'ON_SCENE'
  | 'RESOLVED';

export type ResourceType =
  | 'Ambulance'
  | 'Rescue Team'
  | 'Fire Response Unit'
  | 'Medical Team';

export type ResourceStatus =
  | 'AVAILABLE'
  | 'ASSIGNED'
  | 'EN_ROUTE'
  | 'ON_SCENE'
  | 'UNAVAILABLE';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  address?: string;
  landmark?: string;
}

export interface PriorityFactor {
  name: string;
  weight: number;
  contribution: number;
  description: string;
}

export interface PriorityBreakdown {
  score: number; // 0 - 100
  factors: PriorityFactor[];
  reasons: string[];
  formula: string;
  computedAt: string;
}

export interface Incident {
  id: string;
  incidentType: IncidentType;
  title: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  peopleAffected: number;
  severity: SeverityLevel;
  requiredResources: {
    type: ResourceType;
    quantity: number;
  }[];
  status: IncidentStatus;
  priorityScore: number;
  priorityBreakdown: PriorityBreakdown;
  assignedResourceIds: string[];
  assignedHospitalId?: string;
  activeRouteId?: string;
  reportedBy?: string;
  createdTime: string;
  updatedTime: string;
  resolvedTime?: string;
}

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  latitude: number;
  longitude: number;
  status: ResourceStatus;
  capacity: number; // patient transport or squad size
  specialization: string;
  equipment: string[];
  currentIncidentId?: string;
  baseStation: string;
  fuelLevel?: number;
  contactNumber?: string;
  speedKmh: number; // average transit speed
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  totalBeds: number;
  availableBeds: number;
  icuBeds: number;
  availableIcuBeds: number;
  emergencyCapacity: 'LOW' | 'NORMAL' | 'SURGE' | 'CRITICAL_SATURATION';
  status: 'ACTIVE' | 'AT_CAPACITY' | 'DIVERTING' | 'MAINTENANCE';
  traumaLevel: 1 | 2 | 3;
  specialties: string[];
  contactPhone: string;
}

export interface GraphNode {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  nodeType: 'INTERSECTION' | 'HOSPITAL' | 'STATION' | 'LANDMARK' | 'CHECKPOINT';
}

export type RoadCondition = 'CLEAR' | 'MODERATE_TRAFFIC' | 'HEAVY_TRAFFIC' | 'BLOCKED';

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  name: string;
  distanceKm: number;
  baseSpeedKmh: number;
  trafficWeight: number; // multiplier e.g. 1.0 (clear), 1.5 (moderate), 2.5 (heavy)
  condition: RoadCondition;
  isBlocked: boolean;
  bidirectional: boolean;
}

export interface RouteStep {
  nodeId: string;
  nodeName: string;
  latitude: number;
  longitude: number;
  distanceFromStartKm: number;
  estimatedTimeMin: number;
}

export interface RouteCalculationResult {
  routeId: string;
  sourceNodeId: string;
  targetNodeId: string;
  startCoordinates: [number, number];
  endCoordinates: [number, number];
  pathNodeIds: string[];
  pathNodes: GraphNode[];
  pathCoordinates: [number, number][];
  totalDistanceKm: number;
  estimatedTimeMinutes: number;
  hasBlockageDetour: boolean;
  algorithmStepsTrace: string[];
  executionTimeMs: number;
  condition: RoadCondition;
  timestamp: string;
}

export interface ResourceRecommendation {
  resource: Resource;
  distanceKm: number;
  estimatedTimeMinutes: number;
  estimatedEtaMinutes?: number;
  suitabilityScore: number; // 0 - 100
  matchScore?: number;
  breakdown?: {
    distanceScore?: number;
    capacityScore?: number;
    specializationScore?: number;
    readinessScore?: number;
    statusFactor?: number;
  };
  factors: {
    distanceScore: number;
    capacityScore: number;
    specializationScore: number;
    readinessScore: number;
  };
  reasons: string[];
}

export interface HospitalRecommendation {
  hospital: Hospital;
  distanceKm: number;
  estimatedTimeMinutes: number;
  suitabilityScore: number; // 0 - 100
  factors: {
    distanceScore: number;
    bedAvailabilityScore: number;
    icuAvailabilityScore: number;
    traumaMatchScore: number;
  };
  reasons: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action:
    | 'INCIDENT_CREATED'
    | 'INCIDENT_UPDATED'
    | 'INCIDENT_STATUS_CHANGED'
    | 'INCIDENT_DELETED'
    | 'RESOURCE_ALLOCATED'
    | 'RESOURCE_DEALLOCATED'
    | 'RESOURCE_STATUS_CHANGED'
    | 'ROUTE_CALCULATED'
    | 'ROUTE_RECALCULATED'
    | 'ROAD_BLOCKED'
    | 'ROAD_UNBLOCKED'
    | 'HOSPITAL_UPDATED'
    | 'SIMULATION_TRIGGERED'
    | 'SYSTEM_CONFIG_CHANGED';
  actorRole: UserRole;
  actorName: string;
  targetId: string;
  targetType: 'INCIDENT' | 'RESOURCE' | 'HOSPITAL' | 'ROUTE' | 'SIMULATION';
  details: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationItem {
  id: string;
  timestamp: string;
  type: 'CRITICAL_INCIDENT' | 'RESOURCE_ASSIGNED' | 'NO_RESOURCE' | 'ROAD_BLOCKED' | 'HOSPITAL_CAPACITY' | 'INCIDENT_RESOLVED' | 'SYSTEM';
  title: string;
  message: string;
  isRead: boolean;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  relatedIncidentId?: string;
  relatedResourceId?: string;
}

export interface SystemConfig {
  weightSeverity: number;
  weightPeopleAffected: number;
  weightWaitingTime: number;
  weightResourceUrgency: number;
  autoRerouteOnBlockage: boolean;
  simulationTickRateMs: number;
  defaultMapCenter: [number, number];
  defaultMapZoom: number;
  allowManualOverrides: boolean;
}
