import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BlogsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow py-10 px-4 sm:px-8 bg-yellow-50">
        <h1 className="text-3xl font-bold text-yellow-800 text-center mb-4">Our Blog</h1>
        <p className="text-lg text-yellow-700 text-center mb-8">
          <b>Explore updates, stories, and news from Jalumuru Hill.</b>
        </p>

        <div className="bg-white rounded-2xl shadow-lg border border-yellow-200 overflow-hidden">
          <iframe
            src="https://jalamuru.blogspot.com/2025/05/jalumuruhill-srikakulam-andhra-pradesh.html"
            style={{ width: "100%", height: "495vh", border: "none" }}
            title="Jalumuru Blog"
          ></iframe>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogsPage;
