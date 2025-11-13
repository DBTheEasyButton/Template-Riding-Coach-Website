import type { ImgHTMLAttributes } from 'react';

interface HeroPictureProps {
  jpegSrc: string;
  webpSrc: string;
  alt: string;
  loading?: 'eager' | 'lazy';
  priority?: boolean;
  className?: string;
}

export default function HeroPicture({
  jpegSrc,
  webpSrc,
  alt,
  loading = 'lazy',
  priority = false,
  className = ''
}: HeroPictureProps) {
  const imgProps: ImgHTMLAttributes<HTMLImageElement> = {
    src: jpegSrc,
    alt,
    className,
    loading,
    decoding: 'async',
    ...(priority && { fetchpriority: 'high' })
  };

  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <source srcSet={jpegSrc} type="image/jpeg" />
      <img {...imgProps} />
    </picture>
  );
}
