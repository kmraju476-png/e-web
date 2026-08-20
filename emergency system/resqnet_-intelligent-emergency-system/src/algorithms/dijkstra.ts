/**
 * RESQNET ALGORITHM MODULE 3: GRAPH ROUTING & DIJKSTRA'S SHORTEST PATH ALGORITHM
 * 
 * Academic Theory & Algorithm Description:
 * Dijkstra's Algorithm is a greedy single-source shortest-path algorithm for directed graphs
 * with non-negative edge weights.
 * 
 * Time Complexity:
 * - With Priority Queue / Binary Min-Heap: O((|V| + |E|) · log |V|)
 * - Graph representation: Adjacency list with dynamic impedance weights
 * 
 * Dynamic Impedance Equation:
 * W(u, v) = Distance(u, v) · TrafficMultiplier(u, v) + BlockagePenalty
 * 
 * If Edge(u, v) is BLOCKED: W(u, v) = ∞ (Edge pruned from traversal)
 */

import { calculateHaversineDistance, calculateEstimatedTravelTimeMinutes } from './haversine';
import { GraphEdge, GraphNode, RoadCondition, RouteCalculationResult } from '../types';

export interface DijkstraStep {
  stepNumber: number;
  currentNodeId: string;
  currentNodeName: string;
  currentTentativeDistance: number;
  action: 'VISIT' | 'RELAX' | 'SKIP_BLOCKED' | 'ALREADY_SETTLED' | 'DESTINATION_REACHED';
  neighborNodeId?: string;
  neighborNodeName?: string;
  edgeWeight?: number;
  newTentativeDistance?: number;
  explanation: string;
}

export interface DijkstraResult {
  pathNodeIds: string[];
  pathNodes: GraphNode[];
  pathCoordinates: [number, number][];
  totalDistanceKm: number;
  estimatedTimeMinutes: number;
  executionSteps: DijkstraStep[];
  textTrace: string[];
  success: boolean;
  message: string;
  executionTimeMs: number;
  hasBlockageDetour: boolean;
  worstCondition: RoadCondition;
}

/**
 * Priority Queue element for Dijkstra's Algorithm
 */
interface PQNode {
  id: string;
  cost: number;
}

/**
 * Min-Heap Priority Queue Implementation
 */
class MinPriorityQueue {
  private heap: PQNode[] = [];

  push(item: PQNode): void {
    this.heap.push(item);
    this.bubbleUp(this.heap.length - 1);
  }

  pop(): PQNode | undefined {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0];
    const bottom = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = bottom;
      this.sinkDown(0);
    }
    return top;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  private bubbleUp(index: number): void {
    let current = index;
    while (current > 0) {
      const parent = Math.floor((current - 1) / 2);
      if (this.heap[current].cost < this.heap[parent].cost) {
        [this.heap[current], this.heap[parent]] = [this.heap[parent], this.heap[current]];
        current = parent;
      } else {
        break;
      }
    }
  }

  private sinkDown(index: number): void {
    let current = index;
    const length = this.heap.length;
    while (true) {
      let leftChild = 2 * current + 1;
      let rightChild = 2 * current + 2;
      let smallest = current;

      if (leftChild < length && this.heap[leftChild].cost < this.heap[smallest].cost) {
        smallest = leftChild;
      }
      if (rightChild < length && this.heap[rightChild].cost < this.heap[smallest].cost) {
        smallest = rightChild;
      }

      if (smallest !== current) {
        [this.heap[current], this.heap[smallest]] = [this.heap[smallest], this.heap[current]];
        current = smallest;
      } else {
        break;
      }
    }
  }
}

/**
 * Finds the nearest Graph Node to a given GPS Coordinate using Haversine Distance.
 */
export function findNearestGraphNode(
  lat: number,
  lng: number,
  nodes: GraphNode[]
): GraphNode {
  if (!nodes || nodes.length === 0) {
    throw new Error('Graph contains no nodes to snap to.');
  }

  let nearestNode = nodes[0];
  let minDistance = calculateHaversineDistance(lat, lng, nodes[0].latitude, nodes[0].longitude);

  for (let i = 1; i < nodes.length; i++) {
    const dist = calculateHaversineDistance(lat, lng, nodes[i].latitude, nodes[i].longitude);
    if (dist < minDistance) {
      minDistance = dist;
      nearestNode = nodes[i];
    }
  }

  return nearestNode;
}

/**
 * Executes Dijkstra's Shortest Path Algorithm on the road network with dynamic traffic and blockage rules.
 */
