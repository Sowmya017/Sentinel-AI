import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Camera,
  Car,
  Activity,
  Radio,
  Lock,
  CheckCircle,
  Cpu,
  Database,
} from 'lucide-react';
import { BLUEPRINT_LIVE_PAYLOAD, BLUEPRINT_20_MEMORIES } from '../../data/blueprintData';
import { fetchLatestTelemetry, fetchAllEvents } from '../../services/api';

interface CommandCenterProps {
  onNavigateToVehicle: (plate: string) => void;
  isLockedDown: boolean;
  onToggleLockdown: () => void;
  layoutMode?: 'columns' | 'stacked';
}

const formatBackendEventToMemory = (evt: any) => ({
  id: evt.id,
  time: new Date(evt.timestamp).toLocaleString(),
  camera: evt.source ?? '—',
  description: evt.description ?? evt.title,
  severity: evt.severity === 'critical' ? 'critical' : 'warning',
  plate: evt.affectedAssets?.[0] || undefined,
});

const defaultRecentEvents = BLUEPRINT_20_MEMORIES
  .filter((m) => m.isThreatTarget || m.category === 'threat' || m.category === 'anomaly')
  .slice(0, 6)
  .map((m) => ({
    id: m.id,
    time: m.timestampStr,
    camera: m.sensor ?? '—',
    description: m.details ?? m.content.slice(0, 80),
    severity: m.isThreatTarget ? 'critical' : 'warning',
    plate: m.licensePlate,
  }));

