// Delivers lead form submissions straight to info@crossridgeholdingsllc.com via Web3Forms.
// GitHub Pages only serves static files, so this replaces the old fetch('/api/leads') call,
// which pointed at an Express endpoint (server.ts) that never actually sends mail and
// isn't even running in production.
//
// Setup: create a free form at https://web3forms.com pointed at
// info@crossridgeholdingsllc.com, then set VITE_WEB3FORMS_ACCESS_KEY (see .env.example).
// For spam protection, also enable hCaptcha on that Web3Forms form (its secret key is
// configured in the Web3Forms dashboard, never in this codebase) and set
// VITE_HCAPTCHA_SITE_KEY to the matching public site key.

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const RECIPIENT_EMAIL = 'info@crossridgeholdingsllc.com';

// Fields are plain form values, never raw email headers, but we still strip
// CR/LF so nothing a visitor types can inject extra headers into the outgoing
// email (classic "email header injection" via a Subject/From built from
// unsanitized user input).
function sanitizeForHeader(value: string, maxLen = 200): string {
  return value.replace(/[\r\n]+/g, ' ').trim().slice(0, maxLen);
}

export function generateLeadRefId(): string {
  return 'CRH-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

const RATE_LIMIT_KEY = 'crh_last_lead_submit_at';
const RATE_LIMIT_WINDOW_MS = 45_000;

// Client-side throttle: stops accidental double-submits and naive repeated
// automation through the UI. It is NOT a security boundary by itself — a
// scripted attacker can call the Web3Forms API directly, bypassing this
// entirely, which is why real protection also relies on the honeypot field,
// hCaptcha, and Web3Forms' own server-side spam filtering / rate limits.
export function isRateLimited(): boolean {
  try {
    const last = Number(localStorage.getItem(RATE_LIMIT_KEY) || 0);
    return Date.now() - last < RATE_LIMIT_WINDOW_MS;
  } catch {
    return false;
  }
}

function markSubmitted(): void {
  try {
    localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
  } catch {
    // ignore (private browsing / storage disabled)
  }
}

export interface SubmitLeadOptions {
  /** Honeypot field value — if non-empty, a bot filled a field real users never see. */
  honeypot?: string;
  /** hCaptcha response token from the widget, required if hCaptcha is configured. */
  captchaToken?: string;
}

export async function submitLead(
  subject: string,
  fields: Record<string, unknown>,
  options: SubmitLeadOptions = {}
): Promise<{ ok: boolean; refId: string; reason?: string }> {
  const refId = generateLeadRefId();

  // Silently "succeed" from the bot's perspective (don't reveal the honeypot
  // exists) but never actually send anything.
  if (options.honeypot) {
    return { ok: false, refId, reason: 'honeypot' };
  }

  if (isRateLimited()) {
    return { ok: false, refId, reason: 'rate_limited' };
  }

  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined;
  if (!accessKey) {
    console.error(
      'VITE_WEB3FORMS_ACCESS_KEY is not set — lead was NOT emailed. See .env.example.'
    );
    return { ok: false, refId, reason: 'not_configured' };
  }

  const captchaSiteKey = import.meta.env.VITE_HCAPTCHA_SITE_KEY as string | undefined;
  if (captchaSiteKey && !options.captchaToken) {
    return { ok: false, refId, reason: 'captcha_required' };
  }

  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        subject: sanitizeForHeader(subject),
        from_name: 'Crossridge Holdings Website',
        reference_id: refId,
        ...(options.captchaToken ? { 'h-captcha-response': options.captchaToken } : {}),
        ...fields,
      }),
    });

    const data = await res.json();
    markSubmitted();
    return { ok: res.ok && data.success === true, refId, reason: data.message };
  } catch (err) {
    console.error('Lead submission to Web3Forms failed:', err);
    return { ok: false, refId, reason: 'network_error' };
  }
}

export function buildMailtoLink(subject: string, body: string): string {
  return `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(sanitizeForHeader(subject))}&body=${encodeURIComponent(body)}`;
}
