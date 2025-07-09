import { useEffect } from "react";

interface StructuredDataProps {
  type: 'Website' | 'Organization' | 'Service' | 'Course' | 'WebPage';
  data: Record<string, any>;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": type,
      ...data
    };
    
    script.innerHTML = JSON.stringify(structuredData, null, 2);
    
    // Remove any existing structured data script for this type
    const existing = document.querySelector(`script[type="application/ld+json"][data-type="${type}"]`);
    if (existing) {
      existing.remove();
    }
    
    script.setAttribute('data-type', type);
    document.head.appendChild(script);
    
    return () => {
      script.remove();
    };
  }, [type, data]);
  
  return null;
}

// Common structured data configurations
export const organizationData = {
  name: "Dan Bizzarro Method",
  url: "https://dan-bizzarro.replit.app",
  logo: "https://dan-bizzarro.replit.app/attached_assets/Logo-trasparenteRAST_1749385353493.png",
  description: "Professional eventing coaching and horse training services by international event rider Dan Bizzarro",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ascott-Under-Wychwood",
    addressRegion: "Oxfordshire",
    addressCountry: "GB"
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+44-7xxx-xxx-xxx",
    email: "dan@danbizzarromethod.com",
    contactType: "customer service"
  },
  sameAs: [
    "https://www.facebook.com/danbizzarromethod",
    "https://www.instagram.com/danbizzarromethod",
    "https://www.twitter.com/danbizzarro",
    "https://www.youtube.com/danbizzarromethod"
  ]
};

export const websiteData = {
  name: "Dan Bizzarro Method",
  url: "https://dan-bizzarro.replit.app",
  description: "Professional eventing coaching, stride calculator, and competition preparation tools",
  publisher: organizationData,
  potentialAction: {
    "@type": "SearchAction",
    target: "https://dan-bizzarro.replit.app?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};