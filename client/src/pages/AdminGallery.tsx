import { useState, useRef } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { GalleryImage } from "@shared/schema";
import { Plus, Edit, Trash2, Upload, Eye, X, Settings } from "lucide-react";

export default function AdminGallery() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "competition",
    isActive: true
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: images = [], isLoading } = useQuery<GalleryImage[]>({
    queryKey: ['/api/admin/gallery'],
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => apiRequest("POST", "/api/admin/gallery", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/gallery'] });
      setIsCreateOpen(false);
      resetForm();
      toast({ title: "Image added to gallery successfully!" });
    },
    onError: (error: Error) => {
      toast({ title: "Error adding image", description: error.message, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<typeof formData> }) => 
      apiRequest("PUT", `/api/admin/gallery/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/gallery'] });
      setEditingImage(null);
      resetForm();
      toast({ title: "Image updated successfully!" });
    },
    onError: (error: Error) => {
      toast({ title: "Error updating image", description: error.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/gallery/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/gallery'] });
      toast({ title: "Image removed from gallery" });
    },
    onError: (error: Error) => {
      toast({ title: "Error removing image", description: error.message, variant: "destructive" });
    }
  });

  const optimizeImagesMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/optimize-images", {}),
    onSuccess: () => {
      toast({ title: "All images optimized successfully!" });
    },
    onError: (error: Error) => {
      toast({ title: "Error optimizing images", description: error.message, variant: "destructive" });
    }
  });

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({ title: "Invalid file type", description: "Please select an image file", variant: "destructive" });
        return;
      }
      
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    
    setIsUploadingImage(true);
    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const data = await response.json();
      
      // Show compression results if available
      if (data.compressionRatio) {
        toast({
          title: "Image optimized",
          description: `Reduced by ${data.compressionRatio}% (${(data.originalSize / 1024 / 1024).toFixed(1)}MB → ${(data.optimizedSize / 1024 / 1024).toFixed(1)}MB)`,
        });
      }
      
      return data.url;
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      category: "competition",
      isActive: true
    });
    setSelectedImage(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEdit = (image: GalleryImage) => {
    setFormData({
      title: image.title,
      description: image.description || "",
      imageUrl: image.imageUrl,
      category: image.category,
      isActive: image.isActive
    });
    setImagePreview(image.imageUrl);
    setEditingImage(image);
  };

  const handleSubmit = async () => {
    try {
      let imageUrl = formData.imageUrl;
      
      // Upload image if one is selected
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
      }
      
      const submitData = { ...formData, imageUrl };
      
      if (editingImage) {
        updateMutation.mutate({ id: editingImage.id, data: submitData });
      } else {
        createMutation.mutate(submitData);
      }
    } catch (error) {
      toast({ 
        title: "Upload failed", 
        description: "Failed to upload image. Please try again.", 
        variant: "destructive" 
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to remove this image from the gallery?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <AdminNavigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-navy dark:text-white mb-2">Gallery Management</h1>
              <p className="text-slate-600 dark:text-slate-300">Manage competition photos and media gallery</p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => optimizeImagesMutation.mutate()}
                disabled={optimizeImagesMutation.isPending}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                {optimizeImagesMutation.isPending ? 'Optimizing...' : 'Optimize All Images'}
              </Button>
              <Button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Image
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading gallery...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <Card key={image.id} className="overflow-hidden">
                  <div className="aspect-video bg-gray-100 relative">
                    <img 
                      src={image.imageUrl} 
                      alt={image.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/api/placeholder/400/300";
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 text-xs rounded ${
                        image.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                      }`}>
                        {image.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1">{image.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 capitalize">{image.category}</p>
                    {image.description && (
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{image.description}</p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(image)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(image.id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Create/Edit Dialog */}
          <Dialog open={isCreateOpen || !!editingImage} onOpenChange={(open) => {
            if (!open) {
              setIsCreateOpen(false);
              setEditingImage(null);
              resetForm();
            }
          }}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingImage ? 'Edit Image' : 'Add New Image'}</DialogTitle>
                <DialogDescription>
                  {editingImage ? 'Update image details' : 'Add a new image to the gallery'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Competition photo title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="image">Gallery Image</Label>
                  <div className="space-y-3">
                    {/* File Upload Button */}
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageSelect}
                        accept="image/*"
                        className="hidden"
                        id="image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2"
                        disabled={isUploadingImage}
                      >
                        <Upload className="w-4 h-4" />
                        {selectedImage ? 'Change Image' : 'Upload Image'}
                      </Button>
                      {selectedImage && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedImage(null);
                            setImagePreview("");
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full max-w-xs h-32 object-cover rounded-lg border"
                        />
                        {selectedImage && (
                          <div className="mt-2 text-sm text-gray-600">
                            Selected: {selectedImage.name} ({(selectedImage.size / 1024 / 1024).toFixed(2)} MB)
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Alternative URL Input */}
                    <div className="border-t pt-3">
                      <Label htmlFor="image-url" className="text-sm text-gray-600">Or enter image URL:</Label>
                      <Input
                        id="image-url"
                        value={formData.imageUrl}
                        onChange={(e) => {
                          setFormData({ ...formData, imageUrl: e.target.value });
                          if (e.target.value && !selectedImage) {
                            setImagePreview(e.target.value);
                          }
                        }}
                        placeholder="https://example.com/image.jpg"
                        className="mt-1"
                      />
                    </div>
                    
                    <p className="text-xs text-gray-500">
                      Supported formats: JPG, PNG, GIF, WebP. Large images will be automatically optimized.
                    </p>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="competition">Competition</option>
                    <option value="training">Training</option>
                    <option value="clinic">Clinic</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Photo description..."
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <Label htmlFor="isActive">Show in gallery</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsCreateOpen(false);
                  setEditingImage(null);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingImage ? 'Update' : 'Add'} Image
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Footer />
    </div>
  );
}