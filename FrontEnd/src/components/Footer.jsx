
import { Link } from "react-router-dom";
import { Github, Linkedin, X, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white shadow-md border-t border-gray-200 text-gray-600">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold text-blue-600">DevToolBox</h2>
          <p className="text-sm mt-2 text-gray-500">
            Handy tools for developers: QR, URL Shortener, Password Generator 🚀
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col space-y-2 text-sm">
          <h3 className="font-semibold text-gray-700">Quick Links</h3>
          <Link to="/" className="hover:text-blue-600 transition">Home</Link>
          <Link to="/about" className="hover:text-blue-600 transition">About</Link>
          <Link to="/tools" className="hover:text-blue-600 transition">Tools</Link>
        </div>

        {/* Contact */}
        <div className="flex flex-col space-y-2 text-sm">
          <h3 className="font-semibold text-gray-700">Contact</h3>
          <a
            href="mailto:devtoolbox@example.com"
            className="flex items-center gap-2 hover:text-blue-600 transition"
          >
            <Mail size={16} /> devtoolbox@example.com
          </a>
          <div className="flex gap-4 mt-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 transition"
            >
              <Github size={18} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 transition"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 transition"
            >
              <X size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="text-center text-xs text-gray-500 py-3 border-t border-gray-200">
        © {new Date().getFullYear()} DevToolBox. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