export function executeDijkstra(
  sourceNodeId: string,
  targetNodeId: string,
  nodes: GraphNode[],
  edges: GraphEdge[],
  options?: {
    allowPartialIfBlocked?: boolean;
    vehicleSpeedKmh?: number;
  }
): DijkstraResult {
  const startTime = performance.now();
  const speed = options?.vehicleSpeedKmh || 45;
  const executionSteps: DijkstraStep[] = [];
  const textTrace: string[] = [];

  const nodeMap = new Map<string, GraphNode>();
  nodes.forEach(n => nodeMap.set(n.id, n));

  const sourceNode = nodeMap.get(sourceNodeId);
  const targetNode = nodeMap.get(targetNodeId);

  if (!sourceNode || !targetNode) {
    return {
      pathNodeIds: [],
      pathNodes: [],
      pathCoordinates: [],
      totalDistanceKm: 0,
      estimatedTimeMinutes: 0,
      executionSteps: [],
      textTrace: ['Error: Source or Destination node not found in graph.'],
      success: false,
      message: 'Source or target node not found in road network.',
      executionTimeMs: 0,
      hasBlockageDetour: false,
      worstCondition: 'CLEAR',
    };
  }

  // Build Adjacency List
  // Map: NodeId -> Array<{ neighborId: string, edge: GraphEdge, weight: number }>
  const adjacency = new Map<string, { neighborId: string; edge: GraphEdge; weight: number }[]>();
  nodes.forEach(n => adjacency.set(n.id, []));

  edges.forEach(edge => {
    // If edge is blocked, we assign infinity or skip it
    if (edge.isBlocked || edge.condition === 'BLOCKED') {
      // Skipped in adjacency
      return;
    }

    // Weight = distance * trafficWeight
    const weight = edge.distanceKm * (edge.trafficWeight || 1.0);

    // Forward edge
    if (adjacency.has(edge.source)) {
      adjacency.get(edge.source)!.push({
        neighborId: edge.target,
        edge,
        weight,
      });
    }

    // Backward edge if bidirectional
    if (edge.bidirectional && adjacency.has(edge.target)) {
      adjacency.get(edge.target)!.push({
        neighborId: edge.source,
        edge,
        weight,
      });
    }
  });

  const distances = new Map<string, number>();
  const previous = new Map<string, string | null>();
  const visited = new Set<string>();

  nodes.forEach(n => {
    distances.set(n.id, Infinity);
    previous.set(n.id, null);
  });

  distances.set(sourceNodeId, 0);

  const pq = new MinPriorityQueue();
  pq.push({ id: sourceNodeId, cost: 0 });

  let stepCounter = 1;
  textTrace.push(`[DIJKSTRA INIT] Source: ${sourceNode.name} (${sourceNodeId}), Destination: ${targetNode.name} (${targetNodeId})`);
  textTrace.push(`[GRAPH STATE] Active Nodes: ${nodes.length}, Active Traversable Edges: ${edges.filter(e => !e.isBlocked).length}`);

  let found = false;

  while (!pq.isEmpty()) {
    const current = pq.pop()!;
    const u = current.id;
    const uNode = nodeMap.get(u)!;

    if (visited.has(u)) {
      continue;
    }

    visited.add(u);

    executionSteps.push({
      stepNumber: stepCounter++,
      currentNodeId: u,
      currentNodeName: uNode.name,
      currentTentativeDistance: Number(distances.get(u)!.toFixed(2)),
      action: 'VISIT',
      explanation: `Settled node '${uNode.name}' with finalized optimal cost of ${distances.get(u)!.toFixed(2)} km-equiv`,
    });

    if (u === targetNodeId) {
      found = true;
      executionSteps.push({
        stepNumber: stepCounter++,
        currentNodeId: u,
        currentNodeName: uNode.name,
        currentTentativeDistance: Number(distances.get(u)!.toFixed(2)),
        action: 'DESTINATION_REACHED',
        explanation: `Target destination '${targetNode.name}' reached. Shortest path tree complete.`,
      });
      textTrace.push(`[GOAL REACHED] Target node '${targetNode.name}' reached with minimal cost.`);
      break;
    }

    const neighbors = adjacency.get(u) || [];
    for (const { neighborId, edge, weight } of neighbors) {
      if (visited.has(neighborId)) {
        continue;
      }

      const neighborNode = nodeMap.get(neighborId);
      const tentative = distances.get(u)! + weight;
      const currentKnown = distances.get(neighborId)!;

      if (tentative < currentKnown) {
        distances.set(neighborId, tentative);
        previous.set(neighborId, u);
        pq.push({ id: neighborId, cost: tentative });

        executionSteps.push({
          stepNumber: stepCounter++,
          currentNodeId: u,
          currentNodeName: uNode.name,
          currentTentativeDistance: Number(distances.get(u)!.toFixed(2)),
          action: 'RELAX',
          neighborNodeId: neighborId,
          neighborNodeName: neighborNode?.name || neighborId,
          edgeWeight: Number(weight.toFixed(2)),
          newTentativeDistance: Number(tentative.toFixed(2)),
          explanation: `Relaxed edge (${uNode.name} -> ${neighborNode?.name}): New tentative cost = ${tentative.toFixed(2)} km-equiv (improved from ${currentKnown === Infinity ? '∞' : currentKnown.toFixed(2)})`,
        });

        textTrace.push(`  → RELAX edge to '${neighborNode?.name}': cost ${tentative.toFixed(2)} via segment '${edge.name}'`);
      }
    }
  }

  // Reconstruct Path
  const pathNodeIds: string[] = [];
  let curr: string | null = targetNodeId;

  if (distances.get(targetNodeId) === Infinity) {
    const elapsed = performance.now() - startTime;
    return {
      pathNodeIds: [],
      pathNodes: [],
      pathCoordinates: [],
      totalDistanceKm: 0,
      estimatedTimeMinutes: 0,
      executionSteps,
      textTrace: [...textTrace, `[NO PATH] Destination '${targetNode.name}' is unreachable due to road blockages or graph partition.`],
      success: false,
      message: 'No traversable path exists between start and destination due to active road blockages.',
      executionTimeMs: Number(elapsed.toFixed(2)),
      hasBlockageDetour: true,
      worstCondition: 'BLOCKED',
    };
  }

  while (curr) {
    pathNodeIds.unshift(curr);
    curr = previous.get(curr) || null;
    if (curr === sourceNodeId) {
      pathNodeIds.unshift(sourceNodeId);
      break;
    }
  }

  const pathNodes = pathNodeIds.map(id => nodeMap.get(id)!).filter(Boolean);
  const pathCoordinates: [number, number][] = pathNodes.map(n => [n.latitude, n.longitude]);

  // Calculate actual physical distance along path
  let totalPhysicalKm = 0;
  let totalMinutes = 0;
  let worstCondition: RoadCondition = 'CLEAR';

  for (let i = 0; i < pathNodeIds.length - 1; i++) {
    const fromId = pathNodeIds[i];
    const toId = pathNodeIds[i + 1];

    const connectingEdge = edges.find(
      e =>
        (e.source === fromId && e.target === toId) ||
        (e.bidirectional && e.source === toId && e.target === fromId)
    );

    if (connectingEdge) {
      totalPhysicalKm += connectingEdge.distanceKm;
      const legTime = calculateEstimatedTravelTimeMinutes(
        connectingEdge.distanceKm,
        connectingEdge.baseSpeedKmh || speed,
        connectingEdge.trafficWeight || 1.0
      );
      totalMinutes += legTime;

      if (connectingEdge.condition === 'HEAVY_TRAFFIC') worstCondition = 'HEAVY_TRAFFIC';
      else if (connectingEdge.condition === 'MODERATE_TRAFFIC' && worstCondition !== 'HEAVY_TRAFFIC') worstCondition = 'MODERATE_TRAFFIC';
    } else {
      const fromN = nodeMap.get(fromId)!;
      const toN = nodeMap.get(toId)!;
      const legKm = calculateHaversineDistance(fromN.latitude, fromN.longitude, toN.latitude, toN.longitude);
      totalPhysicalKm += legKm;
      totalMinutes += calculateEstimatedTravelTimeMinutes(legKm, speed, 1.0);
    }
  }

  // Check if this route detoured around any blocked edges in the graph
  const hasBlockageDetour = edges.some(e => e.isBlocked);
  const elapsed = performance.now() - startTime;

  textTrace.push(`[OPTIMAL ROUTE ASSEMBLED] Path: ${pathNodes.map(n => n.name).join(' → ')}`);
  textTrace.push(`[METRICS] Physical Distance: ${totalPhysicalKm.toFixed(2)} km, ETA: ${totalMinutes} mins, Solver Time: ${elapsed.toFixed(2)} ms`);

  return {
    pathNodeIds,
    pathNodes,
    pathCoordinates,
    totalDistanceKm: Number(totalPhysicalKm.toFixed(2)),
    estimatedTimeMinutes: totalMinutes,
    executionSteps,
    textTrace,
    success: true,
    message: `Optimal route computed across ${pathNodes.length} nodes in ${elapsed.toFixed(2)}ms.`,
    executionTimeMs: Number(elapsed.toFixed(2)),
    hasBlockageDetour,
    worstCondition,
  };
}

export function findShortestPathDijkstra(
  nodes: GraphNode[],
  edges: GraphEdge[],
  sourceNodeId: string,
  targetNodeId: string,
  vehicleSpeedKmh: number = 50
): DijkstraResult {
  return executeDijkstra(sourceNodeId, targetNodeId, nodes, edges, { vehicleSpeedKmh });
}

