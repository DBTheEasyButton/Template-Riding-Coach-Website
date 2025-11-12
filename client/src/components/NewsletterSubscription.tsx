import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import logoPath from "@assets/optimized/Logo-trasparenteRAST_1749385353493.png";

export default function NewsletterSubscription() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim()) {
      toast({
        title: "First Name Required",
        description: "Please enter your first name",
        variant: "destructive",
      });
      return;
    }

    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await apiRequest("POST", "/api/newsletter/subscribe", {
        email,
        firstName
      });

      toast({
        title: "Successfully Subscribed!",
        description: "Thank you for subscribing to our newsletter. You'll receive updates about clinics, training tips, and Dan's latest news.",
      });

      setEmail("");
      setFirstName("");
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: "There was an error subscribing to our newsletter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-10 bg-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <img 
            src={logoPath} 
            alt="Dan Bizzarro Method" 
            className="h-10 w-auto mx-auto mb-6"
          />
          <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-4">
            Get Free Training Tips & Early Access to Clinics
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Subscribe to receive exclusive training tips, early access to clinics, competition insights, and updates on Dan's behind the scenes, delivered straight to your inbox.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500"
                data-testid="input-first-name"
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange hover:bg-orange/90 text-white font-medium py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Subscribing...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Subscribe to Newsletter
                </div>
              )}
            </Button>
          </form>

          <p className="text-xs text-gray-600 text-center mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}