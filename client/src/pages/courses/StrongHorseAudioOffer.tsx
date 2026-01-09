import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, Mail, ChevronDown, ChevronUp, Headphones, Clock, Target, Users, Star, ArrowRight, CreditCard, AlertTriangle, Gift } from "lucide-react";
import { Link } from "wouter";
import SEOHead from "@/components/SEOHead";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HeroPicture from "@/components/HeroPicture";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements, ExpressCheckoutElement } from "@stripe/react-stripe-js";
import strongHorseHero from "@assets/From_THIS_(2)_1767410380848.png";

let stripePromiseCache: Promise<Stripe | null> | null = null;

async function getStripePromise(): Promise<Stripe | null> {
  if (stripePromiseCache) return stripePromiseCache;
  
  try {
    const response = await fetch('/api/config/stripe-key');
    if (!response.ok) return null;
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

function DiscountedPaymentForm({
  onPaymentSuccess,
  onPaymentError,
  customerData,
  clientSecret
}: {
  onPaymentSuccess: (intentId: string) => void;
  onPaymentError: (error: string) => void;
  customerData: { firstName: string; lastName: string; email: string; mobile: string };
  clientSecret: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentReady, setIsPaymentReady] = useState(false);
  const [showExpressCheckout, setShowExpressCheckout] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || isProcessing) return;

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/courses/strong-horse-audio-offer',
          receipt_email: customerData.email,
          payment_method_data: {
            billing_details: {
              name: `${customerData.firstName} ${customerData.lastName}`,
              email: customerData.email,
              phone: customerData.mobile,
            },
          },
        },
        redirect: 'if_required',
      });

      if (error) {
        onPaymentError(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onPaymentSuccess(paymentIntent.id);
      }
    } catch (err) {
      onPaymentError('An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {showExpressCheckout && (
        <div className="mb-4">
          <ExpressCheckoutElement 
            onConfirm={async (event) => {
              if (!stripe || !elements) return;
              const { error } = await stripe.confirmPayment({
                elements,
                clientSecret,
                confirmParams: {
                  return_url: window.location.origin + '/courses/strong-horse-audio-offer',
                },
              });
              if (error) {
                onPaymentError(error.message || 'Payment failed');
              }
            }}
            options={{
              paymentMethods: {
                applePay: 'auto',
                googlePay: 'auto',
              },
            }}
            onLoadError={() => setShowExpressCheckout(false)}
          />
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or pay with card</span>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <PaymentElement 
          onReady={() => setIsPaymentReady(true)}
          options={{
            layout: 'tabs',
            wallets: { applePay: 'never', googlePay: 'never' }
          }}
        />
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-green-700">
            <Gift className="h-4 w-4" />
            <span className="text-sm font-medium">25% discount applied — £72 (was £97)</span>
          </div>
        </div>
        
        <Button
          type="submit"
          disabled={!stripe || isProcessing || !isPaymentReady}
          className="w-full bg-navy hover:bg-slate-800 text-white py-3"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Pay £72 Now
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

function DiscountedPurchaseModal({ 
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
          discountCode: 'DAN25',
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment");
      }

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
              <Button variant="outline" onClick={handleClose} className="w-full">
                Close
              </Button>
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
              <DiscountedPaymentForm
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
            >
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
                  <Label htmlFor="offer-firstName" className="text-navy font-medium text-sm">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="offer-firstName"
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isSubmitting}
                    required
                    className="border-gray-300"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="offer-lastName" className="text-navy font-medium text-sm">
                    Surname <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="offer-lastName"
                    type="text"
                    placeholder="Surname"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isSubmitting}
                    required
                    className="border-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="offer-email" className="text-navy font-medium text-sm">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="offer-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  required
                  className="border-gray-300"
                />
                <p className="text-xs text-gray-500">Please double-check your email address is correct</p>
              </div>

              <div className="space-y-1">
                <Label htmlFor="offer-mobile" className="text-navy font-medium text-sm">
                  Mobile Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="offer-mobile"
                  type="tel"
                  placeholder="+44 7..."
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  disabled={isSubmitting}
                  required
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="offer-horseName" className="text-navy font-medium text-sm">
                  Your Horse's Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="offer-horseName"
                  type="text"
                  placeholder="Your horse's name"
                  value={horseName}
                  onChange={(e) => setHorseName(e.target.value)}
                  disabled={isSubmitting}
                  required
                  className="border-gray-300"
                />
              </div>

              <div className="flex items-start gap-2 pt-2">
                <Checkbox
                  id="offer-terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                  disabled={isSubmitting}
                  className="mt-0.5"
                />
                <label htmlFor="offer-terms" className="text-sm text-gray-600 leading-tight">
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
                        Please try again or contact us directly.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={loadStripeInstance}
                        className="mt-2 text-xs"
                        disabled={stripeLoading}
                      >
                        {stripeLoading ? 'Retrying...' : 'Try Again'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting || stripeLoading || stripeError}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Gift className="w-4 h-4 mr-2" />
                    Get Course for £72 (Save £25)
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

export default function StrongHorseAudioOffer() {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <SEOHead
        title="Special Offer - 25% OFF Audio Course | Dan Bizzarro Method"
        description="Exclusive offer: Get the 'From Strong to Light and Soft in 28 Days' audio course for £72 (was £97). Transform your horse's responsiveness with proven techniques."
        canonical="/courses/strong-horse-audio-offer"
      />
      <Navigation />
      
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden mt-14 sm:mt-16 bg-gradient-to-br from-navy via-navy to-[#1a365d]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Content */}
              <div>
                <span className="inline-block bg-green-500 text-white font-semibold text-sm px-4 py-1.5 rounded-full mb-6">
                  🎉 25% OFF — Just for You
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-white mb-4 leading-tight">
                  From Strong to Light and Soft{" "}
                  <span className="text-orange">(in 28 Days)</span>
                </h1>
                <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                  Ready to transform your horse's responsiveness? Get the complete 6-lesson audio course with your exclusive discount.
                </p>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange">6</div>
                    <div className="text-gray-400 text-sm">Audio Lessons</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange">28</div>
                    <div className="text-gray-400 text-sm">Day Program</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange">100+</div>
                    <div className="text-gray-400 text-sm">Riders Helped</div>
                  </div>
                </div>
              </div>

              {/* Right Card - Special Offer */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border-4 border-green-500">
                <div className="text-center mb-4">
                  <span className="inline-block bg-green-100 text-green-700 font-semibold text-sm px-3 py-1 rounded-full">
                    SPECIAL OFFER
                  </span>
                </div>
                <h2 className="text-2xl font-playfair font-bold text-navy text-center mb-4">
                  Your Exclusive Price
                </h2>
                
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl text-gray-400 line-through">£97</span>
                    <span className="text-4xl font-bold text-green-600">£72</span>
                  </div>
                  <p className="text-green-600 font-medium mt-2">Save £25 — 25% OFF</p>
                  <p className="text-sm text-gray-500 mt-1">Just for you</p>
                </div>
                
                <Button 
                  onClick={() => setShowPurchaseModal(true)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-lg transition duration-300 text-lg"
                >
                  <Gift className="mr-2 h-5 w-5" />
                  BUY FULL COURSE — £72
                </Button>
                
                <p className="text-center text-sm text-gray-500 mt-4">
                  Instant access • Lifetime course ownership
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What You'll Learn Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-playfair font-bold text-navy text-center mb-12">
              What You'll Learn
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: Target, title: "Light Contact Techniques", desc: "Stop the pulling and create soft, responsive communication" },
                { icon: Clock, title: "Daily Exercises", desc: "Simple 15-minute routines that build lasting change" },
                { icon: Star, title: "Balance & Self-Carriage", desc: "Help your horse carry themselves without leaning on you" },
                { icon: Users, title: "Proven Methods", desc: "The same techniques I use with elite competition horses" },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-orange/10 rounded-full flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-orange" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy mb-1">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Course Contents */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-playfair font-bold text-navy text-center mb-12">
              6 Audio Lessons Included
            </h2>
            
            <div className="space-y-4">
              {[
                "Lesson 1: Understanding Why Horses Pull",
                "Lesson 2: The Foundation of Light Contact",
                "Lesson 3: Half-Halts That Actually Work",
                "Lesson 4: Building Self-Carriage",
                "Lesson 5: Transitions That Transform",
                "Lesson 6: Putting It All Together",
              ].map((lesson, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
                  <div className="w-8 h-8 bg-orange rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-navy">{lesson}</p>
                  </div>
                  <Headphones className="h-5 w-5 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-green-600 to-green-700">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-playfair font-bold text-white mb-4">
              Don't Miss Your Exclusive Discount
            </h2>
            <p className="text-green-100 text-lg mb-8">
              Get the complete audio course for just £72 (normally £97). Start transforming your horse's responsiveness today.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <div className="text-center">
                <span className="text-2xl text-green-200 line-through">£97</span>
              </div>
              <div className="text-center">
                <span className="text-5xl font-bold text-white">£72</span>
              </div>
            </div>
            
            <Button 
              onClick={() => setShowPurchaseModal(true)}
              size="lg"
              className="bg-white text-green-700 hover:bg-gray-100 font-semibold text-lg px-8 py-4"
            >
              <Gift className="mr-2 h-5 w-5" />
              GET YOUR DISCOUNT NOW
            </Button>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-playfair font-bold text-navy text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <FAQItem 
                question="How do I access the course?" 
                answer="After purchase, you'll receive an email with a link to access all 6 audio lessons instantly. You can listen on any device, anytime."
              />
              <FAQItem 
                question="How long do I have access?" 
                answer="You have lifetime access to all the audio lessons. Listen as many times as you need."
              />
              <FAQItem 
                question="Is this suitable for my horse?" 
                answer="This course is designed for any horse that pulls, leans on the bit, or feels heavy in the hand. The techniques work for all disciplines and levels."
              />
              <FAQItem 
                question="What if I have questions?" 
                answer="You can contact me directly at dan@danbizzarromethod.com with any questions about the course content."
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <DiscountedPurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
      />
    </>
  );
}
