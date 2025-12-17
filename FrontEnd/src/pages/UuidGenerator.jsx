import React, { useState } from "react";
import { Copy, RefreshCw, Download } from "lucide-react";

// --- UUID GENERATORS ---
function uuidV4() {
  if (window?.crypto?.randomUUID) return crypto.randomUUID();
  const arr = new Uint8Array(16);
  crypto?.getRandomValues ? crypto.getRandomValues(arr) : arr.fill(0);
  arr[6] = (arr[6] & 0x0f) | 0x40; // version 4
  arr[8] = (arr[8] & 0x3f) | 0x80; // variant
  const h = [...arr].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(
    16,
    20
  )}-${h.slice(20)}`;
}

function uuidV1() {
  const now = Date.now(); // ms
  const timeHex = now.toString(16).padStart(12, "0");
  const rand = crypto?.getRandomValues
    ? [...crypto.getRandomValues(new Uint8Array(6))]
    : Array.from({ length: 6 }, () => Math.floor(Math.random() * 256));
  const randHex = rand.map((b) => b.toString(16).padStart(2, "0")).join("");
  // Not a fully RFC-compliant v1, but keeps time-based uniqueness
  return `${timeHex.slice(0, 8)}-${timeHex.slice(8, 12)}-1${timeHex.slice(
    12,
    15
  )}-${randHex.slice(0, 4)}-${randHex.slice(4)}${Math.floor(
    Math.random() * 0xffff
  )
    .toString(16)
    .padStart(4, "0")}`;
}

// --- MAIN COMPONENT ---
export default function UuidGenerator() {
  const [uuids, setUuids] = useState([uuidV4()]);
  const [count, setCount] = useState(1);
  const [version, setVersion] = useState("v4");

  const generateUuids = async () => {
    const gen = version === "v1" ? uuidV1 : uuidV4;
    const newUuids = Array.from({ length: count }, () => gen());
    setUuids(newUuids);

    // Usage tracking
    await fetch(
      "http://localhost:8080/DeveloperToolsApiProject/api/usage/track?tool=UUID Generator",
      {
        method: "POST",
        credentials: "include",
      }
    );
  };

  const copyUuids = async () => {
    try {
      await navigator.clipboard.writeText(uuids.join("\n"));
      alert("UUIDs copied to clipboard!");
    } catch {
      alert("Failed to copy UUIDs");
    }
  };

  const exportToTxt = () => {
    const blob = new Blob([uuids.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `uuids-${version}-${uuids.length}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-blue-50 to-gray-100 px-6 py-24 flex flex-col items-center">
      <h1
        className="text-4xl md:text-6xl font-extrabold text-center mb-12 
                     bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent"
      >
        UUID Generator
      </h1>

      <div
        className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-10 border border-gray-200 
                      w-full max-w-xl flex flex-col items-center"
      >
        {/* Version selector */}
        <div className="flex items-center gap-4 mb-6">
          <label className="text-gray-700 font-medium">Version:</label>
          <select
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="v4">UUID v4 (Random)</option>
            <option value="v1">UUID v1 (Time-based)</option>
          </select>
        </div>

        {/* Slider for how many UUIDs */}
        <div className="flex flex-col items-center mb-6 w-64 mx-auto">
          <label className="text-gray-700 font-medium mb-2">
            How many? <span className="text-blue-600">{count}</span>
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>

        {/* Display UUIDs */}
        <div className="w-full max-h-64 overflow-y-auto bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          {uuids.map((id, idx) => (
            <p
              key={idx}
              className="font-mono text-sm text-gray-800 break-all mb-1"
            >
              {id}
            </p>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={generateUuids}
            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-400 text-white 
                       rounded-lg shadow-md hover:scale-105 transition inline-flex items-center gap-2"
          >
            <RefreshCw size={18} /> Generate
          </button>
          <button
            onClick={copyUuids}
            className="px-5 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg 
                       hover:bg-gray-200 transition inline-flex items-center gap-2"
          >
            <Copy size={18} /> Copy
          </button>
          <button
            onClick={exportToTxt}
            className="px-5 py-2 bg-green-500 text-white rounded-lg 
                       shadow-md hover:scale-105 transition inline-flex items-center gap-2"
          >
            <Download size={18} /> Export
          </button>
        </div>
      </div>
    </div>
  );
}
