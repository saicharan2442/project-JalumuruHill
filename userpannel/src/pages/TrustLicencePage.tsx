import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TrustLicencePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow py-12 bg-temple-cream">
        <div className="temple-container">
          <h1 className="section-title">Trust Licence Documentation</h1>
          <p className="text-lg mb-8">
            View official trust licences, certifications, and legal documents related to Jalumuru Hill temples.
          </p>

          {/* Image Container */}
          <div className="bg-white rounded-lg shadow-md p-8 border border-gold-light/30 flex justify-center items-center">
            
            {/* A4 Size Image with Mobile Responsiveness */}
            <img
              src="/src/pages/images/fake.png" 
              alt="Trust Licence Document"
              className="w-full max-w-[210mm] h-auto md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%] shadow-lg rounded-md"
            />
          </div>
          
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TrustLicencePage;
