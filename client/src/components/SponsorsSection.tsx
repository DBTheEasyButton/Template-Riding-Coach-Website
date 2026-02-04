// TEMPLATE: Sponsors Section
// Add your sponsor logos to attached_assets/ and update the imports below
// Configure sponsors in Admin > Sponsors panel

export default function SponsorsSection() {
  // TEMPLATE: This section displays sponsors/partners
  // For a working implementation, sponsors should be loaded from the database via Admin > Sponsors
  // Remove this placeholder section or connect it to your sponsors data
  
  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-playfair font-bold text-navy mb-4">Partners & Sponsors</h2>
          <p className="text-gray-600">Proud to be supported by industry leaders in equestrian excellence</p>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">Add your sponsors via Admin &gt; Sponsors</p>
        </div>
      </div>
    </section>
  );
}
