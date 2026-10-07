import React from 'react';
import { Shield, Link2, Sparkles, Network, AlertOctagon, CheckSquare } from 'lucide-react';

export const EmptyState: React.FC = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Analysis',
      desc: 'Gemini 3.8 Flash assesses heuristic cues, contextual inconsistencies, and threat vectors.',
    },
    {
      icon: Network,
      title: 'URL Structure Detection',
      desc: 'Parses punycode, homoglyphs, deceptive subdomains, and malicious redirect paths.',
    },
    {
      icon: AlertOctagon,
      title: 'Phishing Detection',
      desc: 'Flags credential harvesting portals, brand impersonation, and urgency-driven scams.',
    },
    {
      icon: CheckSquare,
      title: 'Clear Explanations',
      desc: 'Actionable risk scores from 0–100 with human-readable security recommendations.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full my-8">
      {/* Primary Empty State Box */}
      <div className="bg-white rounded-2xl border-2 border-dashed border-[#E8E4D8] p-8 sm:p-12 text-center mb-8">
        <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#FEF9C3] border border-[#F4C430] mb-4">
          <Shield className="w-8 h-8 text-[#171717]" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#171717] flex items-center justify-center text-white">
            <Link2 className="w-3.5 h-3.5" />
          </div>
        </div>

        <h3 className="text-lg sm:text-xl font-black text-[#171717] tracking-tight">
          Your link security report will appear here.
        </h3>
        <p className="text-xs sm:text-sm text-[#6B6B6B] mt-1.5 max-w-md mx-auto">
          Paste a URL above to begin an AI-powered security analysis.
        </p>
      </div>

      {/* Feature Value Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white border border-[#E8E4D8] shadow-2xs hover:border-[#D9A900]/50 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-[#FFFDF7] border border-[#E8E4D8] flex items-center justify-center mb-3 text-[#171717]">
                <Icon className="w-4 h-4 text-[#854D0E]" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#171717] mb-1">
                {feat.title}
              </h4>
              <p className="text-[11px] text-[#6B6B6B] leading-relaxed">
                {feat.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
