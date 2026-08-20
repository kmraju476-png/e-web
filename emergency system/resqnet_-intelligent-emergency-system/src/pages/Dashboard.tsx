import React, { useState } from 'react';
import { useEmergency } from '../context/EmergencyContext';
import { StatCard } from '../components/common/StatCard';
import { LiveEmergencyMap } from '../components/map/LiveEmergencyMap';
import { SeverityBadge, IncidentStatusBadge } from '../components/common/Badge';
import { PriorityExplainerModal } from '../components/common/PriorityExplainerModal';
import { useNavigate, Link } from 'react-router-dom';
import { Incident } from '../types';
import {
  AlertOctagon,
  AlertTriangle,
  Truck,
  Users,
  Building2,
  CheckCircle2,
  Zap,
  ArrowRight,
  Shield,
  Activity,
  Route,
  Sparkles,
  ExternalLink,
  Flame,
  Droplets,
  Car,
  HeartPulse,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    incidents,
    resources,
    hospitals,
    stats,
    setActiveSelectedIncident,
    triggerSimulationScenario,
    simulateRoadIncident,
    auditLogs,
  } = useEmergency();

  const [selectedIncidentForExplainer, setSelectedIncidentForExplainer] = useState<Incident | null>(null);

  // Sorted active incidents by priority score descending
  const prioritizedIncidents = [...incidents]
    .filter(i => i.status !== 'RESOLVED')
    .sort((a, b) => b.priorityScore - a.priorityScore);

  const getIncidentIcon = (type: Incident['incidentType']) => {
    switch (type) {
      case 'Fire':
        return <Flame className="h-4 w-4 text-orange-400" />;
      case 'Flood':
        return <Droplets className="h-4 w-4 text-blue-400" />;
      case 'Road Accident':
        return <Car className="h-4 w-4 text-amber-400" />;
      case 'Medical Emergency':
        return <HeartPulse className="h-4 w-4 text-rose-400" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Tactical Operations Dashboard
            </h1>
            <span className="rounded-md bg-rose-500/20 px-2 py-0.5 text-xs font-bold text-rose-400 border border-rose-500/30">
              LIVE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time multi-criteria incident triage, Haversine proximity matrix, and shortest-path fleet dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/allocation"
            className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-950/50 hover:bg-rose-500 transition-colors"
          >
            <Zap className="h-4 w-4" />
            Decision Engine
          </Link>
          <Link
            to="/routes"
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
          >
            <Route className="h-4 w-4" />
            Dijkstra Routes
          </Link>
        </div>
      </div>

      {/* 7 Required Dashboard KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
        <StatCard
          title="Active Incidents"
          value={stats.activeIncidents}
          icon={AlertOctagon}
          colorScheme="amber"
          subText="In operational queue"
          onClick={() => navigate('/incidents')}
        />
        <StatCard
          title="Critical Incidents"
          value={stats.criticalIncidents}
          icon={AlertTriangle}
          colorScheme="rose"
          subText="Urgent triage tier"
          onClick={() => navigate('/incidents')}
        />
        <StatCard
          title="Available Ambulances"
          value={stats.availableAmbulances}
          icon={Truck}
          colorScheme="blue"
          subText="Ready for dispatch"
          onClick={() => navigate('/resources')}
        />
        <StatCard
          title="Active Rescue Teams"
          value={stats.activeRescueTeams}
          icon={Users}
          colorScheme="purple"
          subText="Dispatched / On-scene"
          onClick={() => navigate('/resources')}
        />
        <StatCard
          title="Hospital Beds"
          value={stats.availableHospitalBeds}
          icon={Building2}
          colorScheme="emerald"
          subText="Across 5 facilities"
          onClick={() => navigate('/hospitals')}
        />
        <StatCard
          title="Assigned Resources"
          value={stats.assignedResources}
          icon={Shield}
          colorScheme="purple"
          subText="En-route / Engaged"
          onClick={() => navigate('/resources')}
        />
        <StatCard
          title="Resolved Incidents"
          value={stats.resolvedIncidents}
          icon={CheckCircle2}
          colorScheme="emerald"
          subText="Stabilized & logged"
          onClick={() => navigate('/incidents')}
        />
      </div>

      {/* Main Grid: Priority Incident Queue & Live Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Top Prioritized Incidents */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-rose-400" />
              <h2 className="text-base font-bold text-white">Prioritized Emergency Queue</h2>
            </div>
            <Link
              to="/incidents"
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              View All ({incidents.length}) <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {prioritizedIncidents.slice(0, 4).map(incident => (
              <div
                key={incident.id}
                className="group relative rounded-xl border border-slate-800 bg-slate-900/70 p-4 transition-all hover:border-slate-700 hover:bg-slate-900/90 shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 border border-slate-700">
                      {getIncidentIcon(incident.incidentType)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400">{incident.id}</span>
                        <SeverityBadge severity={incident.severity} />
                        <IncidentStatusBadge status={incident.status} />
                      </div>
                      <h3 className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors mt-0.5">
                        {incident.title}
                      </h3>
                    </div>
                  </div>

                  {/* Priority Badge */}
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-xs font-bold text-rose-400 font-mono">
                        Priority: {incident.priorityScore}/100
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {incident.peopleAffected} casualties • {incident.incidentType}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                  {incident.description}
                </p>

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">
                    📍 {incident.location}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedIncidentForExplainer(incident)}
                      className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      Why Score {incident.priorityScore}?
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSelectedIncident(incident);
                        navigate('/allocation');
                      }}
                      className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1 text-[11px] font-bold text-white shadow-sm hover:bg-rose-500 transition-colors"
                    >
                      <Zap className="h-3 w-3" />
                      Allocate
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Simulation Trigger Bar */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-amber-500/20 p-2 text-amber-400 border border-amber-500/30">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Emergency Simulation Harness
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Inject sudden mass casualties or road obstructions to test dynamic rerouting.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => triggerSimulationScenario('MASS_CASUALTY')}
                  className="flex-1 sm:flex-initial rounded-lg bg-amber-500/20 border border-amber-500/40 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/30 transition-colors"
                >
                  Mass Casualty
                </button>
                <button
                  type="button"
                  onClick={simulateRoadIncident}
                  className="flex-1 sm:flex-initial rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  Block Road
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Map Snapshot & Fleet Status */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Route className="h-5 w-5 text-blue-400" />
              <h2 className="text-base font-bold text-white">Geographic Dispatch Grid</h2>
            </div>
            <Link
              to="/map"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              Fullscreen Map <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Mini Interactive Map */}
          <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
            <LiveEmergencyMap height="360px" showHUD={false} />
          </div>

          {/* Fleet Status Breakdown */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Fleet Operational Readiness</span>
              <span className="text-emerald-400 font-mono">
                {resources.filter(r => r.status === 'AVAILABLE').length}/{resources.length} Standby
              </span>
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-slate-950/60 border border-slate-800 p-2.5">
                <span className="text-slate-400 text-[11px]">Ambulance Fleet</span>
                <div className="text-sm font-bold text-white mt-1">
                  {resources.filter(r => r.type === 'Ambulance' && r.status === 'AVAILABLE').length} Available{' '}
                  <span className="text-slate-400 font-normal text-xs">
                    / {resources.filter(r => r.type === 'Ambulance').length}
                  </span>
                </div>
              </div>

              <div className="rounded-lg bg-slate-950/60 border border-slate-800 p-2.5">
                <span className="text-slate-400 text-[11px]">Rescue Squads</span>
                <div className="text-sm font-bold text-white mt-1">
                  {resources.filter(r => r.type === 'Rescue Team' && r.status === 'AVAILABLE').length} Available{' '}
                  <span className="text-slate-400 font-normal text-xs">
                    / {resources.filter(r => r.type === 'Rescue Team').length}
                  </span>
                </div>
              </div>

              <div className="rounded-lg bg-slate-950/60 border border-slate-800 p-2.5">
                <span className="text-slate-400 text-[11px]">Fire Suppression</span>
                <div className="text-sm font-bold text-white mt-1">
                  {resources.filter(r => r.type === 'Fire Response Unit' && r.status === 'AVAILABLE').length} Available{' '}
                  <span className="text-slate-400 font-normal text-xs">
                    / {resources.filter(r => r.type === 'Fire Response Unit').length}
                  </span>
                </div>
              </div>

              <div className="rounded-lg bg-slate-950/60 border border-slate-800 p-2.5">
                <span className="text-slate-400 text-[11px]">Medical DMAT</span>
                <div className="text-sm font-bold text-white mt-1">
                  {resources.filter(r => r.type === 'Medical Team' && r.status === 'AVAILABLE').length} Available{' '}
                  <span className="text-slate-400 font-normal text-xs">
                    / {resources.filter(r => r.type === 'Medical Team').length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Audit Action Feed */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Latest Audit Events
              </span>
              <Link to="/audit" className="text-[11px] text-slate-400 hover:text-white">
                View all →
              </Link>
            </div>
            <div className="space-y-2">
              {auditLogs.slice(0, 3).map((log, idx) => (
                <div key={`${log.id}-${idx}`} className="text-xs border-b border-slate-800/60 pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] mb-0.5">
                    <span className="font-mono">{log.action}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] line-clamp-1">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Explainer Modal */}
      <PriorityExplainerModal
        isOpen={Boolean(selectedIncidentForExplainer)}
        incident={selectedIncidentForExplainer}
        onClose={() => setSelectedIncidentForExplainer(null)}
      />
    </div>
  );
};
