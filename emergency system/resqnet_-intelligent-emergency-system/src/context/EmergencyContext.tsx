/**
 * RESQNET CENTRAL APPLICATION CONTEXT & STATE ENGINE
 * Handles real-time reactivity, algorithmic re-computations, audit logging,
 * notification broadcasting, and dynamic rerouting.
 */

import React, { createContext, useContext, useEffect, useState, useMemo, useRef } from 'react';
import {
  AuditLog,
  GraphEdge,
  GraphNode,
  Hospital,
  Incident,
  IncidentStatus,
  NotificationItem,
  Resource,
  ResourceStatus,
  RouteCalculationResult,
  SeverityLevel,
  SystemConfig,
  UserRole,
} from '../types';
import {
  DEFAULT_MAP_CENTER,
  INITIAL_AUDIT_LOGS,
  INITIAL_GRAPH_EDGES,
  INITIAL_GRAPH_NODES,
  INITIAL_HOSPITALS,
  INITIAL_INCIDENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_RESOURCES,
} from '../data/geoGraph';
import { computeIncidentPriority } from '../algorithms/priorityScore';
import { executeDijkstra, findNearestGraphNode, DijkstraResult } from '../algorithms/dijkstra';
import { calculateHaversineDistance } from '../algorithms/haversine';

