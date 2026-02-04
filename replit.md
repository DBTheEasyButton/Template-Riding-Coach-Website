# Equestrian Coaching Website Template - Project Documentation

## Overview
A professional website template for equestrian coaches, providing horse training tools and coaching services. The platform targets both amateur and competitive riders, offering interactive tools and personalized learning experiences. This template can be cloned and customized for different coaching businesses.

## TEMPLATE SETUP CHECKLIST

When cloning this template for a new coaching business, update the following:

### 1. Business Information
- [ ] Update `shared/seoConfig.ts` with business name, descriptions, and keywords
- [ ] Update `BASE_URL` in `shared/seoConfig.ts` to your domain
- [ ] Update contact details throughout the codebase (search for placeholder values)
- [ ] Replace placeholder images in `client/src/assets/`

### 2. Required API Keys & Secrets
Configure these secrets in the Replit Secrets tab:
- [ ] `STRIPE_SECRET_KEY` - Your Stripe secret key for payments
- [ ] `VITE_STRIPE_PUBLIC_KEY` - Your Stripe publishable key
- [ ] `GHL_API_KEY` - Go High Level API key for CRM integration
- [ ] `GHL_LOCATION_ID` - Go High Level location ID
- [ ] `FACEBOOK_APP_ID` - For Facebook marketing automation (optional)
- [ ] `FACEBOOK_APP_SECRET` - For Facebook marketing automation (optional)
- [ ] `FACEBOOK_PAGE_ACCESS_TOKEN` - For auto-posting to Facebook (optional)

### 3. Content to Customize
- [ ] Testimonials (add via admin panel or database)
- [ ] Blog articles
- [ ] Clinic offerings
- [ ] Service descriptions on coaching pages
- [ ] Terms and conditions

## User Preferences
- **Design Style:** Clean, professional layout with light grey navigation
- **Branding:** Update logo and colors in `client/src/index.css` and `tailwind.config.ts`
- **Target Audience:** Dual focus on amateur riders (riding for pleasure) and competitive riders
- **Clinic Format:** Single-day sessions; polework, show jumping, and cross country specialties
- **Terminology:** Always refer to Go High Level (GHL) as "CRM" in user-facing text

### NAP (Name, Address, Phone) Standard
Update consistently across all pages for local SEO:
- Business Name: [YOUR BUSINESS NAME]
- Address: [YOUR ADDRESS]
- Phone: [YOUR PHONE NUMBER]
- Email: [YOUR EMAIL]

## System Architecture
The platform utilizes React.js (TypeScript), Tailwind CSS, Express.js, and PostgreSQL, employing a multi-page architecture for SEO and user experience.

**UI/UX Decisions:**
- Clean, professional, and mobile-optimized design focusing on readability and accessibility.
- Consistent branding with customizable colors and logo.
- WCAG 2.1 compliance for accessibility, including proper heading hierarchy and semantic HTML.

**Technical Implementations:**
- **Frontend:** React.js with TypeScript, Tailwind CSS, Wouter for routing, React Hook Form with Zod, TanStack Query.
- **Backend:** Express.js.
- **Database:** PostgreSQL (Replit built-in).
- **SEO:** Centralized architecture with server-side meta tag rendering, dynamic structured data. Canonical URLs should point to your domain. LocalBusiness structured data ensures NAP consistency.
- **Pre-Rendering & Bot Detection:** Build-time pre-rendering uses Puppeteer to generate full HTML for all pages. Bot detection middleware serves pre-rendered files to search engines and AI crawlers.

**Feature Specifications:**
- **Coaching Section:** Dedicated pages for Private Lessons, Clinics, Remote Coaching, Dressage, Show Jumping, Cross Country, and Polework.
- **Interactive Tools:** Readiness Quiz, Stride Calculator, and Packing List Generator.
- **Admin Interface:** Manages clinics, news articles, and CRM contact synchronization.
- **Loyalty Program:** Points and referral system with automatic rewards and discount code generation.
- **Group Management:** Organize clinic participants by skill level with drag-and-drop functionality.

## External Dependencies
- **Google Analytics 4:** For website traffic and user behavior analytics (configure with your tracking ID).
- **CRM (Go High Level) API:** For contact management and automated email communications. Requires `GHL_API_KEY` and `GHL_LOCATION_ID`.
- **Stripe Payment Integration:** For clinic registrations. Requires `STRIPE_SECRET_KEY` and `VITE_STRIPE_PUBLIC_KEY`.
- **Facebook Marketing:** Optional integration for auto-posting clinics. Requires Facebook API credentials.

## Pre-Rendering System

**When making code changes to static pages, run:** `npx tsx scripts/prerender.ts`

Static pages that need manual regeneration:
- Home, About, Gallery, Podcast, Contact, Terms & Conditions
- All coaching pages (Private Lessons, Show Jumping, Cross Country, Dressage, Polework, Remote Coaching)
- Tools (Stride Calculator, Readiness Quiz, Packing List Generator)
- Loyalty programme page

### How It Works
- Pre-rendered files stored in `client/public/prerender/` (development)
- Vite copies to `dist/public/prerender/` during build
- Bot detection serves these to Google, ChatGPT, Claude, etc.
- Regular users get fast SPA experience

## Blog Article Formatting Guidelines

**IMPORTANT: Always use HTML formatting for blog articles, NEVER markdown syntax.**

### Required HTML Tags
- `<h2>` - Main section headings
- `<h3>` - Sub-headings
- `<p>` - Paragraphs
- `<strong>` - Bold/emphasis text
- `<ul>` and `<li>` - Bullet lists
- `<ol>` and `<li>` - Numbered lists

### Article Structure
1. Opening paragraphs introducing the topic
2. Main content with `<h2>` sections and `<h3>` sub-sections
3. Step-by-step instructions using `<h3>` for each step
4. Bullet lists for key points
5. FAQ section with `<h2>Frequently Asked Questions</h2>`
