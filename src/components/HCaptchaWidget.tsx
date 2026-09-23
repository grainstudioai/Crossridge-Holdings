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

// Renders an hCaptcha challenge tied to VITE_HCAPTCHA_SITE_KEY. Its matching
// secret key lives only in the Web3Forms dashboard (never in this codebase),
// which validates the token server-side before relaying the email — this is
// what actually stops scripted spam submissions, not anything client-side.
export const HCaptchaWidget = forwardRef<HCaptchaWidgetHandle, HCaptchaWidgetProps>(
  ({ onVerify, onExpire }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const siteKey = import.meta.env.VITE_HCAPTCHA_SITE_KEY as string | undefined;

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
