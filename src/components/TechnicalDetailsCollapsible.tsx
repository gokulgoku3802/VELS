import React, { useState } from 'react';
import { ThreatAnalysisResult } from '../types/threat';
import { ChevronDown, ChevronUp, Terminal, ShieldAlert } from 'lucide-react';

interface TechnicalDetailsCollapsibleProps {
  result: ThreatAnalysisResult;
}

export const TechnicalDetailsCollapsible: React.FC<TechnicalDetailsCollapsibleProps> = ({ result }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border-2 border-[#E8E4D8] overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 sm:p-5 flex items-center justify-between text-left bg-white hover:bg-[#FFFDF7] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FFFDF7] border border-[#E8E4D8] flex items-center justify-center">
            <Terminal className="w-4 h-4 text-[#171717]" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-black text-[#171717] tracking-tight">
              Technical Details & Telemetry
            </h4>
            <p className="text-xs text-[#6B6B6B]">
              In-depth signals, host parameters, and inspection limitations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#854D0E] bg-[#FEF9C3] px-2.5 py-1 rounded-full border border-[#F4C430]/50 hidden sm:inline-block">
            {isOpen ? 'Collapse' : 'Expand Analyst View'}
          </span>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-[#6B6B6B]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#6B6B6B]" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 sm:p-6 border-t border-[#E8E4D8] bg-[#FFFDF7] space-y-4">
          {/* Technical signals list */}
          <div>
            <h5 className="text-xs uppercase font-extrabold text-[#6B6B6B] tracking-wider mb-2">
              Detected Technical Signals:
            </h5>
            <div className="space-y-1.5">
              {result.technicalDetails.map((detail, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 bg-white rounded-lg border border-[#E8E4D8] text-xs font-mono text-[#171717]"
                >
                  <span className="text-[#D9A900] font-bold">›</span>
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Raw Host Properties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs font-mono">
            <div className="p-2.5 bg-white rounded-lg border border-[#E8E4D8]">
              <span className="text-[#6B6B6B] block text-[10px] uppercase font-bold">Normalized URL:</span>
              <span className="text-[#171717] break-all">{result.domainInfo.normalizedUrl}</span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-[#E8E4D8]">
              <span className="text-[#6B6B6B] block text-[10px] uppercase font-bold">Hostname / IP:</span>
              <span className="text-[#171717] break-all">{result.domainInfo.hostname}</span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-[#E8E4D8]">
              <span className="text-[#6B6B6B] block text-[10px] uppercase font-bold">Pathname:</span>
              <span className="text-[#171717]">{result.domainInfo.pathname}</span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-[#E8E4D8]">
              <span className="text-[#6B6B6B] block text-[10px] uppercase font-bold">Query Parameters:</span>
              <span className="text-[#171717]">{result.domainInfo.queryParamsCount} parameter(s)</span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-[#E8E4D8]">
              <span className="text-[#6B6B6B] block text-[10px] uppercase font-bold">Transport Layer:</span>
              <span className="text-[#171717]">{result.domainInfo.protocol} (TLS Active: {result.indicators.https ? 'YES' : 'NO'})</span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-[#E8E4D8]">
              <span className="text-[#6B6B6B] block text-[10px] uppercase font-bold">Page Inspection:</span>
              <span className="text-[#171717]">{result.pageInspectionStatus} ({result.indicators.contentAccessible ? 'Reachable' : 'Unreachable'})</span>
            </div>
          </div>

          {/* Limitations and Caveats */}
          {result.limitations.length > 0 && (
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                <span>Inspection Scope & Known Limitations:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-xs text-amber-800">
                {result.limitations.map((limit, idx) => (
                  <li key={idx}>{limit}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-[11px] text-[#9E9E9E] font-mono">
            Analysis Timestamp: {new Date(result.inspectedAt).toUTCString()} | Engine: Gemini 3.8 Flash Heuristics
          </div>
        </div>
      )}
    </div>
  );
};
