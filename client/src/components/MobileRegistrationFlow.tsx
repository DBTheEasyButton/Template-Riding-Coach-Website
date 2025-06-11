import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { ClinicWithSessions, ClinicSession } from "@shared/schema";
import { ChevronLeft, ChevronRight, Calendar, MapPin, PoundSterling, Users, Clock, Check, CreditCard, User, Phone, Mail, Heart, AlertTriangle } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

interface MobileRegistrationFlowProps {
  clinic: ClinicWithSessions;
  isOpen: boolean;
  onClose: () => void;
}

interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  experienceLevel: string;
  horseName: string;
  specialRequests: string;
  emergencyContact: string;
  emergencyPhone: string;
  medicalConditions: string;
  agreeToTerms: boolean;
  paymentMethod: string;
}

const STEPS = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Experience", icon: Heart },
  { id: 3, title: "Emergency", icon: Phone },
  { id: 4, title: "Payment", icon: CreditCard }
];

// Payment Component
function MobilePaymentForm({ 
  onPaymentSuccess, 
  onPaymentError, 
  registrationData,
  clinic,
  selectedSessions,
  clientSecret 
}: {
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
  registrationData: RegistrationData;
  clinic: ClinicWithSessions;
  selectedSessions: number[];
  clientSecret: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/registration-success`,
        },
        redirect: 'if_required'
      });

      if (error) {
        onPaymentError(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onPaymentSuccess(paymentIntent.id);
      }
    } catch (error: any) {
      onPaymentError(error.message || 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <PaymentElement 
          options={{
            layout: 'tabs',
            paymentMethodOrder: ['card', 'apple_pay', 'google_pay']
          }}
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={!stripe || !elements || isProcessing}
        className="w-full h-12 text-lg font-semibold"
        size="lg"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </div>
        ) : (
          <>
            <CreditCard className="w-5 h-5 mr-2" />
            Complete Registration
          </>
        )}
      </Button>
    </form>
  );
}

export default function MobileRegistrationFlow({ clinic, isOpen, onClose }: MobileRegistrationFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSessions, setSelectedSessions] = useState<number[]>([]);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    experienceLevel: '',
    horseName: '',
    specialRequests: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalConditions: '',
    agreeToTerms: false,
    paymentMethod: 'debit_card'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Load saved client data
  useEffect(() => {
    if (isOpen) {
      const savedData = localStorage.getItem('clinicClientData');
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setRegistrationData(prev => ({ ...prev, ...parsed }));
        } catch (e) {
          console.error('Error loading saved data:', e);
        }
      }
    }
  }, [isOpen]);

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setErrors({});
      setClientSecret(null);
      if (clinic?.hasMultipleSessions && clinic?.sessions?.length > 0) {
        setSelectedSessions([]);
      }
    }
  }, [isOpen, clinic]);

  const createPaymentIntentMutation = useMutation({
    mutationFn: async () => {
      const payload = clinic?.hasMultipleSessions 
        ? { sessionIds: selectedSessions }
        : {};
      
      return await apiRequest('POST', `/api/clinics/${clinic?.id}/create-payment-intent`, payload);
    },
    onSuccess: (data: { clientSecret: string }) => {
      setClientSecret(data.clientSecret);
    },
    onError: (error) => {
      toast({
        title: "Payment setup failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registrationMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', `/api/clinics/${clinic?.id}/register`, data);
    },
    onSuccess: () => {
      // Save client data
      const clientDataToSave = {
        firstName: registrationData.firstName,
        lastName: registrationData.lastName,
        email: registrationData.email,
        phone: registrationData.phone,
        experienceLevel: registrationData.experienceLevel,
        horseName: registrationData.horseName,
        emergencyContact: registrationData.emergencyContact,
        emergencyPhone: registrationData.emergencyPhone,
        paymentMethod: registrationData.paymentMethod
      };
      localStorage.setItem('clinicClientData', JSON.stringify(clientDataToSave));
      
      toast({
        title: "Registration successful!",
        description: "Payment confirmed. You'll receive a confirmation email shortly.",
      });
      onClose();
      setClientSecret(null);
      queryClient.invalidateQueries({ queryKey: ['/api/clinics'] });
    },
    onError: (error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 1: // Personal Info
        if (!registrationData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!registrationData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!registrationData.email.trim()) newErrors.email = 'Email is required';
        if (!registrationData.phone.trim()) newErrors.phone = 'Phone number is required';
        break;
      
      case 2: // Experience
        if (!registrationData.experienceLevel) newErrors.experienceLevel = 'Experience level is required';
        if (!registrationData.horseName.trim()) newErrors.horseName = 'Horse name is required';
        break;
      
      case 3: // Emergency
        if (!registrationData.emergencyContact.trim()) newErrors.emergencyContact = 'Emergency contact is required';
        if (!registrationData.emergencyPhone.trim()) newErrors.emergencyPhone = 'Emergency phone is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep === 3) {
        // Moving to payment step - create payment intent
        createPaymentIntentMutation.mutate();
      }
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handlePaymentSuccess = (paymentIntentId: string) => {
    const finalData = {
      ...registrationData,
      paymentIntentId,
      sessionIds: clinic?.hasMultipleSessions ? selectedSessions : undefined
    };
    registrationMutation.mutate(finalData);
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment failed",
      description: error,
      variant: "destructive",
    });
  };

  const updateRegistrationData = (field: keyof RegistrationData, value: any) => {
    setRegistrationData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getTotalPrice = () => {
    if (clinic?.hasMultipleSessions && selectedSessions.length > 0) {
      return selectedSessions.reduce((total, sessionId) => {
        const session = clinic.sessions.find(s => s.id === sessionId);
        return total + (session?.price || 0);
      }, 0);
    }
    return clinic?.price || 0;
  };

  const formatPrice = (price: number) => {
    return `£${(price / 100).toFixed(0)}`;
  };

  const isRegistrationClosed = () => {
    if (!clinic?.entryClosingDate) return false;
    return new Date() > new Date(clinic.entryClosingDate);
  };

  if (isRegistrationClosed()) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md mx-4">
          <div className="text-center py-6">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Registration Closed</h3>
            <p className="text-gray-600 mb-4">
              Registration for this clinic has closed. Please contact us for waitlist availability.
            </p>
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-4 p-0 max-h-[90vh] overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <DialogTitle className="text-lg font-semibold">
            Quick Registration
          </DialogTitle>
          <p className="text-blue-100 text-sm">
            {clinic?.title}
          </p>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 shadow-sm
                    ${isActive ? 'bg-blue-600 text-white shadow-lg transform scale-110' : 
                      isCompleted ? 'bg-green-500 text-white shadow-md' : 
                      'bg-white text-gray-400 border-2 border-gray-200'}
                  `}>
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`
                      w-6 h-1 mx-2 rounded-full transition-all duration-300
                      ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'}
                    `} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">
              {STEPS.find(s => s.id === currentStep)?.title}
            </p>
            <p className="text-xs text-gray-500">
              Step {currentStep} of {STEPS.length}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto flex-1">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name *</Label>
                  <Input
                    id="firstName"
                    value={registrationData.firstName}
                    onChange={(e) => updateRegistrationData('firstName', e.target.value)}
                    className={`mt-2 h-12 text-base ${errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'} rounded-lg transition-colors`}
                    placeholder="Your first name"
                    autoComplete="given-name"
                  />
                  {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={registrationData.lastName}
                    onChange={(e) => updateRegistrationData('lastName', e.target.value)}
                    className={`mt-2 h-12 text-base ${errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'} rounded-lg transition-colors`}
                    placeholder="Your last name"
                    autoComplete="family-name"
                  />
                  {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={registrationData.email}
                  onChange={(e) => updateRegistrationData('email', e.target.value)}
                  className={`mt-2 h-12 text-base ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'} rounded-lg transition-colors`}
                  placeholder="your.email@example.com"
                  autoComplete="email"
                  inputMode="email"
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={registrationData.phone}
                  onChange={(e) => updateRegistrationData('phone', e.target.value)}
                  className={`mt-2 h-12 text-base ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'} rounded-lg transition-colors`}
                  placeholder="+44 7xxx xxx xxx"
                  autoComplete="tel"
                  inputMode="tel"
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <Label htmlFor="experienceLevel" className="text-sm font-medium text-gray-700">Experience Level *</Label>
                <Select 
                  value={registrationData.experienceLevel} 
                  onValueChange={(value) => updateRegistrationData('experienceLevel', value)}
                >
                  <SelectTrigger className={`mt-2 h-12 text-base ${errors.experienceLevel ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'} rounded-lg transition-colors`}>
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    <SelectItem value="beginner" className="h-12 text-base">🟢 Beginner</SelectItem>
                    <SelectItem value="intermediate" className="h-12 text-base">🟡 Intermediate</SelectItem>
                    <SelectItem value="advanced" className="h-12 text-base">🔴 Advanced</SelectItem>
                  </SelectContent>
                </Select>
                {errors.experienceLevel && <p className="text-xs text-red-500 mt-1">{errors.experienceLevel}</p>}
              </div>

              <div>
                <Label htmlFor="horseName" className="text-sm font-medium text-gray-700">Horse Name *</Label>
                <Input
                  id="horseName"
                  value={registrationData.horseName}
                  onChange={(e) => updateRegistrationData('horseName', e.target.value)}
                  className={`mt-2 h-12 text-base ${errors.horseName ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'} rounded-lg transition-colors`}
                  placeholder="Your horse's name"
                  autoComplete="off"
                />
                {errors.horseName && <p className="text-xs text-red-500 mt-1">{errors.horseName}</p>}
              </div>

              {clinic?.hasMultipleSessions && clinic?.sessions && clinic.sessions.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Select Sessions</Label>
                  <div className="mt-2 space-y-2">
                    {clinic.sessions.map((session) => (
                      <div key={session.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Checkbox
                          id={`session-${session.id}`}
                          checked={selectedSessions.includes(session.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedSessions(prev => [...prev, session.id]);
                            } else {
                              setSelectedSessions(prev => prev.filter(id => id !== session.id));
                            }
                          }}
                        />
                        <div className="flex-1">
                          <Label htmlFor={`session-${session.id}`} className="text-sm font-medium cursor-pointer">
                            {session.sessionName}
                          </Label>
                          <p className="text-xs text-gray-600">{formatPrice(session.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="specialRequests" className="text-sm font-medium text-gray-700">Special Requests</Label>
                <Textarea
                  id="specialRequests"
                  value={registrationData.specialRequests}
                  onChange={(e) => updateRegistrationData('specialRequests', e.target.value)}
                  className="mt-2 h-24 text-base border-gray-300 focus:border-blue-500 rounded-lg transition-colors resize-none"
                  placeholder="Any special requirements or requests..."
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="emergencyContact" className="text-sm font-medium">Emergency Contact Name *</Label>
                <Input
                  id="emergencyContact"
                  value={registrationData.emergencyContact}
                  onChange={(e) => updateRegistrationData('emergencyContact', e.target.value)}
                  className={`mt-1 ${errors.emergencyContact ? 'border-red-500' : ''}`}
                  placeholder="Emergency contact full name"
                />
                {errors.emergencyContact && <p className="text-xs text-red-500 mt-1">{errors.emergencyContact}</p>}
              </div>

              <div>
                <Label htmlFor="emergencyPhone" className="text-sm font-medium">Emergency Contact Phone *</Label>
                <Input
                  id="emergencyPhone"
                  type="tel"
                  value={registrationData.emergencyPhone}
                  onChange={(e) => updateRegistrationData('emergencyPhone', e.target.value)}
                  className={`mt-1 ${errors.emergencyPhone ? 'border-red-500' : ''}`}
                  placeholder="+44 7xxx xxx xxx"
                />
                {errors.emergencyPhone && <p className="text-xs text-red-500 mt-1">{errors.emergencyPhone}</p>}
              </div>

              <div>
                <Label htmlFor="medicalConditions" className="text-sm font-medium">Medical Conditions</Label>
                <Textarea
                  id="medicalConditions"
                  value={registrationData.medicalConditions}
                  onChange={(e) => updateRegistrationData('medicalConditions', e.target.value)}
                  className="mt-1 h-20"
                  placeholder="Any medical conditions we should know about..."
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agreeToTerms"
                    checked={registrationData.agreeToTerms}
                    onCheckedChange={(checked) => updateRegistrationData('agreeToTerms', checked)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="agreeToTerms" className="text-sm cursor-pointer">
                      I agree to the{' '}
                      <a href="/terms-and-conditions" target="_blank" className="text-blue-600 hover:underline">
                        Terms & Conditions
                      </a>{' '}
                      including email marketing consent and photography/video usage rights.
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              {/* Summary */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Registration Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Participant:</span>
                    <span className="font-medium">{registrationData.firstName} {registrationData.lastName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Horse:</span>
                    <span className="font-medium">{registrationData.horseName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Level:</span>
                    <Badge className="capitalize">{registrationData.experienceLevel}</Badge>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center font-semibold">
                      <span>Total:</span>
                      <span className="text-lg">{formatPrice(getTotalPrice())}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment */}
              {clientSecret && (
                <div>
                  <h3 className="font-medium mb-3">Payment Details</h3>
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <MobilePaymentForm
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentError={handlePaymentError}
                      registrationData={registrationData}
                      clinic={clinic}
                      selectedSessions={selectedSessions}
                      clientSecret={clientSecret}
                    />
                  </Elements>
                </div>
              )}

              {!clientSecret && createPaymentIntentMutation.isPending && (
                <div className="text-center py-4">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Setting up payment...</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        {currentStep < 4 && (
          <div className="px-6 py-4 border-t bg-gray-50 flex gap-3">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={prevStep}
                className="flex-1"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            )}
            
            <Button
              onClick={nextStep}
              disabled={currentStep === 3 && !registrationData.agreeToTerms}
              className="flex-1"
            >
              {currentStep === 3 ? 'Review & Pay' : 'Continue'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}