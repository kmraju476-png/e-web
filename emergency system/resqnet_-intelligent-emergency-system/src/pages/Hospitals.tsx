import React, { useState } from 'react';
import { useEmergency } from '../context/EmergencyContext';
import { Hospital } from '../types';
import { Modal } from '../components/common/Modal';
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Activity,
  HeartPulse,
  Bed,
  ShieldCheck,
  AlertTriangle,
  UserPlus,
  UserMinus,
} from 'lucide-react';

export const HospitalsPage: React.FC = () => {
  const {
    hospitals,
    createHospital,
    updateHospital,
    deleteHospital,
    currentRole,
  } = useEmergency();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    location: string;
    latitude: number;
    longitude: number;
    totalBeds: number;
    availableBeds: number;
    icuBeds: number;
    availableIcuBeds: number;
    emergencyCapacity: Hospital['emergencyCapacity'];
    status: Hospital['status'];
    traumaLevel: 1 | 2 | 3;
    specialtiesString: string;
    contactPhone: string;
  }>({
    name: '',
    location: '',
    latitude: 19.0760,
    longitude: 72.8777,
    totalBeds: 100,
    availableBeds: 20,
    icuBeds: 12,
    availableIcuBeds: 4,
    emergencyCapacity: 'NORMAL',
    status: 'ACTIVE',
    traumaLevel: 1,
    specialtiesString: 'Trauma Surgery, Emergency Medicine, Critical Care',
    contactPhone: '+1 (555) 911-0000',
  });

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      location: '',
      latitude: Number((19.05 + Math.random() * 0.05).toFixed(4)),
      longitude: Number((72.84 + Math.random() * 0.06).toFixed(4)),
      totalBeds: 120,
      availableBeds: 25,
      icuBeds: 16,
      availableIcuBeds: 5,
      emergencyCapacity: 'NORMAL',
      status: 'ACTIVE',
      traumaLevel: 1,
      specialtiesString: 'Trauma Surgery, Cardiac ICU, Burns Unit',
      contactPhone: '+1 (555) 911-0900',
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (hosp: Hospital) => {
    setFormData({
      name: hosp.name,
      location: hosp.location,
      latitude: hosp.latitude,
      longitude: hosp.longitude,
      totalBeds: hosp.totalBeds,
      availableBeds: hosp.availableBeds,
      icuBeds: hosp.icuBeds,
      availableIcuBeds: hosp.availableIcuBeds,
      emergencyCapacity: hosp.emergencyCapacity,
      status: hosp.status,
      traumaLevel: hosp.traumaLevel,
      specialtiesString: hosp.specialties.join(', '),
      contactPhone: hosp.contactPhone,
    });
    setEditingHospital(hosp);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const specialties = formData.specialtiesString
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingHospital) {
      updateHospital(editingHospital.id, {
        name: formData.name,
        location: formData.location,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        totalBeds: Number(formData.totalBeds),
        availableBeds: Number(formData.availableBeds),
        icuBeds: Number(formData.icuBeds),
        availableIcuBeds: Number(formData.availableIcuBeds),
        emergencyCapacity: formData.emergencyCapacity,
        status: formData.status,
        traumaLevel: formData.traumaLevel,
        specialties,
        contactPhone: formData.contactPhone,
      });
      setEditingHospital(null);
    } else {
      createHospital({
        name: formData.name,
        location: formData.location,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        totalBeds: Number(formData.totalBeds),
        availableBeds: Number(formData.availableBeds),
        icuBeds: Number(formData.icuBeds),
        availableIcuBeds: Number(formData.availableIcuBeds),
        emergencyCapacity: formData.emergencyCapacity,
        status: formData.status,
        traumaLevel: formData.traumaLevel,
        specialties,
        contactPhone: formData.contactPhone,
      });
      setIsCreateModalOpen(false);
    }
  };

  const adjustBeds = (hosp: Hospital, delta: number, isIcu = false) => {
    if (isIcu) {
      const next = Math.max(0, Math.min(hosp.icuBeds, hosp.availableIcuBeds + delta));
      updateHospital(hosp.id, { availableIcuBeds: next });
    } else {
      const next = Math.max(0, Math.min(hosp.totalBeds, hosp.availableBeds + delta));
      updateHospital(hosp.id, { availableBeds: next });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Hospital Facilities & Trauma Centers
            </h1>
            <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-mono font-bold text-slate-300">
              {hospitals.length} Active Centers
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time critical care capacity, ICU bed allocation, trauma level designation, and patient intake coordination.
          </p>
        </div>

        {currentRole !== 'Viewer' && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-950/50 hover:bg-emerald-500 transition-colors self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            Register Hospital Facility
          </button>
        )}
      </div>

      {/* Hospital Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {hospitals.map(hosp => {
          const bedPercent = Math.round((hosp.availableBeds / Math.max(1, hosp.totalBeds)) * 100);
          const icuPercent = Math.round((hosp.availableIcuBeds / Math.max(1, hosp.icuBeds)) * 100);

          return (
            <div
              key={hosp.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 hover:border-slate-700 hover:bg-slate-900/90 transition-all shadow-xl space-y-4"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">{hosp.id}</span>
                    <span
                      className={`text-[10px] font-bold uppercase rounded-full px-2 py-0.5 border ${
                        hosp.status === 'ACTIVE'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : hosp.status === 'DIVERTING'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {hosp.status}
                    </span>
                    <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">
                      Level {hosp.traumaLevel} Trauma
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1.5">{hosp.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    {hosp.location}
                  </p>
                </div>

                {currentRole !== 'Viewer' && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(hosp)}
                      className="rounded-lg border border-slate-700 bg-slate-800 p-1.5 text-slate-400 hover:text-white"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete hospital ${hosp.name}?`)) {
                          deleteHospital(hosp.id);
                        }
                      }}
                      className="rounded-lg border border-slate-800 bg-slate-900 p-1.5 text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Bed Capacity Bars */}
              <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
                {/* General Beds */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                      <Bed className="h-3.5 w-3.5 text-emerald-400" />
                      General Beds
                    </span>
                    <span className="font-mono font-bold text-emerald-400">
                      {hosp.availableBeds} / {hosp.totalBeds} ({bedPercent}% free)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        bedPercent < 15 ? 'bg-rose-500' : bedPercent < 35 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${bedPercent}%` }}
                    />
                  </div>
                </div>

                {/* ICU Beds */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                      <HeartPulse className="h-3.5 w-3.5 text-blue-400" />
                      ICU Critical Beds
                    </span>
                    <span className="font-mono font-bold text-blue-400">
                      {hosp.availableIcuBeds} / {hosp.icuBeds} ({icuPercent}% free)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        icuPercent < 20 ? 'bg-rose-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${icuPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Patient Intake Sim Quick Controls */}
              {currentRole !== 'Viewer' && (
                <div className="flex items-center justify-between gap-2 text-xs pt-1">
                  <span className="text-slate-400 text-[11px]">Simulate Bed Intake:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => adjustBeds(hosp, -1)}
                      title="Admit 1 Patient"
                      className="flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] font-semibold text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                      <UserPlus className="h-3 w-3 text-rose-400" />
                      Admit
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustBeds(hosp, +1)}
                      title="Discharge 1 Patient"
                      className="flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] font-semibold text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                      <UserMinus className="h-3 w-3 text-emerald-400" />
                      Discharge
                    </button>
                  </div>
                </div>
              )}

              {/* Specialties */}
              <div className="space-y-1 pt-2 border-t border-slate-800 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Specialty Medical Wings
                </span>
                <div className="flex flex-wrap gap-1">
                  {hosp.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hospital Create / Edit Modal */}
      <Modal
        isOpen={isCreateModalOpen || Boolean(editingHospital)}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingHospital(null);
        }}
        title={editingHospital ? `Edit Hospital Facility: ${editingHospital.id}` : 'Register New Medical Center'}
        subtitle="Configure bed capacity quotas, trauma surgical level, and emergency intake status."
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Hospital Center Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Apex City Medical Center"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Location Address *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Sector 4, Central Medical Precinct"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Total Beds</label>
              <input
                type="number"
                min="10"
                required
                value={formData.totalBeds}
                onChange={e => setFormData({ ...formData, totalBeds: parseInt(e.target.value) || 0 })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Avail Beds</label>
              <input
                type="number"
                min="0"
                required
                value={formData.availableBeds}
                onChange={e => setFormData({ ...formData, availableBeds: parseInt(e.target.value) || 0 })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Total ICU</label>
              <input
                type="number"
                min="1"
                required
                value={formData.icuBeds}
                onChange={e => setFormData({ ...formData, icuBeds: parseInt(e.target.value) || 0 })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Avail ICU</label>
              <input
                type="number"
                min="0"
                required
                value={formData.availableIcuBeds}
                onChange={e => setFormData({ ...formData, availableIcuBeds: parseInt(e.target.value) || 0 })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Trauma Readiness</label>
              <select
                value={formData.traumaLevel}
                onChange={e => setFormData({ ...formData, traumaLevel: parseInt(e.target.value) as 1 | 2 | 3 })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value={1}>Level 1 (Comprehensive Surgical)</option>
                <option value={2}>Level 2 (Regional Trauma)</option>
                <option value={3}>Level 3 (Community / Urgent)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Operational Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as Hospital['status'] })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="AT_CAPACITY">AT_CAPACITY</option>
                <option value="DIVERTING">DIVERTING</option>
                <option value="MAINTENANCE">MAINTENANCE</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Phone</label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Latitude</label>
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
              <label className="block text-xs font-semibold text-slate-300 mb-1">Longitude</label>
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
              Specialty Departments (comma separated)
            </label>
            <input
              type="text"
              value={formData.specialtiesString}
              onChange={e => setFormData({ ...formData, specialtiesString: e.target.value })}
              placeholder="e.g. Major Trauma Surgery, Neurosurgery, Cardiology, Burns Unit"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsCreateModalOpen(false);
                setEditingHospital(null);
              }}
              className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-lg hover:bg-emerald-500"
            >
              {editingHospital ? 'Save Hospital Updates' : 'Publish Hospital'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
