import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { usePhoneVerification } from "@/hooks/usePhoneVerification";
import { PhoneVerificationField, requiresSmsVerification } from "@/components/PhoneVerificationField";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import { Loader2, Download, CheckCircle, Mail, ChevronDown, ChevronUp, Headphones, FileText, Clock, Target, Users, Star, Crown, ArrowRight, Calendar, Video, MessageCircle, User, CreditCard, AlertTriangle, ExternalLink, X, Gift, Lock } from "lucide-react";
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
import { StrongHorseAudioPageConfig, defaultConfig, PricingOverride } from "./StrongHorseAudioPageConfig";

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

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem('exitPopupShown');
    if (alreadyShown) {
      setHasShown(true);
      return;
    }

    let shownRef = false;
    let hasReached25Percent = false;
    let lastScrollY = window.scrollY;
    let lastScrollTime = Date.now();
    let wasScrollingDown = true;
    let rafId: number | null = null;

    const showPopup = () => {
      if (!shownRef) {
        setIsOpen(true);
        setHasShown(true);
        shownRef = true;
        sessionStorage.setItem('exitPopupShown', 'true');
      }
    };

    const handleScroll = () => {
      if (shownRef) return;
      
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        
        const currentScrollY = window.scrollY;
        const currentTime = Date.now();
        const timeDelta = currentTime - lastScrollTime;
        const scrollDelta = currentScrollY - lastScrollY;
        
        // Check if reached 25% scroll depth
        const scrollPercent = (currentScrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (scrollPercent >= 25) {
          hasReached25Percent = true;
        }
        
        // Calculate velocity (pixels per second)
        const velocity = timeDelta > 0 ? (scrollDelta / timeDelta) * 1000 : 0;
        
        // Detect fast upward scroll after reaching 25%
        // velocity < -900 means scrolling up fast (negative = upward)
        // scrollDelta < -100 means moved up at least 100px
        if (hasReached25Percent && wasScrollingDown && velocity < -900 && scrollDelta < -100) {
          showPopup();
        }
        
        // Track scroll direction
        if (scrollDelta > 10) {
          wasScrollingDown = true;
        } else if (scrollDelta < -10) {
          wasScrollingDown = false;
        }
        
        lastScrollY = currentScrollY;
        lastScrollTime = currentTime;
      });
    };

    // Desktop: also detect mouse leaving top of page
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && hasReached25Percent && !shownRef) {
        showPopup();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

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
  const { profile, isRecognized, forgetMe, isLoading } = useVisitor();
  const phoneVerification = usePhoneVerification();
  
  const isVerifiedUser = Boolean(isRecognized && profile?.firstName && profile?.phoneVerifiedAt) && !showUpdateForm;
  const needsHorseName = Boolean(isVerifiedUser && !profile?.horseName);

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
    phoneVerification.reset();
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
    phoneVerification.reset();
  };

  const handleQuickDownload = async () => {
    setIsSubmitting(true);
    try {
      const horseNameToUse = profile?.horseName?.trim() || horseName.trim();
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
          horseName: horseNameToUse,
          phoneVerified: true,
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
    console.log("Form submit triggered", { firstName, lastName, email, mobile, horseName, termsAccepted, isPhoneVerified: phoneVerification.isPhoneVerified });
    
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !mobile.trim() || !horseName.trim()) {
      console.log("Validation failed: missing fields");
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to receive your free audio lesson.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Validation failed: invalid email");
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (!termsAccepted) {
      console.log("Validation failed: terms not accepted");
      toast({
        title: "Terms Required",
        description: "Please read and accept the terms and conditions.",
        variant: "destructive",
      });
      return;
    }

    const needsSmsVerification = requiresSmsVerification(mobile);
    const isInternationalVerified = !needsSmsVerification && mobile.trim().length >= 10;

    if (!phoneVerification.isPhoneVerified && !isInternationalVerified) {
      console.log("Validation failed: phone not verified");
      toast({
        title: "Phone Verification Required",
        description: "Please verify your mobile number before downloading.",
        variant: "destructive",
      });
      return;
    }

    console.log("All validations passed, making API call...");
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
          phoneVerified: phoneVerification.isPhoneVerified,
        }),
      });

      console.log("API response status:", response.status);
      
      if (!response.ok) {
        throw new Error("Failed to process request");
      }

      console.log("API call succeeded, starting download...");
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
                The audio file has been downloaded to your device. You can now listen to it whenever you want, wherever you are - even offline!
              </DialogDescription>
            </DialogHeader>
            
            <div className="bg-navy rounded-xl p-6 my-6">
              <div className="flex items-center justify-center gap-2 text-white mb-3">
                <Headphones className="h-6 w-6 text-orange" />
                <span className="font-semibold">Trial Lesson Downloaded</span>
              </div>
              <p className="text-white/80 text-sm">
                Check your device's Downloads folder to find your audio lesson. Open it with your favourite music or podcast app to start listening!
              </p>
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
        ) : isLoading ? (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-orange mx-auto mb-4" />
            <DialogHeader>
              <DialogTitle className="text-lg font-playfair font-bold text-navy">Loading...</DialogTitle>
              <DialogDescription className="text-gray-500 text-sm">Please wait</DialogDescription>
            </DialogHeader>
          </div>
        ) : isVerifiedUser && profile ? (
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
            
            {needsHorseName && (
              <div className="space-y-2 mb-4 text-left">
                <Label htmlFor="quick-horseName" className="text-navy font-medium text-sm">
                  Horse's Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="quick-horseName"
                  type="text"
                  placeholder="Your horse's name"
                  value={horseName}
                  onChange={(e) => setHorseName(e.target.value)}
                  disabled={isSubmitting}
                  className="border-gray-300"
                  data-testid="input-quick-horsename"
                />
              </div>
            )}
            
            <div className="flex items-start gap-2 mb-4 text-left">
              <input
                type="checkbox"
                id="quick-terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-orange focus:ring-orange"
                data-testid="checkbox-quick-terms"
              />
              <label htmlFor="quick-terms" className="text-xs text-gray-600">
                I agree to the{" "}
                <Link href="/terms" className="text-orange hover:underline">
                  Terms & Conditions
                </Link>{" "}
                and consent to receive updates from Dan Bizzarro Method.
              </label>
            </div>
            
            <Button
              onClick={handleQuickDownload}
              disabled={isSubmitting || !termsAccepted || (needsHorseName && !horseName.trim())}
              className="w-full bg-orange hover:bg-orange-hover text-white font-semibold py-3 rounded-lg transition-all duration-300 mb-3 disabled:opacity-50"
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

              <PhoneVerificationField
                mobile={mobile}
                setMobile={setMobile}
                isPhoneVerified={phoneVerification.isPhoneVerified}
                codeSent={phoneVerification.codeSent}
                isSendingCode={phoneVerification.isSendingCode}
                isVerifyingCode={phoneVerification.isVerifyingCode}
                verificationCode={phoneVerification.verificationCode}
                verificationError={phoneVerification.verificationError}
                onSendCode={() => phoneVerification.sendVerificationCode(mobile)}
                onVerifyCode={() => phoneVerification.verifyCode(mobile)}
                onCodeChange={phoneVerification.setVerificationCode}
                onPhoneChange={phoneVerification.handlePhoneChange}
                onReset={phoneVerification.reset}
                disabled={isSubmitting}
                testIdPrefix="audio"
              />

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
                disabled={isSubmitting || !termsAccepted || (!phoneVerification.isPhoneVerified && requiresSmsVerification(mobile)) || mobile.trim().length < 10}
                className="w-full bg-orange hover:bg-orange-hover text-white font-semibold py-3 disabled:opacity-50"
                data-testid="button-submit-audio-form"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Preparing...
                  </>
                ) : (!phoneVerification.isPhoneVerified && requiresSmsVerification(mobile)) ? (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Verify Phone to Download
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
  const phoneVerification = usePhoneVerification();

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setMobile("");
    setHorseName("");
    setShowSuccess(false);
    setShowAudioConfirmation(false);
    phoneVerification.reset();
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
          phoneVerified: true,
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

    const needsSmsVerification = requiresSmsVerification(mobile);
    const isInternationalVerified = !needsSmsVerification && mobile.trim().length >= 10;

    if (!phoneVerification.isPhoneVerified && !isInternationalVerified) {
      toast({
        title: "Phone Verification Required",
        description: "Please verify your mobile number before downloading.",
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

              <PhoneVerificationField
                mobile={mobile}
                setMobile={setMobile}
                isPhoneVerified={phoneVerification.isPhoneVerified}
                codeSent={phoneVerification.codeSent}
                isSendingCode={phoneVerification.isSendingCode}
                isVerifyingCode={phoneVerification.isVerifyingCode}
                verificationCode={phoneVerification.verificationCode}
                verificationError={phoneVerification.verificationError}
                onSendCode={() => phoneVerification.sendVerificationCode(mobile)}
                onVerifyCode={() => phoneVerification.verifyCode(mobile)}
                onCodeChange={phoneVerification.setVerificationCode}
                onPhoneChange={phoneVerification.handlePhoneChange}
                onReset={phoneVerification.reset}
                disabled={isSubmitting}
                testIdPrefix="pdf"
              />

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
  originalPrice?: string;
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
  clientSecret,
  price = "£97"
}: {
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
  customerData: { firstName: string; lastName: string; email: string; mobile: string; horseName: string };
  clientSecret: string;
  price?: string;
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
      } else if (paymentIntent) {
        if (paymentIntent.status === 'succeeded') {
          onPaymentSuccess(paymentIntent.id);
        } else if (paymentIntent.status === 'requires_action' || paymentIntent.status === 'requires_confirmation') {
          onPaymentError('Additional verification required. Please complete the authentication in the popup window.');
        } else if (paymentIntent.status === 'processing') {
          onPaymentError('Payment is still processing. Please wait a moment and check your email for confirmation.');
        } else {
          onPaymentError(`Payment incomplete. Status: ${paymentIntent.status}. Please try again.`);
        }
      } else {
        onPaymentError('Payment failed. Please try again.');
      }
    } catch (error) {
      onPaymentError('Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExpressCheckout = async (event: any) => {
    if (!stripe) {
      onPaymentError('Payment system not ready. Please try again.');
      return;
    }

    const { error } = event;
    
    if (error) {
      onPaymentError(error.message || 'Express checkout failed');
      return;
    }

    // After Express Checkout confirms, we must verify the actual payment status
    try {
      const { paymentIntent, error: retrieveError } = await stripe.retrievePaymentIntent(clientSecret);
      
      if (retrieveError) {
        onPaymentError(retrieveError.message || 'Failed to verify payment');
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        onPaymentSuccess(paymentIntent.id);
      } else if (paymentIntent?.status === 'requires_action' || paymentIntent?.status === 'requires_confirmation') {
        onPaymentError('Additional verification required. Please complete the authentication.');
      } else if (paymentIntent?.status === 'processing') {
        onPaymentError('Payment is processing. Please wait and check your email for confirmation.');
      } else {
        onPaymentError(`Payment not completed. Status: ${paymentIntent?.status || 'unknown'}. Please try again.`);
      }
    } catch (err) {
      onPaymentError('Failed to verify payment. Please check your email or contact support.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center text-blue-800 mb-1">
          <CreditCard className="w-4 h-4 mr-2" />
          <span className="font-semibold text-sm">Secure Payment - {price}</span>
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
              Pay {price} Now
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
  const [showEditForm, setShowEditForm] = useState(false);
  const { toast } = useToast();
  const { profile, isRecognized, forgetMe } = useVisitor();
  const phoneVerification = usePhoneVerification();
  
  const isVerifiedUser = Boolean(isRecognized && profile?.firstName && profile?.phoneVerifiedAt) && !showEditForm;
  const needsHorseName = Boolean(isVerifiedUser && !profile?.horseName);

  useEffect(() => {
    if (isOpen && profile && isRecognized) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setEmail(profile.email || "");
      setMobile(profile.mobile || "");
      setHorseName(profile.horseName || "");
    }
  }, [isOpen, profile, isRecognized]);

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
    setShowEditForm(false);
    phoneVerification.reset();
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
    setShowEditForm(false);
  };

  const handleQuickProceed = async () => {
    const horseNameToUse = profile?.horseName?.trim() || horseName.trim();
    
    if (!horseNameToUse) {
      toast({
        title: "Missing Information",
        description: "Please enter your horse's name.",
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
    setFirstName(profile?.firstName || "");
    setLastName(profile?.lastName || "");
    setEmail(profile?.email || "");
    setMobile(profile?.mobile || "");
    setHorseName(horseNameToUse);

    try {
      const response = await fetch("/api/audio-course/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: profile?.firstName?.trim() || "",
          lastName: profile?.lastName?.trim() || "",
          email: profile?.email?.trim() || "",
          mobile: profile?.mobile?.trim() || "",
          horseName: horseNameToUse,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment");
      }

      setClientSecret(data.clientSecret);
      setPaymentIntentId(data.paymentIntentId);
      setStep('payment');
    } catch (error) {
      console.error("Payment intent error:", error);
      toast({
        title: "Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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

    const needsSmsVerification = requiresSmsVerification(mobile);
    const isInternationalVerified = !needsSmsVerification && mobile.trim().length >= 10;

    if (!phoneVerification.isPhoneVerified && !isInternationalVerified) {
      toast({
        title: "Phone Verification Required",
        description: "Please verify your mobile number before proceeding.",
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
        ) : isVerifiedUser && profile ? (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-3">
              <User className="h-7 w-7 text-navy" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-lg font-playfair font-bold text-navy mb-2">
                Welcome back, {profile.firstName}!
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-sm">
                Ready to get the audio course? Confirm your details below.
              </DialogDescription>
            </DialogHeader>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 my-4 text-left">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-navy">Email:</span> {profile.email}
              </p>
              {profile.mobile && (
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium text-navy">Mobile:</span> {profile.mobile}
                </p>
              )}
              {profile.horseName && (
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium text-navy">Horse:</span> {profile.horseName}
                </p>
              )}
            </div>
            
            {needsHorseName && (
              <div className="space-y-2 mb-4 text-left">
                <Label htmlFor="quick-purchase-horseName" className="text-navy font-medium text-sm">
                  Horse's Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="quick-purchase-horseName"
                  type="text"
                  placeholder="Your horse's name"
                  value={horseName}
                  onChange={(e) => setHorseName(e.target.value)}
                  disabled={isSubmitting}
                  className="border-gray-300"
                  data-testid="input-quick-purchase-horsename"
                />
              </div>
            )}
            
            <div className="flex items-start gap-2 mb-4 text-left">
              <input
                type="checkbox"
                id="quick-purchase-terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-orange focus:ring-orange"
                data-testid="checkbox-quick-purchase-terms"
              />
              <label htmlFor="quick-purchase-terms" className="text-xs text-gray-600">
                I agree to the{" "}
                <a 
                  href="https://danbizzarromethod.com/audio-lessons-terms" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange hover:underline"
                >
                  Terms & Conditions
                </a>
              </label>
            </div>
            
            <Button
              onClick={handleQuickProceed}
              disabled={isSubmitting || !termsAccepted || (needsHorseName && !horseName.trim())}
              className="w-full bg-orange hover:bg-orange-hover text-white font-semibold py-3 rounded-lg mb-3 disabled:opacity-50"
              data-testid="button-quick-purchase-proceed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Proceed to Payment — £97
                </>
              )}
            </Button>
            <div className="flex justify-center gap-4 text-sm">
              <button
                onClick={() => setShowEditForm(true)}
                className="text-navy hover:underline"
                data-testid="button-edit-purchase-details"
              >
                Edit my details
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={handleNotMe}
                className="text-gray-500 hover:text-gray-700 hover:underline"
                data-testid="button-not-me-purchase"
              >
                Not me
              </button>
            </div>
          </div>
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

              <PhoneVerificationField
                mobile={mobile}
                setMobile={setMobile}
                isPhoneVerified={phoneVerification.isPhoneVerified}
                codeSent={phoneVerification.codeSent}
                isSendingCode={phoneVerification.isSendingCode}
                isVerifyingCode={phoneVerification.isVerifyingCode}
                verificationCode={phoneVerification.verificationCode}
                verificationError={phoneVerification.verificationError}
                onSendCode={() => phoneVerification.sendVerificationCode(mobile)}
                onVerifyCode={() => phoneVerification.verifyCode(mobile)}
                onCodeChange={phoneVerification.setVerificationCode}
                onPhoneChange={phoneVerification.handlePhoneChange}
                onReset={phoneVerification.reset}
                disabled={isSubmitting}
                testIdPrefix="audio"
              />

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

function DiscountedAudioPurchaseModal({ 
  isOpen, 
  onClose,
  discountCode 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  discountCode: string;
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
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [stripeError, setStripeError] = useState(false);
  const { toast } = useToast();
  const { profile, isRecognized } = useVisitor();
  const phoneVerification = usePhoneVerification();

  useEffect(() => {
    if (isOpen && profile && isRecognized) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setEmail(profile.email || "");
      setMobile(profile.mobile || "");
      setHorseName(profile.horseName || "");
    }
  }, [isOpen, profile, isRecognized]);

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
    phoneVerification.reset();
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

    const needsSmsVerification = requiresSmsVerification(mobile);
    const isInternationalVerified = !needsSmsVerification && mobile.trim().length >= 10;

    if (!phoneVerification.isPhoneVerified && !isInternationalVerified) {
      toast({
        title: "Phone Verification Required",
        description: "Please verify your mobile number before continuing.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/audio-course/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
          horseName: horseName.trim(),
          discountCode,
        }),
      });

      if (!response.ok) throw new Error("Failed to create payment");

      const data = await response.json();
      setClientSecret(data.clientSecret);
      setStep('payment');
    } catch (error) {
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
      await fetch("/api/audio-course/complete-purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId: intentId,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
          horseName: horseName.trim(),
        }),
      });
      setStep('success');
    } catch (error) {
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
                Thank you for your purchase! You'll receive an email shortly with the link to access the full course and the Dan Bizzarro Method Hub.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-blue-700">
                <Mail className="h-4 w-4" />
                <span className="text-sm font-medium">Check your inbox for course access</span>
              </div>
            </div>
            <div className="mt-6">
              <Button variant="outline" onClick={handleClose} className="w-full">Close</Button>
            </div>
          </div>
        ) : step === 'payment' && clientSecret && stripe ? (
          <>
            <DialogHeader>
              <div className="flex justify-center mb-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
                  <Gift className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <DialogTitle className="text-lg font-playfair font-bold text-navy text-center">
                Complete Your Purchase
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600 text-sm">
                Strong to Soft & Light — <span className="line-through text-gray-400">£97</span> <span className="text-green-600 font-semibold">£72</span>
              </DialogDescription>
            </DialogHeader>

            <Elements stripe={stripe} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
              <AudioCoursePaymentForm
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
                customerData={{ firstName, lastName, email, mobile, horseName }}
                clientSecret={clientSecret}
                price="£72"
              />
            </Elements>

            <Button variant="ghost" onClick={() => setStep('form')} className="w-full text-gray-500 text-sm mt-2">
              ← Back to edit details
            </Button>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="flex justify-center mb-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
                  <Gift className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <DialogTitle className="text-lg font-playfair font-bold text-navy text-center">
                Special Offer — 25% OFF
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600 text-sm">
                Strong to Soft & Light — <span className="line-through text-gray-400">£97</span> <span className="text-green-600 font-semibold">£72</span>
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleFormSubmit} className="space-y-3 mt-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div className="space-y-1">
                  <Label htmlFor="discount-firstName" className="text-navy font-medium text-sm">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input id="discount-firstName" type="text" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={isSubmitting} required className="border-gray-300" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="discount-lastName" className="text-navy font-medium text-sm">
                    Surname <span className="text-red-500">*</span>
                  </Label>
                  <Input id="discount-lastName" type="text" placeholder="Surname" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={isSubmitting} required className="border-gray-300" />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="discount-email" className="text-navy font-medium text-sm">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input id="discount-email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSubmitting} required className="border-gray-300" />
                <p className="text-xs text-gray-500">Please double-check your email address is correct</p>
              </div>

              <PhoneVerificationField
                mobile={mobile}
                setMobile={setMobile}
                isPhoneVerified={phoneVerification.isPhoneVerified}
                codeSent={phoneVerification.codeSent}
                isSendingCode={phoneVerification.isSendingCode}
                isVerifyingCode={phoneVerification.isVerifyingCode}
                verificationCode={phoneVerification.verificationCode}
                verificationError={phoneVerification.verificationError}
                onSendCode={() => phoneVerification.sendVerificationCode(mobile)}
                onVerifyCode={() => phoneVerification.verifyCode(mobile)}
                onCodeChange={phoneVerification.setVerificationCode}
                onPhoneChange={phoneVerification.handlePhoneChange}
                onReset={phoneVerification.reset}
                disabled={isSubmitting}
                testIdPrefix="discount"
              />

              <div className="space-y-1">
                <Label htmlFor="discount-horseName" className="text-navy font-medium text-sm">
                  Your Horse's Name <span className="text-red-500">*</span>
                </Label>
                <Input id="discount-horseName" type="text" placeholder="Your horse's name" value={horseName} onChange={(e) => setHorseName(e.target.value)} disabled={isSubmitting} required className="border-gray-300" />
              </div>

              <div className="flex items-start gap-2 pt-2">
                <Checkbox id="discount-terms" checked={termsAccepted} onCheckedChange={(checked) => setTermsAccepted(checked === true)} disabled={isSubmitting} className="mt-0.5" />
                <label htmlFor="discount-terms" className="text-sm text-gray-600 leading-tight">
                  <a href="https://danbizzarromethod.com/audio-lessons-terms" target="_blank" rel="noopener noreferrer" className="text-navy hover:text-orange underline" onClick={(e) => e.stopPropagation()}>
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
                      <p className="text-xs text-red-600 mt-1">Please try again or contact us directly.</p>
                      <Button variant="outline" size="sm" onClick={loadStripeInstance} className="mt-2 text-xs" disabled={stripeLoading}>
                        {stripeLoading ? 'Retrying...' : 'Try Again'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <Button type="submit" disabled={isSubmitting || stripeLoading || stripeError} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 font-semibold">
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</>
                ) : (
                  <><Gift className="w-4 h-4 mr-2" />Get Course for £72 (Save £25)</>
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

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
          {tier.originalPrice && (
            <span className={`text-xl line-through ${tier.highlighted ? 'text-gray-400' : 'text-gray-400'}`}>
              {tier.originalPrice}
            </span>
          )}
          <span className={`text-4xl font-bold ${tier.highlighted ? 'text-white' : tier.originalPrice ? 'text-green-600' : 'text-navy'}`}>
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
              : 'bg-navy hover:bg-slate-700 text-white hover:scale-105 hover:shadow-lg'
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

function ChallengePaymentForm({ 
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
      } else if (paymentIntent) {
        if (paymentIntent.status === 'succeeded') {
          onPaymentSuccess(paymentIntent.id);
        } else if (paymentIntent.status === 'requires_action' || paymentIntent.status === 'requires_confirmation') {
          onPaymentError('Additional verification required. Please complete the authentication in the popup window.');
        } else if (paymentIntent.status === 'processing') {
          onPaymentError('Payment is still processing. Please wait a moment and check your email for confirmation.');
        } else {
          onPaymentError(`Payment incomplete. Status: ${paymentIntent.status}. Please try again.`);
        }
      } else {
        onPaymentError('Payment failed. Please try again.');
      }
    } catch (error) {
      onPaymentError('Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <PaymentElement />
      </div>

      <div className="bg-orange/5 border border-orange/20 rounded-lg p-3">
        <div className="flex items-center gap-2 text-orange">
          <Lock className="h-4 w-4" />
          <span className="text-sm font-medium">Secure payment powered by Stripe</span>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full bg-orange hover:bg-orange-hover text-white font-semibold py-3"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Pay £147
          </>
        )}
      </Button>
    </form>
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
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [horseName, setHorseName] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [stripeError, setStripeError] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const { toast } = useToast();
  const { profile, isRecognized, forgetMe, isLoading } = useVisitor();
  const phoneVerification = usePhoneVerification();
  
  const isVerifiedUser = Boolean(isRecognized && profile?.firstName && profile?.phoneVerifiedAt) && !showEditForm;
  const needsHorseName = Boolean(isVerifiedUser && !profile?.horseName);

  useEffect(() => {
    if (isOpen && profile && isRecognized) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setEmail(profile.email || "");
      setMobile(profile.mobile || "");
      setHorseName(profile.horseName || "");
    }
  }, [isOpen, profile, isRecognized]);

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
      setStripeError(true);
    } finally {
      setStripeLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && tier?.id === 'guided-group' && !stripe && !stripeLoading && !stripeError) {
      loadStripeInstance();
    }
  }, [isOpen, tier]);

  const resetForm = () => {
    setStep('form');
    setFirstName("");
    setLastName("");
    setEmail("");
    setMobile("");
    setHorseName("");
    setTermsAccepted(false);
    setClientSecret(null);
    setShowEditForm(false);
    phoneVerification.reset();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleNotMeChallenge = () => {
    forgetMe();
    setFirstName("");
    setLastName("");
    setEmail("");
    setMobile("");
    setHorseName("");
    setTermsAccepted(false);
    setShowEditForm(false);
  };

  const handleQuickProceedChallenge = async () => {
    const horseNameToUse = profile?.horseName?.trim() || horseName.trim();
    
    if (!horseNameToUse) {
      toast({
        title: "Missing Information",
        description: "Please enter your horse's name.",
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
    setFirstName(profile?.firstName || "");
    setLastName(profile?.lastName || "");
    setEmail(profile?.email || "");
    setMobile(profile?.mobile || "");
    setHorseName(horseNameToUse);

    try {
      if (tier?.id === 'guided-group') {
        const response = await fetch("/api/challenge/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: profile?.firstName?.trim() || "",
            lastName: profile?.lastName?.trim() || "",
            email: profile?.email?.trim() || "",
            mobile: profile?.mobile?.trim() || "",
            horseName: horseNameToUse,
          }),
        });

        if (!response.ok) throw new Error("Failed to create payment");

        const data = await response.json();
        setClientSecret(data.clientSecret);
        setStep('payment');
      } else {
        const response = await fetch("/api/course-interest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: profile?.firstName?.trim() || "",
            lastName: profile?.lastName?.trim() || "",
            email: profile?.email?.trim() || "",
            mobile: profile?.mobile?.trim() || "",
            horseName: horseNameToUse,
            courseType: tier?.id,
            courseName: tier?.subtitle,
            price: tier?.price,
          }),
        });

        if (!response.ok) throw new Error("Failed to process request");
        setStep('success');
      }
    } catch (error) {
      console.error("Quick proceed error:", error);
      toast({
        title: "Error",
        description: "Failed to process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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

    const needsSmsVerification = requiresSmsVerification(mobile);
    const isInternationalVerified = !needsSmsVerification && mobile.trim().length >= 10;

    if (!phoneVerification.isPhoneVerified && !isInternationalVerified) {
      toast({
        title: "Phone Verification Required",
        description: "Please verify your mobile number before continuing.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // For 28 Days Challenge, create payment intent
      if (tier?.id === 'guided-group') {
        const response = await fetch("/api/challenge/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            mobile: mobile.trim(),
            horseName: horseName.trim(),
          }),
        });

        if (!response.ok) throw new Error("Failed to create payment");

        const data = await response.json();
        setClientSecret(data.clientSecret);
        setStep('payment');
      } else {
        // For Private Mentorship, just register interest
        const response = await fetch("/api/course-interest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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

        if (!response.ok) throw new Error("Failed to process request");
        setStep('success');
      }
    } catch (error) {
      console.error("Form submission error:", error);
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
      const response = await fetch("/api/challenge/complete-purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId: intentId,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
          horseName: horseName.trim(),
        }),
      });

      if (!response.ok) throw new Error("Failed to complete purchase");
      setStep('success');
    } catch (error) {
      console.error("Purchase completion error:", error);
      toast({
        title: "Payment Received - Action Required",
        description: "Your payment was successful but there was an issue completing your registration. Please contact us at dan@danbizzarromethod.com with your payment confirmation.",
        variant: "destructive",
      });
      // Stay on payment step - don't advance to success since completion failed
    }
  };

  const handlePaymentError = (errorMessage: string) => {
    toast({
      title: "Payment Failed",
      description: errorMessage,
      variant: "destructive",
    });
  };

  if (!tier) return null;

  const Icon = tier.id === "guided-group" ? Users : Crown;
  const isChallenge = tier.id === 'guided-group';

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === 'success' ? (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-xl font-playfair font-bold text-navy mb-2">
                {isChallenge ? "Welcome to the Challenge!" : "Thank You!"}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                {isChallenge 
                  ? "Your payment was successful! You'll receive an email shortly with all the details about the 28-Day Challenge and how to get started."
                  : "I've received your application for Private Mentorship. You'll receive an email shortly and I'll be in touch within 24 hours to discuss your goals."}
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
        ) : step === 'payment' && clientSecret && stripe ? (
          <>
            <DialogHeader>
              <div className="flex justify-center mb-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange/10">
                  <CreditCard className="h-7 w-7 text-orange" />
                </div>
              </div>
              <DialogTitle className="text-xl font-playfair font-bold text-navy text-center">
                Complete Your Payment
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600">
                28 Days Challenge — £147
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg mb-4">
              <p className="text-sm text-gray-600">
                <strong>Name:</strong> {firstName} {lastName}<br />
                <strong>Email:</strong> {email}<br />
                <strong>Horse:</strong> {horseName}
              </p>
            </div>

            <Elements stripe={stripe} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
              <ChallengePaymentForm
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
                customerData={{ firstName, lastName, email, mobile, horseName }}
                clientSecret={clientSecret}
              />
            </Elements>

            <Button 
              variant="ghost" 
              onClick={() => setStep('form')} 
              className="w-full mt-2 text-gray-500"
            >
              ← Back to details
            </Button>
          </>
        ) : isLoading ? (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-orange mx-auto mb-4" />
            <DialogHeader>
              <DialogTitle className="text-lg font-playfair font-bold text-navy">Loading...</DialogTitle>
              <DialogDescription className="text-gray-500 text-sm">Please wait</DialogDescription>
            </DialogHeader>
          </div>
        ) : isVerifiedUser && profile ? (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-3">
              <User className="h-7 w-7 text-navy" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-lg font-playfair font-bold text-navy mb-2">
                Welcome back, {profile.firstName}!
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-sm">
                Ready to {isChallenge ? "join the 28-Day Challenge" : "apply for Private Mentorship"}?
              </DialogDescription>
            </DialogHeader>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 my-4 text-left">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-navy">Email:</span> {profile.email}
              </p>
              {profile.mobile && (
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium text-navy">Mobile:</span> {profile.mobile}
                </p>
              )}
              {profile.horseName && (
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium text-navy">Horse:</span> {profile.horseName}
                </p>
              )}
            </div>
            
            {needsHorseName && (
              <div className="space-y-2 mb-4 text-left">
                <Label htmlFor="quick-challenge-horseName" className="text-navy font-medium text-sm">
                  Horse's Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="quick-challenge-horseName"
                  type="text"
                  placeholder="Your horse's name"
                  value={horseName}
                  onChange={(e) => setHorseName(e.target.value)}
                  disabled={isSubmitting}
                  className="border-gray-300"
                  data-testid="input-quick-challenge-horsename"
                />
              </div>
            )}
            
            <div className="flex items-start gap-2 mb-4 text-left">
              <input
                type="checkbox"
                id="quick-challenge-terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-orange focus:ring-orange"
                data-testid="checkbox-quick-challenge-terms"
              />
              <label htmlFor="quick-challenge-terms" className="text-xs text-gray-600">
                I agree to the{" "}
                <a 
                  href="https://danbizzarromethod.com/audio-lessons-terms" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange hover:underline"
                >
                  Terms & Conditions
                </a>
              </label>
            </div>
            
            {stripeError && isChallenge && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                <p className="text-sm text-red-600">
                  Payment system unavailable. Please try again.
                </p>
                <Button variant="outline" size="sm" onClick={loadStripeInstance} className="mt-2">
                  Retry
                </Button>
              </div>
            )}
            
            <Button
              onClick={handleQuickProceedChallenge}
              disabled={isSubmitting || !termsAccepted || (needsHorseName && !horseName.trim()) || (stripeError && isChallenge)}
              className="w-full bg-orange hover:bg-orange-hover text-white font-semibold py-3 rounded-lg mb-3 disabled:opacity-50"
              data-testid="button-quick-challenge-proceed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {isChallenge ? <CreditCard className="mr-2 h-4 w-4" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                  {isChallenge ? `Proceed to Payment — ${tier.price}` : "Submit Application"}
                </>
              )}
            </Button>
            <div className="flex justify-center gap-4 text-sm">
              <button
                onClick={() => setShowEditForm(true)}
                className="text-navy hover:underline"
                data-testid="button-edit-challenge-details"
              >
                Edit my details
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={handleNotMeChallenge}
                className="text-gray-500 hover:text-gray-700 hover:underline"
                data-testid="button-not-me-challenge"
              >
                Not me
              </button>
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

            {stripeError && isChallenge && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                <p className="text-sm text-red-600">
                  Payment system unavailable. Please try again or contact us directly.
                </p>
                <Button variant="outline" size="sm" onClick={loadStripeInstance} className="mt-2">
                  Retry
                </Button>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
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

              <PhoneVerificationField
                mobile={mobile}
                setMobile={setMobile}
                isPhoneVerified={phoneVerification.isPhoneVerified}
                codeSent={phoneVerification.codeSent}
                isSendingCode={phoneVerification.isSendingCode}
                isVerifyingCode={phoneVerification.isVerifyingCode}
                verificationCode={phoneVerification.verificationCode}
                verificationError={phoneVerification.verificationError}
                onSendCode={() => phoneVerification.sendVerificationCode(mobile)}
                onVerifyCode={() => phoneVerification.verifyCode(mobile)}
                onCodeChange={phoneVerification.setVerificationCode}
                onPhoneChange={phoneVerification.handlePhoneChange}
                onReset={phoneVerification.reset}
                disabled={isSubmitting}
                testIdPrefix="purchase"
              />

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

              <div className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <Checkbox
                  id="purchase-terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                  className="mt-0.5"
                  data-testid="checkbox-purchase-terms"
                />
                <Label htmlFor="purchase-terms" className="text-sm text-gray-600 cursor-pointer leading-relaxed">
                  I have read and agree to the{" "}
                  <a 
                    href="/terms" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-orange hover:text-orange-hover underline"
                  >
                    terms and conditions
                  </a>
                </Label>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                <p className="text-xs text-gray-600 flex items-start gap-2">
                  <Mail className="h-3 w-3 text-navy mt-0.5 flex-shrink-0" />
                  <span>
                    {tier.id === "private-mentorship"
                      ? "I'll contact you within 24 hours to discuss your goals and confirm availability."
                      : "You'll receive confirmation and challenge details via email after payment."}
                  </span>
                </p>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !termsAccepted || (isChallenge && stripeLoading)}
                className={`w-full font-semibold py-3 ${
                  tier.id === "private-mentorship" 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'bg-orange hover:bg-orange-hover text-white'
                }`}
                data-testid="button-submit-purchase-form"
              >
                {isSubmitting || (isChallenge && stripeLoading) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {stripeLoading ? 'Loading...' : 'Processing...'}
                  </>
                ) : (
                  <>
                    {tier.id === "private-mentorship" ? "Submit Application" : "Continue to Payment"}
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

export function StrongHorseAudioPage({ config = defaultConfig }: { config?: StrongHorseAudioPageConfig }) {
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showAudioCoursePurchaseModal, setShowAudioCoursePurchaseModal] = useState(false);
  const [showDiscountPurchaseModal, setShowDiscountPurchaseModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleTierSelect = (tierId: string) => {
    if (tierId === 'self-guided') {
      if (config.isDiscountMode) {
        setShowDiscountPurchaseModal(true);
      } else {
        setShowAudioCoursePurchaseModal(true);
      }
      return;
    }
    const tier = pricingTiers.find(t => t.id === tierId);
    if (tier) {
      setSelectedTier(tier);
      setShowPurchaseModal(true);
    }
  };

  const handleHeroPrimaryClick = () => {
    if (config.isDiscountMode) {
      setShowDiscountPurchaseModal(true);
    } else {
      setShowAudioModal(true);
    }
  };

  const getDisplayTiers = () => {
    if (!config.pricingOverrides) return pricingTiers;
    return pricingTiers.map(tier => {
      const override = config.pricingOverrides?.[tier.id as keyof typeof config.pricingOverrides];
      if (override) {
        return {
          ...tier,
          price: override.price,
          originalPrice: override.originalPrice,
          badge: override.badge || tier.badge,
          buttonText: override.buttonText,
        };
      }
      return tier;
    });
  };

  const displayTiers = getDisplayTiers();

  return (
    <>
      <SEOHead
        title={config.seo.title}
        description={config.seo.description}
        canonical={config.seo.canonical}
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
      {config.isDiscountMode && (
        <DiscountedAudioPurchaseModal
          isOpen={showDiscountPurchaseModal}
          onClose={() => setShowDiscountPurchaseModal(false)}
          discountCode={config.discountCode || 'DAN25'}
        />
      )}
      {!config.isDiscountMode && <ExitIntentPopup onDownload={() => setShowAudioModal(true)} />}
      {/* Hero Section */}
      <section className="relative overflow-hidden mt-14 sm:mt-16 bg-gradient-to-br from-navy via-navy to-[#1a365d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div>
              <span className={`inline-block font-semibold text-sm px-4 py-1.5 rounded-full mb-6 ${config.hero.badgeClassName}`}>
                {config.hero.badge}
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
                  onClick={handleHeroPrimaryClick}
                  className={`w-full font-semibold py-4 rounded-lg transition duration-300 text-base ${config.hero.primaryButton.className}`}
                  data-testid="button-hero-primary"
                >
                  {config.hero.primaryButton.icon === 'gift' ? (
                    <Gift className="mr-2 h-5 w-5" />
                  ) : config.hero.primaryButton.icon === 'arrow' ? (
                    <ArrowRight className="mr-2 h-5 w-5" />
                  ) : (
                    <Headphones className="mr-2 h-5 w-5" />
                  )}
                  {config.hero.primaryButton.text}
                </Button>
                
                {config.hero.secondaryButton && (
                  <a href={config.hero.secondaryButton.href || '#pricing'} className="block">
                    <Button 
                      variant="outline"
                      className="w-full border-2 border-navy text-navy hover:bg-navy hover:text-white font-semibold py-4 rounded-lg transition duration-300 text-base"
                      data-testid="button-hero-secondary"
                    >
                      <ArrowRight className="mr-2 h-5 w-5" />
                      {config.hero.secondaryButton.text}
                    </Button>
                  </a>
                )}
              </div>
              
              </div>
          </div>
        </div>
      </section>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        
        {/* ABOUT DAN SECTION */}
        <section className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-navy mb-4">
                Your Coach: Dan Bizzarro
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Learn from an international event rider with over 20 years of experience transforming strong, heavy horses into light, responsive partners.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange mb-2">20+</div>
                  <div className="text-gray-600">Years of Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange mb-2">1000s</div>
                  <div className="text-gray-600">Riders Coached</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange mb-2">3</div>
                  <div className="text-gray-600">Disciplines Mastered</div>
                </div>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  I've coached thousands of riders dealing with strong, heavy, and rushing horses. The solution is never more force, more pulling, or stronger bits. The solution is clarity, balance, rhythm, and better reactions — the pillars of the Dan Bizzarro Method.
                </p>
                <p>
                  As an international event rider and coach, I've spent more than 20 years helping riders develop horses who are softer, lighter, and more confident. This audio course gives you the same simple tools I use in my lessons every day.
                </p>
                <p>
                  <strong>If your horse is strong, heavy, or rushing</strong> — I've helped hundreds of riders solve exactly this problem. Now you can access my proven system through these audio lessons, guiding you step by step while you ride.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* THE TRANSFORMATION - BEFORE & AFTER */}
        <section className="py-16 md:py-20 bg-gray-50">
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
                  "Use simple but effective exercises to change your horse's way of going",
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
                  className="bg-navy hover:bg-slate-700 text-white font-semibold px-8 py-3"
                  data-testid="cta-view-pricing-1"
                >
                  View Pricing Options
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </div>

            {/* Why an Audio Course? */}
            <div className="bg-navy text-white rounded-xl p-8 mb-8">
              <div className="text-center mb-6">
                <Headphones className="h-10 w-10 text-orange mx-auto mb-3" />
                <h3 className="text-2xl font-bold mb-2">
                  Why an Audio Course?
                </h3>
                <p className="text-gray-300">
                  Real-time coaching in your earbuds — absorb the lesson before you ride.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  {
                    title: "Listen While You Ride",
                    description: "Pop in your earbuds and receive real-time coaching while you're actually in the saddle — no more trying to remember what your instructor said."
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
                  <div key={i} className="bg-white/10 rounded-lg p-4 text-center">
                    <h4 className="text-base font-semibold text-orange mb-2">{item.title}</h4>
                    <p className="text-gray-300 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
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
              {displayTiers.map((tier) => (
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
                className={`font-semibold py-4 px-8 text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${config.isDiscountMode ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-white text-navy hover:bg-gray-100'}`}
                data-testid="button-cta-self-guided"
              >
                {config.ctaStrip.selfGuidedText}
              </Button>
              {config.ctaStrip.showChallenge && (
                <Button 
                  onClick={() => handleTierSelect("guided-group")}
                  className="bg-orange hover:bg-orange-hover text-white font-semibold py-4 px-8 text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  data-testid="button-cta-challenge"
                >
                  28-Day Challenge — £147
                </Button>
              )}
              {config.ctaStrip.showMentorship && (
                <Button 
                  onClick={() => handleTierSelect("private-mentorship")}
                  className="bg-white text-navy hover:bg-gray-100 font-semibold py-4 px-8 text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  data-testid="button-cta-mentorship"
                >
                  Private Mentorship — £997
                </Button>
              )}
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}

export default function StrongHorseAudioCourse() {
  return <StrongHorseAudioPage config={defaultConfig} />;
}
