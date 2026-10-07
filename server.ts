import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { reputationCheck } from './src/services/reputationService';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = parseInt(process.env.PORT || '3000', 10);

// Helper to safely inspect webpage headers and lightweight snippet without executing scripts
interface PageInspection {
  accessible: boolean;
  httpStatus?: number;
  finalUrl?: string;
  contentType?: string;
  serverHeader?: string;
  titleSnippet?: string;
  errorReason?: string;
}

async function inspectTargetPage(targetUrl: string): Promise<PageInspection> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 1200);

  try {
    const res = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 ThreadMind-Security-Bot/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      signal: controller.signal,
      redirect: 'follow',
    });

    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type') || '';
    const serverHeader = res.headers.get('server') || 'Unknown';
    let titleSnippet = '';

    if (contentType.includes('text/html') || contentType.includes('application/xhtml+xml')) {
      const text = await res.text();
      // Extract title safely
      const match = text.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (match && match[1]) {
        titleSnippet = match[1].trim().slice(0, 150);
      }
    }

    return {
      accessible: res.ok,
      httpStatus: res.status,
      finalUrl: res.url,
      contentType,
      serverHeader,
      titleSnippet,
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const errorMessage = err instanceof Error ? err.message : 'Connection failed';
    return {
      accessible: false,
      errorReason: errorMessage.includes('aborted') ? 'Probe timeout (1.2s limit)' : errorMessage,
    };
  }
}

