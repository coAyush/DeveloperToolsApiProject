import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { User, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // mobile menu
  const [toolsOpen, setToolsOpen] = useState(false); // tools dropdown

  const toolsRef = useRef();

  // Close tools dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (toolsRef.current && !toolsRef.current.contains(event.target)) {
        setToolsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            to="/home"
            className="text-2xl font-bold text-blue-600 hover:scale-105 transition-transform"
          >
            DevToolBox
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/home" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>

            {/* Tools Dropdown */}
            <div className="relative" ref={toolsRef}>
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
              >
                Tools <ChevronDown size={16} />
              </button>
              {toolsOpen && (
                <div className="absolute bg-white shadow-lg rounded-md mt-2 w-44 z-50 animate-fade-in">
                  <Link
                    to="/tools/qr"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setToolsOpen(false)}
                  >
                    QR Generator
                  </Link>
                  <Link
                    to="/tools/url"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setToolsOpen(false)}
                  >
                    URL Shortener
                  </Link>
                  <Link
                    to="/tools/password"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setToolsOpen(false)}
                  >
                    Password Generator
                  </Link>
                </div>
              )}
            </div>

            <Link to="/about" className="text-gray-700 hover:text-blue-600">
              About
            </Link>

            {/* Account */}
            <Link
              to="/login"
              className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
            >
              <User size={20} /> <span>Sign In</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md px-4 py-2 space-y-2 animate-slide-down">
          <Link
            to="/home"
            className="block text-gray-700 hover:text-blue-600"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <button
            className="block w-full text-left text-gray-700 hover:text-blue-600"
            onClick={() => setToolsOpen(!toolsOpen)}
          >
            Tools <ChevronDown size={14} className="inline ml-1" />
          </button>
          {toolsOpen && (
            <div className="ml-4 space-y-1 animate-slide-down">
              <Link
                to="/tools/qr"
                className="block text-gray-700 hover:text-blue-600"
                onClick={() => {
                  setIsOpen(false);
                  setToolsOpen(false);
                }}
              >
                QR Generator
              </Link>
              <Link
                to="/tools/url"
                className="block text-gray-700 hover:text-blue-600"
                onClick={() => {
                  setIsOpen(false);
                  setToolsOpen(false);
                }}
              >
                URL Shortener
              </Link>
              <Link
                to="/tools/password"
                className="block text-gray-700 hover:text-blue-600"
                onClick={() => {
                  setIsOpen(false);
                  setToolsOpen(false);
                }}
              >
                Password Generator
              </Link>
            </div>
          )}
          <Link
            to="/about"
            className="block text-gray-700 hover:text-blue-600"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            to="/login"
            className="block text-gray-700 hover:text-blue-600"
            onClick={() => setIsOpen(false)}
          >
            <User size={18} className="inline-block mr-1" /> Sign In
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
