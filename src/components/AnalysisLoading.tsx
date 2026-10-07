import React, { useEffect, useState } from 'react';
import { Shield, CheckCircle2, Loader2 } from 'lucide-react';

interface AnalysisLoadingProps {
  url: string;
}

const STEPS = [
  { id: 1, label: 'Validating URL syntax & structure', minTime: 0 },
  { id: 2, label: 'Extracting domain & subdomain heuristics', minTime: 600 },
  { id: 3, label: 'Inspecting webpage reachability & headers', minTime: 1400 },
  { id: 4, label: 'Running Gemini threat analysis engine', minTime: 2200 },
  { id: 5, label: 'Evaluating risk score & reputation signals', minTime: 3200 },
  { id: 6, label: 'Generating explanation & security recommendations', minTime: 4000 },
];

export const AnalysisLoading: React.FC<AnalysisLoadingProps> = ({ url }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    const timers = STEPS.map((step, index) => {
      return setTimeout(() => {
        setActiveStepIndex(index);
      }, step.minTime);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 w-full my-8">
      <div className="bg-white rounded-2xl border-2 border-[#E8E4D8] p-6 sm:p-8 shadow-md">
        {/* Radar and Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-4 flex items-center justify-center">
            {/* Outer radar pulse rings */}
            <div className="w-20 h-20 rounded-full bg-[#FEF9C3] radar-pulse flex items-center justify-center border border-[#F4C430]" />
            <div className="absolute w-14 h-14 rounded-full bg-[#F4C430] flex items-center justify-center shadow-md">
              <Shield className="w-7 h-7 text-[#171717]" />
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
            Analyzing Link...
          </h2>
          <p className="font-mono text-xs text-[#6B6B6B] mt-1 max-w-md truncate px-2 py-0.5 bg-[#FFFDF7] rounded border border-[#E8E4D8]">
            {url}
          </p>
        </div>

        {/* Animated steps checklist */}
        <div className="space-y-3 max-w-md mx-auto">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < activeStepIndex;
            const isCurrent = idx === activeStepIndex;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all text-xs sm:text-sm font-medium ${
                  isCompleted
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                    : isCurrent
                    ? 'bg-[#FEF9C3]/70 border-[#F4C430] text-[#171717] shadow-2xs'
                    : 'bg-[#FFFDF7]/50 border-transparent text-[#9E9E9E]'
                }`}
              >
                <div className="shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-[#D9A900] animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-[#D9D2C3] flex items-center justify-center text-[10px] text-[#9E9E9E]">
                      {step.id}
                    </div>
                  )}
                </div>

                <span className={isCurrent ? 'font-bold' : ''}>{step.label}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center text-xs text-[#6B6B6B] border-t border-[#E8E4D8]/60 pt-4">
          Isolated Sandbox Active: Target URL is strictly inspected without executing browser JavaScript.
        </div>
      </div>
    </div>
  );
};
