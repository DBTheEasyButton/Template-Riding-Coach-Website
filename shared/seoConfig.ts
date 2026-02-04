/**
 * Centralized SEO Configuration
 * 
 * This file contains all SEO metadata for every page in the application.
 * Each route maps to unique titles, descriptions, canonical URLs, keywords,
 * H1 text, and structured data configurations.
 * 
 * TEMPLATE: Update these values for your specific coaching business
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

// TEMPLATE: Update this to your domain
export const BASE_URL = 'https://your-coaching-business.com';

export const getCanonicalUrl = (path: string): string => {
  return `${BASE_URL}${path}`;
};

export const seoConfig: Record<string, PageSEOConfig> = {
  // Home Page
  '/': {
    title: 'Your Coaching Business – Professional Equestrian Training & Clinics',
    description: 'Professional equestrian coach offering expert coaching, private lessons, group clinics, and virtual training. Specialising in dressage, show jumping, cross country, and pole work.',
    keywords: 'equestrian coach, horse riding lessons, private lessons, group clinics, virtual lessons, dressage training, show jumping coach, cross country coaching, pole work training',
    canonicalPath: '/',
    h1: 'Your Coaching Business',
    ogImage: '/hero-background.jpg'
  },

  // Coaching Pages
  '/coaching/private-lessons': {
    title: 'Private Horse Riding Lessons | Your Coaching Business',
    description: 'Book one-to-one horse riding lessons with our professional coach. Tailored coaching for beginners to advanced riders in dressage, show jumping and cross country.',
    keywords: 'private horse riding lessons, private equestrian coach, one-to-one riding lessons, personalised equestrian coaching, dressage lessons, show jumping lessons, cross country lessons',
    canonicalPath: '/coaching/private-lessons',
    h1: 'Private Horse Riding Lessons',
    ogImage: '/hero-background.jpg'
  },

  '/coaching/clinics': {
    title: 'Equestrian Clinics & Group Riding Lessons | Your Coaching Business',
    description: 'Join our show-jumping, pole work and cross-country clinics. Small group sessions help riders build confidence, refine technique and prepare for competitions.',
    keywords: 'horse riding clinics, show jumping clinics, polework clinics, cross country clinics, eventing clinics, gymnastic jumping, grid work exercises, group riding lessons',
    canonicalPath: '/coaching/clinics',
    h1: 'Equestrian Clinics & Group Riding Lessons',
    ogImage: '/hero-background.jpg'
  },

  '/coaching/remote-coaching': {
    title: 'Virtual Riding Lessons – Live Online Coaching | Your Coaching Business',
    description: 'Train from anywhere with live virtual riding lessons. Get instant feedback and improve your dressage, show-jumping or cross-country skills from the comfort of your yard.',
    keywords: 'virtual riding lessons, remote equestrian coaching, online horse training, video riding analysis, virtual coaching, online dressage lessons, remote show jumping coaching',
    canonicalPath: '/coaching/remote-coaching',
    h1: 'Virtual Riding Lessons',
    ogImage: '/hero-background.jpg'
  },

  '/coaching/dressage': {
    title: 'Dressage Coaching | Improve Your Scores | Your Coaching Business',
    description: 'Develop rhythm, suppleness and balance with expert dressage coaching. Learn classical techniques and prepare for eventing tests.',
    keywords: 'dressage coaching, dressage training, dressage lessons, eventing dressage, competition dressage, dressage technique, flatwork training',
    canonicalPath: '/coaching/dressage',
    h1: 'Dressage Coaching',
    ogImage: '/hero-background.jpg'
  },

  '/coaching/show-jumping': {
    title: 'Show Jumping Coaching | Jump Clear with Confidence | Your Coaching Business',
    description: 'Master grid work, course walking and jump technique with show-jumping coaching. Suitable for riders from beginners to advanced level.',
    keywords: 'show jumping coaching, show jumping lessons, eventing show jumping, jumping technique, gridwork exercises, show jumping clinics, competition jumping',
    canonicalPath: '/coaching/show-jumping',
    h1: 'Show Jumping Coaching',
    ogImage: '/hero-background.jpg'
  },

  '/coaching/cross-country': {
    title: 'Cross-Country Riding Lessons | Build Boldness & Safety | Your Coaching Business',
    description: 'Learn how to tackle water complexes, ditches and banks with confidence. Cross-country coaching helps you read terrain and ride boldly.',
    keywords: 'cross country coaching, cross country training, eventing cross country, cross country lessons, XC coaching, natural obstacles, cross country technique',
    canonicalPath: '/coaching/cross-country',
    h1: 'Cross-Country Riding Lessons',
    ogImage: '/hero-background.jpg'
  },

  '/coaching/polework': {
    title: 'Polework Training | Gymnastic Exercises & Grid Work | Your Coaching Business',
    description: 'Professional polework and gymnastic jumping training. Improve rhythm, balance, suppleness, and jumping technique through systematic pole exercises and grid work.',
    keywords: 'polework training, pole exercises, gymnastic jumping, grid work, pole work exercises, jumping grids, flatwork poles, cavaletti training',
    canonicalPath: '/coaching/polework',
    h1: 'Polework Training',
    ogImage: '/hero-background.jpg'
  },

  // Main Pages
  '/about': {
    title: 'About Us | Professional Equestrian Coach | Your Coaching Business',
    description: 'Meet our professional equestrian coach. With years of experience and passion for teaching, we help riders of all levels achieve their goals.',
    keywords: 'equestrian coach, professional coach, horse riding instructor, eventing coach, equestrian biography',
    canonicalPath: '/about',
    h1: 'About Us',
    ogImage: '/hero-background.jpg'
  },

  '/contact': {
    title: 'Contact Us | Book Lessons & Clinics | Your Coaching Business',
    description: 'Contact us to book private lessons, group clinics, or virtual coaching. We would love to hear from you and help you achieve your riding goals.',
    keywords: 'contact equestrian coach, book riding lessons, book clinic, riding lesson enquiries, equestrian coaching contact',
    canonicalPath: '/contact',
    h1: 'Contact Us',
    ogImage: '/hero-background.jpg'
  },

  '/gallery': {
    title: 'Gallery | Coaching Photos | Your Coaching Business',
    description: 'View photos from our coaching sessions, clinics, and competitions. See our training facilities and successful partnerships in action.',
    keywords: 'equestrian photos, coaching gallery, clinic photos, riding lesson images, equestrian photography, competition photos',
    canonicalPath: '/gallery',
    h1: 'Photo Gallery',
    ogImage: '/hero-background.jpg'
  },

  '/blog': {
    title: 'Equestrian Training Blog | Tips & Insights | Your Coaching Business',
    description: 'Expert horse training tips, equestrian insights, and coaching advice. Read about dressage, show jumping, cross country techniques and improve your riding.',
    keywords: 'equestrian blog, horse training tips, eventing blog, dressage tips, show jumping advice, cross country techniques, riding improvement',
    canonicalPath: '/blog',
    h1: 'Training Blog',
    ogImage: '/hero-background.jpg'
  },

  '/podcast': {
    title: 'Equestrian Podcast | Your Coaching Business',
    description: 'Listen to our equestrian podcast featuring industry experts, accomplished riders, and passionate equestrian enthusiasts.',
    keywords: 'equestrian podcast, horse riding podcast, eventing podcast, equestrian interviews, riding podcast, horse training podcast',
    canonicalPath: '/podcast',
    h1: 'Equestrian Podcast',
    ogImage: '/hero-background.jpg'
  },

  // Interactive Tools
  '/readiness-quiz': {
    title: 'Eventing Readiness Quiz – Assess Your Competition Prep | Your Coaching Business',
    description: 'Take our eventing readiness quiz to see if you and your horse are prepared for competition. Identify strengths and areas for improvement.',
    keywords: 'eventing quiz, readiness assessment, competition preparation, eventing readiness, horse competition quiz, training assessment',
    canonicalPath: '/readiness-quiz',
    h1: 'Eventing Readiness Quiz',
    ogImage: '/hero-background.jpg'
  },

  '/stride-calculator': {
    title: 'Horse Stride Calculator for Jumping Distances | Your Coaching Business',
    description: 'Use our free horse stride calculator to measure distances between jumps and plan your show-jumping course. Suitable for riders of all levels.',
    keywords: 'stride calculator, equestrian distance calculator, show jumping distances, related distances, gymnastic grid calculator, fence spacing',
    canonicalPath: '/stride-calculator',
    h1: 'Horse Stride Calculator',
    ogImage: '/hero-background.jpg'
  },

  '/packing-list': {
    title: 'Competition Packing List Generator | Horse Show Checklist | Your Coaching Business',
    description: 'Create customised packing lists for horse shows and eventing competitions. Never forget essential tack, equipment, or documents.',
    keywords: 'competition packing list, horse show checklist, eventing packing list, competition checklist, tack list, show preparation',
    canonicalPath: '/packing-list',
    h1: 'Packing List Generator',
    ogImage: '/hero-background.jpg'
  },

  // Other Pages
  '/terms-and-conditions': {
    title: 'Terms & Conditions | Your Coaching Business',
    description: 'Terms and conditions for our coaching services, clinics, and liability information. Important information for all participants and clients.',
    keywords: 'terms and conditions, coaching terms, clinic terms, liability, equestrian coaching terms',
    canonicalPath: '/terms-and-conditions',
    h1: 'Terms & Conditions',
    ogImage: '/hero-background.jpg'
  },

  '/loyalty': {
    title: 'Loyalty Points Programme | Earn Rewards & Discounts | Your Coaching Business',
    description: 'Earn points per clinic, unlock discount codes, and compete for prizes. Share your referral code to earn bonus points when friends join!',
    keywords: 'loyalty programme, clinic rewards, loyalty points, coaching rewards, clinic benefits, referral rewards, discount codes',
    canonicalPath: '/loyalty',
    h1: 'Loyalty Rewards Programme',
    ogImage: '/hero-background.jpg'
  },

  // Courses
  '/courses/10-points-better': {
    title: '10 Points Better Audio Course | Dressage Training | Your Coaching Business',
    description: 'Transform your dressage scores with our audio course. Master geometry, transitions, straightness and test preparation through ride-along coaching.',
    keywords: '10 points better, dressage audio course, eventing dressage training, ride along coaching, dressage improvement, horse training audio',
    canonicalPath: '/courses/10-points-better',
    h1: '10 Points Better Audio Course',
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
