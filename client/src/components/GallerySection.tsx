import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { GalleryImage } from "@shared/schema";

export default function GallerySection() {
  const { data: galleryImages = [], isLoading } = useQuery<GalleryImage[]>({
    queryKey: ["/api/gallery"],
  });

  return (
    <section id="gallery" className="py-24 bg-light-grey">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-playfair font-bold text-navy mb-6">Gallery</h2>
          <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
          <p className="text-xl text-dark max-w-3xl mx-auto">
            Capturing the precision, power, and partnership of world-class eventing
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-300 h-80 rounded-2xl"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {galleryImages.map((image) => (
              <div key={image.id} className="group relative overflow-hidden rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-500">
                <img 
                  src={image.imageUrl}
                  alt={image.title}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold">{image.title}</h3>
                    <p className="text-sm text-gray-200">{image.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <Button className="bg-navy hover:bg-slate-800 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105">
            View Full Gallery
          </Button>
        </div>
      </div>
    </section>
  );
}
