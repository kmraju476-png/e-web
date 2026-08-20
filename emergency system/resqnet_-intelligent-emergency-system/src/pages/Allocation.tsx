import React, { useState, useMemo } from 'react';
import { useEmergency } from '../context/EmergencyContext';
import { Incident, Resource, Hospital } from '../types';
import { recommendResourcesForIncident } from '../algorithms/resourceMatching';
import { recommendHospitalsForIncident } from '../algorithms/hospitalMatching';
import { SeverityBadge, IncidentStatusBadge, ResourceStatusBadge } from '../components/common/Badge';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  Shield,
  Building2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Calculator,
  Navigation,
  Sparkles,
  Layers,
  MapPin,
  Clock,
  Gauge,
  Sliders,
} from 'lucide-react';

export const AllocationPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    incidents,
    resources,
    hospitals,
    activeSelectedIncident,
    setActiveSelectedIncident,
    assignResourceToIncident,
    calculateRouteBetweenCoords,
    currentRole,
  } = useEmergency();

  // Active un-resolved incidents
  const activeIncidents = useMemo(
    () => incidents.filter(i => i.status !== 'RESOLVED'),
    [incidents]
  );

  const selectedIncident =
    activeSelectedIncident || (activeIncidents.length > 0 ? activeIncidents[0] : null);

  const [selectedResourceIds, setSelectedResourceIds] = useState<string[]>([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);
  const [dispatchSuccessMessage, setDispatchSuccessMessage] = useState<string | null>(null);

  // Compute resource recommendations using MCDM algorithm
  const resourceRecommendations = useMemo(() => {
    if (!selectedIncident) return [];
    return recommendResourcesForIncident(selectedIncident, resources, 10);
  }, [selectedIncident, resources]);

  // Compute hospital recommendations
  const hospitalRecommendations = useMemo(() => {
    if (!selectedIncident) return [];
    return recommendHospitalsForIncident(selectedIncident, hospitals);
  }, [selectedIncident, hospitals]);

  const handleToggleResource = (rId: string) => {
    if (selectedResourceIds.includes(rId)) {
      setSelectedResourceIds(selectedResourceIds.filter(id => id !== rId));
    } else {
      setSelectedResourceIds([...selectedResourceIds, rId]);
    }
  };

  const handleExecuteDispatch = () => {
    if (!selectedIncident) return;
    if (selectedResourceIds.length === 0) {
      alert('Please select at least one tactical resource unit to dispatch.');
      return;
    }

    selectedResourceIds.forEach(rId => {
      assignResourceToIncident(selectedIncident.id, rId);

      // Trigger Dijkstra Route computation for the first dispatched unit
      const unit = resources.find(r => r.id === rId);
      if (unit) {
        calculateRouteBetweenCoords(
          [unit.latitude, unit.longitude],
          [selectedIncident.latitude, selectedIncident.longitude],
          unit.speedKmh
        );
      }
    });

    setDispatchSuccessMessage(
      `Dispatched ${selectedResourceIds.length} tactical units to "${selectedIncident.title}". Dijkstra optimal route calculated and loaded into the routing HUD.`
    );
    setSelectedResourceIds([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Intelligent Resource Coordination & MCDM Engine
            </h1>
            <span className="rounded-md bg-rose-500/20 px-2 py-0.5 text-xs font-bold text-rose-400 border border-rose-500/30">
              MCDM Algorithmic Core
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Automated multi-attribute decision support matching unit capabilities, Haversine proximity, speed ratings, and hospital trauma beds.
          </p>
        </div>

        {currentRole === 'Viewer' && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 px-3.5 py-2 text-xs font-medium text-amber-300">
            Read-Only Mode: Switch to Coordinator in top-right to execute live dispatch.
          </div>
        )}
      </div>

      {/* Dispatch Success Alert */}
      {dispatchSuccessMessage && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-4 text-xs text-emerald-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <span>{dispatchSuccessMessage}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/routes')}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 font-bold text-white hover:bg-emerald-500 transition-colors"
            >
              View Route →
            </button>
            <button
              type="button"
              onClick={() => setDispatchSuccessMessage(null)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Target Incident Selection Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Select Target Emergency Incident
            </h2>
          </div>

          <select
            value={selectedIncident?.id || ''}
            onChange={e => {
              const found = incidents.find(i => i.id === e.target.value);
              if (found) setActiveSelectedIncident(found);
            }}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-xs font-bold text-white focus:border-rose-500 focus:outline-none"
          >
            {activeIncidents.map(inc => (
              <option key={inc.id} value={inc.id}>
                [{inc.id}] {inc.title} (Priority: {inc.priorityScore}/100 - {inc.severity})
              </option>
            ))}
          </select>
        </div>

        {/* Selected Incident Details Box */}
        {selectedIncident && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 text-xs">
            <div>
              <span className="text-slate-400 text-[11px] block">Incident Title:</span>
              <span className="font-bold text-white text-sm">{selectedIncident.title}</span>
              <div className="flex items-center gap-1 text-slate-400 mt-1">
                <MapPin className="h-3 w-3 text-slate-500" />
                <span>{selectedIncident.location}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 text-[11px] block">Triage Classification:</span>
              <div className="flex items-center gap-2 mt-1">
                <SeverityBadge severity={selectedIncident.severity} />
                <IncidentStatusBadge status={selectedIncident.status} />
              </div>
              <span className="text-slate-400 text-[11px] block mt-1">
                Casualties: <strong className="text-amber-400">{selectedIncident.peopleAffected}</strong>
              </span>
            </div>

            <div>
              <span className="text-slate-400 text-[11px] block">Priority Index:</span>
              <div className="text-base font-black text-rose-400 font-mono mt-0.5">
                {selectedIncident.priorityScore} / 100
              </div>
              <span className="text-[10px] text-slate-400">
                Calculated via Severity, Casualties & Latency
              </span>
            </div>

            <div>
              <span className="text-slate-400 text-[11px] block">Currently Dispatched:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedIncident.assignedResourceIds.length === 0 ? (
                  <span className="text-slate-500 italic">No units dispatched yet</span>
                ) : (
                  selectedIncident.assignedResourceIds.map(id => (
                    <span key={id} className="rounded bg-blue-500/20 px-1.5 py-0.5 font-mono text-[10px] text-blue-300 border border-blue-500/30">
                      {id}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MCDM Recommended Tactical Fleet Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">
              Multi-Attribute Ranked Fleet Recommendations
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Selected: <strong className="text-rose-400">{selectedResourceIds.length}</strong> units
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resourceRecommendations.map(rec => {
            const isSelected = selectedResourceIds.includes(rec.resource.id);
            const isAssignedToThis = selectedIncident?.assignedResourceIds.includes(rec.resource.id);

            return (
              <div
                key={rec.resource.id}
                onClick={() => {
                  if (currentRole !== 'Viewer' && !isAssignedToThis) {
                    handleToggleResource(rec.resource.id);
                  }
                }}
                className={`cursor-pointer rounded-2xl border p-4 transition-all shadow-lg space-y-3 ${
                  isSelected
                    ? 'border-rose-500 bg-rose-950/20 ring-2 ring-rose-500/40'
                    : isAssignedToThis
                    ? 'border-blue-500/50 bg-blue-950/20 opacity-80 cursor-default'
                    : 'border-slate-800 bg-slate-900/70 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
              >
                {/* Top Row */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-400">{rec.resource.id}</span>
                      <ResourceStatusBadge status={rec.resource.status} />
                    </div>
                    <h3 className="text-sm font-bold text-white mt-1">{rec.resource.name}</h3>
                  </div>

                  {/* Match Score Badge */}
                  <div className="text-right">
                    <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-center">
                      <div className="text-xs font-black text-blue-400 font-mono">
                        {rec.suitabilityScore ?? rec.matchScore ?? 0}
                        <span className="text-[9px] font-normal text-slate-400">/100</span>
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Match Score</span>
                    </div>
                  </div>
                </div>

                {/* Algorithmic Scoring Sub-factors */}
                <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-950/60 p-2.5 text-center text-[10px] border border-slate-800/80">
                  <div>
                    <span className="text-slate-500 block">Distance</span>
                    <span className="font-bold text-slate-200 font-mono">
                      {typeof rec.distanceKm === 'number' ? rec.distanceKm.toFixed(1) : rec.distanceKm} km
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Est. ETA</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      {rec.estimatedTimeMinutes ?? rec.estimatedEtaMinutes ?? 0} min
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Readiness</span>
                    <span className="font-bold text-blue-400 font-mono">
                      {rec.factors?.readinessScore ?? (rec.breakdown?.statusFactor ? Math.round(rec.breakdown.statusFactor * 100) : 100)}%
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-400 space-y-1">
                  <div>Type: <strong className="text-slate-300">{rec.resource.type}</strong></div>
                  <div className="line-clamp-1">Specialty: {rec.resource.specialization}</div>
                  <div>Base: {rec.resource.baseStation}</div>
                </div>

                {/* Bottom Selection Checkbox */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  {isAssignedToThis ? (
                    <span className="text-blue-400 font-bold text-[11px]">✓ Already Dispatched</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-rose-600 focus:ring-rose-500"
                      />
                      <span className={isSelected ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                        {isSelected ? 'Ready for Dispatch' : 'Click to Select Unit'}
                      </span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      if (selectedIncident) {
                        calculateRouteBetweenCoords(
                          [rec.resource.latitude, rec.resource.longitude],
                          [selectedIncident.latitude, selectedIncident.longitude],
                          rec.resource.speedKmh
                        );
                        navigate('/routes');
                      }
                    }}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    Simulate Route →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hospital Destination Matching Grid */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">
              Nearest Optimal Hospital Destination Selection
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Ranked by Bed Headroom, Trauma Level & Proximity
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hospitalRecommendations.map(hRec => {
            const isSelected = selectedHospitalId === hRec.hospital.id;

            return (
              <div
                key={hRec.hospital.id}
                onClick={() => setSelectedHospitalId(hRec.hospital.id)}
                className={`cursor-pointer rounded-2xl border p-4 transition-all shadow-lg space-y-3 ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-950/20 ring-2 ring-emerald-500/40'
                    : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">
                      Level {hRec.hospital.traumaLevel} Trauma
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1.5">{hRec.hospital.name}</h3>
                  </div>

                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-center">
                    <div className="text-xs font-black text-emerald-400 font-mono">
                      {hRec.suitabilityScore}
                      <span className="text-[9px] font-normal text-slate-400">/100</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Suitability</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-950/60 p-2 text-center text-[10px] border border-slate-800">
                  <div>
                    <span className="text-slate-500 block">Distance</span>
                    <span className="font-bold text-slate-200">{hRec.distanceKm} km</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Free Beds</span>
                    <span className="font-bold text-emerald-400">{hRec.hospital.availableBeds}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Free ICU</span>
                    <span className="font-bold text-blue-400">{hRec.hospital.availableIcuBeds}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <span className="text-[11px] text-slate-400">
                    Status: <strong className="text-white">{hRec.hospital.status}</strong>
                  </span>
                  <span className={isSelected ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                    {isSelected ? '✓ Selected Destination' : 'Click to Set'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Dispatch Action Bar */}
      {currentRole !== 'Viewer' && (
        <div className="sticky bottom-4 z-20 rounded-2xl border border-rose-500/40 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600 text-white shadow-lg shadow-rose-950">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Execute Multi-Unit Tactical Dispatch
                </h4>
                <p className="text-xs text-slate-400">
                  Deploy {selectedResourceIds.length} selected tactical units to {selectedIncident?.title || 'incident'}.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                disabled={selectedResourceIds.length === 0}
                onClick={handleExecuteDispatch}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-rose-950 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Zap className="h-4 w-4" />
                Dispatch {selectedResourceIds.length} Units Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
