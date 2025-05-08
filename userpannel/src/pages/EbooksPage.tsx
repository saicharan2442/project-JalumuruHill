import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";

const EbooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/ebooks")
      .then((response) => {
        setBooks(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching ebooks:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow py-8 bg-yellow-50">
        <div className="temple-container px-4 sm:px-8">
          <h1 className="text-3xl font-bold text-yellow-800 text-center mb-2">Temple eBooks</h1>
          <h2 className="text-lg text-center text-yellow-700 mb-6 font-medium">
            Download spiritual texts, Telugu mythology, and temple history eBooks.
          </h2>

          {/* Banner-style Card with Jalumuru Image */}
          <div
            className="relative rounded-xl overflow-hidden shadow-md border border-yellow-200 mb-8 h-48 flex items-center justify-between px-6 bg-cover bg-center"
            style={{
              backgroundImage: `url("/src/pages/images/jalamuru hill - Google Maps_page-0001.jpg")`,
            }}
          >
            <h3 className="text-xl md:text-2xl font-semibold text-white bg-yellow-800 bg-opacity-80 px-4 py-2 rounded-md">
              The Story of Jalumuru Hill
            </h3>
            <a
              href="/downloads/jalumuru_story.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white bg-yellow-600 hover:bg-yellow-700 p-3 rounded-full"
              title="Download Story PDF"
            >
              <Download className="w-6 h-6" />
            </a>
          </div>

          {loading ? (
            <div className="text-center text-gray-600">Loading eBooks...</div>
          ) : books.length === 0 ? (
            <div className="text-center text-gray-600">
              No eBooks found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="bg-white rounded-2xl shadow-lg p-3 border border-yellow-200 transition-transform hover:scale-105 hover:shadow-yellow-400/60 hover:shadow-xl flex flex-col justify-between"
                  style={{ height: "380px" }}
                >
                  <img
                    src={book.image_url}
                    alt={book.name}
                    className="w-full h-44 object-cover rounded-t-lg mb-3"
                  />
                  <div className="flex-grow flex flex-col items-center text-center justify-between">
                    <div>
                      <h3 className="text-md font-semibold text-yellow-700 mb-1">{book.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">Format: {book.format}</p>
                      <p className="text-sm text-gray-600">Size: {book.size || "N/A"}</p>
                    </div>
                    <a
                      href={book.download_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full mt-3"
                    >
                      <Button className="bg-yellow-600 hover:bg-yellow-700 text-white w-full">
                        <Download className="mr-2 h-4 w-4" /> Download
                      </Button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-lg text-muted-foreground">More eBooks coming soon...</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EbooksPage;
