import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useQuery } from "@tanstack/react-query";
import type { GalleryImage } from "@shared/schema";
import { OptimizedImage } from "@/components/OptimizedImage";
import { X } from "lucide-react";
import { getSEOConfig, getCanonicalUrl } from "@shared/seoConfig";
import { getBreadcrumbsFromPath, createBreadcrumbSchema } from "@shared/schemaHelpers";

export default function Gallery() {
  const seoConfig = getSEOConfig('/gallery');
  const breadcrumbs = getBreadcrumbsFromPath('/gallery', seoConfig.h1);
  const schemas = [createBreadcrumbSchema(breadcrumbs)];

  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const { data: galleryImages = [], isLoading } = useQuery<GalleryImage[]>({
    queryKey: ["/api/gallery"],
  });

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title={seoConfig.title}
        description={seoConfig.description}
        keywords={seoConfig.keywords}
        canonical={getCanonicalUrl(seoConfig.canonicalPath)}
        schemas={schemas}
      />
      
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] bg-gradient-to-r from-navy to-gray-800 pt-16">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-white mb-4">
              Gallery
            </h1>
            <p className="text-xl md:text-2xl text-gray-200">
              Capturing the precision, power, and partnership of world-class eventing
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(9)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-300 h-80 rounded-2xl"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {galleryImages.map((image) => (
                <div 
                  key={image.id} 
                  className="group relative overflow-hidden rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-500 cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                  data-testid={`gallery-image-${image.id}`}
                >
                  <OptimizedImage 
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-80 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="font-semibold text-lg">{image.title}</h3>
                      <p className="text-sm text-gray-200">{image.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && galleryImages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No images available at this time.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
            onClick={() => setSelectedImage(null)}
            data-testid="button-close-lightbox"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.title}
              className="w-full h-auto rounded-lg"
            />
            <div className="text-white mt-4 text-center">
              <h3 className="text-2xl font-playfair font-bold mb-2">{selectedImage.title}</h3>
              <p className="text-gray-300">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
