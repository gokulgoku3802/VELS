import React from 'react';
import { ThreatType } from '../types/threat';
import { 
  ShieldAlert, 
  FileWarning, 
  DollarSign, 
  Users, 
  Globe, 
  KeyRound, 
  DownloadCloud, 
  HelpCircle, 
  ShieldCheck 
} from 'lucide-react';

interface ThreatTypeCardProps {
  threatType: ThreatType;
  summary: string;
}

export const ThreatTypeCard: React.FC<ThreatTypeCardProps> = ({ threatType, summary }) => {
  const getThreatDetails = (type: ThreatType) => {
    switch (type) {
      case 'PHISHING':
        return {
          icon: ShieldAlert,
          title: 'Phishing Attack Vector',
          badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
          desc: 'Designed to deceive users into providing sensitive credentials or access codes.',
        };
      case 'MALWARE':
        return {
          icon: FileWarning,
          title: 'Malware Distribution',
          badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
          desc: 'Associated with harmful software payload, exploit kits, or drive-by downloads.',
        };
      case 'SCAM':
        return {
          icon: DollarSign,
          title: 'Financial / Fraud Scam',
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
          desc: 'Fraudulent scheme involving fake prizes, crypto offers, or deceptive financial requests.',
        };
      case 'BRAND IMPERSONATION':
        return {
          icon: Users,
          title: 'Brand Impersonation / Typosquatting',
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
          desc: 'Imitates a trusted brand, financial institution, or tech company to deceive visitors.',
        };
      case 'CREDENTIAL HARVESTING':
        return {
          icon: KeyRound,
          title: 'Credential Harvesting Page',
          badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
          desc: 'Mimics legitimate login portals to collect usernames, passwords, or MFA tokens.',
        };
      case 'MALICIOUS DOWNLOAD':
        return {
          icon: DownloadCloud,
          title: 'Malicious File Download',
          badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
          desc: 'Triggers unwanted or disguised executables/scripts upon visiting.',
        };
      case 'SUSPICIOUS WEBSITE':
        return {
          icon: Globe,
          title: 'Suspicious Website',
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
          desc: 'Exhibits anomalies in URL formatting, hidden redirection, or deceptive parameters.',
        };
      case 'NONE':
        return {
          icon: ShieldCheck,
          title: 'No Threat Detected',
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          desc: 'Standard web domain with consistent infrastructure and no obvious deceptive indicators.',
        };
      case 'UNKNOWN':
      default:
        return {
          icon: HelpCircle,
          title: 'Unknown Threat Type',
          badgeColor: 'bg-stone-100 text-stone-800 border-stone-300',
          desc: 'Evidence is insufficient to categorize a specific active threat vector.',
        };
    }
  };

  const details = getThreatDetails(threatType);
  const Icon = details.icon;

  return (
    <div className="bg-white rounded-2xl border-2 border-[#E8E4D8] p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[#FFFDF7] border border-[#E8E4D8]">
            <Icon className="w-5 h-5 text-[#171717]" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6B6B]">
              Identified Threat Category
            </span>
            <h4 className="text-base sm:text-lg font-bold text-[#171717]">
              {details.title}
            </h4>
          </div>
        </div>

        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black tracking-wide border self-start sm:self-auto ${details.badgeColor}`}>
          {threatType}
        </span>
      </div>

      <div className="mt-3 p-3.5 bg-[#FFFDF7] rounded-xl border border-[#E8E4D8]">
        <p className="text-xs sm:text-sm text-[#171717] leading-relaxed">
          <strong className="text-[#171717] font-semibold">Executive Assessment: </strong>
          {summary}
        </p>
      </div>
    </div>
  );
};
