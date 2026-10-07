import React, { useState } from 'react';
import { DomainInfo } from '../types/threat';
import { Copy, Check, Globe, Server, Hash, FileCode } from 'lucide-react';

interface DomainInfoCardProps {
  domainInfo: DomainInfo;
  url: string;
}

export const DomainInfoCard: React.FC<DomainInfoCardProps> = ({ domainInfo, url }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-[#E8E4D8] p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-base sm:text-lg font-black text-[#171717] tracking-tight">
            Target Domain Information
          </h4>
          <p className="text-xs text-[#6B6B6B]">
            Parsed host architecture and routing parameters
          </p>
        </div>

        {/* Copy URL CTA - strictly no clickable hyperlinks */}
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#171717] bg-[#FEF9C3] hover:bg-[#FEF08A] border border-[#F4C430]/60 transition-colors cursor-pointer shadow-2xs"
          title="Safely copy URL to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-700" />
              <span className="text-emerald-800">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#854D0E]" />
              <span>Copy URL</span>
            </>
          )}
        </button>
      </div>

      {/* Submitted URL banner - non-hyperlinked with safety notice */}
      <div className="p-3 bg-[#FFFDF7] rounded-xl border border-[#E8E4D8] mb-4">
        <span className="text-[10px] uppercase font-bold text-[#6B6B6B] tracking-wider block mb-1">
          Submitted URL (Isolated Plaintext)
        </span>
        <code className="text-xs sm:text-sm font-mono text-[#171717] break-all select-all block font-semibold">
          {url}
        </code>
      </div>

      {/* Domain components grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-[#FFFDF7] border border-[#E8E4D8]">
          <div className="flex items-center gap-1.5 text-xs text-[#6B6B6B] mb-1">
            <Globe className="w-3.5 h-3.5 text-[#D9A900]" />
            <span className="font-semibold">Primary Domain</span>
          </div>
          <span className="text-xs sm:text-sm font-mono font-bold text-[#171717] break-all">
            {domainInfo.domain}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#FFFDF7] border border-[#E8E4D8]">
          <div className="flex items-center gap-1.5 text-xs text-[#6B6B6B] mb-1">
            <Server className="w-3.5 h-3.5 text-[#D9A900]" />
            <span className="font-semibold">Hostname</span>
          </div>
          <span className="text-xs sm:text-sm font-mono font-bold text-[#171717] break-all">
            {domainInfo.hostname}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#FFFDF7] border border-[#E8E4D8]">
          <div className="flex items-center gap-1.5 text-xs text-[#6B6B6B] mb-1">
            <Hash className="w-3.5 h-3.5 text-[#D9A900]" />
            <span className="font-semibold">Protocol</span>
          </div>
          <span className="text-xs sm:text-sm font-mono font-bold text-[#171717]">
            {domainInfo.protocol}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#FFFDF7] border border-[#E8E4D8]">
          <div className="flex items-center gap-1.5 text-xs text-[#6B6B6B] mb-1">
            <FileCode className="w-3.5 h-3.5 text-[#D9A900]" />
            <span className="font-semibold">Path / Params</span>
          </div>
          <span className="text-xs sm:text-sm font-mono font-bold text-[#171717] truncate block" title={domainInfo.pathname}>
            {domainInfo.pathname} ({domainInfo.queryParamsCount} params)
          </span>
        </div>
      </div>
    </div>
  );
};
