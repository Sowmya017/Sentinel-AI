import React from 'react';
import {
  ShieldCheck,
  Video,
  AlertTriangle,
  Car,
  FileText,
  Cpu,
  Settings,
  ChevronRight,
} from 'lucide-react';

export type PageId =
  | 'command-center'
  | 'live-surveillance'
  | 'threat-center'
  | 'vehicle-intelligence'
  | 'event-log'
  | 'ai-investigation'
  | 'settings';

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  threatCount?: number;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const navGroups = [
  {
    label: 'Operations',
    items: [
      { id: 'command-center' as PageId,      label: 'Command Center',     icon: ShieldCheck },
      { id: 'live-surveillance' as PageId,   label: 'Surveillance',       icon: Video },
      { id: 'threat-center' as PageId,       label: 'Threat Center',      icon: AlertTriangle, alert: true },
      { id: 'vehicle-intelligence' as PageId,label: 'Vehicle Intel',      icon: Car },
    ],
  },
  {
    label: 'Analysis',
    items: [
      { id: 'event-log' as PageId,           label: 'Event Log',          icon: FileText },
      { id: 'ai-investigation' as PageId,    label: 'AI Investigation',   icon: Cpu },
    ],
  },
  {
    label: 'System',
    items: [
      { id: 'settings' as PageId,            label: 'Settings',           icon: Settings },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  threatCount = 1,
}) => {
  return (
    <aside
      className="w-56 shrink-0 h-full flex flex-col bg-white border-r border-[#E3E8EF] select-none z-30 overflow-hidden"
      aria-label="Main navigation"
    >
      {/* Brand */}
      <div className="h-14 px-4 flex items-center gap-2.5 border-b border-[#E3E8EF] shrink-0">
        <div className="w-7 h-7 rounded-lg bg-[#336FEE] flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="text-[13.5px] font-semibold text-[#172033] leading-tight">Sentinel AI</div>
          <div className="text-[10.5px] text-[#8A97A8] leading-tight">Security Platform</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            <div className="px-3 mb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-[#8A97A8]">
              {group.label}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#336FEE]' : item.alert ? 'text-[#D93025]' : 'text-[#8A97A8]'}`} />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.alert && threatCount > 0 && (
                      <span className="text-[10px] font-bold text-[#D93025] bg-[#FEF2F2] border border-[#FECACA] rounded-full px-1.5 py-px shrink-0">
                        {threatCount}
                      </span>
                    )}
                    {isActive && !item.alert && (
                      <ChevronRight className="w-3 h-3 text-[#336FEE] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Active threat quick card */}
      <div className="px-2.5 pb-3 shrink-0">
        <button
          onClick={() => onNavigate('vehicle-intelligence')}
          className="w-full text-left p-3 rounded-lg border border-[#FECACA] bg-[#FEF2F2] hover:border-[#FCA5A5] transition-colors"
        >
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#D93025] mb-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D93025] dot-live inline-block" />
            Active Threat
          </div>
          <div className="text-[13px] font-semibold text-[#172033]">KA-04-XYZ</div>
          <div className="text-[11px] text-[#8A97A8] mt-0.5">South Dock · Commercial Van</div>
        </button>
      </div>
    </aside>
  );
};
