import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, Loader2, RefreshCw } from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const API_BASE = "http://localhost:8080/DeveloperToolsApiProject/api";

const PasswordGen = () => {
  const [length, setLength] = useState(12);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") navigate(-1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE}/password/generate`, {
        length,
        includeUpper,
        includeNumbers,
        includeSymbols,
      });

      if (data?.password) {
        setPassword(data.password);
        toast.success("Password generated successfully!");
      } else {
        toast.error("No password returned from server.");
      }
    } catch (err) {
      console.error("Error generating password:", err);
      toast.error("Failed to generate password. Check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    toast.success("📋 Password copied to clipboard!");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 px-6 py-20">
      <Toaster
        position="top-right"
        containerStyle={{ top: 80 }} // 
        toastOptions={{
          style: {
            background: "#fff",
            color: "#333",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            fontSize: "14px",
          },
        }}
      />

      {/* Title */}
      <h1 className="text-3xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent mb-10">
        Password Generator
      </h1>

      {/* Card */}
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg space-y-6 hover:shadow-2xl transition">
        {/* Password Length */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Password Length: {length}
          </label>
          <input
            type="range"
            min="6"
            max="32"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeUpper}
              onChange={() => setIncludeUpper(!includeUpper)}
            />
            Uppercase
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={() => setIncludeNumbers(!includeNumbers)}
            />
            Numbers
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={() => setIncludeSymbols(!includeSymbols)}
            />
            Symbols
          </label>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`px-6 py-3 w-full rounded-lg font-semibold text-white shadow-md transition-all flex items-center justify-center gap-2
            ${
              !loading
                ? "bg-gradient-to-r from-blue-600 to-cyan-400 hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
          {loading ? "Generating..." : "Generate Password"}
        </button>

        {/* Output */}
        {password && (
          <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
            <input
              type="text"
              value={password}
              readOnly
              className="flex-1 bg-transparent outline-none text-gray-800 font-mono"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 active:scale-95 transition shadow-sm"
              title="Copy Password"
            >
              <Copy size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordGen;
