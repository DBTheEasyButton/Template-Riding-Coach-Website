/**
 * SSR Content Registry
 * Contains all static page content for server-side rendering.
 * This ensures Google and AI tools can read the full page content without JavaScript.
 */

export interface SSRPageContent {
  h1: string;
  intro?: string;
  sections: {
    heading?: string;
    content: string[];
  }[];
  faqs?: { question: string; answer: string }[];
  features?: string[];
  testimonials?: { name: string; content: string }[];
  contactInfo?: {
    phone: string;
    email: string;
    address: string;
  };
}

export const ssrContent: Record<string, SSRPageContent> = {
  '/': {
    h1: 'Dan Bizzarro Method - Professional Eventing Coach in Oxfordshire',
    intro: 'Welcome to the Dan Bizzarro Method. I help horses and riders understand each other better through clear communication, confidence building, and progressive training.',
    sections: [
      {
        heading: 'What is the Dan Bizzarro Method?',
        content: [
          'A simple, structured way of helping horses and riders understand each other better.',
          'Clarity: Riders learn how to give clear instructions that horses can easily understand and follow.',
          'Confidence: Horses learn to respond without tension, and both horse and rider start to enjoy the work more.',
          'Communication: Build a partnership that feels good through progressive training and thoughtful exercises.',
          'The method comes from years of riding every type of horse, easy ones, tricky ones, sharp ones, and everything in between, and coaching thousands of riders at all levels.',
          'It blends good basics, thoughtful exercises, and progressive training so that riders feel supported and horses feel understood.',
          'Whether you ride for fun or want to be competitive, the goal is always the same: make riding easier to understand, build a partnership that feels good, and help you get the results you want without overcomplicating things.'
        ]
      },
      {
        heading: 'My Mission Is Simple',
        content: [
          'Over the course of my career, I\'ve had the pleasure of riding every type of horse and coaching thousands of pupils. I\'ve worked alongside some of the best riders and coaches in the world. At the same time, I\'ve often found myself on challenging horses and had to discover ways to communicate clearly so that they could understand and progress.',
          'This is why I dedicated myself to developing a method that works with every horse and every rider. The Dan Bizzarro Method builds confidence and creates a fun environment where horses and riders can learn and work together effectively—delivering real results, whether you\'re aiming for a win or simply want to enjoy your time in the saddle.',
          'Using this approach, I achieved some of my own dreams: representing my country at the 2025 European Championships and in several Nations Cup events. More importantly, my pupils have reached their goals, from winning competitions to discovering a deeper joy in their everyday rides.',
          'My mission is simple: to make horse riding easier to understand. I want to help riders and horses listen to each other, communicate with confidence, and build a partnership that\'s both effective and fun—so you can enjoy the journey and reach your goals together.'
        ]
      },
      {
        heading: 'Clinics, Private Lessons & Virtual Riding Lessons',
        content: [
          'Professional eventing instruction across all three disciplines.',
          'Private Horse Riding Lessons: Expert one-on-one coaching in Oxfordshire for all levels—from amateur riders to competitors.',
          'Clinics: Show-jumping, polework, and cross country clinics with single-day training for all abilities.',
          'Virtual Riding Lessons: Remote equestrian coaching with video analysis—train anywhere, anytime.'
        ]
      }
    ],
    contactInfo: {
      phone: '+44 7767 291713',
      email: 'dan@danbizzarromethod.com',
      address: 'Crown Farm, Ascott-Under-Wychwood, Oxfordshire OX7, United Kingdom'
    }
  },

  '/about': {
    h1: 'About Dan Bizzarro - International Event Rider & Professional Coach',
    intro: 'International Event Rider & Professional Coach based in Oxfordshire, UK.',
    sections: [
      {
        heading: 'Dan\'s Story',
        content: [
          'Daniele was born and grew up on the outskirts of Turin, Italy. His mother rode at a local stable, and it was there, at 9 years old, that Dan first caught the riding bug. A few years later he met the horse Fair and Square, who introduced him to Eventing and took him to CCI*.',
          'In 2007, while studying Graphic Design at university, Dan met Italian stud owner Alberto Bolaffi, who offered his Il Quadrifoglio Country Club as a base. Dan took the plunge into professional riding and has never looked back.',
          'A move to England in 2011 saw Dan working as a rider for British Eventing legend William Fox-Pitt—an invaluable experience learning from one of the most successful British event riders of all time.',
          'Since then, Dan has made the Gloucestershire/Oxfordshire area his base, where he competes for loyal owners and teaches riders of all levels. Alongside producing consistent results at national and international level, Dan has represented Italy in several Nations Cup events, with the Italian team finishing 2nd at Boekelo in 2022. In 2025, he also represented Italy at the European Championships at Blenheim.',
          'In 2024, Dan was named on the Short List for the Paris Olympic Games.'
        ]
      },
      {
        heading: 'Career Highlights',
        content: [
          '20+ Years Experience in professional eventing',
          '500+ Riders Coached at all levels',
          '2024 Olympic Short Listed for Paris Olympic Games',
          '2nd Place Nations Cup Boekelo 2022 with Italian team'
        ]
      },
      {
        heading: 'Training Philosophy',
        content: [
          'Dan\'s approach to training combines classical eventing principles with modern, rider-friendly techniques, always prioritising the welfare, understanding, and long-term development of both horse and rider. This philosophy sits at the heart of the Dan Bizzarro Method—a clear, structured way of training designed to make communication easier, build trust, and help every partnership progress with purpose.',
          'Drawing from his experience working with William Fox-Pitt, Caroline Moore, Ian Woodhead, and many other top riders and coaches, as well as competing at the highest international levels, Dan emphasises systematic progression, clear communication, and building confidence through thoughtful preparation.',
          'Whether coaching beginners or advanced competitors, Dan\'s focus remains on developing strong foundations in dressage, show jumping, and cross-country—the three disciplines that make eventing the ultimate test of horsemanship—and ensuring that every rider has a method they can rely on both at home and in competition.'
        ]
      }
    ]
  },

  '/contact': {
    h1: 'Contact Dan Bizzarro - Stay Connected',
    intro: 'Subscribe for exclusive training tips and early clinic access. Have questions? Reach out via phone, email, or WhatsApp.',
    sections: [
      {
        heading: 'Contact Information',
        content: [
          'Phone: +44 7767 291713',
          'Email: dan@danbizzarromethod.com',
          'Location: Crown Farm, Ascott-Under-Wychwood, Oxfordshire OX7, United Kingdom',
          'WhatsApp: Message on WhatsApp for quick responses',
          'Follow Dan\'s Journey: Stay updated with training tips, competition results, and behind-the-scenes content on Facebook, Instagram, Twitter, and YouTube.'
        ]
      }
    ],
    contactInfo: {
      phone: '+44 7767 291713',
      email: 'dan@danbizzarromethod.com',
      address: 'Crown Farm, Ascott-Under-Wychwood, Oxfordshire OX7, United Kingdom'
    }
  },

  '/coaching': {
    h1: 'Eventing Coaching Services - Private Lessons & Clinics',
    intro: 'Professional eventing coaching in Oxfordshire. Private lessons, group clinics, and remote coaching across dressage, show jumping, and cross country. From beginners to international competitors.',
    sections: [
      {
        heading: 'Why Train with Dan?',
        content: [
          'With over 20 years of international competition experience and a passion for helping riders communicate better with their horses, I bring unparalleled expertise to every training session. My proven methodology has helped riders at all levels achieve their competitive goals.',
          'I offer comprehensive instruction across all three eventing disciplines: flat work for foundation and dressage development, jumping for technique and confidence, and cross-country for boldness and precision over natural obstacles.',
          'Whether you\'re just starting your equestrian journey or aiming for international competition, my personalised approach ensures every rider reaches their full potential.',
          '20+ Years Experience. 500+ Riders Coached. 2024 Olympic Short Listed. 2nd Place Nations Cup Boekelo.'
        ]
      },
      {
        heading: 'Training Options',
        content: [
          'Private Lessons: One-on-one personalised instruction tailored to your specific riding goals and experience level. Features include customised training plans, individual attention, flexible scheduling, and progress tracking.',
          'Clinics: Group training sessions combining technical instruction with competitive preparation strategies. Features include multi-day intensive training, all three eventing disciplines, small group sizes, and competition preparation.',
          'Remote Coaching: Virtual coaching sessions allowing you to receive expert guidance from anywhere in the world. Features include video analysis, online consultations, worldwide availability, and flexible feedback.'
        ]
      },
      {
        heading: 'Eventing Disciplines',
        content: [
          'Flat Work & Dressage: Develop foundation skills, improve balance, and achieve harmony with your horse through classical dressage training.',
          'Show Jumping: Build confidence over fences, refine technique, and master course strategy for competitive success.',
          'Cross Country: Tackle natural obstacles with boldness and precision, developing partnership and trust at speed.'
        ]
      }
    ]
  },

  '/coaching/private-lessons': {
    h1: 'Private Horse Riding Lessons in Oxfordshire',
    intro: 'Expert one-on-one coaching in Oxfordshire for all levels. £80 per session. Personalised coaching for you and your horse.',
    sections: [
      {
        heading: 'Expert One-on-One Coaching',
        content: [
          'My private horse riding lessons in Oxfordshire offer personalised instruction using the Dan Bizzarro Method. As an international eventing coach, show jumping coach, and cross country coach, I bring over 20 years of experience to every session.',
          'Whether you\'re an amateur rider building confidence or a competitor preparing for events, each lesson is tailored to your specific goals and experience level. I cover all aspects of equestrian education—from foundational flatwork to advanced competition preparation.',
          'My equestrian lessons in Oxfordshire welcome riders from complete beginners to international level competitors. I balance technical excellence with an encouraging, supportive environment that makes learning enjoyable while achieving measurable results.'
        ]
      },
      {
        heading: 'What\'s Included',
        content: [
          'Customized training plans for your specific goals',
          'One-on-one coaching from experienced eventing coach',
          'Flexible scheduling to suit your availability',
          'Show jumping, cross country, and flatwork instruction',
          'Video analysis to track technique and progress',
          'Suitable for beginners through advanced competitors'
        ]
      },
      {
        heading: 'Why Choose Private Lessons?',
        content: [
          'Personalised Attention: Focused coaching tailored to your experience level and objectives.',
          'Flexible Scheduling: Book sessions at times that work best for you and your horse.',
          'All Levels Welcome: From amateur riders to international competitors—training for every goal.'
        ]
      },
      {
        heading: 'Session Format',
        content: [
          'Duration: Sessions typically run for 45-60 minutes, allowing time for warm-up, focused training, and cool-down while keeping your horse fresh and attentive.',
          'Frequency: Most riders schedule weekly or bi-weekly lessons for consistent progress. However, we can adjust frequency based on your goals, budget, and schedule.',
          'Location: Lessons are available at my base in Oxfordshire or at your own facility within a reasonable travel distance. Travel fees may apply for external locations.'
        ]
      }
    ],
    features: [
      'Customized training plans for your specific goals',
      'One-on-one coaching from experienced eventing coach',
      'Flexible scheduling to suit your availability',
      'Show jumping, cross country, and flatwork instruction',
      'Video analysis to track technique and progress',
      'Suitable for beginners through advanced competitors'
    ],
    faqs: [
      { question: 'How much do private horse riding lessons cost in Oxfordshire?', answer: 'My private riding lessons cost £80 per session. This includes personalised one-on-one coaching in dressage, show jumping, cross country, or polework, tailored to your specific goals and experience level.' },
      { question: 'What experience level do I need for private riding lessons?', answer: 'Private lessons are suitable for all levels, from complete beginners to international competitors. I tailor the coaching to your current ability and goals.' },
      { question: 'Where do private riding lessons take place?', answer: 'Private riding lessons are held in Ascott-Under-Wychwood, Oxfordshire, at Crown Farm. For riders outside the local area, virtual lessons are also available.' },
      { question: 'What disciplines can I learn in private lessons?', answer: 'Private lessons cover all three eventing disciplines: dressage (flatwork), show jumping, and cross country. You can also focus specifically on polework and gymnastic grid exercises.' }
    ],
    testimonials: [
      { name: 'Sarah M.', content: 'The one-on-one attention in private lessons has transformed my riding. Dan identified issues I didn\'t even know I had and gave me clear exercises to fix them.' },
      { name: 'Emma T.', content: 'After just three private sessions, my horse and I were communicating so much better. The personalised approach makes all the difference.' },
      { name: 'Rachel H.', content: 'Worth every penny. Dan\'s ability to break down complex movements into simple steps helped me finally master my canter transitions.' }
    ]
  },

  '/coaching/remote-coaching': {
    h1: 'Virtual Riding Lessons - Live Online Coaching',
    intro: 'Live coaching from anywhere using video technology like Pivo. £80 per session. Real-time feedback as you ride.',
    sections: [
      {
        heading: 'What Are Virtual Riding Lessons?',
        content: [
          'My virtual riding lessons use live video technology like Pivo to bring the Dan Bizzarro Method directly to you. I watch you and your horse in real-time on my laptop while you wear earbuds to hear my coaching as you ride—just like an in-person lesson, but from anywhere in the world.',
          'This remote coaching format uses systems like Pivo that automatically track and follow you as you ride, streaming live video to me. You hear my voice through wireless earbuds, receiving immediate corrections, encouragement, and technical guidance exactly when you need it. It\'s truly live coaching—not video submission and feedback.',
          'Whether you\'re an amateur rider building confidence or a competitor preparing for events, I provide real-time instruction across all disciplines—dressage, show jumping, cross country, and polework—from beginner to international level, all from your own training facility.'
        ]
      },
      {
        heading: 'What\'s Included',
        content: [
          'Live coaching via video systems like Pivo',
          'Real-time feedback as you ride',
          'Available worldwide - train from anywhere',
          'Wear earbuds to hear coaching while you ride',
          'I watch you live on my laptop',
          'Personalized instruction tailored to your level'
        ]
      },
      {
        heading: 'How Live Virtual Lessons Work',
        content: [
          'Step 1 - Setup Your System: Use a video system like Pivo that tracks you as you ride and streams live video.',
          'Step 2 - Connect Online: Join a video call where I can see you and your horse in real-time.',
          'Step 3 - Wear Earbuds: Put in wireless earbuds so you can hear my coaching as you ride.',
          'Step 4 - Ride & Learn: I coach you live, watching on my laptop and giving immediate feedback.'
        ]
      },
      {
        heading: 'Benefits of Live Virtual Coaching',
        content: [
          'Train Anywhere: Access live expert coaching regardless of your location.',
          'Real-Time Coaching: Get immediate feedback as you ride, just like an in-person lesson.',
          'Live Communication: Two-way conversation during your session for instant guidance.'
        ]
      },
      {
        heading: 'Equipment You\'ll Need',
        content: [
          'Video System: A device like Pivo that tracks and follows you, streaming live video.',
          'Wireless Earbuds: Any Bluetooth earbuds that stay secure while riding.',
          'Stable Internet: Reliable WiFi or mobile data connection at your training facility.',
          'Video Call App: Zoom, FaceTime, WhatsApp video, or similar platform.'
        ]
      }
    ],
    features: [
      'Live coaching via video systems like Pivo',
      'Real-time feedback as you ride',
      'Available worldwide - train from anywhere',
      'Wear earbuds to hear coaching while you ride',
      'I watch you live on my laptop',
      'Personalized instruction tailored to your level'
    ],
    faqs: [
      { question: 'How much do virtual riding lessons cost?', answer: 'My virtual riding lessons cost £80 per session. This is the same price as in-person lessons, providing you with live, real-time coaching from anywhere in the world.' },
      { question: 'How do virtual riding lessons work?', answer: 'Virtual lessons are LIVE coaching sessions using video technology like Pivo. I watch you ride in real-time on my laptop while you wear wireless earbuds to hear my coaching. This is NOT video submission with delayed feedback; it\'s real-time, interactive coaching.' },
      { question: 'What equipment do I need for virtual lessons?', answer: 'You\'ll need a video system like Pivo that can track and follow you as you ride, wireless earbuds (like AirPods), and a stable internet connection at your riding facility.' },
      { question: 'Can I have virtual lessons if I\'m outside the UK?', answer: 'Absolutely! Virtual lessons are available worldwide. I work with riders across different time zones and countries.' }
    ],
    testimonials: [
      { name: 'Amanda J.', content: 'Living in Scotland, I never thought I\'d access coaching of this quality. The virtual lessons via Pivo work brilliantly—it\'s like Dan is right there in the arena with me.' },
      { name: 'Michelle R.', content: 'Sceptical at first, but the live coaching through my earbuds is incredibly effective. Dan spots everything and the real-time feedback is invaluable.' },
      { name: 'Laura B.', content: 'As a busy mum living in Texas, virtual lessons fit perfectly into my schedule. No travel time, same quality coaching. Absolutely game-changing!' }
    ]
  },

  '/coaching/clinics': {
    h1: 'Eventing Clinics & Group Riding Lessons in Oxfordshire',
    intro: 'Join my show-jumping, polework, and cross country clinics. Small group sessions focusing on building confidence and improving technique for all abilities.',
    sections: [
      {
        heading: 'Upcoming Clinics',
        content: [
          'Book your place at one of my upcoming clinics. Small group sessions focusing on show jumping, polework, and cross country.',
          'All clinics take place at quality venues across Oxfordshire with excellent facilities.',
          'Each clinic provides focused instruction in a supportive environment where you can learn alongside other riders.'
        ]
      },
      {
        heading: 'What to Expect',
        content: [
          'Small group sizes for personalised attention',
          'All three eventing disciplines covered',
          'Suitable for all ability levels',
          'Expert coaching using the Dan Bizzarro Method',
          'Earn loyalty points with every clinic attendance'
        ]
      }
    ]
  },

  '/coaching/dressage': {
    h1: 'Dressage & Flatwork Coaching in Oxfordshire',
    intro: 'Develop foundation skills, improve balance, and achieve harmony with your horse through classical dressage training with Dan Bizzarro.',
    sections: [
      {
        heading: 'Flatwork & Dressage Training',
        content: [
          'Dressage forms the foundation of all good riding. My flatwork coaching focuses on developing clear communication, balance, and harmony between horse and rider.',
          'Whether you\'re working on basic transitions or advanced movements, I help riders understand how to give clear, consistent aids that horses can easily follow.',
          'The Dan Bizzarro Method emphasises progressive training that builds confidence without tension, creating a partnership that feels good for both horse and rider.'
        ]
      }
    ]
  },

  '/coaching/show-jumping': {
    h1: 'Show Jumping Coaching in Oxfordshire',
    intro: 'Build confidence over fences, refine technique, and master course strategy for competitive success with professional show jumping coaching.',
    sections: [
      {
        heading: 'Show Jumping Training',
        content: [
          'My show jumping coaching develops confident, accurate jumping through progressive exercises and clear instruction.',
          'From gridwork and related distances to course walking and competition preparation, I cover all aspects of show jumping.',
          'The focus is always on building a secure, balanced position and developing the horse\'s confidence and technique together.'
        ]
      }
    ]
  },

  '/coaching/cross-country': {
    h1: 'Cross Country Coaching in Oxfordshire',
    intro: 'Tackle natural obstacles with boldness and precision, developing partnership and trust at speed with expert cross country training.',
    sections: [
      {
        heading: 'Cross Country Training',
        content: [
          'Cross country is where eventing comes alive. My coaching helps riders develop the confidence and skills to tackle natural obstacles with boldness and precision.',
          'I focus on building trust between horse and rider, developing effective position for galloping and jumping, and teaching riders to read courses and ride efficient lines.',
          'Training progresses systematically, ensuring both horse and rider are confident at each stage before moving up.'
        ]
      }
    ]
  },

  '/coaching/polework': {
    h1: 'Polework Training & Exercises in Oxfordshire',
    intro: 'Improve rhythm, balance, and coordination through targeted polework exercises designed to enhance flatwork and jumping skills.',
    sections: [
      {
        heading: 'Polework Training',
        content: [
          'Polework is an invaluable training tool that benefits every horse and rider. My polework sessions develop rhythm, balance, and coordination.',
          'From simple ground pole exercises to more complex grids, polework helps horses become more adjustable and riders develop better feel for distance and stride.',
          'Regular polework improves both flatwork and jumping by encouraging horses to use their bodies correctly and engage their hindquarters.'
        ]
      }
    ]
  },

  '/podcast': {
    h1: 'Our Equestrian Life Podcast - Dan Bizzarro',
    intro: 'Your portal to the world of all things equestrian. Listen on Spotify and Apple Podcasts.',
    sections: [
      {
        heading: 'Welcome to Our Equestrian Life',
        content: [
          'Welcome to your portal to the world of all things equestrian.',
          'I\'m your host Dan Bizzarro and in each episode, we embark on a journey alongside industry experts, accomplished riders, and passionate enthusiasts.',
          'We get to know them and we learn from their experiences and vast knowledge, gaining a deeper understanding of the equestrian way of life.'
        ]
      },
      {
        heading: 'What You\'ll Discover',
        content: [
          'Industry Experts: Learn from accomplished riders and industry professionals who share their expertise and insights from years of experience in the equestrian world.',
          'Personal Stories: Discover inspiring journeys and experiences from passionate equestrian enthusiasts who share their unique paths in the riding world.',
          'Deep Knowledge: Gain a deeper understanding of the equestrian way of life through engaging conversations covering training, competition, and horsemanship.'
        ]
      },
      {
        heading: 'Listen Now',
        content: [
          'Subscribe to Our Equestrian Life on Spotify and Apple Podcasts.',
          'Never miss an episode and join our growing community of equestrian enthusiasts.'
        ]
      }
    ]
  },

  '/tools/stride-calculator': {
    h1: 'Horse Stride Calculator - Equestrian Distance Tool',
    intro: 'Professional equestrian tool for calculating stride distances. Determine precise pole and jump spacing based on horse size and exercise type.',
    sections: [
      {
        heading: 'Stride Calculator',
        content: [
          'Calculate accurate stride distances for polework, gridwork, and course distances.',
          'Enter your horse\'s height and the type of exercise to get precise measurements.',
          'Results show distance in both metres and yards, plus walking steps for setting up exercises.',
          'Suitable for all horse sizes from small ponies to large horses.'
        ]
      },
      {
        heading: 'Exercise Types',
        content: [
          'Walk Poles: Spacing for ground pole exercises at walk.',
          'Trot Poles: Optimal distances for trot pole exercises.',
          'Canter Poles: Correct spacing for canter pole work.',
          'Gridwork: Bounce, one-stride, two-stride, and related distance calculations.',
          'Course Distances: Competition stride calculations for show jumping courses.'
        ]
      }
    ]
  },

  '/tools/readiness-quiz': {
    h1: 'Riding Readiness Quiz - Assess Your Training Level',
    intro: 'Take the readiness quiz to assess your current riding level and get personalised recommendations for your training journey.',
    sections: [
      {
        heading: 'Readiness Quiz',
        content: [
          'Assess your current riding level and identify areas for improvement.',
          'Answer questions about your riding experience, goals, and current challenges.',
          'Receive personalised recommendations based on your responses.',
          'Discover which Dan Bizzarro Method coaching option is right for you.'
        ]
      }
    ]
  },

  '/tools/packing-list': {
    h1: 'Horse Show Packing List Generator',
    intro: 'Generate a customised packing list for horse shows and competitions. Never forget essential equipment again.',
    sections: [
      {
        heading: 'Packing List Generator',
        content: [
          'Create a comprehensive packing list tailored to your competition needs.',
          'Select your competition type: dressage, show jumping, eventing, or clinic.',
          'Get a complete checklist including tack, rider equipment, horse care items, and paperwork.',
          'Save and customise your list for future events.'
        ]
      }
    ]
  },

  '/gallery': {
    h1: 'Gallery - Dan Bizzarro Eventing Photos',
    intro: 'Browse photos from competitions, clinics, and training sessions with Dan Bizzarro.',
    sections: [
      {
        heading: 'Photo Gallery',
        content: [
          'View photos from international competitions, training sessions, and clinics.',
          'See Dan in action at events including Blenheim European Championships, Boekelo Nations Cup, and more.',
          'Photos from coaching sessions and clinics across Oxfordshire.'
        ]
      }
    ]
  },

  '/blog': {
    h1: 'Equestrian Training Blog - Tips & Insights',
    intro: 'Expert tips and insights to improve your riding from Dan Bizzarro. Articles on training, competition preparation, and horse care.',
    sections: [
      {
        heading: 'From the Blog',
        content: [
          'Expert tips and insights to improve your riding.',
          'Training advice for dressage, show jumping, and cross country.',
          'Competition preparation strategies.',
          'Horse care and management tips.'
        ]
      }
    ]
  },

  '/loyalty': {
    h1: 'Loyalty Rewards Programme - Dan Bizzarro Method',
    intro: 'Earn points for every clinic attendance and referral. Redeem for discounts on future sessions.',
    sections: [
      {
        heading: 'Loyalty Programme',
        content: [
          'Earn 10 points for every clinic you attend.',
          'Earn 20 bonus points when you refer a new client.',
          'At 50 points, receive a 20% discount code.',
          'Points reset bi-annually (30 June & 31 December) with prizes for top earners.',
          'Track your points and see where you rank on the leaderboard.'
        ]
      }
    ]
  }
};

