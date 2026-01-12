import { useEffect, useState } from "react";
import { useVisitor } from "@/hooks/use-visitor";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function WelcomeBackToast() {
  const { showWelcomeToast, dismissWelcomeToast, firstName, horseName, forgetMe, updateHorseName, isUpdatingHorseName } = useVisitor();
  const [horseNameInput, setHorseNameInput] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (showWelcomeToast && horseName) {
      const timer = setTimeout(() => {
        dismissWelcomeToast();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [showWelcomeToast, dismissWelcomeToast, horseName]);

  if (!firstName) return null;

  const needsHorseName = !horseName;

  const handleSubmitHorseName = async () => {
    if (!horseNameInput.trim()) {
      toast({
        title: "Horse name required",
        description: "Please enter your horse's name",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateHorseName(horseNameInput.trim());
      toast({
        title: "Thank you!",
        description: `We've noted that you ride ${horseNameInput.trim()}`,
      });
      dismissWelcomeToast();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save horse name. Please try again.",
        variant: "destructive",
      });
    }
  };

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
          
          {needsHorseName ? (
            <>
              <p className="text-gray-600 mb-4">
                Great to see you again! We'd love to know your horse's name so we can personalise your experience.
              </p>
              <div className="w-full space-y-3 mb-4">
                <div className="text-left">
                  <Label htmlFor="horse-name-input" className="text-navy font-medium text-sm">
                    Your Horse's Name
                  </Label>
                  <Input
                    id="horse-name-input"
                    type="text"
                    placeholder="Enter your horse's name"
                    value={horseNameInput}
                    onChange={(e) => setHorseNameInput(e.target.value)}
                    className="mt-1"
                    disabled={isUpdatingHorseName}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmitHorseName()}
                  />
                </div>
              </div>
              <Button
                onClick={handleSubmitHorseName}
                className="bg-orange hover:bg-orange-hover text-white font-semibold px-8 w-full"
                disabled={isUpdatingHorseName}
                data-testid="button-submit-horse-name"
              >
                {isUpdatingHorseName ? "Saving..." : "Continue"}
              </Button>
            </>
          ) : (
            <>
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
            </>
          )}
          
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
