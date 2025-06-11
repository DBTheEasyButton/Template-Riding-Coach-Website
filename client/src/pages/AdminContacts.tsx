import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import AdminNavigation from "@/components/AdminNavigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Contact } from "@shared/schema";
import { Mail, Calendar, User, MessageSquare } from "lucide-react";

export default function AdminContacts() {
  const { data: contacts = [], isLoading } = useQuery<Contact[]>({
    queryKey: ['/api/admin/contacts'],
  });

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
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
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-navy dark:text-white mb-2">Contact Inquiries</h1>
            <p className="text-slate-600 dark:text-slate-300">Manage contact messages from potential clients</p>
          </div>

          {isLoading && (
            <div className="text-center py-8">
              <p className="text-slate-600 dark:text-slate-300">Loading contacts...</p>
            </div>
          )}

          <div className="grid gap-6">
            {contacts.map((contact) => (
              <Card key={contact.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-navy dark:text-white flex items-center gap-2">
                        <User className="w-5 h-5" />
                        {contact.firstName} {contact.lastName}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {contact.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(contact.createdAt)}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">{contact.subject}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 mt-1 text-slate-500" />
                    <p className="text-slate-700 dark:text-slate-200">{contact.message}</p>
                  </div>
                </CardContent>
              </Card>
            ))}

            {contacts.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Mail className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">No contact inquiries yet</h3>
                <p className="text-slate-500 dark:text-slate-400">New messages from your website will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}