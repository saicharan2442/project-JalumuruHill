import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Contact = {
  id: number;
  name: string;
  role: string;
  email: string;
  mobile_number: string;
  image_url: string;
};

const ContactPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null); // To store the URL of the enlarged image

  useEffect(() => {
    // Adjusted URL to fetch contacts from backend
    fetch("http://localhost:5000/api/contacts") // Backend API endpoint
      .then((res) => res.json())
      .then((data) => setContacts(data))
      .catch((err) => console.error("Error fetching contacts:", err));
  }, []);

  const handleMouseDown = (imageUrl: string) => {
    setEnlargedImage(imageUrl); // Set the enlarged image when mouse is held
  };

  const handleMouseUp = () => {
    setEnlargedImage(null); // Reset when mouse is released
  };

  const closePopup = () => {
    setEnlargedImage(null); // Close the popup when clicked outside of the image
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow py-10 px-4 sm:px-8 bg-yellow-50">
        <h1 className="text-3xl font-bold text-yellow-800 text-center mb-2">Contact Us</h1>
        <p className="text-lg text-yellow-700 text-center mb-8">
          <b>Get in touch with our team for more information or queries.</b>
        </p>

        {contacts.length === 0 ? (
          <p className="text-center text-gray-500">No contact information found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white rounded-2xl shadow-lg p-4 border border-yellow-200 transition-transform hover:scale-105 hover:shadow-yellow-400/60 hover:shadow-xl flex flex-col"
              >
                <div className="flex items-start gap-4 mb-3">
                  <div
                    onMouseDown={() => handleMouseDown(contact.image_url)} // Trigger the enlargement on mouse hold
                    onMouseUp={handleMouseUp} // Reset on mouse release
                    className="relative"
                  >
                    <img
                      src={contact.image_url} // This should be a valid image URL or path
                      alt={contact.name}
                      className="w-20 h-20 object-cover rounded-full border-2 border-yellow-200"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-800 mb-1">{contact.name}</h3>
                    <p className="text-sm font-medium text-yellow-600">{contact.role}</p>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-sm text-yellow-700 hover:text-yellow-500 mb-2 block"
                    >
                      {contact.email}
                    </a>
                    <a
                      href={`tel:${contact.mobile_number}`} // Ensure this matches your backend field name
                      className="text-sm text-yellow-700 hover:text-yellow-500"
                    >
                      {contact.mobile_number} {/* Adjusted to show phone number from backend */}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Image Popup */}
      {enlargedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closePopup}
        >
          <div className="relative">
            <img
              src={enlargedImage}
              alt="Enlarged"
              className="max-w-full max-h-screen object-contain"
            />
            <button
              onClick={closePopup}
              className="absolute top-0 right-0 m-4 text-white text-2xl"
            >
              ✖
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ContactPage;
