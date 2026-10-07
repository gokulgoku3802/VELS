import { DomainInfo } from '../types/threat';

export interface ValidationResult {
  isValid: boolean;
  normalizedUrl: string;
  error?: string;
  domainInfo?: DomainInfo;
}

const COMMON_SUSPICIOUS_TLDS = [
  '.tk', '.ml', '.ga', '.cf', '.gq', '.top', '.xyz', '.buzz', '.fit', '.work',
  '.rest', '.bar', '.country', '.kim', '.stream', '.gdn', '.mom', '.monster',
  '.sbs', '.cam', '.cfd', '.icu', '.click'
];

export function validateAndNormalizeUrl(rawInput: string): ValidationResult {
  const trimmed = rawInput.trim();

  if (!trimmed) {
    return {
      isValid: false,
      normalizedUrl: '',
      error: 'Please enter a URL to analyze.',
    };
  }

  // Reject input with whitespace inside
  if (/\s/.test(trimmed)) {
    return {
      isValid: false,
      normalizedUrl: '',
      error: 'URLs cannot contain spaces. Please check the address.',
    };
  }

  // Automatically prepend https:// if missing
  let candidate = trimmed;
  if (!/^https?:\/\//i.test(candidate)) {
    // If it starts with another protocol like ftp or javascript, reject or flag
    if (/^[a-zA-Z0-9_-]+:\/\//i.test(candidate)) {
      if (!/^https?:\/\//i.test(candidate)) {
        return {
          isValid: false,
          normalizedUrl: '',
          error: 'Only HTTP and HTTPS URLs are supported.',
        };
      }
    } else {
      candidate = `https://${candidate}`;
    }
  }

  try {
    const parsed = new URL(candidate);

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return {
        isValid: false,
        normalizedUrl: '',
        error: 'Only HTTP and HTTPS protocols are supported for threat analysis.',
      };
    }

    const hostname = parsed.hostname.toLowerCase();

    // Must have a dot in hostname unless it's localhost or an IP
    const isIpv4 = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(hostname);
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

    if (!hostname || (!hostname.includes('.') && !isLocalhost)) {
      return {
        isValid: false,
        normalizedUrl: '',
        error: 'Invalid domain name. Please include a valid hostname (e.g. example.com).',
      };
    }

    // Extract domain (rough eTLD+1 extraction)
    const hostParts = hostname.split('.');
    let domain = hostname;
    if (hostParts.length >= 2 && !isIpv4) {
      // Check for two-part ccTLDs like .co.uk, .com.au, .gov.br
      const secondLast = hostParts[hostParts.length - 2];
      if (['co', 'com', 'org', 'net', 'edu', 'gov'].includes(secondLast) && hostParts.length >= 3) {
        domain = hostParts.slice(-3).join('.');
      } else {
        domain = hostParts.slice(-2).join('.');
      }
    }

    const searchParams = parsed.searchParams;
    let queryParamsCount = 0;
    searchParams.forEach(() => {
      queryParamsCount++;
    });

    const hasUncommonTld = COMMON_SUSPICIOUS_TLDS.some(tld => hostname.endsWith(tld));
    const subdomainCount = Math.max(0, hostParts.length - (domain.split('.').length));

    const domainInfo: DomainInfo = {
      submittedUrl: rawInput.trim(),
      normalizedUrl: parsed.href,
      domain,
      protocol: parsed.protocol.replace(':', '').toUpperCase(),
      hostname,
      pathname: parsed.pathname || '/',
      queryParamsCount,
      hasIpHost: isIpv4,
      hasUncommonTld,
      subdomainCount,
    };

    return {
      isValid: true,
      normalizedUrl: parsed.href,
      domainInfo,
    };
  } catch {
    return {
      isValid: false,
      normalizedUrl: '',
      error: 'The entered link could not be parsed as a valid URL.',
    };
  }
}
