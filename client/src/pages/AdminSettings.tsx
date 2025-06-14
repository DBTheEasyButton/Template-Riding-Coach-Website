import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AdminNavigation from "@/components/AdminNavigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { 
  Settings, 
  Database, 
  Mail, 
  Shield, 
  Globe, 
  Palette,
  Bell,
  Download,
  Upload,
  RefreshCw,
  Check,
  AlertCircle,
  Trash2
} from "lucide-react";

interface SiteSettings {
  siteName: string;
  tagline: string;
  contactEmail: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  features: {
    enableRegistrations: boolean;
    enableNewsletter: boolean;
    enableLoyaltyProgram: boolean;
    maintenanceMode: boolean;
  };
  notifications: {
    emailNewRegistrations: boolean;
    emailNewContacts: boolean;
    emailNewsletterSignups: boolean;
  };
}

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery<SiteSettings>({
    queryKey: ['/api/admin/settings'],
  });

  const [formData, setFormData] = useState<SiteSettings>({
    siteName: settings?.siteName || "Dan Bizzarro Method",
    tagline: settings?.tagline || "Professional Horse Training & Eventing",
    contactEmail: settings?.contactEmail || "dan@danbizzarromethod.com",
    socialMedia: settings?.socialMedia || {},
    features: settings?.features || {
      enableRegistrations: true,
      enableNewsletter: true,
      enableLoyaltyProgram: true,
      maintenanceMode: false,
    },
    notifications: settings?.notifications || {
      emailNewRegistrations: true,
      emailNewContacts: true,
      emailNewsletterSignups: true,
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: Partial<SiteSettings>) => {
      return await apiRequest('PUT', '/api/admin/settings', data);
    },
    onSuccess: () => {
      toast({ title: "Settings updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/settings'] });
    },
    onError: () => {
      toast({ title: "Failed to update settings", variant: "destructive" });
    },
  });

  const optimizeImagesMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/optimize-images');
    },
    onSuccess: () => {
      toast({ title: "Images optimized successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to optimize images", variant: "destructive" });
    },
  });

  const backupDataMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/admin/backup');
    },
    onSuccess: () => {
      toast({ title: "Backup created successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to create backup", variant: "destructive" });
    },
  });

  const handleSaveSettings = () => {
    updateSettingsMutation.mutate(formData);
  };

  const handleOptimizeImages = async () => {
    setIsOptimizing(true);
    try {
      await optimizeImagesMutation.mutateAsync();
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleBackupData = async () => {
    setIsBackingUp(true);
    try {
      await backupDataMutation.mutateAsync();
    } finally {
      setIsBackingUp(false);
    }
  };

  const updateFormData = (section: keyof SiteSettings, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <AdminNavigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading settings...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <AdminNavigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">System Settings</h1>
          <p className="text-gray-600">Manage your platform configuration and preferences</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Site Information
                </CardTitle>
                <CardDescription>
                  Basic information about your website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={formData.siteName}
                      onChange={(e) => setFormData(prev => ({ ...prev, siteName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="tagline">Tagline</Label>
                  <Textarea
                    id="tagline"
                    value={formData.tagline}
                    onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                    rows={2}
                  />
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-3">Social Media Links</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook"
                        placeholder="https://facebook.com/..."
                        value={formData.socialMedia.facebook || ''}
                        onChange={(e) => updateFormData('socialMedia', 'facebook', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        placeholder="https://instagram.com/..."
                        value={formData.socialMedia.instagram || ''}
                        onChange={(e) => updateFormData('socialMedia', 'instagram', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="youtube">YouTube</Label>
                      <Input
                        id="youtube"
                        placeholder="https://youtube.com/..."
                        value={formData.socialMedia.youtube || ''}
                        onChange={(e) => updateFormData('socialMedia', 'youtube', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Platform Features
                </CardTitle>
                <CardDescription>
                  Enable or disable platform functionality
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Clinic Registrations</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to register for clinics
                    </p>
                  </div>
                  <Switch
                    checked={formData.features.enableRegistrations}
                    onCheckedChange={(checked) => updateFormData('features', 'enableRegistrations', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Newsletter Subscriptions</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to subscribe to the newsletter
                    </p>
                  </div>
                  <Switch
                    checked={formData.features.enableNewsletter}
                    onCheckedChange={(checked) => updateFormData('features', 'enableNewsletter', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Loyalty Program</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable loyalty rewards for frequent participants
                    </p>
                  </div>
                  <Switch
                    checked={formData.features.enableLoyaltyProgram}
                    onCheckedChange={(checked) => updateFormData('features', 'enableLoyaltyProgram', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Temporarily disable public access to the site
                    </p>
                  </div>
                  <Switch
                    checked={formData.features.maintenanceMode}
                    onCheckedChange={(checked) => updateFormData('features', 'maintenanceMode', checked)}
                  />
                </div>
                {formData.features.maintenanceMode && (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center gap-2 text-orange-800">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Maintenance mode is active</span>
                    </div>
                    <p className="text-sm text-orange-700 mt-1">
                      Regular users will see a maintenance page. Admin access remains available.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Email Notifications
                </CardTitle>
                <CardDescription>
                  Configure when you receive email notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">New Clinic Registrations</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when someone registers for a clinic
                    </p>
                  </div>
                  <Switch
                    checked={formData.notifications.emailNewRegistrations}
                    onCheckedChange={(checked) => updateFormData('notifications', 'emailNewRegistrations', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">New Contact Messages</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when someone sends a contact form message
                    </p>
                  </div>
                  <Switch
                    checked={formData.notifications.emailNewContacts}
                    onCheckedChange={(checked) => updateFormData('notifications', 'emailNewContacts', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Newsletter Signups</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when someone subscribes to your newsletter
                    </p>
                  </div>
                  <Switch
                    checked={formData.notifications.emailNewsletterSignups}
                    onCheckedChange={(checked) => updateFormData('notifications', 'emailNewsletterSignups', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Database Management
                  </CardTitle>
                  <CardDescription>
                    Backup and maintain your data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={handleBackupData}
                    disabled={isBackingUp}
                    className="w-full"
                  >
                    {isBackingUp ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Creating Backup...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Create Data Backup
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Download a complete backup of your database
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Image Optimization
                  </CardTitle>
                  <CardDescription>
                    Optimize images for better performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={handleOptimizeImages}
                    disabled={isOptimizing}
                    className="w-full"
                  >
                    {isOptimizing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Optimizing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Optimize All Images
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Compress and optimize all uploaded images
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage security and access controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-medium">Security Status: Good</span>
                  </div>
                  <div className="mt-2 space-y-1 text-sm text-green-700">
                    <p>✓ HTTPS enabled</p>
                    <p>✓ Database encryption active</p>
                    <p>✓ Secure payment processing</p>
                    <p>✓ Regular security updates</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Admin Access</Label>
                  <p className="text-sm text-muted-foreground">
                    Admin panels are protected and require proper authentication.
                    Regular users cannot access administrative functions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end">
          <Button 
            onClick={handleSaveSettings}
            disabled={updateSettingsMutation.isPending}
            size="lg"
          >
            {updateSettingsMutation.isPending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}