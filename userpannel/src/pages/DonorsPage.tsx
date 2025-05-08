import React, { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import html2canvas from "html2canvas";
import { Card, CardContent } from "@/components/ui/card";
import { FaDownload } from "react-icons/fa";

type Donor = {
  id: number;
  Name: string;
  village: string;
  district: string;
  email: string;
  phone_number: string;
  donated: string;
  donated_at: string;
};

const numberToWords = (num: number): string => {
  const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  if (num === 0) return "Zero";
  if (num < 0) return "Minus " + numberToWords(Math.abs(num));

  let words = "";

  const numberToWord = (n: number): string =>
    n < 20 ? a[n] : b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : "");

  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const hundred = Math.floor((num % 1000) / 100);
  const remainder = num % 100;

  if (crore) words += numberToWords(crore) + " Crore ";
  if (lakh) words += numberToWords(lakh) + " Lakh ";
  if (thousand) words += numberToWords(thousand) + " Thousand ";
  if (hundred) words += a[hundred] + " Hundred ";
  if (remainder) words += (words ? "and " : "") + numberToWord(remainder);

  return words.trim();
};

const DonorSection: React.FC = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const receiptRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const fetchDonors = async () => {
    try {
      const response = await fetch("http://localhost:5000/donars");
      const data = await response.json();
      setDonors(data);
    } catch (error) {
      console.error("Error fetching donors:", error);
    }
  };

  useEffect(() => {
    fetchDonors();
    const interval = setInterval(fetchDonors, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDownload = async (id: number, name: string) => {
    const element = receiptRefs.current[id];
    if (element) {
      const canvas = await html2canvas(element);
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `${name}_Receipt.png`;
      link.click();
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const filteredDonors = donors.filter((donor) =>
    donor.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donor.phone_number.includes(searchTerm)
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow py-8 bg-yellow-50">
        <div className="temple-container px-4 sm:px-8">
          <h1 className="text-3xl font-bold text-yellow-800 text-center mb-2">All Donors</h1>
          <h2 className="text-lg text-center text-yellow-700 mb-4 font-medium">
            Honoring Our Generous Donors to Jalumuru Hill temples. Who donate ₹ 500+ /-
          </h2>

          <div className="flex justify-center mb-8">
            <input
              type="text"
              placeholder="Search by name or phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-md text-center text-yellow-900 font-medium"
            />
          </div>

          {filteredDonors.length === 0 ? (
            <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg border border-red-300 shadow-sm max-w-2xl mx-auto">
              <p className="text-lg font-semibold mb-2">Oops! No donor found.</p>
              <p className="text-sm text-red-700">
                Your name is not found in the search as a donor. If you have donated, please wait until the database is updated. It may take up to 24 hours due to heavy traffic. <br /> Thank you for your support and patience!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredDonors.map((donor) => (
                <div key={donor.id}>
                  <Card className="bg-yellow-100 rounded-xl border border-yellow-300 overflow-hidden h-[70px]">
                    <CardContent className="flex items-center justify-between px-4 py-2 h-[70px]">
                      <div className="flex flex-col overflow-hidden">
                        <p className="text-sm font-semibold text-yellow-800 truncate">
                          {donor.Name}
                        </p>
                        <p className="text-xs text-yellow-700">
                          Donated on {formatDate(donor.donated_at)}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          ₹{donor.donated}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDownload(donor.id, donor.Name)}
                        className="text-yellow-700 hover:text-yellow-900"
                        title="Download Receipt"
                      >
                        <FaDownload size={16} />
                      </button>
                    </CardContent>
                  </Card>

                  {/* Hidden Receipt */}
                  <div
                    ref={(el) => (receiptRefs.current[donor.id] = el)}
                    style={{
                      position: "absolute",
                      left: "-9999px",
                      width: "1000px",
                      height: "590px",
                      backgroundImage: `url("src/pages/images/payment receipt.png")`,
                      backgroundSize: "cover",
                      fontFamily: "serif",
                      color: "white",
                      padding: "40px",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "80px",
                        left: "580px",
                        fontSize: "24px",
                        color: "#fff",
                        lineHeight: "1.8",
                      }}
                    >
                      <p><strong>Name:</strong> {donor.Name}</p>
                      <p><strong>Phone:</strong> {donor.phone_number}</p>
                      <p><strong>Email:</strong> {donor.email}</p>
                      <p><strong>Address:</strong> {donor.village}, {donor.district}</p>
                      <p><strong>Donated On:</strong> {formatDate(donor.donated_at)}</p>
                      <p><strong>Date of Download:</strong> {formatDate(new Date().toISOString())}</p>
                      <p><strong>Time of Download:</strong> {new Date().toLocaleTimeString()}</p>
                      <p style={{ marginTop: "50px", fontSize: "30px", fontWeight: "bold" }}>
                        Donated Amount: ₹{donor.donated}
                      </p>
                      <p style={{ fontSize: "20px", marginTop: "10px", fontStyle: "italic" }}>
                        ({numberToWords(parseInt(donor.donated))} Rupees only)
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DonorSection;
