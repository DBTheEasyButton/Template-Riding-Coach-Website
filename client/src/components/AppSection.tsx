import { Button } from "@/components/ui/button";
import { Smartphone, Headphones, Clock, MapPin, Star, Play } from "lucide-react";

export default function AppSection() {
  const lessonFocuses = [
    "Improving your horse's way of going",
    "Mastering a specific skill", 
    "Perfecting a dressage test",
    "Improving your results",
    "Adjusting your riding"
  ];

  const features = [
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "Riding Audio Lessons",
      description: "Expert tuition delivered directly to your ears while you ride your own horse."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Improve in 1 Week",
      description: "See measurable improvements in your riding skills in as little as one week."
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Anytime, Anywhere",
      description: "Access professional coaching without the need to travel or schedule an instructor."
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Expert Guidance",
      description: "Get Dan's proven methodology and techniques directly through your mobile device."
    }
  ];

  return (
    <section id="app" className="py-24 bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-playfair font-bold mb-6 text-white">Dan Bizzarro Method App</h2>
          <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Revolutionary mobile coaching that transforms your riding experience
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-playfair font-bold mb-6 text-white">Riding Audio Lessons at Your Fingertips</h3>
              <p className="text-lg text-gray-200 leading-relaxed mb-6">
                The Dan Bizzarro Method app allows users to access <strong>riding audio lessons</strong> and improve their riding skills in as little as <strong>1 week</strong>.
              </p>
              <p className="text-lg text-gray-200 leading-relaxed mb-6">
                Get access to expert tuition while riding your own horse, anytime, anywhere.
              </p>
              <p className="text-lg text-gray-200 leading-relaxed mb-6">
                <strong>No need to travel or to schedule an instructor.</strong> Transform your riding with Dan's proven methodology delivered directly through your mobile device.
              </p>
              
              <div className="mb-8">
                <h4 className="text-xl font-playfair font-bold mb-4 text-orange">The Lessons Focus On:</h4>
                <ul className="space-y-2 text-gray-200">
                  {lessonFocuses.map((focus, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-orange rounded-full mr-3 flex-shrink-0"></div>
                      {focus}
                    </li>
                  ))}
                </ul>
              </div>
              
              <Button 
                onClick={() => window.open('https://apps.apple.com/gb/app/dan-bizzarro-method/id6451109275', '_blank')}
                className="bg-orange hover:bg-orange/90 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105 mb-8"
              >
                <Play className="w-5 h-5 mr-2" />
                Download Now on App Store
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                <div className="text-2xl font-bold text-orange">Audio</div>
                <div className="text-sm text-gray-200">Lessons Format</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                <div className="text-2xl font-bold text-orange">1 Week</div>
                <div className="text-sm text-gray-200">See Results</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                <div className="text-2xl font-bold text-orange">24/7</div>
                <div className="text-sm text-gray-200">Access</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                <div className="text-2xl font-bold text-orange">Your Horse</div>
                <div className="text-sm text-gray-200">Your Arena</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-orange to-orange/70 rounded-3xl p-8 text-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <Smartphone className="w-24 h-24 mx-auto mb-6 text-white" />
              <h4 className="text-2xl font-playfair font-bold mb-4 text-white">Available on iOS</h4>
              <p className="text-white/90 mb-6">Download the Dan Bizzarro Method app and start your transformation today</p>
              <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center justify-center space-x-2 text-white">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <p className="text-sm text-white/90 mt-2">Expert coaching in your pocket</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/10 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300 backdrop-blur-sm border border-white/20">
              <div className="text-orange mb-4 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-playfair font-bold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-200 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}