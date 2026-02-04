import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense, useEffect } from "react";
import { VisitorProvider } from "@/hooks/use-visitor";
import WelcomeBackToast from "@/components/WelcomeBackToast";
import CookieConsent, { CookieConsentProvider } from "@/components/CookieConsent";

// Immediately load essential pages
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";

// Lazy load other pages to reduce initial bundle size
const About = lazy(() => import("@/pages/About"));
const Coaching = lazy(() => import("@/pages/Services"));
const Gallery = lazy(() => import("@/pages/Gallery"));
const Blog = lazy(() => import("@/pages/News"));
const Contact = lazy(() => import("@/pages/Contact"));

// Service-specific pages
const PrivateLessons = lazy(() => import("@/pages/services/PrivateLessons"));
const GroupClinics = lazy(() => import("@/pages/services/GroupClinics"));
const RemoteCoaching = lazy(() => import("@/pages/services/RemoteCoaching"));
const Dressage = lazy(() => import("@/pages/services/Dressage"));
const ShowJumping = lazy(() => import("@/pages/services/ShowJumping"));
const CrossCountry = lazy(() => import("@/pages/services/CrossCountry"));
const Polework = lazy(() => import("@/pages/services/Polework"));
const TermsAndConditions = lazy(() => import("@/pages/TermsAndConditions"));
const Loyalty = lazy(() => import("@/pages/Loyalty"));

// Admin pages
const AdminClinics = lazy(() => import("@/pages/AdminClinics"));
const AdminRegistrations = lazy(() => import("@/pages/AdminRegistrations"));
const AdminGallery = lazy(() => import("@/pages/AdminGallery"));
const AdminNews = lazy(() => import("@/pages/AdminNews"));
const AdminSponsors = lazy(() => import("@/pages/AdminSponsors"));
const AdminAnalytics = lazy(() => import("@/pages/AdminAnalytics"));
const AdminSettings = lazy(() => import("@/pages/AdminSettings"));
const AdminGHL = lazy(() => import("@/pages/AdminGHL"));
const AdminTestimonials = lazy(() => import("@/pages/AdminTestimonials"));
const NewsArticle = lazy(() => import("@/pages/NewsArticle"));
const Unsubscribe = lazy(() => import("@/pages/Unsubscribe"));
const ConfirmClinicTimes = lazy(() => import("@/pages/ConfirmClinicTimes"));

// Simple redirect component for wouter
function RedirectToAdminClinics() {
  const [, setLocation] = useLocation();
  useEffect(() => {
    setLocation("/admin/clinics");
  }, [setLocation]);
  return null;
}

// Preload popular pages on desktop for better UX
const useDesktopPreloading = () => {
  useEffect(() => {
    // Check if on desktop (not mobile/tablet)
    const isDesktop = window.innerWidth >= 1024 && !('ontouchstart' in window);
    
    if (isDesktop) {
      // Preload commonly accessed pages after a short delay
      const timer = setTimeout(() => {
        import("@/pages/Services");
        import("@/pages/Loyalty");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);
};

// Loading component for lazy-loaded pages
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
  </div>
);

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about">
        <Suspense fallback={<PageLoader />}>
          <About />
        </Suspense>
      </Route>
      <Route path="/coaching">
        <Suspense fallback={<PageLoader />}>
          <Coaching />
        </Suspense>
      </Route>
      <Route path="/coaching/private-lessons">
        <Suspense fallback={<PageLoader />}>
          <PrivateLessons />
        </Suspense>
      </Route>
      <Route path="/coaching/clinics">
        <Suspense fallback={<PageLoader />}>
          <GroupClinics />
        </Suspense>
      </Route>
      <Route path="/coaching/remote-coaching">
        <Suspense fallback={<PageLoader />}>
          <RemoteCoaching />
        </Suspense>
      </Route>
      <Route path="/coaching/dressage">
        <Suspense fallback={<PageLoader />}>
          <Dressage />
        </Suspense>
      </Route>
      <Route path="/coaching/show-jumping">
        <Suspense fallback={<PageLoader />}>
          <ShowJumping />
        </Suspense>
      </Route>
      <Route path="/coaching/cross-country">
        <Suspense fallback={<PageLoader />}>
          <CrossCountry />
        </Suspense>
      </Route>
      <Route path="/coaching/polework">
        <Suspense fallback={<PageLoader />}>
          <Polework />
        </Suspense>
      </Route>
      <Route path="/gallery">
        <Suspense fallback={<PageLoader />}>
          <Gallery />
        </Suspense>
      </Route>
      <Route path="/blog">
        <Suspense fallback={<PageLoader />}>
          <Blog />
        </Suspense>
      </Route>
      <Route path="/contact">
        <Suspense fallback={<PageLoader />}>
          <Contact />
        </Suspense>
      </Route>
      <Route path="/terms-and-conditions">
        <Suspense fallback={<PageLoader />}>
          <TermsAndConditions />
        </Suspense>
      </Route>
      <Route path="/loyalty">
        <Suspense fallback={<PageLoader />}>
          <Loyalty />
        </Suspense>
      </Route>
      <Route path="/admin">
        <RedirectToAdminClinics />
      </Route>
      <Route path="/admin/clinics">
        <Suspense fallback={<PageLoader />}>
          <AdminClinics />
        </Suspense>
      </Route>
      <Route path="/admin/registrations">
        <Suspense fallback={<PageLoader />}>
          <AdminRegistrations />
        </Suspense>
      </Route>
      <Route path="/admin/gallery">
        <Suspense fallback={<PageLoader />}>
          <AdminGallery />
        </Suspense>
      </Route>
      <Route path="/admin/news">
        <Suspense fallback={<PageLoader />}>
          <AdminNews />
        </Suspense>
      </Route>
      <Route path="/admin/sponsors">
        <Suspense fallback={<PageLoader />}>
          <AdminSponsors />
        </Suspense>
      </Route>
      <Route path="/admin/ghl">
        <Suspense fallback={<PageLoader />}>
          <AdminGHL />
        </Suspense>
      </Route>
      <Route path="/admin/testimonials">
        <Suspense fallback={<PageLoader />}>
          <AdminTestimonials />
        </Suspense>
      </Route>
      <Route path="/admin/analytics">
        <Suspense fallback={<PageLoader />}>
          <AdminAnalytics />
        </Suspense>
      </Route>
      <Route path="/admin/settings">
        <Suspense fallback={<PageLoader />}>
          <AdminSettings />
        </Suspense>
      </Route>
      <Route path="/blog/:id">
        <Suspense fallback={<PageLoader />}>
          <NewsArticle />
        </Suspense>
      </Route>
      <Route path="/unsubscribe">
        <Suspense fallback={<PageLoader />}>
          <Unsubscribe />
        </Suspense>
      </Route>
      <Route path="/confirm-clinic-times/:token">
        <Suspense fallback={<PageLoader />}>
          <ConfirmClinicTimes />
        </Suspense>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useDesktopPreloading();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CookieConsentProvider>
          <VisitorProvider>
            <link 
              href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap" 
              rel="stylesheet" 
            />
            <link 
              rel="stylesheet" 
              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
            />
            <WelcomeBackToast />
            <Toaster />
            <CookieConsent />
            <Router />
          </VisitorProvider>
        </CookieConsentProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
