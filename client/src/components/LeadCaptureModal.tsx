import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Gift, Mail } from "lucide-react";

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadCaptureModal({ isOpen, onClose }: LeadCaptureModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const handleClose = () => {
    setShowSuccess(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !mobile.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to receive your free guide.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/lead-capture/strong-horse-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process request");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "The-Strong-Horse-Solution-Dan-Bizzarro.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setFirstName("");
      setLastName("");
      setEmail("");
      setMobile("");
      setShowSuccess(true);
    } catch (error) {
      console.error("Lead capture error:", error);
      toast({
        title: "Something Went Wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {showSuccess ? (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-xl font-playfair text-navy mb-3">
                Your Guide is Downloading!
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-base">
                I've also sent a copy to your email. If you don't see it in your inbox, please check your spam or junk folder. If you still haven't received it, please contact me at <a href="mailto:dan@danbizzarromethod.com" className="text-orange hover:underline font-medium">dan@danbizzarromethod.com</a>
              </DialogDescription>
            </DialogHeader>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 my-4">
              <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
                <Mail className="h-4 w-4 text-navy flex-shrink-0" />
                <span>Look for an email from Dan Bizzarro Method</span>
              </p>
            </div>
            <Button
              onClick={handleClose}
              className="bg-orange hover:bg-orange-hover text-white font-semibold"
            >
              Got it!
            </Button>
          </div>
        ) : (
          <>
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Gift className="h-6 w-6 text-orange" />
            <DialogTitle className="text-xl font-playfair text-navy">
              The Strong Horse Solution - Free Guide
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-600 text-base">
            I'd love to send you my "Strong Horse Solution" guide. Just let me know where to send it!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-navy font-medium">
              First Name
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isSubmitting}
              data-testid="input-lead-firstname"
              className="border-gray-300 focus:border-navy focus:ring-navy"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-navy font-medium">
              Surname
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Enter your surname"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isSubmitting}
              data-testid="input-lead-lastname"
              className="border-gray-300 focus:border-navy focus:ring-navy"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-navy font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              data-testid="input-lead-email"
              className="border-gray-300 focus:border-navy focus:ring-navy"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile" className="text-navy font-medium">
              Mobile Number
            </Label>
            <Input
              id="mobile"
              type="tel"
              placeholder="Enter your mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              disabled={isSubmitting}
              data-testid="input-lead-mobile"
              className="border-gray-300 focus:border-navy focus:ring-navy"
            />
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mt-4">
            <p className="text-sm text-gray-600 flex items-start gap-2">
              <Mail className="h-4 w-4 text-navy mt-0.5 flex-shrink-0" />
              <span>Your details are safe with me. I'll only use them to send you helpful training tips and updates about clinics.</span>
            </p>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange hover:bg-orange-hover text-white font-semibold py-3 rounded-lg transition-all duration-300"
            data-testid="button-submit-lead-form"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Preparing Your Guide...
              </>
            ) : (
              "Get the Strong Horse Solution PDF"
            )}
          </Button>
        </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
