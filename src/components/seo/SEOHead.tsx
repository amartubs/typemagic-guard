
import React from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  schema?: Record<string, any>;
}

const SEOHead = ({
  title = 'Shoale - Secure Authentication Through Keystroke Biometrics',
  description = 'Add an invisible layer of security to your application with advanced behavioral biometrics that can\'t be stolen or duplicated.',
  keywords = ['keystroke biometrics', 'behavioral authentication', 'security', 'biometric authentication', 'fraud prevention'],
  ogImage = '/og-image.png',
  canonical,
  schema
}: SEOHeadProps) => {
  React.useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords.join(', '));
    
    // Open Graph tags
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:image', `${window.location.origin}${ogImage}`, 'property');
    updateMetaTag('og:url', window.location.href, 'property');
    updateMetaTag('og:type', 'website', 'property');
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image', 'name');
    updateMetaTag('twitter:title', title, 'name');
    updateMetaTag('twitter:description', description, 'name');
    updateMetaTag('twitter:image', `${window.location.origin}${ogImage}`, 'name');

    // Canonical URL
    if (canonical) {
      updateCanonicalLink(canonical);
    }

    // Structured data
    if (schema) {
      updateStructuredData(schema);
    }
  }, [title, description, keywords, ogImage, canonical, schema]);

  return null;
};

const updateMetaTag = (name: string, content: string, attribute: 'name' | 'property' = 'name') => {
  let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    document.head.appendChild(meta);
  }
  
  meta.content = content;
};

const updateCanonicalLink = (href: string) => {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  
  link.href = href;
};

const updateStructuredData = (schema: Record<string, any>) => {
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
};

export default SEOHead;
