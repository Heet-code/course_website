import React, { useEffect } from 'react';

export const CloudflareAnalytics: React.FC = () => {
  useEffect(() => {
    const token = import.meta.env.VITE_CLOUDFLARE_WEB_ANALYTICS_TOKEN;
    
    // Inject the script if we have a valid token (in production environment or for testing if valid format)
    // We only inject if it's not the placeholder.
    if (token && token !== 'replace_with_real_cloudflare_token') {
      // Prevent multiple injections if component remounts
      if (document.querySelector('script[src*="cloudflareinsights.com/beacon.min.js"]')) {
        return;
      }

      const script = document.createElement('script');
      script.defer = true;
      script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
      script.setAttribute('data-cf-beacon', `{"token": "${token}"}`);
      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, []);

  return null; // This component doesn't render any UI
};
