import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Facebook,
  Instagram,
  Youtube,
  ChevronDown,
} from "lucide-react";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Temples", path: "/temples" },
  { name: "Donors", path: "/donors" },
  { name: "Events", path: "/events" },
  { name: "Ebooks", path: "/ebooks" },
  { name: "Trust Licence", path: "/trust-licence" },
  { name: "Contact Us", path: "/contact" },
  { name: "Developer", path: "/developer" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showFirstLogo, setShowFirstLogo] = useState(true);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowFirstLogo((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <nav className="bg-temple-white border-b border-gold-light/30 sticky top-0 z-50 shadow-sm">
        <div className="temple-container">
          <div className="flex justify-between items-center h-16">
            {/* Profile Image */}
            <div className="hidden md:flex items-center ml-4 mr-4">
              <img
                src="https://ice.lol/TsFhoL"
                alt="Profile"
                className="h-12 w-9 object-cover rounded-lg border border-gold-light"
              />
            </div>

            {/* Logo */}
            <div className="flex items-center relative w-40 h-full">
              <Link to="/" className="flex items-center h-full relative w-full">
                <img
                  src="/logo.png"
                  alt="Jalumuru Hill Logo"
                  className={`absolute h-full max-h-16 object-contain transition-opacity duration-1000 ease-in-out ${
                    showFirstLogo ? "opacity-100" : "opacity-0"
                  }`}
                />
                <img
                  src="/logo1.png"
                  alt="Jalumuru Hill Logo1"
                  className={`absolute h-full max-h-16 object-contain transition-opacity duration-1000 ease-in-out ${
                    showFirstLogo ? "opacity-0" : "opacity-100"
                  }`}
                />
              </Link>
            </div>

          
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6 ml-auto mr-4">
              {navItems.map((item) => (
                <Link key={item.name} to={item.path} className="nav-link">
                  {item.name}
                </Link>
              ))}

              {/* Optional Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 text-gold-dark hover:text-gold transition"
                >
                  <span>Explore</span>
                  <ChevronDown size={18} />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gold-light rounded-lg shadow-lg z-50">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className="block px-4 py-2 text-sm text-gold-dark hover:bg-temple-cream hover:text-gold rounded-md"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Social Icons */}
            <div className="hidden md:flex items-center space-x-4">
              <a
                href="https://www.facebook.com/YourPage"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-dark hover:text-gold hover:bg-temple-cream p-2 rounded-full"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/YourProfile"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-dark hover:text-gold hover:bg-temple-cream p-2 rounded-full"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.youtube.com/YourChannel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-dark hover:text-gold hover:bg-temple-cream p-2 rounded-full"
              >
                <Youtube size={20} />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={toggleMenu} className="p-2">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden animate-fade-in py-4 bg-temple-white">
              <div className="flex flex-col space-y-3">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="px-4 py-2 hover:bg-temple-cream rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="flex justify-center space-x-4 pt-4 border-t border-gold-light/30 mt-2">
                  <a
                    href="https://www.facebook.com/YourPage"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold-dark hover:text-gold hover:bg-temple-cream p-2 rounded-full"
                  >
                    <Facebook size={20} />
                  </a>
                  <a
                    href="https://www.instagram.com/YourProfile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold-dark hover:text-gold hover:bg-temple-cream p-2 rounded-full"
                  >
                    <Instagram size={20} />
                  </a>
                  <a
                    href="https://www.youtube.com/YourChannel"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold-dark hover:text-gold hover:bg-temple-cream p-2 rounded-full"
                  >
                    <Youtube size={20} />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Marquee Scrolling Text */}
      <div className="bg-temple-cream overflow-hidden whitespace-nowrap border-b border-gold-light">
  <p className="animate-marquee text-gold-dark text-sm py-2 font-medium">
    🌸 Welcome to Jalumuru Hill — A Sacred Journey of Devotion, Culture, and Community | Explore Our Temples | Join Upcoming Events | Access Free Ebooks | Support a Noble Cause 🌸
  </p>
</div>

    </>
  );
};

export default Navbar;
