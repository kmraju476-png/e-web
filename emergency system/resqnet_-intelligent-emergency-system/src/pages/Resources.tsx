import React, { useState, useMemo } from 'react';
import { useEmergency } from '../context/EmergencyContext';
import { Resource, ResourceStatus, ResourceType } from '../types';
import { ResourceStatusBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import {
  Truck,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  MapPin,
  Shield,
  Gauge,
  Zap,
  Users,
  CheckCircle,
  AlertTriangle,
  Flame,
  Droplets,
  HeartPulse,
} from 'lucide-react';

export const ResourcesPage: React.FC = () => {
  const {
    resources,
    createResource,
    updateResource,
    changeResourceStatus,
    deleteResource,
    currentRole,
  } = useEmergency();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  // Form state
  const [formData, setFormData] = useState<{
    name: string;
    type: ResourceType;
    latitude: number;
    longitude: number;
    status: ResourceStatus;
    capacity: number;
    specialization: string;
    baseStation: string;
    speedKmh: number;
    fuelLevel: number;
    contactNumber: string;
    equipmentString: string;
  }>({
    name: '',
    type: 'Ambulance',
    latitude: 19.0760,
    longitude: 72.8777,
    status: 'AVAILABLE',
    capacity: 2,
    specialization: '',
    baseStation: 'Central Emergency Depot',
    speedKmh: 50,
    fuelLevel: 95,
    contactNumber: '+1 (555) 911-0000',
    equipmentString: 'First Aid Kit, Oxygen Tank, Stretcher',
  });

  const resourceTypes: ResourceType[] = [
    'Ambulance',
    'Rescue Team',
    'Fire Response Unit',
    'Medical Team',
  ];

  const resourceStatuses: ResourceStatus[] = [
    'AVAILABLE',
    'ASSIGNED',
    'EN_ROUTE',
    'ON_SCENE',
    'UNAVAILABLE',
  ];

  const filteredResources = useMemo(() => {
    return resources.filter(res => {
      const matchesSearch =
        res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.baseStation.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filterType === 'ALL' || res.type === filterType;
      const matchesStatus = filterStatus === 'ALL' || res.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [resources, searchTerm, filterType, filterStatus]);

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      type: 'Ambulance',
      latitude: Number((19.05 + Math.random() * 0.05).toFixed(4)),
      longitude: Number((72.84 + Math.random() * 0.06).toFixed(4)),
      status: 'AVAILABLE',
      capacity: 2,
      specialization: 'Advanced Life Support & Trauma Care',
      baseStation: 'Central Medical Hub',
      speedKmh: 50,
      fuelLevel: 95,
      contactNumber: '+1 (555) 441-0099',
      equipmentString: 'Defibrillator, Ventilator, Spine Board, Trauma Kit',
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (res: Resource) => {
    setFormData({
      name: res.name,
      type: res.type,
      latitude: res.latitude,
      longitude: res.longitude,
      status: res.status,
      capacity: res.capacity,
      specialization: res.specialization,
      baseStation: res.baseStation,
      speedKmh: res.speedKmh,
      fuelLevel: res.fuelLevel || 90,
      contactNumber: res.contactNumber || '',
      equipmentString: res.equipment.join(', '),
    });
    setEditingResource(res);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const equipment = formData.equipmentString
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingResource) {
      updateResource(editingResource.id, {
        name: formData.name,
        type: formData.type,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        status: formData.status,
        capacity: Number(formData.capacity),
        specialization: formData.specialization,
        baseStation: formData.baseStation,
        speedKmh: Number(formData.speedKmh),
        fuelLevel: Number(formData.fuelLevel),
        contactNumber: formData.contactNumber,
        equipment,
      });
      setEditingResource(null);
    } else {
      createResource({
        name: formData.name,
        type: formData.type,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        status: formData.status,
        capacity: Number(formData.capacity),
        specialization: formData.specialization,
        baseStation: formData.baseStation,
        speedKmh: Number(formData.speedKmh),
        fuelLevel: Number(formData.fuelLevel),
        contactNumber: formData.contactNumber,
        equipment,
      });
      setIsCreateModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Emergency Resource Fleet
            </h1>
            <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-mono font-bold text-slate-300">
              {resources.length} Units
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Tactical fleet dispatch management, vehicle telemetry, equipment inventories, and operational readiness.
          </p>
        </div>

        {currentRole !== 'Viewer' && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-950/50 hover:bg-blue-500 transition-colors self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            Register Fleet Resource
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, base station, equipment, specialty..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/80 pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs font-medium text-slate-300 focus:border-blue-500 focus:outline-none"
          >
            <option value="ALL">All Fleet Types</option>
            {resourceTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs font-medium text-slate-300 focus:border-blue-500 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            {resourceStatuses.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map(res => (
          <div
            key={res.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 hover:border-slate-700 hover:bg-slate-900/90 transition-all shadow-lg space-y-3"
          >
            {/* Top Bar */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-400">{res.id}</span>
                  <ResourceStatusBadge status={res.status} />
                </div>
                <h3 className="text-sm font-bold text-white mt-1">{res.name}</h3>
              </div>

              {currentRole !== 'Viewer' && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(res)}
                    className="rounded-lg border border-slate-700 bg-slate-800 p-1.5 text-slate-400 hover:text-white"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Decommission resource ${res.name}?`)) {
                        deleteResource(res.id);
                      }
                    }}
                    className="rounded-lg border border-slate-800 bg-slate-900 p-1.5 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Specialization & Base */}
            <div className="text-xs text-slate-300 space-y-1 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <div className="text-slate-400 text-[11px]">
                Type: <strong className="text-white">{res.type}</strong>
              </div>
              <div className="text-slate-400 text-[11px]">
                Specialization: <span className="text-slate-200">{res.specialization}</span>
              </div>
              <div className="text-slate-400 text-[11px] flex items-center justify-between">
                <span>Base: {res.baseStation}</span>
                <span className="font-mono text-slate-300">{res.speedKmh} km/h base</span>
              </div>
            </div>

            {/* Equipment Chips */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Equipment & Capabilities
              </span>
              <div className="flex flex-wrap gap-1">
                {res.equipment.map((eq, i) => (
                  <span
                    key={i}
                    className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300 border border-slate-700"
                  >
                    {eq}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Status Quick Switch */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <div className="text-[11px] text-slate-400">
                Capacity: <strong className="text-white">{res.capacity}</strong> berths/crew
              </div>

              {currentRole !== 'Viewer' && (
                <select
                  value={res.status}
                  onChange={e => changeResourceStatus(res.id, e.target.value as ResourceStatus)}
                  className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] font-semibold text-slate-200 focus:border-blue-500 focus:outline-none"
                >
                  {resourceStatuses.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Resource Modal */}
      <Modal
        isOpen={isCreateModalOpen || Boolean(editingResource)}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingResource(null);
        }}
        title={editingResource ? `Edit Resource: ${editingResource.id}` : 'Register New Fleet Unit'}
        subtitle="Configure tactical vehicle specifications, equipment payload, and dispatch base station."
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Unit Name / Identification *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Ambulance A-09 (ALS Rapid)"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Resource Category *
              </label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as ResourceType })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                {resourceTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Home Base Station *
              </label>
              <input
                type="text"
                required
                value={formData.baseStation}
                onChange={e => setFormData({ ...formData, baseStation: e.target.value })}
                placeholder="e.g. Metro General Hospital Depot"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Specialization / Capability *
              </label>
              <input
                type="text"
                required
                value={formData.specialization}
                onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                placeholder="e.g. Advanced Life Support & Trauma Surgery"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Crew / Berth Capacity *
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.capacity}
                onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Base Speed (km/h)
              </label>
              <input
                type="number"
                min="20"
                max="120"
                value={formData.speedKmh}
                onChange={e => setFormData({ ...formData, speedKmh: parseInt(e.target.value) || 45 })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Initial Status
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as ResourceStatus })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                {resourceStatuses.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white font-mono"
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
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Equipment Payload (comma separated)
            </label>
            <input
              type="text"
              value={formData.equipmentString}
              onChange={e => setFormData({ ...formData, equipmentString: e.target.value })}
              placeholder="e.g. Defibrillator, Ventilator, Jaws of Life, Hazmat Suit"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsCreateModalOpen(false);
                setEditingResource(null);
              }}
              className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-lg hover:bg-blue-500"
            >
              {editingResource ? 'Save Resource Changes' : 'Register Resource'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
