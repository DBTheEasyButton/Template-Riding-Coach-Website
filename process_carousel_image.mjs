import sharp from 'sharp';

async function processImage() {
  const inputPath = 'attached_assets/DBCLINIC-83 (1)_1763186931037.JPG';
  const outputDir = 'attached_assets/optimized';
  
  // Get image metadata
  const metadata = await sharp(inputPath).metadata();
  console.log('Original dimensions:', metadata.width, 'x', metadata.height);
  
  // Optimize and save as JPEG (85% quality, progressive)
  await sharp(inputPath)
    .jpeg({ quality: 85, progressive: true })
    .toFile(`${outputDir}/carousel-clinic-2.jpg`);
  
  console.log('Created carousel-clinic-2.jpg');
  
  // Save as WebP (85% quality)
  await sharp(inputPath)
    .webp({ quality: 85 })
    .toFile(`${outputDir}/carousel-clinic-2.webp`);
  
  console.log('Created carousel-clinic-2.webp');
  
  console.log('Carousel image processing complete!');
}

processImage().catch(console.error);
