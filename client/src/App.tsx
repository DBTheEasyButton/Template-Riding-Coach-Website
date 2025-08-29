import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense, useEffect } from "react";

// Immediately load essential pages
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";

// Lazy load other pages to reduce initial bundle size
const TermsAndConditions = lazy(() => import("@/pages/TermsAndConditions"));
const Loyalty = lazy(() => import("@/pages/Loyalty"));
const CompetitionChecklists = lazy(() => import("@/pages/CompetitionChecklists"));
const StrideCalculator = lazy(() => import("@/pages/StrideCalculator"));
const ReadinessQuiz = lazy(() => import("@/pages/ReadinessQuiz"));
const PackingListGenerator = lazy(() => import("@/pages/PackingListGenerator"));
const AdminClinics = lazy(() => import("@/pages/AdminClinics"));
const AdminContacts = lazy(() => import("@/pages/AdminContacts"));
const AdminEmailMarketing = lazy(() => import("@/pages/AdminEmailMarketing"));
const AdminRegistrations = lazy(() => import("@/pages/AdminRegistrations"));
const AdminGallery = lazy(() => import("@/pages/AdminGallery"));
const AdminNews = lazy(() => import("@/pages/AdminNews"));
const AdminSponsors = lazy(() => import("@/pages/AdminSponsors"));
const AdminAnalytics = lazy(() => import("@/pages/AdminAnalytics"));
const AdminSettings = lazy(() => import("@/pages/AdminSettings"));
const NewsArticle = lazy(() => import("@/pages/NewsArticle"));
const Unsubscribe = lazy(() => import("@/pages/Unsubscribe"));

// Preload popular pages on desktop for better UX
const useDesktopPreloading = () => {
  useEffect(() => {
    // Check if on desktop (not mobile/tablet)
    const isDesktop = window.innerWidth >= 1024 && !('ontouchstart' in window);
    
    if (isDesktop) {
      // Preload commonly accessed pages after a short delay
      const timer = setTimeout(() => {
        import("@/pages/StrideCalculator");
        import("@/pages/CompetitionChecklists");
        import("@/pages/Loyalty");
      }, 2000); // 2 second delay to let main page load first

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

// Hidden/Blank page component
const HiddenPage = () => (
  <div className="min-h-screen bg-white">
    {/* Content hidden per user request */}
  </div>
);

function Router() {
  return (
    <Switch>
      <Route path="/" component={HiddenPage} />
      <Route path="/terms-and-conditions" component={HiddenPage} />
      <Route path="/loyalty" component={HiddenPage} />
      <Route path="/competition-checklists" component={HiddenPage} />
      <Route path="/stride-calculator" component={HiddenPage} />
      <Route path="/readiness-quiz" component={HiddenPage} />
      <Route path="/packing-list-generator" component={HiddenPage} />
      <Route path="/packing-list" component={HiddenPage} />
      <Route path="/admin/clinics" component={HiddenPage} />
      <Route path="/admin/contacts" component={HiddenPage} />
      <Route path="/admin/email-marketing" component={HiddenPage} />
      <Route path="/admin/registrations" component={HiddenPage} />
      <Route path="/admin/gallery" component={HiddenPage} />
      <Route path="/admin/news" component={HiddenPage} />
      <Route path="/admin/sponsors" component={HiddenPage} />
      <Route path="/admin/analytics" component={HiddenPage} />
      <Route path="/admin/settings" component={HiddenPage} />
      <Route path="/news/:id" component={HiddenPage} />
      <Route path="/unsubscribe" component={HiddenPage} />
      <Route component={HiddenPage} />
    </Switch>
  );
}

function App() {
  useDesktopPreloading();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <link 
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap" 
          rel="stylesheet" 
        />
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
        />
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
