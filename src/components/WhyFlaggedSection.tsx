import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Classification } from '../types/threat';

interface WhyFlaggedSectionProps {
  reasons: string[];
  classification: Classification;
}

export const WhyFlaggedSection: React.FC<WhyFlaggedSectionProps> = ({ reasons, classification }) => {
  const isSafe = classification === 'SAFE';

  return (
    <div className="bg-white rounded-2xl border-2 border-[#E8E4D8] p-5 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[#FEF9C3] flex items-center justify-center border border-[#F4C430]/60">
          {isSafe ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          ) : (
            <AlertCircle className="w-4 h-4 text-[#854D0E]" />
          )}
        </div>
        <div>
          <h4 className="text-base sm:text-lg font-black text-[#171717] tracking-tight">
            {isSafe ? 'Why was this URL classified as Safe?' : 'Why did ThreadMind flag this?'}
          </h4>
          <p className="text-xs text-[#6B6B6B]">
            Evidence evaluated by the threat intelligence heuristic engine
          </p>
        </div>
      </div>

      {reasons.length === 0 ? (
        <p className="text-xs text-[#6B6B6B] italic">No specific anomaly markers logged.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {reasons.map((reason, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FFFDF7] border border-[#E8E4D8] hover:border-[#D9A900]/50 transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-white border border-[#E8E4D8] flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold text-[#854D0E]">
                {idx + 1}
              </div>
              <p className="text-xs sm:text-sm text-[#171717] font-medium leading-snug">
                {reason}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
