import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const uploadsDir = './client/public/uploads';

async function generateMobileWebp() {
  const files = fs.readdirSync(uploadsDir);
  const mobileJpgs = files.filter(f => f.endsWith('-mobile.jpg'));
  
  for (const file of mobileJpgs) {
    const webpFile = file.replace('-mobile.jpg', '-mobile.webp');
    const webpPath = path.join(uploadsDir, webpFile);
    
    if (!fs.existsSync(webpPath)) {
      const jpgPath = path.join(uploadsDir, file);
      console.log(`Creating ${webpFile}...`);
      
      await sharp(jpgPath)
        .webp({ quality: 70 })
        .toFile(webpPath);
      
      console.log(`Created ${webpFile}`);
    }
  }
  console.log('Done!');
}

generateMobileWebp().catch(console.error);
