import { Request, Response, NextFunction } from "express";
import { seoConfig, getSEOConfig, getCanonicalUrl, BASE_URL } from "../shared/seoConfig";
import { createBreadcrumbSchema, getBreadcrumbsFromPath, createServiceSchema, createFAQSchema } from "../shared/schemaHelpers";
import { storage } from "./storage";

/**
 * Server-side SEO middleware
 * Injects route-specific meta tags and structured data into HTML responses
 * This ensures search bots see unique metadata without executing JavaScript
 */

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

interface DynamicSEOConfig {
  title: string;
  description: string;
  keywords: string;
  canonicalPath: string;
  ogImage?: string;
  h1?: string;
  publishedAt?: Date;
  modifiedAt?: Date;
  author?: string;
  articleType?: 'BlogPosting' | 'NewsArticle';
}

function createBlogPostSchema(config: DynamicSEOConfig): object {
  return {
    "@context": "https://schema.org",
    "@type": config.articleType || "BlogPosting",
    "headline": config.title.replace(' | Dan Bizzarro Method', ''),
    "description": config.description,
    "author": {
      "@type": "Person",
      "name": config.author || "Dan Bizzarro",
      "url": `${BASE_URL}/about`
    },
    "publisher": {
      "@type": "Organization",
      "name": "Dan Bizzarro Method",
      "url": BASE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${BASE_URL}${config.canonicalPath}`
    },
    "datePublished": config.publishedAt?.toISOString(),
    "dateModified": config.modifiedAt?.toISOString() || config.publishedAt?.toISOString(),
    "image": config.ogImage ? `${BASE_URL}${config.ogImage}` : `${BASE_URL}/hero-background.jpg`
  };
}

export function injectSEOMetadata(html: string, requestPath: string, dynamicConfig?: DynamicSEOConfig): string {
  // Normalize path: remove query params, hash, and trailing slash (except for root)
  let normalizedPath = requestPath.split('?')[0].split('#')[0];
  normalizedPath = normalizedPath === '/' ? '/' : normalizedPath.replace(/\/$/, '');
  
  // Use dynamic config if provided, otherwise fall back to static config
  const configToUse = dynamicConfig || seoConfig[normalizedPath] || seoConfig['/'];
  
  if (!configToUse) {
    console.warn(`No SEO config found for path: ${normalizedPath}, using fallback`);
    return html;
  }
  
  // Escape all values for HTML injection
  const title = escapeHtml(configToUse.title);
  const description = escapeHtml(configToUse.description);
  const keywords = escapeHtml(configToUse.keywords);
  const canonical = escapeHtml(getCanonicalUrl(configToUse.canonicalPath));
  const ogImage = configToUse.ogImage || '/hero-background.jpg';
  
  // Replace meta tags (case-insensitive)
  let modifiedHtml = html;
  
  // Replace title tag
  modifiedHtml = modifiedHtml.replace(
    /<title>.*?<\/title>/i,
    `<title>${title}</title>`
  );
  
  // Replace description meta tag
  modifiedHtml = modifiedHtml.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${description}" />`
  );
  
  // Replace keywords meta tag
  modifiedHtml = modifiedHtml.replace(
    /<meta\s+name="keywords"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="keywords" content="${keywords}" />`
  );
  
  // Add or replace canonical link (inject before </head> if not present)
  if (modifiedHtml.match(/<link\s+rel="canonical"/i)) {
    modifiedHtml = modifiedHtml.replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
      `<link rel="canonical" href="${canonical}" />`
    );
  } else {
    modifiedHtml = modifiedHtml.replace(
      /<\/head>/i,
      `    <link rel="canonical" href="${canonical}" />\n  </head>`
    );
  }
  
  // Replace Open Graph tags
  modifiedHtml = modifiedHtml.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${title}" />`
  );
  
  modifiedHtml = modifiedHtml.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${description}" />`
  );
  
  modifiedHtml = modifiedHtml.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${canonical}" />`
  );
  
  // Add og:type for articles
  if (dynamicConfig?.articleType) {
    modifiedHtml = modifiedHtml.replace(
      /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:type" content="article" />`
    );
  }
  
  // Replace Twitter Card tags
  modifiedHtml = modifiedHtml.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:title" content="${title}" />`
  );
  
  modifiedHtml = modifiedHtml.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:description" content="${description}" />`
  );
  
  // Generate and inject structured data schemas
  const schemas: any[] = [];
  
  // Add BlogPosting schema for blog posts
  if (dynamicConfig?.articleType) {
    schemas.push(createBlogPostSchema(dynamicConfig));
  }
  
  // Add Breadcrumb schema for all pages
  const breadcrumbs = getBreadcrumbsFromPath(normalizedPath, dynamicConfig?.h1 || (configToUse as any).h1);
  if (breadcrumbs.length > 0) {
    schemas.push(createBreadcrumbSchema(breadcrumbs));
  }
  
  // Inject schemas before </head>
  if (schemas.length > 0) {
    const schemasHtml = schemas.map((schema, index) => {
      return `    <script type="application/ld+json" data-page-schema="true" data-schema-index="${index}">
${JSON.stringify(schema, null, 2).split('\n').map(line => '      ' + line).join('\n')}
    </script>`;
    }).join('\n');
    
    modifiedHtml = modifiedHtml.replace(
      /<\/head>/i,
      `${schemasHtml}\n  </head>`
    );
  }
  
  return modifiedHtml;
}

