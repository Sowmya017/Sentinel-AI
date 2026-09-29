import React, { useState } from 'react';
import {
  Video,
  AlertTriangle,
  Car,
  FileText,
  Cpu,
  Settings as SettingsIcon,
  ArrowLeft,
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  Clock,
  Database,
  Key,
  Eye,
  Crosshair,
  Camera,
  Maximize2,
  Flame,
  Radio,
  Lock,
  Send,
  Bot,
  ShieldCheck,
  Activity,
  ExternalLink,
} from 'lucide-react';
import {
  BLUEPRINT_20_MEMORIES,
  BLUEPRINT_TARGET_VEHICLE,
  BLUEPRINT_CONTEXT_RULES,
  BLUEPRINT_LIVE_PAYLOAD,
  BLUEPRINT_SAMPLE_AI_ASSESSMENT,
} from '../../data/blueprintData';
import { fetchAllEvents, sendChatMessage } from '../../services/api';

const formatBackendEventToMemory = (evt: any) => ({
  id: evt.id,
  date: new Date(evt.timestamp).toLocaleDateString(),
  time: new Date(evt.timestamp).toLocaleTimeString(),
  timestampStr: new Date(evt.timestamp).toLocaleString(),
  category: evt.severity === 'critical' ? 'threat' : (evt.severity === 'high' ? 'anomaly' : 'routine'),
  isThreatTarget: evt.severity === 'critical' || evt.severity === 'high',
  content: evt.description ?? evt.title,
  sensor: evt.source,
  licensePlate: evt.affectedAssets?.[0],
  details: evt.description,
});

interface PageViewProps {
  onBackToCommandCenter: () => void;
}

