export default function SponsorsSection() {
  const sponsors = [
    "SPONSOR", "PARTNER", "BRAND", "SUPPORT", "TEAM", "ELITE"
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-playfair font-bold text-forest mb-4">Partners & Sponsors</h2>
          <p className="text-gray-600">Proud to be supported by industry leaders</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
          {sponsors.map((sponsor, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-center font-bold text-gray-400">{sponsor}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
