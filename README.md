# Equestrian Coaching Website Template

A professional, reusable website template designed for equestrian coaches and riding instructors. Built with a modern tech stack, this template provides everything needed to run a coaching business online — clinic booking, payment processing, loyalty programs, CRM integration, and a full admin dashboard.

## Features

### Public Website
- **Home** — Hero section, clinic promotions, and calls-to-action
- **About** — Coach biography and credentials
- **Coaching Pages** — Private Lessons, Group Clinics, Remote Coaching, Dressage, Show Jumping, Cross Country, Polework
- **Blog** — News articles and training tips
- **Gallery** — Photo gallery
- **Contact** — Contact form and details
- **Loyalty Programme** — Points leaderboard and referral rewards

### Clinic Booking System
- Online registration with multi-entry support (book multiple horses/participants)
- Stripe payment processing with discount codes
- Email confirmations and announcements
- Facebook auto-posting when new clinics are created
- CRM contact filtering by tags for targeted email announcements

### Loyalty Program
- Points system for clinic attendance
- Referral rewards with automatic discount code generation
- Leaderboard display

### Admin Dashboard (`/admin`)
- **Two-Tier Admin System:**
  - **Super Admin** — Full access including Settings and feature toggles
  - **Client Admin** — Limited access to manage content only
- **Manage:** Clinics, Registrations, Groups, Blog, Gallery, Testimonials, CRM, Analytics, Settings
- **Feature Toggles (Super Admin):**
  1. **Online Booking System** — Clinic registration, online payments, email announcements to tagged contacts, Facebook auto-posting
  2. **Advanced Clinic System** — Email automations, automatic group assignments, schedule generation, schedule notification emails

### SEO & Performance
- Pre-rendering system for search engine crawlers
- Bot detection middleware (Google, ChatGPT, Claude, etc.)
- WCAG 2.1 accessibility compliance
- Mobile-optimized responsive design
- Google Analytics, Meta Pixel, Microsoft Clarity, and GTM support

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, TypeScript, Tailwind CSS, Wouter, TanStack Query |
| Backend | Express.js, Node.js |
| Database | PostgreSQL |
| Payments | Stripe |
| CRM | Go High Level |

## Getting Started

### 1. Clone & Deploy on Replit

Fork or clone this template on [Replit](https://replit.com). The application runs with a single command:

```bash
npm run dev
```

### 2. Configure Secrets

Add these secrets in the Replit **Secrets** tab:

**Required:**
| Secret | Description |
|--------|-------------|
| `ADMIN_EMAIL_1` | First super admin email |
| `ADMIN_PASSWORD_1` | First super admin password |
| `ADMIN_EMAIL_2` | Second super admin email |
| `ADMIN_PASSWORD_2` | Second super admin password |
| `SESSION_SECRET` | Random string for session security (required in production) |

**Payments:**
| Secret | Description |
|--------|-------------|
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |

**CRM Integration:**
| Secret | Description |
|--------|-------------|
| `GHL_API_KEY` | Go High Level API key |
| `GHL_LOCATION_ID` | Go High Level location ID |

**Social Media (Optional):**
| Secret | Description |
|--------|-------------|
| `FACEBOOK_APP_ID` | Facebook marketing automation |
| `FACEBOOK_APP_SECRET` | Facebook marketing automation |
| `FACEBOOK_PAGE_ACCESS_TOKEN` | Auto-posting to Facebook |

### 3. Replace Branding

Replace the placeholder images in `attached_assets/` with your own:

- `attached_assets/logo-light-bg.png` — Main logo for light backgrounds (navigation)
- `attached_assets/logo-dark-bg.png` — Logo for dark backgrounds (footer)
- `attached_assets/newsletter-logo.png` — Newsletter section logo
- `client/public/logo.png` — Square logo for favicon/browser tab

Replace all images in `attached_assets/optimized/` with your own coaching photos.

### 4. Update Business Information

- Update `shared/seoConfig.ts` and `client/src/data/seoConfig.ts` with your business name, descriptions, and keywords
- Search the codebase for `[YOUR` placeholder values and replace with your details
- Update contact details in `client/src/components/Footer.tsx`
- Update colors in `client/src/index.css` and `tailwind.config.ts`

### 5. Configure Analytics

Update `client/index.html` with your tracking IDs:
- Google Analytics 4 (`YOUR_GA4_ID`)
- Meta Pixel (`YOUR_FACEBOOK_PIXEL_ID`)
- Microsoft Clarity (`YOUR_CLARITY_ID`)
- Google Tag Manager (`GTM-XXXXXXXX`)

### 6. Add Content

Use the Admin dashboard to add:
- Testimonials
- Blog articles (use HTML formatting, not markdown)
- Clinic events
- Gallery photos
- Service descriptions

### 7. Customize Lead Magnet PDF

Edit `server/generateLeadMagnetPDF.ts` to customize the free guide PDF with your own content, title, and branding.

## Pre-Rendering

For SEO, static pages are pre-rendered for search engine bots. After making changes to static pages, regenerate them:

```bash
npx tsx scripts/prerender.ts
```

## Database

The template uses PostgreSQL (Replit built-in). Schema changes are managed with Drizzle ORM:

```bash
npm run db:push
```

## Project Structure

```
client/                  # Frontend (React + TypeScript)
  src/
    pages/               # Page components
    components/          # Reusable UI components
    data/                # SEO and static data
    hooks/               # Custom React hooks
    lib/                 # Utilities
  public/                # Static assets
server/                  # Backend (Express.js)
  routes.ts              # API endpoints
  storage.ts             # Database operations
  emailService.ts        # Email functionality
shared/                  # Shared types and schemas
  schema.ts              # Database schema (Drizzle ORM)
attached_assets/         # Branding images and assets
  optimized/             # Optimized versions for web
```

## License

This template is provided as-is for use in building equestrian coaching websites.
