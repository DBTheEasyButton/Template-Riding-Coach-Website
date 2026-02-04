import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Mail } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";

export default function Unsubscribe() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const { toast } = useToast();
  const [location] = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
      handleUnsubscribe(emailParam);
    }
  }, [location]);

  const handleUnsubscribe = async (emailToUnsubscribe?: string) => {
    const targetEmail = emailToUnsubscribe || email;
    
    if (!targetEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await apiRequest("POST", "/api/email/unsubscribe", { email: targetEmail });
      setIsUnsubscribed(true);
      toast({
        title: "Successfully Unsubscribed",
        description: "You have been removed from marketing emails.",
      });
    } catch (error) {
      toast({
        title: "Unsubscribe Failed",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isUnsubscribed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
        <SEOHead 
          title="Unsubscribed Successfully | Your Coaching Business"
          description="You have successfully unsubscribed from Your Coaching Business marketing emails."
          canonical="https://your-coaching-business.com/unsubscribe"
        />
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Unsubscribed Successfully</CardTitle>
            <CardDescription>
              You have been removed from marketing emails.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-sm text-blue-900">
                <strong>Please note:</strong> You will still receive important emails related to:
              </p>
              <ul className="text-sm text-blue-900 mt-2 ml-4 list-disc">
                <li>Clinic registrations and confirmations</li>
                <li>Payment receipts</li>
                <li>Referral programme notifications</li>
                <li>Important account updates</li>
              </ul>
            </div>
            <p className="text-sm text-gray-600 text-center">
              Changed your mind? You can resubscribe anytime on our website.
            </p>
            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'}
                className="w-full"
                data-testid="button-return-home"
              >
                Return to Homepage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
      <SEOHead 
        title="Unsubscribe from Emails | Your Coaching Business"
        description="Manage your email preferences and unsubscribe from Your Coaching Business communications."
        canonical="https://your-coaching-business.com/unsubscribe"
      />
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Mail className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <CardTitle className="text-2xl">Unsubscribe from Emails</CardTitle>
          <CardDescription>
            We're sorry to see you go. Enter your email address to unsubscribe from marketing emails.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
            <p className="text-sm text-amber-900">
              <strong>Important:</strong> Unsubscribing will stop marketing emails only. You'll still receive:
            </p>
            <ul className="text-sm text-amber-900 mt-2 ml-4 list-disc">
              <li>Clinic registration confirmations</li>
              <li>Payment receipts</li>
              <li>Referral programme notifications</li>
              <li>Important account updates</li>
            </ul>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleUnsubscribe(); }} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="input-unsubscribe-email"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={isLoading}
              data-testid="button-unsubscribe"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Unsubscribing...
                </div>
              ) : (
                "Unsubscribe"
              )}
            </Button>
          </form>

          <div className="text-center pt-4 border-t">
            <p className="text-xs text-gray-500 mb-2">
              Changed your mind?
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.href = '/'}
            >
              Return to Homepage
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}