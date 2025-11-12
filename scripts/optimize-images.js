import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.join(__dirname, '../attached_assets');
const optimizedDir = path.join(assetsDir, 'optimized');

// Create optimized directory if it doesn't exist
if (!fs.existsSync(optimizedDir)) {
  fs.mkdirSync(optimizedDir, { recursive: true });
}

// Image optimization settings
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;
const JPEG_QUALITY = 85;
const WEBP_QUALITY = 85;

async function optimizeImage(filePath, filename) {
  try {
    const ext = path.extname(filename).toLowerCase();
    const baseName = path.basename(filename, ext);
    
    // Skip already optimized images
    if (filename.includes('optimized') || filename.includes('-opt')) {
      console.log(`⏭️  Skipping: ${filename} (already optimized)`);
      return;
    }

    // Read image metadata
    const metadata = await sharp(filePath).metadata();
    console.log(`📸 Processing: ${filename} (${metadata.width}x${metadata.height}, ${(fs.statSync(filePath).size / 1024 / 1024).toFixed(2)}MB)`);

    // Determine if resizing is needed
    const needsResize = metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT;
    
    let pipeline = sharp(filePath);
    
    // Resize if needed (maintaining aspect ratio)
    if (needsResize) {
      pipeline = pipeline.resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    // Optimize based on file type
    if (['.jpg', '.jpeg'].includes(ext)) {
      // Create optimized JPEG
      const outputPath = path.join(optimizedDir, `${baseName}.jpg`);
      await pipeline
        .jpeg({ quality: JPEG_QUALITY, progressive: true })
        .toFile(outputPath);
      
      const originalSize = fs.statSync(filePath).size / 1024 / 1024;
      const newSize = fs.statSync(outputPath).size / 1024 / 1024;
      const savings = ((1 - newSize / originalSize) * 100).toFixed(1);
      
      console.log(`✅ Optimized: ${filename} → ${baseName}.jpg (${originalSize.toFixed(2)}MB → ${newSize.toFixed(2)}MB, ${savings}% smaller)`);
      
      // Also create WebP version for modern browsers
      const webpPath = path.join(optimizedDir, `${baseName}.webp`);
      await sharp(filePath)
        .resize(MAX_WIDTH, MAX_HEIGHT, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: WEBP_QUALITY })
        .toFile(webpPath);
      
      const webpSize = fs.statSync(webpPath).size / 1024 / 1024;
      console.log(`✅ WebP version: ${baseName}.webp (${webpSize.toFixed(2)}MB)`);
    } else if (ext === '.png') {
      // Optimize PNG
      const outputPath = path.join(optimizedDir, `${baseName}.png`);
      await pipeline
        .png({ quality: 90, compressionLevel: 9 })
        .toFile(outputPath);
      
      const originalSize = fs.statSync(filePath).size / 1024 / 1024;
      const newSize = fs.statSync(outputPath).size / 1024 / 1024;
      const savings = ((1 - newSize / originalSize) * 100).toFixed(1);
      
      console.log(`✅ Optimized: ${filename} → ${baseName}.png (${originalSize.toFixed(2)}MB → ${newSize.toFixed(2)}MB, ${savings}% smaller)`);
      
      // Also create WebP version
      const webpPath = path.join(optimizedDir, `${baseName}.webp`);
      await sharp(filePath)
        .resize(MAX_WIDTH, MAX_HEIGHT, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: WEBP_QUALITY })
        .toFile(webpPath);
      
      const webpSize = fs.statSync(webpPath).size / 1024 / 1024;
      console.log(`✅ WebP version: ${baseName}.webp (${webpSize.toFixed(2)}MB)`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message);
  }
}

async function processAllImages() {
  console.log('🚀 Starting image optimization...\n');
  
  const files = fs.readdirSync(assetsDir);
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png'].includes(ext);
  });

  console.log(`Found ${imageFiles.length} images to optimize\n`);

  for (const file of imageFiles) {
    const filePath = path.join(assetsDir, file);
    await optimizeImage(filePath, file);
    console.log(''); // Empty line for readability
  }

  console.log('✨ Image optimization complete!');
  console.log(`📁 Optimized images saved to: ${optimizedDir}`);
}

processAllImages().catch(console.error);