/**
 * Check if path is a blog post route and extract slug
 */
function extractBlogSlug(path: string): string | null {
  const blogMatch = path.match(/^\/blog\/([^\/\?#]+)$/);
  return blogMatch ? blogMatch[1] : null;
}

/**
 * Get fallback SEO config for blog pages when post is not found
 */
function getBlogFallbackSEO(): DynamicSEOConfig {
  const blogConfig = seoConfig['/blog'];
  return {
    title: blogConfig.title,
    description: blogConfig.description,
    keywords: blogConfig.keywords,
    canonicalPath: '/blog',
    h1: blogConfig.h1
  };
}

/**
 * Fetch blog post SEO data from database
 */
async function getBlogPostSEO(slug: string): Promise<DynamicSEOConfig> {
  try {
    const post = await storage.getNewsBySlug(slug);
    if (!post) {
      // Blog post not found - use blog index SEO as fallback
      console.warn(`Blog post not found for slug: ${slug}, using blog index fallback`);
      return getBlogFallbackSEO();
    }
    
    // Create SEO-optimized title (max ~60 chars for Google)
    const seoTitle = `${post.title} | Dan Bizzarro Method`;
    
    // Create description from excerpt (max ~155 chars for Google)
    let description = post.excerpt;
    if (description.length > 155) {
      description = description.substring(0, 152) + '...';
    }
    
    return {
      title: seoTitle,
      description: description,
      keywords: `${post.title.toLowerCase()}, horse training, equestrian tips, Dan Bizzarro Method`,
      canonicalPath: `/blog/${slug}`,
      ogImage: post.image || '/hero-background.jpg',
      h1: post.title,
      publishedAt: post.publishedAt,
      modifiedAt: post.publishedAt, // Use same as published for now
      author: 'Dan Bizzarro',
      articleType: 'BlogPosting'
    };
  } catch (error) {
    console.error(`Error fetching blog post SEO for slug: ${slug}`, error);
    return getBlogFallbackSEO();
  }
}

/**
 * Express middleware to inject SEO metadata into HTML responses
 * Handles both string payloads (development/Vite) and streamed responses (production/sendFile)
 */
export function seoMiddleware(req: Request, res: Response, next: NextFunction) {
  // Get the original URL before Vite rewrites it
  const requestUrl = req.originalUrl || req.url;
  
  // Only process GET requests for HTML pages (not API routes, static assets, etc.)
  if (req.method !== 'GET' || requestUrl.startsWith('/api') || requestUrl.includes('.')) {
    return next();
  }
  
  // Normalize path
  let normalizedPath = requestUrl.split('?')[0].split('#')[0];
  normalizedPath = normalizedPath === '/' ? '/' : normalizedPath.replace(/\/$/, '');
  
  // Check if this is a blog post that needs dynamic SEO
  const blogSlug = extractBlogSlug(normalizedPath);
  
  // If it's a blog post, fetch SEO data asynchronously
  const seoDataPromise = blogSlug ? getBlogPostSEO(blogSlug) : Promise.resolve(null);
  
  // Store original methods
  const originalSend = res.send;
  const originalEnd = res.end;
  const originalWrite = res.write;
  
  // Buffer to accumulate streamed chunks
  let chunks: Buffer[] = [];
  let isHtmlResponse = false;
  
  // Override res.write to capture streamed chunks
  res.write = function (this: Response, chunk: any, encodingOrCb?: any, cb?: any): boolean {
    // Check if this is HTML content by looking at Content-Type or chunk content
    if (!isHtmlResponse && typeof chunk === 'string' && chunk.includes('<!DOCTYPE html>')) {
      isHtmlResponse = true;
    }
    
    if (isHtmlResponse) {
      // Buffer chunks for later processing
      if (typeof chunk === 'string') {
        chunks.push(Buffer.from(chunk));
      } else if (Buffer.isBuffer(chunk)) {
        chunks.push(chunk);
      }
      return true; // Pretend we wrote it
    }
    
    // Not HTML, pass through
    return originalWrite.call(this, chunk, encodingOrCb, cb);
  } as any;
  
  // Override res.send to inject SEO metadata
  res.send = function (this: Response, data: any) {
    // Only process HTML responses
    if (typeof data === 'string' && data.includes('<!DOCTYPE html>')) {
      // Wait for SEO data before processing
      seoDataPromise.then((dynamicSEO) => {
        data = injectSEOMetadata(data, requestUrl, dynamicSEO || undefined);
        return originalSend.call(this, data);
      }).catch((err) => {
        console.error('Error in SEO middleware:', err);
        return originalSend.call(this, data);
      });
      return this;
    } else if (Buffer.isBuffer(data)) {
      const str = data.toString('utf-8');
      if (str.includes('<!DOCTYPE html>')) {
        seoDataPromise.then((dynamicSEO) => {
          data = Buffer.from(injectSEOMetadata(str, requestUrl, dynamicSEO || undefined));
          return originalSend.call(this, data);
        }).catch((err) => {
          console.error('Error in SEO middleware:', err);
          return originalSend.call(this, data);
        });
        return this;
      }
    }
    
    // Call original send with modified data
    return originalSend.call(this, data);
  } as any;
  
  // Override res.end to inject SEO metadata
  res.end = function (this: Response, chunk?: any, encodingOrCb?: any, cb?: any) {
    // If we buffered chunks, process them now
    if (chunks.length > 0) {
      const htmlContent = Buffer.concat(chunks).toString('utf-8');
      seoDataPromise.then((dynamicSEO) => {
        const modifiedHtml = injectSEOMetadata(htmlContent, requestUrl, dynamicSEO || undefined);
        chunks = []; // Clear buffer
        return originalEnd.call(this, modifiedHtml, encodingOrCb, cb);
      }).catch((err) => {
        console.error('Error in SEO middleware:', err);
        return originalEnd.call(this, htmlContent, encodingOrCb, cb);
      });
      return this;
    }
    
    // Handle direct string or buffer payloads
    if (typeof chunk === 'string' && chunk.includes('<!DOCTYPE html>')) {
      seoDataPromise.then((dynamicSEO) => {
        chunk = injectSEOMetadata(chunk, requestUrl, dynamicSEO || undefined);
        return originalEnd.call(this, chunk, encodingOrCb, cb);
      }).catch((err) => {
        console.error('Error in SEO middleware:', err);
        return originalEnd.call(this, chunk, encodingOrCb, cb);
      });
      return this;
    } else if (Buffer.isBuffer(chunk)) {
      const str = chunk.toString('utf-8');
      if (str.includes('<!DOCTYPE html>')) {
        seoDataPromise.then((dynamicSEO) => {
          chunk = Buffer.from(injectSEOMetadata(str, requestUrl, dynamicSEO || undefined));
          return originalEnd.call(this, chunk, encodingOrCb, cb);
        }).catch((err) => {
          console.error('Error in SEO middleware:', err);
          return originalEnd.call(this, chunk, encodingOrCb, cb);
        });
        return this;
      }
    }
    
    // Call original end with modified data
    return originalEnd.call(this, chunk, encodingOrCb, cb);
  } as any;
  
  next();
}
