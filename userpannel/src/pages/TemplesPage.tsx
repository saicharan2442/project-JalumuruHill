import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Maximize2, X } from "lucide-react";

type Temple = {
  id: number;
  tname: string;
  donar: string;
  village: string;
  district: string;
  ph_no: string;
  image_url?: string;
};

const TemplesPage = () => {
  const [temples, setTemples] = useState<Temple[]>([]);
  const [expandedTemple, setExpandedTemple] = useState<Temple | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/temples")
      .then((res) => res.json())
      .then((data) => setTemples(data))
      .catch((err) => console.error("Error fetching temples:", err));
  }, []);

  const handleExpand = (temple: Temple) => setExpandedTemple(temple);
  const handleClose = () => setExpandedTemple(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-yellow-50 px-4 py-10">
        <h1 className="text-3xl font-bold text-yellow-800 text-center mb-2">Temple Details</h1>
        <p className="text-lg text-yellow-700 text-center mb-8">
          <b>Discover the temples of Jalumuru Hill and the generous devotees behind them.</b>
        </p>

        {temples.length === 0 ? (
          <p className="text-center text-gray-500">No temples found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {temples.map((temple) => (
              <div
                key={temple.id}
                className="bg-white rounded-2xl shadow-lg border border-yellow-200 p-3 transition-transform hover:scale-105 hover:shadow-yellow-400/60 hover:shadow-xl"
              >
                <img
                  src={temple.image_url}
                  alt={temple.tname}
                  className="w-full h-40 object-cover rounded-xl mb-3"
                />
                <h2 className="text-lg font-semibold text-yellow-800 mb-1">{temple.tname}</h2>
                <p className="text-sm text-yellow-700"><strong>Donor:</strong> {temple.donar}</p>
                <p className="text-sm text-yellow-700"><strong>Location:</strong> {temple.village}, {temple.district}</p>
                <div className="text-sm text-yellow-700 flex items-center justify-between mt-1">
                  <p><strong>Phone:</strong> {temple.ph_no}</p>
                  <button onClick={() => handleExpand(temple)} className="text-yellow-600 hover:text-yellow-800">
                    <Maximize2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Expanded Modal with Blurred Background */}
      {expandedTemple && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            {/* Blurred Background */}
            <div
              className="absolute inset-0 bg-cover bg-center blur-xl scale-110"
              style={{
                backgroundImage: `url(${expandedTemple.image_url})`,
                filter: "blur(30px)",
                zIndex: 0,
              }}
            />

            {/* Foreground Content */}
            <div className="relative z-10 p-6 bg-white bg-opacity-80 backdrop-blur-md rounded-2xl flex-1 flex flex-col justify-center items-center">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-600 hover:text-red-600 z-20"
              >
                <X size={22} />
              </button>

              <img
                src={expandedTemple.image_url}
                alt={expandedTemple.tname}
                className="max-h-[60vh] object-contain rounded-xl mb-4"
              />
              <div className="text-center">
                <h2 className="text-2xl font-bold text-yellow-800 mb-2">{expandedTemple.tname}</h2>
                <p className="text-yellow-700 mb-1"><strong>Donor:</strong> {expandedTemple.donar}</p>
                <p className="text-yellow-700 mb-1"><strong>Location:</strong> {expandedTemple.village}, {expandedTemple.district}</p>
                <p className="text-yellow-700"><strong>Phone:</strong> {expandedTemple.ph_no}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default TemplesPage;
