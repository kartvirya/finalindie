import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/home";
import GameDetails from "@/pages/game-details";
import SiteHeader from "@/components/site-header";
import NotFound from "@/pages/not-found";
import { EmailPopup } from "@/components/EmailPopup";

function Router() {
  return (
    <div className="min-h-screen bg-[#e6f7f7]">
      <SiteHeader />
      <main className="container mx-auto px-4 pt-16 pb-8 animate-fade-in">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/game/:id" component={GameDetails} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <EmailPopup />
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;
