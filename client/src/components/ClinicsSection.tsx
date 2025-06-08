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
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Clinic, InsertClinicRegistration } from "@shared/schema";
import { Calendar, MapPin, Users, Clock, Euro, FileText } from "lucide-react";
import { Link } from "wouter";

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
    specialRequests: ''
  });

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
        specialRequests: ''
      });
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

  const submitRegistration = () => {
    if (!selectedClinic) return;
    
    if (!registrationData.firstName || !registrationData.lastName || !registrationData.email || 
        !registrationData.phone || !registrationData.experienceLevel) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    registrationMutation.mutate({
      ...registrationData,
      clinicId: selectedClinic.id
    });
  };

  const handleInputChange = (field: keyof typeof registrationData, value: string) => {
    setRegistrationData(prev => ({ ...prev, [field]: value }));
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
                  <span>{clinic.location}</span>
                </div>
                <div className="flex items-center text-sm text-dark font-medium">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{clinic.currentParticipants}/{clinic.maxParticipants} participants</span>
                </div>
                <div className="flex items-center text-sm text-dark">
                  <Euro className="w-4 h-4 mr-2" />
                  <span className="font-bold text-xl text-orange">{formatPrice(clinic.price)}</span>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  onClick={() => handleRegistration(clinic)}
                  disabled={clinic.currentParticipants >= clinic.maxParticipants}
                  className="w-full bg-navy hover:bg-slate-800 text-white font-semibold"
                >
                  {clinic.currentParticipants >= clinic.maxParticipants ? 'Fully Booked' : 'Register Now'}
                </Button>
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
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-playfair text-forest">
                Register for {selectedClinic?.title}
              </DialogTitle>
              <DialogDescription>
                Complete your registration for this exclusive training clinic with Dan Bizzarro.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={registrationData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="John"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={registrationData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Doe"
                  />
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
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={registrationData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 234 567 8900"
                />
              </div>
              
              <div>
                <Label htmlFor="experienceLevel">Experience Level *</Label>
                <Select value={registrationData.experienceLevel} onValueChange={(value) => handleInputChange('experienceLevel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
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
                <Label htmlFor="specialRequests">Special Requests (optional)</Label>
                <Textarea
                  id="specialRequests"
                  value={registrationData.specialRequests}
                  onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                  placeholder="Any special requirements or questions..."
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="submit"
                onClick={submitRegistration}
                disabled={registrationMutation.isPending}
                className="bg-forest hover:bg-green-800 text-white"
              >
                {registrationMutation.isPending ? 'Registering...' : 'Complete Registration'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}