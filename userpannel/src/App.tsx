import { useEffect, useRef } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DonorsPage from "./pages/DonorsPage";
import TemplesPage from "./pages/TemplesPage";
import EventsPage from "./pages/EventsPage";
import EbooksPage from "./pages/EbooksPage";
import BlogsPage from "./pages/BlogsPage";
import ReelsPage from "./pages/ReelsPage";
import ContactPage from "@/pages/ContactPage";
import TrustLicencePage from "./pages/TrustLicencePage";
import DeveloperPage from "./pages/DeveloperPage";

import ChatBot from "@/components/ChatBot";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      audio.currentTime = 0;
      audio.volume = 0.3;

      const tryPlay = () => {
        audio.play().catch((err) => {
          console.warn("Autoplay blocked:", err);
        });
      };

      tryPlay(); // Try to autoplay on mount

      const handleUserInteraction = () => {
        tryPlay();
        document.removeEventListener("click", handleUserInteraction);
      };

      document.addEventListener("click", handleUserInteraction);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <audio
          ref={audioRef}
          src="/audio/background.mp3"
          autoPlay
          loop
          hidden
        />

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/donors" element={<DonorsPage />} />
            <Route path="/temples" element={<TemplesPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/ebooks" element={<EbooksPage />} />
            <Route path="/trust-licence" element={<TrustLicencePage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/developer" element={<DeveloperPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>

        <ChatBot />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
