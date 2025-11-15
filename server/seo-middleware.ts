import { Request, Response, NextFunction } from "express";
import { seoConfig, getSEOConfig, getCanonicalUrl } from "../shared/seoConfig";
import { createBreadcrumbSchema, getBreadcrumbsFromPath, createServiceSchema, createFAQSchema } from "../shared/schemaHelpers";

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

export function injectSEOMetadata(html: string, requestPath: string): string {
  // Normalize path: remove trailing slash (except for root)
  const normalizedPath = requestPath === '/' ? '/' : requestPath.replace(/\/$/, '');
  
  // Get SEO config for this route
  const config = seoConfig[normalizedPath];
  
  // If no config found, try without query params
  const pathWithoutQuery = normalizedPath.split('?')[0];
  const configToUse = config || seoConfig[pathWithoutQuery] || seoConfig['/'];
  
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
  
  // Add Breadcrumb schema for all pages
  const breadcrumbs = getBreadcrumbsFromPath(normalizedPath, configToUse.h1);
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
 * Express middleware to inject SEO metadata into HTML responses
 * Only intercepts HTML content for known routes
 */
export function seoMiddleware(req: Request, res: Response, next: NextFunction) {
  // Only process GET requests for HTML pages (not API routes, static assets, etc.)
  if (req.method !== 'GET' || req.path.startsWith('/api') || req.path.includes('.')) {
    return next();
  }
  
  // Store original res.send
  const originalSend = res.send;
  
  // Override res.send to inject SEO metadata
  res.send = function (this: Response, data: any) {
    // Only process HTML responses
    if (typeof data === 'string' && data.includes('<!DOCTYPE html>')) {
      // Inject SEO metadata based on request path
      data = injectSEOMetadata(data, req.path);
    }
    
    // Call original send with modified data
    return originalSend.call(this, data);
  } as any;
  
  next();
}
