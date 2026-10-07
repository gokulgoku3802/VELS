import React from 'react';
import { SecurityIndicators, ExternalReputation } from '../types/threat';
import { 
  Lock, 
  Globe2, 
  Fish, 
  CopyCheck, 
  SlidersHorizontal, 
  FileSearch, 
  Database, 
  Cpu 
} from 'lucide-react';

interface SecurityIndicatorsGridProps {
  indicators: SecurityIndicators;
  externalReputation?: ExternalReputation;
}

type IndicatorState = 'Detected' | 'Not detected' | 'Unavailable';

interface IndicatorItem {
  id: string;
  name: string;
  status: IndicatorState;
  description: string;
  isThreatWhenDetected: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

export const SecurityIndicatorsGrid: React.FC<SecurityIndicatorsGridProps> = ({
  indicators,
  externalReputation,
}) => {
  // Reputation status logic
  let repStatus: IndicatorState = 'Unavailable';
  if (externalReputation?.status === 'MALICIOUS' || externalReputation?.status === 'SUSPICIOUS') {
    repStatus = 'Detected';
  } else if (externalReputation?.status === 'CLEAN') {
    repStatus = 'Not detected';
  } else {
    repStatus = 'Unavailable';
  }

  const items: IndicatorItem[] = [
    {
      id: 'https',
      name: 'HTTPS',
      status: indicators.https ? 'Detected' : 'Not detected',
      description: indicators.https ? 'Valid TLS transport layer present' : 'Insecure plaintext HTTP protocol',
      isThreatWhenDetected: false, // Detecting HTTPS is good, missing is suspicious
      icon: Lock,
    },
    {
      id: 'domain_structure',
      name: 'Domain Structure',
      status: indicators.suspiciousDomain ? 'Detected' : 'Not detected',
      description: indicators.suspiciousDomain ? 'Anomalous subdomains, IP host, or high-risk TLD' : 'Standard domain composition',
      isThreatWhenDetected: true,
      icon: Globe2,
    },
    {
      id: 'phishing_signals',
      name: 'Phishing Signals',
      status: indicators.phishingSignals ? 'Detected' : 'Not detected',
      description: indicators.phishingSignals ? 'Deceptive keywords, urgency cues, or credential hooks' : 'No overt phishing patterns detected',
      isThreatWhenDetected: true,
      icon: Fish,
    },
    {
      id: 'brand_impersonation',
      name: 'Brand Impersonation',
      status: indicators.brandImpersonation ? 'Detected' : 'Not detected',
      description: indicators.brandImpersonation ? 'Lookalike naming or mimicry of known brands' : 'No trademark spoofing detected',
      isThreatWhenDetected: true,
      icon: CopyCheck,
    },
    {
      id: 'suspicious_params',
      name: 'Suspicious Parameters',
      status: indicators.suspiciousParameters ? 'Detected' : 'Not detected',
      description: indicators.suspiciousParameters ? 'Excessive base64 tokens, redirect queries, or disguised paths' : 'Standard clean query structure',
      isThreatWhenDetected: true,
      icon: SlidersHorizontal,
    },
    {
      id: 'page_content',
      name: 'Page Content',
      status: indicators.contentAccessible ? 'Detected' : 'Unavailable',
      description: indicators.contentAccessible ? 'Target response verified via isolated sandbox fetch' : 'Target host unreachable or connection blocked',
      isThreatWhenDetected: false,
      icon: FileSearch,
    },
    {
      id: 'domain_reputation',
      name: 'Domain Reputation',
      status: repStatus,
      description: externalReputation?.details || 'External threat database signal unavailable',
      isThreatWhenDetected: true,
      icon: Database,
    },
    {
      id: 'ai_assessment',
      name: 'AI Assessment',
      status: 'Detected',
      description: 'Gemini 3.8 Flash model heuristic reasoning completed',
      isThreatWhenDetected: false,
      icon: Cpu,
    },
  ];

  const getBadgeStyle = (item: IndicatorItem) => {
    if (item.status === 'Unavailable') {
      return 'bg-stone-100 text-stone-700 border-stone-200';
    }

    if (item.id === 'https') {
      return item.status === 'Detected'
        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
        : 'bg-rose-50 text-rose-800 border-rose-300';
    }

    if (item.id === 'page_content' || item.id === 'ai_assessment') {
      return item.status === 'Detected'
        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
        : 'bg-stone-100 text-stone-700 border-stone-200';
    }

    // For threat markers (e.g. phishing, brand impersonation):
    if (item.isThreatWhenDetected) {
      return item.status === 'Detected'
        ? 'bg-rose-50 text-rose-800 border-rose-300 font-bold'
        : 'bg-emerald-50 text-emerald-800 border-emerald-300';
    }

    return 'bg-emerald-50 text-emerald-800 border-emerald-300';
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-[#E8E4D8] p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-base sm:text-lg font-black text-[#171717] tracking-tight">
            Security Indicators
          </h4>
          <p className="text-xs text-[#6B6B6B]">
            Multi-vector security signal matrix
          </p>
        </div>
        <span className="text-[11px] font-semibold text-[#854D0E] bg-[#FEF9C3] px-2.5 py-1 rounded-full border border-[#F4C430]/50">
          8 Signals Evaluated
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          const badgeClass = getBadgeStyle(item);

          return (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-[#FFFDF7] border border-[#E8E4D8] flex flex-col justify-between hover:border-[#D9A900]/40 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[#171717]" />
                    <span className="text-xs font-bold text-[#171717]">
                      {item.name}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeClass}`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-[11px] text-[#6B6B6B] leading-tight">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
