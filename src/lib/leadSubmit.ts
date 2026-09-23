// Delivers lead form submissions straight to info@crossridgeholdingsllc.com via Web3Forms.
// GitHub Pages only serves static files, so this replaces the old fetch('/api/leads') call,
// which pointed at an Express endpoint (server.ts) that never actually sends mail and
// isn't even running in production.
//
// Setup: create a free form at https://web3forms.com pointed at
// info@crossridgeholdingsllc.com, then set VITE_WEB3FORMS_ACCESS_KEY (see .env.example).

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const RECIPIENT_EMAIL = 'info@crossridgeholdingsllc.com';

export function generateLeadRefId(): string {
  return 'CRH-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function submitLead(
  subject: string,
  fields: Record<string, unknown>
): Promise<{ ok: boolean; refId: string }> {
  const refId = generateLeadRefId();
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined;

  if (!accessKey) {
    console.error(
      'VITE_WEB3FORMS_ACCESS_KEY is not set — lead was NOT emailed. See .env.example.'
    );
    return { ok: false, refId };
  }

  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        subject,
        from_name: 'Crossridge Holdings Website',
        reference_id: refId,
        ...fields,
      }),
    });

    const data = await res.json();
    return { ok: res.ok && data.success === true, refId };
  } catch (err) {
    console.error('Lead submission to Web3Forms failed:', err);
    return { ok: false, refId };
  }
}

export function buildMailtoLink(subject: string, body: string): string {
  return `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
