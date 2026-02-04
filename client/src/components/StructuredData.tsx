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
  name: "Your Coaching Business",
  url: "https://your-coaching-business.com",
  logo: "https://your-coaching-business.com/attached_assets/Black Vintage Illustrative Club Horse Club Logo (5)_1764213371424.png",
  description: "Professional eventing coaching and horse training services by international event rider Your Coach",
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
    telephone: "+1234567890",
    email: "info@your-coaching-business.com",
    contactType: "customer service"
  },
  sameAs: [
    "https://www.facebook.com/YOUR-BUSINESS",
    "https://www.instagram.com/YOUR-BUSINESS",
    "https://www.twitter.com/YOUR-BUSINESS",
    "https://www.youtube.com/YOUR-BUSINESS"
  ]
};

// LocalBusiness schema with proper NAP (Name, Address, Phone) formatting
export const localBusinessData = {
  "@type": "LocalBusiness",
  name: "Your Coaching Business",
  description: "Professional equestrian coaching specialising in eventing, show jumping, dressage, cross country, and pole work training. Olympic-shortlisted international event rider offering private lessons, group clinics, and virtual coaching.",
  url: "https://your-coaching-business.com",
  logo: "https://your-coaching-business.com/attached_assets/Black Vintage Illustrative Club Horse Club Logo (5)_1764213371424.png",
  image: "https://your-coaching-business.com/attached_assets/Black Vintage Illustrative Club Horse Club Logo (5)_1764213371424.png",
  telephone: "+1234567890",
  email: "info@your-coaching-business.com",
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
    name: "Your Coach",
    jobTitle: "International Event Rider & Eventing Coach",
    description: "Olympic-shortlisted international event rider with over 20 years of competition experience. Former student of British eventing legend William Fox-Pitt."
  },
  sameAs: [
    "https://www.facebook.com/YOUR-BUSINESS",
    "https://www.instagram.com/YOUR-BUSINESS",
    "https://www.twitter.com/YOUR-BUSINESS",
    "https://www.youtube.com/YOUR-BUSINESS"
  ]
};

export const websiteData = {
  name: "Your Coaching Business",
  url: "https://your-coaching-business.com",
  description: "Professional eventing coaching, stride calculator, and competition preparation tools",
  publisher: organizationData,
  potentialAction: {
    "@type": "SearchAction",
    target: "https://your-coaching-business.com?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};