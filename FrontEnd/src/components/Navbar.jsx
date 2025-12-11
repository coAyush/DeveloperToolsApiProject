import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { User, ChevronDown, Settings, LogOut } from "lucide-react";

const API_BASE = "http://localhost:8080/DeveloperToolsApiProject/api/auth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [user, setUser] = useState(null);
  const toolsRef = useRef();
  const accountRef = useRef();
  const navigate = useNavigate();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target)) {
        setToolsOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load logged-in user
  useEffect(() => {
    fetch(`${API_BASE}/me`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.authenticated) {
          setUser({ name: data.name, email: data.email });
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, []);

  // Logout
  const handleLogout = async () => {
    await fetch(`${API_BASE}/logout`, {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    setAccountOpen(false);
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* LOGO */}
          <Link to="/home" className="text-2xl font-bold text-blue-600">
            DevToolBox
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">

            <Link to="/home" className="hover:text-blue-600 text-gray-700">Home</Link>

            {/* Tools Dropdown */}
            <div className="relative" ref={toolsRef}>
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                className="flex items-center gap-1 cursor-pointer text-gray-700 hover:text-blue-600"
              >
                Tools <ChevronDown size={16} />
              </button>

              {toolsOpen && (
                <div className="absolute bg-white shadow-lg rounded-md mt-2 w-48 border p-2 z-50">
                  <Link to="/tools/qr" className="block px-4 py-2 hover:bg-gray-100">QR Generator</Link>
                  <Link to="/tools/url" className="block px-4 py-2 hover:bg-gray-100">URL Shortener</Link>
                  <Link to="/tools/password" className="block px-4 py-2 hover:bg-gray-100">Password Generator</Link>
                  <Link to="/tools/uuid" className="block px-4 py-2 hover:bg-gray-100">UUID Generator</Link>
                  <Link to="/tools/pdf-compressor" className="block px-4 py-2 hover:bg-gray-100">PDF Compressor</Link>
                  <Link to="/tools/img-to-pdf" className="block px-4 py-2 hover:bg-gray-100">Image to PDF</Link>
                  <Link to="/tools/word-to-pdf" className="block px-4 py-2 hover:bg-gray-100">Word to PDF</Link>
                  <Link to="/tools/placeholder" className="block px-4 py-2 hover:bg-gray-100">Image Placeholder</Link>
                </div>
              )}
            </div>

            <Link to="/about" className="hover:text-blue-600 text-gray-700">About</Link>

            {/* ACCOUNT DROPDOWN */}
            {!user ? (
              <Link to="/login" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                <User size={20} /> Sign In
              </Link>
            ) : (
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="w-10 h-10 rounded-full border shadow-sm bg-gradient-to-br from-blue-500 to-cyan-400 text-white font-bold"
                >
                  {user.name.charAt(0).toUpperCase()}
                </button>

                {accountOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg p-2 z-50 border">
                    <p className="px-4 py-2 text-sm font-semibold">{user.name}</p>
                    <p className="px-4 text-xs text-gray-500 mb-2">{user.email}</p>

                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                      <User size={16}/> Profile
                    </Link>

                    <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                      <Settings size={16}/> Settings
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <LogOut size={16}/> Logout
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-2xl"
          >
            ☰
          </button>

        </div>
      </div>

      {/* Mobile menu (you already have it – optional to update) */}
      {isOpen && (
        <div className="md:hidden bg-white p-4 shadow-md">
          {/* Add mobile menu items... */}
        </div>
      )}

    </nav>
  );
};

export default Navbar;
