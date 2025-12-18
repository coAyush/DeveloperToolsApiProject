import { useState } from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, X, Mail } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Open email client
    window.location.href = `mailto:devtoolbox@example.com?subject=Message from ${formData.name}&body=${encodeURIComponent(
      formData.message
    )}`;

    // ✅ Show toast notification
    toast.success("Message sent successfully!", {
      style: {
        background: "#ffffff",
        color: "#1e293b",
        fontWeight: "bold",
        borderRadius: "10px",
        fontSize: "14px",
        padding: "10px 16px",
      },
      iconTheme: {
        primary: "#06b6d4",
        secondary: "#fff",
      },
    });

    setFormData({ name: "", email: "", message: "" });
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Toast Container */}
      <Toaster position="bottom-right" reverseOrder={false} />

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
            <Link to="/home" className="hover:text-blue-600 transition">Home</Link>
            <Link to="/about" className="hover:text-blue-600 transition">About</Link>
            <Link to="/contact" className="hover:text-blue-600 transition">Contact</Link>
          </div>

          {/* Contact */}
          <div className="flex flex-col space-y-2 text-sm">
            <h3 className="font-semibold text-gray-700">Contact</h3>
            <Link to={'/contact'}   
              className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition"
            >
              <Mail size={16} /> devtoolbox@example.com
            </Link>
            <div className="flex gap-4 mt-2">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition">
                <Github size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition">
                <Linkedin size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition">
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

      {/* Contact Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md animate-fade-in">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
              Contact Us
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <textarea
                name="message"
                rows="4"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              ></textarea>

              <div className="flex justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-400 text-white hover:shadow-lg hover:scale-105 transition"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
