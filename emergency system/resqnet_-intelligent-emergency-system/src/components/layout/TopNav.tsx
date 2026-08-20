import React, { useState, useEffect } from 'react';
import {
  Menu,
  Bell,
  Clock,
  Shield,
  Activity,
  PlusCircle,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { UserRole } from '../../types';
import { Link, useNavigate } from 'react-router-dom';

interface TopNavProps {
  onToggleSidebar: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onToggleSidebar }) => {
  const {
    currentRole,
    setCurrentRole,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,
    triggerSimulationScenario,
    simulateRoadIncident,
    resetToInitialDemoData,
    stats,
  } = useEmergency();

  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showSimMenu, setShowSimMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const roles: { role: UserRole; desc: string; badgeColor: string }[] = [
    {
      role: 'Admin / Coordinator',
      desc: 'Full dispatch authority, resource allocation, and graph topology control',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    },
    {
      role: 'Resource Operator',
      desc: 'Unit status updates, ETA monitoring, and field triage logging',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    },
    {
      role: 'Viewer',
      desc: 'Read-only situational awareness & academic algorithm inspection',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    },
  ];

  return (
    <header
      id="resqnet-top-nav"
      className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-900/90 px-4 sm:px-6 backdrop-blur-md"
    >
      {/* Left: Mobile Toggle & System Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Emergency Dispatch Operations Center
          </span>
          <span className="text-slate-400 text-xs">•</span>
          <span className="text-xs font-mono text-slate-400">
            Active Priority Queue: <strong className="text-rose-400">{stats.activeIncidents} Incidents</strong>
          </span>
        </div>
      </div>

      {/* Right: Actions, Simulation Trigger, Role Selector, Clock, Notifications */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live Simulation Clock */}
        <div className="hidden md:flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950/60 px-2.5 py-1.5 text-xs text-slate-300 font-mono">
          <Clock className="h-3.5 w-3.5 text-blue-400" />
          <span>{time.toLocaleTimeString()}</span>
        </div>

        {/* Quick Simulation Trigger Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowSimMenu(!showSimMenu);
              setShowRoleMenu(false);
              setShowNotifMenu(false);
            }}
            className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Simulate Event</span>
          </button>

          {showSimMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Simulation Injections
              </div>
              <button
                type="button"
                onClick={() => {
                  triggerSimulationScenario('RANDOM_NEW_CALL');
                  setShowSimMenu(false);
                }}
                className="w-full text-left rounded-lg px-2.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2"
              >
                <PlusCircle className="h-3.5 w-3.5 text-emerald-400" />
                Spawn Random Incident
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerSimulationScenario('MASS_CASUALTY');
                  setShowSimMenu(false);
                }}
                className="w-full text-left rounded-lg px-2.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2"
              >
                <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                Mass Casualty Surge (24 Cas.)
              </button>
              <button
                type="button"
                onClick={() => {
                  simulateRoadIncident();
                  setShowSimMenu(false);
                }}
                className="w-full text-left rounded-lg px-2.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2"
              >
                <Activity className="h-3.5 w-3.5 text-amber-400" />
                Block Random Road Segment
              </button>
              <div className="border-t border-slate-800 my-1 pt-1">
                <Link
                  to="/simulation"
                  onClick={() => setShowSimMenu(false)}
                  className="w-full text-center block rounded-lg px-2 py-1.5 text-[11px] font-semibold text-rose-400 hover:bg-rose-500/10"
                >
                  Open Full Simulation Lab →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Role Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowRoleMenu(!showRoleMenu);
              setShowSimMenu(false);
              setShowNotifMenu(false);
            }}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white hover:border-slate-600 transition-colors"
          >
            <Shield className="h-3.5 w-3.5 text-rose-400" />
            <span className="hidden md:inline font-medium text-slate-400">Role:</span>
            <span>{currentRole}</span>
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Select Operational Role
              </div>
              <div className="space-y-1 mt-1">
                {roles.map(r => (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => {
                      setCurrentRole(r.role);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left rounded-lg p-2.5 transition-colors ${
                      currentRole === r.role
                        ? 'bg-rose-500/15 border border-rose-500/30 text-white'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>{r.role}</span>
                      {currentRole === r.role && <CheckCircle2 className="h-3.5 w-3.5 text-rose-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifMenu(!showNotifMenu);
              setShowRoleMenu(false);
              setShowSimMenu(false);
            }}
            className="relative rounded-lg border border-slate-800 bg-slate-950/60 p-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-md shadow-rose-950 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-700 bg-slate-900 p-3 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Live Dispatch Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={markAllNotificationsAsRead}
                    className="text-[10px] text-slate-400 hover:text-white"
                  >
                    Mark read
                  </button>
                  <button
                    type="button"
                    onClick={clearAllNotifications}
                    className="text-[10px] text-rose-400 hover:text-rose-300"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No active notifications. System nominal.
                  </div>
                ) : (
                  notifications.slice(0, 8).map((notif, idx) => (
                    <div
                      key={`${notif.id}-${idx}`}
                      onClick={() => {
                        markNotificationAsRead(notif.id);
                        if (notif.relatedIncidentId) {
                          navigate('/incidents');
                        }
                      }}
                      className={`rounded-lg border p-2.5 text-xs transition-colors cursor-pointer ${
                        notif.isRead
                          ? 'border-slate-800/60 bg-slate-950/30 text-slate-400'
                          : notif.severity === 'CRITICAL'
                          ? 'border-rose-500/40 bg-rose-950/30 text-rose-200'
                          : notif.severity === 'HIGH'
                          ? 'border-amber-500/40 bg-amber-950/30 text-amber-200'
                          : 'border-blue-500/40 bg-blue-950/30 text-blue-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold">{notif.title}</span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] leading-snug">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-slate-800 mt-2 pt-2 text-center">
                <Link
                  to="/notifications"
                  onClick={() => setShowNotifMenu(false)}
                  className="text-xs font-semibold text-rose-400 hover:underline"
                >
                  View All Notifications ({notifications.length}) →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Reset Demo Data Button */}
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Reset ResQNet database and graph state to initial academic demo dataset?')) {
              resetToInitialDemoData();
            }
          }}
          title="Reset Demo Scenario"
          className="rounded-lg border border-slate-800 bg-slate-950/60 p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};
