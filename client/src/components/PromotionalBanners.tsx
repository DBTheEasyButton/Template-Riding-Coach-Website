import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function SidebarBanners() {
  const [, setLocation] = useLocation();

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-2 shadow-md">
      <div className="flex items-center justify-center gap-1">
        <Button 
          size="sm"
          variant="secondary"
          className="bg-white text-blue-700 hover:bg-blue-50 text-[10px] px-2 py-0.5 h-6"
          onClick={() => setLocation('/#clinics')}
        >
          Book a Clinic
        </Button>
        <Button 
          size="sm"
          variant="secondary"
          className="bg-white text-blue-700 hover:bg-blue-50 text-[10px] px-2 py-0.5 h-6"
          onClick={() => setLocation('/coaching/private-lessons')}
        >
          Book a Lesson
        </Button>
        <Button 
          size="sm"
          variant="secondary"
          className="bg-white text-blue-700 hover:bg-blue-50 text-[10px] px-2 py-0.5 h-6"
          onClick={() => setLocation('/coaching/remote')}
        >
          Virtual Lesson
        </Button>
      </div>
    </div>
  );
}