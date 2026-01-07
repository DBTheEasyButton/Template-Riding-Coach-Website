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
    title: 'Dan Bizzarro Method | Eventing Coach & Horse Training UK',
    description: 'Olympic-shortlisted event rider Dan Bizzarro offers private lessons, clinics, and online courses. Dressage, show jumping, cross country coaching in Oxfordshire, UK.',
    keywords: 'Dan Bizzarro Method, international eventing coach, Olympic eventing, private horse riding lessons, group clinics, virtual riding lessons, dressage training, show jumping coach, cross country coaching, pole work training, Oxfordshire equestrian coach, horse training UK',
    canonicalPath: '/',
    h1: 'Dan Bizzarro Method',
    ogImage: '/hero-background.jpg'
  },

  // Coaching Pages
  '/coaching/private-lessons': {
    title: 'Private Horse Riding Lessons | Dan Bizzarro Method',
    description: 'One-to-one private riding lessons with Olympic-shortlisted international event rider Dan Bizzarro. Personalised coaching for all levels from beginner to advanced in dressage, show jumping, and cross country. Based in Oxfordshire, UK.',
    keywords: 'private horse riding lessons, private eventing coach, one-to-one riding lessons, personalised equestrian coaching, Oxfordshire riding lessons, dressage lessons, show jumping lessons, cross country lessons, Dan Bizzarro private coaching',
    canonicalPath: '/coaching/private-lessons',
    h1: 'Private Riding Lessons',
    ogImage: '/hero-background.jpg'
  },

  '/coaching/clinics': {
    title: 'Horse Riding Clinics | Show Jumping, Polework & Cross Country | Dan Bizzarro',
    description: 'Join Dan Bizzarro\'s professional riding clinics in Oxfordshire. Specialising in show jumping, pole work, cross country, and gymnastic jumping exercises. Single-day intensive sessions for riders of all levels from beginner to international.',
    keywords: 'horse riding clinics, show jumping clinics, polework clinics, cross country clinics, eventing clinics, gymnastic jumping, grid work exercises, group riding lessons, Dan Bizzarro clinics, Oxfordshire riding clinics',
    canonicalPath: '/coaching/clinics',
    h1: 'Coaching Clinics',
    ogImage: '/hero-background.jpg'
  },

  '/coaching/remote-coaching': {
    title: 'Virtual Riding Lessons & Remote Equestrian Coaching | Dan Bizzarro Method',
    description: 'Professional remote equestrian coaching with Olympic-shortlisted event rider Dan Bizzarro. Video analysis, personalised training plans, and virtual lessons for riders worldwide. Expert guidance from anywhere in the world.',
    keywords: 'virtual riding lessons, remote equestrian coaching, online horse training, video riding analysis, virtual eventing coach, online dressage lessons, remote show jumping coaching, worldwide riding instruction, Dan Bizzarro virtual coaching',
    canonicalPath: '/coaching/remote-coaching',
    h1: 'Remote Coaching',
    ogImage: '/hero-background.jpg'
  },

  '/coaching/dressage': {
    title: 'Dressage Coaching & Training | Dan Bizzarro Method',
    description: 'Expert dressage coaching from international event rider Dan Bizzarro. Improve suppleness, rhythm, balance, and precision for competition success. Private lessons and clinics available in Oxfordshire for all levels.',
    keywords: 'dressage coaching, dressage training, dressage lessons, eventing dressage, competition dressage, dressage technique, flatwork training, Dan Bizzarro dressage, Oxfordshire dressage coach',
    canonicalPath: '/coaching/dressage',
    h1: 'Dressage Coaching',
    ogImage: '/hero-background.jpg'
  },

  '/coaching/show-jumping': {
    title: 'Show Jumping Coaching | Eventing & Competition Training | Dan Bizzarro',
    description: 'Professional show jumping coaching with Olympic-shortlisted event rider Dan Bizzarro. Master jumping technique, gridwork, related distances, and course riding. Private lessons and clinics in Oxfordshire for all levels.',
    keywords: 'show jumping coaching, show jumping lessons, eventing show jumping, jumping technique, gridwork exercises, show jumping clinics, competition jumping, Dan Bizzarro show jumping, Oxfordshire jumping coach',
    canonicalPath: '/coaching/show-jumping',
    h1: 'Show Jumping Coaching',
    ogImage: '/hero-background.jpg'
  },

  '/coaching/cross-country': {
    title: 'Cross Country Coaching | Eventing Training | Dan Bizzarro Method',
    description: 'Expert cross country coaching from international event rider Dan Bizzarro. Build confidence and skills over natural obstacles, tackle technical questions, and master competition courses. Private lessons and clinics in Oxfordshire.',
    keywords: 'cross country coaching, cross country training, eventing cross country, cross country lessons, XC coaching, natural obstacles, cross country technique, competition XC, Dan Bizzarro cross country, Oxfordshire XC coach',
    canonicalPath: '/coaching/cross-country',
    h1: 'Cross Country Coaching',
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
    title: 'Horse Training Blog & Tips | Dan Bizzarro Method',
    description: 'Expert horse training tips, eventing advice, and riding insights from international event rider Dan Bizzarro. Free articles on dressage, jumping, and horse care.',
    keywords: 'horse training blog, eventing tips, riding advice, dressage tips, show jumping tips, horse care articles, equestrian blog, Dan Bizzarro blog, training tips',
    canonicalPath: '/news',
    h1: 'Training Blog',
    ogImage: '/hero-background.jpg'
  },

  '/blog': {
    title: 'Horse Training Blog & Tips | Dan Bizzarro Method',
    description: 'Expert horse training tips, eventing advice, and riding insights from international event rider Dan Bizzarro. Free articles on dressage, jumping, and horse care.',
    keywords: 'horse training blog, eventing tips, riding advice, dressage tips, show jumping tips, horse care articles, equestrian blog, Dan Bizzarro blog, training tips',
    canonicalPath: '/blog',
    h1: 'Training Blog',
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
  '/quiz': {
    title: 'Eventing Readiness Quiz | Assess Your Competition Preparation',
    description: 'Take our free eventing readiness quiz to assess your preparation for competition. Evaluate your training, horse fitness, mental readiness, and competitive goals with expert guidance from Dan Bizzarro.',
    keywords: 'eventing quiz, readiness assessment, competition preparation, eventing readiness, horse competition quiz, training assessment, competition readiness test, Dan Bizzarro quiz',
    canonicalPath: '/quiz',
    h1: 'Eventing Readiness Quiz',
    ogImage: '/hero-background.jpg'
  },

  '/stride-calculator': {
    title: 'Equestrian Stride Calculator | Show Jumping Distance Tool',
    description: 'Professional stride calculator for show jumping and cross country course design. Calculate distances between fences, related lines, and gymnastic grids. Essential tool for riders, trainers, and course designers.',
    keywords: 'stride calculator, equestrian distance calculator, show jumping distances, related distances, gymnastic grid calculator, fence spacing, course design tool, jumping distances, eventing stride calculator',
    canonicalPath: '/stride-calculator',
    h1: 'Stride Calculator',
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
    title: 'Loyalty Rewards Programme | Dan Bizzarro Method',
    description: 'Join the Dan Bizzarro Method loyalty programme and earn rewards with every clinic booking. Get stamps for attending clinics and unlock exclusive benefits.',
    keywords: 'loyalty programme, clinic rewards, loyalty stamps, coaching rewards, Dan Bizzarro loyalty, clinic benefits',
    canonicalPath: '/loyalty',
    h1: 'Loyalty Rewards',
    ogImage: '/hero-background.jpg'
  },

  // Course Pages
  '/courses/strong-horse-audio': {
    title: 'Fix a Strong Horse in 28 Days | Audio Training Course | Dan Bizzarro',
    description: 'Transform your strong, heavy, or rushing horse into a soft, balanced partner with this proven audio course. Listen while you ride. From £97. Start today.',
    keywords: 'strong horse training, fix rushing horse, horse pulls on reins, heavy horse solution, horse training audio course, soft horse training, balanced horse, light contact training, Dan Bizzarro Method, listen while you ride, online horse training',
    canonicalPath: '/courses/strong-horse-audio',
    h1: 'From Strong to Light and Soft (in 28 Days)',
    ogImage: '/hero-background.jpg'
  },

  '/courses/ten-points-better': {
    title: '10 Points Better Dressage Course | Improve Dressage Scores | Dan Bizzarro',
    description: 'Add 10+ points to your dressage scores with this proven training system. Improve your marks with step-by-step lessons from international event rider Dan Bizzarro.',
    keywords: '10 points better, improve dressage score, dressage training course, better dressage marks, eventing dressage, dressage improvement, Dan Bizzarro dressage, online dressage course',
    canonicalPath: '/courses/ten-points-better',
    h1: '10 Points Better Dressage Course',
    ogImage: '/hero-background.jpg'
  },

  '/guides/strong-horse': {
    title: 'FREE Strong Horse Guide | Fix a Pulling Horse | Dan Bizzarro Method',
    description: 'Download the free Strong Horse Solution guide. Learn why horses pull, rush, and feel heavy—and discover the simple fix. Instant PDF download.',
    keywords: 'strong horse guide, horse pulling on reins, horse rushes, heavy horse fix, free horse training guide, Dan Bizzarro guide, horse training PDF, soft horse solution',
    canonicalPath: '/guides/strong-horse',
    h1: 'The Strong Horse Solution Guide',
    ogImage: '/hero-background.jpg'
  },

  '/coaching/audio-lessons': {
    title: 'Audio Riding Lessons | Listen While You Ride | Dan Bizzarro Method',
    description: 'Professional audio riding lessons you can listen to while you ride. Expert coaching in your ear from international event rider Dan Bizzarro. Start training smarter.',
    keywords: 'audio riding lessons, listen while you ride, horse training audio, riding lesson audio, Dan Bizzarro audio, equestrian audio course, riding podcast lessons',
    canonicalPath: '/coaching/audio-lessons',
    h1: 'Audio Riding Lessons',
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
