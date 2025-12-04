import puppeteer, { Browser } from 'puppeteer-core';
import * as fs from 'fs';
import * as path from 'path';
import { spawn, ChildProcess } from 'child_process';

const CHROMIUM_PATH = process.env.CHROMIUM_PATH || '/nix/store/zi4f80l169xlmivz8vja8wlphq74qqk0-chromium-125.0.6422.141/bin/chromium';
const PORT = 5555;
const BASE_URL = `http://localhost:${PORT}`;
const OUTPUT_DIR = path.resolve(process.cwd(), 'dist/public/prerender');

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
  '/gallery',
  '/blog',
  '/podcast',
  '/contact',
  '/loyalty',
  '/stride-calculator',
  '/competition-checklists',
  '/readiness-quiz',
  '/packing-list-generator',
  '/terms-and-conditions',
  '/courses/10-points-better',
];

async function startServer(): Promise<ChildProcess> {
  return new Promise((resolve, reject) => {
    console.log('Starting local server for pre-rendering...');
    
    const distPath = path.resolve(process.cwd(), 'dist');
    if (!fs.existsSync(distPath)) {
      reject(new Error('dist folder not found. Run npm run build first.'));
      return;
    }

    const server = spawn('npx', ['serve', '-s', 'dist/public', '-l', PORT.toString()], {
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
    });

    let started = false;
    
    server.stdout?.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Accepting connections') && !started) {
        started = true;
        console.log('Server started on port', PORT);
        setTimeout(() => resolve(server), 1000);
      }
    });

    server.stderr?.on('data', (data) => {
      console.error('Server error:', data.toString());
    });

    server.on('error', (err) => {
      reject(err);
    });

    setTimeout(() => {
      if (!started) {
        started = true;
        resolve(server);
      }
    }, 5000);
  });
}

async function prerenderPage(browser: Browser, route: string): Promise<void> {
  const page = await browser.newPage();
  
  try {
    await page.setUserAgent('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)');
    
    const url = `${BASE_URL}${route}`;
    console.log(`Pre-rendering: ${route}`);
    
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
    
    const sizeKB = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(1);
    console.log(`  ✓ Saved ${outputPath} (${sizeKB} KB)`);
    
  } catch (error) {
    console.error(`  ✗ Failed to pre-render ${route}:`, error);
  } finally {
    await page.close();
  }
}

async function main() {
  console.log('=== Pre-rendering for SEO ===\n');
  
  if (!fs.existsSync(CHROMIUM_PATH)) {
    const altPath = process.env.CHROMIUM_PATH;
    if (!altPath || !fs.existsSync(altPath)) {
      console.error('Chromium not found at:', CHROMIUM_PATH);
      console.error('Set CHROMIUM_PATH environment variable to the correct path');
      process.exit(1);
    }
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let server: ChildProcess | null = null;
  let browser: Browser | null = null;

  try {
    server = await startServer();

    console.log('Launching Chromium...');
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

    console.log(`\nPre-rendering ${ROUTES.length} pages...\n`);

    for (const route of ROUTES) {
      await prerenderPage(browser, route);
    }

    console.log('\n=== Pre-rendering complete! ===');
    console.log(`Output directory: ${OUTPUT_DIR}`);
    
    const files = fs.readdirSync(OUTPUT_DIR);
    console.log(`Generated ${files.length} HTML files`);

  } catch (error) {
    console.error('Pre-rendering failed:', error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
    if (server) {
      server.kill();
    }
  }
}

main().catch(console.error);
