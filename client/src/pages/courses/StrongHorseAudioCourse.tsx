import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, CheckCircle, Mail, ChevronDown, ChevronUp, Headphones, FileText, Clock, Target, Users, Star, Crown, ArrowRight, Calendar, Video, MessageCircle, User, CreditCard, AlertTriangle, ExternalLink, X } from "lucide-react";
import { Link } from "wouter";
import SEOHead from "@/components/SEOHead";
import { getSEOConfig, getCanonicalUrl } from "@/data/seoConfig";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HeroPicture from "@/components/HeroPicture";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements, ExpressCheckoutElement } from "@stripe/react-stripe-js";
import { useVisitor } from "@/hooks/use-visitor";
import { queryClient } from "@/lib/queryClient";
import introAudio from "@assets/From_Strong_to_Light_and_Soft_(in_28_days)_-_TRIAL_LESSON_1766111816502.mp3";
import beforeImage from "@assets/67_1766025322880.png";
import afterImage from "@assets/14_1766025322881.png";
import strongHorseHero from "@assets/From_THIS_(2)_1767410380848.png";

let stripePromiseCache: Promise<Stripe | null> | null = null;
let stripeLoadAttempts = 0;

async function getStripePromise(): Promise<Stripe | null> {
  if (stripePromiseCache) return stripePromiseCache;
  
  stripeLoadAttempts++;
  
  try {
    const response = await fetch('/api/config/stripe-key');
    if (!response.ok) {
      console.error('Failed to fetch Stripe key');
      return null;
    }
    const data = await response.json();
    if (data.publishableKey) {
      const stripeInstance = await loadStripe(data.publishableKey);
      if (stripeInstance) {
        stripePromiseCache = Promise.resolve(stripeInstance);
        return stripeInstance;
      }
    }
  } catch (error) {
    console.error('Error loading Stripe:', error);
    stripePromiseCache = null;
  }
  return null;
}

function resetStripeCache() {
  stripePromiseCache = null;
  stripeLoadAttempts = 0;
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex justify-between items-center text-left hover:text-orange transition-colors"
      >
        <span className="font-semibold text-navy">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-orange flex-shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 text-gray-600">
          {answer}
        </div>
      )}
    </div>
  );
}

