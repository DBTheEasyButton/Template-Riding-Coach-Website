/**
 * Centralized SEO Configuration
 * 
 * TEMPLATE: This file contains SEO metadata for specific pages.
 * Update all business names, descriptions, and URLs for your coaching business.
 * Most pages use shared/seoConfig.ts - this file is for additional pages.
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

// TEMPLATE: Update with your domain
const BASE_URL = 'https://your-coaching-business.com';

export const getCanonicalUrl = (path: string): string => {
  return `${BASE_URL}${path}`;
};

// TEMPLATE: Update all SEO content below with your business details
export const seoConfig: Record<string, PageSEOConfig> = {
  // Home Page
  '/': {
    title: 'Your Coaching Business | Equestrian Coach & Horse Training',
    description: 'Professional equestrian coaching offering private lessons, clinics, and online courses. Dressage, show jumping, cross country coaching.',
    keywords: 'equestrian coach, horse training, private horse riding lessons, group clinics, virtual riding lessons, dressage training, show jumping coach, cross country coaching, pole work training',
    canonicalPath: '/',
    h1: 'Your Coaching Business',
    ogImage: '/hero-background.jpg'
  },

  // Coaching Pages
  '/coaching/private-lessons': {
    title: 'Private Horse Riding Lessons | Your Coaching Business',
    description: 'One-to-one private riding lessons with Olympic-shortlisted international event rider Your Coach. Personalised coaching for all levels from beginner to advanced in dressage, show jumping, and cross country. Based in Your Area, UK.',
    keywords: 'private horse riding lessons, private eventing coach, one-to-one riding lessons, personalised equestrian coaching, Your Area riding lessons, dressage lessons, show jumping lessons, cross country lessons, Your Coach private coaching',
    canonicalPath: '/coaching/private-lessons',
    h1: 'Private Riding Lessons',
    ogImage: '/hero-background.jpg'
  },

  '/coaching/clinics': {
    title: 'Horse Riding Clinics | Show Jumping, Polework & Cross Country | Your Coach',
    description: 'Join Your Coach\'s professional riding clinics in Your Area. Specialising in show jumping, pole work, cross country, and gymnastic jumping exercises. Single-day intensive sessions for riders of all levels from beginner to international.',
    keywords: 'horse riding clinics, show jumping clinics, polework clinics, cross country clinics, eventing clinics, gymnastic jumping, grid work exercises, group riding lessons, Your Coach clinics, Your Area riding clinics',
    canonicalPath: '/coaching/clinics',
    h1: 'Coaching Clinics',
    ogImage: '/hero-background.jpg'
  },

  '/coaching/remote-coaching': {
    title: 'Virtual Riding Lessons & Remote Equestrian Coaching | Your Coaching Business',
    description: 'Professional remote equestrian coaching with Olympic-shortlisted event rider Your Coach. Video analysis, personalised training plans, and virtual lessons for riders worldwide. Expert guidance from anywhere in the world.',
    keywords: 'virtual riding lessons, remote equestrian coaching, online horse training, video riding analysis, virtual eventing coach, online dressage lessons, remote show jumping coaching, worldwide riding instruction, Your Coach virtual coaching',
    canonicalPath: '/coaching/remote-coaching',
    h1: 'Remote Coaching',
    ogImage: '/hero-background.jpg'
  },

  '/coaching/dressage': {
    title: 'Dressage Coaching & Training | Your Coaching Business',
    description: 'Expert dressage coaching from international event rider Your Coach. Improve suppleness, rhythm, balance, and precision for competition success. Private lessons and clinics available in Your Area for all levels.',
    keywords: 'dressage coaching, dressage training, dressage lessons, eventing dressage, competition dressage, dressage technique, flatwork training, Your Coach dressage, Your Area dressage coach',
    canonicalPath: '/coaching/dressage',
    h1: 'Dressage Coaching',
    ogImage: '/hero-background.jpg'
  },

  '/coaching/show-jumping': {
    title: 'Show Jumping Coaching | Eventing & Competition Training | Your Coach',
    description: 'Professional show jumping coaching with Olympic-shortlisted event rider Your Coach. Master jumping technique, gridwork, related distances, and course riding. Private lessons and clinics in Your Area for all levels.',
    keywords: 'show jumping coaching, show jumping lessons, eventing show jumping, jumping technique, gridwork exercises, show jumping clinics, competition jumping, Your Coach show jumping, Your Area jumping coach',
    canonicalPath: '/coaching/show-jumping',
    h1: 'Show Jumping Coaching',
    ogImage: '/hero-background.jpg'
  },

  '/coaching/cross-country': {
    title: 'Cross Country Coaching | Eventing Training | Your Coaching Business',
    description: 'Expert cross country coaching from international event rider Your Coach. Build confidence and skills over natural obstacles, tackle technical questions, and master competition courses. Private lessons and clinics in Your Area.',
    keywords: 'cross country coaching, cross country training, eventing cross country, cross country lessons, XC coaching, natural obstacles, cross country technique, competition XC, Your Coach cross country, Your Area XC coach',
    canonicalPath: '/coaching/cross-country',
    h1: 'Cross Country Coaching',
    ogImage: '/hero-background.jpg'
  },

  '/coaching/polework': {
    title: 'Polework Training | Gymnastic Exercises & Grid Work | Your Coaching Business',
    description: 'Professional polework and gymnastic jumping training with Your Coach. Improve rhythm, balance, suppleness, and jumping technique through systematic pole exercises and grid work. Suitable for all levels and disciplines.',
    keywords: 'polework training, pole exercises, gymnastic jumping, grid work, pole work exercises, jumping grids, flatwork poles, cavaletti training, Your Coach polework, Your Area pole work coaching',
    canonicalPath: '/coaching/polework',
    h1: 'Polework Training',
    ogImage: '/hero-background.jpg'
  },

  // Main Pages
  '/about': {
    title: 'About Your Coach | International Event Rider & Coach',
    description: 'Meet Your Coach, Olympic-shortlisted international event rider and professional eventing coach. Former student of William Fox-Pitt with over 20 years of competition experience from novice to 4-star level.',
    keywords: 'Your Coach, international event rider, Olympic eventing, William Fox-Pitt, professional eventing coach, 4-star eventer, British Eventing, international equestrian, eventing biography',
    canonicalPath: '/about',
    h1: 'About Your Coach',
    ogImage: '/hero-background.jpg'
  },

  '/contact': {
    title: 'Contact Your Coach | Book Lessons & Clinics',
    description: 'Contact Your Coaching Business to book private lessons, group clinics, or virtual coaching. Based at Crown Farm, Ascott-Under-Wychwood, Your Area. Phone: +1234567890 | Email: info@your-coaching-business.com',
    keywords: 'contact Your Coach, book riding lessons, book eventing clinic, riding lesson enquiries, Ascott-Under-Wychwood, Your Area equestrian coach contact, Your Coach phone, equestrian coaching enquiries',
    canonicalPath: '/contact',
    h1: 'Contact Us',
    ogImage: '/hero-background.jpg'
  },

  '/gallery': {
    title: 'Gallery | Your Coaching Business Coaching Photos',
    description: 'View photos from Your Coaching Business coaching sessions, clinics, and competitions. See our training facilities, happy riders, and successful partnerships in action across Your Area and beyond.',
    keywords: 'Your Coach photos, eventing gallery, coaching photos, clinic photos, riding lesson images, equestrian photography, competition photos, training facilities Your Area',
    canonicalPath: '/gallery',
    h1: 'Photo Gallery',
    ogImage: '/hero-background.jpg'
  },

  '/news': {
    title: 'Horse Training Blog & Tips | Your Coaching Business',
    description: 'Expert horse training tips, eventing advice, and riding insights from international event rider Your Coach. Free articles on dressage, jumping, and horse care.',
    keywords: 'horse training blog, eventing tips, riding advice, dressage tips, show jumping tips, horse care articles, equestrian blog, Your Coach blog, training tips',
    canonicalPath: '/news',
    h1: 'Training Blog',
    ogImage: '/hero-background.jpg'
  },

  '/blog': {
    title: 'Horse Training Blog & Tips | Your Coaching Business',
    description: 'Expert horse training tips, eventing advice, and riding insights from international event rider Your Coach. Free articles on dressage, jumping, and horse care.',
    keywords: 'horse training blog, eventing tips, riding advice, dressage tips, show jumping tips, horse care articles, equestrian blog, Your Coach blog, training tips',
    canonicalPath: '/blog',
    h1: 'Training Blog',
    ogImage: '/hero-background.jpg'
  },

  // Other Pages
  '/terms-and-conditions': {
    title: 'Terms & Conditions | Your Coaching Business',
    description: 'Terms and conditions for Your Coaching Business coaching services, clinics, and liability information. Important information for all participants and clients.',
    keywords: 'terms and conditions, coaching terms, clinic terms, liability, equestrian coaching terms, Your Coach terms',
    canonicalPath: '/terms-and-conditions',
    h1: 'Terms & Conditions',
    ogImage: '/hero-background.jpg'
  },

  '/loyalty': {
    title: 'Loyalty Rewards Programme | Your Coaching Business',
    description: 'Join the Your Coaching Business loyalty programme and earn rewards with every clinic booking. Get stamps for attending clinics and unlock exclusive benefits.',
    keywords: 'loyalty programme, clinic rewards, loyalty stamps, coaching rewards, Your Coach loyalty, clinic benefits',
    canonicalPath: '/loyalty',
    h1: 'Loyalty Rewards',
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
