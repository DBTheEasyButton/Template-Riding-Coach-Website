import { useEffect } from "react";
import { useVisitor } from "@/hooks/use-visitor";
import { X } from "lucide-react";

export default function WelcomeBackToast() {
  const { showWelcomeToast, dismissWelcomeToast, firstName, forgetMe } = useVisitor();

  useEffect(() => {
    if (showWelcomeToast) {
      const timer = setTimeout(() => {
        dismissWelcomeToast();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [showWelcomeToast, dismissWelcomeToast]);

  if (!showWelcomeToast || !firstName) return null;

  return (
    <div 
      className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300"
      data-testid="welcome-back-toast"
    >
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-orange/10 rounded-full flex items-center justify-center">
            <span className="text-xl">👋</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-navy">
              Welcome back, {firstName}!
            </p>
            <p className="text-sm text-gray-600 mt-0.5">
              Great to see you again
            </p>
            <button
              onClick={forgetMe}
              className="text-xs text-gray-400 hover:text-gray-600 mt-2 underline"
              data-testid="button-not-me"
            >
              Not you? Clear my details
            </button>
          </div>
          <button
            onClick={dismissWelcomeToast}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600"
            data-testid="button-dismiss-welcome"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
