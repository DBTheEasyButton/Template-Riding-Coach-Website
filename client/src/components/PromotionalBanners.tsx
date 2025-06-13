import { Button } from "@/components/ui/button";
import { Calendar, Smartphone, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import SponsorRotation from "@/components/SponsorRotation";

export default function SidebarBanners() {
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-4">
      {/* Clinics Banner */}
      <div className="bg-gradient-to-b from-blue-600 to-blue-700 text-white rounded-lg p-4 shadow-lg">
        <div className="text-center">
          <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-100" />
          <h3 className="text-lg font-bold mb-2">Training Clinics</h3>
          <p className="text-blue-100 text-sm mb-3">
            Join Dan's exclusive coaching sessions across the UK
          </p>
          <Button 
            size="sm"
            variant="secondary"
            className="w-full bg-white text-blue-700 hover:bg-blue-50"
            onClick={() => setLocation('/#clinics')}
          >
            Book Now
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>

      {/* App Banner */}
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 text-white rounded-lg p-4 shadow-lg">
        <div className="text-center">
          <Smartphone className="w-8 h-8 mx-auto mb-2 text-slate-300" />
          <h3 className="text-lg font-bold mb-2 text-white">Mobile App</h3>
          <p className="text-slate-200 text-sm mb-3">
            Training tools & calculators on your phone
          </p>
          <Button 
            size="sm"
            variant="secondary"
            className="w-full bg-white text-slate-800 hover:bg-slate-50"
            onClick={() => setLocation('/#app')}
          >
            Get App
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>

      {/* Interactive Sponsor Rotation */}
      <SponsorRotation />

      {/* Newsletter Signup Banner */}
      <div className="bg-gradient-to-b from-gray-700 to-gray-800 text-white rounded-lg p-4 shadow-lg">
        <div className="text-center">
          <h3 className="text-lg font-bold mb-2">Stay Updated</h3>
          <p className="text-gray-200 text-sm mb-3">
            Get the latest training tips & news
          </p>
          <Button 
            size="sm"
            variant="secondary"
            className="w-full bg-white text-gray-700 hover:bg-gray-50"
            onClick={() => setLocation('/#newsletter')}
          >
            Subscribe
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}