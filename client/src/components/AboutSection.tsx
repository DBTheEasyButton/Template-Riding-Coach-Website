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
              Daniele was born and grew up on the outskirts of Turin, Italy. His mother rode at a local stable and it was here, at 9 years old, that Dan caught the riding bug. A few years later he was to meet the horse 'Fair and Square' that would give him his first taste of Eventing and take him to CCI*.
            </p>
            <p className="text-lg text-dark leading-relaxed">
              In 2007, whilst studying Graphic Design at University, Dan met Italian stud owner Alberto Bolaffi who offered his gorgeous Il Quadrifoglio Country Club as a base. Dan took the plunge into professional riding and has never looked back.
            </p>
            <p className="text-lg text-dark leading-relaxed">
              A move to England in 2011 saw Dan working as a rider for British eventing legend William Fox-Pitt. An invaluable experience, learning from one of the most successful British event riders of all time.
            </p>
            <p className="text-lg text-dark leading-relaxed">
              Since then, Dan has made the Gloucestershire/Oxfordshire area his base from where he competes for loyal owners and teaches a wide range of abilities. In 2022, Dan represented Italy riding Stormhill Riot in the Nation Cups, where the Italian team finished 2nd at Boekelo.
            </p>
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-playfair font-bold text-orange">17+</div>
                <div className="text-medium mt-2">Years Professional</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-playfair font-bold text-orange">2014</div>
                <div className="text-medium mt-2">RoR Elite Champion</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-playfair font-bold text-orange">2nd</div>
                <div className="text-medium mt-2">Team Italy Boekelo</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://www.dbeventing.co.uk/wp-content/uploads/2020/01/Dan-Bizzarro-profile.jpg" 
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
