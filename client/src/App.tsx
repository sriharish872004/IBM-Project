import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import { AIChat } from "@/components/AIChat";

import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import SchemesList from "@/pages/SchemesList";
import SchemeDetails from "@/pages/SchemeDetails";
import Applications from "@/pages/Applications";
import Survey from "@/pages/Survey";
import Admin from "@/pages/Admin";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Government Scheme Portal
          </h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
            Empowering citizens with AI-driven awareness and eligibility verification.
          </p>
        </div>
        <a href="/api/login">
          <Button size="lg" className="min-w-[200px]" data-testid="button-login">
            Log In with Replit
          </Button>
        </a>
      </div>
    );
  }

  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/schemes" component={SchemesList} />
        <Route path="/schemes/:id" component={SchemeDetails} />
        <Route path="/applications" component={Applications} />
        <Route path="/survey" component={Survey} />
        <Route path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <AIChat />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
