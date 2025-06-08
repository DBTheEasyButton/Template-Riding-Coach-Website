import danPhotoPath from "@assets/13_1749386080915.jpg";

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
              Since then, Dan has made the Gloucestershire/Oxfordshire area his base from where he competes for loyal owners and teaches a wide range of abilities. As well as producing great results at national and international level Dan has represented Italy in several Nations Cup events and in 2022 the Italian team finished 2nd at Boekelo.
            </p>
            <p className="text-lg text-dark leading-relaxed">
              In 2024 Dan was in the Short List for the Paris Olympic games.
            </p>
            <div className="grid grid-cols-4 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-playfair font-bold text-orange">20+</div>
                <div className="text-medium mt-2">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-playfair font-bold text-orange">500+</div>
                <div className="text-medium mt-2">riders coached</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-playfair font-bold text-orange">2025</div>
                <div className="text-medium mt-2">Olympic Short Listed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-playfair font-bold text-orange">2nd</div>
                <div className="text-medium mt-2">Nations Cup Boekelo</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src={danPhotoPath} 
              alt="Dan Bizzarro with his horse - authentic photo showing the professional bond between rider and mount" 
              className="rounded-2xl shadow-2xl w-full h-auto object-cover"
            />

          </div>
        </div>
      </div>
    </section>
  );
}
