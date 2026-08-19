import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  MapPin, 
  Filter, 
  Eye, 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  Compass, 
  Sliders, 
  RefreshCw,
  Search,
  Maximize2,
  Users,
  Navigation,
  Radio
} from 'lucide-react';
import { Incident } from '../types';

interface LiveCityHeatmapProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
}

export const LiveCityHeatmap: React.FC<LiveCityHeatmapProps> = ({
  incidents,
  onSelectIncident
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const wardsLayerRef = useRef<L.LayerGroup | null>(null);
  const heatmapLayerRef = useRef<L.LayerGroup | null>(null);

  // Filter States
  const [selectedWard, setSelectedWard] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [tileLayerType, setTileLayerType] = useState<'dark' | 'satellite' | 'street'>('dark');
  const [showWards, setShowWards] = useState<boolean>(true);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [showMarkers, setShowMarkers] = useState<boolean>(true);
  const [focusedIncident, setFocusedIncident] = useState<Incident | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [37.7749, -122.4194],
      zoom: 13,
      zoomControl: false,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    // Default Dark Basemap
    const darkTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    });
    darkTileLayer.addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    const wardsLayer = L.layerGroup().addTo(map);
    const heatmapLayer = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;
    markersLayerRef.current = markersLayer;
    wardsLayerRef.current = wardsLayer;
    heatmapLayerRef.current = heatmapLayer;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    let newUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    let attribution = '&copy; CARTO';

    if (tileLayerType === 'satellite') {
      newUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = '&copy; Esri &copy; Earthstar Geographics';
    } else if (tileLayerType === 'street') {
      newUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      attribution = '&copy; OpenStreetMap';
    }

    L.tileLayer(newUrl, { attribution, maxZoom: 19 }).addTo(map);
  }, [tileLayerType]);

  // Filtered Incidents
  const filteredIncidents = incidents.filter((inc) => {
    if (selectedWard !== 'all' && !inc.ward.toLowerCase().includes(selectedWard.toLowerCase())) return false;
    if (selectedSeverity !== 'all' && inc.severity !== selectedSeverity) return false;
    if (selectedDepartment !== 'all' && inc.department !== selectedDepartment) return false;
    if (selectedStatus !== 'all' && inc.status !== selectedStatus) return false;
    return true;
  });

  // Render Map Markers & Layers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    const wardsLayer = wardsLayerRef.current;
    const heatmapLayer = heatmapLayerRef.current;

    if (!map || !markersLayer || !wardsLayer || !heatmapLayer) return;

    markersLayer.clearLayers();
    wardsLayer.clearLayers();
    heatmapLayer.clearLayers();

    // Render incident density circles from live records.
    if (showHeatmap) {
      filteredIncidents.forEach((inc) => {
        const radius = inc.severity === 'Critical' ? 180 : inc.severity === 'High' ? 120 : 80;
        const color = inc.severity === 'Critical' ? '#ef4444' : inc.severity === 'High' ? '#f59e0b' : '#3b82f6';

        const circle = L.circle([inc.latitude, inc.longitude], {
          radius: radius,
          fillColor: color,
          fillOpacity: 0.18,
          stroke: false,
        });
        heatmapLayer.addLayer(circle);
      });
    }

    // Render incident markers from live records.
    if (showMarkers) {
      filteredIncidents.forEach((inc) => {
        const color =
          inc.severity === 'Critical' ? '#ef4444' :
          inc.severity === 'High' ? '#f59e0b' :
          inc.severity === 'Medium' ? '#3b82f6' : '#10b981';

        const customIcon = L.divIcon({
          className: 'custom-map-pin',
          html: `
            <div style="
              background: #0f172a;
              border: 2px solid ${color};
              box-shadow: 0 0 10px ${color}80;
              width: 24px;
              height: 24px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 10px;
              font-weight: bold;
              cursor: pointer;
            ">
              <span style="background: ${color}; width: 8px; height: 8px; border-radius: 50%;"></span>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker([inc.latitude, inc.longitude], { icon: customIcon });

        const popupContent = `
          <div style="font-family: inherit; width: 220px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-size: 10px; font-weight: bold; color: #38bdf8;">${inc.id}</span>
              <span style="font-size: 9px; font-weight: bold; background: ${color}20; color: ${color}; padding: 2px 6px; border-radius: 4px; border: 1px solid ${color}40;">
                ${inc.severity}
              </span>
            </div>
            <h4 style="font-size: 12px; font-weight: bold; color: #fff; margin: 0 0 4px 0;">${inc.title}</h4>
            <p style="font-size: 11px; color: #94a3b8; margin: 0 0 6px 0;">${inc.address}</p>
            <div style="font-size: 10px; color: #c084fc; margin-bottom: 8px;">
              ⚡ Merged: <strong>${inc.duplicateCount} citizen reports</strong>
            </div>
            <div style="display: flex; gap: 6px;">
              <button id="view-incident-btn-${inc.id}" style="
                flex: 1;
                background: #2563eb;
                color: white;
                border: none;
                padding: 5px 8px;
                border-radius: 6px;
                font-size: 10px;
                font-weight: bold;
                cursor: pointer;
              ">View Case</button>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('popupopen', () => {
          const btn = document.getElementById(`view-incident-btn-${inc.id}`);
          if (btn) {
            btn.onclick = () => {
              onSelectIncident(inc);
            };
          }
        });

        markersLayer.addLayer(marker);
      });
    }

  }, [filteredIncidents, showWards, showHeatmap, showMarkers, selectedWard]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-cyan-400 border border-cyan-500/30">
              GIS SPATIAL TELEMETRY
            </span>
            <span className="text-xs text-slate-400">Live incident records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-heading">
            Live City GIS Heatmap & Ward Triage
          </h1>
        </div>

        {/* Layer Toggles & Map Basemap Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Tile Switcher */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setTileLayerType('dark')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                tileLayerType === 'dark' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Dark Canvas
            </button>
            <button
              onClick={() => setTileLayerType('satellite')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                tileLayerType === 'satellite' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setTileLayerType('street')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                tileLayerType === 'street' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Street
            </button>
          </div>

          {/* Layer toggles */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center space-x-1.5 transition ${
              showHeatmap ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Heatmap</span>
          </button>

          <button
            onClick={() => setShowWards(!showWards)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center space-x-1.5 transition ${
              showWards ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Wards</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel p-3.5 rounded-2xl border border-slate-800 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 text-xs">
        
        {/* Ward Filter */}
        <div>
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
            Ward Region
          </label>
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">All Wards (Metropolis)</option>
            <option value="">Ward filters become available when ward records are configured.</option>
          </select>
        </div>

        {/* Severity Filter */}
        <div>
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
            Severity Grade
          </label>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">All Severities</option>
            <option value="Critical">🔴 Critical (Immediate)</option>
            <option value="High">🟠 High Priority</option>
            <option value="Medium">🔵 Medium</option>
            <option value="Low">🟢 Low</option>
          </select>
        </div>

        {/* Department Filter */}
        <div>
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
            Department
          </label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">All Departments</option>
            {Array.from(new Set(incidents.map((incident) => incident.department).filter(Boolean))).map((department) => <option key={department} value={department}>{department}</option>)}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
            Case Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending Triage</option>
            <option value="Assigned">Assigned to Officer</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved & Verified</option>
          </select>
        </div>

        {/* Filter Reset */}
        <div className="flex items-end">
          <button
            onClick={() => {
              setSelectedWard('all');
              setSelectedSeverity('all');
              setSelectedDepartment('all');
              setSelectedStatus('all');
              mapInstanceRef.current?.flyTo([37.7749, -122.4194], 13);
            }}
            className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs flex items-center justify-center space-x-1 transition"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Spatial Filter</span>
          </button>
        </div>
      </div>

      {/* Map Canvas + Ward Quick Telemetry Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: GIS Map Viewport (8 cols) */}
        <div className="lg:col-span-8 glass-panel p-2 rounded-2xl border border-slate-800 relative overflow-hidden shadow-2xl">
          <div
            ref={mapContainerRef}
            className="w-full h-[600px] rounded-xl overflow-hidden z-0"
          />

          {/* Floating Stats Badge */}
          <div className="absolute top-4 left-4 z-10 glass-panel-glow px-3 py-2 rounded-xl text-xs flex items-center space-x-3 pointer-events-none">
            <div className="flex items-center space-x-1.5 text-cyan-400 font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>{filteredIncidents.length} Rendered Incidents</span>
            </div>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">
              Critical Density: <strong className="text-rose-400 font-mono">{filteredIncidents.filter(i => i.severity === 'Critical').length}</strong>
            </span>
          </div>
        </div>

        {/* Right: Ward Risk Matrix & Quick Navigator (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2 font-heading">
                <Navigation className="w-4 h-4 text-cyan-400" />
                <span>Ward Risk Index & Navigation</span>
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">LIVE RECORDS</span>
            </div>

            <div className="space-y-2 max-h-[510px] overflow-y-auto pr-1">
              {filteredIncidents.length === 0 ? <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center text-xs text-slate-500">No incidents to display.</div> : <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-400">{filteredIncidents.length} incident records match the current filters.</div>}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
