import devoucouxLogo from "@assets/Logo_DEVOUCOUX_2021_VERT_CMJN-1-copie-300x130_1749678438773.png";
import kepItaliaLogo from "@assets/images_1749678438770.png";
import sergioGrassoLogo from "@assets/download_1749678474539.png";

export default function SponsorsSection() {
  const sponsors = [
    {
      name: "Devoucoux",
      description: "Premium French saddlery and equestrian equipment",
      logo: devoucouxLogo,
      website: "https://eu.devoucoux.com/gb/12-saddles"
    },
    {
      name: "Sergio Grasso",
      description: "Italian luxury riding boots and equestrian wear",
      logo: sergioGrassoLogo,
      website: "https://www.sergiograsso.it/en/"
    },
    {
      name: "Kep Italia",
      description: "High-performance riding helmets and safety equipment",
      logo: kepItaliaLogo,
      website: "https://www.kepitalia.com/en"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-playfair font-bold text-navy mb-4">Partners & Sponsors</h2>
          <p className="text-gray-600">Proud to be supported by industry leaders in equestrian excellence</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
          {sponsors.map((sponsor, index) => (
            <a 
              key={index} 
              href={sponsor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100 block cursor-pointer"
            >
              <div className="text-center">
                <div className="mb-6 flex justify-center items-center h-20">
                  <img 
                    src={sponsor.logo} 
                    alt={sponsor.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <h3 className="text-xl font-bold text-navy mb-2">{sponsor.name}</h3>
                <p className="text-gray-600 text-sm">{sponsor.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
