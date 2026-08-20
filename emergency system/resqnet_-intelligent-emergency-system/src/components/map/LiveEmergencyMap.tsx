import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useEmergency } from '../../context/EmergencyContext';
import { Incident, Resource, Hospital, GraphEdge, GraphNode } from '../../types';
import { PriorityExplainerModal } from '../common/PriorityExplainerModal';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Zap,
  Navigation,
  AlertTriangle,
  RotateCcw,
  Activity,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface LiveEmergencyMapProps {
  height?: string;
  focusCoordinates?: [number, number];
  showHUD?: boolean;
}

export const LiveEmergencyMap: React.FC<LiveEmergencyMapProps> = ({
  height = '600px',
  focusCoordinates,
  showHUD = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routesLayerRef = useRef<L.LayerGroup | null>(null);
  const roadNetworkLayerRef = useRef<L.LayerGroup | null>(null);

  const navigate = useNavigate();
  const {
    incidents,
    resources,
    hospitals,
    nodes,
    edges,
    activeRoute,
    toggleRoadBlockage,
    setActiveSelectedIncident,
    calculateRouteBetweenCoords,
  } = useEmergency();

  const [selectedIncidentForExplainer, setSelectedIncidentForExplainer] = useState<Incident | null>(null);
  const [filterIncidents, setFilterIncidents] = useState(true);
  const [filterResources, setFilterResources] = useState(true);
  const [filterHospitals, setFilterHospitals] = useState(true);
  const [filterRoads, setFilterRoads] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [19.0760, 72.8777],
        zoom: 13,
        zoomControl: false,
      });

      // Add clean dark-theme OpenStreetMap CartoDB Tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://openstreetmap.org">OSM</a>',
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      routesLayerRef.current = L.layerGroup().addTo(map);
      roadNetworkLayerRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      // Map cleanup on unmount handled gracefully
    };
  }, []);

  // Update map center when focusCoordinates changes
  useEffect(() => {
    if (mapInstanceRef.current && focusCoordinates) {
      mapInstanceRef.current.flyTo(focusCoordinates, 14, { duration: 1.2 });
    }
  }, [focusCoordinates]);

  // Render Road Network Graph Edges and Nodes
  useEffect(() => {
    if (!mapInstanceRef.current || !roadNetworkLayerRef.current) return;

    roadNetworkLayerRef.current.clearLayers();

    if (!filterRoads) return;

    const nodeMap = new Map<string, GraphNode>();
    nodes.forEach(n => nodeMap.set(n.id, n));

    // Render Edges
    edges.forEach(edge => {
      const src = nodeMap.get(edge.source);
      const tgt = nodeMap.get(edge.target);
      if (!src || !tgt) return;

      const isBlocked = edge.isBlocked || edge.condition === 'BLOCKED';
      const color = isBlocked ? '#ef4444' : edge.condition === 'HEAVY_TRAFFIC' ? '#f59e0b' : edge.condition === 'MODERATE_TRAFFIC' ? '#eab308' : '#3b82f6';
      const weight = isBlocked ? 5 : edge.condition === 'CLEAR' ? 3 : 4;
      const dashArray = isBlocked ? '6, 8' : undefined;
      const opacity = isBlocked ? 0.9 : 0.45;

      const polyline = L.polyline(
        [
          [src.latitude, src.longitude],
          [tgt.latitude, tgt.longitude],
        ],
        { color, weight, dashArray, opacity }
      );

      const popupContent = `
        <div style="font-family: inherit; font-size: 12px;">
          <div style="font-weight: 700; color: #f8fafc; margin-bottom: 4px;">${edge.name}</div>
          <div style="color: #94a3b8; margin-bottom: 6px;">Distance: ${edge.distanceKm} km | Speed Limit: ${edge.baseSpeedKmh} km/h</div>
          <div style="margin-bottom: 8px;">
            Status: <span style="font-weight: 600; color: ${isBlocked ? '#f87171' : '#34d399'};">${isBlocked ? 'BLOCKED' : edge.condition}</span>
          </div>
          <button id="btn-toggle-${edge.id}" style="background: ${isBlocked ? '#10b981' : '#ef4444'}; color: #fff; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 6px; border: none; cursor: pointer;">
            ${isBlocked ? '✓ Unblock Road' : '⚠️ Simulate Blockage'}
          </button>
        </div>
      `;

      polyline.bindPopup(popupContent);
      polyline.on('popupopen', () => {
        const btn = document.getElementById(`btn-toggle-${edge.id}`);
        if (btn) {
          btn.onclick = () => {
            toggleRoadBlockage(edge.id);
            polyline.closePopup();
          };
        }
      });

      roadNetworkLayerRef.current?.addLayer(polyline);
    });

    // Render Intersection Nodes
    nodes.forEach(node => {
      const nodeIcon = L.divIcon({
        className: 'custom-node-icon',
        html: `
          <div style="width: 10px; height: 10px; border-radius: 50%; background: #64748b; border: 2px solid #0f172a; box-shadow: 0 0 6px rgba(0,0,0,0.8);" title="${node.name}"></div>
        `,
        iconSize: [10, 10],
        iconAnchor: [5, 5],
      });

      const marker = L.marker([node.latitude, node.longitude], { icon: nodeIcon });
      marker.bindTooltip(`<b>${node.name}</b>`, { direction: 'top', offset: [0, -6], opacity: 0.9 });
      roadNetworkLayerRef.current?.addLayer(marker);
    });
  }, [nodes, edges, filterRoads, toggleRoadBlockage]);

  // Render Incidents, Resources, Hospitals
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // 1. Incidents
    if (filterIncidents) {
      incidents.forEach(inc => {
        if (inc.status === 'RESOLVED') return; // hide resolved from active map or show faded

        const isCritical = inc.severity === 'CRITICAL';
        const color = isCritical ? '#ef4444' : inc.severity === 'HIGH' ? '#f97316' : inc.severity === 'MEDIUM' ? '#eab308' : '#10b981';

        const incidentIcon = L.divIcon({
          className: 'custom-incident-marker',
          html: `
            <div style="position: relative; display: flex; align-items: center; justify-content: center;">
              ${isCritical ? `<div class="pulse-marker-ring" style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: rgba(239, 68, 68, 0.4); border: 1.5px solid #ef4444;"></div>` : ''}
              <div style="width: 22px; height: 22px; border-radius: 50%; background: ${color}; border: 2.5px solid #ffffff; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; color: #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.6);">
                !
              </div>
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });

        const marker = L.marker([inc.latitude, inc.longitude], { icon: incidentIcon });

        const popupContent = `
          <div style="font-family: inherit; font-size: 12px; min-width: 210px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <span style="font-weight: 800; color: ${color}; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px;">${inc.severity} Severity</span>
              <span style="background: rgba(244,63,94,0.15); color: #fb7185; padding: 2px 6px; border-radius: 9999px; font-weight: 700; font-size: 10px;">Priority: ${inc.priorityScore}/100</span>
            </div>
            <div style="font-weight: 700; color: #ffffff; font-size: 13px; margin-bottom: 3px;">${inc.title}</div>
            <div style="color: #94a3b8; font-size: 11px; margin-bottom: 6px;">📍 ${inc.location}</div>
            <div style="color: #cbd5e1; font-size: 11px; margin-bottom: 8px;">Casualties / Affected: <strong>${inc.peopleAffected}</strong></div>
            <div style="display: flex; gap: 6px;">
              <button id="btn-dispatch-${inc.id}" style="flex: 1; background: #e11d48; color: #fff; font-size: 11px; font-weight: 700; padding: 5px 8px; border-radius: 6px; border: none; cursor: pointer;">
                Dispatch Units
              </button>
              <button id="btn-explain-${inc.id}" style="background: #1e293b; color: #cbd5e1; font-size: 11px; font-weight: 600; padding: 5px 8px; border-radius: 6px; border: 1px solid #334155; cursor: pointer;">
                Explain
              </button>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('popupopen', () => {
          const btnDispatch = document.getElementById(`btn-dispatch-${inc.id}`);
          const btnExplain = document.getElementById(`btn-explain-${inc.id}`);
          if (btnDispatch) {
            btnDispatch.onclick = () => {
              setActiveSelectedIncident(inc);
              navigate('/allocation');
            };
          }
          if (btnExplain) {
            btnExplain.onclick = () => {
              setSelectedIncidentForExplainer(inc);
              marker.closePopup();
            };
          }
        });

        markersLayerRef.current?.addLayer(marker);
      });
    }

    // 2. Resources
    if (filterResources) {
      resources.forEach(res => {
        const isAvail = res.status === 'AVAILABLE';
        const bg = res.type === 'Ambulance' ? '#3b82f6' : res.type === 'Rescue Team' ? '#a855f7' : res.type === 'Fire Response Unit' ? '#f97316' : '#10b981';
        const symbol = res.type === 'Ambulance' ? '🚑' : res.type === 'Rescue Team' ? '🛟' : res.type === 'Fire Response Unit' ? '🚒' : '🩺';

        const resourceIcon = L.divIcon({
          className: 'custom-resource-marker',
          html: `
            <div style="width: 26px; height: 26px; border-radius: 8px; background: ${bg}; border: 2px solid ${isAvail ? '#ffffff' : '#94a3b8'}; display: flex; align-items: center; justify-content: center; font-size: 13px; box-shadow: 0 4px 10px rgba(0,0,0,0.6);">
              ${symbol}
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        });

        const marker = L.marker([res.latitude, res.longitude], { icon: resourceIcon });

        const popupContent = `
          <div style="font-family: inherit; font-size: 12px; min-width: 200px;">
            <div style="font-weight: 700; color: #ffffff; font-size: 13px; margin-bottom: 2px;">${res.name}</div>
            <div style="color: #94a3b8; font-size: 11px; margin-bottom: 4px;">Type: ${res.type} | Base: ${res.baseStation}</div>
            <div style="margin-bottom: 6px;">
              Status: <span style="font-weight: 700; color: ${isAvail ? '#34d399' : '#fb7185'};">${res.status}</span>
            </div>
            <div style="color: #cbd5e1; font-size: 11px; margin-bottom: 8px;">Specialization: ${res.specialization}</div>
            <button id="btn-route-res-${res.id}" style="width: 100%; background: #3b82f6; color: #fff; font-size: 11px; font-weight: 600; padding: 4px 8px; border-radius: 6px; border: none; cursor: pointer;">
              Calculate Dijkstra Transit
            </button>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('popupopen', () => {
          const btn = document.getElementById(`btn-route-res-${res.id}`);
          if (btn) {
            btn.onclick = () => {
              // Find first active critical incident or default hospital
              const targetInc = incidents.find(i => i.status !== 'RESOLVED');
              if (targetInc) {
                calculateRouteBetweenCoords([res.latitude, res.longitude], [targetInc.latitude, targetInc.longitude], res.speedKmh);
                marker.closePopup();
              }
            };
          }
        });

        markersLayerRef.current?.addLayer(marker);
      });
    }

    // 3. Hospitals
    if (filterHospitals) {
      hospitals.forEach(hosp => {
        const hospIcon = L.divIcon({
          className: 'custom-hospital-marker',
          html: `
            <div style="width: 28px; height: 28px; border-radius: 8px; background: #0284c7; border: 2px solid #ffffff; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 900; color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.7);">
              🏥
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([hosp.latitude, hosp.longitude], { icon: hospIcon });

        const popupContent = `
          <div style="font-family: inherit; font-size: 12px; min-width: 220px;">
            <div style="font-weight: 800; color: #38bdf8; font-size: 13px; margin-bottom: 2px;">${hosp.name}</div>
            <div style="color: #94a3b8; font-size: 11px; margin-bottom: 6px;">📍 ${hosp.location}</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; background: rgba(15,23,42,0.8); padding: 6px; border-radius: 6px; margin-bottom: 6px;">
              <div>
                <span style="color: #94a3b8; font-size: 10px;">Available Beds:</span>
                <div style="font-weight: 700; color: #34d399;">${hosp.availableBeds} / ${hosp.totalBeds}</div>
              </div>
              <div>
                <span style="color: #94a3b8; font-size: 10px;">ICU Units:</span>
                <div style="font-weight: 700; color: #38bdf8;">${hosp.availableIcuBeds} / ${hosp.icuBeds}</div>
              </div>
            </div>
            <div style="font-size: 10px; color: #cbd5e1;">Level ${hosp.traumaLevel} Trauma Readiness • Status: <strong>${hosp.status}</strong></div>
          </div>
        `;

        marker.bindPopup(popupContent);
        markersLayerRef.current?.addLayer(marker);
      });
    }
  }, [
    incidents,
    resources,
    hospitals,
    filterIncidents,
    filterResources,
    filterHospitals,
    setActiveSelectedIncident,
    calculateRouteBetweenCoords,
    navigate,
  ]);

  // Render Active Dijkstra Route
  useEffect(() => {
    if (!mapInstanceRef.current || !routesLayerRef.current) return;

    routesLayerRef.current.clearLayers();

    if (!activeRoute || activeRoute.pathCoordinates.length < 2) return;

    // Glowing polyline
    const routePolyline = L.polyline(activeRoute.pathCoordinates, {
      color: activeRoute.hasBlockageDetour ? '#06b6d4' : '#10b981',
      weight: 6,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round',
    });

    const routeGlow = L.polyline(activeRoute.pathCoordinates, {
      color: activeRoute.hasBlockageDetour ? '#0891b2' : '#059669',
      weight: 12,
      opacity: 0.35,
    });

    routesLayerRef.current.addLayer(routeGlow);
    routesLayerRef.current.addLayer(routePolyline);

    // Add Start and End Waypoint Markers
    const startCoord = activeRoute.pathCoordinates[0];
    const endCoord = activeRoute.pathCoordinates[activeRoute.pathCoordinates.length - 1];

    const startMarker = L.circleMarker(startCoord, {
      radius: 7,
      fillColor: '#3b82f6',
      fillOpacity: 1,
      color: '#ffffff',
      weight: 2,
    }).bindTooltip(`<b>Start Point</b>: ${activeRoute.pathNodes[0]?.name || 'Origin'}`);

    const endMarker = L.circleMarker(endCoord, {
      radius: 8,
      fillColor: '#ef4444',
      fillOpacity: 1,
      color: '#ffffff',
      weight: 2.5,
    }).bindTooltip(`<b>Destination</b>: ${activeRoute.pathNodes[activeRoute.pathNodes.length - 1]?.name || 'Destination'}`);

    routesLayerRef.current.addLayer(startMarker);
    routesLayerRef.current.addLayer(endMarker);

    // Zoom to fit route
    mapInstanceRef.current.fitBounds(routePolyline.getBounds(), { padding: [40, 40] });
  }, [activeRoute]);

  const resetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([19.0760, 72.8777], 13);
    }
  };

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl ${isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : ''}`}>
      {/* Map Canvas */}
      <div ref={mapContainerRef} style={{ height: isFullscreen ? '100vh' : height }} />

      {/* Floating Tactical Layer Controls */}
      {showHUD && (
        <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2">
          {/* Layer Filter Pill Box */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-800/90 bg-slate-900/90 p-1.5 shadow-xl backdrop-blur-md">
            <button
              type="button"
              onClick={() => setFilterIncidents(!filterIncidents)}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                filterIncidents
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-slate-800/50 text-slate-400 hover:text-white'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              Incidents
            </button>

            <button
              type="button"
              onClick={() => setFilterResources(!filterResources)}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                filterResources
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  : 'bg-slate-800/50 text-slate-400 hover:text-white'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              Resources
            </button>

            <button
              type="button"
              onClick={() => setFilterHospitals(!filterHospitals)}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                filterHospitals
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800/50 text-slate-400 hover:text-white'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Hospitals
            </button>

            <button
              type="button"
              onClick={() => setFilterRoads(!filterRoads)}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                filterRoads
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'bg-slate-800/50 text-slate-400 hover:text-white'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-purple-500" />
              Road Network
            </button>
          </div>
        </div>
      )}

      {/* Top-Right HUD Controls */}
      <div className="absolute top-4 right-4 z-[400] flex items-center gap-2">
        <button
          type="button"
          onClick={resetView}
          title="Reset Map View"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white shadow-lg backdrop-blur-md transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          title="Toggle Fullscreen"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white shadow-lg backdrop-blur-md transition-colors"
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
      </div>

      {/* Active Route Telemetry Banner */}
      {activeRoute && (
        <div className="absolute bottom-4 left-4 right-4 z-[400] max-w-xl mx-auto rounded-xl border border-cyan-500/40 bg-slate-900/95 p-3.5 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Navigation className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Active Dijkstra Optimal Route</span>
                  {activeRoute.hasBlockageDetour && (
                    <span className="rounded bg-amber-500/20 px-1.5 py-0.2 text-[9px] font-bold text-amber-300 border border-amber-500/30">
                      Blockage Detour Active
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  {activeRoute.pathNodes.map(n => n.name).join(' → ')}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-extrabold text-cyan-400">{activeRoute.estimatedTimeMinutes} min ETA</div>
              <div className="text-[10px] text-slate-400">{activeRoute.totalDistanceKm} km distance</div>
            </div>
          </div>
        </div>
      )}

      {/* Priority Explainer Modal */}
      <PriorityExplainerModal
        isOpen={Boolean(selectedIncidentForExplainer)}
        incident={selectedIncidentForExplainer}
        onClose={() => setSelectedIncidentForExplainer(null)}
      />
    </div>
  );
};
