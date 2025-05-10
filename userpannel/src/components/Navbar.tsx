import React, { useState } from "react";
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
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <nav className="bg-temple-white border-b border-gold-light/30 sticky top-0 z-50 shadow-sm">
      <div className="temple-container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}


          <Link to="/" className="flex items-center h-full">
            <img
              src="/logo1.png"
              alt="Jalumuru Hill Logo"
              className="h-full max-h-16 object-contain"
            />
          </Link>
          

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
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
  );
};

export default Navbar;
