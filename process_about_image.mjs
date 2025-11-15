import sharp from 'sharp';

async function processImage() {
  const inputPath = 'attached_assets/DBCLINIC-130_1763185685671.JPG';
  const outputDir = 'attached_assets/optimized';
  
  // Get image metadata
  const metadata = await sharp(inputPath).metadata();
  console.log('Original dimensions:', metadata.width, 'x', metadata.height);
  
  // Optimize and save as JPEG (85% quality, progressive)
  await sharp(inputPath)
    .jpeg({ quality: 85, progressive: true })
    .toFile(`${outputDir}/about-dan-hero.jpg`);
  
  console.log('Created about-dan-hero.jpg');
  
  // Save as WebP (85% quality for better compression)
  await sharp(inputPath)
    .webp({ quality: 85 })
    .toFile(`${outputDir}/about-dan-hero.webp`);
  
  console.log('Created about-dan-hero.webp');
  
  console.log('Image processing complete!');
}

processImage().catch(console.error);
