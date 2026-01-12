import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useCookieConsent } from "@/components/CookieConsent";

interface VisitorProfile {
  recognized: boolean;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  horseName?: string;
  sources?: string[];
}

interface VisitorContextType {
  profile: VisitorProfile | null;
  isLoading: boolean;
  isRecognized: boolean;
  firstName: string | null;
  horseName: string | null;
  forgetMe: () => void;
  updateHorseName: (horseName: string) => Promise<void>;
  isUpdatingHorseName: boolean;
  showWelcomeToast: boolean;
  dismissWelcomeToast: () => void;
}

const VisitorContext = createContext<VisitorContextType | null>(null);

const WELCOME_SHOWN_KEY = 'dbm_welcome_shown_date';

export function VisitorProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [showWelcomeToast, setShowWelcomeToast] = useState(false);

  const { consentGiven } = useCookieConsent();

  const { data: profile, isLoading } = useQuery<VisitorProfile>({
    queryKey: ['/api/visitor/me'],
    staleTime: 5 * 60 * 1000,
    retry: false,
    enabled: consentGiven
  });

  useEffect(() => {
    if (!consentGiven) {
      queryClient.removeQueries({ queryKey: ['/api/visitor/me'] });
      localStorage.removeItem(WELCOME_SHOWN_KEY);
    }
  }, [consentGiven, queryClient]);

  const forgetMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/visitor/forget');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/visitor/me'] });
      localStorage.removeItem(WELCOME_SHOWN_KEY);
    }
  });

  const updateHorseNameMutation = useMutation({
    mutationFn: async (horseName: string) => {
      await apiRequest('POST', '/api/visitor/update-horse-name', { horseName });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/visitor/me'] });
    }
  });

  useEffect(() => {
    if (profile?.recognized && profile.firstName) {
      const today = new Date().toDateString();
      const lastShown = localStorage.getItem(WELCOME_SHOWN_KEY);
      
      // Show toast if: not shown today OR missing horse name (need to collect it)
      const needsHorseName = !profile.horseName;
      if (lastShown !== today || needsHorseName) {
        setShowWelcomeToast(true);
        // Only mark as shown today if we have horse name (so it keeps prompting until provided)
        if (!needsHorseName) {
          localStorage.setItem(WELCOME_SHOWN_KEY, today);
        }
      }
    }
  }, [profile]);

  const dismissWelcomeToast = useCallback(() => {
    setShowWelcomeToast(false);
  }, []);

  const forgetMe = useCallback(() => {
    forgetMutation.mutate();
    setShowWelcomeToast(false);
  }, [forgetMutation]);

  const updateHorseName = useCallback(async (horseName: string) => {
    await updateHorseNameMutation.mutateAsync(horseName);
  }, [updateHorseNameMutation]);

  const value: VisitorContextType = {
    profile: profile || null,
    isLoading,
    isRecognized: profile?.recognized || false,
    firstName: profile?.firstName || null,
    horseName: profile?.horseName || null,
    forgetMe,
    updateHorseName,
    isUpdatingHorseName: updateHorseNameMutation.isPending,
    showWelcomeToast,
    dismissWelcomeToast
  };

  return (
    <VisitorContext.Provider value={value}>
      {children}
    </VisitorContext.Provider>
  );
}

export function useVisitor() {
  const context = useContext(VisitorContext);
  if (!context) {
    throw new Error('useVisitor must be used within a VisitorProvider');
  }
  return context;
}
