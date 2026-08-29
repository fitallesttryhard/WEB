import React, { useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';

export default function SeoAnalyticsInjector() {
  const { settings } = useSettings();

  useEffect(() => {
    // 1. Inject Google Search Console Verification Meta Tag
    const gscCode = settings.gscVerificationCode?.trim() || '';
    let gscMeta = document.querySelector('meta[name="google-site-verification"]');

    if (gscCode) {
      // Extract content string if user pasted full tag: <meta name="google-site-verification" content="XYZ" />
      let contentVal = gscCode;
      const contentMatch = gscCode.match(/content=["']([^"']+)["']/i);
      if (contentMatch && contentMatch[1]) {
        contentVal = contentMatch[1];
      }

      if (!gscMeta) {
        gscMeta = document.createElement('meta');
        gscMeta.setAttribute('name', 'google-site-verification');
        document.head.appendChild(gscMeta);
      }
      gscMeta.setAttribute('content', contentVal);
    }

    // 2. Inject Google Analytics 4 (GA4 gtag.js)
    const gaId = settings.gaMeasurementId?.trim() || '';
    const gaScriptId = 'ga4-gtag-script';
    const gaInlineId = 'ga4-inline-script';

    let gaScript = document.getElementById(gaScriptId) as HTMLScriptElement | null;
    let gaInline = document.getElementById(gaInlineId) as HTMLScriptElement | null;

    if (gaId) {
      if (!gaScript) {
        gaScript = document.createElement('script');
        gaScript.id = gaScriptId;
        gaScript.async = true;
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
        document.head.appendChild(gaScript);
      } else {
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
      }

      if (!gaInline) {
        gaInline = document.createElement('script');
        gaInline.id = gaInlineId;
        document.head.appendChild(gaInline);
      }
      gaInline.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}');
      `;
    } else {
      if (gaScript) gaScript.remove();
      if (gaInline) gaInline.remove();
    }

    // 3. Inject Custom Header Scripts (if any)
    const customScripts = settings.customHeaderScripts?.trim() || '';
    const customScriptId = 'custom-header-user-scripts';
    let customContainer = document.getElementById(customScriptId);

    if (customScripts) {
      if (!customContainer) {
        customContainer = document.createElement('div');
        customContainer.id = customScriptId;
        document.head.appendChild(customContainer);
      }
      customContainer.innerHTML = customScripts;
    } else if (customContainer) {
      customContainer.remove();
    }
  }, [settings.gaMeasurementId, settings.gscVerificationCode, settings.customHeaderScripts]);

  return null;
}
