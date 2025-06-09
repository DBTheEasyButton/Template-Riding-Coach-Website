import { useState } from "react";
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
import type { Clinic, InsertClinicRegistration } from "@shared/schema";
import { Calendar, MapPin, Users, Clock, Euro, FileText, AlertCircle, Check } from "lucide-react";
import { Link } from "wouter";
import SocialShare from "@/components/SocialShare";

export default function ClinicsSection() {
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
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
    paymentMethod: 'bank_transfer'
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: clinics = [] } = useQuery<Clinic[]>({
    queryKey: ['/api/clinics'],
  });

  const registrationMutation = useMutation({
    mutationFn: async (data: InsertClinicRegistration) => {
      return await apiRequest('POST', `/api/clinics/${selectedClinic?.id}/register`, data);
    },
    onSuccess: () => {
      toast({
        title: "Registration successful!",
        description: "You'll receive a confirmation email shortly.",
      });
      setIsRegistrationOpen(false);
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
    return `€${(price / 100).toFixed(0)}`;
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

  const handleRegistration = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    setIsRegistrationOpen(true);
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
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
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

    registrationMutation.mutate({
      ...registrationData,
      clinicId: selectedClinic.id
    });
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
                <div className="absolute top-4 left-4">
                  <Badge className={getLevelColor(clinic.level)}>
                    {clinic.level.charAt(0).toUpperCase() + clinic.level.slice(1)}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 text-2xl">
                  {getTypeIcon(clinic.type)}
                </div>
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
                  <span>{clinic.currentParticipants}/{clinic.maxParticipants} participants</span>
                </div>
                <div className="flex items-center text-sm text-dark">
                  <Euro className="w-4 h-4 mr-2" />
                  <span className="font-bold text-xl text-orange">£{clinic.price}</span>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col gap-2">
                <div className="flex gap-2 w-full">
                  {clinic.currentParticipants >= clinic.maxParticipants ? (
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
                  )}
                  <SocialShare clinic={clinic} />
                </div>
                {clinic.currentParticipants >= clinic.maxParticipants && (
                  <p className="text-xs text-gray-500 text-center">
                    Clinic is full. Join the waitlist to be notified if spots become available.
                  </p>
                )}
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
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
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
                  <Label htmlFor="medicalConditions">Medical Conditions or Allergies</Label>
                  <Textarea
                    id="medicalConditions"
                    value={registrationData.medicalConditions}
                    onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                    placeholder="Please list any medical conditions, allergies, or medications that may affect your participation..."
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
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-navy border-b border-gray-200 pb-2">Payment Information</h3>
                <div className="bg-orange/10 p-4 rounded-lg">
                  <div className="flex items-center text-orange mb-2">
                    <Euro className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Clinic Fee: {selectedClinic ? formatPrice(selectedClinic.price) : ''}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Payment must be made at time of booking to secure your place. Payment details will be provided upon registration confirmation.
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="paymentMethod">Preferred Payment Method</Label>
                  <Select value={registrationData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

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
                disabled={registrationMutation.isPending}
                className="bg-navy hover:bg-slate-800 text-white"
              >
                {registrationMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Complete Registration
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}