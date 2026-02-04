# Equestrian Coaching Website Template - Project Documentation

## Overview
A professional, reusable website template for equestrian coaches. This minimal template provides the essential infrastructure for a coaching business including clinic booking, payment processing, loyalty programs, and admin management.

## TEMPLATE SETUP CHECKLIST

When cloning this template for a new coaching business, complete the following:

### 1. Business Information
- [ ] Update `shared/seoConfig.ts` with business name, descriptions, and keywords
- [ ] Update `client/src/data/seoConfig.ts` with page-specific SEO content
- [ ] Update `BASE_URL` in both seoConfig files to your domain
- [ ] Search for "[YOUR" placeholder values and replace with your details

### 2. Logo & Branding Images
**IMPORTANT:** Clear all files in `attached_assets/` folder and replace with your own assets.

Replace these placeholder logo files with your business logos:
- [ ] `attached_assets/logo-light-bg.png` - Main logo for light backgrounds (navigation)
- [ ] `attached_assets/logo-dark-bg.png` - Logo for dark backgrounds (footer)
- [ ] `attached_assets/newsletter-logo.png` - Newsletter section logo
- [ ] `client/public/logo.png` - Square logo for favicon/browser tab

### 2b. Lead Magnet PDF
Customize your free guide PDF in `server/generateLeadMagnetPDF.ts`:
- [ ] Update the PDF title, subtitle, and author
- [ ] Replace placeholder content with your coaching expertise
- [ ] Add your logo (see template comments in the file)

### 3. Required API Keys & Secrets
Configure these secrets in the Replit Secrets tab:

**Admin Authentication (Required):**
- [ ] `ADMIN_EMAIL_1` - First super admin email address
- [ ] `ADMIN_PASSWORD_1` - First super admin password
- [ ] `ADMIN_EMAIL_2` - Second super admin email address
- [ ] `ADMIN_PASSWORD_2` - Second super admin password
- [ ] `SESSION_SECRET` - A random string for session security (REQUIRED in production)

**Payments:**
- [ ] `STRIPE_SECRET_KEY` - Your Stripe secret key for payments
- [ ] `VITE_STRIPE_PUBLIC_KEY` - Your Stripe publishable key
- [ ] `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook signing secret

**CRM Integration:**
- [ ] `GHL_API_KEY` - Go High Level API key for CRM integration
- [ ] `GHL_LOCATION_ID` - Go High Level location ID

**Social Media (Optional):**
- [ ] `FACEBOOK_APP_ID` - For Facebook marketing automation
- [ ] `FACEBOOK_APP_SECRET` - For Facebook marketing automation
- [ ] `FACEBOOK_PAGE_ACCESS_TOKEN` - For auto-posting to Facebook

### 4. Analytics Configuration
Update `client/index.html` with your tracking IDs:
- [ ] Replace `YOUR_GA4_ID` with your Google Analytics 4 measurement ID
- [ ] Replace `YOUR_FACEBOOK_PIXEL_ID` with your Meta Pixel ID
- [ ] Replace `YOUR_CLARITY_ID` with your Microsoft Clarity ID
- [ ] Replace `GTM-XXXXXXXX` with your Google Tag Manager ID

### 5. Content to Add
- [ ] Testimonials (add via Admin > Testimonials)
- [ ] Blog articles (add via Admin > Blog)
- [ ] Clinic offerings (add via Admin > Clinics)
- [ ] Gallery photos (add via Admin > Gallery)
- [ ] Update service descriptions on coaching pages
- [ ] Update Terms and Conditions page

### 6. Contact Details
Update in `client/src/components/Footer.tsx` and contact pages:
- [ ] Business address
- [ ] Phone number  
- [ ] Email address
- [ ] Social media links

## Template Features

### Core Pages
- **Home** - Hero section, clinic promotions, call-to-action
- **About** - Coach biography and credentials
- **Coaching** - Overview of services with links to specialized pages
- **Blog** - News articles and training tips
- **Gallery** - Photo gallery
- **Contact** - Contact form and details

### Coaching Sub-Pages
- Private Lessons
- Group Clinics
- Remote/Virtual Coaching
- Dressage
- Show Jumping
- Cross Country
- Polework

### Admin Features (access at /admin)

**Two-Tier Admin System:**
- **Super Admin** (template owners): Full access including Settings and feature toggles
- **Client Admin** (to be added per website clone): Limited access to manage content only

Super admins are automatically created on server startup from the `ADMIN_EMAIL_1/2` and `ADMIN_PASSWORD_1/2` secrets.

**Available Admin Pages:**
- **Clinics** - Create, edit, and manage clinic events
- **Registrations** - View and manage clinic bookings
- **Groups** - Organize participants by skill level
- **Blog** - Create and publish articles
- **Gallery** - Upload and manage photos
- **Testimonials** - Manage customer reviews
- **CRM** - Sync contacts with Go High Level
- **Analytics** - View site statistics
- **Settings** - Site configuration (Super Admin only)

**Feature Toggles (Super Admin Only):**
Located in Settings > Feature Toggles, these control core functionality:
1. **Online Booking System** - Enable/disable clinic registration, online payments, email announcements to tagged contacts, and Facebook auto-posting when new clinics are created
2. **Advanced Clinic System** - Enable/disable email automations, automatic group assignments, schedule generation, and schedule notification emails

### Payment System
- Stripe integration for clinic bookings
- Multi-entry support (book multiple horses/participants)
- Discount codes and loyalty rewards
- Automatic email confirmations

### Loyalty Program
- Points system for clinic attendance
- Referral rewards
- Automatic discount code generation
- Leaderboard display

## User Preferences
- **Design Style:** Clean, professional layout with light grey navigation
- **Branding:** Update colors in `client/src/index.css` and `tailwind.config.ts`
- **Terminology:** Always refer to Go High Level (GHL) as "CRM" in user-facing text

### NAP (Name, Address, Phone) Standard
Update consistently across all pages for local SEO:
- Business Name: [YOUR BUSINESS NAME]
- Address: [YOUR ADDRESS]
- Phone: [YOUR PHONE NUMBER]
- Email: [YOUR EMAIL]

## System Architecture

**Technical Stack:**
- **Frontend:** React.js with TypeScript, Tailwind CSS, Wouter for routing, React Hook Form with Zod, TanStack Query
- **Backend:** Express.js
- **Database:** PostgreSQL (Replit built-in)
- **Payments:** Stripe

**Key Architecture:**
- Clean, professional, and mobile-optimized design
- WCAG 2.1 compliance for accessibility
- Pre-rendering system for SEO optimization
- Bot detection middleware for search engine crawlers

## Pre-Rendering System

**When making code changes to static pages, run:** `npx tsx scripts/prerender.ts`

Static pages that need manual regeneration:
- Home, About, Gallery, Contact, Terms & Conditions
- All coaching pages (Private Lessons, Show Jumping, Cross Country, Dressage, Polework, Remote Coaching)
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
