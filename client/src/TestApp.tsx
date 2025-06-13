import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { useState } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

async function apiRequest(method: string, url: string, data?: any) {
  const config: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (data) config.body = JSON.stringify(data);
  const response = await fetch(url, config);
  if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
  return response.json();
}

function Navigation() {
  return (
    <nav className="bg-white/90 backdrop-blur-sm shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="text-2xl font-bold text-orange-600">Dan Bizzarro Method</div>
          <div className="hidden md:flex space-x-8">
            <a href="#home" className="text-gray-700 hover:text-orange-600">Home</a>
            <a href="#about" className="text-gray-700 hover:text-orange-600">About</a>
            <a href="#clinics" className="text-gray-700 hover:text-orange-600">Clinics</a>
            <a href="#contact" className="text-gray-700 hover:text-orange-600">Contact</a>
          </div>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section id="home" className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Dan Bizzarro Method
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8">
            International Event Rider & Elite Equestrian Coach
          </p>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            Join elite equestrian training with comprehensive coaching in dressage, 
            show jumping, and cross-country from an international event rider.
          </p>
          <div className="space-x-4">
            <button 
              onClick={() => document.getElementById('clinics')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Book a Clinic
            </button>
            <button 
              onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
              className="border border-orange-600 text-orange-600 px-8 py-3 rounded-lg hover:bg-orange-50 transition-colors"
            >
              View Training Tools
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const { data: testimonials } = useQuery({
    queryKey: ["/api/testimonials"],
    queryFn: () => apiRequest("GET", "/api/testimonials"),
  });

  if (!testimonials) return <div className="py-16 text-center">Loading testimonials...</div>;

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          What Riders Say
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.slice(0, 6).map((testimonial: any) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
              <div className="flex items-center">
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  {testimonial.location && (
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClinicsSection() {
  const { data: clinics } = useQuery({
    queryKey: ["/api/clinics"],
    queryFn: () => apiRequest("GET", "/api/clinics"),
  });

  if (!clinics) return <div className="py-16 text-center">Loading clinics...</div>;

  return (
    <section id="clinics" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Upcoming Clinics
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clinics.slice(0, 6).map((clinic: any) => (
            <div key={clinic.id} className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{clinic.title}</h3>
              <p className="text-gray-700 mb-4">{clinic.description}</p>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Location:</strong> {clinic.location}</p>
                <p><strong>Date:</strong> {new Date(clinic.date).toLocaleDateString()}</p>
                <p><strong>Price:</strong> £{clinic.price}</p>
              </div>
              <button className="mt-4 w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition-colors">
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StrideCalculatorSection() {
  const [horseHeight, setHorseHeight] = useState("");
  const [exerciseType, setExerciseType] = useState("trotting-poles");
  const [result, setResult] = useState<any>(null);

  const calculateDistances = () => {
    const height = parseFloat(horseHeight);
    if (!height) return;

    let distances = {};
    
    // Dan Bizzarro Method authentic specifications
    if (exerciseType === "trotting-poles") {
      distances = {
        title: "Trotting Poles",
        spacing: height >= 16 ? "4'6\" - 5'0\"" : height >= 14.2 ? "4'0\" - 4'6\"" : "3'6\" - 4'0\"",
        notes: "Place poles on ground for rhythm and suppleness work"
      };
    } else if (exerciseType === "canter-poles") {
      distances = {
        title: "Canter Poles",
        spacing: height >= 16 ? "9'0\" - 10'0\"" : height >= 14.2 ? "8'0\" - 9'0\"" : "7'0\" - 8'0\"",
        notes: "Single stride between poles for balance and rhythm"
      };
    } else if (exerciseType === "bounce-grid") {
      distances = {
        title: "Bounce Grid",
        spacing: height >= 16 ? "10'0\" - 11'0\"" : height >= 14.2 ? "9'0\" - 10'0\"" : "8'0\" - 9'0\"",
        notes: "No stride between small fences - builds quick reactions"
      };
    }

    setResult(distances);
  };

  return (
    <section id="calculator" className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Dan Bizzarro Method - Stride Calculator
        </h2>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-lg shadow-lg">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horse Height (hands)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="12"
                  max="18"
                  value={horseHeight}
                  onChange={(e) => setHorseHeight(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., 16.2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exercise Type
                </label>
                <select
                  value={exerciseType}
                  onChange={(e) => setExerciseType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="trotting-poles">Trotting Poles</option>
                  <option value="canter-poles">Canter Poles</option>
                  <option value="bounce-grid">Bounce Grid</option>
                </select>
              </div>

              <button
                onClick={calculateDistances}
                disabled={!horseHeight}
                className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 transition-colors"
              >
                Calculate Distances
              </button>
            </div>

            <div className="space-y-4">
              {result ? (
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{result.title}</h3>
                  <div className="space-y-3">
                    <div>
                      <strong className="text-gray-700">Recommended Spacing:</strong>
                      <p className="text-2xl font-bold text-orange-600">{result.spacing}</p>
                    </div>
                    <div>
                      <strong className="text-gray-700">Training Notes:</strong>
                      <p className="text-gray-600">{result.notes}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                  Enter horse height and select exercise type to calculate authentic Dan Bizzarro Method training distances
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="py-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
          <p className="text-xl mb-8">Ready to elevate your equestrian journey?</p>
          <div className="space-y-4">
            <p>Email: dan@danbizzarromethod.com</p>
            <p>Follow us on social media for updates and training tips</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function MainApp() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <TestimonialsSection />
      <StrideCalculatorSection />
      <ClinicsSection />
      <ContactSection />
    </div>
  );
}

export default function TestApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainApp />
    </QueryClientProvider>
  );
}