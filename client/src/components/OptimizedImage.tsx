import { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  onError?: () => void;
}

export function OptimizedImage({ 
  src, 
  alt, 
  className = '', 
  width, 
  height, 
  loading = 'lazy',
  onError 
}: OptimizedImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Detect browser support for modern formats
  const supportsWebP = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  };

  const supportsAVIF = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
  };

  // Get WebP version path (if it exists in optimized folder)
  const getWebPSrc = (originalSrc: string) => {
    return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  };

  // Generate responsive image sources
  const getOptimizedSrc = (originalSrc: string) => {
    return originalSrc;
  };

  // Generate srcset for responsive images
  const generateSrcSet = (originalSrc: string) => {
    return '';
  };

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      // Fallback to original image if optimized versions fail
      const fallbackSrc = src.includes('-optimized') ? 
        src.replace('-optimized', '') : 
        src;
      setCurrentSrc(fallbackSrc);
      onError?.();
    }
  };

  useEffect(() => {
    setCurrentSrc(getOptimizedSrc(src));
    setHasError(false);
  }, [src]);

  const srcSet = generateSrcSet(src);
  const webpSrc = getWebPSrc(currentSrc);

  return (
    <picture>
      {/* Serve WebP to browsers that support it */}
      <source srcSet={webpSrc} type="image/webp" />
      {/* Fallback to original format */}
      <img
        src={currentSrc}
        srcSet={srcSet || undefined}
        sizes="(max-width: 480px) 480px, (max-width: 768px) 768px, 1200px"
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        onError={handleError}
        style={{
          maxWidth: '100%',
          height: 'auto'
        }}
      />
    </picture>
  );
}

// Hook for lazy loading optimization
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