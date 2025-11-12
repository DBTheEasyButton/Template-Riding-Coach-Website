import sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const ATTACHED_ASSETS_DIR = join(process.cwd(), 'attached_assets');
const OPTIMIZED_DIR = join(ATTACHED_ASSETS_DIR, 'optimized');

// Ensure optimized directory exists
if (!existsSync(OPTIMIZED_DIR)) {
  mkdirSync(OPTIMIZED_DIR, { recursive: true });
}

const imagesToOptimize = [
  {
    input: 'FB_IMG_1665518864028_1762982625089.jpg',
    output: 'dressage-hero.jpg',
    description: 'Dressage hero image'
  },
  {
    input: 'IMG-20241014-WA0007_1762982708175.jpg',
    output: 'show-jumping-hero.jpg',
    description: 'Show jumping hero image'
  },
  {
    input: 'cross-country-saumur-riot.jpg',
    output: 'cross-country-hero.jpg',
    description: 'Cross country hero image'
  },
  {
    input: 'DBCLINIC-56_1762982883601.JPG',
    output: 'cross-country-clinic.jpg',
    description: 'Cross country clinic teaching image'
  }
];

async function optimizeImage(inputName: string, outputName: string, description: string) {
  const inputPath = join(ATTACHED_ASSETS_DIR, inputName);
  const outputPath = join(OPTIMIZED_DIR, outputName);

  if (!existsSync(inputPath)) {
    console.error(`❌ Input file not found: ${inputPath}`);
    return;
  }

  try {
    const info = await sharp(inputPath)
      .resize(2000, undefined, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({ 
        quality: 85,
        progressive: true,
        mozjpeg: true
      })
      .toFile(outputPath);

    console.log(`✅ ${description}: ${inputName} → ${outputName}`);
    console.log(`   Original size would be reduced to: ${Math.round(info.size / 1024)}KB`);
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
