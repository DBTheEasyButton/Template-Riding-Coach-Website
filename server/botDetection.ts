import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';

const BOT_USER_AGENTS = [
  'googlebot',
  'google-inspectiontool',
  'bingbot',
  'slurp',
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'facebot',
  'facebookexternalhit',
  'twitterbot',
  'rogerbot',
  'linkedinbot',
  'embedly',
  'quora link preview',
  'showyoubot',
  'outbrain',
  'pinterest',
  'slackbot',
  'vkshare',
  'w3c_validator',
  'redditbot',
  'applebot',
  'whatsapp',
  'flipboard',
  'tumblr',
  'bitlybot',
  'skypeuripreview',
  'nuzzel',
  'discordbot',
  'qwantify',
  'pinterestbot',
  'bitrix',
  'xing-contenttabreceiver',
  'chrome-lighthouse',
  'telegrambot',
  'gptbot',
  'chatgpt-user',
  'chatgpt',
  'claude-web',
  'claude',
  'anthropic-ai',
  'perplexitybot',
  'cohere-ai',
  'ai2bot',
  'bytespider',
  'petalbot',
  'ahrefsbot',
  'semrushbot',
  'dotbot',
  'screaming frog',
];

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const PRERENDER_DIR = path.resolve(
  process.cwd(), 
  IS_PRODUCTION ? 'dist/public/prerender' : 'client/public/prerender'
);

function isBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => ua.includes(bot));
}

function getPrerenderedFilePath(requestPath: string): string {
  const normalizedPath = requestPath === '/' ? 'index' : requestPath.slice(1).replace(/\//g, '-');
  return path.join(PRERENDER_DIR, `${normalizedPath}.html`);
}

export function botDetectionMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (req.method !== 'GET') {
    return next();
  }

  if (req.path.startsWith('/api') || req.path.includes('.')) {
    return next();
  }

  const userAgent = req.get('User-Agent') || '';
  
  if (!isBot(userAgent)) {
    return next();
  }

  const prerenderedPath = getPrerenderedFilePath(req.path);
  
  if (!fs.existsSync(prerenderedPath)) {
    console.log(`[Bot Detection] No pre-rendered file for ${req.path}, falling back to SSR`);
    return next();
  }

  console.log(`[Bot Detection] Serving pre-rendered HTML to ${userAgent.substring(0, 50)}... for ${req.path}`);
  
  res.setHeader('Content-Type', 'text/html; charset=UTF-8');
  res.setHeader('X-Prerendered', 'true');
  
  fs.readFile(prerenderedPath, 'utf-8', (err, html) => {
    if (err) {
      console.error(`[Bot Detection] Error reading pre-rendered file:`, err);
      return next();
    }
    res.send(html);
  });
}

export function isPrerenderingAvailable(): boolean {
  return fs.existsSync(PRERENDER_DIR) && fs.readdirSync(PRERENDER_DIR).length > 0;
}
