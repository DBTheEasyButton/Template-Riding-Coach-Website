import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, CheckCircle, Mail, ChevronDown, ChevronUp, Headphones, FileText, Clock, Target, Users, Star, Crown, ArrowRight, Calendar, Video, MessageCircle, User, CreditCard, AlertTriangle, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import SEOHead from "@/components/SEOHead";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HeroPicture from "@/components/HeroPicture";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements, ExpressCheckoutElement } from "@stripe/react-stripe-js";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setMobile("");
    setShowSuccess(false);
    setShowProgress(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
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
    
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !mobile.trim()) {
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
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process request");
      }

      setShowProgress(true);
      triggerDownload();
      
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
                Your download has started. You can also listen to the lesson below.
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
              <a href={introAudio} download="From-Strong-to-Light-and-Soft-Trial-Lesson.mp3">
                <Button className="w-full bg-orange hover:bg-orange-hover text-white" data-testid="button-download-audio-again">
                  <Download className="mr-2 h-4 w-4" />
                  Download Again
                </Button>
              </a>
              <Button variant="outline" onClick={handleClose} data-testid="button-close-audio-modal">
                Close
              </Button>
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
                    First Name
                  </Label>
                  <Input
                    id="audio-firstName"
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isSubmitting}
                    data-testid="input-audio-firstname"
                    className="border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="audio-lastName" className="text-navy font-medium text-sm">
                    Surname
                  </Label>
                  <Input
                    id="audio-lastName"
                    type="text"
                    placeholder="Surname"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isSubmitting}
                    data-testid="input-audio-lastname"
                    className="border-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="audio-email" className="text-navy font-medium text-sm">
                  Email Address
                </Label>
                <Input
                  id="audio-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  data-testid="input-audio-email"
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="audio-mobile" className="text-navy font-medium text-sm">
                  Mobile Number
                </Label>
                <Input
                  id="audio-mobile"
                  type="tel"
                  placeholder="+44 7..."
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  disabled={isSubmitting}
                  data-testid="input-audio-mobile"
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setMobile("");
    setShowSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !mobile.trim()) {
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
        {showSuccess ? (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-xl font-playfair font-bold text-navy mb-2">
                Your PDF Guide is Ready!
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Your download has started. Check your downloads folder for the PDF.
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-6">
              <Button variant="outline" onClick={handleClose} className="w-full" data-testid="button-close-pdf-modal">
                Close
              </Button>
            </div>
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
                    First Name
                  </Label>
                  <Input
                    id="pdf-firstName"
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isSubmitting}
                    data-testid="input-pdf-firstname"
                    className="border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pdf-lastName" className="text-navy font-medium text-sm">
                    Surname
                  </Label>
                  <Input
                    id="pdf-lastName"
                    type="text"
                    placeholder="Surname"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isSubmitting}
                    data-testid="input-pdf-lastname"
                    className="border-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pdf-email" className="text-navy font-medium text-sm">
                  Email Address
                </Label>
                <Input
                  id="pdf-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  data-testid="input-pdf-email"
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pdf-mobile" className="text-navy font-medium text-sm">
                  Mobile Number
                </Label>
                <Input
                  id="pdf-mobile"
                  type="tel"
                  placeholder="+44 7..."
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  disabled={isSubmitting}
                  data-testid="input-pdf-mobile"
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
}

