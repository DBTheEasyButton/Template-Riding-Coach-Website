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
import type { Clinic, ClinicWithSessions } from "@shared/schema";
import { Plus, Edit, Trash2, Calendar, MapPin, Users, Copy, Share2 } from "lucide-react";
import SocialShare from "@/components/SocialShare";

export default function AdminClinics() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingClinic, setEditingClinic] = useState<ClinicWithSessions | null>(null);
  const [dialogKey, setDialogKey] = useState(0); // Force dialog re-render
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    endDate: "",
    entryClosingDate: "",
    location: "",
    price: "",
    maxParticipants: "12",
    type: "dressage",
    level: "intermediate",
    image: "",
    isActive: true,
    hasMultipleSessions: false,
    clinicType: "single"
  });

  const [sessions, setSessions] = useState([
    {
      sessionName: "",
      discipline: "jumping",
      skillLevel: "90cm",
      price: 80,
      maxParticipants: "" as number | "",
      requirements: ""
    }
  ]);
  
  const [missingFields, setMissingFields] = useState<string[]>([]);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: clinics = [], isLoading, error } = useQuery<ClinicWithSessions[]>({
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
    onSuccess: async () => {
      toast({ title: "Clinic updated successfully!" });
      setEditingClinic(null);
      resetForm();
      setIsCreateOpen(false);
      // Force refetch of fresh data
      await queryClient.invalidateQueries({ queryKey: ['/api/admin/clinics'] });
      await queryClient.invalidateQueries({ queryKey: ['/api/clinics'] });
      await queryClient.refetchQueries({ queryKey: ['/api/admin/clinics'] });
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
      entryClosingDate: "",
      location: "",
      price: "",
      maxParticipants: "12",
      type: "dressage",
      level: "intermediate",
      image: "",
      isActive: true,
      hasMultipleSessions: false,
      clinicType: "single"
    });
    setSessions([{
      sessionName: "",
      discipline: "jumping",
      skillLevel: "90cm",
      price: 80,
      maxParticipants: "" as number | "",
      requirements: ""
    }]);
    setMissingFields([]);
  };

  const addSession = () => {
    const newSession = {
      sessionName: "",
      discipline: "jumping",
      skillLevel: "90cm",
      price: 80,
      maxParticipants: "" as number | "",
      requirements: ""
    };
    setSessions([...sessions, newSession]);
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

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions (max width/height 800px)
        const MAX_SIZE = 800;
        let { width, height } = img;
        
        if (width > height) {
          if (width > MAX_SIZE) {
            height = (height * MAX_SIZE) / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = (width * MAX_SIZE) / height;
            height = MAX_SIZE;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.8); // 80% quality
        resolve(resizedDataUrl);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const resizedImage = await resizeImage(file);
        setFormData({ ...formData, image: resizedImage });
      } catch (error) {
        toast({ title: "Error processing image", variant: "destructive" });
      }
    }
  };

  const handleEdit = async (clinic: any) => {
    // Force complete refresh of clinic data
    await queryClient.invalidateQueries({ queryKey: ['/api/admin/clinics'] });
    const freshClinics = await queryClient.fetchQuery({ 
      queryKey: ['/api/admin/clinics'],
      staleTime: 0,
      gcTime: 0
    }) as any[];
    
    const freshClinic = freshClinics.find((c: any) => c.id === clinic.id) || clinic;
    
    // Force dialog to re-render with fresh data
    setDialogKey(prev => prev + 1);
    setEditingClinic(freshClinic);
    
    // Reset form completely
    const newFormData = {
      title: freshClinic.title || "",
      description: freshClinic.description || "",
      date: freshClinic.date ? new Date(freshClinic.date).toISOString().split('T')[0] : "",
      endDate: freshClinic.endDate ? new Date(freshClinic.endDate).toISOString().split('T')[0] : "",
      entryClosingDate: freshClinic.entryClosingDate ? new Date(freshClinic.entryClosingDate).toISOString().split('T')[0] : "",
      location: freshClinic.location || "",
      price: freshClinic.price?.toString() || "",
      maxParticipants: freshClinic.maxParticipants?.toString() || "12",
      type: freshClinic.type || "dressage",
      level: freshClinic.level || "intermediate",
      image: freshClinic.image || "",
      isActive: freshClinic.isActive !== undefined ? freshClinic.isActive : true,
      hasMultipleSessions: freshClinic.hasMultipleSessions || false,
      clinicType: freshClinic.clinicType || "single"
    };
    
    setFormData(newFormData);
    
    // Load existing session data if available
    if (freshClinic.sessions && freshClinic.sessions.length > 0) {
      const existingSessions = freshClinic.sessions.map((session: any) => ({
        sessionName: session.sessionName || "",
        discipline: session.discipline || "jumping",
        skillLevel: session.skillLevel || "90cm",
        price: session.price ? Math.round(session.price / 100) : 80,
        maxParticipants: session.maxParticipants ?? "",
        requirements: session.requirements || ""
      }));
      setSessions(existingSessions);
    } else {
      setSessions([{
        sessionName: "",
        discipline: "jumping",
        skillLevel: "90cm",
        price: 80,
        maxParticipants: "" as number | "",
        requirements: ""
      }]);
    }
    
    setIsCreateOpen(true);
  };

  const handleClone = (clinic: any) => {
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
      entryClosingDate: clinic.entryClosingDate ? new Date(new Date(clinic.entryClosingDate).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : "",
      location: clinic.location,
      price: clinic.price.toString(),
      maxParticipants: clinic.maxParticipants.toString(),
      type: clinic.type,
      level: clinic.level,
      image: clinic.image,
      isActive: true, // Default new clinic to active
      hasMultipleSessions: clinic.hasMultipleSessions || false,
      clinicType: clinic.clinicType || "single"
    });
    
    // Copy session data if it exists
    if (clinic.sessions && clinic.sessions.length > 0) {
      const clonedSessions = clinic.sessions.map((session: any) => ({
        sessionName: session.sessionName,
        discipline: session.discipline,
        skillLevel: session.skillLevel,
        price: session.price / 100, // Convert from cents to pounds for form display
        maxParticipants: session.maxParticipants ?? "",
        requirements: session.requirements || ""
      }));
      setSessions(clonedSessions);
    } else {
      // Reset to default session for single clinics
      setSessions([{
        sessionName: "",
        discipline: "jumping",
        skillLevel: "90cm",
        price: 80,
        maxParticipants: "" as number | "",
        requirements: ""
      }]);
    }
    
    setIsCreateOpen(true);
  };

  const handleSave = () => {
    const requiredFields = [];
    if (!formData.title.trim()) requiredFields.push('title');
    if (!formData.description.trim()) requiredFields.push('description');
    if (!formData.date) requiredFields.push('date');
    if (!formData.location.trim()) requiredFields.push('location');
    
    // Validate price for single session clinics
    if (formData.clinicType === 'single') {
      const priceValue = formData.price?.toString().trim();
      const numericPrice = parseFloat(priceValue || '0');
      if (!priceValue || priceValue === '' || numericPrice <= 0) {
        requiredFields.push('price');
      }
    }
    
    // Validate sessions for multi-session clinics
    if (formData.clinicType !== 'single' && sessions.length > 0) {
      sessions.forEach((session, index) => {
        if (!session.sessionName.trim()) {
          requiredFields.push(`session ${index + 1} name`);
        }
        if (!session.price || session.price <= 0) {
          requiredFields.push(`session ${index + 1} price`);
        }
      });
    }
    
    setMissingFields(requiredFields);
    
    if (requiredFields.length > 0) {
      toast({ 
        title: "Please fill in all required fields", 
        description: `Missing: ${requiredFields.join(', ')}`,
        variant: "destructive" 
      });
      return;
    }

    // Ensure valid dates
    const startDate = new Date(formData.date + 'T00:00:00');
    const endDate = formData.endDate 
      ? new Date(formData.endDate + 'T00:00:00') 
      : new Date(formData.date + 'T00:00:00');
    const entryClosingDate = formData.entryClosingDate
      ? new Date(formData.entryClosingDate + 'T00:00:00')
      : null;

    const submitData = {
      ...formData,
      date: startDate,
      endDate: endDate,
      entryClosingDate: entryClosingDate,
      price: formData.clinicType === 'single' ? Number(formData.price) : 0,
      maxParticipants: Number(formData.maxParticipants),
      sessions: formData.hasMultipleSessions ? sessions : []
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
                          <span className="text-orange font-bold">
                            {clinic.hasMultipleSessions && clinic.sessions && clinic.sessions.length > 0
                              ? `from £${(Math.min(...clinic.sessions.map((s: any) => s.price)) / 100).toFixed(0)}`
                              : clinic.price > 0 
                                ? `£${(clinic.price / 100).toFixed(0)}`
                                : 'Price TBA'
                            }
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {clinic.maxParticipants > 0 
                            ? `${clinic.maxParticipants} max`
                            : 'Unlimited'
                          }
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

      <Dialog key={dialogKey} open={isCreateOpen || !!editingClinic} onOpenChange={(open) => {
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
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (missingFields.includes('title')) {
                    setMissingFields(missingFields.filter(f => f !== 'title'));
                  }
                }}
                placeholder="e.g., Advanced Dressage Clinic"
                className={missingFields.includes('title') ? 'border-red-500 focus:border-red-500' : ''}
              />
              {missingFields.includes('title') && (
                <p className="text-sm text-red-500">Title is required</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  if (missingFields.includes('description')) {
                    setMissingFields(missingFields.filter(f => f !== 'description'));
                  }
                }}
                placeholder="Describe what participants will learn..."
                rows={3}
                className={missingFields.includes('description') ? 'border-red-500 focus:border-red-500' : ''}
              />
              {missingFields.includes('description') && (
                <p className="text-sm text-red-500">Description is required</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Start Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => {
                    setFormData({ ...formData, date: e.target.value });
                    if (missingFields.includes('date')) {
                      setMissingFields(missingFields.filter(f => f !== 'date'));
                    }
                  }}
                  className={missingFields.includes('date') ? 'border-red-500 focus:border-red-500' : ''}
                />
                {missingFields.includes('date') && (
                  <p className="text-sm text-red-500">Date is required</p>
                )}
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
              <Label htmlFor="entryClosingDate">Entry Closing Date</Label>
              <Input
                id="entryClosingDate"
                type="date"
                value={formData.entryClosingDate}
                onChange={(e) => setFormData({ ...formData, entryClosingDate: e.target.value })}
                placeholder="Optional - when registrations close"
              />
              <p className="text-sm text-gray-500">Leave empty to keep registrations open until clinic date</p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => {
                  setFormData({ ...formData, location: e.target.value });
                  if (missingFields.includes('location')) {
                    setMissingFields(missingFields.filter(f => f !== 'location'));
                  }
                }}
                placeholder="e.g., Dan Bizzarro Training Center"
                className={missingFields.includes('location') ? 'border-red-500 focus:border-red-500' : ''}
              />
              {missingFields.includes('location') && (
                <p className="text-sm text-red-500">Location is required</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="clinicType">Clinic Type *</Label>
              <Select value={formData.clinicType} onValueChange={(value) => {
                setFormData({ ...formData, clinicType: value, hasMultipleSessions: value !== "single" });
                if (value === "single") {
                  setSessions([sessions[0]]);
                }
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Session</SelectItem>
                  <SelectItem value="multi-session">Multi-Session (Show Jumping + Cross Country)</SelectItem>
                  <SelectItem value="combo">Combo Day</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {!formData.hasMultipleSessions ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Type</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dressage">Dressage</SelectItem>
                        <SelectItem value="jumping">Show Jumping</SelectItem>
                        <SelectItem value="cross-country">Cross Country</SelectItem>
                        <SelectItem value="polework">Polework</SelectItem>
                        <SelectItem value="gridwork">Gridwork</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="level">Level</Label>
                    <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getSkillLevelOptions(formData.type).map((level) => (
                          <SelectItem key={level} value={level.toLowerCase().replace(/[^a-z0-9]/g, '_')}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price (£) *</Label>
                    <Input
                      id="price"
                      type="text"
                      value={formData.price}
                      onChange={(e) => {
                        const rawValue = e.target.value;
                        
                        // Allow empty string for clearing
                        if (rawValue === '') {
                          setFormData({ ...formData, price: '' });
                          return;
                        }
                        
                        // Only allow numbers and one decimal point
                        const value = rawValue.replace(/[^0-9.]/g, '');
                        
                        // Prevent multiple decimal points
                        const decimalCount = (value.match(/\./g) || []).length;
                        if (decimalCount > 1) return;
                        
                        // Don't allow leading zeros unless it's a decimal
                        let cleanValue = value;
                        if (cleanValue.length > 1 && cleanValue.startsWith('0') && !cleanValue.startsWith('0.')) {
                          cleanValue = cleanValue.substring(1);
                        }
                        
                        setFormData({ ...formData, price: cleanValue });
                        
                        // Clear error if we now have a valid price
                        if (cleanValue && parseFloat(cleanValue) > 0 && missingFields.includes('price')) {
                          setMissingFields(missingFields.filter(f => f !== 'price'));
                        }
                      }}
                      placeholder="150"
                      className={missingFields.includes('price') ? 'border-red-500 focus:border-red-500' : ''}
                    />
                    {missingFields.includes('price') && (
                      <p className="text-sm text-red-500">Price is required</p>
                    )}
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
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-lg font-semibold">Sessions</Label>
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
                        <Label>Session Name *</Label>
                        <Input
                          value={session.sessionName}
                          onChange={(e) => {
                            updateSession(index, 'sessionName', e.target.value);
                            const fieldName = `session ${index + 1} name`;
                            if (e.target.value.trim() && missingFields.includes(fieldName)) {
                              setMissingFields(missingFields.filter(f => f !== fieldName));
                            }
                          }}
                          placeholder="e.g., Show Jumping Morning"
                          className={missingFields.includes(`session ${index + 1} name`) ? 'border-red-500 focus:border-red-500' : ''}
                        />
                        {missingFields.includes(`session ${index + 1} name`) && (
                          <p className="text-sm text-red-500">Session name is required</p>
                        )}
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
                        <Label>Level</Label>
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
                        <Label>Max Participants (Optional)</Label>
                        <Input
                          type="number"
                          value={session.maxParticipants}
                          onChange={(e) => updateSession(index, 'maxParticipants', e.target.value ? parseInt(e.target.value) : "")}
                          placeholder="Leave empty for unlimited"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid gap-2">
                        <Label>Price (£) *</Label>
                        <Input
                          type="text"
                          value={session.price}
                          onChange={(e) => {
                            const rawValue = e.target.value;
                            
                            // Allow empty string for clearing
                            if (rawValue === '') {
                              updateSession(index, 'price', '');
                              return;
                            }
                            
                            // Only allow numbers and one decimal point
                            const value = rawValue.replace(/[^0-9.]/g, '');
                            
                            // Prevent multiple decimal points
                            const decimalCount = (value.match(/\./g) || []).length;
                            if (decimalCount > 1) return;
                            
                            // Don't allow leading zeros unless it's a decimal
                            let cleanValue = value;
                            if (cleanValue.length > 1 && cleanValue.startsWith('0') && !cleanValue.startsWith('0.')) {
                              cleanValue = cleanValue.substring(1);
                            }
                            
                            const numericValue = cleanValue ? Number(cleanValue) : '';
                            updateSession(index, 'price', numericValue);
                            
                            // Clear error if we now have a valid price
                            const fieldName = `session ${index + 1} price`;
                            if (numericValue && Number(numericValue) > 0 && missingFields.includes(fieldName)) {
                              setMissingFields(missingFields.filter(f => f !== fieldName));
                            }
                          }}
                          className={missingFields.includes(`session ${index + 1} price`) ? 'border-red-500 focus:border-red-500' : ''}
                        />
                        {missingFields.includes(`session ${index + 1} price`) && (
                          <p className="text-sm text-red-500">Price is required</p>
                        )}
                      </div>
                      <div className="grid gap-2">
                        <Label>Requirements</Label>
                        <Input
                          value={session.requirements}
                          onChange={(e) => updateSession(index, 'requirements', e.target.value)}
                          placeholder="e.g., Own horse required"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-center pt-2">
                  <Button type="button" onClick={addSession} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Session
                  </Button>
                </div>
                
                {/* Total Max Participants for Multi-Session Clinics */}
                <div className="pt-4 border-t">
                  <div className="grid gap-2">
                    <Label htmlFor="totalMaxParticipants">Total Clinic Max Participants (Optional)</Label>
                    <Input
                      id="totalMaxParticipants"
                      type="number"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                      placeholder="Overall capacity for entire clinic"
                    />
                    <p className="text-sm text-gray-500">
                      Set an overall cap for the entire clinic across all sessions. Leave blank or set high if you want individual session limits only.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
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