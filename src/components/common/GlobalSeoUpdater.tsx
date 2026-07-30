import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const GlobalSeoUpdater: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Upsert Helper for Meta Tags
    const upsertMeta = (nameAttr: 'name' | 'property', attrVal: string, content: string) => {
      let el = document.querySelector(`meta[${nameAttr}="${attrVal}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(nameAttr, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 2. Ensure Author & Publisher Meta Tags
    upsertMeta('name', 'author', 'Sumit DigiTech');
    upsertMeta('name', 'publisher', 'Sumit DigiTech');

    // 3. Ensure Robots Meta Tag
    let robotsEl = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!robotsEl || !robotsEl.getAttribute('content')) {
      upsertMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    }

    // 4. Ensure Keywords Meta Tag
    let kwEl = document.querySelector('meta[name="keywords"]') as HTMLMetaElement | null;
    if (!kwEl || !kwEl.getAttribute('content')) {
      upsertMeta('name', 'keywords', 'Digital Marketing Agency Jaipur, SEO Company Jaipur, Performance Marketing, Pay Per Click Ads, Web Development Jaipur, Social Media Marketing, Sumit DigiTech, Growth Agency India');
    }

    // 5. Dynamic Canonical Link Tag
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }

    // Set full active canonical URL
    const currentOrigin = window.location.origin || 'https://sumitdigitech.com';
    const cleanPath = pathname === '/' ? '' : pathname;
    canonical.setAttribute('href', `${currentOrigin}${cleanPath}`);

  }, [pathname]);

  return null;
};
