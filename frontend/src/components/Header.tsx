import React, { useState, useEffect } from 'react';
import { Clock, Radio, Lock, RefreshCw, Zap } from 'lucide-react';

interface HeaderProps {
  onTriggerLivePayload: () => void;
  onDispatchIntercept: () => void;
  isLockedDown: boolean;
  onToggleLockdown: () => void;
  isStreaming: boolean;
  onToggleStreaming: () => void;
  layoutMode?: 'columns' | 'stacked';
  onToggleLayoutMode?: () => void;
  pageTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onTriggerLivePayload,
  onDispatchIntercept,
  isLockedDown,
  onToggleLockdown,
  isStreaming,
  onToggleStreaming,
  pageTitle = 'Command Center',
}) => {
  const [time, setTime] = useState<string>('2026-09-28 23:15:00 UTC');

  useEffect(() => {
    const startEpoch = new Date('2026-09-28T23:15:00Z').getTime();
    let offset = 0;
    const interval = setInterval(() => {
      offset += 1;
      const d = new Date(startEpoch + offset * 1000);
      setTime(d.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-14 bg-white border-b border-[#E3E8EF] px-5 flex items-center justify-between shrink-0 z-20 min-w-0 gap-4">

      {/* Page title */}
      <div className="flex items-center gap-2 min-w-0">
        <h1 className="text-[15px] font-semibold text-[#172033] truncate m-0">{pageTitle}</h1>
        <span className="hidden sm:inline text-[11px] font-medium text-[#D93025] bg-[#FEF2F2] border border-[#FECACA] rounded px-2 py-0.5 shrink-0">
          Defcon 2
        </span>
      </div>

      {/* Center: clock */}
      <div className="hidden lg:flex items-center gap-1.5 text-[12px] text-[#8A97A8] shrink-0">
        <Clock className="w-3.5 h-3.5" />
        <span className="font-mono text-[#4A5568]">{time}</span>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2 shrink-0">

        {/* Stream status */}
        <button
          onClick={onToggleStreaming}
          title="Toggle camera stream"
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-medium border transition-colors ${
            isStreaming
              ? 'bg-[#F0FDF4] text-[#1A7D4F] border-[#BBF7D0] hover:bg-[#DCFCE7]'
              : 'bg-white text-[#8A97A8] border-[#E3E8EF] hover:bg-[#F6F8FB]'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isStreaming ? 'animate-spin' : ''}`} />
          {isStreaming ? 'Streaming' : 'Paused'}
        </button>

        {/* Inject payload */}
        <button
          onClick={onTriggerLivePayload}
          title="Inject live demo payload"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-medium border bg-white text-[#4A5568] border-[#E3E8EF] hover:bg-[#F6F8FB] transition-colors"
        >
          <Zap className="w-3.5 h-3.5 text-[#C4760E]" />
          <span className="hidden md:inline">Inject Payload</span>
        </button>

        {/* Lock dock */}
        <button
          onClick={onToggleLockdown}
          title="Toggle South Dock lockdown"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-medium border transition-colors ${
            isLockedDown
              ? 'bg-[#FEF2F2] text-[#D93025] border-[#FECACA] hover:bg-[#FEE2E2]'
              : 'bg-white text-[#4A5568] border-[#E3E8EF] hover:bg-[#F6F8FB]'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isLockedDown ? 'Sealed' : 'Lock Dock'}</span>
        </button>

        {/* Dispatch — primary CTA */}
        <button
          onClick={onDispatchIntercept}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-semibold text-white bg-[#D93025] hover:bg-[#B91C1C] border border-[#D93025] transition-colors active:scale-95 whitespace-nowrap"
        >
          <Radio className="w-3.5 h-3.5" />
          Dispatch
        </button>
      </div>
    </header>
  );
};
