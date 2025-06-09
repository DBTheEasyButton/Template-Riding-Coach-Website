import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { InsertContact } from "@shared/schema";
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter, Youtube } from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      return await apiRequest('POST', '/api/contacts', data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "Dan will get back to you soon.",
      });
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: ''
      });
      queryClient.invalidateQueries({ queryKey: ['/api/contacts'] });
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    contactMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-navy to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-playfair font-bold mb-6 text-white">Get In Touch</h2>
          <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Whether you're interested in sponsorship opportunities, training programs, or media inquiries
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-playfair font-bold mb-6 text-white">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="text-orange text-xl mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1 text-white">Training Facility</h4>
                    <p className="text-gray-200">Crown Farm<br />Ascott-Under-Wychwood<br />OX7 6AB</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="text-orange text-xl mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1 text-white">Phone</h4>
                    <p className="text-gray-200">+44 7767 291713</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Mail className="text-orange text-xl mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1 text-white">Email</h4>
                    <p className="text-gray-200">dan@danbizzarromethod.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-playfair font-bold mb-6 text-white">Follow Dan</h3>
              <div className="flex space-x-6">
                <a href="#" className="bg-white/10 hover:bg-white/20 rounded-full p-4 transition-colors duration-300">
                  <Instagram className="w-6 h-6 text-white" />
                </a>
                <a href="#" className="bg-white/10 hover:bg-white/20 rounded-full p-4 transition-colors duration-300">
                  <Facebook className="w-6 h-6 text-white" />
                </a>
                <a href="#" className="bg-white/10 hover:bg-white/20 rounded-full p-4 transition-colors duration-300">
                  <Twitter className="w-6 h-6 text-white" />
                </a>
                <a href="#" className="bg-white/10 hover:bg-white/20 rounded-full p-4 transition-colors duration-300">
                  <Youtube className="w-6 h-6 text-white" />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h3 className="text-2xl font-playfair font-bold mb-6 text-white">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">First Name</label>
                  <Input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:border-orange focus:ring-1 focus:ring-orange"
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Last Name</label>
                  <Input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:border-orange focus:ring-1 focus:ring-orange"
                    placeholder="Your last name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:border-orange focus:ring-1 focus:ring-orange"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Subject</label>
                <Select value={formData.subject} onValueChange={(value) => handleInputChange('subject', value)}>
                  <SelectTrigger className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-orange focus:ring-1 focus:ring-orange">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sponsorship">Sponsorship Inquiry</SelectItem>
                    <SelectItem value="training">Training Programs</SelectItem>
                    <SelectItem value="media">Media & Press</SelectItem>
                    <SelectItem value="general">General Inquiry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Message</label>
                <Textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:border-orange focus:ring-1 focus:ring-orange"
                  placeholder="Your message..."
                />
              </div>
              <Button
                type="submit"
                disabled={contactMutation.isPending}
                className="w-full bg-orange hover:bg-orange-600 text-white py-4 px-6 rounded-lg font-medium transition-colors duration-300 transform hover:scale-105"
              >
                {contactMutation.isPending ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
