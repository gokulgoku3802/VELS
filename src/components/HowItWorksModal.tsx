import React from 'react';
import { X, ShieldCheck, Cpu, AlertTriangle, Layers, Lock } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border-2 border-[#E8E4D8] max-w-xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E4D8]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FEF9C3] border border-[#F4C430] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#854D0E]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#171717]">
                How ThreadMind AI Works
              </h3>
              <p className="text-xs text-[#6B6B6B]">
                Zero-Trust Link Inspection Architecture
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#6B6B6B] hover:text-[#171717] hover:bg-[#FFFDF7] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4 text-xs sm:text-sm text-[#171717]">
          {/* Step 1 */}
          <div className="flex items-start gap-3 p-3 bg-[#FFFDF7] rounded-xl border border-[#E8E4D8]">
            <div className="p-2 rounded-lg bg-white border border-[#E8E4D8] shrink-0 text-[#854D0E]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-[#171717]">
                1. Lexical & Structural Decomposition
              </h4>
              <p className="text-[#6B6B6B] text-xs mt-0.5">
                The input URL is parsed into its host, top-level domain, subdomains, path, and parameter tokens. We detect homoglyphs, deceptive punycode, unusual ports, and typo-squatted brand names.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 p-3 bg-[#FFFDF7] rounded-xl border border-[#E8E4D8]">
            <div className="p-2 rounded-lg bg-white border border-[#E8E4D8] shrink-0 text-[#16A34A]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-[#171717]">
                2. Isolated Non-Executing Reachability Probe
              </h4>
              <p className="text-[#6B6B6B] text-xs mt-0.5">
                ThreadMind never renders websites in an iframe or executes client JavaScript. A bounded server probe verifies headers, redirects, and document titles while completely protecting your device.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 p-3 bg-[#FFFDF7] rounded-xl border border-[#E8E4D8]">
            <div className="p-2 rounded-lg bg-white border border-[#E8E4D8] shrink-0 text-[#D9A900]">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-[#171717]">
                3. Gemini 3.8 Flash Cybersecurity Reasoning
              </h4>
              <p className="text-[#6B6B6B] text-xs mt-0.5">
                Google&apos;s Gemini model evaluates context, social engineering cues, brand mimicry, and deceptive redirect chains against cybersecurity rubrics, returning structured threat intelligence.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-3 p-3 bg-[#FFFDF7] rounded-xl border border-[#E8E4D8]">
            <div className="p-2 rounded-lg bg-white border border-[#E8E4D8] shrink-0 text-[#DC2626]">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-[#171717]">
                4. Heuristic Risk Score (0–100)
              </h4>
              <p className="text-[#6B6B6B] text-xs mt-0.5">
                Results are classified into <strong>SAFE</strong> (0–30), <strong>SUSPICIOUS</strong> (31–70), <strong>MALICIOUS</strong> (71–100), or <strong>UNKNOWN</strong> when evidence is inconclusive.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-[#E8E4D8] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#F4C430] hover:bg-[#D9A900] text-[#171717] font-bold text-xs cursor-pointer shadow-2xs"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
