import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-[#E8E4D8] bg-white/80 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 rounded bg-[#F4C430] flex items-center justify-center text-[#171717]">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span className="font-extrabold text-xs tracking-wider text-[#171717]">
            THREADMIND AI
          </span>
          <span className="text-[#6B6B6B] text-xs">
            • URL Threat Analysis Engine
          </span>
        </div>

        <p className="text-xs text-[#6B6B6B] max-w-2xl mx-auto leading-relaxed">
          ThreadMind AI is a security-assistance tool and does not guarantee that a URL is safe. Always verify sensitive links through trusted sources before inputting credentials or payment information.
        </p>

        <div className="text-[11px] text-[#9E9E9E] pt-2">
          © {new Date().getFullYear()} ThreadMind AI • Powered by Google Gemini API
        </div>
      </div>
    </footer>
  );
};
