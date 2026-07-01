import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";

const NotFound = lazy(() => import("./pages/NotFound"));
const Auth = lazy(() => import("./pages/Auth"));
const PromoManager = lazy(() => import("./pages/PromoManager"));
const AdminReferrals = lazy(() => import("./pages/AdminReferrals"));
const AdminCms = lazy(() => import("./pages/AdminCms"));
const Crypto = lazy(() => import("./pages/Crypto"));
const Referral = lazy(() => import("./pages/Referral"));
const Ambassadors = lazy(() => import("./pages/Ambassadors"));
const Offers = lazy(() => import("./pages/Offers"));
const About = lazy(() => import("./pages/About"));
const FaqPage = lazy(() => import("./pages/FaqPage"));
const Complaints = lazy(() => import("./pages/Complaints"));
const Partnerships = lazy(() => import("./pages/Partnerships"));
const Terms = lazy(() => import("./pages/Terms"));

const queryClient = new QueryClient();

const RouteLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-background px-4 text-center text-sm font-medium text-muted-foreground">
    Chargement de DYNAMIK TRANSFERT…
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<RouteLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/crypto" element={<Crypto />} />
            <Route path="/parrainage" element={<Referral />} />
            <Route path="/ambassadeurs" element={<Ambassadors />} />
            <Route path="/partenariats" element={<Partnerships />} />
            <Route path="/offre" element={<Offers />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/termes" element={<Terms />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/reclamations" element={<Complaints />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/promo" element={<PromoManager />} />
            <Route path="/admin/cms" element={<AdminCms />} />
            <Route path="/admin/referrals" element={<AdminReferrals />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
