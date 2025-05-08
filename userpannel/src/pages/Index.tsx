
import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MapSection from "@/components/MapSection";
import DonorSection from "@/components/DonorSection";
import EventsSection from "@/components/EventsSection";
import StoriesSection from "@/components/StoriesSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        <div className="md:col-span-2">
          <DonorSection />
        </div>
        <div className="md:col-span-1">
          <MapSection />
        </div>
      </div>
      <EventsSection />
      <StoriesSection />
      <Footer />
    </div>
  );
};

export default Index;