// POST /api/analyze
app.post('/api/analyze', async (req: Request, res: Response) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Valid URL is required.' });
    }

    const trimmedUrl = url.trim();
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://') ? trimmedUrl : `https://${trimmedUrl}`);
    } catch {
      return res.status(400).json({ error: 'The provided string is not a valid URL.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured in the environment. Please verify your settings.',
      });
    }

    // Step 1: Lexical URL breakdown
    const isHttps = parsedUrl.protocol === 'https:';
    const hostname = parsedUrl.hostname.toLowerCase();
    const pathname = parsedUrl.pathname || '/';
    let queryParamsCount = 0;
    parsedUrl.searchParams.forEach(() => { queryParamsCount++; });

    // Domain extraction
    const hostParts = hostname.split('.');
    let domain = hostname;
    if (hostParts.length >= 2) {
      const secondLast = hostParts[hostParts.length - 2];
      if (['co', 'com', 'org', 'net', 'edu', 'gov'].includes(secondLast) && hostParts.length >= 3) {
        domain = hostParts.slice(-3).join('.');
      } else {
        domain = hostParts.slice(-2).join('.');
      }
    }

    // Step 2: Safe external reputation check
    const reputationResult = await reputationCheck(parsedUrl.href, process.env.SAFE_BROWSING_API_KEY);

    // Step 3: Lightweight webpage reachability inspection (non-blocking / safe)
    const pageInspection = await inspectTargetPage(parsedUrl.href);

    // Step 4: Initialize Gemini Client with official SDK and telemetry User-Agent
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `You are ThreadMind AI, an expert cybersecurity URL analysis engine.

Your job is to analyze an untrusted URL and determine whether it appears safe, suspicious, malicious, or cannot be determined.

Never claim certainty when the available evidence is insufficient.

Analyze:
1. URL syntax
2. hostname and domain structure
3. suspicious subdomains
4. path and query parameters
5. encoded characters
6. phishing indicators
7. social engineering indicators
8. brand impersonation
9. credential harvesting
10. payment scams
11. suspicious downloads
12. webpage content when URL Context is available
13. contextual inconsistencies
14. known threat indicators returned by external security services, when supplied

Important:
- An unfamiliar domain is not automatically malicious.
- HTTPS does not guarantee that a website is safe.
- A professional-looking website may still be malicious.
- Do not invent domain reputation information.
- Do not invent WHOIS data.
- Do not invent threat intelligence.
- Clearly state when information is unavailable.
- Treat the score as a heuristic risk score, not a guaranteed probability.
- If evidence is insufficient, use UNKNOWN.

Return ONLY valid JSON following the requested schema.`;

    const userPrompt = `Perform a comprehensive cybersecurity threat analysis on the following URL:

URL: "${parsedUrl.href}"
Hostname: "${hostname}"
Domain: "${domain}"
Protocol: "${parsedUrl.protocol}"
Pathname: "${pathname}"
Query Parameters: ${queryParamsCount}
HTTPS Active: ${isHttps}

Webpage Inspection Status:
- Content Accessible: ${pageInspection.accessible}
- HTTP Status: ${pageInspection.httpStatus ?? 'N/A'}
- Title Found: ${pageInspection.titleSnippet ? `"${pageInspection.titleSnippet}"` : 'None / Unavailable'}
- Server Header: ${pageInspection.serverHeader ?? 'N/A'}
- Inspection Note: ${pageInspection.errorReason ?? (pageInspection.accessible ? 'Target server responded' : 'Server did not return successful status')}

External Reputation Signal:
- Status: ${reputationResult.status}
- Details: ${reputationResult.details}

Classify the URL (SAFE, SUSPICIOUS, MALICIOUS, or UNKNOWN), assign a heuristic risk score (0-100), and evaluate all indicators.`;

    const modelConfig = {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          classification: {
            type: Type.STRING,
            description: 'SAFE | SUSPICIOUS | MALICIOUS | UNKNOWN',
          },
          riskScore: {
            type: Type.INTEGER,
            description: 'Risk score from 0 to 100 (0-30 SAFE, 31-70 SUSPICIOUS, 71-100 MALICIOUS)',
          },
          confidence: {
            type: Type.INTEGER,
            description: 'Confidence level from 0 to 100',
          },
          url: {
            type: Type.STRING,
            description: 'The analyzed URL',
          },
          domain: {
            type: Type.STRING,
            description: 'The analyzed primary domain',
          },
          threatType: {
            type: Type.STRING,
            description: 'PHISHING | MALWARE | SCAM | BRAND IMPERSONATION | SUSPICIOUS WEBSITE | CREDENTIAL HARVESTING | MALICIOUS DOWNLOAD | UNKNOWN | NONE',
          },
          summary: {
            type: Type.STRING,
            description: 'Executive security assessment summary',
          },
          reasons: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Specific cybersecurity reasons and indicators explaining this result',
          },
          indicators: {
            type: Type.OBJECT,
            properties: {
              https: { type: Type.BOOLEAN },
              suspiciousDomain: { type: Type.BOOLEAN },
              brandImpersonation: { type: Type.BOOLEAN },
              phishingSignals: { type: Type.BOOLEAN },
              malwareSignals: { type: Type.BOOLEAN },
              suspiciousParameters: { type: Type.BOOLEAN },
              contentAccessible: { type: Type.BOOLEAN },
            },
            required: [
              'https',
              'suspiciousDomain',
              'brandImpersonation',
              'phishingSignals',
              'malwareSignals',
              'suspiciousParameters',
              'contentAccessible',
            ],
          },
          recommendation: {
            type: Type.STRING,
            description: 'Actionable user guidance for this risk profile',
          },
          technicalDetails: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Detailed technical signals observed during analysis',
          },
          limitations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Known limitations or unavailable data points during this inspection',
          },
        },
        required: [
          'classification',
          'riskScore',
          'confidence',
          'url',
          'domain',
          'threatType',
          'summary',
          'reasons',
          'indicators',
          'recommendation',
          'technicalDetails',
          'limitations',
        ],
      },
    };

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: userPrompt,
        config: modelConfig,
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.warn('gemini-3.1-flash-lite unavailable, attempting gemini-3.8-flash fallback:', errMsg);
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: modelConfig,
      });
    }

    const textOutput = response.text?.trim();
    if (!textOutput) {
      throw new Error('Gemini model returned empty response.');
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(textOutput);
    } catch {
      throw new Error('Unable to parse threat analysis JSON structure.');
    }

    // Clamp risk score to 0 - 100
    const rawScore = Number(parsedResult.riskScore) || 0;
    const clampedScore = Math.max(0, Math.min(100, Math.round(rawScore)));

    // Ensure valid classification
    let classification = parsedResult.classification?.toUpperCase();
    if (!['SAFE', 'SUSPICIOUS', 'MALICIOUS', 'UNKNOWN'].includes(classification)) {
      if (clampedScore <= 30) classification = 'SAFE';
      else if (clampedScore <= 70) classification = 'SUSPICIOUS';
      else classification = 'MALICIOUS';
    }

    // Enrich with domain info and verified inspection state
    const domainInfo = {
      submittedUrl: trimmedUrl,
      normalizedUrl: parsedUrl.href,
      domain,
      protocol: parsedUrl.protocol.replace(':', '').toUpperCase(),
      hostname,
      pathname,
      queryParamsCount,
      hasIpHost: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(hostname),
      subdomainCount: Math.max(0, hostParts.length - domain.split('.').length),
    };

    const finalResult = {
      ...parsedResult,
      classification,
      riskScore: clampedScore,
      url: parsedUrl.href,
      domain,
      domainInfo,
      externalReputation: reputationResult,
      inspectedAt: new Date().toISOString(),
      pageInspectionStatus: pageInspection.accessible ? 'FETCHED' : (pageInspection.errorReason ? 'UNREACHABLE' : 'SKIPPED'),
      indicators: {
        ...parsedResult.indicators,
        https: isHttps,
        contentAccessible: pageInspection.accessible,
      },
    };

    return res.json(finalResult);
  } catch (error: unknown) {
    console.error('Threat analysis error:', error);
    const errObj = error as { status?: number; message?: string };
    const status = errObj.status || 500;
    const message = errObj.message || 'An unexpected error occurred during link analysis.';

    return res.status(status >= 400 && status < 600 ? status : 500).json({
      error: message.includes('API_KEY') ? 'Gemini API authentication issue. Please verify GEMINI_API_KEY configuration.' : message,
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ThreadMind AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
