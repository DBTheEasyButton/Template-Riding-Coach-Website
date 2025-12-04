# Dan Bizzarro Method - Project Documentation

## Overview
A comprehensive digital platform for the Dan Bizzarro Method, offering innovative horse training tools with a focus on user experience and personalized learning. The platform aims to balance messaging for both amateur and competitive riders, offering a range of coaching services and interactive tools to enhance horse training.

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
The platform is built with React.js (TypeScript), Tailwind CSS, Express.js, and PostgreSQL. It features a multi-page architecture for improved SEO and user experience.

**UI/UX Decisions:**
- Clean, professional layout with a focus on readability and accessibility.
- Mobile-optimized UI for all interactive tools and content.
- Consistent branding with a blue logo and light grey navigation.
- WCAG 2.1 compliance for accessibility, including proper heading hierarchy, descriptive alt attributes, and semantic HTML.

**Technical Implementations:**
- **Frontend:** React.js with TypeScript, Tailwind CSS, Wouter for routing, React Hook Form with Zod for validation, TanStack Query for data management.
- **Backend:** Express.js.
- **Database:** PostgreSQL.
- **SEO:** Centralized SEO architecture with server-side meta tag rendering and dynamic structured data. Includes an SEO Config Registry, Schema Helpers, server-side injection via Express middleware, and a client-side `SEOHead` component for comprehensive coverage. All canonical URLs point to danbizzarromethod.com. LocalBusiness structured data is used for NAP consistency.
- **Core Web Vitals Optimization:** Automated image compression pipeline using Sharp, modern image loading with `<picture>` elements (WebP fallbacks), and deferred loading of third-party scripts (Facebook Pixel, Google Analytics, LeadConnector) to optimize LCP and FID.

**Feature Specifications:**
- **Coaching Section:** Renamed from "Services," includes dedicated pages for Private Lessons, Clinics, Remote Coaching, Dressage, Show Jumping, Cross Country, and Polework. Features WhatsApp booking buttons, flexible clinic capacity management (privacy-focused), an auto-fill system for returning clients, and GDPR-compliant data handling. **Google Maps Link is mandatory** for all clinics (validated on both frontend and backend).
- **Interactive Tools:**
    - **Readiness Quiz:** An interactive assessment.
    - **Stride Calculator:** A professional tool for equestrian distance calculations.
    - **Packing List Generator:** A customizable checklist creation tool.
- **Main Pages:** Home, About, Coaching, Gallery, News, Podcast, and Contact pages, designed for independent ranking and user experience.
- **Podcast:** "Our Equestrian Life" podcast, integrated on the Home page and a dedicated `/podcast` page with SEO optimization.
- **Admin Interface:** Manages clinics, news articles, and Go High Level contact synchronization.
- **Points and Referral System:** A loyalty programme with bi-annual prizes and automatic rewards. Clients earn points per clinic entry, and referrers earn bonus points for new client sign-ups. Discount codes are automatically generated at 50-point milestones. Features a public, privacy-protected leaderboard. Points first reset on 30 June 2025, then bi-annually (30 June & 31 December) with winner archiving. Real-time referral code validation is provided.
- **Group Management System:** Organizes clinic participants by skill level with drag-and-drop functionality. **Maximum 4 participants per group**. Each participant's skill level is captured during registration and persists permanently regardless of group reassignment. Groups display time slots, skill level, capacity, and participant names with their individual skill levels. Features a persistent "Not Assigned" box for unassigned participants.

