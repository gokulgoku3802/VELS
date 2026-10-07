import React, { useState } from 'react';
import { Search, Clipboard, X, AlertCircle, ArrowRight, ShieldCheck, AlertTriangle, Skull } from 'lucide-react';
import { validateAndNormalizeUrl } from '../utils/urlValidator';

interface UrlInputCardProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

const SAMPLE_URLS = [
  {
    type: 'SAFE',
    label: 'Test Safe URL',
    url: 'https://github.com/torvalds/linux',
    icon: ShieldCheck,
    color: 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200',
  },
  {
    type: 'SUSPICIOUS',
    label: 'Test Suspicious URL',
    url: 'http://login.paypal.verify-account-security-token.xyz/auth/portal?session=48192&ref=urgent',
    icon: AlertTriangle,
    color: 'text-amber-800 bg-amber-50 hover:bg-amber-100 border-amber-200',
  },
  {
    type: 'PHISHING',
    label: 'Test Phishing URL',
    url: 'https://secure-appleid-support-icloud-signin.com/account/unlock?alert_id=8831',
    icon: Skull,
    color: 'text-rose-800 bg-rose-50 hover:bg-rose-100 border-rose-200',
  },
];

export const UrlInputCard: React.FC<UrlInputCardProps> = ({ onAnalyze, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLoading) return;

    setValidationError(null);
    const trimmed = inputValue.trim();

    if (!trimmed) {
      setValidationError('Please paste or type a URL to begin analysis.');
      return;
    }

    const validation = validateAndNormalizeUrl(trimmed);
    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid URL format. Please check the web address.');
      return;
    }

    onAnalyze(validation.normalizedUrl);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputValue(text.trim());
        setValidationError(null);
      }
    } catch {
      // Fallback if clipboard permission denied
      setValidationError('Clipboard read permission was not granted. Please paste manually using Ctrl+V or Cmd+V.');
    }
  };

  const handleClear = () => {
    setInputValue('');
    setValidationError(null);
  };

  const handleSelectSample = (sampleUrl: string) => {
    setInputValue(sampleUrl);
    setValidationError(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 w-full">
      <div className="bg-white rounded-2xl border-2 border-[#E8E4D8] p-5 sm:p-7 shadow-sm transition-all focus-within:border-[#F4C430] focus-within:shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="url-input"
              className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#171717] flex items-center gap-1.5"
            >
              <Search className="w-4 h-4 text-[#D9A900]" />
              Paste a suspicious link
            </label>
            <span className="text-[11px] font-medium text-[#6B6B6B]">
              Never opens links directly
            </span>
          </div>

          {/* Input Box */}
          <div className="relative flex items-center">
            <input
              id="url-input"
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (validationError) setValidationError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(e);
                }
              }}
              disabled={isLoading}
              placeholder="https://example.com"
              className="w-full pl-4 pr-24 py-3.5 sm:py-4 text-sm sm:text-base font-mono bg-[#FFFDF7] text-[#171717] placeholder:text-[#9E9E9E] rounded-xl border border-[#E8E4D8] focus:outline-none focus:ring-2 focus:ring-[#F4C430] focus:border-[#D9A900] transition-all disabled:opacity-60"
            />

            {/* In-input quick actions */}
            <div className="absolute right-2.5 flex items-center gap-1">
              {inputValue && !isLoading && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 text-[#6B6B6B] hover:text-[#171717] hover:bg-[#E8E4D8]/50 rounded-lg transition-colors cursor-pointer"
                  title="Clear link"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {!inputValue && !isLoading && (
                <button
                  type="button"
                  onClick={handlePaste}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#854D0E] bg-[#FEF9C3] hover:bg-[#FEF08A] rounded-lg border border-[#F4C430]/50 transition-colors cursor-pointer"
                  title="Paste from clipboard"
                >
                  <Clipboard className="w-3.5 h-3.5" />
                  <span>Paste</span>
                </button>
              )}
            </div>
          </div>

          {/* Validation Error Message */}
          {validationError && (
            <div className="flex items-start gap-2 mt-2.5 p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-[#E8E4D8]/60">
            <div className="flex items-center gap-2">
              {inputValue && !isLoading && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3.5 py-2 text-xs font-semibold text-[#6B6B6B] hover:text-[#171717] hover:bg-[#FFFDF7] rounded-xl transition-colors cursor-pointer border border-transparent hover:border-[#E8E4D8]"
                >
                  Clear
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#F4C430] hover:bg-[#D9A900] active:scale-[0.98] text-[#171717] font-bold text-sm tracking-wide shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100"
            >
              <span>{isLoading ? 'Analyzing Link...' : 'Analyze Link'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Quick Sample Test Buttons */}
        <div className="mt-5 pt-4 border-t border-[#E8E4D8]/70">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6B6B]">
              Quick Demo Samples:
            </span>
            <span className="text-[11px] text-[#9E9E9E]">
              Populates input for inspection
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {SAMPLE_URLS.map((sample) => {
              const Icon = sample.icon;
              return (
                <button
                  key={sample.type}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSelectSample(sample.url)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-left ${sample.color} disabled:opacity-50`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{sample.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
