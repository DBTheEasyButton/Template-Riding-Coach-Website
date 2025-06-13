import { Button } from "@/components/ui/button";
import { Calendar, Smartphone, ArrowRight, ExternalLink } from "lucide-react";
import { useLocation } from "wouter";

export default function SidebarBanners() {
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-4 sticky top-8">
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

      {/* Example Sponsor Banner */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
            <span className="text-xs text-gray-500">LOGO</span>
          </div>
          <h4 className="font-medium text-gray-900 text-sm mb-1">Sponsor Name</h4>
          <p className="text-gray-600 text-xs mb-3">
            Premium equestrian equipment
          </p>
          <Button 
            size="sm"
            variant="outline"
            className="w-full text-xs"
            onClick={() => window.open('#', '_blank')}
          >
            Visit Store
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>

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