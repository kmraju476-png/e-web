import React, { useState, useMemo } from 'react';
import { useEmergency } from '../context/EmergencyContext';
import { Incident, IncidentStatus, IncidentType, ResourceType, SeverityLevel } from '../types';
import { SeverityBadge, IncidentStatusBadge } from '../components/common/Badge';
import { PriorityExplainerModal } from '../components/common/PriorityExplainerModal';
import { Modal } from '../components/common/Modal';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  SlidersHorizontal,
  Edit,
  Trash2,
  Zap,
  Info,
  ChevronRight,
  MapPin,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowUpDown,
} from 'lucide-react';

export const IncidentsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    incidents,
    createIncident,
    updateIncident,
    changeIncidentStatus,
    deleteIncident,
    setActiveSelectedIncident,
    currentRole,
  } = useEmergency();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'priority' | 'time' | 'people' | 'severity'>('priority');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null);
  const [viewingIncident, setViewingIncident] = useState<Incident | null>(null);
  const [explainingIncident, setExplainingIncident] = useState<Incident | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    incidentType: IncidentType;
    title: string;
    description: string;
    location: string;
    latitude: number;
    longitude: number;
    peopleAffected: number;
    severity: SeverityLevel;
    requiredAmbulances: number;
    requiredRescue: number;
    requiredFire: number;
    requiredMedical: number;
    status: IncidentStatus;
  }>({
    incidentType: 'Road Accident',
    title: '',
    description: '',
    location: '',
    latitude: 19.0760,
    longitude: 72.8777,
    peopleAffected: 2,
    severity: 'HIGH',
    requiredAmbulances: 1,
    requiredRescue: 1,
    requiredFire: 0,
    requiredMedical: 0,
    status: 'REPORTED',
  });

  const incidentTypes: IncidentType[] = [
    'Fire',
    'Flood',
    'Road Accident',
    'Building Collapse',
    'Medical Emergency',
    'Industrial Accident',
    'Natural Disaster',
    'Other',
  ];

  const severityLevels: SeverityLevel[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

  const statuses: IncidentStatus[] = [
    'REPORTED',
    'VERIFIED',
    'PRIORITIZED',
    'RESOURCE_ASSIGNED',
    'EN_ROUTE',
    'ON_SCENE',
    'RESOLVED',
  ];

  // Filter and Sort Logic
  const filteredIncidents = useMemo(() => {
    return incidents
      .filter(inc => {
        const matchesSearch =
          inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inc.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inc.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = filterType === 'ALL' || inc.incidentType === filterType;
        const matchesSeverity = filterSeverity === 'ALL' || inc.severity === filterSeverity;
        const matchesStatus = filterStatus === 'ALL' || inc.status === filterStatus;

        return matchesSearch && matchesType && matchesSeverity && matchesStatus;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === 'priority') {
          diff = b.priorityScore - a.priorityScore;
        } else if (sortBy === 'time') {
          diff = new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime();
        } else if (sortBy === 'people') {
          diff = b.peopleAffected - a.peopleAffected;
        } else if (sortBy === 'severity') {
          const rank = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
          diff = rank[b.severity] - rank[a.severity];
        }
        return sortOrder === 'desc' ? diff : -diff;
      });
  }, [incidents, searchTerm, filterType, filterSeverity, filterStatus, sortBy, sortOrder]);

  const handleOpenCreate = () => {
    setFormData({
      incidentType: 'Road Accident',
      title: '',
      description: '',
      location: '',
      latitude: Number((19.06 + Math.random() * 0.05).toFixed(4)),
      longitude: Number((72.84 + Math.random() * 0.06).toFixed(4)),
      peopleAffected: 2,
      severity: 'HIGH',
      requiredAmbulances: 1,
      requiredRescue: 1,
      requiredFire: 0,
      requiredMedical: 0,
      status: 'REPORTED',
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (inc: Incident) => {
    const amb = inc.requiredResources.find(r => r.type === 'Ambulance')?.quantity || 0;
    const res = inc.requiredResources.find(r => r.type === 'Rescue Team')?.quantity || 0;
    const fire = inc.requiredResources.find(r => r.type === 'Fire Response Unit')?.quantity || 0;
    const med = inc.requiredResources.find(r => r.type === 'Medical Team')?.quantity || 0;

    setFormData({
      incidentType: inc.incidentType,
      title: inc.title,
      description: inc.description,
      location: inc.location,
      latitude: inc.latitude,
      longitude: inc.longitude,
      peopleAffected: inc.peopleAffected,
      severity: inc.severity,
      requiredAmbulances: amb,
      requiredRescue: res,
      requiredFire: fire,
      requiredMedical: med,
      status: inc.status,
    });
    setEditingIncident(inc);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    const requiredResources: { type: ResourceType; quantity: number }[] = [];
    if (formData.requiredAmbulances > 0) requiredResources.push({ type: 'Ambulance', quantity: Number(formData.requiredAmbulances) });
    if (formData.requiredRescue > 0) requiredResources.push({ type: 'Rescue Team', quantity: Number(formData.requiredRescue) });
    if (formData.requiredFire > 0) requiredResources.push({ type: 'Fire Response Unit', quantity: Number(formData.requiredFire) });
    if (formData.requiredMedical > 0) requiredResources.push({ type: 'Medical Team', quantity: Number(formData.requiredMedical) });

    if (editingIncident) {
      updateIncident(editingIncident.id, {
        incidentType: formData.incidentType,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        peopleAffected: Number(formData.peopleAffected),
        severity: formData.severity,
        requiredResources,
        status: formData.status,
      });
      setEditingIncident(null);
    } else {
      createIncident({
        incidentType: formData.incidentType,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        peopleAffected: Number(formData.peopleAffected),
        severity: formData.severity,
        requiredResources,
        status: formData.status,
      });
      setIsCreateModalOpen(false);
    }
  };

  // Next status advancement in lifecycle
  const advanceLifecycle = (inc: Incident) => {
    const cycle: IncidentStatus[] = [
      'REPORTED',
      'VERIFIED',
      'PRIORITIZED',
      'RESOURCE_ASSIGNED',
      'EN_ROUTE',
      'ON_SCENE',
      'RESOLVED',
    ];
    const currentIndex = cycle.indexOf(inc.status);
    if (currentIndex < cycle.length - 1) {
      changeIncidentStatus(inc.id, cycle[currentIndex + 1]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Incident Management & Triage
            </h1>
            <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-mono font-bold text-slate-300">
              {incidents.length} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete incident register with transparent priority weighting, lifecycle transitions, and 1-click allocation.
          </p>
        </div>

        {currentRole !== 'Viewer' && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-950/50 hover:bg-rose-500 transition-colors self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            Report New Incident
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, keyword, location..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/80 pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-rose-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs font-medium text-slate-300 focus:border-rose-500 focus:outline-none"
          >
            <option value="ALL">All Types</option>
            {incidentTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* Severity Filter */}
          <select
            value={filterSeverity}
            onChange={e => setFilterSeverity(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs font-medium text-slate-300 focus:border-rose-500 focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            {severityLevels.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs font-medium text-slate-300 focus:border-rose-500 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            {statuses.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>

          {/* Sort Control */}
          <button
            type="button"
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            <span className="uppercase">{sortOrder}</span>
          </button>
        </div>
      </div>

      {/* Incidents Table / List */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3.5">Priority</th>
                <th className="px-4 py-3.5">Incident Info</th>
                <th className="px-4 py-3.5">Type & Severity</th>
                <th className="px-4 py-3.5">Casualties</th>
                <th className="px-4 py-3.5">Lifecycle Status</th>
                <th className="px-4 py-3.5">Assigned Units</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    No incidents match the search & filter criteria.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map(inc => (
                  <tr
                    key={inc.id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Priority Score Column */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setExplainingIncident(inc)}
                        className="flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs font-black text-rose-400 hover:bg-rose-500/20 transition-colors"
                        title="Click to view full priority mathematical breakdown"
                      >
                        <span>{inc.priorityScore}</span>
                        <span className="text-[10px] text-slate-400 font-normal">/100</span>
                        <Info className="h-3 w-3 text-rose-400" />
                      </button>
                    </td>

                    {/* Incident Info */}
                    <td className="px-4 py-4 max-w-xs">
                      <div className="font-mono text-[11px] font-bold text-slate-400">{inc.id}</div>
                      <div
                        onClick={() => setViewingIncident(inc)}
                        className="font-bold text-white group-hover:text-rose-400 transition-colors cursor-pointer text-sm"
                      >
                        {inc.title}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                        <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
                        <span className="truncate">{inc.location}</span>
                      </div>
                    </td>

                    {/* Type & Severity */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-200">{inc.incidentType}</div>
                      <div className="mt-1">
                        <SeverityBadge severity={inc.severity} />
                      </div>
                    </td>

                    {/* Casualties */}
                    <td className="px-4 py-4 whitespace-nowrap font-mono">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-white">
                        <Users className="h-3.5 w-3.5 text-amber-400" />
                        {inc.peopleAffected}
                      </div>
                      <span className="text-[10px] text-slate-400">Individuals</span>
                    </td>

                    {/* Lifecycle Status & Advancement */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <IncidentStatusBadge status={inc.status} />
                        {currentRole !== 'Viewer' && inc.status !== 'RESOLVED' && (
                          <button
                            type="button"
                            onClick={() => advanceLifecycle(inc)}
                            title="Advance to next lifecycle status"
                            className="rounded-md border border-slate-700 bg-slate-800 p-1 text-slate-300 hover:bg-slate-700 hover:text-white"
                          >
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Assigned Resources */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      {inc.assignedResourceIds.length === 0 ? (
                        <span className="text-[11px] text-slate-500 italic">None assigned</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {inc.assignedResourceIds.map(rId => (
                            <span
                              key={rId}
                              className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-mono font-bold text-blue-300 border border-blue-500/30"
                            >
                              {rId}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveSelectedIncident(inc);
                            navigate('/allocation');
                          }}
                          title="Allocate Resources"
                          className="flex items-center gap-1 rounded-lg bg-rose-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-rose-500 transition-colors shadow-sm"
                        >
                          <Zap className="h-3.5 w-3.5" />
                          Allocate
                        </button>

                        {currentRole !== 'Viewer' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(inc)}
                              title="Edit Incident"
                              className="rounded-lg border border-slate-700 bg-slate-800 p-1.5 text-slate-400 hover:bg-slate-700 hover:text-white"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete incident ${inc.id}?`)) {
                                  deleteIncident(inc.id);
                                }
                              }}
                              title="Delete Incident"
                              className="rounded-lg border border-slate-800 bg-slate-900 p-1.5 text-slate-500 hover:bg-rose-900/40 hover:text-rose-400"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incident Create / Edit Modal */}
      <Modal
        isOpen={isCreateModalOpen || Boolean(editingIncident)}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingIncident(null);
        }}
        title={editingIncident ? `Edit Incident: ${editingIncident.id}` : 'Report & Register Emergency Incident'}
        subtitle="Specify geographic coordinates, triage tier, and required tactical resource units."
        maxWidth="3xl"
      >
        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Incident Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Commercial Plaza Wall Collapse"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Incident Type *
              </label>
              <select
                value={formData.incidentType}
                onChange={e => setFormData({ ...formData, incidentType: e.target.value as IncidentType })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
              >
                {incidentTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Detailed Description *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe emergency conditions, trapped casualties, hazard escalation factors..."
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Location Address / Landmark *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Grand Central Plaza Concourse"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Latitude (GPS)
              </label>
              <input
                type="number"
                step="0.0001"
                required
                value={formData.latitude}
                onChange={e => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white font-mono focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Longitude (GPS)
              </label>
              <input
                type="number"
                step="0.0001"
                required
                value={formData.longitude}
                onChange={e => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white font-mono focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                People Affected / Casualties *
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.peopleAffected}
                onChange={e => setFormData({ ...formData, peopleAffected: parseInt(e.target.value) || 0 })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Triage Severity Level *
              </label>
              <select
                value={formData.severity}
                onChange={e => setFormData({ ...formData, severity: e.target.value as SeverityLevel })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
              >
                {severityLevels.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Lifecycle Status
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as IncidentStatus })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
              >
                {statuses.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Required Resources Grid */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Required Tactical Units
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Ambulances</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.requiredAmbulances}
                  onChange={e => setFormData({ ...formData, requiredAmbulances: parseInt(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Rescue Teams</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.requiredRescue}
                  onChange={e => setFormData({ ...formData, requiredRescue: parseInt(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Fire Response</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.requiredFire}
                  onChange={e => setFormData({ ...formData, requiredFire: parseInt(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Medical Teams</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.requiredMedical}
                  onChange={e => setFormData({ ...formData, requiredMedical: parseInt(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsCreateModalOpen(false);
                setEditingIncident(null);
              }}
              className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-rose-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-rose-950 hover:bg-rose-500 transition-colors"
            >
              {editingIncident ? 'Save Updates' : 'Publish & Calculate Priority'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Incident Details View Modal */}
      {viewingIncident && (
        <Modal
          isOpen={Boolean(viewingIncident)}
          onClose={() => setViewingIncident(null)}
          title={`Incident Overview: ${viewingIncident.id}`}
          subtitle={viewingIncident.title}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="flex items-center gap-2">
                <SeverityBadge severity={viewingIncident.severity} />
                <IncidentStatusBadge status={viewingIncident.status} />
              </div>
              <div className="text-right">
                <span className="text-rose-400 font-mono font-bold text-base">
                  Priority {viewingIncident.priorityScore}/100
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-semibold text-slate-300">Description:</span>
              <p className="text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 leading-relaxed">
                {viewingIncident.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-slate-300">
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[11px] block">Location:</span>
                <span className="font-medium text-white">{viewingIncident.location}</span>
                <span className="block font-mono text-[10px] text-slate-400 mt-1">
                  GPS: {viewingIncident.latitude.toFixed(4)}, {viewingIncident.longitude.toFixed(4)}
                </span>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[11px] block">Reported At:</span>
                <span className="font-medium text-white">{new Date(viewingIncident.createdTime).toLocaleString()}</span>
                <span className="block text-[10px] text-slate-400 mt-1">
                  Reporter: {viewingIncident.reportedBy || '911 Emergency Line'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setExplainingIncident(viewingIncident)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
              >
                Inspect Scoring Breakdown
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveSelectedIncident(viewingIncident);
                  setViewingIncident(null);
                  navigate('/allocation');
                }}
                className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-rose-500"
              >
                Dispatch Tactical Units
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Priority Explainer Modal */}
      <PriorityExplainerModal
        isOpen={Boolean(explainingIncident)}
        incident={explainingIncident}
        onClose={() => setExplainingIncident(null)}
      />
    </div>
  );
};
