import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

interface OptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'webp' | 'avif';
  progressive?: boolean;
}

export class ImageOptimizer {
  private static readonly DEFAULT_QUALITY = 85;
  private static readonly DEFAULT_PROGRESSIVE = true;
  private static readonly MAX_FILE_SIZE = 800 * 1024; // 800KB target size
  private static readonly MIN_QUALITY = 60;
  
  static async optimizeImage(
    inputBuffer: Buffer,
    options: OptimizationOptions = {}
  ): Promise<{ buffer: Buffer; info: sharp.OutputInfo; originalSize: number; optimizedSize: number }> {
    const {
      width,
      height,
      quality: initialQuality = this.DEFAULT_QUALITY,
      format = 'jpeg',
      progressive = this.DEFAULT_PROGRESSIVE
    } = options;

    const originalSize = inputBuffer.length;
    let quality = initialQuality;
    let attempts = 0;
    const maxAttempts = 4;
    
    let bestBuffer: Buffer | null = null;
    let bestInfo: sharp.OutputInfo | null = null;
    
    // Iteratively optimize until file size target is met or max attempts reached
    while (attempts < maxAttempts) {
      let pipeline = sharp(inputBuffer);
      
      // Resize if dimensions specified
      if (width || height) {
        pipeline = pipeline.resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true,
          position: 'center'
        });
      }
      
      // Apply format-specific optimizations
      switch (format) {
        case 'jpeg':
          pipeline = pipeline.jpeg({
            quality,
            progressive,
            mozjpeg: true,
            trellisQuantisation: true,
            overshootDeringing: true,
            optimizeScans: true
          });
          break;
        case 'webp':
          pipeline = pipeline.webp({
            quality,
            effort: 6,
            smartSubsample: true
          });
          break;
        case 'avif':
          pipeline = pipeline.avif({
            quality,
            effort: 9,
            chromaSubsampling: '4:2:0'
          });
          break;
      }
      
      const result = await pipeline.toBuffer({ resolveWithObject: true });
      bestBuffer = result.data;
      bestInfo = result.info;
      
      // Check if file size is acceptable or if we're at minimum quality
      if (result.data.length <= this.MAX_FILE_SIZE || quality <= this.MIN_QUALITY) {
        break;
      }
      
      // Reduce quality for next attempt
      quality = Math.max(this.MIN_QUALITY, quality - 15);
      attempts++;
    }
    
    if (!bestBuffer || !bestInfo) {
      throw new Error('Image optimization failed');
    }
    
    return {
      buffer: bestBuffer,
      info: bestInfo,
      originalSize,
      optimizedSize: bestBuffer.length
    };
  }
  
  static async createResponsiveVersions(
    inputBuffer: Buffer,
    baseName: string
  ): Promise<{
    mobile: { buffer: Buffer; filename: string };
    tablet: { buffer: Buffer; filename: string };
    desktop: { buffer: Buffer; filename: string };
    webp: { buffer: Buffer; filename: string };
    avif: { buffer: Buffer; filename: string };
  }> {
    const [mobile, tablet, desktop, webp, avif] = await Promise.all([
      // Mobile version (480px width) - smaller file size target
      this.optimizeImage(inputBuffer, {
        width: 480,
        quality: 75,
        format: 'jpeg'
      }),
      // Tablet version (768px width)
      this.optimizeImage(inputBuffer, {
        width: 768,
        quality: 80,
        format: 'jpeg'
      }),
      // Desktop version (1200px width)
      this.optimizeImage(inputBuffer, {
        width: 1200,
        quality: 85,
        format: 'jpeg'
      }),
      // WebP version for modern browsers - better compression
      this.optimizeImage(inputBuffer, {
        width: 1200,
        quality: 80,
        format: 'webp'
      }),
      // AVIF version for cutting-edge browsers - best compression
      this.optimizeImage(inputBuffer, {
        width: 1200,
        quality: 75,
        format: 'avif'
      })
    ]);
    
    return {
      mobile: {
        buffer: mobile.buffer,
        filename: `${baseName}-mobile.jpg`
      },
      tablet: {
        buffer: tablet.buffer,
        filename: `${baseName}-tablet.jpg`
      },
      desktop: {
        buffer: desktop.buffer,
        filename: `${baseName}-desktop.jpg`
      },
      webp: {
        buffer: webp.buffer,
        filename: `${baseName}.webp`
      },
      avif: {
        buffer: avif.buffer,
        filename: `${baseName}.avif`
      }
    };
  }
  
  static calculateCompressionRatio(originalSize: number, optimizedSize: number): number {
    return Math.round(((originalSize - optimizedSize) / originalSize) * 100);
  }

  static async optimizeExistingImages(uploadsDir: string): Promise<void> {
    try {
      const files = await fs.readdir(uploadsDir);
      const imageFiles = files.filter(file => 
        /\.(jpg|jpeg|png|gif|bmp|tiff)$/i.test(file) && 
        !file.includes('-optimized') && 
        !file.includes('-mobile') && 
        !file.includes('-tablet') && 
        !file.includes('-desktop') &&
        !file.endsWith('.webp') &&
        !file.endsWith('.avif')
      );

      console.log(`Found ${imageFiles.length} images to optimize`);

      for (const file of imageFiles) {
        try {
          const filePath = path.join(uploadsDir, file);
          const buffer = await fs.readFile(filePath);
          const baseName = path.parse(file).name;
          
          // Create optimized versions
          const optimized = await this.optimizeImage(buffer, {
            width: 1200,
            quality: 85,
            format: 'jpeg'
          });
          
          // Save optimized version
          const optimizedPath = path.join(uploadsDir, `${baseName}-optimized.jpg`);
          await fs.writeFile(optimizedPath, optimized.buffer);
          
          // Create responsive versions
          const responsiveVersions = await this.createResponsiveVersions(buffer, baseName);
          
          // Save all responsive versions
          for (const version of Object.values(responsiveVersions)) {
            const versionPath = path.join(uploadsDir, version.filename);
            await fs.writeFile(versionPath, version.buffer);
          }
          
          console.log(`Optimized ${file}: ${this.calculateCompressionRatio(buffer.length, optimized.buffer.length)}% compression`);
        } catch (error) {
          console.error(`Failed to optimize ${file}:`, error);
        }
      }
    } catch (error) {
      console.error('Failed to optimize existing images:', error);
    }
  }
}