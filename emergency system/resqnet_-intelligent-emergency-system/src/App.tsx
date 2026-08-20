import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EmergencyProvider } from './context/EmergencyContext';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { Dashboard } from './pages/Dashboard';
import { LiveMapPage } from './pages/LiveMapPage';
import { IncidentsPage } from './pages/Incidents';
import { ResourcesPage } from './pages/Resources';
import { AllocationPage } from './pages/Allocation';
import { RoutesPage } from './pages/RoutesPage';
import { HospitalsPage } from './pages/Hospitals';
import { SimulationPage } from './pages/Simulation';
import { AnalyticsPage } from './pages/Analytics';
import { NotificationsPage } from './pages/NotificationsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';

export default function App() {
  return (
    <EmergencyProvider>
      <HashRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/map" element={<LiveMapPage />} />
            <Route path="/incidents" element={<IncidentsPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/allocation" element={<AllocationPage />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/hospitals" element={<HospitalsPage />} />
            <Route path="/simulation" element={<SimulationPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/audit" element={<AuditLogsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </EmergencyProvider>
  );
}

