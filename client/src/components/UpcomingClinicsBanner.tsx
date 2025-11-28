import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Clinic } from "@shared/schema";

export default function UpcomingClinicsBanner() {
  const { data: clinics = [] } = useQuery<Clinic[]>({
    queryKey: ['/api/clinics', { upcoming: 'true', limit: 1 }],
  });

  if (!clinics.length) {
    return null;
  }

  const clinic = clinics[0];
  const clinicDate = new Date(clinic.date).toLocaleDateString('en-GB', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="mt-16 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg p-8 text-white shadow-lg">
      <div className="flex items-start justify-between gap-6 flex-col md:flex-row">
        <div className="flex-1">
          <p className="text-orange-100 text-sm font-semibold uppercase mb-2">Upcoming Clinic</p>
          <h3 className="text-3xl font-bold mb-4">{clinic.title}</h3>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5" />
              <span>{clinicDate}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5" />
              <span>{clinic.location}</span>
            </div>
          </div>

          <p className="text-orange-50 mb-6 max-w-lg line-clamp-2">{clinic.description}</p>
        </div>

        <div className="flex-shrink-0">
          <Link href="/coaching/clinics">
            <Button 
              size="lg" 
              className="bg-white text-orange-600 hover:bg-gray-100 font-semibold"
              data-testid="button-book-clinic"
            >
              Book Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
