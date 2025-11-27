import { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  onError?: () => void;
}

export function OptimizedImage({ 
  src, 
  alt, 
  className = '', 
  width, 
  height, 
  loading = 'lazy',
  priority = false,
  onError 
}: OptimizedImageProps) {
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const isUploadedImage = src.includes('/uploads/');
  
  const getBaseName = (originalSrc: string): string => {
    const filename = originalSrc.split('/').pop() || '';
    return filename
      .replace('-optimized.jpg', '')
      .replace('-desktop.jpg', '')
      .replace('-tablet.jpg', '')
      .replace('-mobile.jpg', '')
      .replace('.webp', '')
      .replace('.avif', '')
      .replace(/\.(jpg|jpeg|png|gif)$/i, '');
  };

  const getOptimizedVersions = (originalSrc: string) => {
    if (!isUploadedImage) {
      return { avif: null, webp: null, webpSrcset: null, srcset: null, mobileWebp: null, fallback: originalSrc };
    }

    const baseName = getBaseName(originalSrc);
    const basePath = originalSrc.substring(0, originalSrc.lastIndexOf('/') + 1);

    return {
      avif: `${basePath}${baseName}.avif`,
      webp: `${basePath}${baseName}.webp`,
      mobileWebp: `${basePath}${baseName}-mobile.webp`,
      mobileJpg: `${basePath}${baseName}-mobile.jpg`,
      webpSrcset: `${basePath}${baseName}-mobile.webp 480w, ${basePath}${baseName}.webp 1200w`,
      srcset: `${basePath}${baseName}-mobile.jpg 480w, ${basePath}${baseName}-tablet.jpg 768w, ${basePath}${baseName}-desktop.jpg 1200w`,
      fallback: `${basePath}${baseName}-optimized.jpg`
    };
  };

  const versions = getOptimizedVersions(src);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setCurrentSrc(src);
      onError?.();
    }
  };

  useEffect(() => {
    setCurrentSrc(versions.fallback || src);
    setHasError(false);
  }, [src]);

  if (!isUploadedImage) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        decoding="async"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    );
  }

  return (
    <picture>
      {/* Mobile WebP - served first for small screens */}
      {versions.mobileWebp && (
        <source 
          srcSet={versions.mobileWebp} 
          type="image/webp"
          media="(max-width: 768px)"
        />
      )}
      {/* Mobile JPEG fallback for small screens */}
      {versions.mobileJpg && (
        <source 
          srcSet={versions.mobileJpg} 
          type="image/jpeg"
          media="(max-width: 768px)"
        />
      )}
      {/* Desktop AVIF */}
      {versions.avif && (
        <source 
          srcSet={versions.avif} 
          type="image/avif"
        />
      )}
      {/* Desktop WebP */}
      {versions.webp && (
        <source 
          srcSet={versions.webp} 
          type="image/webp"
        />
      )}
      {/* Responsive JPEG srcset */}
      {versions.srcset && (
        <source 
          srcSet={versions.srcset}
          type="image/jpeg"
          sizes="(max-width: 480px) 480px, (max-width: 768px) 768px, 1200px"
        />
      )}
      <img
        src={hasError ? src : currentSrc}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        decoding="async"
        onError={handleError}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </picture>
  );
}

export function useImageOptimization() {
  const [isIntersecting, setIsIntersecting] = useState(false);
  
  const observerRef = (node: HTMLElement | null) => {
    if (node) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsIntersecting(entry.isIntersecting);
        },
        { threshold: 0.1 }
      );
      observer.observe(node);
      
      return () => observer.disconnect();
    }
  };
  
  return { isIntersecting, observerRef };
}
