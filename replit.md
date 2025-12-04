# Dan Bizzarro Method - Project Documentation

## Overview
A digital platform for the Dan Bizzarro Method, providing horse training tools and coaching services. The platform targets both amateur and competitive riders, offering interactive tools and personalized learning experiences. Its purpose is to enhance horse training through a comprehensive online presence, leveraging features like readiness quizzes, stride calculators, and a loyalty program.

## User Preferences
- **Content Location:** Based in Ascott-Under-Wychwood (Oxfordshire), UK
- **Design Style:** Clean, professional layout with light grey navigation
- **Quiz Structure:** Specific question order starting with dressage consistency
- **Contact Form:** Simplified without response times or clinic booking sections
- **Branding:** Blue logo throughout, consistent sizing and placement
- **Target Audience:** Dual focus on amateur riders (riding for pleasure) and competitive riders (beginner to international level)
- **Clinic Format:** Emphasis on single-day sessions; polework, show jumping, and cross country specialties
- **SEO Keywords:** Dan Bizzarro Method, show-jumping/polework/cross country clinics, Private Horse Riding Lessons, Virtual Riding Lessons, Remote Equestrian Coaching, Equestrian Lessons Oxfordshire, Show Jumping/Eventing/Cross Country Coach, polework training, grid work, gymnastic jumping, pole exercises
- **NAP (Name, Address, Phone) Standard:** Consistent across all pages for local SEO: Business Name: Dan Bizzarro Method | Address: Crown Farm, Ascott-Under-Wychwood, Oxfordshire OX7, United Kingdom | Phone: +44 7767 291713 | Email: dan@danbizzarromethod.com

## System Architecture
The platform utilizes React.js (TypeScript), Tailwind CSS, Express.js, and PostgreSQL, employing a multi-page architecture for SEO and user experience.

**UI/UX Decisions:**
- Clean, professional, and mobile-optimized design focusing on readability and accessibility.
- Consistent branding with a blue logo and light grey navigation.
- WCAG 2.1 compliance for accessibility, including proper heading hierarchy and semantic HTML.

**Technical Implementations:**
- **Frontend:** React.js with TypeScript, Tailwind CSS, Wouter for routing, React Hook Form with Zod, TanStack Query.
- **Backend:** Express.js.
- **Database:** PostgreSQL.
- **SEO:** Centralized architecture with server-side meta tag rendering, dynamic structured data, an SEO Config Registry, and server-side injection via Express middleware. Client-side `SEOHead` component for comprehensive coverage. Canonical URLs point to danbizzarromethod.com. LocalBusiness structured data ensures NAP consistency.
- **Core Web Vitals Optimization:** Automated image compression (Sharp), modern image loading (`<picture>` elements with WebP fallbacks), and deferred loading of third-party scripts.
- **Pre-Rendering & Bot Detection:** A build-time pre-rendering script uses Puppeteer to generate full HTML for all pages. A bot detection middleware serves these pre-rendered files to over 50 search engines and AI crawlers, while regular users receive a fast SPA experience. This system automatically regenerates pre-rendered pages when clinic or blog content changes.
- **SSR Content for AI/LLM Readability:** Comprehensive server-side rendering now covers all pages. An SSR Content Registry and Express middleware inject full content into HTML, enabling AI tools to read and cite complete page content. This content is semantically structured and hidden visually via CSS, with a noscript fallback.

**Feature Specifications:**
- **Coaching Section:** Dedicated pages for Private Lessons, Clinics, Remote Coaching, Dressage, Show Jumping, Cross Country, and Polework, featuring WhatsApp booking, flexible clinic capacity management, an auto-fill system for returning clients, GDPR-compliant data handling, and mandatory Google Maps links for clinics.
- **Interactive Tools:** Readiness Quiz, Stride Calculator, and Packing List Generator.
- **Main Pages:** Home, About, Coaching, Gallery, News, Podcast, and Contact pages, designed for independent ranking.
- **Podcast:** "Our Equestrian Life" integrated on the Home page and a dedicated `/podcast` page.
- **Admin Interface:** Manages clinics, news articles, and Go High Level contact synchronization.
- **Points and Referral System:** A loyalty program with bi-annual prizes, automatic rewards (points per clinic entry, bonus for referrals), and automatic discount code generation. Features a public, privacy-protected leaderboard and real-time referral code validation.
- **Group Management System:** Organizes clinic participants by skill level (max 4 participants per group) with drag-and-drop functionality. Displays time slots, skill level, capacity, and participant names with their skill levels, including a persistent "Not Assigned" box.
- **Clinic Marketing Automation System:**
    - **Facebook Auto-Posting:** Automatically posts new clinics to Facebook with details, Google Maps link, price, capacity, and trackable booking links. Toggleable per clinic and includes a simulation mode.
    - **Personalized GHL Email Blasts:** Automatically emails all GHL contacts upon clinic creation, with tag-based filtering. Uses two templates (Existing Clients: includes referral code/points balance; New Contacts: introduces rewards program) and includes Google Maps links and UTM tracking. Also has a simulation mode.
    - **Blog → Clinic Connection:** An "Upcoming Clinic" banner at the end of blog posts displays the next clinic's details and a "Book Now" button.
    - **Clinic Capacity Display:** Visual warnings on clinic pages for low capacity ("Only X spots left!") or full clinics ("This clinic is full") with waitlist options.
    - **Admin Controls:** Clinic creation form includes options for `autoPostToFacebook` and `excludeTagsFromEmail`.