export const CommandCenter: React.FC<CommandCenterProps> = ({
  onNavigateToVehicle,
  isLockedDown,
  onToggleLockdown,
}) => {
  const [dispatched, setDispatched] = useState(false);
  const [telemetry, setTelemetry] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [telemRes, eventsRes] = await Promise.all([
          fetchLatestTelemetry(),
          fetchAllEvents()
        ]);
        setTelemetry(telemRes.telemetry);
        setEvents(eventsRes.events);
        setIsLive(true);
      } catch (error) {
        console.warn('Backend unavailable, using mock data.');
        setIsLive(false);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleDispatch = () => {
    setDispatched(true);
    setTimeout(() => setDispatched(false), 6000);
  };

  const payload = isLive && telemetry ? telemetry : BLUEPRINT_LIVE_PAYLOAD;
  const recentEvents = isLive && events.length > 0
    ? events.filter(e => e.severity === 'critical' || e.severity === 'high' || e.type === 'malware-detection')
        .slice(0, 6)
        .map(formatBackendEventToMemory)
    : defaultRecentEvents;

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-[#F6F8FB] p-5 space-y-5">

      {/* ── Stats row ──────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Active Threats',
            value: '1',
            sub: 'Critical · KA-04-XYZ',
            icon: AlertTriangle,
            color: 'text-[#D93025]',
            bg: 'bg-[#FEF2F2]',
            border: 'border-[#FECACA]',
          },
          {
            label: 'Cameras Online',
            value: '4 / 4',
            sub: 'All feeds nominal',
            icon: Camera,
            color: 'text-[#1A7D4F]',
            bg: 'bg-[#F0FDF4]',
            border: 'border-[#BBF7D0]',
          },
          {
            label: 'Vehicles Flagged',
            value: '1',
            sub: 'Last 7 days',
            icon: Car,
            color: 'text-[#C4760E]',
            bg: 'bg-[#FFFBEB]',
            border: 'border-[#FDE68A]',
          },
          {
            label: 'Events Today',
            value: '6',
            sub: 'Threat pattern detected',
            icon: Activity,
            color: 'text-[#336FEE]',
            bg: 'bg-[#EFF6FF]',
            border: 'border-[#BFDBFE]',
          },
        ].map(({ label, value, sub, icon: Icon, color, bg, border }) => (
          <div key={label} className={`card p-4 border ${border}`}>
            <div className="flex items-start justify-between mb-3">
              <span className="text-[12px] font-medium text-[#8A97A8]">{label}</span>
              <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
            </div>
            <div className={`text-2xl font-bold ${color} mb-1`}>{value}</div>
            <div className="text-[11.5px] text-[#8A97A8]">{sub}</div>
          </div>
        ))}
      </div>

      {/* ── Active threat alert ─────────────────── */}
      <div className="card border-[#FECACA] bg-white overflow-hidden">
        <div className="px-5 py-3 bg-[#FEF2F2] border-b border-[#FECACA] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#D93025] dot-live" />
            <span className="text-[13px] font-semibold text-[#D93025]">
              Active Threat — Immediate Attention Required
              {isLive ? ' (Live Server Data)' : ' (Demo/Simulation Mode)'}
            </span>
          </div>
          <span className="badge-red shrink-0">Defcon 2</span>
        </div>

        <div className="p-5 flex flex-col lg:flex-row gap-6">
          {/* Vehicle info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center shrink-0">
                <Car className="w-6 h-6 text-[#D93025]" />
              </div>
              <div>
                <button
                  onClick={() => onNavigateToVehicle(payload.object_data.license_plate)}
                  className="text-xl font-bold text-[#172033] hover:text-[#336FEE] transition-colors"
                >
                  {payload.object_data.license_plate}
                </button>
                <div className="text-[13px] text-[#4A5568] mt-0.5">
                  {payload.object_data.color} {payload.object_data.class} ·{' '}
                  {(payload.object_data.confidence_score * 100).toFixed(0)}% detection confidence
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Camera', value: payload.sensor_id?.replace('_', ' ') || 'UNKNOWN' },
                { label: 'Speed', value: `${payload.telemetry?.speed_kmh?.toFixed(1) || 0} km/h` },
                { label: 'Clearance', value: payload.telemetry?.clearance_level || 'N/A', red: payload.telemetry?.clearance_level === 'UNAUTHORIZED' },
                { label: 'Headlights', value: payload.telemetry?.headlights || 'UNKNOWN', red: payload.telemetry?.headlights === 'OFF' },
              ].map(({ label, value, red }) => (
                <div key={label} className="bg-[#F6F8FB] rounded-lg p-3 border border-[#E3E8EF]">
                  <div className="text-[10.5px] text-[#8A97A8] font-medium mb-1">{label}</div>
                  <div className={`text-[13px] font-semibold ${red ? 'text-[#D93025]' : 'text-[#172033]'}`}>{value}</div>
                </div>
              ))}
            </div>

            <p className="text-[12.5px] text-[#4A5568] mt-4 leading-relaxed">
              Vehicle KA-04-XYZ has been observed at{' '}
              <strong className="text-[#172033]">6 separate incidents</strong> over 4 days including late-night loitering,
              fence-line probing, blind spot exploitation, and headlights-off stealth transit. Classified as{' '}
              <strong className="text-[#D93025]">High-Risk Reconnaissance</strong>.
            </p>
          </div>

          {/* Action panel */}
          <div className="lg:w-52 shrink-0 flex flex-col gap-2.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8A97A8] mb-1">
              Recommended Actions
            </div>
            <button
              onClick={handleDispatch}
              disabled={dispatched}
              className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-semibold text-white transition-colors ${
                dispatched ? 'bg-[#1A7D4F]' : 'bg-[#D93025] hover:bg-[#B91C1C]'
              }`}
            >
              {dispatched ? (
                <><CheckCircle className="w-4 h-4" />Dispatched</>
              ) : (
                <><Radio className="w-4 h-4" />Dispatch Intercept</>
              )}
            </button>
            <button
              onClick={onToggleLockdown}
              className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium border transition-colors ${
                isLockedDown
                  ? 'bg-[#FEF2F2] text-[#D93025] border-[#FECACA]'
                  : 'bg-white text-[#4A5568] border-[#E3E8EF] hover:bg-[#F6F8FB]'
              }`}
            >
              <Lock className="w-4 h-4" />
              {isLockedDown ? 'South Dock Sealed' : 'Seal South Dock'}
            </button>
            <button
              onClick={() => onNavigateToVehicle(payload.object_data.license_plate)}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium border bg-white text-[#336FEE] border-[#BFDBFE] hover:bg-[#EFF6FF] transition-colors"
            >
              <Car className="w-4 h-4" />
              View Vehicle Profile
            </button>
          </div>
        </div>
      </div>

      {/* ── Bottom row ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent activity table */}
        <div className="card lg:col-span-2 overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E3E8EF] flex items-center justify-between">
            <h3 className="m-0">Recent Threat Activity</h3>
            <span className="text-[11px] text-[#8A97A8]">KA-04-XYZ · 4-day history</span>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date &amp; Time</th>
                  <th>Camera</th>
                  <th>Description</th>
                  <th>Severity</th>
                </tr>
              </thead>
              <tbody>
                {recentEvents.map((evt) => (
                  <tr key={evt.id}>
                    <td className="whitespace-nowrap font-mono text-[11.5px]">{evt.time}</td>
                    <td className="whitespace-nowrap text-[#336FEE]">{evt.camera}</td>
                    <td className="max-w-xs">
                      <span className="line-clamp-2">{evt.description}</span>
                      {evt.plate && (
                        <span className="text-[10.5px] text-[#8A97A8]"> · {evt.plate}</span>
                      )}
                    </td>
                    <td>
                      {evt.severity === 'critical' ? (
                        <span className="badge-red">Critical</span>
                      ) : (
                        <span className="badge-amber">Warning</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System status */}
        <div className="card p-4 space-y-4">
          <h3 className="m-0">System Health</h3>

          {[
            {
              label: 'YOLOv5 Detection',
              status: 'Active',
              sub: 'Processing 4 camera feeds',
              icon: Camera,
              ok: true,
            },
            {
              label: 'Groq LLM Engine',
              status: 'Online',
              sub: 'Llama 3 70B · Ready',
              icon: Cpu,
              ok: true,
            },
            {
              label: 'Hindsight Memory',
              status: '20 / 20 logs',
              sub: 'Vector store loaded',
              icon: Database,
              ok: true,
            },
          ].map(({ label, status, sub, icon: Icon, ok }) => (
            <div key={label} className="flex items-start gap-3 p-3 rounded-lg bg-[#F6F8FB] border border-[#E3E8EF]">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${ok ? 'bg-[#F0FDF4]' : 'bg-[#FEF2F2]'}`}>
                <Icon className={`w-4 h-4 ${ok ? 'text-[#1A7D4F]' : 'text-[#D93025]'}`} />
              </div>
              <div className="min-w-0">
                <div className="text-[12.5px] font-semibold text-[#172033]">{label}</div>
                <div className={`text-[11.5px] font-medium ${ok ? 'text-[#1A7D4F]' : 'text-[#D93025]'}`}>{status}</div>
                <div className="text-[11px] text-[#8A97A8]">{sub}</div>
              </div>
            </div>
          ))}

          <div className="pt-2 border-t border-[#E3E8EF] text-[11.5px] text-[#8A97A8] space-y-1">
            <div className="flex justify-between">
              <span>Facility</span>
              <span className="text-[#4A5568] font-medium">Sector 4 Defence Hangar</span>
            </div>
            <div className="flex justify-between">
              <span>API key</span>
              <span className="text-[#4A5568] font-medium font-mono">MEMHACK99</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
