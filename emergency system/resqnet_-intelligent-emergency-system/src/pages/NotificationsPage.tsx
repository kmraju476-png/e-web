import React, { useState } from 'react';
import { useEmergency } from '../context/EmergencyContext';
import {
  Bell,
  CheckCircle2,
  Trash2,
  Filter,
  AlertTriangle,
  Info,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,
  } = useEmergency();

  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filteredNotifications = notifications.filter(notif => {
    if (filterSeverity === 'ALL') return true;
    if (filterSeverity === 'UNREAD') return !notif.isRead;
    return notif.severity === filterSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Tactical Dispatch Notifications
            </h1>
            <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-mono font-bold text-slate-300">
              {notifications.length} Alerts
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time feed of emergency calls, allocation authorizations, unit dispatches, and road blockage broadcasts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={markAllNotificationsAsRead}
            className="rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            Mark All Read
          </button>
          <button
            type="button"
            onClick={clearAllNotifications}
            className="rounded-xl border border-rose-500/30 bg-rose-950/20 px-3.5 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-900/40 transition-colors"
          >
            Clear Log
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 p-3">
        <span className="text-xs font-semibold text-slate-400">Filter Feed:</span>
        <div className="flex flex-wrap gap-1.5">
          {['ALL', 'UNREAD', 'CRITICAL', 'HIGH', 'MEDIUM', 'INFO'].map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setFilterSeverity(s)}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors ${
                filterSeverity === s
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400 text-xs">
            No notifications in this filter category.
          </div>
        ) : (
          filteredNotifications.map((notif, idx) => {
            const isCritical = notif.severity === 'CRITICAL';
            const isHigh = notif.severity === 'HIGH';

            return (
              <div
                key={`${notif.id}-${idx}`}
                onClick={() => {
                  markNotificationAsRead(notif.id);
                  if (notif.relatedIncidentId) navigate('/incidents');
                }}
                className={`cursor-pointer rounded-2xl border p-4 transition-all shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  !notif.isRead
                    ? isCritical
                      ? 'border-rose-500/60 bg-rose-950/20'
                      : isHigh
                      ? 'border-amber-500/60 bg-amber-950/20'
                      : 'border-blue-500/60 bg-blue-950/20'
                    : 'border-slate-800 bg-slate-900/60 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 rounded-xl p-2.5 ${
                      isCritical
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : isHigh
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {isCritical ? <AlertTriangle className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{notif.title}</span>
                      {!notif.isRead && (
                        <span className="rounded-full bg-rose-500 px-1.5 py-0.2 text-[9px] font-bold text-white uppercase">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{notif.message}</p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-2 font-mono">
                      <span>{new Date(notif.timestamp).toLocaleString()}</span>
                      {notif.relatedIncidentId && (
                        <span className="text-rose-400 font-bold">
                          Related ID: {notif.relatedIncidentId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {notif.relatedIncidentId && (
                    <span className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold">
                      View Incident <ExternalLink className="h-3 w-3" />
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
