import React from 'react';
import { ScanHistoryItem, ScanStats, Classification } from '../types/threat';
import { History, Trash2, ArrowUpRight, ShieldCheck, AlertTriangle, ShieldAlert, HelpCircle } from 'lucide-react';

interface ScanHistorySectionProps {
  history: ScanHistoryItem[];
  stats: ScanStats;
  onSelectScan: (item: ScanHistoryItem) => void;
  onClearHistory: () => void;
  onClose?: () => void;
}

export const ScanHistorySection: React.FC<ScanHistorySectionProps> = ({
  history,
  stats,
  onSelectScan,
  onClearHistory,
}) => {
  const getBadge = (classification: Classification) => {
    switch (classification) {
      case 'SAFE':
        return {
          icon: ShieldCheck,
          text: 'SAFE',
          style: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        };
      case 'SUSPICIOUS':
        return {
          icon: AlertTriangle,
          text: 'SUSPICIOUS',
          style: 'bg-amber-50 text-amber-800 border-amber-300',
        };
      case 'MALICIOUS':
        return {
          icon: ShieldAlert,
          text: 'MALICIOUS',
          style: 'bg-rose-50 text-rose-800 border-rose-300 font-bold',
        };
      case 'UNKNOWN':
      default:
        return {
          icon: HelpCircle,
          text: 'UNKNOWN',
          style: 'bg-stone-100 text-stone-700 border-stone-300',
        };
    }
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-[#E8E4D8] p-5 sm:p-6 shadow-sm">
      {/* Header and Statistics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-[#E8E4D8]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FEF9C3] border border-[#F4C430]/60 flex items-center justify-center">
            <History className="w-4 h-4 text-[#854D0E]" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#171717] tracking-tight">
              Scan History & Threat Dashboard
            </h3>
            <p className="text-xs text-[#6B6B6B]">
              Locally persisted link inspections
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
            title="Erase all local history records"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Dynamic Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3 bg-[#FFFDF7] rounded-xl border border-[#E8E4D8] text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6B6B] block mb-0.5">
            Total Scans
          </span>
          <span className="text-xl sm:text-2xl font-black text-[#171717]">
            {stats.total}
          </span>
        </div>

        <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block mb-0.5">
            Safe Links
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-700">
            {stats.safe}
          </span>
        </div>

        <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-0.5">
            Suspicious
          </span>
          <span className="text-xl sm:text-2xl font-black text-amber-700">
            {stats.suspicious}
          </span>
        </div>

        <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 block mb-0.5">
            Malicious
          </span>
          <span className="text-xl sm:text-2xl font-black text-rose-700">
            {stats.malicious}
          </span>
        </div>
      </div>

      {/* Scans List */}
      <div>
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#6B6B6B] mb-2.5">
          Recent Scans ({history.length})
        </h4>

        {history.length === 0 ? (
          <div className="text-center py-8 bg-[#FFFDF7] rounded-xl border border-dashed border-[#E8E4D8]">
            <History className="w-8 h-8 text-[#9E9E9E] mx-auto mb-2 opacity-50" />
            <p className="text-xs font-semibold text-[#6B6B6B]">
              No scans recorded yet.
            </p>
            <p className="text-[11px] text-[#9E9E9E] mt-0.5">
              Submit any URL above to populate your local threat activity.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {history.map((item) => {
              const badge = getBadge(item.classification);
              const BadgeIcon = badge.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectScan(item)}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#FFFDF7] hover:bg-[#FEF9C3]/50 border border-[#E8E4D8] hover:border-[#D9A900] transition-all cursor-pointer group"
                >
                  <div className="min-w-0 flex-1 mr-3">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[11px] font-mono text-[#6B6B6B]">
                        {formatTime(item.timestamp)}
                      </span>
                      <span className="font-mono text-xs sm:text-sm font-bold text-[#171717] truncate max-w-xs sm:max-w-md block group-hover:text-[#854D0E] transition-colors">
                        {item.domain}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-[#9E9E9E] truncate block">
                      {item.url}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.style}`}>
                      <BadgeIcon className="w-3 h-3" />
                      <span>{badge.text}</span>
                    </span>

                    <span className="text-xs font-mono font-bold text-[#171717] bg-white px-2 py-0.5 rounded border border-[#E8E4D8]">
                      {item.riskScore}/100
                    </span>

                    <ArrowUpRight className="w-4 h-4 text-[#6B6B6B] group-hover:text-[#171717] transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