function ExitIntentPopup({ onDownload }: { onDownload: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    // Check if already shown this session
    const alreadyShown = sessionStorage.getItem('exitPopupShown');
    if (alreadyShown) {
      setHasShown(true);
      return;
    }

    // Track scroll to ensure user has engaged with the page
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 25) {
        setHasScrolled(true);
      }
    };

    // Desktop: detect mouse leaving viewport (top of page)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && hasScrolled && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
        sessionStorage.setItem('exitPopupShown', 'true');
      }
    };

    // Mobile: detect back button or tab visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && hasScrolled && !hasShown) {
        // Store state for when they return
        sessionStorage.setItem('showExitPopupOnReturn', 'true');
      } else if (document.visibilityState === 'visible') {
        const shouldShow = sessionStorage.getItem('showExitPopupOnReturn');
        if (shouldShow && !hasShown) {
          setIsOpen(true);
          setHasShown(true);
          sessionStorage.setItem('exitPopupShown', 'true');
          sessionStorage.removeItem('showExitPopupOnReturn');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [hasScrolled, hasShown]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDownloadClick = () => {
    setIsOpen(false);
    onDownload();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          data-testid="button-close-exit-popup"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>
        
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange/10 rounded-full mb-4">
            <Headphones className="h-8 w-8 text-orange" />
          </div>
          
          <DialogHeader>
            <DialogTitle className="text-2xl font-playfair font-bold text-navy mb-3">
              Wait! Do You Have a Strong or Heavy Horse?
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-base leading-relaxed">
              If your horse pulls, leans on the bit, or feels like hard work — I'd love to help.
            </DialogDescription>
          </DialogHeader>
          
          <p className="text-gray-700 mt-4 mb-2">
            Why not download my <strong>free audio lesson</strong> and try it with your horse?
          </p>
          
          <p className="text-lg font-semibold text-navy mb-6">
            You have nothing to lose.
          </p>
          
          <Button
            onClick={handleDownloadClick}
            className="w-full bg-orange hover:bg-orange-hover text-white font-semibold py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
            data-testid="button-exit-popup-download"
          >
            <Download className="mr-2 h-5 w-5" />
            Get My Free Audio Lesson
          </Button>
          
          <button
            onClick={handleClose}
            className="mt-4 text-gray-500 hover:text-gray-700 text-sm underline transition-colors"
            data-testid="button-exit-popup-no-thanks"
          >
            No thanks, I'll pass
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DownloadProgressOverlay({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
    
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-orange/10 rounded-full mb-6">
          <Download className="h-10 w-10 text-orange animate-bounce" />
        </div>
        <h3 className="text-xl font-playfair font-bold text-navy mb-2">
          Your Download Has Started
        </h3>
        <p className="text-gray-600 mb-4">
          Your free audio lesson is downloading now.
        </p>
        <p className="text-gray-500 text-sm mb-6">
          This may take a couple of minutes depending on your internet connection.
        </p>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div 
            className="bg-orange h-3 rounded-full transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-500">{progress}%</p>
      </div>
    </div>
  );
}

function AudioLeadCaptureModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [horseName, setHorseName] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
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
      setHorseName(profile.horseName || "");
      setTermsAccepted(true);
    }
  }, [isOpen, profile, isRecognized]);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setMobile("");
    setHorseName("");
    setTermsAccepted(false);
    setShowSuccess(false);
    setShowProgress(false);
    setShowUpdateForm(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleNotMe = () => {
    forgetMe();
    setFirstName("");
    setLastName("");
    setEmail("");
    setMobile("");
    setHorseName("");
    setTermsAccepted(false);
    setShowUpdateForm(false);
  };

  const handleQuickDownload = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/lead-capture/strong-horse-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: profile?.firstName?.trim() || "",
          lastName: profile?.lastName?.trim() || "",
          email: profile?.email?.trim() || "",
          mobile: profile?.mobile?.trim() || "",
          horseName: profile?.horseName?.trim() || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process request");
      }

      setShowProgress(true);
      triggerDownload();
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

  const triggerDownload = () => {
    const link = document.createElement('a');
    link.href = introAudio;
    link.download = 'From-Strong-to-Light-and-Soft-Trial-Lesson.mp3';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !mobile.trim() || !horseName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to receive your free audio lesson.",
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

    if (!termsAccepted) {
      toast({
        title: "Terms Required",
        description: "Please read and accept the terms and conditions.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/lead-capture/strong-horse-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
          horseName: horseName.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process request");
      }

      setShowProgress(true);
      triggerDownload();
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

  const handleProgressComplete = () => {
    setShowProgress(false);
    setShowSuccess(true);
  };

  if (showProgress) {
    return <DownloadProgressOverlay onComplete={handleProgressComplete} />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {showSuccess ? (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-xl font-playfair font-bold text-navy mb-2">
                Your Free Lesson is Ready!
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Your download has started. You'll also receive an email with all the details about the audio course.
              </DialogDescription>
            </DialogHeader>
            
            <div className="bg-navy rounded-xl p-4 my-6">
              <div className="flex items-center justify-center gap-2 text-white mb-3">
                <Headphones className="h-5 w-5 text-orange" />
                <span className="font-semibold text-sm">Trial Lesson</span>
              </div>
              <audio controls className="w-full" data-testid="audio-intro-lesson">
                <source src={introAudio} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
            
            <div className="flex flex-col gap-3">
              <Link href="/courses/strong-horse-audio#pricing">
                <Button className="w-full bg-orange hover:bg-orange-hover text-white" data-testid="button-view-courses-audio">
                  View Full Course Options
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href={introAudio} download="From-Strong-to-Light-and-Soft-Trial-Lesson.mp3">
                <Button variant="outline" className="w-full" data-testid="button-download-audio-again">
                  <Download className="mr-2 h-4 w-4" />
                  Download Again
                </Button>
              </a>
              <Button variant="ghost" onClick={handleClose} className="text-gray-500" data-testid="button-close-audio-modal">
                Close
              </Button>
            </div>
          </div>
        ) : isRecognized && profile?.firstName && !showUpdateForm ? (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <User className="h-8 w-8 text-navy" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-xl font-playfair font-bold text-navy mb-3">
                Welcome back, {profile.firstName}!
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-base">
                Ready to download your free audio lesson?
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
              data-testid="button-quick-download-audio"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Preparing...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download Now
                </>
              )}
            </Button>
            <div className="flex justify-center gap-4 text-sm">
              <button
                onClick={() => setShowUpdateForm(true)}
                className="text-navy hover:underline"
                data-testid="button-update-audio-details"
              >
                Update my details
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={handleNotMe}
                className="text-gray-500 hover:text-gray-700 hover:underline"
                data-testid="button-not-me-audio"
              >
                Not me
              </button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex justify-center mb-4">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-orange/10 rounded-full">
                  <Headphones className="h-7 w-7 text-orange" />
                </div>
              </div>
              <DialogTitle className="text-xl font-playfair font-bold text-navy text-center">
                Get Your Free Audio Lesson
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600">
                Enter your details and your download will start immediately.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="audio-firstName" className="text-navy font-medium text-sm">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="audio-firstName"
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isSubmitting}
                    required
                    data-testid="input-audio-firstname"
                    className="border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="audio-lastName" className="text-navy font-medium text-sm">
                    Surname <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="audio-lastName"
                    type="text"
                    placeholder="Surname"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isSubmitting}
                    required
                    data-testid="input-audio-lastname"
                    className="border-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="audio-email" className="text-navy font-medium text-sm">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="audio-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  required
                  data-testid="input-audio-email"
                  className="border-gray-300"
                />
                <p className="text-xs text-gray-500">Please double-check your email address is correct</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="audio-mobile" className="text-navy font-medium text-sm">
                  Mobile Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="audio-mobile"
                  type="tel"
                  placeholder="+44 7..."
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  disabled={isSubmitting}
                  required
                  data-testid="input-audio-mobile"
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="audio-horseName" className="text-navy font-medium text-sm">
                  Your Horse's Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="audio-horseName"
                  type="text"
                  placeholder="Your horse's name"
                  value={horseName}
                  onChange={(e) => setHorseName(e.target.value)}
                  disabled={isSubmitting}
                  required
                  data-testid="input-audio-horsename"
                  className="border-gray-300"
                />
              </div>

              <div className="flex items-start gap-2 pt-2">
                <Checkbox
                  id="audio-lead-terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                  disabled={isSubmitting}
                  data-testid="checkbox-audio-lead-terms"
                  className="mt-0.5"
                />
                <label htmlFor="audio-lead-terms" className="text-sm text-gray-600 leading-tight">
                  <a 
                    href="https://danbizzarromethod.com/audio-lessons-terms" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-navy hover:text-orange underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    I have read and agree to the terms and conditions
                  </a>
                </label>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                <p className="text-xs text-gray-600 flex items-start gap-2">
                  <Mail className="h-3 w-3 text-navy mt-0.5 flex-shrink-0" />
                  <span>Your details are safe. I'll only send helpful training tips and clinic updates.</span>
                </p>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !termsAccepted}
                className="w-full bg-orange hover:bg-orange-hover text-white font-semibold py-3"
                data-testid="button-submit-audio-form"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Preparing...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download Free Lesson
                  </>
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function PDFLeadCaptureModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [horseName, setHorseName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAudioConfirmation, setShowAudioConfirmation] = useState(false);
  const [isDownloadingAudio, setIsDownloadingAudio] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setMobile("");
    setHorseName("");
    setShowSuccess(false);
    setShowAudioConfirmation(false);
  };

  const handleDownloadAudioLesson = async () => {
    setIsDownloadingAudio(true);
    
    try {
      // Call the API to add GHL tag (we already have their details from PDF form)
      await fetch("/api/lead-capture/strong-horse-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
          horseName: horseName.trim(),
        }),
      });

      // Trigger the audio download
      const link = document.createElement('a');
      link.href = introAudio;
      link.download = 'From-Strong-to-Light-and-Soft-Trial-Lesson.mp3';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show audio confirmation
      setShowAudioConfirmation(true);
      
    } catch (error) {
      console.error("Audio download error:", error);
      toast({
        title: "Download Started",
        description: "Your audio lesson is downloading.",
      });
      // Still trigger download even if API fails
      const link = document.createElement('a');
      link.href = introAudio;
      link.download = 'From-Strong-to-Light-and-Soft-Trial-Lesson.mp3';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setShowAudioConfirmation(true);
    } finally {
      setIsDownloadingAudio(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !mobile.trim() || !horseName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to receive your free PDF guide.",
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
          horseName: horseName.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process request");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'The-Strong-Horse-Solution-Dan-Bizzarro.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
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
        {showAudioConfirmation ? (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-xl font-playfair font-bold text-navy mb-2">
                Your Audio Lesson is Downloading!
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Check your downloads folder. You'll also receive an email with all the details about the audio course.
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-6 space-y-3">
              <Link href="/courses/strong-horse-audio#pricing">
                <Button className="w-full bg-orange hover:bg-orange-hover text-white" data-testid="button-view-courses">
                  View Full Course Options
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" onClick={handleClose} className="w-full" data-testid="button-close-audio-modal">
                Close
              </Button>
            </div>
          </div>
        ) : showSuccess ? (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-xl font-playfair font-bold text-navy mb-2">
                Your PDF Guide is Ready!
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Your download has started. You'll also receive an email with all the details.
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-6 p-4 bg-orange/5 border border-orange/20 rounded-xl">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Headphones className="h-5 w-5 text-orange" />
                <span className="font-semibold text-navy">Want to Go Deeper?</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Try my "From Strong to Light and Soft" audio course — listen while you ride and transform your horse in 28 days.
              </p>
              
              <div className="space-y-2">
                <Button 
                  onClick={handleDownloadAudioLesson}
                  disabled={isDownloadingAudio}
                  className="w-full bg-orange hover:bg-orange-hover text-white"
                  data-testid="button-download-audio-from-pdf"
                >
                  {isDownloadingAudio ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download Free Audio Lesson
                    </>
                  )}
                </Button>
                <Link href="/courses/strong-horse-audio">
                  <Button variant="outline" className="w-full border-orange text-orange hover:bg-orange/10" data-testid="button-find-out-more">
                    Find Out More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <button
              onClick={handleClose}
              className="mt-4 text-gray-500 hover:text-gray-700 text-sm underline transition-colors"
              data-testid="button-close-pdf-modal"
            >
              No thanks, close
            </button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex justify-center mb-4">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full">
                  <FileText className="h-7 w-7 text-green-600" />
                </div>
              </div>
              <DialogTitle className="text-xl font-playfair font-bold text-navy text-center">
                Get Your Free PDF Guide
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600">
                "The Strong Horse Solution" - Enter your details to download.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="pdf-firstName" className="text-navy font-medium text-sm">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="pdf-firstName"
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isSubmitting}
                    required
                    data-testid="input-pdf-firstname"
                    className="border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pdf-lastName" className="text-navy font-medium text-sm">
                    Surname <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="pdf-lastName"
                    type="text"
                    placeholder="Surname"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isSubmitting}
                    required
                    data-testid="input-pdf-lastname"
                    className="border-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="pdf-email" className="text-navy font-medium text-sm">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="pdf-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  required
                  data-testid="input-pdf-email"
                  className="border-gray-300"
                />
                <p className="text-xs text-gray-500">Please double-check your email address is correct</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pdf-mobile" className="text-navy font-medium text-sm">
                  Mobile Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="pdf-mobile"
                  type="tel"
                  placeholder="+44 7..."
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  disabled={isSubmitting}
                  required
                  data-testid="input-pdf-mobile"
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pdf-horseName" className="text-navy font-medium text-sm">
                  Your Horse's Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="pdf-horseName"
                  type="text"
                  placeholder="Your horse's name"
                  value={horseName}
                  onChange={(e) => setHorseName(e.target.value)}
                  disabled={isSubmitting}
                  required
                  data-testid="input-pdf-horsename"
                  className="border-gray-300"
                />
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                <p className="text-xs text-gray-600 flex items-start gap-2">
                  <Mail className="h-3 w-3 text-navy mt-0.5 flex-shrink-0" />
                  <span>Your details are safe. I'll only send helpful training tips and clinic updates.</span>
                </p>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
                data-testid="button-submit-pdf-form"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Preparing...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download Free PDF
                  </>
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface PricingTier {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  badge?: string;
  limitText?: string;
  description: string;
  features: string[];
  idealFor: string[];
  note?: string;
  buttonText: string;
  highlighted?: boolean;
  purchaseUrl?: string;
  disabled?: boolean;
}

function AudioCoursePaymentForm({ 
  onPaymentSuccess, 
  onPaymentError, 
  customerData,
  clientSecret 
}: {
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
  customerData: { firstName: string; lastName: string; email: string; mobile: string; horseName: string };
  clientSecret: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentReady, setIsPaymentReady] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
        redirect: 'if_required',
      });

      if (error) {
        onPaymentError(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onPaymentSuccess(paymentIntent.id);
      }
    } catch (error) {
      onPaymentError('Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExpressCheckout = async (event: any) => {
    const { error } = event;
    
    if (error) {
      onPaymentError(error.message || 'Express checkout failed');
      return;
    }

    const paymentIntentId = clientSecret.split('_secret_')[0];
    onPaymentSuccess(paymentIntentId);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center text-blue-800 mb-1">
          <CreditCard className="w-4 h-4 mr-2" />
          <span className="font-semibold text-sm">Secure Payment - £97</span>
        </div>
        <p className="text-xs text-blue-700">
          Complete your purchase with secure payment
        </p>
      </div>

      <div className="space-y-2">
        <ExpressCheckoutElement
          onConfirm={handleExpressCheckout}
          options={{
            buttonType: {
              applePay: 'buy',
              googlePay: 'buy'
            }
          }}
        />
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-2 text-gray-500">Or pay with card</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        {paymentError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-red-800 text-xs">
            <AlertTriangle className="w-3 h-3 inline mr-1" />
            {paymentError}
          </div>
        )}
        
        {!isPaymentReady && !paymentError && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-600 text-sm">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 mr-2"></div>
              Loading payment form...
            </div>
          </div>
        )}
        
        <div className={!isPaymentReady ? 'opacity-0 h-0 overflow-hidden' : ''}>
          <PaymentElement 
            onReady={() => {
              setIsPaymentReady(true);
              setPaymentError(null);
            }}
            onLoadError={(error) => {
              setPaymentError(error.error?.message || 'Failed to load payment form');
            }}
          />
        </div>
        
        <Button
          type="submit"
          disabled={!stripe || isProcessing || !isPaymentReady}
          className="w-full bg-navy hover:bg-slate-800 text-white py-3"
          data-testid="button-audio-course-pay"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Pay £97 Now
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

function AudioCoursePurchaseModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [horseName, setHorseName] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [stripeError, setStripeError] = useState(false);
  const { toast } = useToast();

  const loadStripeInstance = async () => {
    setStripeLoading(true);
    setStripeError(false);
    resetStripeCache();
    
    try {
      const instance = await getStripePromise();
      if (instance) {
        setStripe(instance);
        setStripeError(false);
      } else {
        setStripeError(true);
      }
    } catch (error) {
      console.error('Stripe loading error:', error);
      setStripeError(true);
    } finally {
      setStripeLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !stripe && !stripeLoading && !stripeError) {
      loadStripeInstance();
    }
  }, [isOpen]);

  const resetForm = () => {
    setStep('form');
    setFirstName("");
    setLastName("");
    setEmail("");
    setMobile("");
    setHorseName("");
    setTermsAccepted(false);
    setClientSecret(null);
    setPaymentIntentId(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !mobile.trim() || !horseName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields including your horse's name.",
        variant: "destructive",
      });
      return;
    }

    if (!termsAccepted) {
      toast({
        title: "Terms Required",
        description: "Please read and accept the terms and conditions.",
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
      const response = await fetch("/api/audio-course/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
          horseName: horseName.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment");
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
      setPaymentIntentId(data.paymentIntentId);
      setStep('payment');
      
    } catch (error) {
      console.error("Payment intent error:", error);
      toast({
        title: "Something Went Wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (intentId: string) => {
    try {
      const response = await fetch("/api/audio-course/complete-purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentIntentId: intentId,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
          horseName: horseName.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to complete purchase");
      }

      setStep('success');
    } catch (error) {
      console.error("Purchase completion error:", error);
      toast({
        title: "Payment Received",
        description: "Your payment was successful. Please contact us if you don't receive your course access email.",
        variant: "default",
      });
      setStep('success');
    }
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        {step === 'success' ? (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-xl font-playfair font-bold text-navy mb-2">
                Purchase Complete!
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Thank you for your purchase! You'll receive an email shortly with the link to access the "From Strong to Soft & Light in 28 Days" full course and the Dan Bizzarro Method Hub.
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-blue-700">
                <Mail className="h-4 w-4" />
                <span className="text-sm font-medium">Check your inbox for course access</span>
              </div>
            </div>
            
            <div className="mt-6">
              <Button variant="outline" onClick={handleClose} className="w-full" data-testid="button-close-audio-purchase-modal">
                Close
              </Button>
            </div>
          </div>
        ) : step === 'payment' && clientSecret && stripe ? (
          <>
            <DialogHeader>
              <div className="flex justify-center mb-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-navy/10">
                  <CreditCard className="h-6 w-6 text-navy" />
                </div>
              </div>
              <DialogTitle className="text-lg font-playfair font-bold text-navy text-center">
                Complete Your Purchase
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600 text-sm">
                Strong to Soft & Light — Audio Course
              </DialogDescription>
            </DialogHeader>

            <Elements stripe={stripe} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
              <AudioCoursePaymentForm
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
                customerData={{ firstName, lastName, email, mobile, horseName }}
                clientSecret={clientSecret}
              />
            </Elements>

            <Button 
              variant="ghost" 
              onClick={() => setStep('form')} 
              className="w-full text-gray-500 text-sm mt-2"
              data-testid="button-back-to-form"
            >
              ← Back to edit details
            </Button>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="flex justify-center mb-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange/10">
                  <Headphones className="h-6 w-6 text-orange" />
                </div>
              </div>
              <DialogTitle className="text-lg font-playfair font-bold text-navy text-center">
                Get the Audio Course
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600 text-sm">
                Strong to Soft & Light — £97
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleFormSubmit} className="space-y-3 mt-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div className="space-y-1">
                  <Label htmlFor="audio-firstName" className="text-navy font-medium text-sm">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="audio-firstName"
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isSubmitting}
                    required
                    data-testid="input-audio-firstname"
                    className="border-gray-300"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="audio-lastName" className="text-navy font-medium text-sm">
                    Surname <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="audio-lastName"
                    type="text"
                    placeholder="Surname"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isSubmitting}
                    required
                    data-testid="input-audio-lastname"
                    className="border-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="audio-email" className="text-navy font-medium text-sm">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="audio-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  required
                  data-testid="input-audio-email"
                  className="border-gray-300"
                />
                <p className="text-xs text-gray-500">Please double-check your email address is correct</p>
              </div>

              <div className="space-y-1">
                <Label htmlFor="audio-mobile" className="text-navy font-medium text-sm">
                  Mobile Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="audio-mobile"
                  type="tel"
                  placeholder="+44 7..."
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  disabled={isSubmitting}
                  required
                  data-testid="input-audio-mobile"
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="audio-horseName" className="text-navy font-medium text-sm">
                  Your Horse's Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="audio-horseName"
                  type="text"
                  placeholder="Your horse's name"
                  value={horseName}
                  onChange={(e) => setHorseName(e.target.value)}
                  disabled={isSubmitting}
                  required
                  data-testid="input-audio-horsename"
                  className="border-gray-300"
                />
              </div>

              <div className="flex items-start gap-2 pt-2">
                <Checkbox
                  id="audio-terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                  disabled={isSubmitting}
                  data-testid="checkbox-audio-terms"
                  className="mt-0.5"
                />
                <label htmlFor="audio-terms" className="text-sm text-gray-600 leading-tight">
                  <a 
                    href="https://danbizzarromethod.com/audio-lessons-terms" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-navy hover:text-orange underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    I have read and agree to the terms and conditions
                  </a>
                </label>
              </div>

              {stripeError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-red-700 font-medium">Payment system unavailable</p>
                      <p className="text-xs text-red-600 mt-1">
                        Unable to load payment processing. Please try again or contact us.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={loadStripeInstance}
                        disabled={stripeLoading}
                        className="mt-2 text-xs"
                        data-testid="button-retry-stripe"
                      >
                        {stripeLoading ? (
                          <>
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                            Retrying...
                          </>
                        ) : (
                          'Try Again'
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {stripeLoading && !stripeError && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading payment system...
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting || !termsAccepted || stripeLoading || stripeError}
                className="w-full bg-orange hover:bg-orange-hover text-white font-semibold py-3 mt-2"
                data-testid="button-audio-proceed-to-payment"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Access the Full Course Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function getNextChallengeStartDate(): string {
  const now = new Date();
  const currentDay = now.getDate();
  
  let targetDate: Date;
  if (currentDay >= 1) {
    targetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  } else {
    targetDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  return `1st ${monthNames[targetDate.getMonth()]}`;
}

const pricingTiers: PricingTier[] = [
  {
    id: "self-guided",
    name: "AUDIO COURSE ONLY",
    subtitle: "",
    price: "£97",
    description: "Best if you're happy to work independently and apply the system in your own time.",
    features: [
      "Full Strong to Soft & Light audio course (6 lessons)",
      "Clear structure and progression",
      "Clear results very quickly",
      "Lifetime access"
    ],
    idealFor: [
      "clarity",
      "understanding"
    ],
    note: "Self-paced · No live calls · No group",
    buttonText: "Get the Audio Course"
  },
  {
    id: "guided-group",
    name: "28 DAYS CHALLENGE",
    subtitle: "",
    price: "£147",
    badge: "Most Popular",
    limitText: "Limited to 40 riders",
    description: "Best if you want guidance, structure, and support while applying the system.",
    features: [
      "Everything in the audio course, plus:",
      "Weekly live group Zoom call (4 total)",
      "Coaching, Q&A, and selected rider video analysis",
      "Private challenge group (this intake only)",
      "Clear weekly focus and simple accountability"
    ],
    idealFor: [
      "reassurance you're on the right track",
      "explanation and correction",
      "momentum and consistency"
    ],
    buttonText: "Join the 28-Day Challenge",
    highlighted: true
  },
  {
    id: "private-mentorship",
    name: "28 DAYS PRIVATE MENTORSHIP",
    subtitle: "",
    price: "£997",
    badge: "Premium",
    limitText: "Limited to 3 riders",
    description: "Best if you want direct input, fast progress, and fully personalised coaching.",
    features: [
      "Everything above, plus:",
      "Two private coaching sessions per week (in person or virtual)",
      "Individual video analysis",
      "Direct access to me for training-related questions",
      "A fully personalised weekly plan"
    ],
    idealFor: [
      "maximum support and accountability",
      "fast, focused progress",
      "personalised guidance at every step"
    ],
    note: "This option is limited and not always available.",
    buttonText: "COMING SOON",
    disabled: true
  }
];

function PricingCard({ tier, onSelect }: { tier: PricingTier; onSelect: (tierId: string) => void }) {
  const Icon = tier.id === "self-guided" ? Headphones : tier.id === "guided-group" ? Users : Crown;
  
  return (
    <div 
      className={`relative rounded-2xl p-6 lg:p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
        tier.highlighted 
          ? 'bg-gradient-to-br from-navy via-slate-800 to-navy text-white ring-4 ring-orange shadow-2xl' 
          : 'bg-white border-2 border-gray-200 shadow-lg'
      }`}
    >
      {tier.badge && (
        <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-bold ${
          tier.highlighted ? 'bg-orange text-white' : 'bg-navy text-white'
        }`}>
          {tier.badge}
        </div>
      )}
      
      <div className="text-center mb-6">
        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full mb-4 ${
          tier.highlighted ? 'bg-white/10' : 'bg-navy/5'
        }`}>
          <Icon className={`h-7 w-7 ${tier.highlighted ? 'text-orange' : 'text-navy'}`} />
        </div>
        
        <p className={`text-sm font-semibold uppercase tracking-wide mb-1 ${
          tier.highlighted ? 'text-orange' : 'text-orange'
        }`}>
          {tier.name}
        </p>
        
        <div className="flex items-baseline justify-center gap-2 mb-2">
          <span className={`text-4xl font-bold ${tier.highlighted ? 'text-white' : 'text-navy'}`}>
            {tier.price}
          </span>
        </div>
        
        {tier.limitText && (
          <p className={`text-sm font-medium ${tier.highlighted ? 'text-orange' : 'text-orange'}`}>
            {tier.limitText}
          </p>
        )}
      </div>
      
      <p className={`text-center mb-6 ${tier.highlighted ? 'text-gray-300' : 'text-gray-600'}`}>
        {tier.description}
      </p>
      
      <div className="mb-6">
        <p className={`text-sm font-semibold mb-3 ${tier.highlighted ? 'text-white' : 'text-navy'}`}>
          What you get:
        </p>
        <ul className="space-y-2">
          {tier.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                tier.highlighted ? 'text-green-400' : 'text-green-500'
              }`} />
              <span className={`text-sm ${tier.highlighted ? 'text-gray-200' : 'text-gray-700'}`}>
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>
      
      {tier.note && (
        <p className={`text-xs text-center mb-4 ${tier.highlighted ? 'text-gray-400' : 'text-gray-500'}`}>
          {tier.note}
        </p>
      )}
      
      <Button 
        onClick={() => !tier.disabled && onSelect(tier.id)}
        disabled={tier.disabled}
        className={`w-full py-4 text-lg font-semibold transition-all duration-300 ${
          tier.disabled
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : tier.highlighted 
              ? 'bg-orange hover:bg-orange-hover text-white hover:scale-105 hover:shadow-lg' 
              : 'bg-navy hover:bg-navy/90 text-white hover:scale-105 hover:shadow-lg'
        }`}
        data-testid={`button-buy-${tier.id}`}
      >
        {tier.buttonText}
        {!tier.disabled && <ArrowRight className="ml-2 h-5 w-5" />}
      </Button>
      
      {tier.id === "guided-group" && (
        <p className="text-center mt-3 text-sm font-medium text-orange flex items-center justify-center gap-1.5">
          <Calendar className="h-4 w-4" />
          Next challenge starts {getNextChallengeStartDate()}
        </p>
      )}
    </div>
  );
}

function PurchaseModal({ 
  isOpen, 
  onClose, 
  tier 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  tier: PricingTier | null;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [horseName, setHorseName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setMobile("");
    setHorseName("");
    setShowSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !mobile.trim() || !horseName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields including your horse's name.",
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
      const response = await fetch("/api/course-interest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
          horseName: horseName.trim(),
          courseType: tier?.id,
          courseName: tier?.subtitle,
          price: tier?.price,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process request");
      }

      setShowSuccess(true);
      
    } catch (error) {
      console.error("Course interest error:", error);
      toast({
        title: "Something Went Wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!tier) return null;

  const Icon = tier.id === "guided-group" ? Users : Crown;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {showSuccess ? (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-xl font-playfair font-bold text-navy mb-2">
                Thank You!
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                {tier.id === "private-mentorship" 
                  ? "I've received your application for Private Mentorship. You'll receive an email shortly and I'll be in touch within 24 hours to discuss your goals."
                  : "I've received your registration for the 28-Day Challenge! You'll receive an email shortly with all the details and next steps."}
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-blue-700">
                <Mail className="h-4 w-4" />
                <span className="text-sm font-medium">Check your inbox for confirmation</span>
              </div>
            </div>
            
            <div className="mt-6">
              <Button variant="outline" onClick={handleClose} className="w-full" data-testid="button-close-purchase-modal">
                Close
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex justify-center mb-4">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full ${
                  tier.id === "private-mentorship" ? 'bg-purple-100' : 'bg-orange/10'
                }`}>
                  <Icon className={`h-7 w-7 ${tier.id === "private-mentorship" ? 'text-purple-600' : 'text-orange'}`} />
                </div>
              </div>
              <DialogTitle className="text-xl font-playfair font-bold text-navy text-center">
                {tier.id === "private-mentorship" ? "Apply for Private Mentorship" : "Join the 28-Day Challenge"}
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600">
                {tier.subtitle} — {tier.price}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="purchase-firstName" className="text-navy font-medium text-sm">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="purchase-firstName"
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isSubmitting}
                    required
                    data-testid="input-purchase-firstname"
                    className="border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchase-lastName" className="text-navy font-medium text-sm">
                    Surname <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="purchase-lastName"
                    type="text"
                    placeholder="Surname"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isSubmitting}
                    required
                    data-testid="input-purchase-lastname"
                    className="border-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="purchase-email" className="text-navy font-medium text-sm">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="purchase-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  required
                  data-testid="input-purchase-email"
                  className="border-gray-300"
                />
                <p className="text-xs text-gray-500">Please double-check your email address is correct</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchase-mobile" className="text-navy font-medium text-sm">
                  Mobile Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="purchase-mobile"
                  type="tel"
                  placeholder="+44 7..."
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  disabled={isSubmitting}
                  required
                  data-testid="input-purchase-mobile"
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchase-horseName" className="text-navy font-medium text-sm">
                  Your Horse's Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="purchase-horseName"
                  type="text"
                  placeholder="Your horse's name"
                  value={horseName}
                  onChange={(e) => setHorseName(e.target.value)}
                  disabled={isSubmitting}
                  required
                  data-testid="input-purchase-horsename"
                  className="border-gray-300"
                />
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                <p className="text-xs text-gray-600 flex items-start gap-2">
                  <Mail className="h-3 w-3 text-navy mt-0.5 flex-shrink-0" />
                  <span>
                    {tier.id === "private-mentorship"
                      ? "I'll contact you within 24 hours to discuss your goals and confirm availability."
                      : "You'll receive confirmation and challenge details via email."}
                  </span>
                </p>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className={`w-full font-semibold py-3 ${
                  tier.id === "private-mentorship" 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'bg-orange hover:bg-orange-hover text-white'
                }`}
                data-testid="button-submit-purchase-form"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {tier.id === "private-mentorship" ? "Submit Application" : "Register Now"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function StrongHorseAudioCourse() {
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showAudioCoursePurchaseModal, setShowAudioCoursePurchaseModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // If there's a hash, scroll to that element
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // No hash, scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleTierSelect = (tierId: string) => {
    if (tierId === 'self-guided') {
      setShowAudioCoursePurchaseModal(true);
      return;
    }
    const tier = pricingTiers.find(t => t.id === tierId);
    if (tier) {
      setSelectedTier(tier);
      setShowPurchaseModal(true);
    }
  };

  return (
    <>
      <SEOHead
        title={getSEOConfig('/courses/strong-horse-audio').title}
        description={getSEOConfig('/courses/strong-horse-audio').description}
        keywords={getSEOConfig('/courses/strong-horse-audio').keywords}
        canonical={getCanonicalUrl('/courses/strong-horse-audio')}
      />
      <Navigation />
      <AudioLeadCaptureModal isOpen={showAudioModal} onClose={() => setShowAudioModal(false)} />
      <PDFLeadCaptureModal isOpen={showPDFModal} onClose={() => setShowPDFModal(false)} />
      <PurchaseModal 
        isOpen={showPurchaseModal} 
        onClose={() => setShowPurchaseModal(false)} 
        tier={selectedTier} 
      />
      <AudioCoursePurchaseModal
        isOpen={showAudioCoursePurchaseModal}
        onClose={() => setShowAudioCoursePurchaseModal(false)}
      />
      <ExitIntentPopup onDownload={() => setShowAudioModal(true)} />
      {/* Hero Section */}
      <section className="relative overflow-hidden mt-14 sm:mt-16 bg-gradient-to-br from-navy via-navy to-[#1a365d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div>
              <span className="inline-block bg-amber-400 text-navy font-semibold text-sm px-4 py-1.5 rounded-full mb-6">
                6-Lesson Audio Course
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-white mb-4 leading-tight">
                From Strong to Light and Soft{" "}
                <span className="text-orange">(in 28 Days)</span>
              </h1>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                The complete Listen-While-You-Ride Audio Course that transforms heavy, rushing horses into soft, balanced, rideable partners — IN ONLY 28 DAYS.
              </p>
              
              {/* Stats Row */}
              <div className="flex flex-wrap gap-4 sm:gap-6 mb-8">
                <div className="flex items-center gap-2 text-gray-300">
                  <Headphones className="h-5 w-5 text-orange" />
                  <span>6 Audio Lessons</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="h-5 w-5 text-orange" />
                  <span>~180 Minutes Total</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Target className="h-5 w-5 text-orange" />
                  <span>Proven Method</span>
                </div>
              </div>
              
              {/* Quote */}
              <div className="border-l-4 border-orange pl-4 py-2">
                <p className="text-gray-300 italic text-base leading-relaxed">
                  "A strong horse doesn't become light by being held. It becomes light when the communication becomes clear and the self-carriage is established"
                </p>
                <p className="text-orange font-semibold mt-2">— Dan Bizzarro</p>
              </div>
            </div>
            
            {/* Right Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl">
              <h2 className="text-2xl font-playfair font-bold text-navy text-center mb-6">
                Start Learning Now
              </h2>
              
              <div className="space-y-4">
                <Button 
                  onClick={() => setShowAudioModal(true)}
                  className="w-full bg-orange hover:bg-orange-hover text-white font-semibold py-4 rounded-lg transition duration-300 text-base"
                  data-testid="button-hero-free-lesson"
                >
                  <Headphones className="mr-2 h-5 w-5" />
                  Try a Free Audio Lesson
                </Button>
                
                <a href="#pricing" className="block">
                  <Button 
                    variant="outline"
                    className="w-full border-2 border-navy text-navy hover:bg-navy hover:text-white font-semibold py-4 rounded-lg transition duration-300 text-base"
                    data-testid="button-hero-start-course"
                  >
                    <ArrowRight className="mr-2 h-5 w-5" />
                    START THE COURSE NOW
                  </Button>
                </a>
              </div>
              
              </div>
          </div>
        </div>
      </section>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        
        {/* THE TRANSFORMATION - BEFORE & AFTER */}
        <section className="py-16 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-navy mb-4 text-center">
              The Transformation
            </h2>
            <p className="text-gray-600 text-lg text-center mb-10">
              See the difference when a horse learns to carry itself in balance.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative">
                <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold z-10 shadow-lg">
                  Before
                </div>
                <img 
                  src={beforeImage} 
                  alt="Horse rushing and on the forehand" 
                  className="w-full h-72 object-cover object-center rounded-xl shadow-lg"
                />
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-medium text-center">
                    Heavy on the forehand, rushing, pulling against the rider
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold z-10 shadow-lg">
                  After
                </div>
                <img 
                  src={afterImage} 
                  alt="Horse balanced and soft in the contact" 
                  className="w-full h-72 object-cover rounded-xl shadow-lg"
                />
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium text-center">
                    Balanced, soft in the contact, listening to the rider
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DOES THIS SOUND LIKE YOUR HORSE? */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-playfair font-bold text-navy mb-6 text-center">
              Does This Sound Like Your Horse?
            </h2>
            
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Leans heavily on your hands",
                  "Gets faster the more you try to slow down",
                  "Rushes into or away from jumps",
                  "Ignores your half-halts",
                  "Feels out of control in canter",
                  "Gets stronger when nervous or excited"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange rounded-full mt-2 flex-shrink-0" />
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <p className="text-navy font-semibold text-lg">
                  These aren't behaviour problems. They're balance problems.
                </p>
                <p className="text-gray-600 mt-2">
                  And balance problems have a simple solution — when you know how.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FROM STRONG TO LIGHT AND SOFT IN 28 DAYS */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-navy mb-4">
                From Strong to Light and Soft <span className="text-orange">in 28 Days</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                A structured, ride-along audio course designed to help you develop a lighter, softer, more self-carrying horse through better balance, clearer aids, and progressive training.
              </p>
              <p className="text-gray-500 mt-3 italic">
                You listen to each lesson while you ride, so the work happens in real time — with your own horse, in your normal routine.
              </p>
            </div>

            {/* A Clear Sequence */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-8 text-center">
              <h3 className="text-2xl font-bold text-navy mb-4">A clear sequence that builds real change</h3>
              <p className="text-gray-700 mb-4">
                This course is made up of six audio lessons, designed to be followed in order. Each lesson builds on the previous one. <strong>The sequence matters.</strong>
              </p>
              <p className="text-gray-700 mb-4">
                That's because lightness doesn't come from a single exercise — it comes from developing the right foundations, in the right order:
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-4">
                {["Balance before softness", "Understanding before adjustment", "Self-carriage before refinement"].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-orange/10 px-4 py-2 rounded-full">
                    <div className="w-2 h-2 bg-orange rounded-full flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-gray-600 text-sm italic">
                While the lessons can be repeated and revisited as needed, following the sequence ensures you don't skip the steps that actually make the difference.
              </p>
            </div>

            {/* CTA after sequence */}
            <div className="text-center mb-8">
              <Button 
                onClick={() => setShowAudioModal(true)}
                className="bg-orange hover:bg-orange-hover text-white font-semibold px-8 py-3"
                data-testid="cta-try-free-lesson-1"
              >
                <Headphones className="mr-2 h-5 w-5" />
                Try a Free Audio Lesson
              </Button>
            </div>

            {/* What the course focuses on */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-8 text-center">
              <h3 className="text-2xl font-bold text-navy mb-4">What the course focuses on</h3>
              <p className="text-gray-700 mb-4">
                Most strong horses aren't difficult — they're trying to balance themselves the only way they know how.
              </p>
              <p className="text-gray-700 mb-6">In this course, you'll learn how to:</p>
              <div className="grid md:grid-cols-2 gap-3 max-w-2xl mx-auto text-left mb-6">
                {[
                  "Reduce heaviness without losing energy",
                  "Stop the horse leaning on the hand",
                  "Improve balance through correct transitions",
                  "Create softness during the work, not only afterwards",
                  "Ride with less effort and more clarity"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              <div className="bg-navy/5 rounded-lg p-4">
                <p className="text-gray-700">
                  The emphasis is on <strong>how the horse carries himself</strong>, not on managing the symptoms. This reflects the principles of the Dan Bizzarro Method: helping horses move better by improving posture, balance, and understanding — rather than forcing outcomes.
                </p>
              </div>
            </div>

            {/* How and where to use the lessons */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
                <h3 className="text-xl font-bold text-navy mb-4">How and where to use the lessons</h3>
                <div className="space-y-3 text-left max-w-xs mx-auto">
                  {[
                    "The lessons are primarily flatwork-based",
                    "One lesson includes a bonus jumping element",
                    "Many of the exercises can also be applied while hacking"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
                <p className="text-gray-600 mt-4 text-sm">
                  You don't need a perfect arena or ideal conditions. The ideas are designed to be adaptable, so you can apply them in your normal riding environment.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
                <h3 className="text-xl font-bold text-navy mb-4">How the course works</h3>
                <div className="space-y-3 text-left max-w-xs mx-auto">
                  {[
                    "6 audio lessons you listen to while riding",
                    "Clear guidance you can apply immediately"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Headphones className="h-5 w-5 text-orange mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
                <p className="text-gray-600 mt-4 text-sm">Each lesson gives you:</p>
                <div className="space-y-1 mt-2 text-sm text-gray-600">
                  <p>• A focus for the ride</p>
                  <p>• Specific exercises</p>
                  <p>• What you should feel changing</p>
                  <p>• Common mistakes to avoid</p>
                </div>
                <p className="text-gray-600 mt-4 text-sm italic">
                  The course is designed to be followed over 28 days, but you can move at a pace that suits you and your horse.
                </p>
              </div>
            </div>

            {/* CTA after how it works */}
            <div className="text-center mb-8">
              <a href="#pricing">
                <Button 
                  className="bg-navy hover:bg-navy/90 text-white font-semibold px-8 py-3"
                  data-testid="cta-view-pricing-1"
                >
                  View Pricing Options
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </div>

            {/* Who this course is for */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-8 text-center">
              <h3 className="text-2xl font-bold text-navy mb-4">Who this course is for</h3>
              <p className="text-gray-700 mb-6">This course is for riders who:</p>
              <div className="grid md:grid-cols-2 gap-3 max-w-2xl mx-auto text-left">
                {[
                  "Feel like their horse is strong, heavy, or resistant",
                  "Want softness without losing impulsion",
                  "Feel they're constantly managing rather than riding",
                  "Want structure and clarity between lessons or clinics",
                  "Ride for enjoyment, training, or personal goals — whatever the discipline"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-gray-600 mt-6 italic">
                It's particularly useful if you don't have regular access to coaching but still want guidance that makes sense and produces real change.
              </p>
            </div>

            {/* What this course is NOT */}
            <div className="bg-red-50 border border-red-100 rounded-xl p-8 mb-8 text-center">
              <h3 className="text-2xl font-bold text-navy mb-4">What this course is not</h3>
              <div className="flex flex-wrap justify-center gap-4 mb-4">
                {["A quick fix", "A gadget-based solution", 'A "pull less and hope" approach'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg">
                    <X className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-gray-700">
                It's a methodical process that teaches you <strong>why things feel the way they do</strong> — and how to change them step by step.
              </p>
            </div>

            {/* The goal after 28 days */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold text-navy mb-4">The goal after 28 days</h3>
              <p className="text-gray-700 mb-6">By the end of the course, you should notice:</p>
              <div className="grid md:grid-cols-2 gap-3 max-w-2xl mx-auto text-left mb-6">
                {[
                  "A lighter, more consistent contact",
                  "A more balanced horse",
                  "Less effort in your arms and body",
                  "Clearer, calmer transitions",
                  "A better understanding of how to maintain softness"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-navy font-semibold text-lg mb-6">
                Not perfection — but meaningful, repeatable progress you can build on.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => setShowAudioModal(true)}
                  variant="outline"
                  className="border-orange text-orange hover:bg-orange hover:text-white font-semibold px-6 py-3"
                  data-testid="cta-try-free-lesson-2"
                >
                  <Headphones className="mr-2 h-5 w-5" />
                  Try Free Lesson First
                </Button>
                <a href="#pricing">
                  <Button 
                    className="bg-orange hover:bg-orange-hover text-white font-semibold px-6 py-3"
                    data-testid="cta-get-full-course"
                  >
                    Get the Full Course
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT CHANGES WHEN YOU APPLY THIS SYSTEM */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-navy mb-10 text-center">
              What Changes When You Apply This System
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* For You */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">🙋</span>
                  <h3 className="text-2xl font-bold text-navy">For You:</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "Feel calmer and more in control",
                    "Know exactly what to do when the horse gets strong",
                    "Spend less time fighting, more time riding",
                    "Clearer, more effective aids",
                    "Confidence that comes from predictability"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* For Your Horse */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">🐴</span>
                  <h3 className="text-2xl font-bold text-navy">For Your Horse:</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "Softer, more relaxed neck",
                    "Lighter, more comfortable contact",
                    "Better natural balance",
                    "Quicker, clearer responses",
                    "Less rushing, leaning and pulling"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CHOOSE YOUR LEVEL OF SUPPORT - PRICING TIERS */}
        <section id="pricing" className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-navy mb-4">
                Choose your level of support
              </h2>
              <p className="text-lg text-orange font-semibold">
                One system · Three ways to work with it
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
              {pricingTiers.map((tier) => (
                <PricingCard 
                  key={tier.id} 
                  tier={tier} 
                  onSelect={handleTierSelect}
                />
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-gray-500 text-sm">
                All options include lifetime access to the audio course material.
              </p>
            </div>
          </div>
        </section>

        {/* FREE RESOURCES SECTION */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-playfair font-bold text-navy mb-4">
                Not Sure Yet?
              </h2>
              <p className="text-gray-600 text-lg">
                Try a free lesson first and see if this approach is right for you.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-orange/10 rounded-full mb-4">
                  <Headphones className="h-7 w-7 text-orange" />
                </div>
                <h3 className="text-xl font-bold text-navy mb-2">Free Audio Lesson</h3>
                <p className="text-gray-600 mb-4">
                  Get a taste of the audio coaching format with a complete introductory lesson.
                </p>
                <Button
                  onClick={() => setShowAudioModal(true)}
                  className="bg-orange hover:bg-orange-hover text-white font-semibold transition-all duration-300 hover:scale-105"
                  data-testid="button-get-free-audio"
                >
                  <Headphones className="mr-2 h-4 w-4" />
                  Try Free Audio Lesson
                </Button>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-4">
                  <FileText className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-navy mb-2">Free PDF Guide</h3>
                <p className="text-gray-600 mb-4">
                  Download "The Strong Horse Solution" guide to understand the method.
                </p>
                <Button
                  onClick={() => setShowPDFModal(true)}
                  variant="outline"
                  className="border-2 border-green-600 text-green-700 hover:bg-green-50 font-semibold transition-all duration-300 hover:scale-105"
                  data-testid="button-get-free-pdf"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Get Free PDF Guide
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* WHY AUDIO */}
        <section className="py-16 bg-navy text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <Headphones className="h-12 w-12 text-orange mx-auto mb-4" />
              <h2 className="text-3xl font-playfair font-bold mb-4">
                Why an Audio Course?
              </h2>
              <p className="text-gray-300 text-lg">
                Real-time coaching in your earbuds — absorb the lesson before you ride.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Listen While You Prepare",
                  description: "Pop in your earbuds while grooming, driving, or getting ready — the concepts will be fresh when you mount up."
                },
                {
                  title: "No Booking, No Fees, No Travel",
                  description: "Forget scheduling lessons, paying per session, or driving to a trainer. Train at your own yard, on your own terms."
                },
                {
                  title: "Unlimited Lessons, Anytime",
                  description: "Repeat any lesson as many times as you want, whenever suits you — early morning, late evening, weekends."
                }
              ].map((item, i) => (
                <div key={i} className="bg-white/10 rounded-lg p-6 text-center">
                  <h3 className="text-lg font-semibold text-orange mb-2">{item.title}</h3>
                  <p className="text-gray-300 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-playfair font-bold text-navy mb-8 text-center">
              Frequently Asked Questions
            </h2>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <FAQItem 
                question="What's the difference between the options?"
                answer="The Self-Guided option gives you the complete audio course to work through independently. The 28-Day Challenge adds weekly live Zoom calls, a private group, and accountability. The Private Mentorship includes direct 1-on-1 coaching sessions and a fully personalised training plan."
              />
              <FAQItem 
                question="Is this course suitable for all riding disciplines?"
                answer="Yes! While I specialise in show jumping and eventing, the principles in this course apply to any discipline. Whether you ride dressage, hack out, or compete cross country — a strong horse is a strong horse, and the solution is the same."
              />
              <FAQItem 
                question="How long before I see results?"
                answer="Most riders notice a difference within their first few sessions of applying these techniques. The key is consistency — small, daily changes add up to major transformations."
              />
              <FAQItem 
                question="Can I upgrade from Self-Guided to the Challenge later?"
                answer="Yes, you can upgrade at any time by paying the difference. Just get in touch and I'll sort it out for you."
              />
              <FAQItem 
                question="Will this work for my young/green horse?"
                answer="Yes, in fact it's even more effective with younger horses because you're building good habits from the start rather than undoing old ones. The principles work for horses of all ages and experience levels."
              />
              <FAQItem 
                question="How do the live Zoom calls work?"
                answer="Each week during the 28-Day Challenge, we meet on Zoom for coaching, Q&A, and I'll analyse selected rider videos. It's a supportive group environment where you can ask questions and learn from others on the same journey."
              />
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-16 bg-gradient-to-br from-navy via-slate-800 to-navy text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-playfair font-bold mb-4">
              Ready to Transform Your Riding?
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Choose the level of support that's right for you and start your journey to a lighter, softer horse.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                onClick={() => handleTierSelect("self-guided")}
                className="bg-white text-navy hover:bg-gray-100 font-semibold py-4 px-8 text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                data-testid="button-cta-self-guided"
              >
                Audio Course Only — £97
              </Button>
              <Button 
                onClick={() => handleTierSelect("guided-group")}
                className="bg-orange hover:bg-orange-hover text-white font-semibold py-4 px-8 text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                data-testid="button-cta-challenge"
              >
                28-Day Challenge — £147
              </Button>
              <Button 
                onClick={() => handleTierSelect("private-mentorship")}
                className="bg-white text-navy hover:bg-gray-100 font-semibold py-4 px-8 text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                data-testid="button-cta-mentorship"
              >
                Private Mentorship — £997
              </Button>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}
