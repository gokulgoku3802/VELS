import React from 'react';
import { ShieldAlert, Zap, Lock } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="text-center pt-8 pb-4 px-4 sm:px-6">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF9C3] border border-[#F4C430]/60 text-[#854D0E] text-xs font-semibold mb-4 shadow-2xs">
        <ShieldAlert className="w-4 h-4 text-[#D9A900]" />
        <span>AI-Powered URL Security</span>
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#171717] tracking-tight mb-3">
        Know Before You Click.
      </h1>

      <p className="max-w-2xl mx-auto text-[#6B6B6B] text-sm sm:text-base md:text-lg font-normal leading-relaxed">
        ThreadMind AI analyzes suspicious URLs using AI-powered security checks and explains the risk before you open them.
      </p>

      {/* Trust micro-badges */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4 text-xs font-medium text-[#6B6B6B]">
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-[#D9A900]" />
          <span>Gemini 3.8 Flash Heuristics</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-[#16A34A]" />
          <span>Zero-Click Isolation Sandbox</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
          <span>Phishing & Scam Detection</span>
        </div>
      </div>
    </section>
  );
};
