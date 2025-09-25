import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const quotes = [
  "🔗 Shorten long links instantly with our URL Shortener.",
  "🔐 Generate strong, secure passwords in seconds.",
  "📱 Create QR codes for your links and share with ease.",
  "⚡ Simplify your workflow with all tools in one place.",
  "🚀 DevToolBox: Small tools, big productivity boost.",
];

const Intro = () => {
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 1500); // change quote every 4s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 text-center px-6 overflow-hidden">
      
      {/* Background decorative blobs */}
      <div className="absolute inset-0">
        <div className="absolute w-[400px] h-[400px] bg-blue-300/30 rounded-full blur-3xl -top-40 -left-40 animate-pulse"></div>
        <div className="absolute w-[350px] h-[350px] bg-cyan-300/30 rounded-full blur-3xl bottom-0 right-0 animate-pulse"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Branding */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-blue-700 mb-6 drop-shadow-sm">
          Welcome to <span className="text-blue-500">DevToolBox</span>
        </h1>

        {/* Rotating Quotes */}
        <p
          key={currentQuote}
          className="text-lg md:text-xl text-gray-700 max-w-2xl mb-10 leading-relaxed animate-fade-in"
        >
          {quotes[currentQuote]}
        </p>

        {/* Buttons */}
        <div className="flex gap-6 justify-center">
          <Link
            to="/login"
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 hover:scale-105 hover:shadow-lg transition transform"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-8 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow-md hover:bg-gray-100 hover:scale-105 hover:shadow-lg transition transform"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Intro;
