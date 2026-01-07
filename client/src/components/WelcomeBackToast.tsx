import { useEffect } from "react";
import { useVisitor } from "@/hooks/use-visitor";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function WelcomeBackToast() {
  const { showWelcomeToast, dismissWelcomeToast, firstName, forgetMe } = useVisitor();

  useEffect(() => {
    if (showWelcomeToast) {
      const timer = setTimeout(() => {
        dismissWelcomeToast();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [showWelcomeToast, dismissWelcomeToast]);

  if (!firstName) return null;

  return (
    <Dialog open={showWelcomeToast} onOpenChange={(open) => !open && dismissWelcomeToast()}>
      <DialogContent className="sm:max-w-md text-center" data-testid="welcome-back-modal">
        <div className="flex flex-col items-center py-4">
          <div className="w-16 h-16 bg-orange/10 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">👋</span>
          </div>
          <h2 className="text-xl font-playfair font-bold text-navy mb-2">
            Welcome back, {firstName}!
          </h2>
          <p className="text-gray-600 mb-6">
            Great to see you again
          </p>
          <Button
            onClick={dismissWelcomeToast}
            className="bg-orange hover:bg-orange-hover text-white font-semibold px-8"
            data-testid="button-dismiss-welcome"
          >
            Continue
          </Button>
          <button
            onClick={() => {
              forgetMe();
              dismissWelcomeToast();
            }}
            className="text-sm text-gray-400 hover:text-gray-600 mt-4 underline"
            data-testid="button-not-me"
          >
            Not you? Clear my details
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
