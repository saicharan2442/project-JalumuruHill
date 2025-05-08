
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TemplesPage from "./pages/TemplesPage";
import DonorsPage from "./pages/DonorsPage";
import EventsPage from "./pages/EventsPage";
import ContactsPage from "./pages/ContactsPage";
import EbooksPage from "./pages/EbooksPage";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/temples" element={<TemplesPage />} />
          <Route path="/donors" element={<DonorsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/ebooks" element={<EbooksPage />} />
          {/* Add more routes as needed */}
          {/* Catch-all route for 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
