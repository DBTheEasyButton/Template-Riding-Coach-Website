interface ResponsiveImageProps {
  src: string;
  webpSrc?: string;
  mobileSrc?: string;
  mobileWebpSrc?: string;
  alt: string;
  className?: string;
  loading?: 'eager' | 'lazy';
}

export default function ResponsiveImage({
  src,
  webpSrc,
  mobileSrc,
  mobileWebpSrc,
  alt,
  className = '',
  loading = 'lazy'
}: ResponsiveImageProps) {
  return (
    <picture>
      {mobileWebpSrc && (
        <source 
          srcSet={mobileWebpSrc} 
          type="image/webp" 
          media="(max-width: 768px)"
        />
      )}
      {mobileSrc && (
        <source 
          srcSet={mobileSrc} 
          type="image/jpeg" 
          media="(max-width: 768px)"
        />
      )}
      {webpSrc && (
        <source srcSet={webpSrc} type="image/webp" />
      )}
      <img 
        src={src} 
        alt={alt} 
        className={className}
        loading={loading}
        decoding="async"
      />
    </picture>
  );
}