/* ─────────────────────────────────────────────────────────
   2. LIVE SURVEILLANCE
───────────────────────────────────────────────────────── */
export const LiveSurveillanceView: React.FC<PageViewProps> = ({ onBackToCommandCenter }) => {
  const [activeCam, setActiveCam] = useState('CAM_SOUTH_DOCK');
  const [visionMode, setVisionMode] = useState<'thermal' | 'night' | 'optical'>('thermal');

  const cameras = [
    { id: 'CAM_SOUTH_DOCK',     label: 'South Dock',      zone: 'Restricted', alert: true,  fps: 30 },
    { id: 'CAM_NORTH_GATE',     label: 'North Gate',      zone: 'Entry',      alert: false, fps: 30 },
    { id: 'CAM_PERIMETER_EAST', label: 'Perimeter East',  zone: 'Perimeter',  alert: false, fps: 25 },
    { id: 'CAM_WEST_02',        label: 'West Blindspot',  zone: 'Perimeter',  alert: false, fps: 25 },
  ];

  const active = cameras.find((c) => c.id === activeCam) ?? cameras[0];

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-[#F6F8FB] p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={onBackToCommandCenter}
              className="text-[12px] text-[#336FEE] hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" /> Dashboard
            </button>
            <ChevronRight className="w-3 h-3 text-[#C8D4E0]" />
            <span className="text-[12px] text-[#8A97A8]">Surveillance</span>
          </div>
          <h2 className="m-0">Live Surveillance</h2>
        </div>
        <span className="badge-red shrink-0">1 Alert Active</span>
      </div>

      {/* Camera grid + detail */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Camera grid */}
        <div className="xl:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {cameras.map((cam) => (
              <button
                key={cam.id}
                onClick={() => setActiveCam(cam.id)}
                className={`card text-left overflow-hidden border transition-all ${
                  activeCam === cam.id ? 'border-[#336FEE] ring-2 ring-[#BFDBFE]' : 'border-[#E3E8EF] hover:border-[#C8D4E0]'
                }`}
              >
                {/* Mock feed */}
                <div
                  className={`h-32 flex items-center justify-center relative ${
                    cam.alert
                      ? visionMode === 'thermal'
                        ? 'bg-gradient-to-b from-[#18080f] to-[#0b0308]'
                        : 'bg-gradient-to-b from-[#0b101d] to-[#070b13]'
                      : 'bg-[#1a2035]'
                  }`}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:20px_20px]" />
                  {cam.alert && (
                    <>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-full h-full opacity-60" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
                          <rect x="80" y="70" width="130" height="65" rx="5" fill={visionMode==='thermal'?'#f43f5e':'#94a3b8'} opacity="0.8" />
                          <circle cx="105" cy="135" r="12" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                          <circle cx="195" cy="135" r="12" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                        </svg>
                      </div>
                      <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 px-1.5 py-0.5 rounded text-[9px] text-[#D93025] font-bold border border-[#D93025]/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D93025] dot-live" /> ALERT
                      </div>
                    </>
                  )}
                  {!cam.alert && (
                    <div className="text-center">
                      <Video className="w-6 h-6 text-white/20 mx-auto" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 text-[9px] font-medium text-white/60 bg-black/50 px-1.5 py-px rounded">
                    1080p / {cam.fps}fps
                  </div>
                  {cam.alert && (
                    <div className="absolute bottom-2 right-2 text-[9px] text-white/60 bg-[#D93025]/70 px-1.5 py-px rounded font-bold">
                      ● REC
                    </div>
                  )}
                </div>
                <div className="px-3 py-2 flex items-center justify-between">
                  <div>
                    <div className="text-[12px] font-semibold text-[#172033]">{cam.label}</div>
                    <div className="text-[10.5px] text-[#8A97A8]">{cam.zone}</div>
                  </div>
                  {cam.alert
                    ? <span className="badge-red">Alert</span>
                    : <span className="badge-green">Clear</span>
                  }
                </div>
              </button>
            ))}
          </div>

          {/* Vision mode */}
          <div className="card p-3 flex items-center justify-between gap-3">
            <span className="text-[12px] text-[#4A5568] font-medium">Camera Mode</span>
            <div className="flex items-center gap-1 bg-[#F6F8FB] border border-[#E3E8EF] rounded-lg p-1">
              {([
                { mode: 'thermal', label: 'FLIR Thermal', icon: Flame },
                { mode: 'night',   label: 'IR Night',     icon: Eye },
                { mode: 'optical', label: 'Optical',      icon: Video },
              ] as const).map(({ mode, label, icon: Icon }) => (
                <button
                  key={mode}
                  onClick={() => setVisionMode(mode)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[12px] font-medium transition-all ${
                    visionMode === mode
                      ? 'bg-white text-[#172033] shadow-sm border border-[#E3E8EF]'
                      : 'text-[#8A97A8] hover:text-[#4A5568]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active camera detail */}
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E3E8EF] flex items-center justify-between">
            <h3 className="m-0 text-[13.5px]">{active.label}</h3>
            <div className="flex gap-1">
              <button className="p-1.5 rounded hover:bg-[#F6F8FB] text-[#8A97A8] transition-colors"><Crosshair className="w-3.5 h-3.5" /></button>
              <button className="p-1.5 rounded hover:bg-[#F6F8FB] text-[#8A97A8] transition-colors"><Camera className="w-3.5 h-3.5" /></button>
              <button className="p-1.5 rounded hover:bg-[#F6F8FB] text-[#8A97A8] transition-colors"><Maximize2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>

          {active.alert ? (
            <div className="p-4 space-y-3">
              <div className="p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA]">
                <div className="text-[11px] font-semibold text-[#D93025] mb-1">Target Detected</div>
                <div className="text-[13px] font-bold text-[#172033]">{BLUEPRINT_LIVE_PAYLOAD.object_data.license_plate}</div>
                <div className="text-[11.5px] text-[#4A5568] mt-0.5">
                  {BLUEPRINT_LIVE_PAYLOAD.object_data.color} {BLUEPRINT_LIVE_PAYLOAD.object_data.class}
                </div>
              </div>

              {[
                { label: 'Confidence', value: `${(BLUEPRINT_LIVE_PAYLOAD.object_data.confidence_score * 100).toFixed(0)}%` },
                { label: 'Speed', value: `${BLUEPRINT_LIVE_PAYLOAD.telemetry.speed_kmh.toFixed(1)} km/h` },
                { label: 'Clearance', value: BLUEPRINT_LIVE_PAYLOAD.telemetry.clearance_level, red: true },
                { label: 'Headlights', value: BLUEPRINT_LIVE_PAYLOAD.telemetry.headlights, red: true },
                { label: 'Thermal', value: BLUEPRINT_LIVE_PAYLOAD.telemetry.thermal_status },
                { label: 'Camera', value: BLUEPRINT_LIVE_PAYLOAD.sensor_id },
              ].map(({ label, value, red }) => (
                <div key={label} className="flex items-center justify-between text-[12.5px]">
                  <span className="text-[#8A97A8]">{label}</span>
                  <span className={`font-medium ${red ? 'text-[#D93025]' : 'text-[#172033]'}`}>{value}</span>
                </div>
              ))}

              <div className="text-[11.5px] text-[#8A97A8] border-t border-[#E3E8EF] pt-3">
                PTZ: 042°/14° · FLIR 85mm · 12°58'N 77°35'E
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-[#8A97A8]">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-[#1A7D4F]" />
              <div className="text-[13px] font-medium text-[#172033]">All Clear</div>
              <div className="text-[11.5px] mt-1">No anomalies detected · Zone {active.zone}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   3. THREAT CENTER
───────────────────────────────────────────────────────── */
export const ThreatCenterView: React.FC<PageViewProps> = ({ onBackToCommandCenter }) => {
  const [selectedId, setSelectedId] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [isLive, setIsLive] = useState(false);

  React.useEffect(() => {
    fetchAllEvents().then(res => {
      setEvents(res.events);
      setIsLive(true);
      if (res.events.length > 0) setSelectedId(res.events[0].id);
    }).catch(err => {
      setIsLive(false);
      setSelectedId(3); // Mock ID
    });
  }, []);

  const sourceData = BLUEPRINT_20_MEMORIES;

  const threats = sourceData.filter((m) => m.isThreatTarget || m.category === 'threat').map((m) => ({
    id: m.id,
    time: m.timestampStr,
    camera: m.sensor ?? 'CAM_SURVEILLANCE',
    plate: m.licensePlate ?? 'KA-04-XYZ',
    description: m.details ?? m.content,
    severity: 'Critical',
  }));

  const selected = threats.find((t) => t.id === selectedId);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-[#F6F8FB] p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button onClick={onBackToCommandCenter} className="text-[12px] text-[#336FEE] hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Dashboard
            </button>
            <ChevronRight className="w-3 h-3 text-[#C8D4E0]" />
            <span className="text-[12px] text-[#8A97A8]">Threat Center</span>
          </div>
          <h2 className="m-0">Threat Center {!isLive && <span className="text-sm font-normal text-gray-500">(Demo Mode)</span>}</h2>
        </div>
        <span className="badge-red">{threats.length} Critical Incidents</span>
      </div>

      {/* Context rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {BLUEPRINT_CONTEXT_RULES.map((rule) => (
          <div key={rule.id} className="card p-4 border-[#FECACA]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-[#8A97A8]">{rule.id}</span>
              <span className="badge-red">{rule.severity}</span>
            </div>
            <p className="text-[12.5px] text-[#172033] leading-relaxed m-0">"{rule.rule}"</p>
            <div className="mt-2 text-[11px] text-[#D93025] font-medium">
              Status: {rule.status} — Matched KA-04-XYZ at South Dock
            </div>
          </div>
        ))}
      </div>

      {/* Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 card overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E3E8EF]">
            <h3 className="m-0 text-[13.5px]">Incidents — KA-04-XYZ</h3>
          </div>
          <div className="divide-y divide-[#E3E8EF]">
            {threats.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedId(t.id)}
                className={`w-full text-left px-4 py-3 transition-colors hover:bg-[#F6F8FB] flex items-start gap-3 ${selectedId === t.id ? 'bg-[#EFF6FF]' : ''}`}
              >
                <AlertTriangle className="w-4 h-4 text-[#D93025] mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-[12.5px] font-semibold text-[#172033] flex items-center gap-2">
                    {t.time}
                    {selectedId === t.id && <ChevronRight className="w-3 h-3 text-[#336FEE]" />}
                  </div>
                  <div className="text-[11.5px] text-[#336FEE]">{t.camera}</div>
                  <div className="text-[11.5px] text-[#4A5568] mt-0.5 line-clamp-2">{t.description}</div>
                </div>
                <span className="badge-red shrink-0">{t.severity}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-2 card p-4">
          {selected ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="m-0">Incident Detail</h3>
                <span className="badge-red">Critical</span>
              </div>
              {[
                { label: 'Time', value: selected.time },
                { label: 'Camera', value: selected.camera },
                { label: 'Plate', value: selected.plate },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="text-[10.5px] text-[#8A97A8] font-medium mb-0.5">{label}</div>
                  <div className="text-[13px] text-[#172033] font-medium">{value}</div>
                </div>
              ))}
              <div>
                <div className="text-[10.5px] text-[#8A97A8] font-medium mb-0.5">Description</div>
                <p className="text-[12.5px] text-[#4A5568] leading-relaxed m-0">{selected.description}</p>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-[#8A97A8] text-[12.5px]">
              Select an incident to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   4. VEHICLE INTELLIGENCE
───────────────────────────────────────────────────────── */
export const VehicleIntelligenceView: React.FC<PageViewProps> = ({ onBackToCommandCenter }) => {
  const [events, setEvents] = useState<any[]>([]);
  const [isLive, setIsLive] = useState(false);

  React.useEffect(() => {
    fetchAllEvents().then(res => {
      setEvents(res.events);
      setIsLive(true);
    }).catch(err => {
      setIsLive(false);
    });
  }, []);

  const sourceData = BLUEPRINT_20_MEMORIES;
  const timeline = sourceData.filter((m) => m.isThreatTarget);
  const vehicle = BLUEPRINT_TARGET_VEHICLE;

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-[#F6F8FB] p-5 space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <button onClick={onBackToCommandCenter} className="text-[12px] text-[#336FEE] hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Dashboard
          </button>
          <ChevronRight className="w-3 h-3 text-[#C8D4E0]" />
          <span className="text-[12px] text-[#8A97A8]">Vehicle Intelligence</span>
        </div>
        <h2 className="m-0">Vehicle Intelligence {!isLive && <span className="text-sm font-normal text-gray-500">(Demo Mode)</span>}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Profile */}
        <div className="space-y-4">
          <div className="card p-4">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center shrink-0">
                <Car className="w-6 h-6 text-[#D93025]" />
              </div>
              <div>
                <div className="text-xl font-bold text-[#172033] font-mono">KA-04-XYZ</div>
                <span className="badge-red mt-1 inline-block">High-Risk Recon</span>
              </div>
            </div>
            <div className="space-y-2.5">
              {[
                { label: 'Vehicle',  value: vehicle?.makeModel ?? 'Commercial Van (White)' },
                { label: 'Sightings', value: `${timeline.length} incidents (4 days)` },
                { label: 'First seen', value: 'Sept 25, 02:14 AM' },
                { label: 'Last seen',  value: 'Sept 28, 23:15 PM · South Dock' },
                { label: 'Threat class', value: 'Reconnaissance', red: true },
              ].map(({ label, value, red }) => (
                <div key={label} className="flex justify-between gap-4 text-[12.5px]">
                  <span className="text-[#8A97A8] shrink-0">{label}</span>
                  <span className={`font-medium text-right ${red ? 'text-[#D93025]' : 'text-[#172033]'}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detection snapshot */}
          <div className="card p-4">
            <h3 className="m-0 mb-3 text-[13px]">Latest Detection</h3>
            <div className="space-y-2">
              {[
                { k: 'Camera',    v: BLUEPRINT_LIVE_PAYLOAD.sensor_id },
                { k: 'Confidence', v: `${(BLUEPRINT_LIVE_PAYLOAD.object_data.confidence_score * 100).toFixed(0)}%` },
                { k: 'Speed',     v: `${BLUEPRINT_LIVE_PAYLOAD.telemetry.speed_kmh.toFixed(1)} km/h` },
                { k: 'Thermal',   v: BLUEPRINT_LIVE_PAYLOAD.telemetry.thermal_status },
                { k: 'Headlights', v: BLUEPRINT_LIVE_PAYLOAD.telemetry.headlights, red: true },
              ].map(({ k, v, red }) => (
                <div key={k} className="flex justify-between text-[12.5px]">
                  <span className="text-[#8A97A8]">{k}</span>
                  <span className={`font-medium ${red ? 'text-[#D93025]' : 'text-[#172033]'}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pattern of Life timeline */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E3E8EF] flex items-center justify-between">
            <h3 className="m-0">Pattern of Life Timeline</h3>
            <span className="text-[11px] text-[#8A97A8]">{timeline.length} recorded events</span>
          </div>
          <div className="p-4 space-y-0">
            {timeline.map((evt, idx) => (
              <div key={evt.id} className="flex gap-4 relative">
                {/* Timeline line */}
                <div className="flex flex-col items-center shrink-0 w-6">
                  <div className={`w-3 h-3 rounded-full border-2 shrink-0 mt-1 ${
                    idx === timeline.length - 1
                      ? 'border-[#D93025] bg-[#D93025]'
                      : 'border-[#C4760E] bg-white'
                  }`} />
                  {idx < timeline.length - 1 && (
                    <div className="w-px flex-1 bg-[#E3E8EF] mt-1 mb-1" style={{ minHeight: 32 }} />
                  )}
                </div>
                {/* Content */}
                <div className={`flex-1 pb-4 ${idx === timeline.length - 1 ? 'pb-0' : ''}`}>
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-[12px] font-semibold text-[#172033]">{evt.timestampStr}</span>
                    {evt.sensor && (
                      <span className="text-[11px] text-[#336FEE] bg-[#EFF6FF] px-1.5 py-px rounded">{evt.sensor}</span>
                    )}
                    {idx === timeline.length - 1 && (
                      <span className="badge-red">Now</span>
                    )}
                  </div>
                  <p className="text-[12.5px] text-[#4A5568] m-0 leading-relaxed">
                    {evt.details ?? evt.content.substring(evt.content.indexOf(':') + 2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   5. EVENT LOG
───────────────────────────────────────────────────────── */
export const EventLogView: React.FC<PageViewProps> = ({ onBackToCommandCenter }) => {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [isLive, setIsLive] = useState(false);

  React.useEffect(() => {
    fetchAllEvents().then(res => {
      setEvents(res.events);
      setIsLive(true);
    }).catch(err => {
      setIsLive(false);
    });
  }, []);

  const sourceData = isLive ? events.map(formatBackendEventToMemory) : BLUEPRINT_20_MEMORIES;

  const filtered = sourceData.filter((m) =>
    !query ||
    m.content.toLowerCase().includes(query.toLowerCase()) ||
    (m.licensePlate ?? '').toLowerCase().includes(query.toLowerCase()) ||
    (m.sensor ?? '').toLowerCase().includes(query.toLowerCase())
  );

  const selected = filtered.find((m) => m.id === selectedId);

  const catStyle: Record<string, string> = {
    threat:    'badge-red',
    anomaly:   'badge-amber',
    delivery:  'badge-blue',
    routine:   'badge-green',
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#F6F8FB]">
      {/* Page header */}
      <div className="p-5 pb-4 border-b border-[#E3E8EF] bg-white shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <button onClick={onBackToCommandCenter} className="text-[12px] text-[#336FEE] hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Dashboard
          </button>
          <ChevronRight className="w-3 h-3 text-[#C8D4E0]" />
          <span className="text-[12px] text-[#8A97A8]">Event Log</span>
        </div>
        <div className="flex items-center justify-between gap-3 mt-3">
          <h2 className="m-0">Event Log {!isLive && <span className="text-sm font-normal text-gray-500">(Demo Mode)</span>}</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-[#8A97A8]" />
              <input
                type="text"
                placeholder="Search events, plates, cameras…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-[12.5px] border border-[#E3E8EF] rounded-lg bg-[#F6F8FB] text-[#172033] placeholder-[#8A97A8] focus:outline-none focus:border-[#336FEE] w-60"
              />
            </div>
            <button className="btn-ghost text-[12.5px] py-1.5">
              <Filter className="w-3.5 h-3.5" /> Filter
            </button>
          </div>
        </div>
      </div>

      {/* Table + drawer */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Table */}
        <div className={`flex-1 overflow-y-auto ${selectedId ? 'hidden lg:block' : ''}`}>
          <table className="data-table">
            <thead className="sticky top-0 z-10">
              <tr>
                <th>ID</th>
                <th>Date &amp; Time</th>
                <th>Camera / Sensor</th>
                <th>Plate</th>
                <th>Category</th>
                <th>Summary</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr
                  key={m.id}
                  onClick={() => setSelectedId(m.id === selectedId ? null : m.id)}
                  className={`cursor-pointer ${selectedId === m.id ? 'bg-[#EFF6FF]' : ''}`}
                >
                  <td className="font-mono text-[11.5px] text-[#8A97A8]">#{m.id}</td>
                  <td className="whitespace-nowrap font-mono text-[11.5px]">{m.timestampStr}</td>
                  <td className="text-[#336FEE] whitespace-nowrap">{m.sensor ?? '—'}</td>
                  <td className="font-mono font-medium">{m.licensePlate ?? '—'}</td>
                  <td><span className={catStyle[m.category] ?? 'badge-blue'}>{m.category}</span></td>
                  <td className="max-w-xs">
                    <span className="line-clamp-1">{m.details ?? m.content.slice(0, 70)}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-[#8A97A8] py-10">No results</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Detail drawer */}
        {selected && (
          <div className="w-full lg:w-80 shrink-0 border-l border-[#E3E8EF] bg-white overflow-y-auto p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="m-0">Event #{selected.id}</h3>
              <button
                onClick={() => setSelectedId(null)}
                className="text-[#8A97A8] hover:text-[#172033] p-1 rounded hover:bg-[#F6F8FB]"
              >
                ✕
              </button>
            </div>
            {[
              { label: 'Date',     value: selected.timestampStr },
              { label: 'Camera',   value: selected.sensor ?? '—' },
              { label: 'Plate',    value: selected.licensePlate ?? '—' },
              { label: 'Category', value: selected.category },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="text-[10.5px] text-[#8A97A8] font-medium mb-0.5">{label}</div>
                <div className="text-[13px] text-[#172033] font-medium">{value}</div>
              </div>
            ))}
            <div>
              <div className="text-[10.5px] text-[#8A97A8] font-medium mb-1">Full Log</div>
              <p className="text-[12.5px] text-[#4A5568] leading-relaxed m-0">{selected.content}</p>
            </div>
            {selected.isThreatTarget && (
              <div className="p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA]">
                <div className="text-[11px] font-semibold text-[#D93025]">⚠ Threat Target</div>
                <div className="text-[11.5px] text-[#4A5568] mt-0.5">This event is part of the KA-04-XYZ reconnaissance pattern.</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   6. AI INVESTIGATION
───────────────────────────────────────────────────────── */
interface AiMessage {
  id: string;
  role: 'operator' | 'ai';
  text: string;
  time: string;
  isAlert?: boolean;
  memories?: string[];
  actions?: string[];
}

export const AiInvestigationView: React.FC<PageViewProps> = ({ onBackToCommandCenter }) => {
  const [messages, setMessages] = useState<AiMessage[]>([
    {
      id: 'init',
      role: 'ai',
      text: 'Sentinel-AI is ready. I have loaded 20 historical pattern-of-life logs into the Hindsight memory store. Ask me to assess vehicle threats, recall surveillance history, or explain facility rules.',
      time: '23:14:50',
    },
    {
      id: 'op1',
      role: 'operator',
      text: 'Assess threat level for KA-04-XYZ.',
      time: '23:15:10',
    },
    {
      id: 'ai1',
      role: 'ai',
      text: BLUEPRINT_SAMPLE_AI_ASSESSMENT,
      time: '23:15:12',
      isAlert: true,
      memories: [
        'Sept 25, 02:14 · North Gate — Stationary 22 min, engine idling at 2 AM.',
        'Sept 26, 01:15 · Perimeter East — Fence-line crawl at 12 km/h (zone limit: 40).',
        'Sept 26, 01:17 · Access Point Bravo — Paused 45 s, fled on patrol approach.',
        'Sept 27, 03:30 · West Blindspot — 18 min in camera dead zone.',
        'Sept 28, 01:10 · North Gate — Transit with headlights off.',
        'Sept 28, 23:15 · South Dock — Engine idling, headlights off. Current event.',
      ],
      actions: ['Dispatch Intercept Squad', 'Seal South Dock Gate', 'Flag KA-04-XYZ as High-Risk'],
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [dispatched, setDispatched] = useState(false);
  const [locked, setLocked] = useState(false);

  const bottomRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const send = async (text?: string) => {
    const q = (text ?? input).trim();
    if (!q || loading) return;
    const op: AiMessage = { id: `op-${Date.now()}`, role: 'operator', text: q, time: new Date().toLocaleTimeString('en-US', { hour12: false }) };
    const currentMessages = [...messages, op];
    setMessages(currentMessages);
    setInput('');
    setLoading(true);

    try {
      // Map previous turns to backend expected history format
      const history = messages.map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text }));
      const response = await sendChatMessage(q, history);
      
      const ai: AiMessage = { 
        id: `ai-${Date.now()}`, 
        role: 'ai', 
        text: response.reply, 
        time: new Date().toLocaleTimeString('en-US', { hour12: false }), 
        isAlert: false, 
        memories: response.sources?.map((s: any) => s.text) || [], 
        actions: [] 
      };
      setMessages((p) => [...p, ai]);
    } catch (error) {
      console.error('Chat API failed', error);
      const errMessage: AiMessage = { id: `err-${Date.now()}`, role: 'ai', text: 'Error connecting to Sentinel-AI backend. Please check network.', time: new Date().toLocaleTimeString('en-US', { hour12: false }) };
      setMessages((p) => [...p, errMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#F6F8FB] overflow-hidden">
      {/* Page header */}
      <div className="px-5 py-4 border-b border-[#E3E8EF] bg-white shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <button onClick={onBackToCommandCenter} className="text-[12px] text-[#336FEE] hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Dashboard
          </button>
          <ChevronRight className="w-3 h-3 text-[#C8D4E0]" />
          <span className="text-[12px] text-[#8A97A8]">AI Investigation</span>
        </div>
        <div className="flex items-center justify-between gap-3 mt-1">
          <h2 className="m-0 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#6F32ED]" />
            AI Investigation
          </h2>
          <div className="flex items-center gap-2 text-[11.5px] text-[#8A97A8]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1A7D4F] dot-live" />
            Groq LLM · 20 memories loaded
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">

        {/* Context sidebar */}
        <div className="lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r border-[#E3E8EF] bg-white overflow-y-auto">
          <div className="p-4 space-y-4">
            <div>
              <div className="section-title">Investigation Subject</div>
              <div className="card p-3 border-[#FECACA]">
                <div className="flex items-center gap-2 mb-2">
                  <Car className="w-4 h-4 text-[#D93025]" />
                  <span className="font-bold text-[#172033]">KA-04-XYZ</span>
                  <span className="badge-red ml-auto">Critical</span>
                </div>
                <div className="text-[11.5px] text-[#4A5568] space-y-1">
                  <div>Commercial Van · White</div>
                  <div>6 threat incidents · 4 days</div>
                  <div className="text-[#D93025] font-medium">South Dock · 23:15 PM</div>
                </div>
              </div>
            </div>

            <div>
              <div className="section-title">Context Rules</div>
              <div className="space-y-2">
                {BLUEPRINT_CONTEXT_RULES.map((r) => (
                  <div key={r.id} className="p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-[#8A97A8]">{r.id}</span>
                      <span className="badge-red">{r.severity}</span>
                    </div>
                    <p className="text-[11.5px] text-[#4A5568] m-0 leading-relaxed">{r.rule.slice(0, 90)}…</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="section-title">Quick Prompts</div>
              <div className="space-y-1.5">
                {[
                  'Assess threat level for KA-04-XYZ.',
                  'Show pattern-of-life timeline for KA-04-XYZ',
                  'What rules has KA-04-XYZ violated?',
                  'Check South Dock perimeter rules',
                ].map((p, i) => (
                  <button
                    key={i}
                    onClick={() => send(p)}
                    className="w-full text-left text-[12px] text-[#4A5568] px-3 py-2 rounded-lg bg-[#F6F8FB] border border-[#E3E8EF] hover:border-[#336FEE] hover:text-[#336FEE] transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-4 bg-[#F6F8FB]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'operator' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] space-y-2`}>
                  <div className={`text-[10.5px] text-[#8A97A8] ${msg.role === 'operator' ? 'text-right' : ''}`}>
                    {msg.role === 'operator' ? 'Operator' : 'Sentinel-AI'} · {msg.time}
                  </div>

                  <div className={`rounded-xl p-3.5 text-[13px] leading-relaxed ${
                    msg.role === 'operator'
                      ? 'bg-[#336FEE] text-white rounded-tr-sm'
                      : msg.isAlert
                      ? 'bg-white border border-[#FECACA] rounded-tl-sm shadow-sm'
                      : 'bg-white border border-[#E3E8EF] rounded-tl-sm shadow-sm'
                  }`}>
                    {msg.isAlert && (
                      <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-[#FECACA] text-[#D93025] text-[11.5px] font-semibold">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Critical Pattern-of-Life Alert
                      </div>
                    )}
                    <div className={`whitespace-pre-line ${msg.role === 'operator' ? 'text-white' : 'text-[#172033]'}`}>
                      {msg.text}
                    </div>

                    {msg.memories && msg.memories.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-[#E3E8EF]">
                        <div className="text-[10.5px] font-semibold text-[#8A97A8] mb-2 flex items-center gap-1.5">
                          <ShieldCheck className="w-3 h-3" /> Recalled Evidence ({msg.memories.length})
                        </div>
                        <ul className="space-y-1">
                          {msg.memories.map((m, i) => (
                            <li key={i} className="text-[11.5px] text-[#4A5568] flex gap-1.5">
                              <span className="text-[#C4760E] mt-0.5 shrink-0">—</span>
                              {m}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {msg.actions && msg.actions.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-[#E3E8EF] flex flex-wrap gap-2">
                        <button
                          onClick={() => { setDispatched(true); setTimeout(() => setDispatched(false), 5000); }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white transition-colors ${dispatched ? 'bg-[#1A7D4F]' : 'bg-[#D93025] hover:bg-[#B91C1C]'}`}
                        >
                          {dispatched ? <><CheckCircle className="w-3.5 h-3.5" />Dispatched</> : <><Radio className="w-3.5 h-3.5" />Dispatch Intercept</>}
                        </button>
                        <button
                          onClick={() => setLocked((v) => !v)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-colors ${locked ? 'bg-[#FEF2F2] text-[#D93025] border-[#FECACA]' : 'bg-white text-[#4A5568] border-[#E3E8EF] hover:bg-[#F6F8FB]'}`}
                        >
                          <Lock className="w-3.5 h-3.5" />
                          {locked ? 'Dock Sealed' : 'Seal South Dock'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-[#E3E8EF] rounded-xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2 text-[12px] text-[#8A97A8]">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#336FEE] animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                      ))}
                    </div>
                    Querying Hindsight memory…
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="shrink-0 p-4 bg-white border-t border-[#E3E8EF]">
            <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about threats, vehicles, patterns…"
                className="flex-1 min-w-0 px-4 py-2.5 text-[13px] border border-[#E3E8EF] rounded-lg bg-[#F6F8FB] text-[#172033] placeholder-[#8A97A8] focus:outline-none focus:border-[#336FEE] focus:bg-white transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="px-4 py-2.5 rounded-lg text-[13px] font-semibold text-white bg-[#6F32ED] hover:bg-[#5B28C4] disabled:opacity-40 transition-colors active:scale-95 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   7. SETTINGS
───────────────────────────────────────────────────────── */
export const SettingsView: React.FC<PageViewProps> = ({ onBackToCommandCenter }) => (
  <div className="flex-1 min-h-0 overflow-y-auto bg-[#F6F8FB] p-5 space-y-5">
    <div>
      <div className="flex items-center gap-2 mb-1">
        <button onClick={onBackToCommandCenter} className="text-[12px] text-[#336FEE] hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Dashboard
        </button>
        <ChevronRight className="w-3 h-3 text-[#C8D4E0]" />
        <span className="text-[12px] text-[#8A97A8]">Settings</span>
      </div>
      <h2 className="m-0">Settings</h2>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Facility */}
      <div className="card p-5">
        <h3 className="m-0 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#336FEE]" /> Facility Configuration
        </h3>
        <div className="space-y-3">
          {[
            { label: 'Facility Name',  value: 'Sector 4 Defence Hangar' },
            { label: 'Location',       value: '12°58\'24"N 77°35\'44"E' },
            { label: 'Threat Level',   value: 'Defcon 2 — Elevated' },
            { label: 'Active Cameras', value: '4 of 4 online' },
            { label: 'Security Zone',  value: 'Restricted Military' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center py-2 border-b border-[#F0F4F8]">
              <span className="text-[12.5px] text-[#8A97A8]">{label}</span>
              <span className="text-[13px] font-medium text-[#172033]">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* API integrations */}
      <div className="card p-5">
        <h3 className="m-0 mb-4 flex items-center gap-2">
          <Key className="w-4 h-4 text-[#6F32ED]" /> API Integrations
        </h3>
        <div className="space-y-3">
          {[
            { name: 'Groq LLM API',       key: 'gsk_••••••••••••XYZQ',    status: 'Connected' },
            { name: 'Hindsight Memory',    key: 'MEMHACK99',               status: 'Active — 20/20' },
            { name: 'YOLOv5 Detection',    key: 'Local inference (v6.1)', status: 'Running' },
            { name: 'RTSP Camera Stream',  key: '4 endpoints configured',  status: 'All online' },
          ].map(({ name, key, status }) => (
            <div key={name} className="p-3 rounded-lg bg-[#F6F8FB] border border-[#E3E8EF] flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[12.5px] font-semibold text-[#172033]">{name}</div>
                <div className="text-[11px] font-mono text-[#8A97A8] mt-0.5">{key}</div>
              </div>
              <span className="badge-green shrink-0">{status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* System preferences */}
      <div className="card p-5">
        <h3 className="m-0 mb-4 flex items-center gap-2">
          <SettingsIcon className="w-4 h-4 text-[#4A5568]" /> System Preferences
        </h3>
        <div className="space-y-3">
          {[
            { label: 'Detection Confidence Threshold', value: '85%' },
            { label: 'Alert Retention',                value: '30 days' },
            { label: 'Memory Store Size',              value: '1000 logs max' },
            { label: 'Inference Model',                value: 'llama-3-70b-8192' },
            { label: 'Timezone',                       value: 'UTC+5:30 (IST)' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center py-2 border-b border-[#F0F4F8]">
              <span className="text-[12.5px] text-[#8A97A8]">{label}</span>
              <span className="text-[13px] font-medium text-[#172033]">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="card p-5">
        <h3 className="m-0 mb-4 flex items-center gap-2">
          <ExternalLink className="w-4 h-4 text-[#32A8ED]" /> About
        </h3>
        <div className="space-y-2 text-[12.5px] text-[#4A5568]">
          <p className="m-0 leading-relaxed">Sentinel-AI is a real-time pattern-of-life security intelligence platform powered by YOLOv5 object detection, vector memory (Hindsight), and Groq LLM reasoning.</p>
          <p className="m-0 leading-relaxed mt-2">It ingests live camera telemetry, recalls historical patterns, and assists security operators in threat assessment and response.</p>
        </div>
        <div className="mt-4 pt-4 border-t border-[#E3E8EF] grid grid-cols-2 gap-2 text-[11.5px]">
          {[
            ['Version', '1.0.0-hackathon'],
            ['Stack', 'React + Vite + Groq'],
            ['Build', 'Production'],
            ['License', 'Internal Use'],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="text-[#8A97A8]">{k}</div>
              <div className="font-medium text-[#172033]">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
