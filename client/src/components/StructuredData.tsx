import { useEffect } from "react";

interface StructuredDataProps {
  type: 'Website' | 'Organization' | 'Service' | 'Course' | 'WebPage' | 'Product' | 'LocalBusiness';
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
  url: "https://danbizzarromethod.com",
  logo: "https://danbizzarromethod.com/attached_assets/Logo-trasparenteRAST_1749385353493.png",
  description: "Professional eventing coaching and horse training services by international event rider Dan Bizzarro",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Crown Farm",
    addressLocality: "Ascott-Under-Wychwood",
    addressRegion: "Oxfordshire",
    postalCode: "OX7",
    addressCountry: "GB"
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+447767291713",
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

// LocalBusiness schema with proper NAP (Name, Address, Phone) formatting
export const localBusinessData = {
  "@type": "LocalBusiness",
  name: "Dan Bizzarro Method",
  description: "Professional equestrian coaching specialising in eventing, show jumping, dressage, cross country, and pole work training. Olympic-shortlisted international event rider offering private lessons, group clinics, and virtual coaching.",
  url: "https://danbizzarromethod.com",
  logo: "https://danbizzarromethod.com/attached_assets/Logo-trasparenteRAST_1749385353493.png",
  image: "https://danbizzarromethod.com/attached_assets/Logo-trasparenteRAST_1749385353493.png",
  telephone: "+447767291713",
  email: "dan@danbizzarromethod.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Crown Farm",
    addressLocality: "Ascott-Under-Wychwood",
    addressRegion: "Oxfordshire",
    postalCode: "OX7",
    addressCountry: "GB"
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "51.8656",
    longitude: "-1.5653"
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "08:00",
      closes: "18:00"
    }
  ],
  priceRange: "££",
  currenciesAccepted: "GBP",
  paymentAccepted: "Cash, Credit Card, Debit Card, Bank Transfer",
  areaServed: {
    "@type": "Place",
    name: "United Kingdom"
  },
  serviceArea: {
    "@type": "GeoCircle",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: "51.8656",
      longitude: "-1.5653"
    },
    geoRadius: "50000"
  },
  founder: {
    "@type": "Person",
    name: "Dan Bizzarro",
    jobTitle: "International Event Rider & Eventing Coach",
    description: "Olympic-shortlisted international event rider with over 20 years of competition experience. Former student of British eventing legend William Fox-Pitt."
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
  url: "https://danbizzarromethod.com",
  description: "Professional eventing coaching, stride calculator, and competition preparation tools",
  publisher: organizationData,
  potentialAction: {
    "@type": "SearchAction",
    target: "https://danbizzarromethod.com?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};