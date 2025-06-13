import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import Home from "@/pages/Home";
import StrideCalculator from "@/pages/StrideCalculator";

// Lazy load non-critical pages for better initial performance
const TermsAndConditions = lazy(() => import("@/pages/TermsAndConditions"));
const Loyalty = lazy(() => import("@/pages/Loyalty"));
const CompetitionChecklists = lazy(() => import("@/pages/CompetitionChecklists"));
const AdminClinics = lazy(() => import("@/pages/AdminClinics"));
const AdminContacts = lazy(() => import("@/pages/AdminContacts"));
const AdminEmailMarketing = lazy(() => import("@/pages/AdminEmailMarketing"));
const AdminRegistrations = lazy(() => import("@/pages/AdminRegistrations"));
const AdminGallery = lazy(() => import("@/pages/AdminGallery"));
const AdminNews = lazy(() => import("@/pages/AdminNews"));
const Unsubscribe = lazy(() => import("@/pages/Unsubscribe"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Loading component for lazy-loaded routes
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/stride-calculator" component={StrideCalculator} />
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
      <Route path="/competition-checklists">
        <Suspense fallback={<PageLoader />}>
          <CompetitionChecklists />
        </Suspense>
      </Route>
      <Route path="/admin/clinics">
        <Suspense fallback={<PageLoader />}>
          <AdminClinics />
        </Suspense>
      </Route>
      <Route path="/admin/contacts">
        <Suspense fallback={<PageLoader />}>
          <AdminContacts />
        </Suspense>
      </Route>
      <Route path="/admin/email-marketing">
        <Suspense fallback={<PageLoader />}>
          <AdminEmailMarketing />
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
      <Route path="/unsubscribe">
        <Suspense fallback={<PageLoader />}>
          <Unsubscribe />
        </Suspense>
      </Route>
      <Route>
        <Suspense fallback={<PageLoader />}>
          <NotFound />
        </Suspense>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>

        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
