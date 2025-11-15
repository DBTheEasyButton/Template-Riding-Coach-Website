import sharp from 'sharp';
import { existsSync, mkdirSync, statSync } from 'fs';
import { join } from 'path';

const ATTACHED_ASSETS_DIR = join(process.cwd(), 'attached_assets');
const OPTIMIZED_DIR = join(ATTACHED_ASSETS_DIR, 'optimized');

// Ensure optimized directory exists
if (!existsSync(OPTIMIZED_DIR)) {
  mkdirSync(OPTIMIZED_DIR, { recursive: true });
}

const imagesToOptimize = [
  {
    input: 'optimized/about-dan-hero.jpg',
    output: 'about-dan-hero',
    description: 'About Dan hero image (CRITICAL: 5.6MB → target <200KB)'
  },
  {
    input: 'optimized/hero-background.jpg',
    output: 'hero-background',
    description: 'Home page hero background (419KB → target <150KB)'
  },
  {
    input: 'optimized/cross-country-hero.jpg',
    output: 'cross-country-hero',
    description: 'Cross country hero image (511KB → target <200KB)'
  },
  {
    input: 'optimized/show-jumping-hero.jpg',
    output: 'show-jumping-hero',
    description: 'Show jumping hero image (302KB → target <150KB)'
  },
  {
    input: 'FB_IMG_1665518864028_1762982625089.jpg',
    output: 'dressage-hero',
    description: 'Dressage hero image'
  },
  {
    input: 'IMG-20241014-WA0007_1762982708175.jpg',
    output: 'show-jumping-hero-alt',
    description: 'Show jumping hero image alternative'
  },
  {
    input: 'DBCLINIC-56_1762982883601.JPG',
    output: 'cross-country-clinic',
    description: 'Cross country clinic teaching image'
  },
  {
    input: 'DBCLINIC-11_1762982965143.JPG',
    output: 'show-jumping-clinic',
    description: 'Show jumping clinic teaching image'
  },
  {
    input: 'DBCLINIC-32_1762983134162.JPG',
    output: 'private-lessons-clinic',
    description: 'Private lessons clinic teaching image'
  }
];

async function optimizeImage(inputName: string, outputBaseName: string, description: string) {
  const inputPath = join(ATTACHED_ASSETS_DIR, inputName);
  const outputJpgPath = join(OPTIMIZED_DIR, `${outputBaseName}.jpg`);
  const outputWebpPath = join(OPTIMIZED_DIR, `${outputBaseName}.webp`);
  const tempJpgPath = join(OPTIMIZED_DIR, `${outputBaseName}.temp.jpg`);
  const tempWebpPath = join(OPTIMIZED_DIR, `${outputBaseName}.temp.webp`);

  if (!existsSync(inputPath)) {
    console.error(`❌ Input file not found: ${inputPath}`);
    return;
  }

  const inputSize = statSync(inputPath).size;

  try {
    // More aggressive compression for very large files
    const maxWidth = inputSize > 3000000 ? 1600 : 1920;
    const jpegQuality = inputSize > 3000000 ? 70 : inputSize > 500000 ? 75 : 80;
    
    const image = sharp(inputPath).resize(maxWidth, undefined, {
      withoutEnlargement: true,
      fit: 'inside'
    });

    // Try JPEG with adaptive quality
    const tempJpegInfo = await image.clone()
      .jpeg({ 
        quality: jpegQuality,
        progressive: true,
        mozjpeg: true
      })
      .toFile(tempJpgPath);

    // ALWAYS keep whichever is smaller - no tolerance
    const { renameSync, unlinkSync, copyFileSync } = await import('fs');
    if (tempJpegInfo.size < inputSize) {
      renameSync(tempJpgPath, outputJpgPath);
    } else {
      unlinkSync(tempJpgPath);
      copyFileSync(inputPath, outputJpgPath);
      console.log(`   Keeping original JPEG (smaller than optimized)`);
    }

    const finalJpegSize = statSync(outputJpgPath).size;

    // Try WebP with quality that targets being smaller than JPEG
    const webpQuality = inputSize > 500000 ? 70 : 80;
    const tempWebpInfo = await image.clone()
      .webp({ 
        quality: webpQuality,
        effort: 4
      })
      .toFile(tempWebpPath);

    // Only keep WebP if it's smaller than the JPEG
    if (tempWebpInfo.size < finalJpegSize) {
      renameSync(tempWebpPath, outputWebpPath);
      console.log(`✅ ${description}:`);
      console.log(`   Original: ${Math.round(inputSize / 1024)}KB`);
      console.log(`   JPEG: ${Math.round(finalJpegSize / 1024)}KB`);
      console.log(`   WebP: ${Math.round(tempWebpInfo.size / 1024)}KB ✨ (${Math.round((1 - tempWebpInfo.size/finalJpegSize) * 100)}% smaller)`);
    } else {
      unlinkSync(tempWebpPath);
      console.log(`✅ ${description}:`);
      console.log(`   Original: ${Math.round(inputSize / 1024)}KB`);
      console.log(`   JPEG: ${Math.round(finalJpegSize / 1024)}KB`);
      console.log(`   WebP: Skipped (would be larger than JPEG)`);
    }
  } catch (error) {
    console.error(`❌ Error optimizing ${inputName}:`, error);
  }
}

async function optimizeAll() {
  console.log('🖼️  Optimizing images for fast loading...\n');
  
  for (const image of imagesToOptimize) {
    await optimizeImage(image.input, image.output, image.description);
  }
  
  console.log('\n✨ All images optimized!');
}

optimizeAll();
