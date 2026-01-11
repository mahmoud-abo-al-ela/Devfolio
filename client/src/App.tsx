import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import DashboardHome from "@/pages/dashboard/DashboardHome";
import Projects from "@/pages/dashboard/Projects";
import Skills from "@/pages/dashboard/Skills";
import Settings from "@/pages/dashboard/Settings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard">
        <ProtectedRoute>
          <DashboardHome />
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/projects">
        <ProtectedRoute>
          <Projects />
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/skills">
        <ProtectedRoute>
          <Skills />
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/settings">
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      </Route>
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
