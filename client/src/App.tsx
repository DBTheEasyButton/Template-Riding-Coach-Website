import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import TermsAndConditions from "@/pages/TermsAndConditions";
import Loyalty from "@/pages/Loyalty";
import CompetitionChecklists from "@/pages/CompetitionChecklists";
import StrideCalculator from "@/pages/StrideCalculator";
import AdminClinics from "@/pages/AdminClinics";
import AdminContacts from "@/pages/AdminContacts";
import AdminEmailMarketing from "@/pages/AdminEmailMarketing";
import AdminRegistrations from "@/pages/AdminRegistrations";
import AdminGallery from "@/pages/AdminGallery";
import AdminNews from "@/pages/AdminNews";
import NewsArticle from "@/pages/NewsArticle";
import Unsubscribe from "@/pages/Unsubscribe";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/terms-and-conditions" component={TermsAndConditions} />
      <Route path="/loyalty" component={Loyalty} />
      <Route path="/competition-checklists" component={CompetitionChecklists} />
      <Route path="/stride-calculator" component={StrideCalculator} />
      <Route path="/admin/clinics" component={AdminClinics} />
      <Route path="/admin/contacts" component={AdminContacts} />
      <Route path="/admin/email-marketing" component={AdminEmailMarketing} />
      <Route path="/admin/registrations" component={AdminRegistrations} />
      <Route path="/admin/gallery" component={AdminGallery} />
      <Route path="/admin/news" component={AdminNews} />
      <Route path="/news/:id" component={NewsArticle} />
      <Route path="/unsubscribe" component={Unsubscribe} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
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
