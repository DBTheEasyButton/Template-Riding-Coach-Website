import { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  preloadImage?: string;
  preloadImageJpeg?: string;
  schemas?: Array<Record<string, any>>;
}

function SEOHead({ 
  title = "Dan Bizzarro Method - Professional Eventing Coaching & Training",
  description = "Expert eventing coaching from international event rider Dan Bizzarro. Stride calculator, readiness assessments, and professional equestrian training in Oxfordshire.",
  keywords = "eventing, horse training, dressage, show jumping, cross country, Dan Bizzarro, equestrian coaching, stride calculator, eventing quiz, competition preparation",
  canonical,
  ogImage = "/hero-background.jpg",
  preloadImage,
  preloadImageJpeg,
  schemas = []
}: SEOHeadProps) {
  
  useEffect(() => {
    // Update title
    document.title = title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    // Update keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords);
    
    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    if (canonical) {
      canonicalLink.setAttribute('href', canonical);
    } else {
      canonicalLink.setAttribute('href', window.location.href.split('?')[0]);
    }
    
    // Update Open Graph tags
    const updateMetaProperty = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    
    updateMetaProperty('og:title', title);
    updateMetaProperty('og:description', description);
    updateMetaProperty('og:image', ogImage);
    updateMetaProperty('og:url', canonical || window.location.href.split('?')[0]);
    
    // Update Twitter Card tags
    const updateTwitterMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    
    updateTwitterMeta('twitter:title', title);
    updateTwitterMeta('twitter:description', description);
    updateTwitterMeta('twitter:image', ogImage);
    
    // Add preload links for hero image (LCP optimization)
    // Remove existing preload links if present
    const existingPreloads = document.querySelectorAll('link[rel="preload"][as="image"][data-hero-preload]');
    existingPreloads.forEach(link => link.remove());

    // Preload WebP version (for modern browsers)
    if (preloadImage) {
      const webpPreload = document.createElement('link');
      webpPreload.setAttribute('rel', 'preload');
      webpPreload.setAttribute('as', 'image');
      webpPreload.setAttribute('href', preloadImage);
      webpPreload.setAttribute('fetchpriority', 'high');
      webpPreload.setAttribute('data-hero-preload', 'true');
      if (preloadImage.endsWith('.webp')) {
        webpPreload.setAttribute('type', 'image/webp');
      }
      document.head.appendChild(webpPreload);
    }

    // Preload JPEG fallback (for browsers without WebP support)
    if (preloadImageJpeg) {
      const jpegPreload = document.createElement('link');
      jpegPreload.setAttribute('rel', 'preload');
      jpegPreload.setAttribute('as', 'image');
      jpegPreload.setAttribute('href', preloadImageJpeg);
      jpegPreload.setAttribute('fetchpriority', 'high');
      jpegPreload.setAttribute('data-hero-preload', 'true');
      jpegPreload.setAttribute('type', 'image/jpeg');
      document.head.appendChild(jpegPreload);
    }

    // Inject structured data schemas
    // Remove existing page-specific schemas (excluding Organization, Website, LocalBusiness)
    const existingSchemas = document.querySelectorAll('script[type="application/ld+json"][data-page-schema]');
    existingSchemas.forEach(script => script.remove());

    // Add new schemas
    schemas.forEach((schema, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-page-schema', 'true');
      script.setAttribute('data-schema-index', String(index));
      script.innerHTML = JSON.stringify(schema, null, 2);
      document.head.appendChild(script);
    });
    
  }, [title, description, keywords, canonical, ogImage, preloadImage, preloadImageJpeg, schemas]);
  
  return null;
}

export { SEOHead };
export default SEOHead;