## External Dependencies
- **Google Analytics 4:** For website traffic and user behavior analytics.
- **Google Search Console:** For site ownership verification and search performance monitoring.
- **Meta Pixel (Facebook Pixel):** For advertising campaign tracking and conversion events.
- **Go High Level (GHL) API:** Integrated for contact management, synchronization, and automated email communications. Used for newsletter subscriptions, clinic registrations, and three automated email types: (1) First-time clinic confirmation (welcome, referral code, timing info), (2) Returning client confirmation (timing, points balance, referral reminder), and (3) Referral bonus notification (points earned, leaderboard link). Requires `GHL_API_KEY` and `GHL_LOCATION_ID`.
- **Stripe Payment Integration:** Configured for clinic registrations with server-side payment validation, Stripe Elements, and Express Checkout (Apple Pay/Google Pay). Requires `STRIPE_SECRET_KEY` and `VITE_STRIPE_PUBLIC_KEY`.
- **Facebook Marketing Automation:** Automatically posts new clinics to your Facebook page with clinic image, location, Google Maps link, price, capacity status, and trackable booking links with UTM parameters. Requires `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`, `FACEBOOK_PAGE_ACCESS_TOKEN`.

## New Features (November 28, 2025)

### Clinic Marketing Automation System
**Fully automated marketing workflows that increase clinic bookings:**

1. **Facebook Auto-Posting**
   - Automatically posts new clinics to Facebook page when created
   - Includes clinic image, Google Maps link, price, capacity status
   - Posts feature trackable booking link with UTM parameters to measure traffic
   - Can be toggled on/off per clinic via admin form
   - Optional simulation mode for testing (set `SIMULATE_FACEBOOK_POSTS=true`)

2. **Personalized GHL Email Blasts**
   - When a clinic is created, automatically emails all GHL contacts
   - Tag-based filtering: exclude contacts by GHL tags (e.g., "virtual lessons", "inactive")
   - **Two email templates:**
     - **Existing Clients:** Shows their unique referral code + current points balance + clinic details
     - **New Contacts:** Introduces rewards program + clinic details + points earning opportunity
   - Optional simulation mode for testing (set `SIMULATE_EMAILS=true`)
   - All emails include Google Maps link (clickable) + UTM tracking on booking link

3. **Blog → Clinic Connection**
   - Every blog post displays an "Upcoming Clinic" banner at the end
   - Shows next clinic: date, location, price, and "Book Now" button
   - Drives content readers directly to clinic bookings
   - Component: `UpcomingClinicsBanner.tsx`

4. **Clinic Capacity Display**
   - Visual warnings on clinic pages showing capacity status
   - "Only X spots left!" - when capacity is getting low (≤2 spots)
   - "This clinic is full" - when at max capacity with waitlist option
   - Component: `ClinicCapacityWarning.tsx`

5. **Admin Controls**
   - Clinic creation form includes:
     - `autoPostToFacebook` checkbox - enable/disable Facebook posting
     - `excludeTagsFromEmail` field - comma-separated GHL tags to exclude
   - Database fields added to `clinics` table

### Email Template Content
**Existing Client Email:**
- Personalized greeting
- Clinic details (date, location, price, description)
- Highlighted referral code (unique to client)
- Current points balance
- Book Now button with UTM tracking

**New Contact Email:**
- Friendly introduction
- Clinic details (date, location, price, description)
- Introduction to loyalty rewards program (10 points/clinic, 20 bonus for referrals, 20% discount at 50 points)
- Book Now button explaining they'll get referral code upon registration

### Simulation Mode
For testing without sending real emails or creating Facebook posts:
- Set `SIMULATE_EMAILS=true` in Secrets → logs show which emails would be sent
- Set `SIMULATE_FACEBOOK_POSTS=true` in Secrets → logs show what post would be created
- Detailed console output shows all contact filtering, tag exclusions, and sending summary

### Implementation Files
- `server/facebookService.ts` - Facebook Graph API integration
- `server/emailService.ts` - GHL email automation (methods: `sendClinicAnnouncementToContacts`, `sendNewClinicToExistingClient`, `sendNewClinicToNewContact`)
- `client/src/components/ClinicCapacityWarning.tsx` - Capacity display component
- `client/src/components/UpcomingClinicsBanner.tsx` - Blog/article clinic promotion banner
- Schema updates in `shared/schema.ts` - Added `autoPostToFacebook` and `excludeTagsFromEmail` to clinics table

