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
  
  static async optimizeImage(
    inputBuffer: Buffer,
    options: OptimizationOptions = {}
  ): Promise<{ buffer: Buffer; info: sharp.OutputInfo; originalSize: number; optimizedSize: number }> {
    const {
      width,
      height,
      quality = this.DEFAULT_QUALITY,
      format = 'jpeg',
      progressive = this.DEFAULT_PROGRESSIVE
    } = options;

    const originalSize = inputBuffer.length;
    
    let pipeline = sharp(inputBuffer);
    
    // Resize if dimensions specified
    if (width || height) {
      pipeline = pipeline.resize(width, height, {
        fit: 'cover',
        position: 'center'
      });
    }
    
    // Apply format-specific optimizations
    switch (format) {
      case 'jpeg':
        pipeline = pipeline.jpeg({
          quality,
          progressive,
          mozjpeg: true // Use mozjpeg encoder for better compression
        });
        break;
      case 'webp':
        pipeline = pipeline.webp({
          quality,
          effort: 6 // Higher effort for better compression
        });
        break;
      case 'avif':
        pipeline = pipeline.avif({
          quality,
          effort: 9 // Maximum effort for AVIF
        });
        break;
    }
    
    const { data: buffer, info } = await pipeline.toBuffer({ resolveWithObject: true });
    const optimizedSize = buffer.length;
    
    return {
      buffer,
      info,
      originalSize,
      optimizedSize
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