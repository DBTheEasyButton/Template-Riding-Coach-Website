import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface VisitorProfile {
  recognized: boolean;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  sources?: string[];
}

interface VisitorContextType {
  profile: VisitorProfile | null;
  isLoading: boolean;
  isRecognized: boolean;
  firstName: string | null;
  forgetMe: () => void;
  showWelcomeToast: boolean;
  dismissWelcomeToast: () => void;
}

const VisitorContext = createContext<VisitorContextType | null>(null);

const WELCOME_SHOWN_KEY = 'dbm_welcome_shown_date';

export function VisitorProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [showWelcomeToast, setShowWelcomeToast] = useState(false);

  const { data: profile, isLoading } = useQuery<VisitorProfile>({
    queryKey: ['/api/visitor/me'],
    staleTime: 5 * 60 * 1000,
    retry: false
  });

  const forgetMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/visitor/forget');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/visitor/me'] });
      localStorage.removeItem(WELCOME_SHOWN_KEY);
    }
  });

  useEffect(() => {
    if (profile?.recognized && profile.firstName) {
      const today = new Date().toDateString();
      const lastShown = localStorage.getItem(WELCOME_SHOWN_KEY);
      
      if (lastShown !== today) {
        setShowWelcomeToast(true);
        localStorage.setItem(WELCOME_SHOWN_KEY, today);
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

  const value: VisitorContextType = {
    profile: profile || null,
    isLoading,
    isRecognized: profile?.recognized || false,
    firstName: profile?.firstName || null,
    forgetMe,
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
