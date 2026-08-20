import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  AlertOctagon,
  MapPin,
  Truck,
  Building2,
  GitMerge,
  Route,
  Activity,
  BarChart3,
  Bell,
  ShieldCheck,
  BookOpen,
  Settings,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onCloseMobile }) => {
  const { incidents, resources, hospitals, notifications, activeRoute } = useEmergency();

  const activeIncidentsCount = incidents.filter(i => i.status !== 'RESOLVED').length;
  const criticalCount = incidents.filter(i => i.status !== 'RESOLVED' && i.severity === 'CRITICAL').length;
  const unreadNotifs = notifications.filter(n => !n.isRead).length;

  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/incidents',
      label: 'Incidents',
      icon: AlertOctagon,
      badge: activeIncidentsCount > 0 ? `${activeIncidentsCount}` : null,
      badgeVariant: criticalCount > 0 ? 'critical' : 'warning',
    },
    {
      to: '/map',
      label: 'Live Map',
      icon: MapPin,
      badge: activeRoute ? 'Active Route' : null,
      badgeVariant: 'info',
    },
    {
      to: '/resources',
      label: 'Resources',
      icon: Truck,
      badge: `${resources.filter(r => r.status === 'AVAILABLE').length}/${resources.length}`,
      badgeVariant: 'success',
    },
    {
      to: '/hospitals',
      label: 'Hospitals',
      icon: Building2,
      badge: `${hospitals.reduce((acc, h) => acc + h.availableBeds, 0)} beds`,
      badgeVariant: 'default',
    },
    {
      to: '/allocation',
      label: 'Allocation',
      icon: GitMerge,
      badge: 'Decision Support',
      badgeVariant: 'purple',
    },
    {
      to: '/routes',
      label: 'Routes & Dijkstra',
      icon: Route,
      badge: 'Graph Engine',
      badgeVariant: 'info',
    },
    {
      to: '/simulation',
      label: 'Simulation',
      icon: Activity,
      badge: 'Lab',
      badgeVariant: 'warning',
    },
    {
      to: '/analytics',
      label: 'Analytics',
      icon: BarChart3,
      badge: null,
    },
    {
      to: '/notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotifs > 0 ? `${unreadNotifs}` : null,
      badgeVariant: 'critical',
    },
    {
      to: '/audit-logs',
      label: 'Audit Logs',
      icon: ShieldCheck,
      badge: null,
    },
    {
      to: '/how-it-works',
      label: 'How ResQNet Works',
      icon: BookOpen,
      badge: 'Academic Theory',
      badgeVariant: 'purple',
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="resqnet-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 flex w-64 flex-col border-r border-slate-800/80 bg-slate-900/95 backdrop-blur-md transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800/80 px-4">
          <NavLink to="/" className="flex items-center gap-3 group" onClick={onCloseMobile}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 shadow-md shadow-rose-950/40 text-white">
              <Zap className="h-5 w-5 fill-white text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-white group-hover:text-rose-400 transition-colors">
                  ResQNet
                </span>
                <span className="rounded bg-rose-500/20 px-1 py-0.2 text-[9px] font-bold uppercase tracking-wider text-rose-400 border border-rose-500/30">
                  v2.4
                </span>
              </div>
              <p className="text-[10px] font-medium tracking-wide text-slate-400">
                Decision Support Core
              </p>
            </div>
          </NavLink>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Emergency Command
          </div>

          {navItems.slice(0, 7).map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30 shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    item.badgeVariant === 'critical'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                      : item.badgeVariant === 'purple'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : item.badgeVariant === 'info'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : item.badgeVariant === 'success'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}

          <div className="pt-4 pb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Simulation & Intel
          </div>

          {navItems.slice(7).map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30 shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    item.badgeVariant === 'critical'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : item.badgeVariant === 'purple'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : item.badgeVariant === 'warning'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Academic Project Footer */}
        <div className="border-t border-slate-800/80 p-3.5 bg-slate-950/40">
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                TYBSc Comp Science
              </span>
              <span className="text-[9px] font-mono text-emerald-400">SIM-ACTIVE</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Academic Decision-Support & Graph Optimization Testbed
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
