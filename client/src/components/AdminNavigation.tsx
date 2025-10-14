import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, Home, Mail, Images, FileText, Star, BarChart3, Settings, Globe } from "lucide-react";

export default function AdminNavigation() {
  const [location] = useLocation();

  return (
    <div className="bg-orange-50 dark:bg-slate-800 border-b-4 border-orange-500 dark:border-slate-700 mb-8 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4 gap-4">
          <h2 className="text-xl font-semibold text-navy dark:text-white">Admin Panel</h2>
          <div className="flex items-center justify-between gap-4 w-full lg:w-auto">
            <nav className="grid grid-cols-3 lg:flex lg:items-center gap-1 w-full lg:w-auto">
              <Link href="/admin/clinics">
                <Button 
                  variant={location === "/admin/clinics" ? "default" : "ghost"} 
                  size="sm"
                  className="flex items-center gap-2 w-full lg:w-auto"
                >
                  <Calendar className="w-4 h-4" />
                  Clinics
                </Button>
              </Link>
              <Link href="/admin/contacts">
                <Button 
                  variant={location === "/admin/contacts" ? "default" : "ghost"} 
                  size="sm"
                  className="flex items-center gap-2 w-full lg:w-auto"
                >
                  <MessageSquare className="w-4 h-4" />
                  Contacts
                </Button>
              </Link>
              <Link href="/admin/email-marketing">
                <Button 
                  variant={location === "/admin/email-marketing" ? "default" : "ghost"} 
                  size="sm"
                  className="flex items-center gap-2 w-full lg:w-auto"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </Button>
              </Link>
              <Link href="/admin/gallery">
                <Button 
                  variant={location === "/admin/gallery" ? "default" : "ghost"} 
                  size="sm"
                  className="flex items-center gap-2 w-full lg:w-auto"
                >
                  <Images className="w-4 h-4" />
                  Gallery
                </Button>
              </Link>
              <Link href="/admin/news">
                <Button 
                  variant={location === "/admin/news" ? "default" : "ghost"} 
                  size="sm"
                  className="flex items-center gap-2 w-full lg:w-auto"
                >
                  <FileText className="w-4 h-4" />
                  News
                </Button>
              </Link>
              <Link href="/admin/sponsors">
                <Button 
                  variant={location === "/admin/sponsors" ? "default" : "ghost"} 
                  size="sm"
                  className="flex items-center gap-2 w-full lg:w-auto"
                >
                  <Star className="w-4 h-4" />
                  Sponsors
                </Button>
              </Link>
              <Link href="/admin/ghl">
                <Button 
                  variant={location === "/admin/ghl" ? "default" : "ghost"} 
                  size="sm"
                  className="flex items-center gap-2 w-full lg:w-auto"
                >
                  <Globe className="w-4 h-4" />
                  Go High Level
                </Button>
              </Link>
              <Link href="/admin/analytics">
                <Button 
                  variant={location === "/admin/analytics" ? "default" : "ghost"} 
                  size="sm"
                  className="flex items-center gap-2 w-full lg:w-auto"
                >
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </Button>
              </Link>
              <Link href="/admin/settings">
                <Button 
                  variant={location === "/admin/settings" ? "default" : "ghost"} 
                  size="sm"
                  className="flex items-center gap-2 w-full lg:w-auto"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
              </Link>
            </nav>
            <Link href="/" className="lg:ml-4">
              <Button variant="outline" size="sm" className="flex items-center gap-2 bg-white hover:bg-gray-50 border-2 border-orange-300">
                <Home className="w-4 h-4" />
                Back to Main Site
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}