import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { GhlContact } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2, RefreshCw, Trash2, Users, Globe, Tag, Calendar } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AdminNavigation from "@/components/AdminNavigation";
import Footer from "@/components/Footer";

export default function AdminGHL() {
  const [locationId, setLocationId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: contacts = [], isLoading } = useQuery<GhlContact[]>({
    queryKey: ['/api/ghl/contacts'],
  });

  const syncMutation = useMutation({
    mutationFn: async (locationId: string) => {
      return await apiRequest('POST', '/api/ghl/sync', { locationId });
    },
    onSuccess: (data: any) => {
      toast({
        title: "Sync Successful",
        description: data.message || `Synced ${data.count} contacts from Go High Level`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ghl/contacts'] });
    },
    onError: (error: any) => {
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to sync contacts from Go High Level",
        variant: "destructive",
      });
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: async (contactId: number) => {
      return await apiRequest('DELETE', `/api/ghl/contacts/${contactId}`);
    },
    onSuccess: () => {
      toast({
        title: "Contact Deleted",
        description: "Go High Level contact deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ghl/contacts'] });
    },
  });

  const handleSync = () => {
    if (!locationId.trim()) {
      toast({
        title: "Location ID Required",
        description: "Please enter your Go High Level Location ID to sync contacts",
        variant: "destructive",
      });
      return;
    }
    syncMutation.mutate(locationId);
  };

  const filteredContacts = contacts.filter(contact => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (contact.firstName?.toLowerCase().includes(searchLower)) ||
      (contact.lastName?.toLowerCase().includes(searchLower)) ||
      (contact.email?.toLowerCase().includes(searchLower)) ||
      (contact.phone?.toLowerCase().includes(searchLower)) ||
      (contact.source?.toLowerCase().includes(searchLower))
    );
  });

  const formatDate = (date: string | Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">Go High Level Integration</h1>
          <p className="text-sm md:text-base text-gray-600">Manage and sync contacts from your Go High Level account</p>
        </div>

        {/* Sync Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Sync Contacts
            </CardTitle>
            <CardDescription>
              Sync contacts from your Go High Level account using your Location ID
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="locationId" className="text-sm">Go High Level Location ID</Label>
                <Input
                  id="locationId"
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  placeholder="Enter your GHL Location/Sub-account ID"
                  data-testid="input-location-id"
                  className="text-sm"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleSync}
                  disabled={syncMutation.isPending}
                  data-testid="button-sync-contacts"
                  className="w-full sm:w-auto"
                >
                  {syncMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Sync Contacts
                    </>
                  )}
                </Button>
              </div>
            </div>
            <p className="text-xs md:text-sm text-gray-500 mt-2">
              Find your Location ID in your Go High Level settings under Sub-Accounts or API settings
            </p>
          </CardContent>
        </Card>

        {/* Contacts List */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Users className="w-4 h-4 md:w-5 md:h-5" />
                  Synced Contacts ({filteredContacts.length})
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Contacts synced from Go High Level forms and entries
                </CardDescription>
              </div>
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:max-w-xs text-sm"
                data-testid="input-search-contacts"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 mb-2">No contacts found</p>
                <p className="text-sm text-gray-400">
                  {contacts.length === 0 
                    ? "Sync contacts from Go High Level to get started"
                    : "Try adjusting your search filters"
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredContacts.map((contact) => (
                  <div 
                    key={contact.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    data-testid={`contact-card-${contact.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">
                            {contact.firstName || ''} {contact.lastName || ''}
                            {!contact.firstName && !contact.lastName && 'Unnamed Contact'}
                          </h3>
                          {contact.source && (
                            <Badge variant="outline" className="text-xs">
                              <Globe className="w-3 h-3 mr-1" />
                              {contact.source}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                          {contact.email && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Email:</span>
                              <span>{contact.email}</span>
                            </div>
                          )}
                          {contact.phone && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Phone:</span>
                              <span>{contact.phone}</span>
                            </div>
                          )}
                          {contact.country && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Country:</span>
                              <span>{contact.country}</span>
                            </div>
                          )}
                          {contact.timezone && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Timezone:</span>
                              <span>{contact.timezone}</span>
                            </div>
                          )}
                        </div>

                        {contact.tags && contact.tags.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <Tag className="w-4 h-4 text-gray-400" />
                            {contact.tags.map((tag, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Added: {formatDate(contact.dateAdded)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <RefreshCw className="w-3 h-3" />
                            <span>Synced: {formatDate(contact.lastSyncedAt)}</span>
                          </div>
                        </div>
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            data-testid={`button-delete-contact-${contact.id}`}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Contact</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this contact? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex justify-end gap-3 mt-4">
                            <Button variant="outline" onClick={() => {}}>Cancel</Button>
                            <Button 
                              variant="destructive"
                              onClick={() => deleteContactMutation.mutate(contact.id)}
                              disabled={deleteContactMutation.isPending}
                              data-testid={`button-confirm-delete-${contact.id}`}
                            >
                              {deleteContactMutation.isPending ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Deleting...
                                </>
                              ) : (
                                'Delete'
                              )}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
