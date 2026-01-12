import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, ExternalLink, Eye, MousePointer } from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";
import AdminNavigation from "@/components/AdminNavigation";
import type { Sponsor, InsertSponsor } from "@shared/schema";

interface SponsorFormData {
  name: string;
  description: string;
  website: string;
  rotationDuration: number;
  displayOrder: number;
  isActive: boolean;
  logo?: File;
}

export default function AdminSponsors() {
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<SponsorFormData>({
    name: "",
    description: "",
    website: "",
    rotationDuration: 10,
    displayOrder: 0,
    isActive: true,
  });

  const queryClient = useQueryClient();

  const { data: sponsors = [], isLoading } = useQuery<Sponsor[]>({
    queryKey: ['/api/sponsors'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch('/api/sponsors', {
        method: 'POST',
        body: data,
      });
      if (!response.ok) throw new Error('Failed to create sponsor');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sponsors'] });
      queryClient.invalidateQueries({ queryKey: ['/api/sponsors/active'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      const response = await fetch(`/api/sponsors/${id}`, {
        method: 'PUT',
        body: data,
      });
      if (!response.ok) throw new Error('Failed to update sponsor');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sponsors'] });
      queryClient.invalidateQueries({ queryKey: ['/api/sponsors/active'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/sponsors/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete sponsor');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sponsors'] });
      queryClient.invalidateQueries({ queryKey: ['/api/sponsors/active'] });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      website: "",
      rotationDuration: 10,
      displayOrder: 0,
      isActive: true,
    });
    setEditingSponsor(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('website', formData.website);
    formDataToSend.append('rotationDuration', formData.rotationDuration.toString());
    formDataToSend.append('displayOrder', formData.displayOrder.toString());
    formDataToSend.append('isActive', formData.isActive.toString());
    
    if (formData.logo) {
      formDataToSend.append('logo', formData.logo);
    }

    if (editingSponsor) {
      updateMutation.mutate({ id: editingSponsor.id, data: formDataToSend });
    } else {
      createMutation.mutate(formDataToSend);
    }
  };

  const handleEdit = (sponsor: Sponsor) => {
    setFormData({
      name: sponsor.name,
      description: sponsor.description,
      website: sponsor.website,
      rotationDuration: sponsor.rotationDuration,
      displayOrder: sponsor.displayOrder,
      isActive: sponsor.isActive,
    });
    setEditingSponsor(sponsor);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this sponsor?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-16 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Sponsor Management</h1>
            <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">Manage rotating sponsor banners and track their performance</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2 w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            Add Sponsor
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingSponsor ? 'Edit Sponsor' : 'Add New Sponsor'}</CardTitle>
              <CardDescription>
                Configure sponsor details and rotation settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Sponsor Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website URL</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="rotationDuration">Rotation Duration (seconds)</Label>
                    <Input
                      id="rotationDuration"
                      type="number"
                      min="5"
                      max="300"
                      value={formData.rotationDuration}
                      onChange={(e) => setFormData({ ...formData, rotationDuration: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="displayOrder">Display Order</Label>
                    <Input
                      id="displayOrder"
                      type="number"
                      min="0"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="logo">Logo Image</Label>
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, logo: e.target.files?.[0] })}
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Upload a logo image (recommended: square, min 200x200px)
                  </p>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {editingSponsor ? 'Update Sponsor' : 'Create Sponsor'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sponsors.map((sponsor) => (
            <Card key={sponsor.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <OptimizedImage
                      src={sponsor.logo}
                      alt={`${sponsor.name} logo`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={sponsor.isActive ? "default" : "secondary"}>
                      {sponsor.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                <h3 className="font-semibold text-lg mb-2">{sponsor.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {sponsor.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center text-gray-500">
                    <Eye className="w-4 h-4 mr-1" />
                    {sponsor.impressionCount} views
                  </div>
                  <div className="flex items-center text-gray-500">
                    <MousePointer className="w-4 h-4 mr-1" />
                    {sponsor.clickCount} clicks
                  </div>
                  <div className="text-gray-500">
                    Duration: {sponsor.rotationDuration}s
                  </div>
                  <div className="text-gray-500">
                    Order: {sponsor.displayOrder}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(sponsor.website, '_blank')}
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Visit
                  </Button>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(sponsor)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(sponsor.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sponsors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No sponsors configured yet</p>
            <Button onClick={() => setShowForm(true)} className="flex items-center gap-2 mx-auto">
              <Plus className="w-4 h-4" />
              Add Your First Sponsor
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}