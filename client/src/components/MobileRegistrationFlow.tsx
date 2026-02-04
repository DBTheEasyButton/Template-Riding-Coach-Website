import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
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
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements, ExpressCheckoutElement } from "@stripe/react-stripe-js";
import PhoneNumberInput from "@/components/PhoneNumberInput";

// Runtime Stripe key loading - fetches from server instead of build-time env var
let stripePromiseCache: Promise<Stripe | null> | null = null;

async function getStripePromise(): Promise<Stripe | null> {
  if (stripePromiseCache) return stripePromiseCache;
  
  try {
    const response = await fetch('/api/config/stripe-key');
    if (!response.ok) {
      console.error('Failed to fetch Stripe key');
      return null;
    }
    const data = await response.json();
    if (data.publishableKey) {
      stripePromiseCache = loadStripe(data.publishableKey);
      return stripePromiseCache;
    }
  } catch (error) {
    console.error('Error fetching Stripe key:', error);
  }
  return null;
}

// Helper function to sort sessions by difficulty (easiest first)
function sortSessionsByDifficulty(sessions: ClinicSession[]): ClinicSession[] {
  const difficultyOrder: Record<string, number> = {
    // Height-based levels (jumping)
    '70cm': 1,
    '70cm/80cm': 2,
    '80cm': 3,
    '90cm': 4,
    '1m': 5,
    '100cm': 5,
    '1.10m': 6,
    '110cm': 6,
    '1.20m': 7,
    '120cm': 7,
    // Text-based levels
    'beginner': 1,
    'novice': 2,
    'intermediate': 3,
    'experienced': 4,
    'advanced': 5,
  };
  
  return [...sessions].sort((a, b) => {
    const aLevel = (a.skillLevel || '').toLowerCase();
    const bLevel = (b.skillLevel || '').toLowerCase();
    const aOrder = difficultyOrder[aLevel] ?? 99;
    const bOrder = difficultyOrder[bLevel] ?? 99;
    return aOrder - bOrder;
  });
}

interface MobileRegistrationFlowProps {
  clinic: ClinicWithSessions;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  horseName: string;
  skillLevel: string;
  specialRequests: string;
  emergencyContact: string;
  emergencyPhone: string;
  medicalConditions: string;
  agreeToTerms: boolean;
  paymentMethod: string;
  discountCode?: string;
  referralCode?: string;
  isBookingForOther?: boolean;
  otherRiderFirstName?: string;
  otherRiderLastName?: string;
  otherRiderHorseName?: string;
  otherRiderSkillLevel?: string;
  isAdditionalHorse?: boolean;
  gapPreference?: 'back_to_back' | 'one_session_gap';
}

interface AdditionalEntry {
  type: 'same_rider_different_horse' | 'same_horse_different_session';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  horseName: string;
  horseInfo: string;
  skillLevel: string;
  emergencyContact: string;
  emergencyPhone: string;
  gapPreference?: 'back_to_back' | 'one_session_gap';
  timePreference?: string;
  selectedSessionId?: number;
}

const STEPS = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Enter session", icon: Zap },
  { id: 3, title: "Emergency", icon: Phone },
  { id: 4, title: "Review", icon: Users },
  { id: 5, title: "Payment", icon: CreditCard }
];

