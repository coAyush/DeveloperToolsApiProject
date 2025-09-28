import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Mail, Phone, MapPin } from "lucide-react";
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // await axios.post("http://localhost:8080/DeveloperToolsApiProject/api/contact", formData);

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
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message. Try again later!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-blue-50 to-gray-100 px-6 pt-24 pb-16 flex justify-center">
      <Toaster position="bottom-right" reverseOrder={false} />

      {/* 🟦 Medium Sized Card */}
      <div className="bg-white shadow-xl rounded-2xl p-8 md:p-10 max-w-xl w-full">
        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent mb-4">
          Contact Us
        </h1>
        <p className="text-center text-gray-600 mb-6 text-sm md:text-base">
          We'd love to hear from you! Fill out the form below and we'll get back to you soon.
        </p>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6 text-center">
          <div className="flex flex-col items-center">
            <Mail className="text-blue-500 mb-2" />
            <p className="text-gray-700 text-xs md:text-sm">devtoolbox@example.com</p>
          </div>
          <div className="flex flex-col items-center">
            <Phone className="text-blue-500 mb-2" />
            <p className="text-gray-700 text-xs md:text-sm">+91 00000 00000</p>
          </div>
          <div className="flex flex-col items-center">
            <MapPin className="text-blue-500 mb-2" />
            <p className="text-gray-700 text-xs md:text-sm">Kolkata, India</p>
          </div>
        </div>

        {/* Contact Form */}
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

          {/* Buttons */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white shadow-md transition-all
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-cyan-400 hover:scale-105 hover:shadow-lg active:scale-95"
              }`}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
