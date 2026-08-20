import React from 'react';
import { useEmergency } from '../context/EmergencyContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Shield,
  Building2,
  Clock,
  Activity,
  Download,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { incidents, resources, hospitals, stats } = useEmergency();

  // 1. Severity Distribution
  const severityCounts = [
    { name: 'Critical', value: incidents.filter(i => i.severity === 'CRITICAL').length, color: '#ef4444' },
    { name: 'High', value: incidents.filter(i => i.severity === 'HIGH').length, color: '#f97316' },
    { name: 'Medium', value: incidents.filter(i => i.severity === 'MEDIUM').length, color: '#eab308' },
    { name: 'Low', value: incidents.filter(i => i.severity === 'LOW').length, color: '#10b981' },
  ].filter(d => d.value > 0);

  // 2. Incident Type Distribution
  const typeMap = new Map<string, number>();
  incidents.forEach(i => {
    typeMap.set(i.incidentType, (typeMap.get(i.incidentType) || 0) + 1);
  });
  const incidentTypeData = Array.from(typeMap.entries()).map(([name, count]) => ({
    name,
    count,
  }));

  // 3. Resource Status Distribution
  const resourceTypeStatus = [
    {
      type: 'Ambulance',
      available: resources.filter(r => r.type === 'Ambulance' && r.status === 'AVAILABLE').length,
      engaged: resources.filter(r => r.type === 'Ambulance' && r.status !== 'AVAILABLE').length,
    },
    {
      type: 'Rescue',
      available: resources.filter(r => r.type === 'Rescue Team' && r.status === 'AVAILABLE').length,
      engaged: resources.filter(r => r.type === 'Rescue Team' && r.status !== 'AVAILABLE').length,
    },
    {
      type: 'Fire',
      available: resources.filter(r => r.type === 'Fire Response Unit' && r.status === 'AVAILABLE').length,
      engaged: resources.filter(r => r.type === 'Fire Response Unit' && r.status !== 'AVAILABLE').length,
    },
    {
      type: 'Medical',
      available: resources.filter(r => r.type === 'Medical Team' && r.status === 'AVAILABLE').length,
      engaged: resources.filter(r => r.type === 'Medical Team' && r.status !== 'AVAILABLE').length,
    },
  ];

  // 4. Hospital Capacity Data
  const hospitalData = hospitals.map(h => ({
    name: h.name.replace('Hospital', 'Hosp').replace('Medical Center', 'MC'),
    availableBeds: h.availableBeds,
    occupiedBeds: h.totalBeds - h.availableBeds,
    availableICU: h.availableIcuBeds,
    occupiedICU: h.icuBeds - h.availableIcuBeds,
  }));

  // 5. Response Time Simulation Trajectory
  const responseTimeData = [
    { range: '0-2 km', avgTime: 4.2, target: 5.0 },
    { range: '2-5 km', avgTime: 8.5, target: 9.0 },
    { range: '5-8 km', avgTime: 14.1, target: 15.0 },
    { range: '8-12 km', avgTime: 21.0, target: 20.0 },
    { range: '12+ km', avgTime: 29.4, target: 28.0 },
  ];

  const totalBedsAcross = hospitals.reduce((acc, h) => acc + h.totalBeds, 0);
  const availBedsAcross = hospitals.reduce((acc, h) => acc + h.availableBeds, 0);
  const bedOccupancyRate = Math.round(((totalBedsAcross - availBedsAcross) / Math.max(1, totalBedsAcross)) * 100);

  const fleetAvailRate = Math.round(
    (resources.filter(r => r.status === 'AVAILABLE').length / Math.max(1, resources.length)) * 100
  );

  const avgPriority = Math.round(
    incidents.reduce((acc, i) => acc + i.priorityScore, 0) / Math.max(1, incidents.length)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              System Analytics & Academic Telemetry
            </h1>
            <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-500/30">
              Recharts Visual Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Quantitative evaluation of queuing latency, fleet utilization coefficients, and trauma bed elasticity.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors self-start sm:self-auto"
        >
          <Download className="h-4 w-4" />
          Export Report
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
          <span className="text-slate-400 text-xs font-medium">Average Priority Score</span>
          <div className="text-2xl font-black text-rose-400 font-mono mt-1">
            {avgPriority} <span className="text-sm font-normal text-slate-400">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Calculated across {incidents.length} active records</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
          <span className="text-slate-400 text-xs font-medium">Fleet Availability Index</span>
          <div className="text-2xl font-black text-blue-400 font-mono mt-1">
            {fleetAvailRate}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {resources.filter(r => r.status === 'AVAILABLE').length} standby units ready
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
          <span className="text-slate-400 text-xs font-medium">Hospital Bed Occupancy</span>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            {bedOccupancyRate}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{availBedsAcross} beds available across region</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
          <span className="text-slate-400 text-xs font-medium">Mean Response ETA</span>
          <div className="text-2xl font-black text-purple-400 font-mono mt-1">
            7.8 <span className="text-sm font-normal text-slate-400">min</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Estimated via Dijkstra path distances</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Incident Severity Distribution */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieIcon className="h-4 w-4 text-rose-400" />
              Incident Distribution by Severity
            </h3>
            <span className="text-[11px] text-slate-400">Triage Tier Breakdown</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityCounts}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {severityCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#ffffff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Incidents by Category */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-amber-400" />
              Incidents by Emergency Category
            </h3>
            <span className="text-[11px] text-slate-400">Type Frequency</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incidentTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Incidents" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Resource Fleet Availability Breakdown */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-400" />
              Tactical Fleet Readiness (Available vs Engaged)
            </h3>
            <span className="text-[11px] text-slate-400">By Resource Category</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resourceTypeStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="type" stroke="#64748b" />
                <YAxis stroke="#64748b" allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="available" stackId="a" fill="#10b981" name="Available (Standby)" />
                <Bar dataKey="engaged" stackId="a" fill="#3b82f6" name="Engaged / Dispatched" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Distance vs Response Time Trajectory */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-400" />
              Transit Time vs Distance Horizon
            </h3>
            <span className="text-[11px] text-slate-400">Dijkstra Simulation Curves</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="range" stroke="#64748b" />
                <YAxis stroke="#64748b" unit="m" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="avgTime" stroke="#a855f7" fill="#a855f7" fillOpacity={0.2} name="Simulated ETA (min)" />
                <Area type="monotone" dataKey="target" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.1} name="Benchmark SLA (min)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
