import express, { type Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import { registerRoutes } from "./routes";
import { setupVite, log } from "./vite";
import { seoMiddleware } from "./seo-middleware";
import { botDetectionMiddleware, isPrerenderingAvailable } from "./botDetection";
import { waitlistService } from "./waitlistService";
import fs from "fs";
import path from "path";

const app = express();

// Cookie parser for visitor recognition
app.use(cookieParser());

// CRITICAL: Stripe webhook needs raw body for signature verification
// Apply raw body parser ONLY for webhook endpoint, JSON parser for everything else
app.use((req, res, next) => {
  if (req.path === '/api/stripe-webhook') {
    // Webhook gets raw JSON for signature verification
    express.raw({ type: 'application/json' })(req, res, next);
  } else {
    // All other routes get JSON parsing
    express.json({ limit: '10mb' })(req, res, next);
  }
});
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    // In development, enable bot detection for pre-rendered files if available
    if (isPrerenderingAvailable()) {
      log('Pre-rendered pages available - bot detection enabled for development');
      app.use(botDetectionMiddleware);
    }
    // Fallback to SSR middleware for SEO testing
    app.use(seoMiddleware);
    await setupVite(app, server);
  } else {
    // Production: Custom static file serving with bot detection
    const distPath = path.resolve(import.meta.dirname, "public");
    
    if (!fs.existsSync(distPath)) {
      throw new Error(`Could not find the build directory: ${distPath}, make sure to build the client first`);
    }
    
    // Serve static assets (JS, CSS, images) directly - they don't need SEO processing
    app.use(express.static(distPath, { index: false }));
    
    // Bot detection: serve pre-rendered HTML to search engines and AI crawlers
    // This replaces the SSR middleware in production for better reliability
    if (isPrerenderingAvailable()) {
      log('Pre-rendered pages available - bot detection enabled');
      app.use(botDetectionMiddleware);
    } else {
      log('No pre-rendered pages found - bots will see SPA shell');
    }
    
    // Handle all HTML routes by serving the SPA shell
    // Regular users get the fast SPA, bots get pre-rendered HTML (handled above)
    app.use("*", (_req, res) => {
      const indexPath = path.resolve(distPath, "index.html");
      fs.readFile(indexPath, "utf-8", (err, html) => {
        if (err) {
          res.status(500).send("Error loading page");
          return;
        }
        res.status(200).set({ "Content-Type": "text/html; charset=UTF-8" }).send(html);
      });
    });
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
    
    // Start background services
    waitlistService.start();
  });
})();
