import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Calendar, Home, Images, FileText, Star, BarChart3, Settings, Globe, Menu, LogOut, Quote } from "lucide-react";
import { useAdminAuth } from "@/components/AdminAuthWrapper";
import { apiRequest } from "@/lib/queryClient";

const allNavItems = [
  { href: "/admin/clinics", label: "Clinics", icon: Calendar, superAdminOnly: false },
  { href: "/admin/gallery", label: "Gallery", icon: Images, superAdminOnly: false },
  { href: "/admin/news", label: "News", icon: FileText, superAdminOnly: false },
  { href: "/admin/testimonials", label: "Reviews", icon: Quote, superAdminOnly: false },
  { href: "/admin/sponsors", label: "Sponsors", icon: Star, superAdminOnly: false },
  { href: "/admin/ghl", label: "CRM", icon: Globe, superAdminOnly: false },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3, superAdminOnly: false },
  { href: "/admin/settings", label: "Settings", icon: Settings, superAdminOnly: true },
];

export default function AdminNavigation() {
  const [location, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { isSuperAdmin, user } = useAdminAuth();
  const queryClient = useQueryClient();

  const navItems = allNavItems.filter(item => !item.superAdminOnly || isSuperAdmin);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/admin/logout');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/session'] });
      setLocation('/admin/login');
    },
  });

  const NavLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: typeof Calendar }) => (
    <Link href={href} onClick={() => setIsOpen(false)}>
      <Button 
        variant={location === href ? "default" : "ghost"} 
        size="sm"
        className="flex items-center gap-2 w-full justify-start"
      >
        <Icon className="w-4 h-4" />
        {label}
      </Button>
    </Link>
  );

  return (
    <div className="bg-orange-50 dark:bg-slate-800 border-b-4 border-orange-500 dark:border-slate-700 mb-4 md:mb-8 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3 md:py-4">
          <h2 className="text-lg md:text-xl font-semibold text-navy dark:text-white">Admin Panel</h2>
          
          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <Link href="/">
              <Button variant="outline" size="sm" className="flex items-center gap-1 bg-white hover:bg-gray-50 border-2 border-orange-300">
                <Home className="w-4 h-4" />
                <span className="sr-only md:not-sr-only">Site</span>
              </Button>
            </Link>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50 border-2 border-orange-300">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                <SheetHeader>
                  <SheetTitle className="text-left text-navy">Admin Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-2 mt-6">
                  {navItems.map((item) => (
                    <NavLink key={item.href} {...item} />
                  ))}
                  <div className="border-t pt-4 mt-4 space-y-2">
                    <Link href="/" onClick={() => setIsOpen(false)}>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-2 w-full justify-start border-orange-300"
                      >
                        <Home className="w-4 h-4" />
                        Back to Main Site
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setIsOpen(false);
                        logoutMutation.mutate();
                      }}
                      disabled={logoutMutation.isPending}
                      className="flex items-center gap-2 w-full justify-start border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      {logoutMutation.isPending ? "Logging out..." : "Logout"}
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-2">
            <nav className="flex items-center gap-1 flex-wrap">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button 
                    variant={location === item.href ? "default" : "ghost"} 
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
            <Link href="/" className="ml-4">
              <Button variant="outline" size="sm" className="flex items-center gap-2 bg-white hover:bg-gray-50 border-2 border-orange-300">
                <Home className="w-4 h-4" />
                Back to Main Site
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="flex items-center gap-2 bg-white hover:bg-red-50 border-2 border-red-300 text-red-600"
            >
              <LogOut className="w-4 h-4" />
              {logoutMutation.isPending ? "..." : "Logout"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