/**
 * Get SSR content for a given path
 */
export function getSSRContent(path: string): SSRPageContent | null {
  const normalizedPath = path.toLowerCase().replace(/\/$/, '') || '/';
  return ssrContent[normalizedPath] || null;
}

/**
 * Format SSR content as HTML for injection
 */
export function formatSSRContentAsHTML(content: SSRPageContent): string {
  const parts: string[] = [];
  
  parts.push(`<h1>${escapeHtml(content.h1)}</h1>`);
  
  if (content.intro) {
    parts.push(`<p>${escapeHtml(content.intro)}</p>`);
  }
  
  for (const section of content.sections) {
    if (section.heading) {
      parts.push(`<h2>${escapeHtml(section.heading)}</h2>`);
    }
    for (const paragraph of section.content) {
      parts.push(`<p>${escapeHtml(paragraph)}</p>`);
    }
  }
  
  if (content.features && content.features.length > 0) {
    parts.push('<h3>Features</h3>');
    parts.push('<ul>');
    for (const feature of content.features) {
      parts.push(`<li>${escapeHtml(feature)}</li>`);
    }
    parts.push('</ul>');
  }
  
  if (content.faqs && content.faqs.length > 0) {
    parts.push('<h3>Frequently Asked Questions</h3>');
    for (const faq of content.faqs) {
      parts.push(`<h4>${escapeHtml(faq.question)}</h4>`);
      parts.push(`<p>${escapeHtml(faq.answer)}</p>`);
    }
  }
  
  if (content.testimonials && content.testimonials.length > 0) {
    parts.push('<h3>Testimonials</h3>');
    for (const testimonial of content.testimonials) {
      parts.push(`<blockquote>"${escapeHtml(testimonial.content)}" - ${escapeHtml(testimonial.name)}</blockquote>`);
    }
  }
  
  if (content.contactInfo) {
    parts.push('<h3>Contact Information</h3>');
    parts.push(`<p>Phone: <a href="tel:${content.contactInfo.phone.replace(/\s/g, '')}">${escapeHtml(content.contactInfo.phone)}</a></p>`);
    parts.push(`<p>Email: <a href="mailto:${content.contactInfo.email}">${escapeHtml(content.contactInfo.email)}</a></p>`);
    parts.push(`<address>${escapeHtml(content.contactInfo.address)}</address>`);
  }
  
  return parts.join('\n');
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
