import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import danPhotoPath from "@assets/13_1749386080915.jpg";
import danWithHorsesPath from "@assets/11_1749504952106.jpg";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="About Dan Bizzarro - International Event Rider | Dan Bizzarro Method"
        description="Meet Dan Bizzarro, an international event rider based in Oxfordshire. 20+ years experience, Olympic shortlisted rider, and Nations Cup medalist. Learn about Dan's journey from Italy to becoming a professional eventing coach."
        keywords="Dan Bizzarro, international event rider, eventing coach, William Fox-Pitt, Italian eventing, Olympic eventing, Nations Cup, professional rider, Oxfordshire equestrian"
        canonical="https://dan-bizzarro.replit.app/about"
      />
      
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] bg-gradient-to-r from-gray-900 to-gray-700">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-white mb-4">
              About Dan Bizzarro
            </h1>
            <p className="text-xl md:text-2xl text-gray-200">
              International Event Rider & Professional Coach
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">Dan's Story</h2>
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
            </div>
            <div className="space-y-6">
              <div className="relative">
                <img 
                  src={danPhotoPath} 
                  alt="Dan Bizzarro with his horse - authentic photo showing the professional bond between rider and mount" 
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                />
              </div>
              <div className="relative">
                <img 
                  src={danWithHorsesPath} 
                  alt="Dan Bizzarro with his horses and dog - showing his personal connection with all his animals" 
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-navy text-center mb-12">
            Career Highlights
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-md" data-testid="stat-experience">
              <div className="text-4xl font-playfair font-bold text-orange mb-2">20+</div>
              <div className="text-gray-700">Years Experience</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md" data-testid="stat-riders">
              <div className="text-4xl font-playfair font-bold text-orange mb-2">500+</div>
              <div className="text-gray-700">Riders Coached</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md" data-testid="stat-olympic">
              <div className="text-4xl font-playfair font-bold text-orange mb-2">2024</div>
              <div className="text-gray-700">Olympic Short Listed</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md" data-testid="stat-nations-cup">
              <div className="text-4xl font-playfair font-bold text-orange mb-2">2nd</div>
              <div className="text-gray-700">Nations Cup Boekelo</div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-navy mb-6">
              Training Philosophy
            </h2>
            <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
          </div>
          <div className="space-y-6 text-lg text-dark leading-relaxed">
            <p>
              Dan's approach to training combines classical eventing principles with modern techniques, always prioritizing the welfare and development of both horse and rider.
            </p>
            <p>
              Drawing from his experience working with William Fox-Pitt and competing at the highest international levels, Dan emphasizes systematic progression, clear communication, and building confidence through proper preparation.
            </p>
            <p>
              Whether coaching beginners or advanced competitors, Dan's focus remains on creating strong foundations in dressage, show jumping, and cross-country - the three disciplines that make eventing the ultimate test of horsemanship.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
