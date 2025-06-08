import { Button } from "@/components/ui/button";

export default function GallerySection() {
  const galleryImages = [
    {
      src: "https://www.dbeventing.co.uk/wp-content/uploads/2023/05/dan-bizzarro-badminton-jump.jpg",
      title: "Championship Jump",
      subtitle: "Badminton 2023"
    },
    {
      src: "https://www.dbeventing.co.uk/wp-content/uploads/2023/06/dan-dressage-competition.jpg",
      title: "Dressage Precision",
      subtitle: "European Championships"
    },
    {
      src: "https://www.dbeventing.co.uk/wp-content/uploads/2023/04/cross-country-kentucky.jpg",
      title: "Cross-Country Power",
      subtitle: "Kentucky Three-Day"
    },
    {
      src: "https://www.dbeventing.co.uk/wp-content/uploads/2023/08/victory-ceremony-worlds.jpg",
      title: "Victory Moment",
      subtitle: "World Championships"
    },
    {
      src: "https://www.dbeventing.co.uk/wp-content/uploads/2023/02/training-tuscany-facility.jpg",
      title: "Training Excellence",
      subtitle: "Italian Countryside"
    },
    {
      src: "https://www.dbeventing.co.uk/wp-content/uploads/2023/03/horse-care-stables.jpg",
      title: "Horse Care",
      subtitle: "Team Facilities"
    }
  ];

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
          <Button className="bg-navy hover:bg-slate-800 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105">
            View Full Gallery
          </Button>
        </div>
      </div>
    </section>
  );
}
