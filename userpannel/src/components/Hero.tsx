
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative h-[70vh] overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://imgs.search.brave.com/bmVuGU65QMdjCV0m4hGxMwDMXx0aHnqm-i0ck1Ho2ns/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/ZWFydGguY29tL2Fz/c2V0cy9fbmV4dC9p/bWFnZS8_dXJsPWh0/dHBzOi8vY2ZmMi5l/YXJ0aC5jb20vdXBs/b2Fkcy8yMDI1LzAz/LzI0MTYyODUxL2dh/bGF4eS1zcGlyYWwt/SjIzNDUzMjY4LTA0/NDkyNTZfdG9vLW1h/c3NpdmVfMW0tMTQw/MHg4NTAuanBnJnc9/MTIwMCZxPTc1')", 
        }}
      >
        {/* Golden Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gold-dark/70 to-temple-yellow/50"></div>
      </div>
      
      {/* Content */}
      <div className="relative h-full temple-container flex flex-col justify-center items-start text-white">
        <div className="max-w-2xl animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold mb-4 drop-shadow-lg">
            Discover the Divine Bliss of Jalumuru Hill
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-prose">
          Sri vara siddhi vinayaka kshethram          </p>
          <p className="text-lg md:text-xl mb-8 max-w-prose">
            Experience spiritual tranquility and cultural heritage at one of India's most sacred temple sites.
          </p>
          <p><b>NOTE : </b> This website is under Development Stage for Any Temple Donation <br /> Contact to <a href="tel:+918374104423"><b>+91 8374104423</b></a></p><br />

          <Link to="/temples">
            <Button className="bg-gold hover:bg-gold-dark text-foreground font-semibold px-6 py-6 text-lg rounded-md transition-all duration-300 shadow-lg hover:shadow-xl">
              Explore Temples
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
