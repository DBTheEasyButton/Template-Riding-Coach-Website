import danPhotoPath from "@assets/optimized/13_1749386080915.jpg";
import danWithHorsesPath from "@assets/optimized/11_1749504952106.jpg";

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* TEMPLATE: Update all about section content with your biography */}
          <div className="space-y-8">
            <div>
              <h2 className="text-5xl font-playfair font-bold text-navy mb-6">About Your Coach</h2>
              <div className="w-24 h-1 bg-orange mb-8"></div>
            </div>
            <p className="text-lg text-dark leading-relaxed">
              Your coach brings years of experience in equestrian sports, combining competitive riding at the highest levels with a passion for teaching riders of all abilities.
            </p>
            <p className="text-lg text-dark leading-relaxed">
              With a background in dressage, show jumping, and cross country, your coach offers comprehensive training that develops both horse and rider partnerships.
            </p>
            <p className="text-lg text-dark leading-relaxed">
              Training focuses on building confidence, improving technique, and achieving competition goals through systematic and supportive coaching methods.
            </p>
            <p className="text-lg text-dark leading-relaxed">
              Whether you're a beginner looking to develop your skills or an experienced rider aiming for competition success, personalised coaching is available to help you reach your goals.
            </p>
            <div className="grid grid-cols-4 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-playfair font-bold text-orange">XX+</div>
                <div className="text-medium mt-2">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-playfair font-bold text-orange">XXX+</div>
                <div className="text-medium mt-2">riders coached</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-playfair font-bold text-orange">XXXX</div>
                <div className="text-medium mt-2">Achievement</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-playfair font-bold text-orange">XXX</div>
                <div className="text-medium mt-2">Achievement</div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="relative">
              <img 
                src={danPhotoPath} 
                alt="Your Coach with his horse - authentic photo showing the professional bond between rider and mount" 
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
              />
            </div>
            <div className="relative">
              <img 
                src={danWithHorsesPath} 
                alt="Your Coach with his horses and dog - showing his personal connection with all his animals" 
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
