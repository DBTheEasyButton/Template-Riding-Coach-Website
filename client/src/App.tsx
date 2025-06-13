import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Simple Home component for testing
function SimpleHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Dan Bizzarro Method</h1>
          <p className="text-xl text-gray-600">International Event Rider & Coach</p>
        </header>
        <div className="text-center">
          <p className="text-lg mb-4">Professional equestrian coaching and training methods</p>
          <div className="space-y-2">
            <p>✓ Elite coaching in dressage, show jumping, and cross-country</p>
            <p>✓ Stride calculator and training tools</p>
            <p>✓ Competition preparation guidance</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={SimpleHome} />
      <Route>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Page not found</div>
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  try {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    );
  } catch (error) {
    console.error("App render error:", error);
    return (
      <div className="min-h-screen bg-red-100 flex items-center justify-center">
        <div className="text-xl text-red-600">
          Error loading application: {String(error)}
        </div>
      </div>
    );
  }
}

export default App;
