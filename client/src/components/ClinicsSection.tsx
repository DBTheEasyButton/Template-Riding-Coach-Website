import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Clinic, ClinicWithSessions, InsertClinicRegistration, ClinicSession } from "@shared/schema";
import { Calendar, MapPin, Users, Clock, PoundSterling, FileText, AlertCircle, Check, CreditCard } from "lucide-react";
import { Link } from "wouter";
import SocialShare from "@/components/SocialShare";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

// Payment form component
function PaymentForm({ 
  onPaymentSuccess, 
  onPaymentError, 
  registrationData, 
  selectedClinic, 
  selectedSessions 
}: {
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
  registrationData: any;
  selectedClinic: ClinicWithSessions;
  selectedSessions: number[];
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
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onPaymentSuccess(paymentIntent.id);
      }
    } catch (error) {
      onPaymentError('Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center text-blue-800 mb-2">
          <CreditCard className="w-5 h-5 mr-2" />
          <span className="font-semibold">Secure Payment</span>
        </div>
        <p className="text-sm text-blue-700">
          Complete your registration with secure debit card payment. Your card details are processed securely by Stripe.
        </p>
      </div>
      
      <PaymentElement />
      
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-navy hover:bg-slate-800 text-white"
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
  );
}

export default function ClinicsSection() {
  const [selectedClinic, setSelectedClinic] = useState<ClinicWithSessions | null>(null);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [registrationData, setRegistrationData] = useState({
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
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [selectedSessions, setSelectedSessions] = useState<number[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [hasSavedData, setHasSavedData] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Load saved client data from localStorage on component mount
  useEffect(() => {
    const savedClientData = localStorage.getItem('clinicClientData');
    if (savedClientData) {
      try {
        const parsedData = JSON.parse(savedClientData);
        setRegistrationData(prev => ({
          ...prev,
          ...parsedData,
          // Reset session-specific fields
          specialRequests: '',
          medicalConditions: '',
          agreeToTerms: false
        }));
        setHasSavedData(true);
      } catch (error) {
        console.error('Error loading saved client data:', error);
      }
    }
  }, []);

  const { data: clinics = [] } = useQuery<ClinicWithSessions[]>({
    queryKey: ['/api/clinics'],
  });

  // Create payment intent mutation
  const createPaymentIntentMutation = useMutation({
    mutationFn: async () => {
      const payload = selectedClinic?.hasMultipleSessions 
        ? { sessionIds: selectedSessions }
        : {};
      
      return await apiRequest('POST', `/api/clinics/${selectedClinic?.id}/create-payment-intent`, payload);
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
      return await apiRequest('POST', `/api/clinics/${selectedClinic?.id}/register`, data);
    },
    onSuccess: () => {
      // Save client data to localStorage (excluding session-specific fields)
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
      setIsRegistrationOpen(false);
      setClientSecret(null);
      setRegistrationData({
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
      setFormErrors({});
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

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return `£${(price / 100).toFixed(0)}`;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'dressage': return '🎯';
      case 'jumping': return '🏆';
      case 'cross-country': return '🌲';
      default: return '🐎';
    }
  };

  const handleRegistration = (clinic: ClinicWithSessions) => {
    setSelectedClinic(clinic);
    setSelectedSessions([]); // Reset session selection
    setIsRegistrationOpen(true);
  };

  const clearSavedData = () => {
    localStorage.removeItem('clinicClientData');
    setHasSavedData(false);
    setRegistrationData({
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
      paymentMethod: 'bank_transfer'
    });
    toast({
      title: "Saved data cleared",
      description: "Your saved registration details have been removed.",
    });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!registrationData.firstName.trim()) errors.firstName = "First name is required";
    if (!registrationData.lastName.trim()) errors.lastName = "Last name is required";
    if (!registrationData.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registrationData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!registrationData.phone.trim()) errors.phone = "Phone number is required";
    if (!registrationData.experienceLevel) errors.experienceLevel = "Experience level is required";
    if (!registrationData.emergencyContact.trim()) errors.emergencyContact = "Emergency contact is required";
    if (!registrationData.emergencyPhone.trim()) errors.emergencyPhone = "Emergency phone is required";
    if (!registrationData.agreeToTerms) errors.agreeToTerms = "You must agree to the terms and conditions";
    
    // Validate session selection for multi-session clinics
    if (selectedClinic?.hasMultipleSessions && selectedSessions.length === 0) {
      errors.sessions = "Please select at least one session";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePaymentSuccess = (paymentIntentId: string) => {
    if (!selectedClinic) return;
    
    // For now, use the first selected session ID or undefined for single sessions
    const sessionId = selectedClinic.hasMultipleSessions && selectedSessions.length > 0 
      ? selectedSessions[0] 
      : undefined;
    
    registrationMutation.mutate({
      paymentIntentId,
      clinicId: selectedClinic.id,
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
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment failed",
      description: error,
      variant: "destructive",
    });
  };

  const submitRegistration = () => {
    if (!selectedClinic) return;
    
    if (!validateForm()) {
      toast({
        title: "Please correct the errors below",
        variant: "destructive",
      });
      return;
    }

    // Create payment intent to proceed to payment
    createPaymentIntentMutation.mutate();
  };

  const handleInputChange = (field: keyof typeof registrationData, value: string | boolean) => {
    setRegistrationData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <section id="clinics" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-playfair font-bold text-navy mb-6">Upcoming Clinics</h2>
          <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
          <p className="text-xl text-dark max-w-3xl mx-auto mb-6">
            Join Dan for intensive training sessions designed to elevate your riding to the next level
          </p>
          <Link href="/terms-and-conditions">
            <Button variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Clinic Terms & Conditions
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clinics.map((clinic) => (
            <Card key={clinic.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <img 
                  src={clinic.image}
                  alt={clinic.title}
                  className="w-full h-48 object-cover"
                />


              </div>
              
              <CardHeader>
                <CardTitle className="text-xl font-playfair text-navy font-bold">{clinic.title}</CardTitle>
                <CardDescription className="text-dark font-medium">{clinic.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-dark font-medium">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{formatDate(clinic.date)}</span>
                </div>
                <div className="flex items-center text-sm text-dark font-medium">
                  <MapPin className="w-4 h-4 mr-2" />
                  <a 
                    href={`https://maps.google.com/maps?q=${encodeURIComponent(clinic.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-orange underline"
                  >
                    {clinic.location}
                  </a>
                </div>
                <div className="flex items-center text-sm text-dark font-medium">
                  <Users className="w-4 h-4 mr-2" />
                  <span>
                    {clinic.hasMultipleSessions && clinic.sessions && clinic.sessions.length > 0
                      ? (() => {
                          const currentParticipants = clinic.sessions.reduce((total, session) => total + session.currentParticipants, 0);
                          const maxParticipants = (clinic.showJumpingMaxParticipants || 12) + (clinic.crossCountryMaxParticipants || 12);
                          return `${currentParticipants}/${maxParticipants} participants`;
                        })()
                      : `${clinic.currentParticipants}/${clinic.maxParticipants} participants`
                    }
                  </span>
                </div>
                <div className="flex items-center text-sm text-dark">
                  <PoundSterling className="w-4 h-4 mr-2" />
                  <span className="font-bold text-xl text-orange">
                    {clinic.hasMultipleSessions && clinic.sessions && clinic.sessions.length > 0
                      ? `from £${(Math.min(...clinic.sessions.map((s: ClinicSession) => s.price)) / 100).toFixed(0)}`
                      : clinic.price > 0 
                        ? `£${clinic.price > 100 ? (clinic.price / 100).toFixed(0) : clinic.price}`
                        : 'Price TBA'
                    }
                  </span>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col gap-2">
                <div className="flex gap-2 w-full">
                  {(() => {
                    const isFull = clinic.hasMultipleSessions && clinic.sessions && clinic.sessions.length > 0
                      ? (() => {
                          const currentParticipants = clinic.sessions.reduce((total, session) => total + session.currentParticipants, 0);
                          const maxParticipants = (clinic.showJumpingMaxParticipants || 12) + (clinic.crossCountryMaxParticipants || 12);
                          return currentParticipants >= maxParticipants;
                        })()
                      : clinic.currentParticipants >= clinic.maxParticipants;
                    
                    return isFull ? (
                      <Button 
                        onClick={() => handleRegistration(clinic)}
                        variant="outline"
                        className="flex-1 border-orange text-orange hover:bg-orange hover:text-white font-semibold"
                      >
                        Join Waitlist
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleRegistration(clinic)}
                        className="flex-1 bg-navy hover:bg-slate-800 text-white font-semibold"
                      >
                        Register Now
                      </Button>
                    );
                  })()}
                  <SocialShare clinic={clinic} />
                </div>
                {(() => {
                  const isFull = clinic.hasMultipleSessions && clinic.sessions && clinic.sessions.length > 0
                    ? (() => {
                        const currentParticipants = clinic.sessions.reduce((total, session) => total + session.currentParticipants, 0);
                        const maxParticipants = (clinic.showJumpingMaxParticipants || 12) + (clinic.crossCountryMaxParticipants || 12);
                        return currentParticipants >= maxParticipants;
                      })()
                    : clinic.currentParticipants >= clinic.maxParticipants;
                  
                  return isFull && (
                    <p className="text-xs text-gray-500 text-center">
                      {clinic.hasMultipleSessions ? 'Some sessions are full.' : 'Clinic is full.'} Join the waitlist to be notified if spots become available.
                    </p>
                  );
                })()}
              </CardFooter>
            </Card>
          ))}
        </div>

        {clinics.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No clinics scheduled at the moment. Check back soon for new dates!</p>
          </div>
        )}

        <Dialog open={isRegistrationOpen} onOpenChange={setIsRegistrationOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-playfair text-navy">
                Register for {selectedClinic?.title}
              </DialogTitle>
              <DialogDescription>
                Complete your registration for this exclusive training clinic with Dan Bizzarro.
              </DialogDescription>
              {hasSavedData && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-green-800">
                      <Check className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Your details have been pre-filled from your last registration</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearSavedData}
                      className="text-green-700 hover:text-green-900 text-xs"
                    >
                      Clear saved data
                    </Button>
                  </div>
                  <p className="text-xs text-green-600 mt-1">You can edit any information below as needed.</p>
                </div>
              )}
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
              {/* Session Selection for Multi-Session Clinics */}
              {selectedClinic?.hasMultipleSessions && selectedClinic.sessions && selectedClinic.sessions.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-navy border-b border-gray-200 pb-2">Session Selection</h3>
                  <div className="space-y-3">
                    {selectedClinic.sessions.map((session) => {
                      const isFull = session.currentParticipants >= session.maxParticipants;
                      const spotsRemaining = session.maxParticipants - session.currentParticipants;
                      
                      return (
                        <div key={session.id} className={`flex items-center space-x-3 p-3 border rounded-lg ${isFull ? 'bg-gray-50 border-gray-300' : 'border-gray-200'}`}>
                          <Checkbox
                            id={`session-${session.id}`}
                            checked={selectedSessions.includes(session.id)}
                            disabled={isFull}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedSessions([...selectedSessions, session.id]);
                              } else {
                                setSelectedSessions(selectedSessions.filter(id => id !== session.id));
                              }
                            }}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <label htmlFor={`session-${session.id}`} className={`font-medium cursor-pointer ${isFull ? 'text-gray-500' : ''}`}>
                                {session.sessionName}
                              </label>
                              {isFull && <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">FULL</span>}
                              {!isFull && spotsRemaining <= 2 && <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">{spotsRemaining} spots left</span>}
                            </div>
                            <p className={`text-sm ${isFull ? 'text-gray-400' : 'text-gray-600'}`}>
                              {session.discipline} • {session.skillLevel}
                            </p>
                            <p className={`text-sm ${isFull ? 'text-gray-400' : 'text-gray-500'}`}>
                              {session.currentParticipants}/{session.maxParticipants} participants • £{(session.price / 100).toFixed(0)}
                            </p>
                            {session.requirements && (
                              <p className="text-xs text-blue-600 mt-1">
                                Requirements: {session.requirements}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {selectedSessions.length > 0 && (
                    <div className="bg-orange/10 p-3 rounded-lg">
                      <p className="font-semibold text-orange">
                        Total Cost: £{selectedClinic.sessions
                          .filter(session => selectedSessions.includes(session.id))
                          .reduce((total, session) => total + session.price, 0) / 100}
                      </p>
                    </div>
                  )}
                  {formErrors.sessions && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {formErrors.sessions}
                    </p>
                  )}
                </div>
              )}
              
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-navy border-b border-gray-200 pb-2">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={registrationData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="John"
                      className={formErrors.firstName ? "border-red-500" : ""}
                    />
                    {formErrors.firstName && (
                      <p className="text-sm text-red-500 mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {formErrors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={registrationData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Doe"
                      className={formErrors.lastName ? "border-red-500" : ""}
                    />
                    {formErrors.lastName && (
                      <p className="text-sm text-red-500 mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {formErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={registrationData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john@example.com"
                    className={formErrors.email ? "border-red-500" : ""}
                  />
                  {formErrors.email && (
                    <p className="text-sm text-red-500 mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {formErrors.email}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={registrationData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+44 123 456 7890"
                    className={formErrors.phone ? "border-red-500" : ""}
                  />
                  {formErrors.phone && (
                    <p className="text-sm text-red-500 mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {formErrors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-navy border-b border-gray-200 pb-2">Emergency Contact</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergencyContact">Emergency Contact Name *</Label>
                    <Input
                      id="emergencyContact"
                      value={registrationData.emergencyContact}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                      placeholder="Emergency contact name"
                      className={formErrors.emergencyContact ? "border-red-500" : ""}
                    />
                    {formErrors.emergencyContact && (
                      <p className="text-sm text-red-500 mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {formErrors.emergencyContact}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
                    <Input
                      id="emergencyPhone"
                      value={registrationData.emergencyPhone}
                      onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                      placeholder="+44 123 456 7890"
                      className={formErrors.emergencyPhone ? "border-red-500" : ""}
                    />
                    {formErrors.emergencyPhone && (
                      <p className="text-sm text-red-500 mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {formErrors.emergencyPhone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Riding Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-navy border-b border-gray-200 pb-2">Riding Information</h3>
                <div>
                  <Label htmlFor="experienceLevel">Experience Level *</Label>
                  <Select value={registrationData.experienceLevel} onValueChange={(value) => handleInputChange('experienceLevel', value)}>
                    <SelectTrigger className={formErrors.experienceLevel ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner (New to eventing)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (Competing up to 90cm)</SelectItem>
                      <SelectItem value="advanced">Advanced (Competing 1m+)</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.experienceLevel && (
                    <p className="text-sm text-red-500 mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {formErrors.experienceLevel}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="horseName">Horse Name (optional)</Label>
                  <Input
                    id="horseName"
                    value={registrationData.horseName}
                    onChange={(e) => handleInputChange('horseName', e.target.value)}
                    placeholder="Your horse's name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="medicalConditions">Info about your horse</Label>
                  <Textarea
                    id="medicalConditions"
                    value={registrationData.medicalConditions}
                    onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                    placeholder="Please provide any relevant information about your horse (age, breed, temperament, experience level, special requirements)..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="specialRequests">Special Requests (optional)</Label>
                  <Textarea
                    id="specialRequests"
                    value={registrationData.specialRequests}
                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                    placeholder="Any special requirements, goals for the clinic, or questions..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Payment Information */}
              {!clientSecret ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-navy border-b border-gray-200 pb-2">Payment Information</h3>
                  <div className="bg-orange/10 p-4 rounded-lg">
                    <div className="flex items-center text-orange mb-2">
                      <PoundSterling className="w-5 h-5 mr-2" />
                      <span className="font-semibold">
                        Clinic Fee: {selectedClinic ? (
                          selectedClinic.hasMultipleSessions && selectedSessions.length > 0
                            ? `£${(selectedClinic.sessions.filter(s => selectedSessions.includes(s.id)).reduce((total, s) => total + s.price, 0) / 100).toFixed(0)}`
                            : `£${selectedClinic.price > 100 ? (selectedClinic.price / 100).toFixed(0) : selectedClinic.price}`
                        ) : ''}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Complete registration details above, then proceed to secure debit card payment.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-navy border-b border-gray-200 pb-2">Secure Payment</h3>
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentForm
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentError={handlePaymentError}
                      registrationData={registrationData}
                      selectedClinic={selectedClinic!}
                      selectedSessions={selectedSessions}
                    />
                  </Elements>
                </div>
              )}

              {/* Terms and Conditions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-navy border-b border-gray-200 pb-2">Terms & Conditions</h3>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agreeToTerms"
                    checked={registrationData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                    className={formErrors.agreeToTerms ? "border-red-500" : ""}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="agreeToTerms" className="text-sm leading-relaxed cursor-pointer">
                      I have read and agree to the{' '}
                      <Link href="/terms-and-conditions">
                        <span className="text-orange hover:underline font-medium">Clinic Terms and Conditions</span>
                      </Link>
                      {' '}and understand the risks involved in equestrian activities. *
                    </Label>
                    {formErrors.agreeToTerms && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {formErrors.agreeToTerms}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {!clientSecret && (
              <DialogFooter className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsRegistrationOpen(false)}
                  className="border-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={submitRegistration}
                  disabled={createPaymentIntentMutation.isPending}
                  className="bg-navy hover:bg-slate-800 text-white"
                >
                  {createPaymentIntentMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Setting up payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Proceed to Payment
                    </>
                  )}
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}