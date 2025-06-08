import { Button } from "@/components/ui/button";

export default function GallerySection() {
  const galleryImages = [
    {
      src: "https://images.unsplash.com/photo-1573068629844-e4c3f8df9b1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      title: "Championship Jump",
      subtitle: "Badminton 2023"
    },
    {
      src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      title: "Dressage Precision",
      subtitle: "European Championships"
    },
    {
      src: "https://images.unsplash.com/photo-1553284966-19b8815c7817?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      title: "Cross-Country Power",
      subtitle: "Kentucky Three-Day"
    },
    {
      src: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      title: "Victory Moment",
      subtitle: "World Championships"
    },
    {
      src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      title: "Training Excellence",
      subtitle: "Italian Countryside"
    },
    {
      src: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      title: "Horse Care",
      subtitle: "Team Facilities"
    }
  ];

  return (
    <section id="gallery" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-playfair font-bold text-forest mb-6">Gallery</h2>
          <div className="w-24 h-1 bg-italian-red mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Capturing the precision, power, and partnership of world-class eventing
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {galleryImages.map((image, index) => (
            <div key={index} className="group relative overflow-hidden rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-500">
              <img 
                src={image.src}
                alt={image.title}
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold">{image.title}</h3>
                  <p className="text-sm text-gray-200">{image.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button className="bg-forest hover:bg-green-800 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105">
            View Full Gallery
          </Button>
        </div>
      </div>
    </section>
  );
}
