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
    
    let bestResult: { buffer: Buffer; info: sharp.OutputInfo } | null = null;
    
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
      bestResult = result;
      
      // Check if file size is acceptable or if we're at minimum quality
      if (result.data.length <= this.MAX_FILE_SIZE || quality <= this.MIN_QUALITY) {
        break;
      }
      
      // Reduce quality for next attempt
      quality = Math.max(this.MIN_QUALITY, quality - 15);
      attempts++;
    }
    
    if (!bestResult) {
      throw new Error('Image optimization failed');
    }
    
    return {
      buffer: bestResult.data,
      info: bestResult.info,
      originalSize,
      optimizedSize: bestResult.data.length
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
  }> {
    const [mobile, tablet, desktop, webp] = await Promise.all([
      // Mobile version (480px width)
      this.optimizeImage(inputBuffer, {
        width: 480,
        quality: 80,
        format: 'jpeg'
      }),
      // Tablet version (768px width)
      this.optimizeImage(inputBuffer, {
        width: 768,
        quality: 85,
        format: 'jpeg'
      }),
      // Desktop version (1200px width)
      this.optimizeImage(inputBuffer, {
        width: 1200,
        quality: 90,
        format: 'jpeg'
      }),
      // WebP version for modern browsers
      this.optimizeImage(inputBuffer, {
        width: 1200,
        quality: 85,
        format: 'webp'
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
      }
    };
  }
  
  static calculateCompressionRatio(originalSize: number, optimizedSize: number): number {
    return Math.round(((originalSize - optimizedSize) / originalSize) * 100);
  }
}