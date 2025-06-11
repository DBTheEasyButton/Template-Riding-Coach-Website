import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { ClinicWithSessions, ClinicSession } from "@shared/schema";
import { ChevronLeft, ChevronRight, Calendar, MapPin, PoundSterling, Users, Clock, Check, CreditCard, User, Phone, Mail, Zap, AlertTriangle, X } from "lucide-react";
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
  { id: 2, title: "Enter session", icon: Zap },
  { id: 3, title: "Emergency", icon: Phone },
  { id: 4, title: "Payment", icon: CreditCard }
];

export default function MobileRegistrationFlow({ clinic, isOpen, onClose }: MobileRegistrationFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSessions, setSelectedSessions] = useState<number[]>([]);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    experienceLevel: 'intermediate', // Default for mobile flow
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

  const updateRegistrationData = (field: keyof RegistrationData, value: string | boolean) => {
    setRegistrationData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!registrationData.firstName.trim()) newErrors.firstName = "First name required";
      if (!registrationData.lastName.trim()) newErrors.lastName = "Last name required";
      if (!registrationData.email.trim()) newErrors.email = "Email required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registrationData.email)) {
        newErrors.email = "Invalid email format";
      }
      if (!registrationData.phone.trim()) newErrors.phone = "Phone required";
    }
    
    if (step === 2) {
      if (!registrationData.horseName.trim()) newErrors.horseName = "Horse name required";
      if (clinic?.hasMultipleSessions && selectedSessions.length === 0) {
        newErrors.sessions = "Please select at least one session";
      }
    }
    
    if (step === 3) {
      if (!registrationData.emergencyContact.trim()) newErrors.emergencyContact = "Emergency contact required";
      if (!registrationData.emergencyPhone.trim()) newErrors.emergencyPhone = "Emergency phone required";
      if (!registrationData.agreeToTerms) newErrors.agreeToTerms = "You must agree to terms";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 3) {
        // Create payment intent
        createPaymentIntentMutation.mutate();
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Payment intent mutation
  const createPaymentIntentMutation = useMutation({
    mutationFn: async () => {
      const payload = clinic?.hasMultipleSessions 
        ? { sessionIds: selectedSessions }
        : {};
      
      return await apiRequest('POST', `/api/clinics/${clinic?.id}/create-payment-intent`, payload);
    },
    onSuccess: (data: { clientSecret: string }) => {
      setClientSecret(data.clientSecret);
      setCurrentStep(4);
    },
    onError: (error) => {
      toast({
        title: "Payment setup failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Registration mutation
  const registrationMutation = useMutation({
    mutationFn: async (paymentIntentId: string) => {
      const sessionId = clinic?.hasMultipleSessions && selectedSessions.length > 0 
        ? selectedSessions[0] 
        : undefined;

      return await apiRequest('POST', `/api/clinics/${clinic?.id}/register`, {
        paymentIntentId,
        clinicId: clinic?.id,
        sessionId,
        firstName: registrationData.firstName,
        lastName: registrationData.lastName,
        email: registrationData.email,
        phone: registrationData.phone,
        experienceLevel: registrationData.experienceLevel,
        horseName: registrationData.horseName || undefined,
        specialRequests: registrationData.specialRequests || undefined,
        emergencyContact: registrationData.emergencyContact,
        emergencyPhone: registrationData.emergencyPhone,
        medicalConditions: registrationData.medicalConditions || undefined,
        paymentMethod: registrationData.paymentMethod,
        agreeToTerms: registrationData.agreeToTerms,
      });
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

      queryClient.invalidateQueries({ queryKey: ['/api/clinics'] });
      toast({
        title: "Registration successful!",
        description: "You'll receive a confirmation email shortly.",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg w-full max-w-md max-h-[95vh] flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Quick Registration</h2>
            <p className="text-blue-100 text-sm">{clinic?.title}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50 border-b">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    isCompleted ? 'bg-green-500 text-white' :
                    isActive ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-sm text-gray-600 text-center font-medium">
            Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1]?.title}
          </p>
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
                  <div className="mt-3 space-y-3">
                    {clinic.sessions.map((session) => (
                      <div key={session.id} className="flex items-start space-x-3 p-3 border rounded-lg">
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
                            {session.title}
                          </Label>
                          <div className="text-xs text-gray-600 mt-1">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(session.date).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {session.startTime} - {session.endTime}
                              </span>
                              <span className="flex items-center gap-1">
                                <PoundSterling className="w-3 h-3" />
                                £{(session.price / 100).toFixed(0)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <Users className="w-3 h-3" />
                              {session.currentParticipants}/{session.maxParticipants} participants
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.sessions && <p className="text-xs text-red-500 mt-1">{errors.sessions}</p>}
                </div>
              )}
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
                {errors.agreeToTerms && <p className="text-xs text-red-500 mt-2">{errors.agreeToTerms}</p>}
              </div>
            </div>
          )}

          {currentStep === 4 && clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <MobilePaymentForm 
                onPaymentSuccess={(paymentIntentId) => registrationMutation.mutate(paymentIntentId)}
                onPaymentError={(error) => toast({ title: "Payment failed", description: error, variant: "destructive" })}
                registrationData={registrationData}
                clinic={clinic}
                selectedSessions={selectedSessions}
                clientSecret={clientSecret}
              />
            </Elements>
          )}
        </div>

        {/* Navigation */}
        {currentStep < 4 && (
          <div className="px-6 py-4 border-t bg-gray-50 flex gap-3 flex-shrink-0">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={prevStep}
                className="flex-1 h-12 text-base"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
            )}
            
            <Button
              onClick={nextStep}
              disabled={currentStep === 3 && !registrationData.agreeToTerms}
              className="flex-1 h-12 text-base font-semibold"
            >
              {currentStep === 3 ? 'Review & Pay' : 'Continue'}
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Payment form component
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
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-lg text-navy mb-2">Registration Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Participant:</span>
            <span>{registrationData.firstName} {registrationData.lastName}</span>
          </div>
          <div className="flex justify-between">
            <span>Horse:</span>
            <span>{registrationData.horseName}</span>
          </div>
          <div className="flex justify-between">
            <span>Clinic:</span>
            <span>{clinic.title}</span>
          </div>
          {clinic.hasMultipleSessions && selectedSessions.length > 0 && (
            <div className="flex justify-between">
              <span>Sessions:</span>
              <span>{selectedSessions.length} selected</span>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <PaymentElement />
        
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full bg-navy hover:bg-slate-800 text-white h-12 text-base font-semibold"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Complete Registration & Pay
            </>
          )}
        </Button>
      </form>
    </div>
  );
}