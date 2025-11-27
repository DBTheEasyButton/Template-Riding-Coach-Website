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
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded flex-shrink-0 animate-pulse"></div>
          <div className="flex-1">
            <div className="h-3 bg-gray-200 rounded mb-1 animate-pulse w-20"></div>
            <div className="h-2 bg-gray-200 rounded animate-pulse w-16"></div>
          </div>
          <div className="h-6 w-14 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded overflow-hidden bg-white flex-shrink-0 flex items-center justify-center">
          <OptimizedImage
            src={currentSponsor.logo}
            alt={`${currentSponsor.name} logo`}
            className="max-w-full max-h-full object-contain"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 text-xs truncate">
            {currentSponsor.name}
          </h4>
          <p className="text-gray-500 text-xs truncate">
            {currentSponsor.description}
          </p>
        </div>
        <Button 
          size="sm"
          variant="outline"
          className="text-xs px-2 py-1 h-6"
          onClick={handleSponsorClick}
        >
          Visit
          <ExternalLink className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </div>
  );
}