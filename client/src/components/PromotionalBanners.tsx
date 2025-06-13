import { Button } from "@/components/ui/button";
import { Calendar, Smartphone, ArrowRight, MapPin, Clock } from "lucide-react";
import { useLocation } from "wouter";

export default function PromotionalBanners() {
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-4 mb-8">
      {/* Clinics Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5" />
              <span className="text-sm font-medium text-blue-100">UPCOMING CLINICS</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Join Dan's Exclusive Training Clinics</h3>
            <p className="text-blue-100 mb-3">
              Transform your riding with personalized coaching from Dan Bizzarro. Limited spaces available.
            </p>
            <div className="flex items-center gap-4 text-sm text-blue-100">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Multiple UK Locations
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Weekend Sessions
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="secondary"
              className="bg-white text-blue-700 hover:bg-blue-50"
              onClick={() => setLocation('/#clinics')}
            >
              View Clinics
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* App Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-6 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Smartphone className="w-5 h-5" />
              <span className="text-sm font-medium text-orange-100">MOBILE APP</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Dan Bizzarro Method App</h3>
            <p className="text-orange-100 mb-3">
              Access training tools, stride calculators, and exclusive content on your mobile device.
            </p>
            <div className="flex items-center gap-4 text-sm text-orange-100">
              <span>✓ Stride Calculator</span>
              <span>✓ Course Tools</span>
              <span>✓ Training Videos</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="secondary"
              className="bg-white text-orange-700 hover:bg-orange-50"
              onClick={() => setLocation('/#app')}
            >
              Learn More
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}