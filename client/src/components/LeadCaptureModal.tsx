import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Gift, Mail, User, Headphones, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useVisitor } from "@/hooks/use-visitor";
import { queryClient } from "@/lib/queryClient";

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
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const { toast } = useToast();
  const { profile, isRecognized, forgetMe } = useVisitor();

  useEffect(() => {
    if (isOpen && profile && isRecognized) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setEmail(profile.email || "");
      setMobile(profile.mobile || "");
    }
  }, [isOpen, profile, isRecognized]);

  const handleClose = () => {
    setShowSuccess(false);
    setShowUpdateForm(false);
    onClose();
  };

  const handleQuickDownload = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/lead-capture/strong-horse-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: profile?.firstName?.trim() || "",
          lastName: profile?.lastName?.trim() || "",
          email: profile?.email?.trim() || "",
          mobile: profile?.mobile?.trim() || "",
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

      setShowSuccess(true);
      // Immediately refetch visitor profile to sync with updated server state
      queryClient.refetchQueries({ queryKey: ['/api/visitor/me'] });
    } catch (error) {
      console.error("Quick download error:", error);
      toast({
        title: "Something Went Wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotMe = () => {
    forgetMe();
    setFirstName("");
    setLastName("");
    setEmail("");
    setMobile("");
    setShowUpdateForm(false);
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
      // Immediately refetch visitor profile to sync with new cookie from server
      queryClient.refetchQueries({ queryKey: ['/api/visitor/me'] });
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
        ) : isRecognized && profile?.firstName && !showUpdateForm ? (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <User className="h-8 w-8 text-navy" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-xl font-playfair text-navy mb-3">
                Welcome back, {profile.firstName}!
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-base">
                Ready to download The Strong Horse Solution?
              </DialogDescription>
            </DialogHeader>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-4 text-left">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-navy">Email:</span> {profile.email}
              </p>
              {profile.mobile && (
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium text-navy">Mobile:</span> {profile.mobile}
                </p>
              )}
            </div>
            <Button
              onClick={handleQuickDownload}
              disabled={isSubmitting}
              className="w-full bg-orange hover:bg-orange-hover text-white font-semibold py-3 rounded-lg transition-all duration-300 mb-3"
              data-testid="button-quick-download"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Preparing Your Guide...
                </>
              ) : (
                "Download Now"
              )}
            </Button>
            <div className="flex justify-center gap-4 text-sm">
              <button
                onClick={() => setShowUpdateForm(true)}
                className="text-navy hover:underline"
                data-testid="button-update-details"
              >
                Update my details
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={handleNotMe}
                className="text-gray-500 hover:text-gray-700 hover:underline"
                data-testid="button-not-me-form"
              >
                Not me
              </button>
            </div>
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
              First Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isSubmitting}
              required
              data-testid="input-lead-firstname"
              className="border-gray-300 focus:border-navy focus:ring-navy"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-navy font-medium">
              Surname <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Enter your surname"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isSubmitting}
              required
              data-testid="input-lead-lastname"
              className="border-gray-300 focus:border-navy focus:ring-navy"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="email" className="text-navy font-medium">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
              data-testid="input-lead-email"
              className="border-gray-300 focus:border-navy focus:ring-navy"
            />
            <p className="text-xs text-gray-500">Please double-check your email address is correct</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile" className="text-navy font-medium">
              Mobile Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="mobile"
              type="tel"
              placeholder="Enter your mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              disabled={isSubmitting}
              required
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

          {/* Promotional banner for full course */}
          <div className="rounded-lg p-4 mt-4" style={{ background: 'linear-gradient(to right, #1e3a5f, #2a4a6f)' }}>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'rgba(234, 88, 12, 0.2)' }}>
                <Headphones className="h-5 w-5 text-orange" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium mb-1" style={{ color: '#ffffff' }}>
                  Did you know about the Full Audio Course?
                </p>
                <p className="text-xs mb-2" style={{ color: '#d1d5db' }}>
                  "From Strong to Light and Soft in 28 Days" - Transform your horse with listen-while-you-ride audio lessons
                </p>
                <Link 
                  href="/courses/strong-horse-audio-course"
                  onClick={handleClose}
                  className="inline-flex items-center gap-1 text-xs font-semibold transition-colors"
                  style={{ color: '#ea580c' }}
                  data-testid="link-course-promo"
                >
                  Try it for free <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
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
