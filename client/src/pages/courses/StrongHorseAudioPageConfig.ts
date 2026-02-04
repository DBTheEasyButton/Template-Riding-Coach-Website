export interface HeroConfig {
  badge: string;
  badgeClassName: string;
  primaryButton: {
    text: string;
    icon?: 'headphones' | 'gift' | 'arrow';
    className: string;
  };
  secondaryButton?: {
    text: string;
    href?: string;
  };
}

export interface PricingOverride {
  price: string;
  originalPrice?: string;
  badge?: string;
  buttonText: string;
}

export interface CTAStripConfig {
  selfGuidedText: string;
  showChallenge: boolean;
  showMentorship: boolean;
}

export interface StrongHorseAudioPageConfig {
  isDiscountMode: boolean;
  discountCode?: string;
  hero: HeroConfig;
  pricingOverrides?: {
    'self-guided'?: PricingOverride;
  };
  ctaStrip: CTAStripConfig;
  seo: {
    title: string;
    description: string;
    canonical: string;
  };
}

export const defaultConfig: StrongHorseAudioPageConfig = {
  isDiscountMode: false,
  hero: {
    badge: '6-Lesson Audio Course',
    badgeClassName: 'bg-amber-400 text-navy',
    primaryButton: {
      text: 'Try a Free Audio Lesson',
      icon: 'headphones',
      className: 'bg-orange hover:bg-orange-hover text-white',
    },
    secondaryButton: {
      text: 'START THE COURSE NOW',
      href: '#pricing',
    },
  },
  ctaStrip: {
    selfGuidedText: 'Audio Course Only — £97',
    showChallenge: true,
    showMentorship: true,
  },
  seo: {
    title: 'From Strong to Light and Soft Audio Course | Your Coaching Business',
    description: 'Transform your heavy, rushing horse into a soft, balanced partner in 28 days with our listen-while-you-ride audio course.',
    canonical: '/courses/strong-horse-audio',
  },
};

export const discountConfig: StrongHorseAudioPageConfig = {
  isDiscountMode: true,
  discountCode: 'DAN25',
  hero: {
    badge: '🎉 25% OFF — Just for You',
    badgeClassName: 'bg-green-500 text-white',
    primaryButton: {
      text: 'GET YOUR DISCOUNT — £72',
      icon: 'gift',
      className: 'bg-green-600 hover:bg-green-700 text-white',
    },
  },
  pricingOverrides: {
    'self-guided': {
      price: '£72',
      originalPrice: '£97',
      badge: '25% OFF',
      buttonText: 'Get Course — £72',
    },
  },
  ctaStrip: {
    selfGuidedText: 'Audio Course Only — £72 (was £97)',
    showChallenge: false,
    showMentorship: false,
  },
  seo: {
    title: 'Special Offer - 25% OFF Audio Course | Your Coaching Business',
    description: 'Exclusive offer: Get the "From Strong to Light and Soft in 28 Days" audio course for £72 (was £97). Transform your horse\'s responsiveness with proven techniques.',
    canonical: '/courses/strong-horse-audio-offer',
  },
};
