
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center bg-temple-cream">
        <div className="text-center p-8">
          <h1 className="text-6xl font-playfair font-bold text-gold-dark mb-4">404</h1>
          <p className="text-xl text-foreground mb-8">
            The divine path you seek is not found
          </p>
          <Link to="/">
            <Button className="bg-gold hover:bg-gold-dark text-foreground font-semibold px-6 py-2 rounded-md transition-all duration-300 shadow-lg hover:shadow-xl">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
