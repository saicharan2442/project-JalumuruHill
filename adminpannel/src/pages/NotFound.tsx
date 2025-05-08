
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center max-w-md px-6">
        <h1 className="text-6xl font-bold text-temple-800 dark:text-temple-200 mb-6">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>
        <p className="text-muted-foreground mb-8">
          The page you requested could not be found. It might have been removed, renamed, or did not exist in the first place.
        </p>
        <Button asChild className="temple-button">
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
