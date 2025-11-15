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
  // Normalize path: remove query params, hash, and trailing slash (except for root)
  let normalizedPath = requestPath.split('?')[0].split('#')[0];
  normalizedPath = normalizedPath === '/' ? '/' : normalizedPath.replace(/\/$/, '');
  
  // Get SEO config for this route
  const configToUse = seoConfig[normalizedPath] || seoConfig['/'];
  
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
 * Handles both string payloads (development/Vite) and streamed responses (production/sendFile)
 */
export function seoMiddleware(req: Request, res: Response, next: NextFunction) {
  // Get the original URL before Vite rewrites it
  const requestUrl = req.originalUrl || req.url;
  
  // Only process GET requests for HTML pages (not API routes, static assets, etc.)
  if (req.method !== 'GET' || requestUrl.startsWith('/api') || requestUrl.includes('.')) {
    return next();
  }
  
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
      // Inject SEO metadata based on original request URL (before Vite rewrite)
      data = injectSEOMetadata(data, requestUrl);
    } else if (Buffer.isBuffer(data)) {
      const str = data.toString('utf-8');
      if (str.includes('<!DOCTYPE html>')) {
        data = Buffer.from(injectSEOMetadata(str, requestUrl));
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
      const modifiedHtml = injectSEOMetadata(htmlContent, requestUrl);
      chunks = []; // Clear buffer
      return originalEnd.call(this, modifiedHtml, encodingOrCb, cb);
    }
    
    // Handle direct string or buffer payloads
    if (typeof chunk === 'string' && chunk.includes('<!DOCTYPE html>')) {
      chunk = injectSEOMetadata(chunk, requestUrl);
    } else if (Buffer.isBuffer(chunk)) {
      const str = chunk.toString('utf-8');
      if (str.includes('<!DOCTYPE html>')) {
        chunk = Buffer.from(injectSEOMetadata(str, requestUrl));
      }
    }
    
    // Call original end with modified data
    return originalEnd.call(this, chunk, encodingOrCb, cb);
  } as any;
  
  next();
}
