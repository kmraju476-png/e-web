import React, { useState, useMemo } from 'react';
import { useEmergency } from '../context/EmergencyContext';
import { LiveEmergencyMap } from '../components/map/LiveEmergencyMap';
import { findShortestPathDijkstra } from '../algorithms/dijkstra';
import { GraphNode } from '../types';
import {
  Route,
  Navigation,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Clock,
  Gauge,
  Sliders,
  Sparkles,
  ArrowRight,
  Shield,
} from 'lucide-react';

export const RoutesPage: React.FC = () => {
  const {
    nodes,
    edges,
    activeRoute,
    toggleRoadBlockage,
    setCustomActiveRoute,
    clearActiveRoute,
    resources,
    incidents,
  } = useEmergency();

  const [sourceNodeId, setSourceNodeId] = useState<string>(nodes[0]?.id || 'N-01');
  const [targetNodeId, setTargetNodeId] = useState<string>(nodes[nodes.length - 1]?.id || 'N-15');
  const [vehicleSpeed, setVehicleSpeed] = useState<number>(50);

  // Compute live shortest path
  const calculatedRoute = useMemo(() => {
    return findShortestPathDijkstra(nodes, edges, sourceNodeId, targetNodeId, vehicleSpeed);
  }, [nodes, edges, sourceNodeId, targetNodeId, vehicleSpeed]);

  const handleApplyRouteToMap = () => {
    if (calculatedRoute) {
      setCustomActiveRoute(calculatedRoute);
    }
  };

  const handleSwapNodes = () => {
    const temp = sourceNodeId;
    setSourceNodeId(targetNodeId);
    setTargetNodeId(temp);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Dijkstra Dynamic Shortest Path Engine
            </h1>
            <span className="rounded-md bg-purple-500/20 px-2 py-0.5 text-xs font-bold text-purple-300 border border-purple-500/30">
              Min-Heap Priority Queue
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time urban road network traversal with dynamic edge blockage pruning and traffic weight multipliers.
          </p>
        </div>

        <button
          type="button"
          onClick={handleApplyRouteToMap}
          className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-950/50 hover:bg-purple-500 transition-colors self-start sm:self-auto"
        >
          <Navigation className="h-4 w-4" />
          Sync Route with Live Map HUD
        </button>
      </div>

      {/* Control Panel: Source / Destination & Speed */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
        <div className="md:col-span-4 space-y-1">
          <label className="block text-xs font-semibold text-slate-300">
            Origin Graph Node (Start)
          </label>
          <select
            value={sourceNodeId}
            onChange={e => setSourceNodeId(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-bold text-white focus:border-purple-500 focus:outline-none"
          >
            {nodes.map(n => (
              <option key={n.id} value={n.id}>
                [{n.id}] {n.name}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-1 flex items-end justify-center pb-1">
          <button
            type="button"
            onClick={handleSwapNodes}
            title="Swap Origin & Destination"
            className="rounded-xl border border-slate-700 bg-slate-800 p-2 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            ⇄
          </button>
        </div>

        <div className="md:col-span-4 space-y-1">
          <label className="block text-xs font-semibold text-slate-300">
            Destination Graph Node (Target)
          </label>
          <select
            value={targetNodeId}
            onChange={e => setTargetNodeId(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-bold text-white focus:border-purple-500 focus:outline-none"
          >
            {nodes.map(n => (
              <option key={n.id} value={n.id}>
                [{n.id}] {n.name}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3 space-y-1">
          <label className="block text-xs font-semibold text-slate-300">
            Vehicle Cruise Velocity
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="20"
              max="90"
              value={vehicleSpeed}
              onChange={e => setVehicleSpeed(parseInt(e.target.value))}
              className="w-full accent-purple-500"
            />
            <span className="font-mono text-xs font-bold text-purple-400 shrink-0 w-16 text-right">
              {vehicleSpeed} km/h
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Map & Dijkstra Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Map */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
            <LiveEmergencyMap height="480px" />
          </div>

          {/* Road Network Blockage Simulator Quick List */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Interactive Road Blockage Stress Testing
              </span>
              <span className="text-[11px] text-slate-400">
                Blocked: <strong className="text-rose-400">{edges.filter(e => e.isBlocked).length}</strong> / {edges.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {edges.map(edge => {
                const isBlocked = edge.isBlocked || edge.condition === 'BLOCKED';
                return (
                  <button
                    key={edge.id}
                    type="button"
                    onClick={() => toggleRoadBlockage(edge.id)}
                    className={`flex items-center justify-between rounded-lg p-2 text-xs border text-left transition-colors ${
                      isBlocked
                        ? 'border-rose-500/50 bg-rose-950/30 text-rose-200'
                        : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="truncate pr-2">{edge.name}</span>
                    <span
                      className={`text-[9px] font-bold rounded px-1.5 py-0.5 shrink-0 ${
                        isBlocked ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isBlocked ? 'BLOCKED' : 'CLEAR'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Dijkstra Metrics & Waypoint Traversal */}
        <div className="lg:col-span-5 space-y-4">
          {calculatedRoute ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl space-y-4">
              {/* Route Summary KPI */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs text-slate-400">Dijkstra Computed ETA</span>
                  <div className="text-2xl font-black text-purple-400 font-mono">
                    {calculatedRoute.estimatedTimeMinutes} min
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400">Optimal Distance</span>
                  <div className="text-2xl font-black text-white font-mono">
                    {calculatedRoute.totalDistanceKm} km
                  </div>
                </div>
              </div>

              {calculatedRoute.hasBlockageDetour && (
                <div className="flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-950/30 p-3 text-xs text-amber-200">
                  <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>
                    Dijkstra detected blocked edges on standard corridor. Detour route calculated with zero obstruction delay.
                  </span>
                </div>
              )}

              {/* Waypoint Sequence */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Node Sequence ({calculatedRoute.pathNodes.length} Waypoints)
                </span>
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 max-h-60 overflow-y-auto space-y-2">
                  {calculatedRoute.pathNodes.map((node, index) => (
                    <div key={`${node.id}-${index}`} className="flex items-center gap-3 text-xs">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-[10px] font-bold text-purple-300 border border-purple-500/40">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <span className="font-bold text-white">{node.name}</span>
                        <span className="text-[10px] text-slate-500 block">
                          GPS: {node.latitude.toFixed(4)}, {node.longitude.toFixed(4)}
                        </span>
                      </div>
                      {index === 0 && (
                        <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[9px] font-bold text-blue-300">
                          START
                        </span>
                      )}
                      {index === calculatedRoute.pathNodes.length - 1 && (
                        <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[9px] font-bold text-rose-300">
                          DEST
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <button
                type="button"
                onClick={handleApplyRouteToMap}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 text-xs font-bold text-white shadow-lg hover:bg-purple-500 transition-colors"
              >
                <Navigation className="h-4 w-4" />
                Project Onto Operational Map
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-8 text-center text-xs text-rose-200">
              <AlertTriangle className="h-8 w-8 text-rose-400 mx-auto mb-2" />
              <h3 className="font-bold text-sm text-white mb-1">No Valid Path Found</h3>
              <p className="text-slate-400">
                All connecting road segments are blocked. Please unblock one or more road edges to restore graph connectivity.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
