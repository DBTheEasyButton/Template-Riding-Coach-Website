export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-5xl font-playfair font-bold text-navy mb-6">About Dan</h2>
              <div className="w-24 h-1 bg-orange mb-8"></div>
            </div>
            <p className="text-lg text-dark leading-relaxed">
              Born in Milan and raised among Italy's rolling countryside, Dan Bizzarro discovered his passion for equestrian sports at the age of eight. What began as weekend rides has evolved into a distinguished international career spanning over two decades.
            </p>
            <p className="text-lg text-dark leading-relaxed">
              With over 15 years competing at the highest levels of three-day eventing, Dan has represented Italy in multiple Olympic Games, World Equestrian Games, and European Championships, earning recognition as one of Europe's most consistent and skilled event riders.
            </p>
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-playfair font-bold text-orange">15+</div>
                <div className="text-medium mt-2">Years Professional</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-playfair font-bold text-orange">3</div>
                <div className="text-medium mt-2">Olympic Games</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-playfair font-bold text-orange">25+</div>
                <div className="text-medium mt-2">International Medals</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1560807707-8cc77767d783?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000&q=80" 
              alt="Professional portrait of Dan Bizzarro in equestrian attire" 
              className="rounded-2xl shadow-2xl w-full h-auto object-cover"
            />
            <div className="absolute -bottom-6 -right-6 bg-navy text-white p-6 rounded-xl shadow-xl">
              <div className="flex items-center space-x-3">
                <i className="fas fa-flag text-orange text-2xl"></i>
                <div>
                  <div className="font-semibold">Team Italy</div>
                  <div className="text-sm opacity-80">Since 2008</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
