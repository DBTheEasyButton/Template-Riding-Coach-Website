import type { ImgHTMLAttributes, CSSProperties } from 'react';

interface HeroPictureProps {
  jpegSrc: string;
  webpSrc: string;
  mobileJpegSrc?: string;
  mobileWebpSrc?: string;
  alt: string;
  loading?: 'eager' | 'lazy';
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
}

export default function HeroPicture({
  jpegSrc,
  webpSrc,
  mobileJpegSrc,
  mobileWebpSrc,
  alt,
  loading = 'lazy',
  priority = false,
  className = '',
  style
}: HeroPictureProps) {
  const imgProps: ImgHTMLAttributes<HTMLImageElement> = {
    src: jpegSrc,
    alt,
    className,
    loading,
    decoding: 'async',
    style
  };

  return (
    <picture>
      {mobileWebpSrc && (
        <source 
          srcSet={mobileWebpSrc} 
          type="image/webp" 
          media="(max-width: 768px)"
        />
      )}
      {mobileJpegSrc && (
        <source 
          srcSet={mobileJpegSrc} 
          type="image/jpeg" 
          media="(max-width: 768px)"
        />
      )}
      <source srcSet={webpSrc} type="image/webp" />
      <source srcSet={jpegSrc} type="image/jpeg" />
      <img {...imgProps} />
    </picture>
  );
}
