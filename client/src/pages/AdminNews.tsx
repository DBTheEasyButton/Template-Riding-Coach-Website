import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import AdminNavigation from "@/components/AdminNavigation";
import Footer from "@/components/Footer";
import { OptimizedImage } from "@/components/OptimizedImage";
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
import { Plus, Edit, Trash2, Calendar, FileText, Eye, Upload, X, Share2 } from "lucide-react";
import { FacebookShareModal } from "@/components/FacebookShareModal";

export default function AdminNews() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [articleToShare, setArticleToShare] = useState<News | null>(null);
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
      toast({ title: "News article deleted successfully" });
    },
    onError: (error: Error) => {
      console.error("Delete error:", error);
      if (error.message.includes("404")) {
        toast({ title: "Article already deleted", description: "This article may have already been removed.", variant: "default" });
      } else {
        toast({ title: "Error deleting article", description: error.message, variant: "destructive" });
      }
      // Refresh the list anyway in case the delete actually succeeded
      queryClient.invalidateQueries({ queryKey: ['/api/news'] });
    }
  });

  const openShareModal = (article: News) => {
    setArticleToShare(article);
    setShareModalOpen(true);
  };

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
    console.log("handleSubmit called", { editingNews, formData });
    
    if (!formData.title.trim()) {
      toast({ 
        title: "Title required", 
        description: "Please enter a title for the article.", 
        variant: "destructive" 
      });
      return;
    }
    
    if (!formData.excerpt.trim()) {
      toast({ 
        title: "Excerpt required", 
        description: "Please enter an excerpt for the article.", 
        variant: "destructive" 
      });
      return;
    }
    
    if (!formData.content.trim()) {
      toast({ 
        title: "Content required", 
        description: "Please enter content for the article.", 
        variant: "destructive" 
      });
      return;
    }
    
    try {
      let imageUrl = formData.image;
      
      // Upload image if one is selected
      if (selectedImage) {
        console.log("Uploading new image...");
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
        image: imageUrl,
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      };
      
      console.log("Submitting data:", { editingNews: !!editingNews, submitData });
      
      if (editingNews) {
        console.log("Calling updateMutation with ID:", editingNews.id);
        updateMutation.mutate({ id: editingNews.id, data: submitData });
      } else {
        console.log("Calling createMutation");
        createMutation.mutate(submitData);
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast({ 
        title: "Upload failed", 
        description: error instanceof Error ? error.message : "Failed to upload image. Please try again.", 
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
      
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 md:mb-8">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-navy dark:text-white mb-1 md:mb-2">News & Blog Management</h1>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">Create and manage news articles and blog posts</p>
            </div>
            <Button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2 w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              Create Article
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading articles...</div>
          ) : (
            <div className="grid gap-4 md:gap-6">
              {newsItems.map((news) => (
                <Card key={news.id}>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                      <div className="flex-1 min-w-0 order-2 sm:order-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-base md:text-xl font-semibold">{news.title}</h3>
                          <Badge variant="default" className="text-xs">
                            Published
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">{news.excerpt}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs md:text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                            {formatDate(news.publishedAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3 md:w-4 md:h-4" />
                            {news.content.length} characters
                          </span>
                        </div>
                      </div>
                      {news.image && (
                        <OptimizedImage 
                          src={news.image} 
                          alt={news.title}
                          className="w-full sm:w-24 h-32 sm:h-24 object-cover rounded-lg order-1 sm:order-2"
                        />
                      )}
                    </div>
                    <div className="grid grid-cols-2 sm:flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(news)}
                        className="flex items-center justify-center gap-1 text-xs md:text-sm"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openShareModal(news)}
                        className="flex items-center justify-center gap-1 text-blue-600 hover:text-blue-700 text-xs md:text-sm"
                      >
                        <Share2 className="w-3 h-3" />
                        <span className="hidden sm:inline">Share to</span> Facebook
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(news.id)}
                        className="flex items-center justify-center gap-1 text-red-600 hover:text-red-700 text-xs md:text-sm col-span-2 sm:col-span-1"
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
                            setImagePreview(formData.image || "");
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
                      Supported formats: JPG, PNG, GIF, WebP. Large images will be automatically optimized.
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
                  <Label htmlFor="content">Content (use HTML formatting)</Label>
                  <details className="mb-2 text-sm">
                    <summary className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
                      View formatting guide
                    </summary>
                    <div className="mt-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg space-y-2 text-xs">
                      <p className="font-semibold">Required HTML tags (NO markdown like # or **):</p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li><code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">&lt;h2&gt;</code> - Main section headings</li>
                        <li><code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">&lt;h3&gt;</code> - Sub-headings</li>
                        <li><code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">&lt;p&gt;</code> - Paragraphs</li>
                        <li><code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">&lt;strong&gt;</code> - Bold text</li>
                        <li><code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">&lt;ul&gt;&lt;li&gt;</code> - Bullet lists</li>
                        <li><code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">&lt;ol&gt;&lt;li&gt;</code> - Numbered lists</li>
                      </ul>
                      <p className="font-semibold mt-2">Example structure:</p>
                      <pre className="bg-slate-200 dark:bg-slate-700 p-2 rounded text-[10px] overflow-x-auto whitespace-pre-wrap">{`<p>Opening paragraph introducing the topic.</p>
<h2>Main Section</h2>
<p>Content for this section.</p>
<h3>Sub-section</h3>
<ul>
<li>First point</li>
<li>Second point</li>
</ul>`}</pre>
                      <p className="text-orange-600 dark:text-orange-400 font-medium mt-2">
                        Important: Keep spacing consistent - no extra blank lines between paragraphs or around lists.
                      </p>
                    </div>
                  </details>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="<p>Start your article content here...</p>"
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
                  disabled={createMutation.isPending || updateMutation.isPending || isUploadingImage}
                >
                  {isUploadingImage ? 'Uploading Image...' : (createMutation.isPending || updateMutation.isPending) ? 'Saving...' : (editingNews ? 'Update Article' : 'Create Article')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Facebook Share Modal */}
          {articleToShare && (
            <FacebookShareModal 
              isOpen={shareModalOpen}
              onClose={() => {
                setShareModalOpen(false);
                setArticleToShare(null);
              }}
              article={articleToShare}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}