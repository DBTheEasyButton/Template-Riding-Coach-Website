import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import AdminNavigation from "@/components/AdminNavigation";
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
import { Plus, Edit, Trash2, Calendar, MapPin, Users, Euro, Copy, Share2 } from "lucide-react";
import SocialShare from "@/components/SocialShare";

export default function AdminClinics() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingClinic, setEditingClinic] = useState<Clinic | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    endDate: "",
    location: "",
    maxParticipants: "12",
    image: "",
    isActive: true,
    hasMultipleSessions: true,
    clinicType: "multi-session",
    crossCountryMaxParticipants: "12",
    showJumpingMaxParticipants: "12"
  });

  const [sessions, setSessions] = useState([
    {
      sessionName: "",
      discipline: "jumping",
      skillLevel: "90cm",
      price: 80,
      requirements: ""
    }
  ]);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: clinics = [], isLoading, error } = useQuery<Clinic[]>({
    queryKey: ['/api/admin/clinics'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', '/api/admin/clinics', data);
    },
    onSuccess: () => {
      toast({ title: "Clinic created successfully!" });
      setIsCreateOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['/api/admin/clinics'] });
      queryClient.invalidateQueries({ queryKey: ['/api/clinics'] });
    },
    onError: () => {
      toast({ title: "Error creating clinic", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const { id, ...updateData } = data;
      return await apiRequest('PUT', `/api/admin/clinics/${id}`, updateData);
    },
    onSuccess: () => {
      toast({ title: "Clinic updated successfully!" });
      setEditingClinic(null);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['/api/admin/clinics'] });
      queryClient.invalidateQueries({ queryKey: ['/api/clinics'] });
    },
    onError: () => {
      toast({ title: "Error updating clinic", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest('DELETE', `/api/admin/clinics/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Clinic deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/clinics'] });
      queryClient.invalidateQueries({ queryKey: ['/api/clinics'] });
    },
    onError: () => {
      toast({ title: "Error deleting clinic", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      endDate: "",
      location: "",
      maxParticipants: "12",
      image: "",
      isActive: true,
      hasMultipleSessions: true,
      clinicType: "multi-session",
      crossCountryMaxParticipants: "12",
      showJumpingMaxParticipants: "12"
    });
    setSessions([{
      sessionName: "",
      discipline: "jumping",
      skillLevel: "90cm",
      price: 80,
      requirements: ""
    }]);
  };

  const addSession = () => {
    setSessions([...sessions, {
      sessionName: "",
      discipline: "jumping",
      skillLevel: "90cm",
      price: 80,
      requirements: ""
    }]);
  };

  const removeSession = (index: number) => {
    if (sessions.length > 1) {
      setSessions(sessions.filter((_, i) => i !== index));
    }
  };

  const updateSession = (index: number, field: string, value: any) => {
    const newSessions = [...sessions];
    newSessions[index] = { ...newSessions[index], [field]: value };
    setSessions(newSessions);
  };

  const getSkillLevelOptions = (discipline: string) => {
    switch (discipline) {
      case 'jumping':
      case 'cross-country':
        return ['70cm/80cm', '90cm', '1m', '1.10m'];
      case 'polework':
      case 'gridwork':
        return ['Beginner', 'Intermediate', 'Experienced'];
      default:
        return ['Beginner', 'Intermediate', 'Advanced'];
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageDataUrl = event.target?.result as string;
        setFormData({ ...formData, image: imageDataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (clinic: Clinic) => {
    setEditingClinic(clinic);
    setFormData({
      title: clinic.title,
      description: clinic.description,
      date: new Date(clinic.date).toISOString().split('T')[0],
      endDate: clinic.endDate ? new Date(clinic.endDate).toISOString().split('T')[0] : "",
      location: clinic.location,
      maxParticipants: clinic.maxParticipants.toString(),
      image: clinic.image,
      isActive: clinic.isActive,
      hasMultipleSessions: true,
      clinicType: "multi-session",
      crossCountryMaxParticipants: clinic.crossCountryMaxParticipants?.toString() || "12",
      showJumpingMaxParticipants: clinic.showJumpingMaxParticipants?.toString() || "12"
    });
  };

  const handleClone = (clinic: Clinic) => {
    // Calculate next available date (1 week from original)
    const originalDate = new Date(clinic.date);
    const cloneDate = new Date(originalDate);
    cloneDate.setDate(originalDate.getDate() + 7);
    
    setEditingClinic(null); // Clear editing clinic to create new one
    setFormData({
      title: `${clinic.title} (Copy)`,
      description: clinic.description,
      date: cloneDate.toISOString().split('T')[0],
      endDate: clinic.endDate ? new Date(new Date(clinic.endDate).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : "",
      location: clinic.location,
      maxParticipants: clinic.maxParticipants.toString(),
      image: clinic.image,
      isActive: true, // Default new clinic to active
      hasMultipleSessions: true,
      clinicType: "multi-session",
      crossCountryMaxParticipants: clinic.crossCountryMaxParticipants?.toString() || "12",
      showJumpingMaxParticipants: clinic.showJumpingMaxParticipants?.toString() || "12"
    });
    setIsCreateOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.description || !formData.date || !formData.location) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    if (sessions.length === 0) {
      toast({ title: "Please add at least one session", variant: "destructive" });
      return;
    }

    const submitData = {
      ...formData,
      date: new Date(formData.date),
      endDate: formData.endDate ? new Date(formData.endDate) : new Date(formData.date),
      price: sessions.length > 0 ? sessions[0].price : 0, // Use first session price for compatibility
      maxParticipants: Number(formData.maxParticipants),
      crossCountryMaxParticipants: Number(formData.crossCountryMaxParticipants),
      showJumpingMaxParticipants: Number(formData.showJumpingMaxParticipants),
      sessions: sessions
    };

    if (editingClinic) {
      updateMutation.mutate({ id: editingClinic.id, ...submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this clinic?")) {
      deleteMutation.mutate(id);
    }
  };

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) {
        return 'Invalid Date';
      }
      return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(dateObj);
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Navigation />
      <AdminNavigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-navy dark:text-white mb-2">Clinic Management</h1>
              <p className="text-slate-600 dark:text-slate-300">Manage your upcoming clinics and events</p>
            </div>
            <Button onClick={() => setIsCreateOpen(true)} className="bg-navy hover:bg-slate-800">
              <Plus className="w-4 h-4 mr-2" />
              Create New Clinic
            </Button>
          </div>

          {isLoading && (
            <div className="text-center py-8">
              <p className="text-slate-600 dark:text-slate-300">Loading clinics...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600">Error loading clinics. Please try again.</p>
            </div>
          )}

          <div className="grid gap-6">
            {clinics.map((clinic) => (
              <Card key={clinic.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-navy dark:text-white">{clinic.title}</CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(clinic.date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <a 
                            href={`https://maps.google.com/maps?q=${encodeURIComponent(clinic.location)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-orange underline"
                          >
                            {clinic.location}
                          </a>
                        </div>
                        <div className="flex items-center gap-1">
                          <Euro className="w-4 h-4" />
                          €{clinic.price}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {clinic.maxParticipants} max
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={clinic.isActive ? "default" : "secondary"}>
                        {clinic.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">{clinic.type}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">{clinic.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(clinic)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleClone(clinic)}>
                      <Copy className="w-4 h-4 mr-1" />
                      Clone
                    </Button>
                    <SocialShare clinic={clinic} />
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(clinic.id)}>
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={isCreateOpen || !!editingClinic} onOpenChange={(open) => {
        if (!open) {
          setIsCreateOpen(false);
          setEditingClinic(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingClinic ? 'Edit Clinic' : 'Create New Clinic'}</DialogTitle>
            <DialogDescription>
              {editingClinic ? 'Update the clinic details below.' : 'Fill in the details for your new clinic.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4 pr-2">
            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Advanced Dressage Clinic"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what participants will learn..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Start Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Dan Bizzarro Training Center"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price (€) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="150"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="maxParticipants">Max Participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-lg font-semibold">Sessions</Label>
                <Button type="button" onClick={addSession} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Session
                </Button>
              </div>
                
                {sessions.map((session, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Session {index + 1}</h4>
                      {sessions.length > 1 && (
                        <Button type="button" onClick={() => removeSession(index)} variant="destructive" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid gap-2">
                        <Label>Session Name</Label>
                        <Input
                          value={session.sessionName}
                          onChange={(e) => updateSession(index, 'sessionName', e.target.value)}
                          placeholder="e.g., Show Jumping Morning"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Discipline</Label>
                        <Select value={session.discipline} onValueChange={(value) => updateSession(index, 'discipline', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="jumping">Show Jumping</SelectItem>
                            <SelectItem value="cross-country">Cross Country</SelectItem>
                            <SelectItem value="dressage">Dressage</SelectItem>
                            <SelectItem value="polework">Polework</SelectItem>
                            <SelectItem value="gridwork">Gridwork</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid gap-2">
                        <Label>Skill Level</Label>
                        <Select value={session.skillLevel} onValueChange={(value) => updateSession(index, 'skillLevel', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {getSkillLevelOptions(session.discipline).map((level) => (
                              <SelectItem key={level} value={level}>{level}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Price (€)</Label>
                        <Input
                          type="number"
                          value={session.price}
                          onChange={(e) => updateSession(index, 'price', Number(e.target.value))}
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label>Requirements</Label>
                      <Input
                        value={session.requirements}
                        onChange={(e) => updateSession(index, 'requirements', e.target.value)}
                        placeholder="e.g., Own horse required, Suitable for green horses"
                      />
                    </div>
                  </div>
                ))}
                
                {/* Overall Max Participants for Multi-Session Clinics */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="grid gap-2">
                    <Label>Cross Country Max Participants (All Classes)</Label>
                    <Input
                      type="number"
                      value={formData.crossCountryMaxParticipants}
                      onChange={(e) => setFormData({ ...formData, crossCountryMaxParticipants: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Show Jumping Max Participants (All Classes)</Label>
                    <Input
                      type="number"
                      value={formData.showJumpingMaxParticipants}
                      onChange={(e) => setFormData({ ...formData, showJumpingMaxParticipants: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            
            <div className="grid gap-2">
              <Label htmlFor="image">Clinic Image</Label>
              <div className="space-y-2">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {formData.image && (
                  <div className="mt-2">
                    <img src={formData.image} alt="Preview" className="w-24 h-24 object-cover rounded-lg border" />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsCreateOpen(false);
              setEditingClinic(null);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Clinic'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}