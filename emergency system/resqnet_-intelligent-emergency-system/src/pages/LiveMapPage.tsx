import React, { useState } from 'react';
import { useEmergency } from '../context/EmergencyContext';
import { LiveEmergencyMap } from '../components/map/LiveEmergencyMap';
import { SeverityBadge, IncidentStatusBadge, ResourceStatusBadge } from '../components/common/Badge';
import { Incident, Resource, GraphEdge } from '../types';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Navigation,
  AlertTriangle,
  Truck,
  Shield,
  Activity,
  Layers,
  Zap,
  Sliders,
  RotateCcw,
} from 'lucide-react';

export const LiveMapPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    incidents,
    resources,
    hospitals,
    edges,
    activeRoute,
    toggleRoadBlockage,
    setActiveSelectedIncident,
    calculateRouteBetweenCoords,
    clearActiveRoute,
  } = useEmergency();

  const [mapFocus, setMapFocus] = useState<[number, number] | undefined>(undefined);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [activeTab, setActiveTab] = useState<'incidents' | 'resources' | 'roads'>('incidents');

  const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED');

  const handleFocusIncident = (inc: Incident) => {
    setSelectedIncident(inc);
    setMapFocus([inc.latitude, inc.longitude]);
  };

  const handleRouteToIncident = (inc: Incident) => {
    // Find closest available ambulance
    const availAmbulances = resources.filter(r => r.type === 'Ambulance' && r.status === 'AVAILABLE');
    const unit = availAmbulances.length > 0 ? availAmbulances[0] : resources[0];
    if (unit) {
      calculateRouteBetweenCoords([unit.latitude, unit.longitude], [inc.latitude, inc.longitude], unit.speedKmh);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Geospatial Operations Map
            </h1>
            <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-xs font-bold text-blue-300 border border-blue-500/30">
              Leaflet Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time tactical situational awareness with multi-layered topological road graph & shortest-path overlays.
          </p>
        </div>

        {activeRoute && (
          <button
            type="button"
            onClick={clearActiveRoute}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear Active Route Overlay
          </button>
        )}
      </div>

      {/* Main Layout: Map (Left 8 Cols) + Tactical Inspector (Right 4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map View */}
        <div className="lg:col-span-8 space-y-4">
          <LiveEmergencyMap
            height="640px"
            focusCoordinates={mapFocus}
            showHUD={true}
          />

          {/* Color Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 text-xs text-slate-400 backdrop-blur-md">
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-semibold text-slate-200">Map Legend:</span>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-500 shadow-sm shadow-rose-950" />
                <span className="text-slate-300">Critical (Pulsing)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-amber-500" />
                <span className="text-slate-300">High</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="text-slate-300">Medium</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="text-slate-300">Low</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-sky-600" />
                <span className="text-slate-300">Hospital</span>
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-400">
              Datum: WGS 84 • Tile Source: CartoDB / OSM
            </div>
          </div>
        </div>

        {/* Tactical Control Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          {/* Tabs */}
          <div className="flex rounded-xl border border-slate-800 bg-slate-900/90 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('incidents')}
              className={`flex-1 rounded-lg py-2 transition-colors ${
                activeTab === 'incidents'
                  ? 'bg-rose-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Incidents ({activeIncidents.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('resources')}
              className={`flex-1 rounded-lg py-2 transition-colors ${
                activeTab === 'resources'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Fleet ({resources.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('roads')}
              className={`flex-1 rounded-lg py-2 transition-colors ${
                activeTab === 'roads'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Road Net ({edges.length})
            </button>
          </div>

          {/* Tab 1: Incidents List */}
          {activeTab === 'incidents' && (
            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {activeIncidents.map(inc => (
                <div
                  key={inc.id}
                  className={`rounded-xl border p-3.5 transition-all ${
                    selectedIncident?.id === inc.id
                      ? 'border-rose-500/80 bg-rose-950/20 shadow-lg'
                      : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-slate-400">{inc.id}</span>
                    <SeverityBadge severity={inc.severity} />
                  </div>

                  <h4 className="text-xs font-bold text-white mb-1">{inc.title}</h4>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mb-2">
                    <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
                    {inc.location}
                  </p>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                    <span className="font-mono font-bold text-rose-400">
                      Priority: {inc.priorityScore}/100
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleFocusIncident(inc)}
                        className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-[10px] font-semibold text-slate-300 hover:bg-slate-700"
                      >
                        Focus
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRouteToIncident(inc)}
                        className="rounded-md bg-blue-600/80 px-2 py-1 text-[10px] font-semibold text-white hover:bg-blue-600"
                      >
                        Route
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSelectedIncident(inc);
                          navigate('/allocation');
                        }}
                        className="rounded-md bg-rose-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-rose-500"
                      >
                        Dispatch
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Resources List */}
          {activeTab === 'resources' && (
            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {resources.map(res => (
                <div
                  key={res.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white">{res.name}</span>
                    <ResourceStatusBadge status={res.status} />
                  </div>

                  <div className="text-[11px] text-slate-400 space-y-0.5 mb-2">
                    <div>Type: <strong className="text-slate-300">{res.type}</strong></div>
                    <div>Base: {res.baseStation} • Speed: {res.speedKmh} km/h</div>
                    <div className="line-clamp-1">Specialty: {res.specialization}</div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                    <span className="font-mono text-[10px] text-slate-400">
                      Cap: {res.capacity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setMapFocus([res.latitude, res.longitude])}
                      className="rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-[10px] font-semibold text-slate-300 hover:bg-slate-700"
                    >
                      Locate GPS
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Road Blockage & Graph Topology */}
          {activeTab === 'roads' && (
            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-3 text-xs text-purple-200">
                <span className="font-bold block mb-1">Dynamic Graph Topology</span>
                Click any road segment below to simulate immediate blockage. The Dijkstra engine will recalculate active paths.
              </div>

              {edges.map(edge => {
                const isBlocked = edge.isBlocked || edge.condition === 'BLOCKED';
                return (
                  <div
                    key={edge.id}
                    className={`rounded-xl border p-3 transition-colors ${
                      isBlocked
                        ? 'border-rose-500/60 bg-rose-950/20'
                        : 'border-slate-800 bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{edge.name}</span>
                      <span
                        className={`text-[10px] font-bold uppercase rounded px-1.5 py-0.5 ${
                          isBlocked ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {isBlocked ? 'BLOCKED' : 'CLEAR'}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center justify-between mb-2">
                      <span>{edge.distanceKm} km • {edge.baseSpeedKmh} km/h base</span>
                      <span className="font-mono text-slate-400">Weight: {isBlocked ? '∞' : edge.trafficWeight}x</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleRoadBlockage(edge.id)}
                      className={`w-full rounded-lg py-1.5 text-xs font-bold transition-colors ${
                        isBlocked
                          ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                          : 'bg-rose-600/20 text-rose-300 border border-rose-500/30 hover:bg-rose-600/40'
                      }`}
                    >
                      {isBlocked ? '✓ Reopen Road Segment' : '⚠️ Simulate Blockage'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
