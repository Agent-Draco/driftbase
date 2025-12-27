import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import ChatPage from "./pages/ChatPage";
import MembersPage from "./pages/MembersPage";
import CalendarPage from "./pages/CalendarPage";
import LogsPage from "./pages/LogsPage";
import HallOfFamePage from "./pages/HallOfFamePage";
import HallOfShamePage from "./pages/HallOfShamePage";
import ProcessesPage from "./pages/ProcessesPage";
import TraditionsPage from "./pages/TraditionsPage";
import VoicePage from "./pages/VoicePage";
import { AppLayout } from "./components/layout/AppLayout";

const queryClient = new QueryClient();

// Wrapper component for pages that need the layout
const WithLayout = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <AppLayout>{children}</AppLayout>
  </ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/chat" element={<WithLayout><ChatPage /></WithLayout>} />
            <Route path="/members" element={<WithLayout><MembersPage /></WithLayout>} />
            <Route path="/calendar" element={<WithLayout><CalendarPage /></WithLayout>} />
            <Route path="/logs" element={<WithLayout><LogsPage /></WithLayout>} />
            <Route path="/hall-of-fame" element={<WithLayout><HallOfFamePage /></WithLayout>} />
            <Route path="/hall-of-shame" element={<WithLayout><HallOfShamePage /></WithLayout>} />
            <Route path="/processes" element={<WithLayout><ProcessesPage /></WithLayout>} />
            <Route path="/traditions" element={<WithLayout><TraditionsPage /></WithLayout>} />
            <Route path="/voice" element={<WithLayout><VoicePage /></WithLayout>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
