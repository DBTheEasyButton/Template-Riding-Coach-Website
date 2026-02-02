import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { GhlContact } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2, RefreshCw, Trash2, Users, Globe, Tag, Calendar, AlertTriangle, CheckCircle, CreditCard } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AdminNavigation from "@/components/AdminNavigation";
import Footer from "@/components/Footer";

interface MissingTagContact {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  paymentDate: string;
  amount: string;
  paymentIntentId: string;
  ghlContactId?: string;
  currentTags?: string[];
}

interface MissingTagsResponse {
  totalPayments: number;
  missingCount: number;
  missing: MissingTagContact[];
}

export default function AdminGHL() {
  const [locationId, setLocationId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showMissingTags, setShowMissingTags] = useState(false);
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

  const { data: missingTagsData, isLoading: isLoadingMissingTags, refetch: refetchMissingTags } = useQuery<MissingTagsResponse>({
    queryKey: ['/api/admin/check-missing-ghl-tags'],
    enabled: showMissingTags,
  });

  const addTagMutation = useMutation({
    mutationFn: async (contact: MissingTagContact) => {
      return await apiRequest('POST', '/api/admin/add-ghl-tag', {
        email: contact.email,
        firstName: contact.firstName,
        lastName: contact.lastName,
        phone: contact.phone,
        tag: 'stl-fullcourse'
      });
    },
    onSuccess: (_, contact) => {
      toast({
        title: "Tag Added",
        description: `Added 'stl-fullcourse' tag to ${contact.email}`,
      });
      refetchMissingTags();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Add Tag",
        description: error.message || "Failed to add tag to contact",
        variant: "destructive",
      });
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
                <Label htmlFor="locationId" className="text-sm">CRM Location ID</Label>
                <Input
                  id="locationId"
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  placeholder="Enter your CRM Location/Sub-account ID"
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
              Find your Location ID in your CRM settings under Sub-Accounts or API settings
            </p>
          </CardContent>
        </Card>

        {/* Missing CRM Tags Check */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Check Missing Course Tags
            </CardTitle>
            <CardDescription>
              Find audio course customers who paid in Stripe but don't have the 'stl-fullcourse' tag in CRM
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <Button 
                onClick={() => {
                  setShowMissingTags(true);
                  if (showMissingTags) {
                    refetchMissingTags();
                  }
                }}
                disabled={isLoadingMissingTags}
                variant="outline"
                className="w-full sm:w-auto"
              >
                {isLoadingMissingTags ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking Stripe & CRM...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Check for Missing Tags
                  </>
                )}
              </Button>

              {showMissingTags && missingTagsData && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600">
                      Total payments (last 90 days): <strong>{missingTagsData.totalPayments}</strong>
                    </span>
                    {missingTagsData.missingCount === 0 ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        All synced
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-800">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {missingTagsData.missingCount} missing tags
                      </Badge>
                    )}
                  </div>

                  {missingTagsData.missing.length > 0 && (
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left font-medium text-gray-600">Customer</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-600">Email</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-600">Payment</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-600">Current Tags</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-600">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {missingTagsData.missing.map((contact, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-4 py-3">
                                {contact.firstName} {contact.lastName}
                              </td>
                              <td className="px-4 py-3 text-gray-600">{contact.email}</td>
                              <td className="px-4 py-3">
                                <div className="text-gray-900">{contact.amount}</div>
                                <div className="text-xs text-gray-500">
                                  {new Date(contact.paymentDate).toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex flex-wrap gap-1">
                                  {contact.currentTags?.slice(0, 3).map((tag, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                  {(contact.currentTags?.length || 0) > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{(contact.currentTags?.length || 0) - 3}
                                    </Badge>
                                  )}
                                  {!contact.ghlContactId && (
                                    <Badge className="bg-red-100 text-red-700 text-xs">
                                      Not in CRM
                                    </Badge>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <Button
                                  size="sm"
                                  onClick={() => addTagMutation.mutate(contact)}
                                  disabled={addTagMutation.isPending}
                                >
                                  {addTagMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <>
                                      <Tag className="h-3 w-3 mr-1" />
                                      Add Tag
                                    </>
                                  )}
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
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
