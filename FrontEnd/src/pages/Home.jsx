import React, { useState, useEffect } from "react";
import { QrCode, Link2, KeyRound } from "lucide-react";
import { Link } from "react-router-dom";

const quotes = [
  "🚀 Empower your creativity — the right tools make magic happen.",
  "💡 Small tools, big impact — simplify your workflow today.",
  "🔥 Code smarter, not harder — efficiency is the ultimate skill.",
  "🌍 Share your ideas instantly — because the world moves fast.",
  "✨ Every great project starts with one simple step — let’s begin.",
];

const ToolCard = ({ icon: Icon, title, desc, link }) => (
  <Link
    to={link}
    className="relative bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-gray-200 
               hover:shadow-2xl hover:scale-[1.03] transition transform group cursor-pointer overflow-hidden block"
  >
    {/* Gradient Hover Overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 
                    opacity-0 group-hover:opacity-10 transition"></div>

    {/* Icon */}
    <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-blue-100 mb-6 
                    group-hover:bg-blue-200 transition relative z-10">
      <Icon size={34} className="text-blue-600" />
    </div>

    {/* Content */}
    <h2 className="text-xl font-bold text-gray-800 mb-3 relative z-10">{title}</h2>
    <p className="text-sm text-gray-600 mb-6 relative z-10">{desc}</p>

    {/* Button Style but not actual button */}
    <span
      className="px-5 py-2 inline-block bg-gradient-to-r from-blue-600 to-cyan-400 text-white 
                 text-sm font-medium rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition relative z-10"
    >
      Try Now
    </span>
  </Link>
);

const Home = () => {
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentQuote((prev) => (prev + 1) % quotes.length),
      2500
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-blue-50 to-gray-100 px-6 py-24 flex flex-col items-center">
      {/* Heading Section */}
      <h1 className="text-4xl md:text-6xl font-extrabold text-center mb-4 
                     bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
        Welcome to DevToolBox
      </h1>

      {/* Rotating Quotes */}
      <p
        key={currentQuote}
        className="text-gray-700 text-base md:text-lg text-center max-w-2xl mb-16 animate-fade-in"
      >
        {quotes[currentQuote]}
      </p>

      {/* Cards Section */}
      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        <ToolCard
          icon={QrCode}
          title="QR Code Generator"
          desc="Convert any text or link into a QR code instantly. Share easily with your friends or customers."
          link="/tools/qr"
        />
      </div>
    </div>
  );
};

export default Home;
