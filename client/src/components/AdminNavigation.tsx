import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, Home } from "lucide-react";

export default function AdminNavigation() {
  const [location] = useLocation();

  return (
    <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 mb-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-semibold text-navy dark:text-white">Admin Panel</h2>
            <nav className="flex items-center gap-2">
              <Link href="/admin/clinics">
                <Button 
                  variant={location === "/admin/clinics" ? "default" : "ghost"} 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Clinics
                </Button>
              </Link>
              <Link href="/admin/contacts">
                <Button 
                  variant={location === "/admin/contacts" ? "default" : "ghost"} 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Contacts
                </Button>
              </Link>
            </nav>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Back to Website
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}