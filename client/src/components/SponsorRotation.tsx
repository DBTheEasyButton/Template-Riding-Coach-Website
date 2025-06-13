import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";
import type { Sponsor } from "@shared/schema";

export default function SponsorRotation() {
  const [currentSponsor, setCurrentSponsor] = useState<Sponsor | null>(null);
  const queryClient = useQueryClient();

  const { data: activeSponsor, isLoading } = useQuery<Sponsor | null>({
    queryKey: ['/api/sponsors/active'],
    refetchInterval: 5000, // Check for new sponsor every 5 seconds
    enabled: true,
  });

  const trackClickMutation = useMutation({
    mutationFn: async (sponsorId: number) => {
      const response = await fetch(`/api/sponsors/${sponsorId}/click`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to track click');
      return response.json();
    },
  });

  const trackImpressionMutation = useMutation({
    mutationFn: async (sponsorId: number) => {
      const response = await fetch(`/api/sponsors/${sponsorId}/impression`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to track impression');
      return response.json();
    },
  });

  // Update current sponsor when active sponsor changes
  useEffect(() => {
    if (activeSponsor && (!currentSponsor || activeSponsor.id !== currentSponsor.id)) {
      setCurrentSponsor(activeSponsor);
      // Track impression when sponsor is displayed
      trackImpressionMutation.mutate(activeSponsor.id);
    }
  }, [activeSponsor]);

  const handleSponsorClick = () => {
    if (currentSponsor) {
      trackClickMutation.mutate(currentSponsor.id);
      window.open(currentSponsor.website, '_blank');
    }
  };

  if (isLoading || !currentSponsor) {
    return (
      <div className="bg-white border-2 border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center animate-pulse">
            <span className="text-xs text-gray-500">Loading...</span>
          </div>
          <div className="h-4 bg-gray-200 rounded mb-1 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded mb-3 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-4 shadow-sm transition-all duration-500 hover:shadow-md">
      <div className="text-center">
        <div className="w-60 h-32 mx-auto rounded-lg overflow-hidden bg-white mb-0 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-36 h-24">
              <OptimizedImage
                src={currentSponsor.logo}
                alt={`${currentSponsor.name} logo`}
                className="w-full h-full object-contain p-1"
              />
            </div>
          </div>
        </div>
        <h4 className="font-medium text-gray-900 text-base mt-0 mb-1">
          {currentSponsor.name}
        </h4>
        <p className="text-gray-600 text-xs mb-3 line-clamp-2">
          {currentSponsor.description}
        </p>
        <Button 
          size="sm"
          variant="outline"
          className="w-full text-xs"
          onClick={handleSponsorClick}
        >
          Visit Store
          <ExternalLink className="w-3 h-3 ml-1" />
        </Button>
        
        {/* Rotation indicator */}
        <div className="mt-2 flex justify-center">
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}