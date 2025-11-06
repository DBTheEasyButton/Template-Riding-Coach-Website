# Dan Bizzarro Method - Multi-Page Website Design Guidelines

## Design Approach
**Reference-Based Professional Service Design** - Drawing inspiration from premium coaching platforms like Peloton, MasterClass, and high-end equestrian brands. Focus on credibility, professionalism, and visual storytelling through equestrian imagery.

## Core Design Elements

### Typography
- **Primary Font**: Inter (Google Fonts) - clean, professional, excellent readability
- **Headings**: Font weights 700-800, sizes: h1 (text-5xl/text-6xl), h2 (text-4xl), h3 (text-2xl)
- **Body**: Font weight 400-500, text-base to text-lg for comfortable reading
- **Accent**: Font weight 600 for emphasis and CTAs

### Layout System
**Tailwind Spacing Units**: Consistently use 4, 6, 8, 12, 16, 20, 24, 32 for all spacing
- Section padding: py-20 (desktop), py-12 (mobile)
- Component spacing: gap-8 for grids, space-y-6 for vertical stacks
- Container: max-w-7xl with px-6 for consistent content width

### Navigation
- **Sticky header** with light grey background (subtle, professional)
- Blue logo (left), navigation links (center/right), CTA button (right)
- Mobile: Hamburger menu, full-screen overlay
- Navigation items: Home, About, Services, Gallery, News, Contact

## Page-Specific Layouts

### Home Page
**Hero Section**: Full-width, high-quality equestrian action image (rider + horse in training), 70vh height
- Overlay: Subtle dark gradient for text legibility
- Headline + subheadline + primary CTA button (blurred background)
- Trust indicator below CTA: "Serving Oxfordshire Equestrians Since [Year]"

**Services Preview**: 3-column grid showcasing primary services
- Each card: Icon/image, title, brief description, "Learn More" link

**Testimonials Highlight**: 2-column layout with client photos
- Rotating testimonials or static featured quotes
- Include client name, location, discipline

**News Preview**: 2-column latest articles with featured images

**Contact CTA Section**: Clean, centered with background treatment

### About Page
**Hero**: Portrait-style image of Dan with horses, 50vh
- Brief introduction overlay

**Story Section**: Single-column narrative with supporting images
- Timeline or milestone markers
- Credentials and qualifications showcase

**Philosophy Section**: 2-column text + image layout
- Training methodology explained

### Services Page
**Hero**: Training session action shot, 40vh

**Service Cards**: Each service gets full-width section, alternating image-left/image-right
- Detailed description, pricing if applicable, booking CTA
- Grid of key benefits (4-column on desktop, stack mobile)

### Gallery Page
**Masonry grid layout** - Pinterest-style
- High-quality training photos, competition shots, facility images
- Lightbox functionality for full-size viewing
- Categories: Training, Competitions, Facilities, Students

### News Page
**Grid layout**: 3-column article cards (2-col tablet, 1-col mobile)
- Featured image, title, excerpt, date, "Read More"
- Featured article at top: larger, 2-column span

**Individual Article**: 
- Hero image, headline, date/author
- Single-column text (max-w-prose), inline images
- Related articles footer

### Contact Page
**Two-column layout** (stack on mobile):
- Left: Contact form (name, email, phone, service interest, message)
- Right: Contact details, location map embed, office hours

**Location emphasis**: "Based in Oxfordshire" with service area details

## Component Library

### Buttons
- Primary: Blue background, white text, rounded corners (rounded-lg)
- Secondary: Outline style, blue border
- **Hero/Image Overlays**: backdrop-blur-md with semi-transparent background

### Cards
- Clean white backgrounds, subtle shadow (shadow-md)
- Rounded corners (rounded-xl)
- Hover: Gentle lift effect (translate-y)

### Forms
- Input fields: Border style, rounded-lg, focus:blue ring
- Labels above fields, helper text below
- Submit button: Primary style, full-width mobile

### Footer
- 4-column layout (desktop): Logo/About, Quick Links, Services, Contact Info
- Newsletter signup section above footer
- Social media icons, copyright info

## Images Requirements

### Must-Have Images:
1. **Home Hero**: Dynamic training action shot - rider and horse in motion, outdoor arena preferred
2. **About Hero**: Professional portrait of Dan with horse(s), natural setting
3. **Services Page**: 3-4 high-quality training scenario images
4. **Gallery**: 12-20 diverse images minimum
5. **Testimonial Photos**: 3-4 client headshots
6. **News Articles**: Featured images for each post

**Image Treatment**: Professional photography, natural lighting, authentic moments (not overly posed). All images should reinforce expertise and connection with horses.

## Mobile Optimization
- All grids stack to single column below 768px
- Hero heights reduce to 50vh on mobile
- Touch-friendly button sizes (min 44px height)
- Navigation collapses to hamburger menu
- Forms full-width with generous touch targets

**Brand Consistency**: Blue accent color throughout (CTA buttons, links, logo), light grey navigation maintained across all pages, professional equestrian imagery reinforcing expertise and location.