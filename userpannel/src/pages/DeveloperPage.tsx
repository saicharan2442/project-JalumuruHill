import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const DeveloperPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailClick = () => {
    const { name, email, subject, message } = formData;

    // Construct the body of the email
    const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0A${message}`;
    const mailtoLink = `mailto:fastrack2442@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;

    // Trigger the local mail client
    window.location.href = mailtoLink;
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />

      <div className="flex-grow py-12 bg-temple-cream">
        <div className="temple-container">
          <h1 className="section-title">Developer Information</h1>
          <p className="text-lg mb-8">
            This page contains information about the developers who created and maintain this website.
          </p>
          <div className="bg-white rounded-lg shadow-md p-8 border border-gold-light/30">
            <div className="text-center mb-8">
              <h2 className="font-playfair text-2xl font-semibold text-gold-dark mb-4">About the Developer</h2>
              <img
                src="/src/pages/images/sadas.png"
                alt="Developer"
                style={{
                  display: "block",
                  margin: "0 auto",
                  width: "180px",
                  height: "180px",
                  borderRadius: "8px",
                }}
              />
              <p className="max-w-2xl mx-auto">
                <b>saicharan_sada<br />AI & Data Science Engineer</b><br /><br />
                This website was designed and developed with care to showcase the spiritual and cultural richness of Jalumuru Hill and its temples.
              </p>
            </div>

            <div className="mt-8 p-6 bg-temple-cream rounded-md">
              <h3 className="font-playfair text-xl font-semibold text-gold-dark mb-4 text-center">
                Contact the Development Team
              </h3>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-2 border border-gold-light/30 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-light"
                      placeholder="Your Name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-2 border border-gold-light/30 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-light"
                      placeholder="Your Email"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <input
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full p-2 border border-gold-light/30 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-light"
                    placeholder="Subject"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full p-2 border border-gold-light/30 rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-gold-light"
                    placeholder="Your Message"
                    required
                  ></textarea>
                </div>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleEmailClick}
                    className="bg-gold hover:bg-gold-dark text-foreground font-semibold px-6 py-2 rounded-md transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Send Email
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DeveloperPage;
