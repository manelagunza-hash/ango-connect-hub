
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import { RoleProvider } from "./context/RoleContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Services from "./pages/Services";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Premium from "./pages/Premium";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import ServiceRequest from "./pages/ServiceRequest";
import ClientDashboard from "./pages/ClientDashboard";
import Conversation from "./pages/Conversation";
import ProfessionalRegistration from "./pages/ProfessionalRegistration";
import ProfessionalDashboard from "./pages/ProfessionalDashboard";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import ProfessionalOnboarding from "./pages/ProfessionalOnboarding";
import ProfessionalFinances from "./pages/ProfessionalFinances";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <SubscriptionProvider>
            <RoleProvider>
              <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:category" element={<Services />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/premium" element={<Premium />} />
              
              {/* Rota de onboarding */}
              <Route path="/onboarding" element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              } />
              
              {/* Dashboard unificado com rotas específicas */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/*" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              {/* Standalone pages */}
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/professional-onboarding" element={
                <ProtectedRoute>
                  <ProfessionalOnboarding />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/finances" element={
                <ProtectedRoute>
                  <ProfessionalFinances />
                </ProtectedRoute>
              } />
              
              {/* Rotas protegidas legadas (manter para compatibilidade) */}
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/service-request" element={<ProtectedRoute><ServiceRequest /></ProtectedRoute>} />
              <Route path="/client-dashboard" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
              <Route path="/conversation/:requestId" element={<ProtectedRoute><Conversation /></ProtectedRoute>} />
              <Route path="/professional-registration" element={<ProtectedRoute><ProfessionalRegistration /></ProtectedRoute>} />
              <Route path="/professional-dashboard" element={<ProtectedRoute><ProfessionalDashboard /></ProtectedRoute>} />
              <Route path="/PFLGMANEGER" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              
              {/* Rotas fixas */}
              <Route path="/terms" element={<NotFound />} />
              <Route path="/privacy" element={<NotFound />} />
              <Route path="/cookies" element={<NotFound />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
              </Routes>
            </RoleProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
