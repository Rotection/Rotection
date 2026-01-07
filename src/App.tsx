import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import RobloxCallback from "./pages/RobloxCallback";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Submit from "./pages/Submit";
import Games from "./pages/Games";
import GameDetail from "./pages/GameDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// #region agent log
fetch("http://127.0.0.1:7242/ingest/edd1edcc-d15d-43a6-9166-0f43d8e0a0e0", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    location: "App.tsx:14",
    message: "App component rendering",
    data: { pathname: window.location.pathname },
    timestamp: Date.now(),
    sessionId: "debug-session",
    runId: "run1",
    hypothesisId: "A",
  }),
}).catch(() => {});
// #endregion

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="rotection-theme">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/auth/roblox/callback"
                element={<RobloxCallback />}
              />
              <Route path="/tos" element={<TermsOfService />} />
              <Route path="/pp" element={<PrivacyPolicy />} />
              <Route path="/submit" element={<Submit />} />
              <Route path="/games" element={<Games />} />
              <Route path="/game/:id" element={<GameDetail />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