interface EmergencyContextType {
  // Core Entities
  incidents: Incident[];
  resources: Resource[];
  hospitals: Hospital[];
  nodes: GraphNode[];
  edges: GraphEdge[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  currentRole: UserRole;
  systemConfig: SystemConfig;

  // Active Route Visualizer
  activeRoute: RouteCalculationResult | null;
  activeSelectedIncident: Incident | null;

  // Role Control
  setCurrentRole: (role: UserRole) => void;
  setActiveSelectedIncident: (incident: Incident | null) => void;

  // Incident Operations
  createIncident: (incident: Omit<Incident, 'id' | 'priorityScore' | 'priorityBreakdown' | 'createdTime' | 'updatedTime' | 'assignedResourceIds'>) => Incident;
  updateIncident: (id: string, updates: Partial<Incident>) => void;
  changeIncidentStatus: (id: string, status: IncidentStatus) => void;
  deleteIncident: (id: string) => void;

  // Resource Operations
  createResource: (resource: Omit<Resource, 'id'>) => Resource;
  updateResource: (id: string, updates: Partial<Resource>) => void;
  changeResourceStatus: (id: string, status: ResourceStatus) => void;
  deleteResource: (id: string) => void;

  // Hospital Operations
  createHospital: (hospital: Omit<Hospital, 'id'>) => Hospital;
  updateHospital: (id: string, updates: Partial<Hospital>) => void;
  deleteHospital: (id: string) => void;

  // Graph & Route Operations
  toggleRoadBlockage: (edgeId: string) => void;
  setEdgeTrafficCondition: (edgeId: string, condition: GraphEdge['condition'], trafficWeight: number) => void;
  calculateRoute: (sourceNodeId: string, targetNodeId: string, speedKmh?: number) => RouteCalculationResult;
  calculateRouteBetweenCoords: (start: [number, number], end: [number, number], speedKmh?: number) => RouteCalculationResult;
  setCustomActiveRoute: (route: RouteCalculationResult | DijkstraResult | null) => void;
  setActiveRoute: (route: RouteCalculationResult | null) => void;
  clearActiveRoute: () => void;

  // Allocation & Decision Support
  allocateResourcesToIncident: (incidentId: string, resourceIds: string[], hospitalId?: string) => void;
  deallocateResource: (incidentId: string, resourceId: string) => void;

  // Simulation
  triggerSimulationScenario: (scenarioType: 'MASS_CASUALTY' | 'FLASH_FLOOD' | 'CHEMICAL_LEAK' | 'BRIDGE_COLLAPSE' | 'RANDOM_NEW_CALL') => void;
  simulateRoadIncident: () => void;
  simulateResourceBreakdown: () => void;
  simulateHospitalSurge: () => void;

  // System & Logs
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearAllNotifications: () => void;
  updateSystemConfig: (updates: Partial<SystemConfig>) => void;
  resetToInitialDemoData: () => void;

  // Statistics Summary
  stats: {
    activeIncidents: number;
    criticalIncidents: number;
    availableAmbulances: number;
    activeRescueTeams: number;
    availableHospitalBeds: number;
    assignedResources: number;
    resolvedIncidents: number;
  };
}

const STORAGE_KEYS = {
  INCIDENTS: 'resqnet_incidents_v2',
  RESOURCES: 'resqnet_resources_v2',
  HOSPITALS: 'resqnet_hospitals_v2',
  EDGES: 'resqnet_edges_v2',
  LOGS: 'resqnet_logs_v2',
  NOTIFICATIONS: 'resqnet_notifications_v2',
  CONFIG: 'resqnet_config_v2',
  ROLE: 'resqnet_role_v2',
};

const DEFAULT_CONFIG: SystemConfig = {
  weightSeverity: 0.40,
  weightPeopleAffected: 0.30,
  weightWaitingTime: 0.15,
  weightResourceUrgency: 0.15,
  autoRerouteOnBlockage: true,
  simulationTickRateMs: 5000,
  defaultMapCenter: DEFAULT_MAP_CENTER,
  defaultMapZoom: 13,
  allowManualOverrides: true,
};

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export const EmergencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from LocalStorage or fall back to rich seed data
  const [incidents, setIncidents] = useState<Incident[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INCIDENTS);
      return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
    } catch {
      return INITIAL_INCIDENTS;
    }
  });

  const [resources, setResources] = useState<Resource[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RESOURCES);
      return saved ? JSON.parse(saved) : INITIAL_RESOURCES;
    } catch {
      return INITIAL_RESOURCES;
    }
  });

  const [hospitals, setHospitals] = useState<Hospital[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HOSPITALS);
      return saved ? JSON.parse(saved) : INITIAL_HOSPITALS;
    } catch {
      return INITIAL_HOSPITALS;
    }
  });

  const [nodes] = useState<GraphNode[]>(INITIAL_GRAPH_NODES);

  const [edges, setEdges] = useState<GraphEdge[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EDGES);
      return saved ? JSON.parse(saved) : INITIAL_GRAPH_EDGES;
    } catch {
      return INITIAL_GRAPH_EDGES;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
      return (saved as UserRole) || 'Admin / Coordinator';
    } catch {
      return 'Admin / Coordinator';
    }
  });

  const [systemConfig, setSystemConfig] = useState<SystemConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
      return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  const [activeRoute, setActiveRoute] = useState<RouteCalculationResult | null>(null);
  const [activeSelectedIncident, setActiveSelectedIncident] = useState<Incident | null>(null);

  // Sync state to local storage for persistence across reloads
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HOSPITALS, JSON.stringify(hospitals));
  }, [hospitals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EDGES, JSON.stringify(edges));
  }, [edges]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(systemConfig));
  }, [systemConfig]);

  // Helper sequence counters for collision-proof ID generation
  const logSequenceRef = useRef<number>(0);
  const notifSequenceRef = useRef<number>(0);

  // Helper to add audit log entry
  const logAction = (
    action: AuditLog['action'],
    targetId: string,
    targetType: AuditLog['targetType'],
    details: string,
    metadata?: Record<string, unknown>
  ) => {
    logSequenceRef.current += 1;
    const entry: AuditLog = {
      id: `LOG-${Date.now()}-${logSequenceRef.current}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      action,
      actorRole: currentRole,
      actorName: currentRole === 'Admin / Coordinator' ? 'Dispatcher Admin' : currentRole === 'Resource Operator' ? 'Tactical Operator' : 'Public Viewer',
      targetId,
      targetType,
      details,
      metadata,
    };
    setAuditLogs(prev => [entry, ...prev.slice(0, 150)]);
  };

  // Helper to emit notification
  const notify = (
    type: NotificationItem['type'],
    title: string,
    message: string,
    severity: NotificationItem['severity'],
    relatedIncidentId?: string,
    relatedResourceId?: string
  ) => {
    notifSequenceRef.current += 1;
    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}-${notifSequenceRef.current}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      type,
      title,
      message,
      isRead: false,
      severity,
      relatedIncidentId,
      relatedResourceId,
    };
    setNotifications(prev => [notif, ...prev.slice(0, 50)]);
  };

  // 1. Incident CRUD
  const createIncident = (
    data: Omit<Incident, 'id' | 'priorityScore' | 'priorityBreakdown' | 'createdTime' | 'updatedTime' | 'assignedResourceIds'>
  ): Incident => {
    const id = `INC-${Date.now().toString().slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const createdTime = new Date().toISOString();
    const priorityBreakdown = computeIncidentPriority({
      severity: data.severity,
      peopleAffected: data.peopleAffected,
      incidentType: data.incidentType,
      requiredResources: data.requiredResources,
      createdTime,
    });

    const newIncident: Incident = {
      ...data,
      id,
      priorityScore: priorityBreakdown.score,
      priorityBreakdown,
      assignedResourceIds: [],
      createdTime,
      updatedTime: createdTime,
    };

    setIncidents(prev => [newIncident, ...prev]);

    logAction('INCIDENT_CREATED', id, 'INCIDENT', `Created ${data.severity} incident '${data.title}' at ${data.location}. Priority: ${priorityBreakdown.score}/100.`);

    if (data.severity === 'CRITICAL' || data.severity === 'HIGH') {
      notify('CRITICAL_INCIDENT', `NEW ${data.severity} INCIDENT: ${data.title}`, `Location: ${data.location}. ${data.peopleAffected} casualties reported. Priority Score: ${priorityBreakdown.score}`, data.severity === 'CRITICAL' ? 'CRITICAL' : 'HIGH', id);
    }

    return newIncident;
  };

  const updateIncident = (id: string, updates: Partial<Incident>) => {
    setIncidents(prev =>
      prev.map(inc => {
        if (inc.id !== id) return inc;
        const merged = { ...inc, ...updates, updatedTime: new Date().toISOString() };
        // Recompute priority if key attributes changed
        if (updates.severity || updates.peopleAffected !== undefined || updates.incidentType || updates.requiredResources) {
          const pb = computeIncidentPriority({
            severity: merged.severity,
            peopleAffected: merged.peopleAffected,
            incidentType: merged.incidentType,
            requiredResources: merged.requiredResources,
            createdTime: merged.createdTime,
          });
          merged.priorityScore = pb.score;
          merged.priorityBreakdown = pb;
        }
        return merged;
      })
    );
    logAction('INCIDENT_UPDATED', id, 'INCIDENT', `Updated incident ${id} parameters.`);
  };

  const changeIncidentStatus = (id: string, status: IncidentStatus) => {
    setIncidents(prev =>
      prev.map(inc => {
        if (inc.id !== id) return inc;
        const updated = { ...inc, status, updatedTime: new Date().toISOString() };
        if (status === 'RESOLVED') {
          updated.resolvedTime = new Date().toISOString();
        }
        return updated;
      })
    );

    logAction('INCIDENT_STATUS_CHANGED', id, 'INCIDENT', `Changed incident ${id} lifecycle status to '${status}'.`);

    if (status === 'RESOLVED') {
      // Free up all assigned resources
      const inc = incidents.find(i => i.id === id);
      if (inc && inc.assignedResourceIds.length > 0) {
        setResources(resPrev =>
          resPrev.map(r => {
            if (inc.assignedResourceIds.includes(r.id)) {
              return { ...r, status: 'AVAILABLE', currentIncidentId: undefined };
            }
            return r;
          })
        );
      }
      notify('INCIDENT_RESOLVED', `Incident ${id} Resolved`, `Scene cleared and all dispatched units restored to available standby.`, 'INFO', id);
    }
  };

  const deleteIncident = (id: string) => {
    const inc = incidents.find(i => i.id === id);
    if (inc && inc.assignedResourceIds.length > 0) {
      setResources(resPrev =>
        resPrev.map(r => {
          if (inc.assignedResourceIds.includes(r.id)) {
            return { ...r, status: 'AVAILABLE', currentIncidentId: undefined };
          }
          return r;
        })
      );
    }
    setIncidents(prev => prev.filter(i => i.id !== id));
    logAction('INCIDENT_DELETED', id, 'INCIDENT', `Deleted incident ${id} from operational register.`);
  };

  // 2. Resource CRUD
  const createResource = (resourceData: Omit<Resource, 'id'>): Resource => {
    const prefix = resourceData.type === 'Ambulance' ? 'RES-A' : resourceData.type === 'Rescue Team' ? 'RES-R' : resourceData.type === 'Fire Response Unit' ? 'RES-F' : 'RES-M';
    const id = `${prefix}${Math.floor(10 + Math.random() * 89)}`;
    const newResource: Resource = {
      ...resourceData,
      id,
    };
    setResources(prev => [...prev, newResource]);
    logAction('RESOURCE_STATUS_CHANGED', id, 'RESOURCE', `Added new fleet resource ${newResource.name} (${newResource.type}) to base ${newResource.baseStation}.`);
    return newResource;
  };

  const updateResource = (id: string, updates: Partial<Resource>) => {
    setResources(prev =>
      prev.map(res => {
        if (res.id !== id) return res;
        return { ...res, ...updates };
      })
    );
    logAction('RESOURCE_STATUS_CHANGED', id, 'RESOURCE', `Updated parameters for resource ${id}.`);
  };

  const changeResourceStatus = (id: string, status: ResourceStatus) => {
    setResources(prev =>
      prev.map(res => {
        if (res.id !== id) return res;
        return { ...res, status };
      })
    );
    logAction('RESOURCE_STATUS_CHANGED', id, 'RESOURCE', `Changed resource ${id} status to ${status}.`);
  };

  const deleteResource = (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
    logAction('RESOURCE_STATUS_CHANGED', id, 'RESOURCE', `Decommissioned resource ${id}.`);
  };

  // 3. Hospital CRUD
  const createHospital = (hospitalData: Omit<Hospital, 'id'>): Hospital => {
    const id = `HOSP-0${hospitals.length + 1}`;
    const newHosp: Hospital = { ...hospitalData, id };
    setHospitals(prev => [...prev, newHosp]);
    logAction('HOSPITAL_UPDATED', id, 'HOSPITAL', `Registered new medical hospital facility '${newHosp.name}' with ${newHosp.totalBeds} beds.`);
    return newHosp;
  };

  const updateHospital = (id: string, updates: Partial<Hospital>) => {
    setHospitals(prev =>
      prev.map(hosp => {
        if (hosp.id !== id) return hosp;
        return { ...hosp, ...updates };
      })
    );
    logAction('HOSPITAL_UPDATED', id, 'HOSPITAL', `Updated medical facility ${id} bed capacity and operational status.`);
  };

  const deleteHospital = (id: string) => {
    setHospitals(prev => prev.filter(h => h.id !== id));
    logAction('HOSPITAL_UPDATED', id, 'HOSPITAL', `Removed hospital facility ${id}.`);
  };

  // 4. Graph and Dijkstra Routing
  const toggleRoadBlockage = (edgeId: string) => {
    let affectedEdgeName = '';
    let isNowBlocked = false;

    setEdges(prev =>
      prev.map(edge => {
        if (edge.id !== edgeId) return edge;
        affectedEdgeName = edge.name;
        isNowBlocked = !edge.isBlocked;
        return {
          ...edge,
          isBlocked: isNowBlocked,
          condition: isNowBlocked ? 'BLOCKED' : 'CLEAR',
          trafficWeight: isNowBlocked ? 999 : 1.0,
        };
      })
    );

    const action = isNowBlocked ? 'ROAD_BLOCKED' : 'ROAD_UNBLOCKED';
    logAction(action, edgeId, 'ROUTE', `Road segment '${affectedEdgeName}' (${edgeId}) status changed to ${isNowBlocked ? 'BLOCKED' : 'UNBLOCKED'}.`);

    if (isNowBlocked) {
      notify('ROAD_BLOCKED', `TRAFFIC OBSTRUCTION: ${affectedEdgeName}`, `Road segment ${edgeId} blocked due to hazard. Dynamic recalculation initiated for all active en-route resources.`, 'HIGH');
    }

    // If active route passes through this edge, dynamically recalculate!
    if (activeRoute && systemConfig.autoRerouteOnBlockage) {
      const recalculated = executeDijkstra(
        activeRoute.sourceNodeId,
        activeRoute.targetNodeId,
        nodes,
        edges.map(e => e.id === edgeId ? { ...e, isBlocked: isNowBlocked, condition: isNowBlocked ? 'BLOCKED' : 'CLEAR' } : e)
      );
      setActiveRoute({
        ...recalculated,
        routeId: `ROUTE-${Date.now().toString().slice(-4)}`,
        sourceNodeId: activeRoute.sourceNodeId,
        targetNodeId: activeRoute.targetNodeId,
        startCoordinates: activeRoute.startCoordinates,
        endCoordinates: activeRoute.endCoordinates,
        condition: recalculated.worstCondition,
        algorithmStepsTrace: recalculated.textTrace,
        timestamp: new Date().toISOString(),
      });
      logAction('ROUTE_RECALCULATED', activeRoute.routeId, 'ROUTE', `Dynamic rerouting completed around blocked edge ${edgeId}. New route ETA: ${recalculated.estimatedTimeMinutes} mins.`);
    }
  };

  const setEdgeTrafficCondition = (edgeId: string, condition: GraphEdge['condition'], trafficWeight: number) => {
    setEdges(prev =>
      prev.map(e => (e.id === edgeId ? { ...e, condition, trafficWeight, isBlocked: condition === 'BLOCKED' } : e))
    );
  };

  const calculateRoute = (sourceNodeId: string, targetNodeId: string, speedKmh?: number): RouteCalculationResult => {
    const result = executeDijkstra(sourceNodeId, targetNodeId, nodes, edges, { vehicleSpeedKmh: speedKmh });
    const srcNode = nodes.find(n => n.id === sourceNodeId)!;
    const tgtNode = nodes.find(n => n.id === targetNodeId)!;

    const fullResult: RouteCalculationResult = {
      routeId: `ROUTE-${Date.now().toString().slice(-4)}`,
      sourceNodeId,
      targetNodeId,
      startCoordinates: [srcNode.latitude, srcNode.longitude],
      endCoordinates: [tgtNode.latitude, tgtNode.longitude],
      pathNodeIds: result.pathNodeIds,
      pathNodes: result.pathNodes,
      pathCoordinates: result.pathCoordinates,
      totalDistanceKm: result.totalDistanceKm,
      estimatedTimeMinutes: result.estimatedTimeMinutes,
      hasBlockageDetour: result.hasBlockageDetour,
      algorithmStepsTrace: result.textTrace,
      executionTimeMs: result.executionTimeMs,
      condition: result.worstCondition,
      timestamp: new Date().toISOString(),
    };

    setActiveRoute(fullResult);
    logAction('ROUTE_CALCULATED', fullResult.routeId, 'ROUTE', `Dijkstra solved route from '${srcNode.name}' to '${tgtNode.name}' (${result.totalDistanceKm} km, ETA: ${result.estimatedTimeMinutes} min, execution: ${result.executionTimeMs}ms).`);
    return fullResult;
  };

  const calculateRouteBetweenCoords = (start: [number, number], end: [number, number], speedKmh?: number): RouteCalculationResult => {
    const nearestStart = findNearestGraphNode(start[0], start[1], nodes);
    const nearestEnd = findNearestGraphNode(end[0], end[1], nodes);
    return calculateRoute(nearestStart.id, nearestEnd.id, speedKmh);
  };

  const clearActiveRoute = () => {
    setActiveRoute(null);
  };

  const setCustomActiveRoute = (route: RouteCalculationResult | DijkstraResult | null) => {
    if (!route) {
      setActiveRoute(null);
      return;
    }
    if ('routeId' in route && 'startCoordinates' in route) {
      setActiveRoute(route as RouteCalculationResult);
      return;
    }
    const dResult = route as DijkstraResult & { sourceNodeId?: string; targetNodeId?: string };
    const srcNode = dResult.pathNodes?.[0] || nodes[0];
    const tgtNode = dResult.pathNodes?.[dResult.pathNodes.length - 1] || nodes[nodes.length - 1];

    if (!srcNode || !tgtNode) return;

    const fullResult: RouteCalculationResult = {
      routeId: `CUSTOM-${Date.now().toString().slice(-4)}`,
      sourceNodeId: dResult.sourceNodeId || srcNode.id,
      targetNodeId: dResult.targetNodeId || tgtNode.id,
      startCoordinates: [srcNode.latitude, srcNode.longitude],
      endCoordinates: [tgtNode.latitude, tgtNode.longitude],
      pathNodeIds: dResult.pathNodeIds || [],
      pathNodes: dResult.pathNodes || [],
      pathCoordinates: dResult.pathCoordinates || [],
      totalDistanceKm: dResult.totalDistanceKm || 0,
      estimatedTimeMinutes: dResult.estimatedTimeMinutes || 0,
      hasBlockageDetour: dResult.hasBlockageDetour || false,
      algorithmStepsTrace: dResult.textTrace || [],
      executionTimeMs: dResult.executionTimeMs || 0,
      condition: dResult.worstCondition || 'CLEAR',
      timestamp: new Date().toISOString(),
    };

    setActiveRoute(fullResult);
    logAction('ROUTE_CALCULATED', fullResult.routeId, 'ROUTE', `Custom route active on map: '${srcNode.name}' to '${tgtNode.name}' (${fullResult.totalDistanceKm} km, ETA: ${fullResult.estimatedTimeMinutes} min).`);
  };

  // 5. Allocation Operations
  const allocateResourcesToIncident = (incidentId: string, resourceIds: string[], hospitalId?: string) => {
    const inc = incidents.find(i => i.id === incidentId);
    if (!inc) return;

    // Update Resources status
    setResources(prev =>
      prev.map(res => {
        if (resourceIds.includes(res.id)) {
          return {
            ...res,
            status: 'EN_ROUTE',
            currentIncidentId: incidentId,
          };
        }
        return res;
      })
    );

    // Update Incident
    const newAssigned = Array.from(new Set([...inc.assignedResourceIds, ...resourceIds]));
    setIncidents(prev =>
      prev.map(i => {
        if (i.id !== incidentId) return i;
        return {
          ...i,
          assignedResourceIds: newAssigned,
          assignedHospitalId: hospitalId || i.assignedHospitalId,
          status: 'RESOURCE_ASSIGNED',
          updatedTime: new Date().toISOString(),
        };
      })
    );

    logAction('RESOURCE_ALLOCATED', incidentId, 'INCIDENT', `Allocated ${resourceIds.length} resources (${resourceIds.join(', ')}) to incident ${incidentId}. Destination hospital: ${hospitalId || 'Local stabilization'}.`);

    notify('RESOURCE_ASSIGNED', `Resources Dispatched to ${inc.title}`, `${resourceIds.length} unit(s) marked EN_ROUTE. Real-time tactical tracking active.`, 'MEDIUM', incidentId);

    // Automatically calculate route for the first allocated resource to the incident
    if (resourceIds.length > 0) {
      const firstRes = resources.find(r => r.id === resourceIds[0]);
      if (firstRes) {
        calculateRouteBetweenCoords([firstRes.latitude, firstRes.longitude], [inc.latitude, inc.longitude], firstRes.speedKmh);
      }
    }
  };

  const deallocateResource = (incidentId: string, resourceId: string) => {
    setResources(prev =>
      prev.map(res => {
        if (res.id === resourceId) {
          return { ...res, status: 'AVAILABLE', currentIncidentId: undefined };
        }
        return res;
      })
    );

    setIncidents(prev =>
      prev.map(i => {
        if (i.id !== incidentId) return i;
        const filtered = i.assignedResourceIds.filter(id => id !== resourceId);
        return {
          ...i,
          assignedResourceIds: filtered,
          status: filtered.length === 0 ? 'PRIORITIZED' : i.status,
          updatedTime: new Date().toISOString(),
        };
      })
    );

    logAction('RESOURCE_DEALLOCATED', incidentId, 'RESOURCE', `Released resource ${resourceId} from incident ${incidentId}.`);
  };

  // 6. Simulation Scenarios
  const triggerSimulationScenario = (scenarioType: 'MASS_CASUALTY' | 'FLASH_FLOOD' | 'CHEMICAL_LEAK' | 'BRIDGE_COLLAPSE' | 'RANDOM_NEW_CALL') => {
    if (scenarioType === 'MASS_CASUALTY') {
      createIncident({
        incidentType: 'Building Collapse',
        title: 'SIMULATION: Metro Railway Station Concourse Collapse',
        description: 'Simulated structural roof failure at Central Transit Terminal. 24 casualties estimated with multiple trapped commuters.',
        location: 'Central Transit Concourse (NODE-3)',
        latitude: 19.0760,
        longitude: 72.8777,
        peopleAffected: 24,
        severity: 'CRITICAL',
        requiredResources: [
          { type: 'Rescue Team', quantity: 2 },
          { type: 'Ambulance', quantity: 5 },
          { type: 'Medical Team', quantity: 2 },
        ],
        status: 'REPORTED',
      });
      logAction('SIMULATION_TRIGGERED', 'SIM-MASS-CASUALTY', 'SIMULATION', 'Triggered Mass Casualty Simulation event (24 casualties).');
    } else if (scenarioType === 'FLASH_FLOOD') {
      // Block bridge & river roads and create flood incident
      setEdges(prev =>
        prev.map(e => {
          if (e.id === 'EDGE-14' || e.id === 'EDGE-17') {
            return { ...e, isBlocked: true, condition: 'BLOCKED', trafficWeight: 999 };
          }
          return e;
        })
      );
      createIncident({
        incidentType: 'Flood',
        title: 'SIMULATION: Flash Inundation at South Gateway Underpass',
        description: 'Rapid cloudburst leading to severe flash flooding. South Trunk Underpass submerged; 4 vehicles swept towards river bank.',
        location: 'South River Gateway (NODE-7)',
        latitude: 19.0310,
        longitude: 72.8620,
        peopleAffected: 9,
        severity: 'HIGH',
        requiredResources: [
          { type: 'Rescue Team', quantity: 2 },
          { type: 'Ambulance', quantity: 2 },
        ],
        status: 'REPORTED',
      });
      logAction('SIMULATION_TRIGGERED', 'SIM-FLOOD', 'SIMULATION', 'Triggered Flash Flood Simulation: Inundated South Gateway and blocked River Bridge & Underpass.');
      notify('ROAD_BLOCKED', 'SIMULATION: 2 Road Segments Inundated', 'South Trunk Underpass and River Bridge blocked due to simulated flooding.', 'HIGH');
    } else if (scenarioType === 'CHEMICAL_LEAK') {
      createIncident({
        incidentType: 'Industrial Accident',
        title: 'SIMULATION: Toxic Ammonia Gas Cloud at Port Warehouse',
        description: 'High-pressure refrigerant cylinder explosion creating hazardous ammonia plume drifting toward harbor residential quarters.',
        location: 'Harbor Commercial Interchange (NODE-2)',
        latitude: 19.1010,
        longitude: 72.8920,
        peopleAffected: 12,
        severity: 'CRITICAL',
        requiredResources: [
          { type: 'Fire Response Unit', quantity: 2 },
          { type: 'Rescue Team', quantity: 1 },
          { type: 'Ambulance', quantity: 3 },
          { type: 'Medical Team', quantity: 1 },
        ],
        status: 'REPORTED',
      });
      logAction('SIMULATION_TRIGGERED', 'SIM-HAZMAT', 'SIMULATION', 'Triggered Chemical Plume Hazmat event at Harbor commercial sector.');
    } else if (scenarioType === 'BRIDGE_COLLAPSE') {
      // Block West Coastal bridge
      setEdges(prev =>
        prev.map(e => {
          if (e.id === 'EDGE-10' || e.id === 'EDGE-17') {
            return { ...e, isBlocked: true, condition: 'BLOCKED', trafficWeight: 999 };
          }
          return e;
        })
      );
      createIncident({
        incidentType: 'Road Accident',
        title: 'SIMULATION: West Coastal Bridge Pier Impact & Closure',
        description: 'Barge collision against West Coastal Bridge pier. Bridge approach closed; 2 cars suspended over guardrail.',
        location: 'West Coastal Bridgehead (NODE-6)',
        latitude: 19.0480,
        longitude: 72.8310,
        peopleAffected: 5,
        severity: 'HIGH',
        requiredResources: [
          { type: 'Rescue Team', quantity: 2 },
          { type: 'Ambulance', quantity: 2 },
        ],
        status: 'REPORTED',
      });
      logAction('SIMULATION_TRIGGERED', 'SIM-BRIDGE', 'SIMULATION', 'Triggered Bridge Pier Impact and severed West Promenade access.');
    } else {
      // Random new call
      const randomTypes: Incident['incidentType'][] = ['Fire', 'Road Accident', 'Medical Emergency', 'Industrial Accident'];
      const pickedType = randomTypes[Math.floor(Math.random() * randomTypes.length)];
      const lat = 19.04 + Math.random() * 0.07;
      const lng = 72.84 + Math.random() * 0.07;
      createIncident({
        incidentType: pickedType,
        title: `SIMULATION: Dynamic Call - ${pickedType} Reported`,
        description: `Autonomous emergency dispatch call generated by academic simulation harness for dynamic load stress-testing.`,
        location: `Metropolitan Grid (Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)})`,
        latitude: lat,
        longitude: lng,
        peopleAffected: Math.floor(1 + Math.random() * 7),
        severity: Math.random() > 0.5 ? 'HIGH' : 'MEDIUM',
        requiredResources: [
          { type: 'Ambulance', quantity: 1 },
          { type: 'Rescue Team', quantity: 1 },
        ],
        status: 'REPORTED',
      });
    }
  };

  const simulateRoadIncident = () => {
    // Pick an unblocked edge at random and block it
    const clearEdges = edges.filter(e => !e.isBlocked);
    if (clearEdges.length > 0) {
      const targetEdge = clearEdges[Math.floor(Math.random() * clearEdges.length)];
      toggleRoadBlockage(targetEdge.id);
    }
  };

  const simulateResourceBreakdown = () => {
    const avail = resources.filter(r => r.status === 'AVAILABLE');
    if (avail.length > 0) {
      const target = avail[Math.floor(Math.random() * avail.length)];
      changeResourceStatus(target.id, 'UNAVAILABLE');
      notify('NO_RESOURCE', `Resource Breakdown: ${target.name}`, `Unit ${target.id} reported mechanical failure and is offline for repairs.`, 'HIGH', undefined, target.id);
    }
  };

  const simulateHospitalSurge = () => {
    const hosp = hospitals[Math.floor(Math.random() * hospitals.length)];
    if (hosp) {
      updateHospital(hosp.id, {
        availableBeds: Math.max(0, hosp.availableBeds - 6),
        availableIcuBeds: Math.max(0, hosp.availableIcuBeds - 2),
        emergencyCapacity: 'SURGE',
        status: 'AT_CAPACITY',
      });
      notify('HOSPITAL_CAPACITY', `Surge Saturation: ${hosp.name}`, `Facility reached full surge threshold. Available ICU beds reduced.`, 'HIGH');
    }
  };

  // 7. Notification Handlers
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const updateSystemConfig = (updates: Partial<SystemConfig>) => {
    setSystemConfig(prev => ({ ...prev, ...updates }));
    logAction('SYSTEM_CONFIG_CHANGED', 'CONFIG', 'SIMULATION', 'Updated decision-support weights and routing configuration.');
  };

  const resetToInitialDemoData = () => {
    localStorage.clear();
    setIncidents(INITIAL_INCIDENTS);
    setResources(INITIAL_RESOURCES);
    setHospitals(INITIAL_HOSPITALS);
    setEdges(INITIAL_GRAPH_EDGES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentRole('Admin / Coordinator');
    setSystemConfig(DEFAULT_CONFIG);
    setActiveRoute(null);
    setActiveSelectedIncident(null);
  };

  // Real-time Statistics KPI derivations
  const stats = useMemo(() => {
    const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED').length;
    const criticalIncidents = incidents.filter(i => i.status !== 'RESOLVED' && i.severity === 'CRITICAL').length;
    const availableAmbulances = resources.filter(r => r.type === 'Ambulance' && r.status === 'AVAILABLE').length;
    const activeRescueTeams = resources.filter(r => r.type === 'Rescue Team' && (r.status === 'ASSIGNED' || r.status === 'EN_ROUTE' || r.status === 'ON_SCENE')).length;
    const availableHospitalBeds = hospitals.reduce((sum, h) => sum + h.availableBeds, 0);
    const assignedResources = resources.filter(r => r.status === 'ASSIGNED' || r.status === 'EN_ROUTE' || r.status === 'ON_SCENE').length;
    const resolvedIncidents = incidents.filter(i => i.status === 'RESOLVED').length;

    return {
      activeIncidents,
      criticalIncidents,
      availableAmbulances,
      activeRescueTeams,
      availableHospitalBeds,
      assignedResources,
      resolvedIncidents,
    };
  }, [incidents, resources, hospitals]);

  return (
    <EmergencyContext.Provider
      value={{
        incidents,
        resources,
        hospitals,
        nodes,
        edges,
        auditLogs,
        notifications,
        currentRole,
        systemConfig,
        activeRoute,
        activeSelectedIncident,
        setCurrentRole,
        setActiveSelectedIncident,
        createIncident,
        updateIncident,
        changeIncidentStatus,
        deleteIncident,
        createResource,
        updateResource,
        changeResourceStatus,
        deleteResource,
        createHospital,
        updateHospital,
        deleteHospital,
        toggleRoadBlockage,
        setEdgeTrafficCondition,
        calculateRoute,
        calculateRouteBetweenCoords,
        setCustomActiveRoute,
        setActiveRoute,
        clearActiveRoute,
        allocateResourcesToIncident,
        deallocateResource,
        triggerSimulationScenario,
        simulateRoadIncident,
        simulateResourceBreakdown,
        simulateHospitalSurge,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearAllNotifications,
        updateSystemConfig,
        resetToInitialDemoData,
        stats,
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
};
