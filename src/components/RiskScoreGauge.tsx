import React from 'react';
import { Classification } from '../types/threat';
import { ShieldCheck, AlertTriangle, ShieldAlert, HelpCircle } from 'lucide-react';

interface RiskScoreGaugeProps {
  score: number; // 0 - 100
  classification: Classification;
  confidence: number;
}

export const RiskScoreGauge: React.FC<RiskScoreGaugeProps> = ({
  score,
  classification,
  confidence,
}) => {
  // Color configuration based on classification
  let theme = {
    color: '#16A34A', // green
    badgeBg: 'bg-emerald-50',
    badgeBorder: 'border-emerald-300',
    badgeText: 'text-emerald-800',
    riskLabel: 'LOW RISK',
    statusTitle: 'SAFE',
    icon: ShieldCheck,
    description: 'This link presents minimal detectable threat indicators.',
  };

  if (classification === 'MALICIOUS' || score >= 71) {
    theme = {
      color: '#DC2626', // red
      badgeBg: 'bg-rose-50',
      badgeBorder: 'border-rose-300',
      badgeText: 'text-rose-800',
      riskLabel: 'HIGH RISK',
      statusTitle: 'MALICIOUS',
      icon: ShieldAlert,
      description: 'Dangerous link detected. High probability of credential theft, phishing, or malware.',
    };
  } else if (classification === 'SUSPICIOUS' || (score >= 31 && score <= 70)) {
    theme = {
      color: '#D97706', // amber
      badgeBg: 'bg-amber-50',
      badgeBorder: 'border-amber-300',
      badgeText: 'text-amber-800',
      riskLabel: 'MEDIUM RISK',
      statusTitle: 'SUSPICIOUS',
      icon: AlertTriangle,
      description: 'Caution advised. Unusual domain, suspicious parameters, or social engineering cues detected.',
    };
  } else if (classification === 'UNKNOWN') {
    theme = {
      color: '#6B6B6B', // gray
      badgeBg: 'bg-stone-100',
      badgeBorder: 'border-stone-300',
      badgeText: 'text-stone-800',
      riskLabel: 'UNKNOWN',
      statusTitle: 'INSUFFICIENT EVIDENCE',
      icon: HelpCircle,
      description: 'Unable to conclusively verify. Independent caution and source verification required.',
    };
  }

  const Icon = theme.icon;

  // SVG Circular Gauge calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl border-2 border-[#E8E4D8] p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Circular gauge */}
        <div className="flex items-center gap-6">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 128 128">
              {/* Background ring */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke="#E8E4D8"
                strokeWidth="10"
                fill="none"
              />
              {/* Animated Progress ring */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke={theme.color}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Center score readout */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl sm:text-4xl font-black text-[#171717] tracking-tighter leading-none">
                {score}
              </span>
              <span className="text-[11px] font-bold text-[#6B6B6B] mt-0.5">
                / 100
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider text-[#9E9E9E]">
                Risk Score
              </span>
            </div>
          </div>

          {/* Classification Labels */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide border uppercase mb-2 ${theme.badgeBg} ${theme.badgeBorder} ${theme.badgeText}">
              <Icon className="w-4 h-4" />
              <span>{theme.riskLabel}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#171717] tracking-tight">
              {theme.statusTitle}
            </h3>
            <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-sm mt-1">
              {theme.description}
            </p>
          </div>
        </div>

        {/* Right: Heuristic Confidence & Score Meter Bar */}
        <div className="w-full md:w-64 flex flex-col gap-3 p-4 bg-[#FFFDF7] rounded-xl border border-[#E8E4D8]">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#6B6B6B]">Analysis Confidence</span>
            <span className="font-bold text-[#171717]">{confidence}%</span>
          </div>
          <div className="w-full h-2 bg-[#E8E4D8] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#F4C430] rounded-full transition-all duration-500"
              style={{ width: `${confidence}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#6B6B6B] pt-2 border-t border-[#E8E4D8]/60">
            <span>Score Scale:</span>
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-700 font-bold">0-30</span> | 
              <span className="text-amber-700 font-bold">31-70</span> | 
              <span className="text-rose-700 font-bold">71-100</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
