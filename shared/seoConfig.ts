/**
 * Centralized SEO Configuration
 * 
 * This file contains all SEO metadata for every page in the application.
 * Each route maps to unique titles, descriptions, canonical URLs, keywords,
 * H1 text, and structured data configurations.
 */

export interface PageSEOConfig {
  title: string;
  description: string;
  keywords: string;
  canonicalPath: string;
  h1: string;
  ogImage?: string;
  schemas?: Array<{
    type: 'Service' | 'WebPage' | 'FAQPage' | 'BreadcrumbList';
    data: Record<string, any>;
  }>;
}

const BASE_URL = 'https://danbizzarromethod.com';

export const getCanonicalUrl = (path: string): string => {
  return `${BASE_URL}${path}`;
};

export const seoConfig: Record<string, PageSEOConfig> = {
  // Home Page
  '/': {
    title: 'Dan Bizzarro Method – International Eventing Coach & Training Clinics',
    description: 'Olympic-shortlisted international event rider Dan Bizzarro offers expert eventing coaching, private lessons, group clinics, and virtual training. Based in Oxfordshire, UK, specialising in dressage, show jumping, cross country, and pole work.',
    keywords: 'Dan Bizzarro Method, international eventing coach, Olympic eventing, private horse riding lessons, group clinics, virtual riding lessons, dressage training, show jumping coach, cross country coaching, pole work training, Oxfordshire equestrian coach',
    canonicalPath: '/',
    h1: 'Dan Bizzarro Method',
    ogImage: '/hero-background.jpg'
  },

  // Coaching Pages
  '/coaching/private-lessons': {
    title: 'Private Horse Riding Lessons in Oxfordshire | Dan Bizzarro Method',
    description: 'Book one-to-one horse riding lessons with Olympic-shortlisted event rider Dan Bizzarro in Ascott-Under-Wychwood, Oxfordshire. Tailored coaching for beginners to advanced riders in dressage, show jumping and cross country.',
    keywords: 'private horse riding lessons, private eventing coach, one-to-one riding lessons, personalised equestrian coaching, Oxfordshire riding lessons, dressage lessons, show jumping lessons, cross country lessons, Dan Bizzarro private coaching, Ascott-Under-Wychwood',
    canonicalPath: '/coaching/private-lessons',
    h1: 'Private Horse Riding Lessons in Oxfordshire',
    ogImage: '/hero-background.jpg'
  },

  '/coaching/clinics': {
    title: 'Eventing Clinics & Group Riding Lessons in Oxfordshire | Dan Bizzarro Method',
    description: 'Join our show-jumping, pole work and cross-country clinics in Oxfordshire. Small group sessions led by Dan Bizzarro help riders build confidence, refine technique and prepare for competitions.',
    keywords: 'horse riding clinics, show jumping clinics, polework clinics, cross country clinics, eventing clinics, gymnastic jumping, grid work exercises, group riding lessons, Dan Bizzarro clinics, Oxfordshire riding clinics',
    canonicalPath: '/coaching/clinics',
    h1: 'Eventing Clinics & Group Riding Lessons',
    ogImage: '/hero-background.jpg'
  },

  '/coaching/remote-coaching': {
    title: 'Virtual Riding Lessons – Live Online Coaching with Dan Bizzarro',
    description: 'Train from anywhere with live virtual riding lessons using Pivo or your preferred video system. Get instant feedback from Dan Bizzarro and improve your dressage, show-jumping or cross-country skills.',
    keywords: 'virtual riding lessons, remote equestrian coaching, online horse training, video riding analysis, virtual eventing coach, online dressage lessons, remote show jumping coaching, worldwide riding instruction, Dan Bizzarro virtual coaching, Pivo lessons',
    canonicalPath: '/coaching/remote-coaching',
    h1: 'Virtual Riding Lessons',
    ogImage: '/hero-background.jpg'
  },

  '/coaching/dressage': {
    title: 'Dressage Coaching in Oxfordshire | Improve Your Scores',
    description: 'Develop rhythm, suppleness and balance with expert dressage coaching in Oxfordshire. Learn classical techniques and prepare for eventing tests with Dan Bizzarro Method.',
    keywords: 'dressage coaching, dressage training, dressage lessons, eventing dressage, competition dressage, dressage technique, flatwork training, Dan Bizzarro dressage, Oxfordshire dressage coach, improve dressage scores',
    canonicalPath: '/coaching/dressage',
    h1: 'Dressage Coaching',
    ogImage: '/hero-background.jpg'
  },

  '/coaching/show-jumping': {
    title: 'Show Jumping Coaching in Oxfordshire | Jump Clear with Confidence',
    description: 'Master grid work, course walking and jump technique with show-jumping coaching from Dan Bizzarro Method. Suitable for riders from BE80 to international level.',
    keywords: 'show jumping coaching, show jumping lessons, eventing show jumping, jumping technique, gridwork exercises, show jumping clinics, competition jumping, Dan Bizzarro show jumping, Oxfordshire jumping coach, BE80 to international',
    canonicalPath: '/coaching/show-jumping',
    h1: 'Show Jumping Coaching',
    ogImage: '/hero-background.jpg'
  },

  '/coaching/cross-country': {
    title: 'Cross-Country Riding Lessons | Build Boldness & Safety',
    description: 'Learn how to tackle water complexes, ditches and banks with confidence. Cross-country coaching in Oxfordshire with Dan Bizzarro Method helps you read terrain and ride boldly.',
    keywords: 'cross country coaching, cross country training, eventing cross country, cross country lessons, XC coaching, natural obstacles, cross country technique, competition XC, Dan Bizzarro cross country, Oxfordshire XC coach, water complexes, ditches, banks',
    canonicalPath: '/coaching/cross-country',
    h1: 'Cross-Country Riding Lessons',
    ogImage: '/hero-background.jpg'
  },

  '/coaching/polework': {
    title: 'Polework Training | Gymnastic Exercises & Grid Work | Dan Bizzarro Method',
    description: 'Professional polework and gymnastic jumping training with Dan Bizzarro. Improve rhythm, balance, suppleness, and jumping technique through systematic pole exercises and grid work. Suitable for all levels and disciplines.',
    keywords: 'polework training, pole exercises, gymnastic jumping, grid work, pole work exercises, jumping grids, flatwork poles, cavaletti training, Dan Bizzarro polework, Oxfordshire pole work coaching',
    canonicalPath: '/coaching/polework',
    h1: 'Polework Training',
    ogImage: '/hero-background.jpg'
  },

  // Main Pages
  '/about': {
    title: 'About Dan Bizzarro | International Event Rider & Coach',
    description: 'Meet Dan Bizzarro, Olympic-shortlisted international event rider and professional eventing coach. Former student of William Fox-Pitt with over 20 years of competition experience from novice to 4-star level.',
    keywords: 'Dan Bizzarro, international event rider, Olympic eventing, William Fox-Pitt, professional eventing coach, 4-star eventer, British Eventing, international equestrian, eventing biography',
    canonicalPath: '/about',
    h1: 'About Dan Bizzarro',
    ogImage: '/hero-background.jpg'
  },

  '/contact': {
    title: 'Contact Dan Bizzarro | Book Lessons & Clinics',
    description: 'Contact Dan Bizzarro Method to book private lessons, group clinics, or virtual coaching. Based at Crown Farm, Ascott-Under-Wychwood, Oxfordshire. Phone: +44 7767 291713 | Email: dan@danbizzarromethod.com',
    keywords: 'contact Dan Bizzarro, book riding lessons, book eventing clinic, riding lesson enquiries, Ascott-Under-Wychwood, Oxfordshire equestrian coach contact, Dan Bizzarro phone, equestrian coaching enquiries',
    canonicalPath: '/contact',
    h1: 'Contact Us',
    ogImage: '/hero-background.jpg'
  },

  '/gallery': {
    title: 'Gallery | Dan Bizzarro Method Coaching Photos',
    description: 'View photos from Dan Bizzarro Method coaching sessions, clinics, and competitions. See our training facilities, happy riders, and successful partnerships in action across Oxfordshire and beyond.',
    keywords: 'Dan Bizzarro photos, eventing gallery, coaching photos, clinic photos, riding lesson images, equestrian photography, competition photos, training facilities Oxfordshire',
    canonicalPath: '/gallery',
    h1: 'Photo Gallery',
    ogImage: '/hero-background.jpg'
  },

  '/news': {
    title: 'Eventing News & Tips | Dan Bizzarro Method',
    description: 'Latest eventing news, training tips, and insights from Dan Bizzarro Method. Read about upcoming clinics, competition results, coaching advice, and equestrian industry news from our Oxfordshire coaching base.',
    keywords: 'Dan Bizzarro news, eventing news, clinic updates, competition results, training tips, equestrian blog, riding advice, coaching updates, Oxfordshire equestrian news, eventing tips',
    canonicalPath: '/news',
    h1: 'Eventing News & Tips',
    ogImage: '/hero-background.jpg'
  },

  '/podcast': {
    title: 'Our Equestrian Life Podcast | Dan Bizzarro Method',
    description: 'Listen to Our Equestrian Life podcast hosted by Dan Bizzarro, featuring industry experts, accomplished riders, and passionate equestrian enthusiasts. Available on Spotify and Apple Podcasts.',
    keywords: 'Our Equestrian Life, equestrian podcast, Dan Bizzarro podcast, horse riding podcast, eventing podcast, equestrian interviews, riding podcast, horse training podcast',
    canonicalPath: '/podcast',
    h1: 'Our Equestrian Life Podcast',
    ogImage: '/hero-background.jpg'
  },

  // Interactive Tools
  '/readiness-quiz': {
    title: 'Eventing Readiness Quiz – Assess Your Competition Prep',
    description: 'Take our eventing readiness quiz to see if you and your horse are prepared for competition. Identify strengths and areas for improvement before your next event.',
    keywords: 'eventing quiz, readiness assessment, competition preparation, eventing readiness, horse competition quiz, training assessment, competition readiness test, Dan Bizzarro quiz, competition prep',
    canonicalPath: '/readiness-quiz',
    h1: 'Eventing Readiness Quiz',
    ogImage: '/hero-background.jpg'
  },

  '/stride-calculator': {
    title: 'Horse Stride Calculator for Jumping Distances | Dan Bizzarro Method',
    description: 'Use our free horse stride calculator to measure distances between jumps and plan your show-jumping course. Suitable for riders of all levels.',
    keywords: 'stride calculator, equestrian distance calculator, show jumping distances, related distances, gymnastic grid calculator, fence spacing, course design tool, jumping distances, eventing stride calculator, horse stride calculator',
    canonicalPath: '/stride-calculator',
    h1: 'Horse Stride Calculator',
    ogImage: '/hero-background.jpg'
  },

  '/packing-list': {
    title: 'Competition Packing List Generator | Horse Show Checklist',
    description: 'Create customised packing lists for horse shows and eventing competitions. Never forget essential tack, equipment, or documents. Professional checklist tool from Dan Bizzarro Method.',
    keywords: 'competition packing list, horse show checklist, eventing packing list, competition checklist, tack list, show preparation, competition essentials, horse show preparation',
    canonicalPath: '/packing-list',
    h1: 'Packing List Generator',
    ogImage: '/hero-background.jpg'
  },

  // Other Pages
  '/terms-and-conditions': {
    title: 'Terms & Conditions | Dan Bizzarro Method',
    description: 'Terms and conditions for Dan Bizzarro Method coaching services, clinics, and liability information. Important information for all participants and clients.',
    keywords: 'terms and conditions, coaching terms, clinic terms, liability, equestrian coaching terms, Dan Bizzarro terms',
    canonicalPath: '/terms-and-conditions',
    h1: 'Terms & Conditions',
    ogImage: '/hero-background.jpg'
  },

  '/loyalty': {
    title: 'Loyalty Points Programme | Earn Rewards & Discounts | Dan Bizzarro Method',
    description: 'Earn 10 points per clinic, unlock 20% discount codes at 50 points, and compete for bi-annual prizes. Share your referral code to earn 20 bonus points when friends join!',
    keywords: 'loyalty programme, clinic rewards, loyalty points, coaching rewards, Dan Bizzarro loyalty, clinic benefits, referral rewards, discount codes, equestrian loyalty programme, rider rewards',
    canonicalPath: '/loyalty',
    h1: 'Loyalty Rewards Programme',
    ogImage: '/hero-background.jpg'
  }
};

/**
 * Get SEO configuration for a specific route
 */
export const getSEOConfig = (path: string): PageSEOConfig => {
  // Normalize path (remove trailing slash except for home)
  const normalizedPath = path === '/' ? '/' : path.replace(/\/$/, '');
  
  return seoConfig[normalizedPath] || seoConfig['/'];
};
