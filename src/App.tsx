import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import MoodDetection from "./pages/MoodDetection";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
         <Routes>
  <Route path="/" element={<Landing />} />
  <Route path="/detect" element={<MoodDetection />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/auth" element={<Auth />} />
  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
  <Route path="*" element={<NotFound />} />
</Routes>

<h1>Mood music feel</h1>   // <-- add this line

        
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
