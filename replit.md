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

## External Dependencies
- **Google Analytics 4:** For website traffic and user behavior analytics.
- **Google Search Console:** For site ownership verification and search performance monitoring.
- **Meta Pixel (Facebook Pixel):** For advertising campaign tracking and conversion events.
- **Go High Level (GHL) API:** Integrated for contact management, synchronization, and automated email communications. Used for newsletter subscriptions, clinic registrations, and three automated email types: (1) First-time clinic confirmation (welcome, referral code, timing info), (2) Returning client confirmation (timing, points balance, referral reminder), and (3) Referral bonus notification (points earned, leaderboard link). Requires `GHL_API_KEY` and `GHL_LOCATION_ID`.
- **Stripe Payment Integration:** Configured for clinic registrations with server-side payment validation, Stripe Elements, and Express Checkout (Apple Pay/Google Pay). Requires `STRIPE_SECRET_KEY` and `VITE_STRIPE_PUBLIC_KEY`.