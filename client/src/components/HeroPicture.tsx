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
  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <source srcSet={jpegSrc} type="image/jpeg" />
      <img
        src={jpegSrc}
        alt={alt}
        className={className}
        loading={loading}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </picture>
  );
}
