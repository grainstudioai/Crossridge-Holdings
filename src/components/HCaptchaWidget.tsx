import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

declare global {
  interface Window {
    hcaptcha?: {
      render: (container: HTMLElement, params: Record<string, unknown>) => string;
      reset: (widgetId?: string) => void;
      getResponse: (widgetId?: string) => string;
    };
  }
}

export interface HCaptchaWidgetHandle {
  reset: () => void;
}

interface HCaptchaWidgetProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
}

// Web3Forms' own shared, zero-config hCaptcha site key for free-plan accounts
// (documented at https://docs.web3forms.com/... "hCaptcha" page). It is not a
// secret — it's meant to be used client-side by any Web3Forms free-plan
// site — so no signup or per-site key is required. VITE_HCAPTCHA_SITE_KEY can
// override it if this project ever moves to a paid Web3Forms plan with a
// dedicated hCaptcha site.
const WEB3FORMS_SHARED_SITE_KEY = '50b2fe65-b00b-4b9e-ad62-3ba471098be2';

export function getHCaptchaSiteKey(): string {
  return (import.meta.env.VITE_HCAPTCHA_SITE_KEY as string | undefined) || WEB3FORMS_SHARED_SITE_KEY;
}

// Renders an hCaptcha challenge. Web3Forms validates the resulting token
// server-side (hCaptcha is enabled on the Web3Forms dashboard's Security
// Settings) before relaying the email — that server-side check is what
// actually stops scripted spam submissions, not anything client-side.
export const HCaptchaWidget = forwardRef<HCaptchaWidgetHandle, HCaptchaWidgetProps>(
  ({ onVerify, onExpire }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const siteKey = getHCaptchaSiteKey();

    useEffect(() => {
      if (!siteKey || !containerRef.current) return;
      let cancelled = false;

      const tryRender = () => {
        if (cancelled || !window.hcaptcha || !containerRef.current || widgetIdRef.current) {
          return;
        }
        widgetIdRef.current = window.hcaptcha.render(containerRef.current, {
          sitekey: siteKey,
          callback: onVerify,
          'expired-callback': () => onExpire?.(),
          'error-callback': () => onExpire?.(),
        });
      };

      if (window.hcaptcha) {
        tryRender();
      } else {
        const interval = window.setInterval(() => {
          if (window.hcaptcha) {
            window.clearInterval(interval);
            tryRender();
          }
        }, 250);
        return () => {
          cancelled = true;
          window.clearInterval(interval);
        };
      }

      return () => {
        cancelled = true;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [siteKey]);

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (window.hcaptcha && widgetIdRef.current) {
          window.hcaptcha.reset(widgetIdRef.current);
        }
      },
    }));

    if (!siteKey) return null;

    return <div ref={containerRef} className="flex justify-center py-1" />;
  }
);

HCaptchaWidget.displayName = 'HCaptchaWidget';