function AudioCoursePaymentForm({ 
  onPaymentSuccess, 
  onPaymentError, 
  customerData,
  clientSecret 
}: {
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
  customerData: { firstName: string; lastName: string; email: string; mobile: string };
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
    
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !mobile.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
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
                Thank you for your purchase! You will receive an email shortly with the link to access the "From Strong to Soft & Light in 28 Days" full course and the Dan Bizzarro Method Hub.
              </DialogDescription>
            </DialogHeader>
            
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
                customerData={{ firstName, lastName, email, mobile }}
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
                    Name
                  </Label>
                  <Input
                    id="audio-firstName"
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isSubmitting}
                    data-testid="input-audio-firstname"
                    className="border-gray-300"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="audio-lastName" className="text-navy font-medium text-sm">
                    Surname
                  </Label>
                  <Input
                    id="audio-lastName"
                    type="text"
                    placeholder="Surname"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isSubmitting}
                    data-testid="input-audio-lastname"
                    className="border-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="audio-email" className="text-navy font-medium text-sm">
                  Email Address
                </Label>
                <Input
                  id="audio-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  data-testid="input-audio-email"
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="audio-mobile" className="text-navy font-medium text-sm">
                  Mobile Number
                </Label>
                <Input
                  id="audio-mobile"
                  type="tel"
                  placeholder="+44 7..."
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  disabled={isSubmitting}
                  data-testid="input-audio-mobile"
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
      "Coaching that explains what to feel, not just what to do",
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
    buttonText: "Apply for Private Mentorship"
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
        onClick={() => onSelect(tier.id)}
        className={`w-full py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg ${
          tier.highlighted 
            ? 'bg-orange hover:bg-orange-hover text-white' 
            : 'bg-navy hover:bg-navy/90 text-white'
        }`}
        data-testid={`button-buy-${tier.id}`}
      >
        {tier.buttonText}
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setMobile("");
    setShowSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !mobile.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
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
                  ? "I've received your application for Private Mentorship. I'll be in touch within 24 hours to discuss your goals and see if this is the right fit."
                  : "I've received your registration for the 28-Day Challenge. I'll send you all the details shortly!"}
              </DialogDescription>
            </DialogHeader>
            
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
                    First Name
                  </Label>
                  <Input
                    id="purchase-firstName"
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isSubmitting}
                    data-testid="input-purchase-firstname"
                    className="border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchase-lastName" className="text-navy font-medium text-sm">
                    Surname
                  </Label>
                  <Input
                    id="purchase-lastName"
                    type="text"
                    placeholder="Surname"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isSubmitting}
                    data-testid="input-purchase-lastname"
                    className="border-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchase-email" className="text-navy font-medium text-sm">
                  Email Address
                </Label>
                <Input
                  id="purchase-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  data-testid="input-purchase-email"
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchase-mobile" className="text-navy font-medium text-sm">
                  Mobile Number
                </Label>
                <Input
                  id="purchase-mobile"
                  type="tel"
                  placeholder="+44 7..."
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  disabled={isSubmitting}
                  data-testid="input-purchase-mobile"
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        title="Strong to Soft & Light - Choose Your Level of Support | Dan Bizzarro Method"
        description="Transform your strong, heavy or rushing horse with this proven audio course system. Choose from Self-Guided (£97), 28-Day Challenge (£147), or Private Mentorship (£997)."
        canonical="/courses/strong-horse-audio"
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
      {/* Hero Section */}
      <section className="relative min-h-[450px] sm:min-h-[400px] overflow-hidden mt-14 sm:mt-16 flex">
        <HeroPicture
          jpegSrc={strongHorseHero}
          webpSrc={strongHorseHero}
          alt="From strong to soft and light in 28 days - horse transformation"
          loading="eager"
          priority={true}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 flex-1 flex items-center justify-center text-center px-4 py-12 sm:py-16">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white mb-4">
              Strong to Soft & Light
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-6">
              Transform your horse in 28 days with audio coaching
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setShowAudioModal(true)}
                className="bg-orange hover:bg-orange-hover text-white font-semibold px-8 py-4 rounded-full transition duration-300 transform hover:scale-105 shadow-lg"
                data-testid="button-hero-free-lesson"
              >
                <Headphones className="mr-2 h-5 w-5" />
                Try a Free Lesson
              </Button>
              <a href="#pricing">
                <Button 
                  className="bg-white hover:bg-gray-100 text-navy font-semibold px-8 py-4 rounded-full transition duration-300 transform hover:scale-105 shadow-lg"
                  data-testid="button-hero-view-options"
                >
                  View Course Options
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
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
              <a href="https://danbizzarromethod.app.clientclub.net/courses/offers/9351549b-1244-4d3a-8b2e-eba9c6b42c3b" target="_blank" rel="noopener noreferrer">
                <Button 
                  className="bg-white text-navy hover:bg-gray-100 font-semibold py-4 px-8 text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  data-testid="button-cta-self-guided"
                >
                  Self-Guided — £97
                </Button>
              </a>
              <Button 
                onClick={() => handleTierSelect("guided-group")}
                className="bg-orange hover:bg-orange-hover text-white font-semibold py-4 px-8 text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                data-testid="button-cta-challenge"
              >
                28-Day Challenge — £147
              </Button>
              <Button 
                onClick={() => handleTierSelect("private-mentorship")}
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 font-semibold py-4 px-8 text-lg rounded-xl transition-all duration-300 hover:scale-105"
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
