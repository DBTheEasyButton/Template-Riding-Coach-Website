# Dan Bizzarro Method - Project Documentation

## Overview
A comprehensive digital platform for the Dan Bizzarro Method, offering innovative horse training tools with a focus on user experience and personalized learning. The platform aims to balance messaging for both amateur and competitive riders, offering a range of coaching services and interactive tools.

## User Preferences
- **Content Location:** Based in Ascott-Under-Wychwood (Oxfordshire), UK
- **Design Style:** Clean, professional layout with light grey navigation
- **Quiz Structure:** Specific question order starting with dressage consistency
- **Contact Form:** Simplified without response times or clinic booking sections
- **Branding:** Blue logo throughout, consistent sizing and placement
- **Target Audience:** Dual focus on amateur riders (riding for pleasure) and competitive riders (beginner to international level)
- **Clinic Format:** Emphasis on single-day sessions; polework, show jumping, and cross country specialties
- **SEO Keywords:** Dan Bizzarro Method, show-jumping/polework/cross country clinics, Private Horse Riding Lessons, Virtual Riding Lessons, Remote Equestrian Coaching, Equestrian Lessons Oxfordshire, Show Jumping/Eventing/Cross Country Coach

## System Architecture
The platform is built with React.js (TypeScript), Tailwind CSS, Express.js, and PostgreSQL. It features a multi-page architecture for improved SEO and user experience.

**UI/UX Decisions:**
- Clean, professional layout with a focus on readability and accessibility.
- Mobile-optimized UI for all interactive tools and content.
- Consistent branding with a blue logo and light grey navigation.

**Technical Implementations:**
- **Frontend:** React.js with TypeScript, Tailwind CSS for styling, Wouter for client-side routing, React Hook Form with Zod for form validation, TanStack Query for data fetching and state management.
- **Backend:** Express.js.
- **Database:** PostgreSQL.
- **SEO:** Dynamic meta tag management (SEOHead component), JSON-LD structured data (StructuredData component), robots.txt, sitemap.xml, and web app manifest for PWA capabilities. All canonical URLs point to danbizzarromethod.com (not replit.app domain). Comprehensive technical and content SEO optimizations are implemented, including canonical URLs, Open Graph, and Twitter Cards. Home page features unique title: "Dan Bizzarro Method – International Eventing Coach & Training Clinics" and description highlighting Olympic-shortlisted credentials.

**Feature Specifications:**
- **Coaching Section:** Renamed from "Services" to "Coaching" with updated URL structure (`/coaching/*`). Includes dedicated pages for Private Lessons, Clinics (formerly Group Clinics), Remote Coaching, Dressage, Show Jumping, and Cross Country, all optimized for SEO and dual audience appeal. Flexible clinic management allows per-session and total clinic max participants with transaction-based capacity enforcement. **Privacy-focused design:** session max participant numbers are hidden from public view; only admins see capacity details. Public users see "FULL" or "spots left" warnings without revealing exact capacity numbers. **Clinic Registration Form:** Removed "Experience Level" field (clients select sessions by skill level instead); "Horse Name" is now mandatory for all clinic registrations and syncs to GHL as a custom field; "Special Requests" field placeholder guides users to include preferred session times and specific goals for better clinic organization. **Auto-Fill for Returning Clients:** Email-based lookup automatically pre-fills registration data (name, phone, horse name, emergency contact, medical info) for clients with previous registrations, improving user experience and reducing friction. API endpoint `/api/clinics/lookup-by-email/:email` retrieves most recent registration by email. **GDPR Compliance:** Terms & Conditions section includes comprehensive data privacy notice explaining data storage, usage for clinic management and auto-fill, commitment not to share with third parties, and client rights to view/update/delete data. **Google Maps Integration:** Admin clinic form includes optional Google Maps link field for clinic locations; when provided, clinic location links use the custom Google Maps URL instead of search-based location links. **Call-to-Action Buttons:** Below "Earn Rewards with Every Clinic!" section, replaced "Clinic Terms & Conditions" button with "Book a Virtual Lesson" WhatsApp button (phone: +447767291713).
- **Interactive Tools:**
    - **Readiness Quiz:** An interactive assessment with a specific question order.
    - **Stride Calculator:** A professional tool for equestrian distance calculations.
    - **Packing List Generator:** A customizable checklist creation tool with custom item input.
- **Main Pages:** Home, About, Coaching, Gallery, News, and Contact pages, all designed for independent ranking and improved user experience.
- **Admin Interface:** Includes functionality for managing clinics (with Entry Closing Date tracking), news articles, and Go High Level contact synchronization. Contact and Email Marketing admin pages removed as GHL handles all contact management directly.

## External Dependencies
- **Google Analytics 4:** For website traffic and user behavior analytics.
- **Google Search Console:** For site ownership verification and search performance monitoring.
- **Meta Pixel (Facebook Pixel):** For advertising campaign tracking and conversion events.
- **Go High Level (GHL) API:** Integrated for contact management and synchronization:
  - Newsletter subscriptions automatically create/update contacts in GHL with a "Newsletter" tag
  - Clinic registrations automatically create/update contacts in GHL with:
    - "Clinic Registration" tag
    - Custom field `horse_name` containing the participant's horse name
  - Contact data stored in `ghl_contacts` table for tracking and synchronization
  - Requires environment variables: `GHL_API_KEY` and `GHL_LOCATION_ID`
  - Admin interface available for syncing contacts from GHL to local database