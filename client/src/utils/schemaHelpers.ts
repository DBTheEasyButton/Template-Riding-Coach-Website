/**
 * Schema Helper Utilities
 * 
 * Helper functions to generate structured data (JSON-LD) schemas
 * for various page types: Service, Breadcrumb, FAQ, WebPage
 */

// TEMPLATE: Update this URL with your domain
const BASE_URL = 'https://your-coaching-business.com';

interface ServiceSchemaOptions {
  name: string;
  description: string;
  serviceType: string;
  url: string;
  areaServed?: string | Record<string, any>;
  provider?: {
    name: string;
    url: string;
  };
}

/**
 * Generate Service schema for coaching pages
 */
export const createServiceSchema = (options: ServiceSchemaOptions) => {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: options.name,
    description: options.description,
    serviceType: options.serviceType,
    url: `${BASE_URL}${options.url}`,
    areaServed: options.areaServed || {
      "@type": "Country",
      name: "United Kingdom"
    },
    // TEMPLATE: Update provider details with your business information
    provider: options.provider || {
      "@type": "LocalBusiness",
      name: "Your Coaching Business",
      url: BASE_URL,
      telephone: "+1234567890",
      email: "info@your-coaching-business.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Your Address",
        addressLocality: "Your City",
        addressRegion: "Your Region",
        postalCode: "12345",
        addressCountry: "GB"
      }
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "GBP"
    }
  };
};

interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generate BreadcrumbList schema for navigation
 */
export const createBreadcrumbSchema = (items: BreadcrumbItem[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`
    }))
  };
};

/**
 * Generate breadcrumb items from path
 */
export const getBreadcrumbsFromPath = (path: string, pageTitle: string): BreadcrumbItem[] => {
  const items: BreadcrumbItem[] = [
    { name: "Home", url: "/" }
  ];

  // Remove leading/trailing slashes and split
  const segments = path.replace(/^\/|\/$/g, '').split('/').filter(Boolean);

  // Build breadcrumb trail
  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Convert segment to readable name
    let name = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Special cases
    if (segment === 'coaching') name = 'Coaching';
    
    // Use page title for last segment
    if (index === segments.length - 1) {
      name = pageTitle;
    }

    items.push({ name, url: currentPath });
  });

  return items;
};

interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Generate FAQPage schema
 */
export const createFAQSchema = (faqs: FAQItem[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };
};

/**
 * Generate WebPage schema
 */
export const createWebPageSchema = (options: {
  name: string;
  description: string;
  url: string;
  breadcrumb?: BreadcrumbItem[];
}) => {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: options.name,
    description: options.description,
    url: `${BASE_URL}${options.url}`
  };

  if (options.breadcrumb) {
    schema.breadcrumb = createBreadcrumbSchema(options.breadcrumb);
  }

  return schema;
};

/**
 * Coaching Service Configurations
 */
export const coachingServices = {
  privateLessons: createServiceSchema({
    name: "Private Horse Riding Lessons",
    description: "One-to-one private riding lessons with Olympic-shortlisted international event rider Your Coach. Personalised coaching for all levels from beginner to advanced in dressage, show jumping, and cross country.",
    serviceType: "Private Coaching",
    url: "/coaching/private-lessons"
  }),

  clinics: createServiceSchema({
    name: "Horse Riding Clinics",
    description: "Professional riding clinics specialising in show jumping, pole work, cross country, and gymnastic jumping exercises. Single-day intensive sessions for riders of all levels.",
    serviceType: "Group Training",
    url: "/coaching/clinics"
  }),

  remoteCoaching: createServiceSchema({
    name: "Virtual Riding Lessons & Remote Coaching",
    description: "Professional remote equestrian coaching with video analysis, personalised training plans, and virtual lessons for riders worldwide.",
    serviceType: "Online Coaching",
    url: "/coaching/remote-coaching",
    areaServed: {
      "@type": "Place",
      name: "Worldwide"
    }
  }),

  dressage: createServiceSchema({
    name: "Dressage Coaching & Training",
    description: "Expert dressage coaching to improve suppleness, rhythm, balance, and precision for competition success. Private lessons and clinics available for all levels.",
    serviceType: "Dressage Training",
    url: "/coaching/dressage"
  }),

  showJumping: createServiceSchema({
    name: "Show Jumping Coaching",
    description: "Professional show jumping coaching to master jumping technique, gridwork, related distances, and course riding. Private lessons and clinics for all levels.",
    serviceType: "Show Jumping Training",
    url: "/coaching/show-jumping"
  }),

  crossCountry: createServiceSchema({
    name: "Cross Country Coaching",
    description: "Expert cross country coaching to build confidence and skills over natural obstacles, tackle technical questions, and master competition courses.",
    serviceType: "Cross Country Training",
    url: "/coaching/cross-country"
  }),

  polework: createServiceSchema({
    name: "Polework & Gymnastic Training",
    description: "Professional polework and gymnastic jumping training to improve rhythm, balance, suppleness, and jumping technique through systematic pole exercises and grid work.",
    serviceType: "Polework Training",
    url: "/coaching/polework"
  })
};
