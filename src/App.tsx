import { useState, useEffect } from 'react';
import { ThreatAnalysisResult, ScanHistoryItem } from './types/threat';
import { getScanHistory, saveScanItem, clearScanHistory, calculateScanStats } from './utils/historyStorage';
import { analyzeUrlWithGemini } from './services/apiClient';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { UrlInputCard } from './components/UrlInputCard';
import { AnalysisLoading } from './components/AnalysisLoading';
import { ResultDashboard } from './components/ResultDashboard';
import { ScanHistorySection } from './components/ScanHistorySection';
import { EmptyState } from './components/EmptyState';
import { HowItWorksModal } from './components/HowItWorksModal';
import { Footer } from './components/Footer';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [analysisResult, setAnalysisResult] = useState<ThreatAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analyzingUrl, setAnalyzingUrl] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);

  // Load history from localStorage on initial render
  useEffect(() => {
    const loaded = getScanHistory();
    setHistory(loaded);
  }, []);

  const stats = calculateScanStats(history);

  const handleAnalyze = async (url: string) => {
    setIsLoading(true);
    setAnalyzingUrl(url);
    setErrorMessage(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeUrlWithGemini(url);
      setAnalysisResult(result);
      // Persist in local storage
      const updatedHistory = saveScanItem(result);
      setHistory(updatedHistory);
    } catch (err: unknown) {
      console.error('Analysis failed:', err);
      const message = err instanceof Error ? err.message : 'An error occurred while evaluating the link.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAllHistory = () => {
    clearScanHistory();
    setHistory([]);
  };

  const handleSelectHistoryItem = (item: ScanHistoryItem) => {
    setAnalysisResult(item.fullResult);
    setErrorMessage(null);
    setShowHistoryModal(false);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setErrorMessage(null);
    setAnalyzingUrl('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF7] text-[#171717]">
      {/* Top Navigation */}
      <Header
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenHistory={() => setShowHistoryModal(true)}
        historyCount={history.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto py-6 space-y-6">
        {/* Hero Section */}
        <Hero />

        {/* URL Input & Sample Test Controls */}
        <UrlInputCard
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
        />

        {/* Error Banner */}
        {errorMessage && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 w-full">
            <div className="p-4 bg-rose-50 border-2 border-rose-200 rounded-2xl flex items-start justify-between gap-3 shadow-xs">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-rose-900">
                    Analysis Request Failed
                  </h4>
                  <p className="text-xs text-rose-800 mt-0.5">
                    {errorMessage}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-xs font-semibold text-rose-700 hover:text-rose-900 underline shrink-0 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <AnalysisLoading url={analyzingUrl} />
        )}

        {/* Active Result Dashboard */}
        {!isLoading && analysisResult && (
          <ResultDashboard
            result={analysisResult}
            onReset={handleReset}
          />
        )}

        {/* Empty State before first analysis */}
        {!isLoading && !analysisResult && !errorMessage && (
          <EmptyState />
        )}

        {/* Scan History and Statistics Dashboard */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full pt-4">
          <ScanHistorySection
            history={history}
            stats={stats}
            onSelectScan={handleSelectHistoryItem}
            onClearHistory={handleClearAllHistory}
          />
        </div>
      </main>

      {/* How it works Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

      {/* Scan History Drawer/Modal when opened from Header */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border-2 border-[#E8E4D8] max-w-2xl w-full p-6 shadow-xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E8E4D8]">
              <h3 className="text-base sm:text-lg font-black text-[#171717]">
                Local Threat Intelligence History
              </h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-xs font-bold text-[#6B6B6B] hover:text-[#171717] px-2.5 py-1 rounded-lg border border-[#E8E4D8] hover:bg-[#FFFDF7] cursor-pointer"
              >
                Close
              </button>
            </div>

            <ScanHistorySection
              history={history}
              stats={stats}
              onSelectScan={handleSelectHistoryItem}
              onClearHistory={handleClearAllHistory}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
