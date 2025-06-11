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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { News } from "@shared/schema";
import { Plus, Edit, Trash2, Calendar, FileText, Eye, Upload, X } from "lucide-react";

export default function AdminNews() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: "",
    slug: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: newsItems = [], isLoading } = useQuery<News[]>({
    queryKey: ['/api/news'],
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => apiRequest("POST", "/api/admin/news", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/news'] });
      setIsCreateOpen(false);
      resetForm();
      toast({ title: "News article created successfully!" });
    },
    onError: (error: Error) => {
      toast({ title: "Error creating article", description: error.message, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<typeof formData> }) => 
      apiRequest("PUT", `/api/admin/news/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/news'] });
      setEditingNews(null);
      resetForm();
      toast({ title: "News article updated successfully!" });
    },
    onError: (error: Error) => {
      toast({ title: "Error updating article", description: error.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/news/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/news'] });
      toast({ title: "News article deleted" });
    },
    onError: (error: Error) => {
      toast({ title: "Error deleting article", description: error.message, variant: "destructive" });
    }
  });

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      image: "",
      slug: ""
    });
    setSelectedImage(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({ title: "Invalid file type", description: "Please select an image file", variant: "destructive" });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File too large", description: "Please select an image smaller than 5MB", variant: "destructive" });
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
      return data.url;
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleEdit = (news: News) => {
    setFormData({
      title: news.title,
      excerpt: news.excerpt,
      content: news.content,
      image: news.image || "",
      slug: news.slug
    });
    setImagePreview(news.image || "");
    setEditingNews(news);
  };

  const handleSubmit = async () => {
    try {
      let imageUrl = formData.image;
      
      // Upload image if one is selected
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
      }
      
      // Ensure we have an image
      if (!imageUrl) {
        toast({ 
          title: "Image required", 
          description: "Please upload an image or provide an image URL.", 
          variant: "destructive" 
        });
        return;
      }
      
      const submitData = { 
        title: formData.title,
        excerpt: formData.excerpt, 
        content: formData.content,
        imageUrl: imageUrl  // Send as imageUrl for server mapping
      };
      
      console.log("Submitting data:", submitData);
      
      if (editingNews) {
        updateMutation.mutate({ id: editingNews.id, data: submitData });
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
    if (confirm("Are you sure you want to delete this news article?")) {
      deleteMutation.mutate(id);
    }
  };

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
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
              <h1 className="text-4xl font-bold text-navy dark:text-white mb-2">News & Blog Management</h1>
              <p className="text-slate-600 dark:text-slate-300">Create and manage news articles and blog posts</p>
            </div>
            <Button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Article
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading articles...</div>
          ) : (
            <div className="grid gap-6">
              {newsItems.map((news) => (
                <Card key={news.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{news.title}</h3>
                          <Badge variant="default">
                            Published
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">{news.excerpt}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(news.publishedAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {news.content.length} characters
                          </span>
                        </div>
                      </div>
                      {news.image && (
                        <img 
                          src={news.image} 
                          alt={news.title}
                          className="w-24 h-24 object-cover rounded-lg ml-4"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(news)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(news.id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Create/Edit Dialog */}
          <Dialog open={isCreateOpen || !!editingNews} onOpenChange={(open) => {
            if (!open) {
              setIsCreateOpen(false);
              setEditingNews(null);
              resetForm();
            }
          }}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingNews ? 'Edit Article' : 'Create New Article'}</DialogTitle>
                <DialogDescription>
                  {editingNews ? 'Update article details' : 'Create a new news article or blog post'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Article title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Brief description of the article"
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor="image">Featured Image</Label>
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
                        value={formData.image}
                        onChange={(e) => {
                          setFormData({ ...formData, image: e.target.value });
                          if (e.target.value && !selectedImage) {
                            setImagePreview(e.target.value);
                          }
                        }}
                        placeholder="https://example.com/image.jpg"
                        className="mt-1"
                      />
                    </div>
                    
                    <p className="text-xs text-gray-500">
                      Supported formats: JPG, PNG, GIF. Max size: 5MB
                    </p>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="article-url-slug"
                  />
                </div>
                
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Full article content"
                    rows={8}
                  />
                </div>
                

              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsCreateOpen(false);
                  setEditingNews(null);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingNews ? 'Update' : 'Create'} Article
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