## New Features (December 4, 2025)

### SEO Pre-Rendering with Bot Detection
**Build-time pre-rendering system for optimal SEO and AI crawler indexing:**

1. **Pre-Rendering Script**
   - Runs after Vite build using Puppeteer with Chromium
   - Visits all 21+ pages and waits for full JavaScript render
   - Saves complete HTML (60-80KB per page) to `dist/public/prerender/`
   - Run manually: `npx tsx scripts/prerender.ts`

2. **Bot Detection Middleware**
   - Detects 50+ search engines and AI crawlers (Google, Bing, ChatGPT, Claude, Perplexity, etc.)
   - Serves pre-rendered HTML files to bots (full content)
   - Regular users get fast SPA experience (1.3KB shell)
   - Only active in production when pre-rendered files exist

3. **How It Works**
   | Visitor | Response Size | What They See |
   |---------|---------------|---------------|
   | Googlebot | 80KB | Full HTML with all content, meta tags, structured data |
   | ChatGPT | 70KB | Full HTML with all content |
   | Regular browser | 1.3KB | Fast SPA that builds instantly |

4. **Implementation Files**
   - `scripts/prerender.ts` - Puppeteer-based pre-rendering script
   - `server/botDetection.ts` - User-Agent detection middleware
   - `server/index.ts` - Bot detection integration (production only)

5. **Build Process**
   - Standard build: `npm run build` (Vite + esbuild)
   - Pre-render: `npx tsx scripts/prerender.ts` (after build)
   - Pre-rendered files stored in `dist/public/prerender/`

**Note:** SSR middleware remains in development mode only. Production uses pre-rendered files for bots and SPA for regular users to avoid the async SSR issues that caused previous outages.

## New Features (December 2, 2025)

### Complete SSR Content for All Pages
**Server-side rendering now covers ALL pages for optimal AI/LLM readability:**

The site now implements comprehensive server-side content injection ensuring Google, ChatGPT, Claude, Perplexity, and other AI tools can read full page content without JavaScript execution.

**Architecture:**
- `shared/ssrContent.ts` - SSR Content Registry containing static page content for all major pages
- `server/seo-middleware.ts` - Express middleware that injects SSR content into HTML before serving

**Pages with Full SSR Content:**
- Home page (`/`) - Complete Dan Bizzarro Method overview, mission, and services
- About page (`/about`) - Dan's full biography, career highlights, training philosophy
- Contact page (`/contact`) - Full contact information with phone, email, address
- Coaching overview (`/coaching`) - All training options and disciplines
- Private Lessons (`/coaching/private-lessons`) - Full service details, FAQs, testimonials
- Remote Coaching (`/coaching/remote-coaching`) - Virtual lesson info, equipment, FAQs
- Clinics (`/coaching/clinics`) - Dynamic clinic listings with Event schema
- Dressage, Show Jumping, Cross Country, Polework pages - Discipline-specific content
- Podcast (`/podcast`) - Our Equestrian Life podcast information
- Tools (Stride Calculator, Readiness Quiz, Packing List) - Tool descriptions
- Blog (`/blog`) - Individual posts with full article content
- Loyalty programme (`/loyalty`) - Points system explanation

**How It Works:**
1. Express middleware intercepts HTML responses
2. For static pages: Injects content from SSR Content Registry
3. For dynamic pages (clinics, blog posts): Fetches live data and injects
4. Content uses semantic HTML with proper heading hierarchy (H1, H2, H3)
5. Hidden from visual users via CSS positioning (position: absolute; left: -9999px)
6. Noscript fallback makes content visible for non-JS browsers

**SEO Benefits:**
- Google can index complete page content without JavaScript rendering
- AI tools (ChatGPT, Claude, Perplexity) can read and cite full page content
- Structured data (Schema.org) embedded for rich search results
- FAQ schema for pages with FAQs improves featured snippet potential