import { useState, useEffect, createContext, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";

const COOKIE_CONSENT_KEY = 'dbm_cookie_consent';

export function getCookieConsent(): 'accepted' | 'declined' | null {
  if (typeof window === 'undefined') return null;
  const value = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (value === 'accepted' || value === 'declined') return value;
  return null;
}

export function hasCookieConsent(): boolean {
  return getCookieConsent() === 'accepted';
}

interface CookieConsentContextType {
  consentGiven: boolean;
  setConsentGiven: (value: boolean) => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | null>(null);

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context) {
    return { consentGiven: hasCookieConsent(), setConsentGiven: () => {} };
  }
  return context;
}

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [consentGiven, setConsentGiven] = useState(() => hasCookieConsent());

  return (
    <CookieConsentContext.Provider value={{ consentGiven, setConsentGiven }}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const { setConsentGiven } = useCookieConsent();

  useEffect(() => {
    const consent = getCookieConsent();
    if (consent === null) {
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setConsentGiven(true);
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    setConsentGiven(false);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 shadow-lg animate-in slide-in-from-bottom duration-300">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 bg-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Cookie className="w-5 h-5 text-orange" />
            </div>
            <div>
              <h3 className="font-semibold text-navy text-sm mb-1">
                We use cookies to remember you
              </h3>
              <p className="text-gray-600 text-sm">
                We use a small cookie to recognise you when you return, so we can welcome you back by name. No tracking or advertising cookies are used.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleDecline}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Decline
            </button>
            <Button
              onClick={handleAccept}
              className="bg-orange hover:bg-orange-hover text-white font-semibold px-6"
            >
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
