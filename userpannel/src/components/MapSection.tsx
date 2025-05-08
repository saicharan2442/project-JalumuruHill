
import React from "react";

const MapSection = () => {
  return (
    <div className="bg-temple-cream py-8">
      <div className="temple-container">
        <h2 className="section-title">Find Us</h2>
        <div className="bg-white rounded-lg shadow-md p-4 border border-gold-light/30">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4896.556923063505!2d84.04297969064221!3d18.506959441519847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3c4500f0c66077%3A0xe6836bdbf50fe24a!2sSri%20vara%20siddhi%20vinayaka%20kshethram!5e1!3m2!1sen!2sin!4v1743317744478!5m2!1sen!2sin" 
            width="100%" 
            height="350" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Jalumuru Hill Temple Map"
            className="rounded-md"
          ></iframe>
          <div className="mt-4">
            <h3 className="font-playfair text-xl font-semibold text-gold-dark">Sri vara siddhi vinayaka kshethram</h3>
            <p className="text-foreground/80 mt-2">Come visit us and experience divine peace and spiritual tranquility at Jalumuru Hill.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSection;
