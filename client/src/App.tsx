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

function Router() {
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
