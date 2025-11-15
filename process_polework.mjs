import sharp from 'sharp';

async function processImage() {
  const inputPath = 'attached_assets/Creative-Polework_1763185321728.jpg';
  const outputDir = 'attached_assets/optimized';
  
  // Get image metadata
  const metadata = await sharp(inputPath).metadata();
  console.log('Original dimensions:', metadata.width, 'x', metadata.height);
  
  // Crop to focus on bottom portion (showing the poles prominently)
  // Keep about 60% of the image from the bottom
  const cropHeight = Math.floor(metadata.height * 0.6);
  const cropTop = metadata.height - cropHeight;
  
  console.log('Cropping to bottom portion:', metadata.width, 'x', cropHeight);
  
  const croppedImage = sharp(inputPath)
    .extract({ 
      left: 0, 
      top: cropTop, 
      width: metadata.width, 
      height: cropHeight 
    });
  
  // Save as optimized JPEG
  await croppedImage
    .clone()
    .jpeg({ quality: 85, progressive: true })
    .toFile(`${outputDir}/polework-hero.jpg`);
  
  console.log('Created polework-hero.jpg');
  
  // Save as WebP
  await croppedImage
    .clone()
    .webp({ quality: 85 })
    .toFile(`${outputDir}/polework-hero.webp`);
  
  console.log('Created polework-hero.webp');
  
  console.log('Image processing complete!');
}

processImage().catch(console.error);
