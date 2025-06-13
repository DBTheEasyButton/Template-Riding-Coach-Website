import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { Contact, EmailSubscriber } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, Search, Download, Send, Users, MessageSquare, Calendar, Filter } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AdminNavigation from "@/components/AdminNavigation";
import Footer from "@/components/Footer";

export default function AdminContacts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: contacts = [] } = useQuery<Contact[]>({
    queryKey: ['/api/admin/contacts'],
  });

  const { data: subscribers = [] } = useQuery<EmailSubscriber[]>({
    queryKey: ['/api/admin/subscribers'],
  });

  const exportContactsMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/contacts/export');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contacts-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onSuccess: () => {
      toast({
        title: "Export Successful",
        description: "Contacts exported to Excel file",
      });
    },
  });

  const exportSubscribersMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/subscribers/export');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `subscribers-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onSuccess: () => {
      toast({
        title: "Export Successful",
        description: "Subscribers exported to Excel file",
      });
    },
  });

  const sendEmailMutation = useMutation({
    mutationFn: async (data: { subject: string; message: string; recipients: string[] }) => {
      return await apiRequest('POST', '/api/admin/send-bulk-email', data);
    },
    onSuccess: () => {
      toast({
        title: "Email Sent",
        description: "Bulk email sent successfully",
      });
    },
  });

  const markContactResolvedMutation = useMutation({
    mutationFn: async (contactId: number) => {
      return await apiRequest('PUT', `/api/admin/contacts/${contactId}/resolve`);
    },
    onSuccess: () => {
      toast({
        title: "Contact Resolved",
        description: "Contact marked as resolved",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contacts'] });
    },
  });

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === "all") return matchesSearch;
    if (filterStatus === "pending") return matchesSearch && !contact.resolved;
    if (filterStatus === "resolved") return matchesSearch && contact.resolved;
    
    return matchesSearch;
  });

  const filteredSubscribers = subscribers.filter(subscriber => 
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (subscriber.firstName && subscriber.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (subscriber.lastName && subscriber.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInquiryTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      coaching: "bg-blue-100 text-blue-800",
      clinics: "bg-green-100 text-green-800",
      training: "bg-purple-100 text-purple-800",
      competition: "bg-orange-100 text-orange-800",
      media: "bg-pink-100 text-pink-800",
      sponsorship: "bg-yellow-100 text-yellow-800",
      other: "bg-gray-100 text-gray-800"
    };
    return colors[type] || colors.other;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Contact Management</h1>
          <p className="text-gray-600 mt-2">Manage contact inquiries and newsletter subscribers</p>
        </div>

        <Tabs defaultValue="contacts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Contact Inquiries ({contacts.length})
            </TabsTrigger>
            <TabsTrigger value="subscribers" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Newsletter Subscribers ({subscribers.length})
            </TabsTrigger>
          </TabsList>

          {/* Contact Inquiries Tab */}
          <TabsContent value="contacts" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={() => exportContactsMutation.mutate()}
                disabled={exportContactsMutation.isPending}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export to Excel
              </Button>
            </div>

            <div className="grid gap-4">
              {filteredContacts.map((contact) => (
                <Card key={contact.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{contact.firstName} {contact.lastName}</CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {contact.email}
                          </span>
                          {contact.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {contact.phone}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(contact.createdAt || new Date())}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {contact.inquiryType && (
                          <Badge className={getInquiryTypeColor(contact.inquiryType)}>
                            {contact.inquiryType}
                          </Badge>
                        )}
                        <Badge variant={contact.resolved ? "default" : "secondary"}>
                          {contact.resolved ? "Resolved" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{contact.subject}</h4>
                        <p className="text-gray-600 mt-1 line-clamp-3">{contact.message}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`mailto:${contact.email}?subject=Re: ${contact.subject}`)}
                        >
                          <Mail className="w-3 h-3 mr-1" />
                          Reply
                        </Button>
                        {!contact.resolved && (
                          <Button
                            size="sm"
                            onClick={() => markContactResolvedMutation.mutate(contact.id)}
                            disabled={markContactResolvedMutation.isPending}
                          >
                            Mark Resolved
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredContacts.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
                    <p className="text-gray-600">No contact inquiries match your current filters.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Newsletter Subscribers Tab */}
          <TabsContent value="subscribers" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search subscribers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => exportSubscribersMutation.mutate()}
                  disabled={exportSubscribersMutation.isPending}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export to Excel
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Send Newsletter
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Send Newsletter</DialogTitle>
                      <DialogDescription>
                        Send a newsletter to all active subscribers
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Subject</label>
                        <Input placeholder="Newsletter subject..." />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Message</label>
                        <textarea 
                          className="w-full p-3 border rounded-md h-32 resize-none"
                          placeholder="Newsletter content..."
                        />
                      </div>
                      <Button className="w-full">
                        Send to {subscribers.filter(s => s.isActive).length} Subscribers
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredSubscribers.map((subscriber) => (
                <Card key={subscriber.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {subscriber.firstName && subscriber.lastName 
                            ? `${subscriber.firstName} ${subscriber.lastName}`
                            : subscriber.email
                          }
                        </h4>
                        <p className="text-gray-600 text-sm">{subscriber.email}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>Subscribed: {formatDate(subscriber.subscribedAt)}</span>
                          <span>Source: {subscriber.subscriptionSource}</span>
                          {subscriber.interests && Array.isArray(subscriber.interests) && subscriber.interests.length > 0 && (
                            <span>Interests: {subscriber.interests.map(String).join(', ')}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={subscriber.isActive ? "default" : "secondary"}>
                          {subscriber.isActive ? "Active" : "Unsubscribed"}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`mailto:${subscriber.email}`)}
                        >
                          <Mail className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredSubscribers.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No subscribers found</h3>
                    <p className="text-gray-600">No newsletter subscribers match your search.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
}