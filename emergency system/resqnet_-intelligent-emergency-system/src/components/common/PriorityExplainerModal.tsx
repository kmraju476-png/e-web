import React from 'react';
import { Incident } from '../../types';
import { Modal } from './Modal';
import { SeverityBadge, IncidentStatusBadge } from './Badge';
import { Activity, AlertTriangle, Clock, HelpCircle, ShieldCheck, Users, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmergency } from '../../context/EmergencyContext';

interface PriorityExplainerModalProps {
  incident: Incident | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PriorityExplainerModal: React.FC<PriorityExplainerModalProps> = ({
  incident,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const { setActiveSelectedIncident } = useEmergency();

  if (!incident) return null;

  const { priorityBreakdown, priorityScore } = incident;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-rose-400 border-rose-500/40 bg-rose-950/30';
    if (score >= 60) return 'text-amber-400 border-amber-500/40 bg-amber-950/30';
    if (score >= 40) return 'text-yellow-400 border-yellow-500/40 bg-yellow-950/30';
    return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30';
  };

  const handleDispatch = () => {
    setActiveSelectedIncident(incident);
    onClose();
    navigate('/allocation');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Priority Evaluation Trace: ${incident.id}`}
      subtitle={`${incident.title} — ${incident.location}`}
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Top Summary Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border text-2xl font-black ${getScoreColor(priorityScore)}`}>
              {priorityScore}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-300">Algorithmic Priority Score</span>
                <span className="text-xs text-slate-400 font-mono">(/100)</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Calculated via ResQNet Multi-Criteria Triage Weight Matrix
              </p>
              <div className="flex items-center gap-2 mt-2">
                <SeverityBadge severity={incident.severity} />
                <IncidentStatusBadge status={incident.status} />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDispatch}
            className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-rose-950 hover:bg-rose-500 transition-colors"
          >
            <Zap className="h-4 w-4" />
            Launch Resource Allocation
          </button>
        </div>

        {/* Reasons Section */}
        <div>
          <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            Decision Engine Rationale (Why this incident received {priorityScore}/100)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {priorityBreakdown.reasons.map((reason, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 rounded-lg border border-slate-800 bg-slate-950/40 p-3 text-xs text-slate-300"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-slate-400">
                  {idx + 1}
                </span>
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Factors Breakdown */}
        <div>
          <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
            <Activity className="h-4 w-4 text-blue-400" />
            Multi-Attribute Quantitative Factor Contributions
          </h4>
          <div className="space-y-3">
            {priorityBreakdown.factors.map((factor, idx) => {
              const percentage = Math.min(100, Math.round((factor.contribution / (factor.weight * 100)) * 100));
              return (
                <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/30 p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{factor.name}</span>
                    <span className="font-mono font-bold text-slate-300">
                      +{factor.contribution} pts{' '}
                      <span className="text-slate-400 text-[11px] font-normal">
                        (Weight: {(factor.weight * 100).toFixed(0)}%)
                      </span>
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">{factor.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Academic Formula Trace */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
              Evaluation Linear Equation
            </span>
            <span className="text-[11px] font-mono text-emerald-400">Validated</span>
          </div>
          <p className="font-mono text-xs text-slate-300 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 overflow-x-auto">
            {priorityBreakdown.formula}
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Theoretical foundation: Priority function aligns with standard Multi-Criteria Decision Analysis (MCDA) where triage weights adapt to hazard kinetics and casualty volume.
          </p>
        </div>
      </div>
    </Modal>
  );
};
