import React, { useState } from 'react';
import { useEmergency } from '../context/EmergencyContext';
import {
  Sparkles,
  AlertTriangle,
  Flame,
  Droplets,
  Activity,
  RotateCcw,
  Play,
  Pause,
  Zap,
  Building2,
  Shield,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const SimulationPage: React.FC = () => {
  const {
    triggerSimulationScenario,
    simulateRoadIncident,
    resetToInitialDemoData,
    auditLogs,
    incidents,
    resources,
    hospitals,
    edges,
    currentRole,
  } = useEmergency();

  const [activeScenarioName, setActiveScenarioName] = useState<string | null>(null);

  const handleRunScenario = (scenario: any, name: string) => {
    setActiveScenarioName(name);
    triggerSimulationScenario(scenario);
  };

  const scenarios = [
    {
      id: 'MASS_CASUALTY',
      title: 'Commercial Complex Fire & Structural Hazard',
      desc: 'Simulates a sudden 4-alarm commercial inferno with 24 trapped casualties, severe smoke inhalation, and hazardous structural destabilization.',
      impact: 'Spawns Priority 95+ Incident, demands multiple ALS Ambulances, Fire Engines, and DMAT squads.',
      icon: Flame,
      color: 'border-rose-500/40 bg-rose-950/20 text-rose-400',
    },
    {
      id: 'FLASH_FLOOD',
      title: 'Monsoon Flash Flood & Low-Lying Inundation',
      desc: 'Simulates torrential rain causing rapid urban drainage failure, submerging arterial bridges and stranding 14 citizens in sub-districts.',
      impact: 'Spawns Priority 88 Water Rescue call, requires inflatable boats and specialized rescue units.',
      icon: Droplets,
      color: 'border-blue-500/40 bg-blue-950/20 text-blue-400',
    },
    {
      id: 'ROAD_GRIDLOCK',
      title: 'Simultaneous Multi-Point Road Blockages',
      desc: 'Triggers construction collapse and fallen powerlines blocking high-traffic urban arteries to force Dijkstra engine into real-time detour calculations.',
      impact: 'Blocks 2 key corridors, testing dynamic recalculation and ETA inflation metrics.',
      icon: Activity,
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-400',
    },
    {
      id: 'HOSPITAL_SURGE',
      title: 'Trauma Network Surge & ICU Saturation',
      desc: 'Simulates catastrophic influx across regional hospitals, drastically diminishing available general beds and driving ICU capacity to 95%.',
      impact: 'Forces hospital recommendation algorithms to divert casualties to Level 2/3 peripheral centers.',
      icon: Building2,
      color: 'border-purple-500/40 bg-purple-950/20 text-purple-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Emergency Simulation Laboratory
            </h1>
            <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-300 border border-amber-500/30">
              Academic Test Harness
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Deterministic and stochastic emergency scenario injectors designed to stress-test MCDM optimization, queuing, and Dijkstra path finding.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (window.confirm('Reset ResQNet simulation to default benchmark state?')) {
              resetToInitialDemoData();
              setActiveScenarioName(null);
            }
          }}
          className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="h-4 w-4" />
          Reset Baseline Dataset
        </button>
      </div>

      {/* Scenario Execution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {scenarios.map(sc => {
          const Icon = sc.icon;
          return (
            <div
              key={sc.id}
              className={`rounded-2xl border p-5 transition-all shadow-xl space-y-4 ${sc.color}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-slate-900/80 p-2.5 border border-slate-800 shadow">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{sc.title}</h3>
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                      Preset Scenario
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{sc.desc}</p>

              <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-3 text-xs">
                <span className="text-slate-400 font-bold block mb-1">System Impact:</span>
                <span className="text-slate-300">{sc.impact}</span>
              </div>

              <button
                type="button"
                onClick={() => handleRunScenario(sc.id, sc.title)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 border border-slate-700 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow"
              >
                <Zap className="h-4 w-4 text-amber-400" />
                Inject Scenario Into Active Simulation
              </button>
            </div>
          );
        })}
      </div>

      {/* Single Dynamic Injections Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Atomic Stochastic Injections
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => triggerSimulationScenario('RANDOM_NEW_CALL')}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <span>+ Spawn Stochastic Incident</span>
          </button>
          <button
            type="button"
            onClick={simulateRoadIncident}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <span>⚠️ Random Road Segment Obstruction</span>
          </button>
          <Link
            to="/allocation"
            className="flex items-center justify-center gap-2 rounded-xl bg-rose-600 p-3 text-xs font-bold text-white hover:bg-rose-500 transition-colors"
          >
            <span>Evaluate in Decision Engine →</span>
          </Link>
        </div>
      </div>

      {/* Real-time Simulation Event Stream */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Active Simulation Audit & Event Stream
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            {auditLogs.length} Logged Transactions
          </span>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {auditLogs.slice(0, 10).map((log, idx) => (
            <div
              key={`${log.id}-${idx}`}
              className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-slate-500">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-300">
                  {log.action}
                </span>
                <span className="text-slate-300">{log.details}</span>
              </div>
              <span className="text-[10px] text-slate-500">{log.userRole}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
