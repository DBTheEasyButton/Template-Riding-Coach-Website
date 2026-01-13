import puppeteer, { Browser } from 'puppeteer-core';
import * as fs from 'fs';
import * as path from 'path';

const CHROMIUM_PATH = process.env.CHROMIUM_PATH || '/nix/store/zi4f80l169xlmivz8vja8wlphq74qqk0-chromium-125.0.6422.141/bin/chromium';
const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}`;
const OUTPUT_DIR = path.resolve(process.cwd(), 'client/public/prerender');

const ROUTES = [
  '/',
  '/about',
  '/coaching',
  '/coaching/private-lessons',
  '/coaching/clinics',
  '/coaching/remote-coaching',
  '/coaching/dressage',
  '/coaching/show-jumping',
  '/coaching/cross-country',
  '/coaching/polework',
  '/coaching/audio-lessons',
  '/gallery',
  '/blog',
  '/podcast',
  '/contact',
  '/loyalty',
  '/stride-calculator',
  '/competition-checklists',
  '/readiness-quiz',
  '/packing-list-generator',
  '/packing-list',
  '/terms-and-conditions',
  '/audio-lessons-terms',
  '/courses/10-points-better',
  '/courses/strong-horse-audio',
  '/courses/strong-horse-audio-offer',
  '/gat-uk-tour',
  '/guides/strong-horse',
];

let isRunning = false;
let lastRunTime: Date | null = null;

async function prerenderPage(browser: Browser, route: string): Promise<boolean> {
  const page = await browser.newPage();
  
  try {
    await page.setUserAgent('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)');
    
    const url = `${BASE_URL}${route}`;
    
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    await page.waitForSelector('#root', { timeout: 10000 });
    await new Promise(resolve => setTimeout(resolve, 2000));

    const html = await page.content();

    const outputPath = route === '/' 
      ? path.join(OUTPUT_DIR, 'index.html')
      : path.join(OUTPUT_DIR, `${route.slice(1).replace(/\//g, '-')}.html`);
    
    const outputDirPath = path.dirname(outputPath);
    if (!fs.existsSync(outputDirPath)) {
      fs.mkdirSync(outputDirPath, { recursive: true });
    }

    fs.writeFileSync(outputPath, html);
    return true;
    
  } catch (error) {
    console.error(`[Prerender] Failed to pre-render ${route}:`, error);
    return false;
  } finally {
    await page.close();
  }
}

async function runPrerender(): Promise<{ success: boolean; pagesRendered: number; errors: number }> {
  if (isRunning) {
    console.log('[Prerender] Already running, skipping...');
    return { success: false, pagesRendered: 0, errors: 0 };
  }

  isRunning = true;
  console.log('[Prerender] Starting SEO pre-rendering...');

  if (!fs.existsSync(CHROMIUM_PATH)) {
    console.error('[Prerender] Chromium not found at:', CHROMIUM_PATH);
    isRunning = false;
    return { success: false, pagesRendered: 0, errors: 1 };
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let browser: Browser | null = null;
  let pagesRendered = 0;
  let errors = 0;

  try {
    browser = await puppeteer.launch({
      executablePath: CHROMIUM_PATH,
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
      ],
    });

    for (const route of ROUTES) {
      const success = await prerenderPage(browser, route);
      if (success) {
        pagesRendered++;
      } else {
        errors++;
      }
    }

    lastRunTime = new Date();
    console.log(`[Prerender] Complete! ${pagesRendered} pages rendered, ${errors} errors`);

    return { success: true, pagesRendered, errors };

  } catch (error) {
    console.error('[Prerender] Failed:', error);
    return { success: false, pagesRendered, errors: errors + 1 };
  } finally {
    if (browser) {
      await browser.close();
    }
    isRunning = false;
  }
}

let debounceTimer: NodeJS.Timeout | null = null;

function triggerPrerender(delay: number = 5000): void {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  console.log(`[Prerender] Scheduled to run in ${delay / 1000} seconds...`);
  
  debounceTimer = setTimeout(() => {
    runPrerender().catch(err => {
      console.error('[Prerender] Background run failed:', err);
    });
  }, delay);
}

function getStatus(): { isRunning: boolean; lastRunTime: Date | null; outputDir: string } {
  return {
    isRunning,
    lastRunTime,
    outputDir: OUTPUT_DIR,
  };
}

export const prerenderService = {
  runPrerender,
  triggerPrerender,
  getStatus,
  ROUTES,
};
