import React from 'react';
import { ThreatAnalysisResult } from '../types/threat';
import { RiskScoreGauge } from './RiskScoreGauge';
import { ThreatTypeCard } from './ThreatTypeCard';
import { WhyFlaggedSection } from './WhyFlaggedSection';
import { SecurityIndicatorsGrid } from './SecurityIndicatorsGrid';
import { RecommendationCard } from './RecommendationCard';
import { DomainInfoCard } from './DomainInfoCard';
import { TechnicalDetailsCollapsible } from './TechnicalDetailsCollapsible';
import { ArrowLeft, RefreshCw, Download } from 'lucide-react';

interface ResultDashboardProps {
  result: ThreatAnalysisResult;
  onReset: () => void;
}

export const ResultDashboard: React.FC<ResultDashboardProps> = ({ result, onReset }) => {
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `threatmind-report-${result.domain}-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full space-y-6 my-8 animate-in fade-in duration-300">
      {/* Top action header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold text-[#171717] bg-white hover:bg-[#FEF9C3] border border-[#E8E4D8] rounded-xl transition-all cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Analyze another link</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#6B6B6B] hover:text-[#171717] bg-white hover:bg-[#FFFDF7] border border-[#E8E4D8] rounded-xl transition-colors cursor-pointer"
            title="Export forensic JSON report"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#854D0E] bg-[#FEF9C3] hover:bg-[#FEF08A] border border-[#F4C430]/60 rounded-xl transition-colors cursor-pointer"
            title="Run new inspection"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Scan</span>
          </button>
        </div>
      </div>

      {/* 1. Large Circular Risk Score & Classification Gauge */}
      <RiskScoreGauge
        score={result.riskScore}
        classification={result.classification}
        confidence={result.confidence}
      />

      {/* 2. Recommendation Guidance */}
      <RecommendationCard
        classification={result.classification}
        recommendation={result.recommendation}
      />

      {/* 3. Threat Type Category Card */}
      <ThreatTypeCard
        threatType={result.threatType}
        summary={result.summary}
      />

      {/* 4. Why did ThreadMind flag this? */}
      <WhyFlaggedSection
        reasons={result.reasons}
        classification={result.classification}
      />

      {/* 5. Security Indicators Grid */}
      <SecurityIndicatorsGrid
        indicators={result.indicators}
        externalReputation={result.externalReputation}
      />

      {/* 6. Domain Information Card */}
      <DomainInfoCard
        domainInfo={result.domainInfo}
        url={result.url}
      />

      {/* 7. Collapsible Technical Details for Security Analysts */}
      <TechnicalDetailsCollapsible result={result} />

      {/* Bottom CTA to test another URL */}
      <div className="text-center pt-4">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F4C430] hover:bg-[#D9A900] text-[#171717] font-bold text-sm tracking-wide shadow-sm transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Analyze Another Suspicious Link</span>
        </button>
      </div>
    </div>
  );
};
