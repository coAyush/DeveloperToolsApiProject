import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { User, ChevronDown, Settings, LogOut } from "lucide-react";

const API_BASE = "http://localhost:8080/DeveloperToolsApiProject/api/auth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // mobile menu
  const [toolsOpen, setToolsOpen] = useState(false); // tools dropdown
  const [accountOpen, setAccountOpen] = useState(false); // account dropdown
  const [user, setUser] = useState(null);
  const toolsRef = useRef();
  const accountRef = useRef();
  const navigate = useNavigate();

  // Close dropdowns when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toolsRef.current && !toolsRef.current.contains(event.target)) {
        setToolsOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Check session on mount
  useEffect(() => {
    let mounted = true;
    fetch(`${API_BASE}/me`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        if (data?.authenticated) {
          // adapt to whatever /me returns; example: { authenticated: true, user: { name, email } }
          setUser(data.user || { name: data.name || "Account", email: data.email });
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setAccountOpen(false);
      navigate("/login");
    }
  };

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
                onClick={() => setToolsOpen((s) => !s)}
                className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
                aria-expanded={toolsOpen}
              >
                Tools <ChevronDown size={16} />
              </button>
              {toolsOpen && (
                <div className="absolute bg-white shadow-lg rounded-md mt-2 w-48 z-50 animate-fade-in border border-gray-100">
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
                  <Link
                    to="/tools/uuid"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setToolsOpen(false)}
                  >
                    UUID Generator
                  </Link>
                  <Link
                    to="/tools/pdf-compressor"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setToolsOpen(false)}
                  >
                    PDF Compressor
                  </Link>
                  <Link
                    to="/tools/img-to-pdf"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setToolsOpen(false)}
                  >
                    Image to PDF
                  </Link>
                  <Link
                    to="/tools/word-to-pdf"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setToolsOpen(false)}
                  >
                    Word to PDF
                  </Link>
                  <Link
                    to="/tools/placeholder"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setToolsOpen(false)}
                  >
                    Image Placeholder
                  </Link>
                </div>
              )}
            </div>

            <Link to="/about" className="text-gray-700 hover:text-blue-600">
              About
            </Link>

            {/* Account (shows avatar if logged in) */}
            {!user ? (
              <Link
                to="/login"
                className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
              >
                <User size={20} /> <span>Sign In</span>
              </Link>
            ) : (
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => setAccountOpen((s) => !s)}
                  className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center border border-gray-200 shadow-sm hover:scale-105 transition"
                  aria-label="Account"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white flex items-center justify-center font-semibold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
                  </div>
                </button>

                {accountOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 pb-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">{user?.name || "Account"}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                      onClick={() => setAccountOpen(false)}
                    >
                      <User size={16} /> Profile
                    </Link>

                    <Link
                      to="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                      onClick={() => setAccountOpen(false)}
                    >
                      <Settings size={16} /> Settings
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 w-full text-left"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* show small avatar on mobile if logged in */}
            {user ? (
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => setAccountOpen((s) => !s)}
                  className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center border border-gray-200 shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white flex items-center justify-center font-semibold text-sm">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <User size={14} />}
                  </div>
                </button>

                {accountOpen && (
                  <div className="absolute right-0 top-14 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                      onClick={() => {
                        setAccountOpen(false);
                        setIsOpen(false);
                      }}
                    >
                      <User size={16} /> Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                      onClick={() => {
                        setAccountOpen(false);
                        setIsOpen(false);
                      }}
                    >
                      <Settings size={16} /> Settings
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 w-full text-left"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : null}

            <button
              onClick={() => setIsOpen((s) => !s)}
              className="p-2 rounded-md hover:bg-gray-100"
              aria-expanded={isOpen}
              aria-label="Toggle menu"
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
            onClick={() => setToolsOpen((s) => !s)}
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
              <Link
                to="/tools/uuid"
                className="block text-gray-700 hover:text-blue-600"
                onClick={() => {
                  setIsOpen(false);
                  setToolsOpen(false);
                }}
              >
                UUID Generator
              </Link>
              <Link
                to="/tools/pdf-compressor"
                className="block text-gray-700 hover:text-blue-600"
                onClick={() => {
                  setIsOpen(false);
                  setToolsOpen(false);
                }}
              >
                PDF Compressor
              </Link>
              <Link
                to="/tools/img-to-pdf"
                className="block text-gray-700 hover:text-blue-600"
                onClick={() => {
                  setIsOpen(false);
                  setToolsOpen(false);
                }}
              >
                Image to PDF
              </Link>
              <Link
                to="/tools/word-to-pdf"
                className="block text-gray-700 hover:text-blue-600"
                onClick={() => {
                  setIsOpen(false);
                  setToolsOpen(false);
                }}
              >
                Word to PDF
              </Link>
              <Link
                to="/tools/placeholder"
                className="block text-gray-700 hover:text-blue-600"
                onClick={() => {
                  setIsOpen(false);
                  setToolsOpen(false);
                }}
              >
                Image Placeholder
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

          {/* Mobile Sign In (only when not logged in) */}
          {!user && (
            <Link
              to="/login"
              className="block text-gray-700 hover:text-blue-600"
              onClick={() => setIsOpen(false)}
            >
              <User size={18} className="inline-block mr-1" /> Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
