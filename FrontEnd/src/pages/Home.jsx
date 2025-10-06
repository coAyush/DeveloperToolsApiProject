import React, { useState, useEffect } from "react";
import {
  QrCode,
  Link2,
  KeyRound,
  FileText,
  FileImage,
  Image as ImageIcon,
  FileType2,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";
import ChatWidget from "../components/ChatWidget";

const quotes = [
  "🚀 Empower your creativity — the right tools make magic happen.",
  "💡 Small tools, big impact — simplify your workflow today.",
  "🔥 Code smarter, not harder — efficiency is the ultimate skill.",
  "🌍 Share your ideas instantly — because the world moves fast.",
  "✨ Every great project starts with one simple step — let’s begin.",
];

// ✅ All tool data centralized
const tools = [
  {
    icon: QrCode,
    title: "QR Code Generator",
    desc: "Convert any text or link into a QR code instantly. Share easily with your friends or customers.",
    link: "/tools/qr",
  },
  {
    icon: Link2,
    title: "URL Shortener",
    desc: "Turn bulky URLs into sleek links. Share anywhere with confidence.",
    link: "/tools/url",
  },
  {
    icon: KeyRound,
    title: "Password Generator",
    desc: "Create strong, secure passwords with a single click. Stay safe online.",
    link: "/tools/password",
  },
  {
    icon: KeyRound,
    title: "UUID Generator",
    desc: "Generate unique identifiers instantly for your apps, databases, or integrations.",
    link: "/tools/uuid",
  },
  {
    icon: FileText,
    title: "PDF Compressor",
    desc: "Easily compress and reduce the size of your PDF files without losing quality.",
    link: "/tools/pdf-compressor",
  },
  {
    icon: FileImage,
    title: "Image to PDF",
    desc: "Convert one or multiple images into a single PDF file instantly.",
    link: "/tools/img-to-pdf",
  },
  {
    icon: FileType2,
    title: "Word to PDF Converter",
    desc: "Quickly convert your Word (.docx) files into secure, high-quality PDF documents.",
    link: "/tools/word-to-pdf",
  },
  {
    icon: ImageIcon,
    title: "Image Placeholder",
    desc: "Create crisp placeholder images with custom size, colors, and text — perfect for mocks.",
    link: "/tools/placeholder",
  },
];

const ToolCard = ({ icon: Icon, title, desc, link }) => (
  <Link
    to={link}
    className="relative bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-gray-200 
               hover:shadow-2xl hover:scale-[1.03] transition transform group cursor-pointer overflow-hidden block"
  >
    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-10 transition"></div>

    {/* Icon */}
    <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-blue-100 mb-6 group-hover:bg-blue-200 transition relative z-10">
      <Icon size={34} className="text-blue-600" />
    </div>

    {/* Content */}
    <h2 className="text-xl font-bold text-gray-800 mb-3 relative z-10">
      {title}
    </h2>
    <p className="text-sm text-gray-600 mb-6 relative z-10">{desc}</p>

    {/* Button */}
    <span className="px-5 py-2 inline-block bg-gradient-to-r from-blue-600 to-cyan-400 text-white 
                 text-sm font-medium rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition relative z-10">
      Try Now
    </span>
  </Link>
);

const Home = () => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentQuote((prev) => (prev + 1) % quotes.length),
      2500
    );
    return () => clearInterval(interval);
  }, []);

  // ✅ Filter tools based on search input
  const filteredTools = tools.filter((tool) =>
    tool.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        className="text-gray-700 text-base md:text-lg text-center max-w-2xl mb-10 animate-fade-in"
      >
        {quotes[currentQuote]}
      </p>

      {/* ✅ Search Bar */}
      <div className="relative w-full max-w-md mb-16">
        <input
          type="text"
          placeholder="Search for a tool..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-3 pl-12 pr-4 rounded-xl shadow-md border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none 
                     transition-all placeholder-gray-400 text-gray-700 bg-white/80 backdrop-blur-md hover:shadow-lg"
        />
        <Search
          size={20}
          className="absolute left-4 top-3.5 text-gray-500"
        />
      </div>

      {/* Cards Section */}
      {filteredTools.length > 0 ? (
        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredTools.map((tool, index) => (
            <ToolCard key={index} {...tool} />
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center mt-6 text-lg">
          😕 No tools found for "<span className="font-semibold">{searchTerm}</span>"
        </p>
      )}
    </div>
  );
};

export default Home;