export default function MobileRegistrationFlow({ clinic, isOpen, onClose, onSuccess }: MobileRegistrationFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSessions, setSelectedSessions] = useState<number[]>([]);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [isStripeLoading, setIsStripeLoading] = useState(false);
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    horseName: '',
    skillLevel: '',
    specialRequests: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalConditions: '',
    agreeToTerms: false,
    paymentMethod: 'debit_card'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLookingUpEmail, setIsLookingUpEmail] = useState(false);
  const [isValidatingReferral, setIsValidatingReferral] = useState(false);
  const [referralValidation, setReferralValidation] = useState<{ valid: boolean; message?: string } | null>(null);
  const [hasSavedData, setHasSavedData] = useState(false);
  const [savedFirstName, setSavedFirstName] = useState('');
  const [emailChecked, setEmailChecked] = useState(false);
  
  // Multi-entry state
  const [additionalEntries, setAdditionalEntries] = useState<AdditionalEntry[]>([]);
  const [showAddEntryDialog, setShowAddEntryDialog] = useState(false);
  const [addingEntryType, setAddingEntryType] = useState<'same_rider_different_horse' | 'same_horse_different_session' | null>(null);
  const [newEntryData, setNewEntryData] = useState<Partial<AdditionalEntry>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Reset multi-entry state when modal closes or reopens
  useEffect(() => {
    if (!isOpen) {
      setAdditionalEntries([]);
      setShowAddEntryDialog(false);
      setAddingEntryType(null);
      setNewEntryData({});
      setCurrentStep(1);
      setClientSecret(null);
      setErrors({});
    }
  }, [isOpen]);

  // Auto-fill data lookup by email
  const lookupByEmail = async (email: string) => {
    if (!email || !email.includes('@')) return;
    
    setIsLookingUpEmail(true);
    try {
      const response = await fetch(`/api/clinics/lookup-by-email/${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        setRegistrationData(prev => ({
          ...prev,
          firstName: data.firstName || prev.firstName,
          lastName: data.lastName || prev.lastName,
          phone: data.phone || prev.phone,
          horseName: data.horseName || prev.horseName,
          emergencyContact: data.emergencyContact || prev.emergencyContact,
          emergencyPhone: data.emergencyPhone || prev.emergencyPhone,
          medicalConditions: data.medicalConditions || prev.medicalConditions
        }));
        if (data.firstName) {
          setHasSavedData(true);
          setSavedFirstName(data.firstName);
        }
      }
      setEmailChecked(true); // Mark that we've checked this email
    } catch (error) {
      // Silently fail - it just means no previous registration
      setEmailChecked(true); // Still mark as checked even on error
    } finally {
      setIsLookingUpEmail(false);
    }
  };

  // Debounced email lookup - triggers as user types
  useEffect(() => {
    const email = registrationData.email?.trim();
    if (!email || !email.includes('@') || email.length < 5) return;
    
    const timeoutId = setTimeout(() => {
      lookupByEmail(email);
    }, 500); // 500ms debounce
    
    return () => clearTimeout(timeoutId);
  }, [registrationData.email]);

  // Validate referral code
  const validateReferralCode = async (code: string) => {
    if (!code || code.trim().length === 0) {
      setReferralValidation(null);
      return;
    }

    setIsValidatingReferral(true);
    try {
      const response = await fetch('/api/loyalty/referral/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referralCode: code.trim() })
      });

      const data = await response.json();
      
      if (data.valid) {
        setReferralValidation({ valid: true, message: 'Valid referral code!' });
      } else {
        setReferralValidation({ valid: false, message: 'Invalid referral code' });
      }
    } catch (error) {
      setReferralValidation({ valid: false, message: 'Error validating code' });
    } finally {
      setIsValidatingReferral(false);
    }
  };

  // Load saved client data
  useEffect(() => {
    if (isOpen) {
      const savedData = localStorage.getItem('clinicClientData');
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setRegistrationData(prev => ({ ...prev, ...parsed }));
          if (parsed.firstName) {
            setHasSavedData(true);
            setSavedFirstName(parsed.firstName);
          }
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

  // Load Stripe at runtime - start loading immediately when modal opens
  useEffect(() => {
    if (isOpen && !stripePromise && !isStripeLoading) {
      setIsStripeLoading(true);
      console.log('[MobileRegistrationFlow] Loading Stripe...');
      getStripePromise().then(promise => {
        console.log('[MobileRegistrationFlow] Stripe loaded:', !!promise);
        if (promise) {
          setStripePromise(Promise.resolve(promise));
        }
        setIsStripeLoading(false);
      }).catch(err => {
        console.error('[MobileRegistrationFlow] Stripe load error:', err);
        setIsStripeLoading(false);
      });
    }
  }, [isOpen, stripePromise, isStripeLoading]);

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
      if (registrationData.isBookingForOther) {
        if (!registrationData.otherRiderFirstName?.trim()) newErrors.otherRiderFirstName = "First name required";
        if (!registrationData.otherRiderLastName?.trim()) newErrors.otherRiderLastName = "Last name required";
        if (!registrationData.otherRiderHorseName?.trim()) newErrors.otherRiderHorseName = "Horse name required";
      }
      if (registrationData.isAdditionalHorse && !registrationData.gapPreference) {
        newErrors.gapPreference = "Please select how you'd like your sessions scheduled";
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
      if (currentStep === 4) {
        // Create payment intent after Review step
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
      const sessionId = clinic?.hasMultipleSessions && selectedSessions.length > 0 
        ? selectedSessions[0] 
        : undefined;

      const payload: Record<string, unknown> = {
        sessionIds: clinic?.hasMultipleSessions ? selectedSessions : undefined,
        discountCode: registrationData.discountCode || undefined,
        registrationData: {
          firstName: registrationData.firstName,
          lastName: registrationData.lastName,
          email: registrationData.email,
          phone: registrationData.phone,
          horseName: registrationData.horseName || undefined,
          skillLevel: registrationData.skillLevel || undefined,
          specialRequests: registrationData.specialRequests || undefined,
          emergencyContact: registrationData.emergencyContact,
          emergencyPhone: registrationData.emergencyPhone,
          medicalConditions: registrationData.medicalConditions || undefined,
          paymentMethod: registrationData.paymentMethod,
          agreeToTerms: registrationData.agreeToTerms,
          referralCode: registrationData.referralCode || undefined,
          sessionId: sessionId
        },
        additionalEntries: additionalEntries.length > 0 ? additionalEntries : undefined
      };
      
      return await apiRequest('POST', `/api/clinics/${clinic?.id}/create-payment-intent`, payload);
    },
    onSuccess: (data: { clientSecret: string }) => {
      setClientSecret(data.clientSecret);
      setCurrentStep(5);
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
        horseName: registrationData.horseName || undefined,
        skillLevel: registrationData.skillLevel || undefined,
        specialRequests: registrationData.specialRequests || undefined,
        emergencyContact: registrationData.emergencyContact,
        emergencyPhone: registrationData.emergencyPhone,
        medicalConditions: registrationData.medicalConditions || undefined,
        paymentMethod: registrationData.paymentMethod,
        agreeToTerms: registrationData.agreeToTerms,
        referralCode: registrationData.referralCode || undefined,
        additionalEntries: additionalEntries.length > 0 ? additionalEntries : undefined,
      });
    },
    onSuccess: () => {
      // Save client data
      const clientDataToSave = {
        firstName: registrationData.firstName,
        lastName: registrationData.lastName,
        email: registrationData.email,
        phone: registrationData.phone,
        horseName: registrationData.horseName,
        emergencyContact: registrationData.emergencyContact,
        emergencyPhone: registrationData.emergencyPhone,
        paymentMethod: registrationData.paymentMethod
      };
      localStorage.setItem('clinicClientData', JSON.stringify(clientDataToSave));

      queryClient.invalidateQueries({ queryKey: ['/api/clinics'] });
      onClose();
      if (onSuccess) {
        onSuccess();
      }
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
      className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-2 overflow-hidden"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg w-full max-w-md max-h-[90vh] flex flex-col shadow-xl overflow-hidden"
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
        <div className="px-4 py-3 bg-gray-50 border-b">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium ${
                    isCompleted ? 'bg-green-500 text-white' :
                    isActive ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {isCompleted ? <Check className="w-3 h-3" /> : <Icon className="w-3 h-3" />}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`w-4 sm:w-6 h-0.5 mx-1 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-600 text-center font-medium">
            Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1]?.title}
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto flex-1">
          {currentStep === 1 && (
            <div className="space-y-4">
              {hasSavedData && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center text-green-800">
                    <Check className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-sm font-medium">Hi {savedFirstName || 'there'}! Your details have been pre-filled from your last registration</span>
                  </div>
                </div>
              )}
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
                  onBlur={(e) => {
                    const email = e.target.value.trim();
                    if (email && email.includes('@')) {
                      lookupByEmail(email);
                    }
                  }}
                  className={`mt-2 h-12 text-base ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'} rounded-lg transition-colors`}
                  placeholder="your.email@example.com"
                  autoComplete="email"
                  inputMode="email"
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number *</Label>
                <div className={`mt-2 ${errors.phone ? '[&_input]:border-red-500 [&_input]:bg-red-50' : ''}`}>
                  <PhoneNumberInput
                    id="phone"
                    value={registrationData.phone}
                    onChange={(value) => updateRegistrationData('phone', value)}
                    data-testid="input-phone"
                  />
                </div>
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>

              {/* Referral Code - Only show for confirmed new clients (after email check) */}
              {emailChecked && !hasSavedData && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <Label htmlFor="referralCode" className="text-sm font-semibold text-gray-800">Referred by a friend? Enter their code!</Label>
                <p className="text-xs text-gray-700 mt-1 mb-2">
                  They'll earn 20 bonus points and you'll start earning points too.
                </p>
                <div className="relative">
                  <Input
                    id="referralCode"
                    data-testid="input-referral-code"
                    value={registrationData.referralCode || ''}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase();
                      updateRegistrationData('referralCode', value);
                      setReferralValidation(null);
                    }}
                    onBlur={(e) => {
                      const code = e.target.value.trim();
                      if (code) {
                        validateReferralCode(code);
                      }
                    }}
                    placeholder="DBM-XXXXX"
                    className={`mt-1 h-12 text-base ${
                      referralValidation?.valid === false ? 'border-red-500 bg-red-50' : 
                      referralValidation?.valid === true ? 'border-green-500 bg-green-50' : ''
                    }`}
                  />
                  {isValidatingReferral && (
                    <div className="absolute right-3 top-4">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </div>
                {referralValidation && (
                  <p className={`text-xs mt-2 flex items-center gap-1 ${
                    referralValidation.valid ? 'text-green-600' : 'text-red-600'
                  }`} data-testid="referral-validation-message">
                    {referralValidation.valid ? (
                      <>
                        <Check className="w-3 h-3" />
                        {referralValidation.message}
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3 h-3" />
                        {referralValidation.message}
                      </>
                    )}
                  </p>
                )}
              </div>
              )}
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
                    {sortSessionsByDifficulty(clinic.sessions).map((session) => (
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
                            {session.sessionName}
                          </Label>
                          <div className="text-xs text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <PoundSterling className="w-3 h-3" />
                              {(session.price / 100).toFixed(0)}
                            </span>
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
                <div className={`mt-1 ${errors.emergencyPhone ? '[&_input]:border-red-500' : ''}`}>
                  <PhoneNumberInput
                    id="emergencyPhone"
                    value={registrationData.emergencyPhone}
                    onChange={(value) => updateRegistrationData('emergencyPhone', value)}
                    data-testid="input-emergency-phone"
                  />
                </div>
                {errors.emergencyPhone && <p className="text-xs text-red-500 mt-1">{errors.emergencyPhone}</p>}
              </div>

              <div>
                <Label htmlFor="specialRequests" className="text-sm font-medium">Special Requests</Label>
                <Textarea
                  id="specialRequests"
                  value={registrationData.specialRequests}
                  onChange={(e) => updateRegistrationData('specialRequests', e.target.value)}
                  className="mt-1 h-20"
                  placeholder="Please include your preferred session times and any specific goals or requests..."
                />
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
                    data-testid="checkbox-agree-to-terms"
                  />
                  <div className="flex-1">
                    <Label htmlFor="agreeToTerms" className="text-sm cursor-pointer leading-relaxed">
                      I have read and agree to the{' '}
                      <a href="/terms-and-conditions" target="_blank" className="text-blue-600 hover:underline">
                        Clinic Terms and Conditions
                      </a>
                    </Label>
                  </div>
                </div>
                {errors.agreeToTerms && <p className="text-xs text-red-500 mt-2">{errors.agreeToTerms}</p>}
              </div>
            </div>
          )}

          {/* Step 4: Review & Add More Entries */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-3">Your Entries</h3>
                
                {/* Primary Entry */}
                <div className="bg-white p-3 rounded-lg mb-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{registrationData.firstName} {registrationData.lastName}</p>
                      <p className="text-sm text-gray-600">Horse: {registrationData.horseName}</p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Primary</span>
                  </div>
                </div>
                
                {/* Additional Entries */}
                {additionalEntries.map((entry, index) => {
                  const entrySession = entry.selectedSessionId 
                    ? clinic?.sessions?.find(s => s.id === entry.selectedSessionId) 
                    : null;
                  return (
                  <div key={index} className="bg-white p-3 rounded-lg mb-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{entry.firstName} {entry.lastName}</p>
                        <p className="text-sm text-gray-600">Horse: {entry.horseName}</p>
                        {entrySession && (
                          <p className="text-xs text-purple-600 font-medium">
                            {entrySession.discipline} - {entrySession.skillLevel}
                          </p>
                        )}
                        {entry.timePreference && (
                          <p className="text-xs text-green-600">Preferred time: {entry.timePreference}</p>
                        )}
                        {entry.gapPreference && (
                          <p className="text-xs text-blue-600">
                            {entry.gapPreference === 'back_to_back' ? 'Back-to-back' : 'One session gap'}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                          {entry.type === 'same_horse_different_session' ? 'Same Horse' : 'Different Horse'}
                        </span>
                        <button
                          onClick={() => setAdditionalEntries(prev => prev.filter((_, i) => i !== index))}
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                  );
                })}
                
                {/* Add Another Entry Button */}
                <button
                  onClick={() => setShowAddEntryDialog(true)}
                  className="w-full py-3 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Users className="w-5 h-5" />
                  Add Another Entry
                </button>
              </div>
              
              {/* Add Entry Dialog */}
              {showAddEntryDialog && !addingEntryType && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-xl p-6 max-w-sm w-full">
                    <h3 className="text-lg font-semibold mb-4">Add Another Entry</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          setAddingEntryType('same_horse_different_session');
                          setNewEntryData({
                            type: 'same_horse_different_session',
                            firstName: registrationData.firstName,
                            lastName: registrationData.lastName,
                            email: registrationData.email,
                            phone: registrationData.phone,
                            emergencyContact: registrationData.emergencyContact,
                            emergencyPhone: registrationData.emergencyPhone,
                            horseName: registrationData.horseName,
                            horseInfo: '',
                            skillLevel: ''
                          });
                        }}
                        className="w-full p-4 border rounded-lg hover:bg-green-50 text-left"
                      >
                        <p className="font-medium text-gray-900">Same horse, another session</p>
                        <p className="text-sm text-gray-600">Enter {registrationData.horseName || 'this horse'} in a different class</p>
                      </button>
                      <button
                        onClick={() => {
                          setAddingEntryType('same_rider_different_horse');
                          setNewEntryData({
                            type: 'same_rider_different_horse',
                            firstName: registrationData.firstName,
                            lastName: registrationData.lastName,
                            email: registrationData.email,
                            phone: registrationData.phone,
                            emergencyContact: registrationData.emergencyContact,
                            emergencyPhone: registrationData.emergencyPhone,
                            horseName: '',
                            horseInfo: '',
                            skillLevel: ''
                          });
                        }}
                        className="w-full p-4 border rounded-lg hover:bg-blue-50 text-left"
                      >
                        <p className="font-medium text-gray-900">Different horse</p>
                        <p className="text-sm text-gray-600">Enter with another horse in any session</p>
                      </button>
                    </div>
                    <button
                      onClick={() => setShowAddEntryDialog(false)}
                      className="w-full mt-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              
              {/* Entry Form Dialog */}
              {showAddEntryDialog && addingEntryType && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                  <div className="bg-white rounded-xl p-6 max-w-md w-full my-4">
                    <h3 className="text-lg font-semibold mb-4">
                      {addingEntryType === 'same_horse_different_session' 
                        ? `Add ${registrationData.horseName || 'Same Horse'} to Another Session`
                        : 'Add Another Horse'}
                    </h3>
                    
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                      {/* Only show horse name field for different horse entries */}
                      {addingEntryType === 'same_rider_different_horse' && (
                        <>
                          <div>
                            <Label className="text-xs">Horse Name *</Label>
                            <Input
                              value={newEntryData.horseName || ''}
                              onChange={(e) => setNewEntryData(prev => ({ ...prev, horseName: e.target.value }))}
                              placeholder="Horse name"
                            />
                          </div>
                          
                          <div>
                            <Label className="text-xs">Info About This Horse</Label>
                            <Textarea
                              value={newEntryData.horseInfo || ''}
                              onChange={(e) => setNewEntryData(prev => ({ ...prev, horseInfo: e.target.value }))}
                              placeholder="Age, breed, temperament, experience level..."
                              rows={2}
                            />
                          </div>
                        </>
                      )}
                      
                      {/* For same horse entries, show which horse is being entered */}
                      {addingEntryType === 'same_horse_different_session' && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm text-green-800">
                            <strong>Horse:</strong> {registrationData.horseName}
                          </p>
                        </div>
                      )}
                      
                      {/* Session selection - show all options for both entry types */}
                      {clinic?.hasMultipleSessions && clinic.sessions && clinic.sessions.length > 0 && (
                        <div>
                          <Label className="text-xs">Select Session (Category & Level) *</Label>
                          <select
                            value={newEntryData.selectedSessionId || ''}
                            onChange={(e) => {
                              const sessionId = parseInt(e.target.value);
                              const session = clinic.sessions?.find(s => s.id === sessionId);
                              setNewEntryData(prev => ({ 
                                ...prev, 
                                selectedSessionId: sessionId,
                                skillLevel: session ? `${session.discipline} - ${session.skillLevel}` : ''
                              }));
                            }}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
                          >
                            <option value="">Choose a session...</option>
                            {clinic.sessions.map((session) => (
                              <option key={session.id} value={session.id}>
                                {session.discipline} - {session.skillLevel} (£{(session.price / 100).toFixed(0)})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      
                      {/* Gap preference - shown for all entries since same rider is doing multiple sessions */}
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <Label className="text-xs font-medium text-blue-800">Session Scheduling Preference *</Label>
                        <p className="text-xs text-blue-600 mt-1 mb-2">
                          {addingEntryType === 'same_horse_different_session' 
                            ? 'How would you like your sessions scheduled?'
                            : 'How would you like your rides scheduled?'}
                        </p>
                        <div className="mt-2 space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="gapPreference"
                              value="back_to_back"
                              checked={newEntryData.gapPreference === 'back_to_back'}
                              onChange={() => setNewEntryData(prev => ({ ...prev, gapPreference: 'back_to_back' }))}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">Back-to-back sessions</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="gapPreference"
                              value="one_session_gap"
                              checked={newEntryData.gapPreference === 'one_session_gap'}
                              onChange={() => setNewEntryData(prev => ({ ...prev, gapPreference: 'one_session_gap' }))}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">
                              {addingEntryType === 'same_horse_different_session'
                                ? 'Gap between sessions (rest for horse)'
                                : 'One session gap between horses'}
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => {
                          setShowAddEntryDialog(false);
                          setAddingEntryType(null);
                          setNewEntryData({});
                        }}
                        className="flex-1 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          // Validate and add entry
                          if (addingEntryType === 'same_rider_different_horse' && !newEntryData.horseName) {
                            toast({ title: "Please enter the horse's name", variant: "destructive" });
                            return;
                          }
                          if (clinic?.hasMultipleSessions && !newEntryData.selectedSessionId) {
                            toast({ title: "Please select a session (category & level)", variant: "destructive" });
                            return;
                          }
                          if (!newEntryData.gapPreference) {
                            toast({ title: "Please select your session scheduling preference", variant: "destructive" });
                            return;
                          }
                          
                          setAdditionalEntries(prev => [...prev, newEntryData as AdditionalEntry]);
                          setShowAddEntryDialog(false);
                          setAddingEntryType(null);
                          setNewEntryData({});
                          toast({ title: "Entry added successfully" });
                        }}
                        className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Add Entry
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Price Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                {(() => {
                  const primaryPrice = clinic?.hasMultipleSessions && selectedSessions.length > 0
                    ? selectedSessions.reduce((sum, sessionId) => {
                        const session = clinic.sessions?.find(s => s.id === sessionId);
                        return sum + (session?.price || 0);
                      }, 0) / 100
                    : (clinic?.price || 0) / 100;
                  
                  const additionalEntriesPrice = additionalEntries.reduce((sum, entry) => {
                    if (entry.selectedSessionId && clinic?.sessions) {
                      const session = clinic.sessions.find(s => s.id === entry.selectedSessionId);
                      return sum + ((session?.price || clinic?.price || 0) / 100);
                    }
                    return sum + primaryPrice;
                  }, 0);
                  
                  const totalPrice = primaryPrice + additionalEntriesPrice;
                  const totalEntries = 1 + additionalEntries.length;
                  
                  return (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Total Entries:</span>
                        <span className="font-semibold">{totalEntries}</span>
                      </div>
                      {totalEntries === 1 ? (
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-gray-700">Session Price:</span>
                          <span className="font-semibold">£{primaryPrice.toFixed(0)}</span>
                        </div>
                      ) : (
                        <>
                          <div className="text-xs text-gray-600 mt-2 space-y-1">
                            <div className="flex justify-between">
                              <span>Primary entry:</span>
                              <span>£{primaryPrice.toFixed(0)}</span>
                            </div>
                            {additionalEntries.map((entry, idx) => {
                              const entrySession = clinic?.sessions?.find(s => s.id === entry.selectedSessionId);
                              const entryPrice = entrySession ? (entrySession.price / 100) : primaryPrice;
                              return (
                                <div key={idx} className="flex justify-between">
                                  <span>{entry.horseName} ({entrySession?.skillLevel || 'Session'}):</span>
                                  <span>£{entryPrice.toFixed(0)}</span>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}
                      <div className="border-t mt-3 pt-3 flex justify-between items-center">
                        <span className="font-semibold text-gray-900">Total:</span>
                        <span className="font-bold text-lg text-blue-600">£{totalPrice.toFixed(0)}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Step 5: Payment */}
          {currentStep === 5 && (
            <div className="space-y-6">
              {/* Discount Code Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <Label htmlFor="discountCode" className="text-sm font-medium">Discount Code (Optional)</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="discountCode"
                    value={registrationData.discountCode || ''}
                    onChange={(e) => updateRegistrationData('discountCode', e.target.value)}
                    placeholder="Enter discount code"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      const code = registrationData.discountCode?.trim();
                      if (!code) {
                        toast({ title: "Please enter a discount code", variant: "destructive" });
                        return;
                      }
                      

                      
                      try {
                        const response = await fetch('/api/loyalty/discount/validate', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            email: registrationData.email,
                            discountCode: code
                          })
                        });
                        
                        if (response.ok) {
                          const result = await response.json();
                          toast({ 
                            title: "Discount applied!", 
                            description: result.message
                          });
                        } else {
                          const error = await response.json();
                          toast({ 
                            title: "Discount not available", 
                            description: error.message, 
                            variant: "destructive" 
                          });
                        }
                      } catch (error) {
                        toast({ title: "Error validating discount code", variant: "destructive" });
                      }
                    }}
                  >
                    Apply
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Have a discount code? Enter it here to save on your registration.
                </p>
              </div>

              {/* Payment Section */}
              {clientSecret && stripePromise && (
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
              {clientSecret && !stripePromise && isStripeLoading && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                    Loading payment system...
                  </div>
                </div>
              )}
              {clientSecret && !stripePromise && !isStripeLoading && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                  <AlertTriangle className="w-5 h-5 inline mr-2" />
                  Payment system is not configured. Please contact support.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        {currentStep < 5 && (
          <div className="px-6 py-4 border-t bg-gray-50 flex gap-3 flex-shrink-0">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={prevStep}
                className="flex-1 h-12 text-base"
                data-testid="button-prev-step"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
            )}
            
            <Button
              onClick={nextStep}
              disabled={currentStep === 3 && !registrationData.agreeToTerms}
              className="flex-1 h-12 text-base font-semibold"
              data-testid="button-next-step"
            >
              {currentStep === 3 ? 'Review Entries' : currentStep === 4 ? 'Proceed to Payment' : 'Continue'}
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
  const [isPaymentReady, setIsPaymentReady] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Log Stripe readiness for debugging
  useEffect(() => {
    console.log('[MobilePaymentForm] Stripe ready:', !!stripe, 'Elements ready:', !!elements);
  }, [stripe, elements]);

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

  const handleExpressCheckout = async (event: any) => {
    const { complete, error } = event;
    
    if (error) {
      onPaymentError(error.message || 'Express payment failed');
      return;
    }

    if (complete) {
      // Extract payment intent ID from client secret for express payment success
      const paymentIntentId = clientSecret.split('_secret_')[0];
      onPaymentSuccess(paymentIntentId);
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

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center text-blue-800 mb-2">
          <CreditCard className="w-5 h-5 mr-2" />
          <span className="font-semibold">Secure Payment</span>
        </div>
        <p className="text-sm text-blue-700">
          Complete your registration with secure payment. All payments processed through Dan's Stripe account.
        </p>
      </div>

      {/* Express Checkout (Apple Pay, Google Pay) */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-900">Quick Payment</h4>
        <ExpressCheckoutElement
          onConfirm={handleExpressCheckout}
          options={{
            buttonType: {
              applePay: 'book',
              googlePay: 'book'
            }
          }}
        />
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">Or pay with card</span>
        </div>
      </div>

      {/* Regular Card Payment */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {paymentError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-sm">
            <AlertTriangle className="w-4 h-4 inline mr-2" />
            {paymentError}
          </div>
        )}
        
        {!isPaymentReady && !paymentError && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-600">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-3"></div>
              Loading payment form...
            </div>
          </div>
        )}
        
        <div className={!isPaymentReady ? 'opacity-0 h-0 overflow-hidden' : ''}>
          <PaymentElement 
            options={{
              layout: 'tabs'
            }}
            onReady={() => {
              console.log('[MobilePaymentForm] PaymentElement ready');
              setIsPaymentReady(true);
              setPaymentError(null);
            }}
            onLoadError={(error) => {
              console.error('[MobilePaymentForm] PaymentElement load error:', error);
              setPaymentError(error.error?.message || 'Failed to load payment form. Please refresh the page.');
            }}
          />
        </div>
        
        <Button
          type="submit"
          disabled={!stripe || isProcessing || !isPaymentReady}
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