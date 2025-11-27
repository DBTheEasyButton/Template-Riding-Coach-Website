import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Mail } from "lucide-react";
import { useLocation } from "wouter";
import SponsorRotation from "@/components/SponsorRotation";

export default function SidebarBanners() {
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-3">
      {/* Clinics Banner - Compact */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-3 shadow-md">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-blue-100 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold">Training Clinics</h3>
            <p className="text-blue-100 text-xs truncate">Join Dan's coaching sessions</p>
          </div>
          <Button 
            size="sm"
            variant="secondary"
            className="bg-white text-blue-700 hover:bg-blue-50 text-xs px-3 py-1 h-7"
            onClick={() => setLocation('/#clinics')}
          >
            Book
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>

      {/* Interactive Sponsor Rotation */}
      <SponsorRotation />

      {/* Newsletter Signup Banner - Compact */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg p-3 shadow-md">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-gray-300 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold">Stay Updated</h3>
            <p className="text-gray-300 text-xs truncate">Get the latest training tips</p>
          </div>
          <Button 
            size="sm"
            variant="secondary"
            className="bg-white text-gray-700 hover:bg-gray-50 text-xs px-3 py-1 h-7"
            onClick={() => setLocation('/#newsletter')}
          >
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  );
}