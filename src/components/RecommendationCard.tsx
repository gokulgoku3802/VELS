import React from 'react';
import { Classification } from '../types/threat';
import { ShieldAlert, ShieldCheck, AlertTriangle, HelpCircle } from 'lucide-react';

interface RecommendationCardProps {
  classification: Classification;
  recommendation: string;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  classification,
  recommendation,
}) => {
  let theme = {
    bg: 'bg-emerald-50/70',
    border: 'border-emerald-300',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
    title: 'Recommended Action: Proceed with Normal Caution',
    badgeText: 'Low Risk Guidance',
    icon: ShieldCheck,
  };

  if (classification === 'MALICIOUS') {
    theme = {
      bg: 'bg-rose-50/80',
      border: 'border-rose-300',
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-700',
      title: 'CRITICAL WARNING: Do Not Open or Interact',
      badgeText: 'High Risk Action Required',
      icon: ShieldAlert,
    };
  } else if (classification === 'SUSPICIOUS') {
    theme = {
      bg: 'bg-amber-50/80',
      border: 'border-amber-300',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-800',
      title: 'ELEVATED RISK: Verification Advised',
      badgeText: 'Suspicious Action Warning',
      icon: AlertTriangle,
    };
  } else if (classification === 'UNKNOWN') {
    theme = {
      bg: 'bg-stone-50',
      border: 'border-stone-300',
      iconBg: 'bg-stone-100',
      iconColor: 'text-stone-700',
      title: 'UNCERTAIN STATUS: Exercise Restraint',
      badgeText: 'Insufficient Data',
      icon: HelpCircle,
    };
  }

  const Icon = theme.icon;

  return (
    <div className={`rounded-2xl border-2 p-5 sm:p-6 shadow-sm transition-all ${theme.bg} ${theme.border}`}>
      <div className="flex items-start gap-3.5">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${theme.iconBg}`}>
          <Icon className={`w-5 h-5 ${theme.iconColor}`} />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="text-base font-bold text-[#171717]">
              {theme.title}
            </h4>
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-white/80 border border-[#E8E4D8] text-[#171717] tracking-wider shrink-0">
              {theme.badgeText}
            </span>
          </div>

          <p className="text-xs sm:text-sm font-medium text-[#171717] leading-relaxed">
            {recommendation}
          </p>
        </div>
      </div>
    </div>
  );
};
