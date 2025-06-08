import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Clinic } from "@shared/schema";
import { Plus, Edit, Trash2, Calendar, MapPin, Users, Euro, Eye } from "lucide-react";

export default function AdminClinics() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingClinic, setEditingClinic] = useState<Clinic | null>(null);
  const [clinicData, setClinicData] = useState({
    title: '',
    description: '',
    date: '',
    endDate: '',
    location: '',
    maxParticipants: 12,
    price: 0,
    level: 'intermediate',
    type: 'dressage',
    image: '',
    isActive: true
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: clinics = [] } = useQuery<Clinic[]>({
    queryKey: ['/api/admin/clinics'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertClinic) => {
      return await apiRequest('POST', '/api/admin/clinics', data);
    },
    onSuccess: () => {
      toast({
        title: "Clinic created successfully!",
        description: "The new clinic has been added to the schedule.",
      });
      setIsCreateOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['/api/admin/clinics'] });
      queryClient.invalidateQueries({ queryKey: ['/api/clinics'] });
    },
    onError: (error) => {
      toast({
        title: "Error creating clinic",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { id: number } & Partial<InsertClinic>) => {
      const { id, ...updateData } = data;
      return await apiRequest('PUT', `/api/admin/clinics/${id}`, updateData);
    },
    onSuccess: () => {
      toast({
        title: "Clinic updated successfully!",
        description: "The clinic details have been saved.",
      });
      setEditingClinic(null);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['/api/admin/clinics'] });
      queryClient.invalidateQueries({ queryKey: ['/api/clinics'] });
    },
    onError: (error) => {
      toast({
        title: "Error updating clinic",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest('DELETE', `/api/admin/clinics/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Clinic deleted successfully!",
        description: "The clinic has been removed from the schedule.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/clinics'] });
      queryClient.invalidateQueries({ queryKey: ['/api/clinics'] });
    },
    onError: (error) => {
      toast({
        title: "Error deleting clinic",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setClinicData({
      title: '',
      description: '',
      date: '',
      endDate: '',
      location: '',
      maxParticipants: 12,
      price: 0,
      level: 'intermediate',
      type: 'dressage',
      image: '',
      isActive: true
    });
  };

  const handleEdit = (clinic: Clinic) => {
    setEditingClinic(clinic);
    setClinicData({
      title: clinic.title,
      description: clinic.description,
      date: new Date(clinic.date).toISOString().split('T')[0],
      endDate: new Date(clinic.endDate).toISOString().split('T')[0],
      location: clinic.location,
      maxParticipants: clinic.maxParticipants,
      price: clinic.price,
      level: clinic.level,
      type: clinic.type,
      image: clinic.image,
      isActive: clinic.isActive
    });
  };

  const handleSave = () => {
    if (!clinicData.title || !clinicData.description || !clinicData.date || 
        !clinicData.location || !clinicData.price) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const submitData = {
      ...clinicData,
      date: new Date(clinicData.date),
      endDate: clinicData.endDate ? new Date(clinicData.endDate) : new Date(clinicData.date),
      price: Number(clinicData.price),
      maxParticipants: Number(clinicData.maxParticipants)
    };

    if (editingClinic) {
      updateMutation.mutate({ id: editingClinic.id, ...submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const formatPrice = (price: number) => {
    return `£${(price / 100).toFixed(2)}`;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'intermediate': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'advanced': return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-playfair font-bold text-navy mb-4">Clinic Management</h1>
              <div className="w-24 h-1 bg-orange"></div>
            </div>
            <Button 
              onClick={() => setIsCreateOpen(true)}
              className="bg-navy hover:bg-slate-800 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Clinic
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clinics.map((clinic) => (
              <Card key={clinic.id} className="overflow-hidden">
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
                  <div className="absolute top-4 right-4">
                    <Badge variant={clinic.isActive ? "default" : "secondary"}>
                      {clinic.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl font-playfair text-navy">{clinic.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{formatDate(clinic.date)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{clinic.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{clinic.currentParticipants}/{clinic.maxParticipants} participants</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Euro className="w-4 h-4 mr-2" />
                    <span className="font-bold text-orange">{formatPrice(clinic.price)}</span>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(clinic)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/admin/clinics/${clinic.id}/registrations`, '_blank')}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this clinic?')) {
                          deleteMutation.mutate(clinic.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {clinics.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No clinics created yet. Add your first clinic to get started!</p>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateOpen || editingClinic !== null} onOpenChange={(open) => {
        if (!open) {
          setIsCreateOpen(false);
          setEditingClinic(null);
          resetForm();
        }
      }}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-playfair text-navy">
              {editingClinic ? 'Edit Clinic' : 'Create New Clinic'}
            </DialogTitle>
            <DialogDescription>
              {editingClinic ? 'Update the clinic details below.' : 'Fill in the details for your new clinic.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div>
              <Label htmlFor="title">Clinic Title *</Label>
              <Input
                id="title"
                value={clinicData.title}
                onChange={(e) => setClinicData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Advanced Dressage Clinic"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={clinicData.description}
                onChange={(e) => setClinicData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed description of what the clinic covers..."
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Start Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={clinicData.date}
                  onChange={(e) => setClinicData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={clinicData.endDate}
                  onChange={(e) => setClinicData(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={clinicData.location}
                onChange={(e) => setClinicData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Training facility, City, Country"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maxParticipants">Max Participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  value={clinicData.maxParticipants}
                  onChange={(e) => setClinicData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                  min="1"
                  max="50"
                />
              </div>
              <div>
                <Label htmlFor="price">Price (in pence) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={clinicData.price}
                  onChange={(e) => setClinicData(prev => ({ ...prev, price: parseInt(e.target.value) }))}
                  placeholder="25000 for £250.00"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="level">Level</Label>
                <Select value={clinicData.level} onValueChange={(value) => setClinicData(prev => ({ ...prev, level: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={clinicData.type} onValueChange={(value) => setClinicData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dressage">Dressage</SelectItem>
                    <SelectItem value="jumping">Show Jumping</SelectItem>
                    <SelectItem value="cross-country">Cross Country</SelectItem>
                    <SelectItem value="full-day">Full Day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={clinicData.image}
                onChange={(e) => setClinicData(prev => ({ ...prev, image: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateOpen(false);
                setEditingClinic(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-navy hover:bg-slate-800 text-white"
            >
              {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Clinic'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}