## External Dependencies
- **Google Analytics 4:** For website traffic and user behavior analytics.
- **Google Search Console:** For site ownership verification and search performance monitoring.
- **Meta Pixel (Facebook Pixel):** For advertising campaign tracking and conversion events.
- **Go High Level (GHL) API:** Integrated for contact management, synchronization, and automated email communications (newsletter, clinic registrations, confirmation emails, referral bonus notifications). Requires `GHL_API_KEY` and `GHL_LOCATION_ID`.
- **Stripe Payment Integration:** Configured for clinic registrations with server-side payment validation, Stripe Elements, and Express Checkout (Apple Pay/Google Pay). Requires `STRIPE_SECRET_KEY` and `VITE_STRIPE_PUBLIC_KEY`.
- **Facebook Marketing Automation:** Integrates with Facebook Graph API to automatically post new clinics to the Facebook page. Requires `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`, `FACEBOOK_PAGE_ACCESS_TOKEN`.

## Automatic SEO Pre-Rendering System

**Pre-rendered pages automatically update when content changes:**

### Auto-Triggered (No Action Needed)
- When you create/update a **clinic** → SEO pages regenerate in background
- When you create/update a **blog post** → SEO pages regenerate in background
- 5-second debounce prevents excessive regeneration

### IMPORTANT: Static Page Changes Need Manual Regeneration
**When making code changes to these pages, remind user to run:** `npx tsx scripts/prerender.ts`

Static pages that need manual regeneration:
- Home, About, Gallery, Podcast, Contact, Terms & Conditions
- All coaching pages (Private Lessons, Show Jumping, Cross Country, Dressage, Polework, Remote Coaching)
- Tools (Stride Calculator, Readiness Quiz, Packing List Generator)
- Loyalty, 10 Points Better course

### How It Works
- Pre-rendered files stored in `client/public/prerender/` (development)
- Vite copies to `dist/public/prerender/` during build
- Bot detection serves these to Google, ChatGPT, Claude, etc.
- Regular users get fast SPA experience

### Implementation Files
- `server/prerenderService.ts` - Background pre-rendering service with debouncing
- `server/botDetection.ts` - User-Agent detection middleware
- `server/routes.ts` - Triggers in clinic/news create/update endpoints
- `scripts/prerender.ts` - Manual pre-rendering script

## Blog Article Formatting Guidelines

**IMPORTANT: Always use HTML formatting for blog articles, NEVER markdown syntax.**

### Required HTML Tags (NO markdown like # or **)
- `<h2>` - Main section headings
- `<h3>` - Sub-headings (for steps, sub-sections)
- `<p>` - Paragraphs
- `<strong>` - Bold/emphasis text
- `<ul>` and `<li>` - Bullet lists
- `<ol>` and `<li>` - Numbered lists
- `<br>` - Line breaks within paragraphs
- `<a href="..." style="color: #ea580c; text-decoration: underline;">` - Links to other pages

### Standard CTA Banner (include once or twice per article)
```html
<div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); border-radius: 8px; padding: 12px 20px; margin: 20px 0; text-align: center;"><p style="color: white; font-size: 1rem; font-weight: 600; margin: 0 0 6px 0;">Ready to Take Your Riding to the Next Level?</p><p style="color: #dbeafe; font-size: 0.875rem; margin: 0 0 12px 0;">Join me for personalised coaching that transforms your partnership with your horse.</p><div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 8px;"><a href="/coaching/clinics" style="display: inline-block; background: white; color: #1e40af; padding: 8px 16px; border-radius: 6px; font-weight: 600; text-decoration: none; font-size: 0.875rem;">Book a Clinic</a><a href="/coaching/private-lessons" style="display: inline-block; background: white; color: #1e40af; padding: 8px 16px; border-radius: 6px; font-weight: 600; text-decoration: none; font-size: 0.875rem;">Book an Individual Lesson</a><a href="/coaching/remote-coaching" style="display: inline-block; background: white; color: #1e40af; padding: 8px 16px; border-radius: 6px; font-weight: 600; text-decoration: none; font-size: 0.875rem;">Book a Virtual Lesson</a></div></div>
```

### Article Structure
1. Opening paragraphs introducing the topic
2. Main content with `<h2>` sections and `<h3>` sub-sections
3. Step-by-step instructions using `<h3>` for each step
4. Bullet lists for key points
5. CTA banner (place mid-article and/or before FAQ)
6. FAQ section with `<h2>Frequently Asked Questions</h2>` followed by `<p><strong>Question?</strong><br>Answer text.</p>` format

### Links to Dan Bizzarro Method
Always link mentions of "Dan Bizzarro Method" to the method section:
```html
<a href="/#method" style="color: #ea580c; text-decoration: underline;">Dan Bizzarro Method</a>
```