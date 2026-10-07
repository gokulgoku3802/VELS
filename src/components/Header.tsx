import React from 'react';
import { ShieldCheck, History, Info, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenHowItWorks: () => void;
  onOpenHistory: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHowItWorks,
  onOpenHistory,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E4D8] shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F4C430] flex items-center justify-center shadow-xs border border-[#D9A900]/40">
            <ShieldCheck className="w-6 h-6 text-[#171717]" strokeWidth={2.2} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-base sm:text-lg text-[#171717]">
                THREADMIND<span className="text-[#D9A900]">.AI</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide bg-[#FEF9C3] text-[#854D0E] px-2 py-0.5 rounded-full border border-[#FEF08A]">
                <Sparkles className="w-3 h-3 text-[#D9A900]" />
                URL SECURITY
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-[#6B6B6B] leading-none mt-0.5">
              Zero-Trust Link Intelligence Engine
            </p>
          </div>
        </div>

        {/* Right: Actions & Nav */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenHowItWorks}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-[#171717] hover:bg-[#FFFDF7] hover:border-[#D9A900] border border-transparent rounded-lg transition-colors cursor-pointer"
            title="How ThreadMind AI analyzes links"
          >
            <Info className="w-4 h-4 text-[#6B6B6B]" />
            <span className="hidden sm:inline">How it works</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-[#171717] bg-[#FFFDF7] hover:bg-[#FEF9C3]/60 border border-[#E8E4D8] rounded-lg transition-colors cursor-pointer shadow-2xs"
            title="View scan history"
          >
            <History className="w-4 h-4 text-[#D9A900]" />
            <span>Scan History</span>
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-[#171717] text-white rounded-full">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
