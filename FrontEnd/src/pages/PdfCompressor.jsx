import React, { useState } from "react";
import axios from "axios";
import { FileDown, Loader2, Upload } from "lucide-react";
import toast from "react-hot-toast";  

const API_BASE = "http://localhost:8080/DeveloperToolsApiProject/api/pdf";

const PdfCompressor = () => {
  const [file, setFile] = useState(null);
  const [level, setLevel] = useState("medium");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please upload a PDF file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("level", level);

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/compress`, formData, {
        responseType: "blob",
         withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "compressed.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("✅ PDF compressed & downloaded!");
    } catch (error) {
      console.error(error);
      toast.error("Compression failed. Check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 px-6 py-20">
      <h1 className="text-3xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent mb-10">
        PDF Compressor
      </h1>

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg space-y-6 hover:shadow-2xl transition">
        {/* File Upload */}
        <div
          className="flex flex-col items-center justify-center border border-dashed border-gray-400 rounded-lg p-8 bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
          onClick={() => document.getElementById("fileInput").click()}
        >
          <Upload size={40} className="text-blue-500 mb-3" />
          <p className="text-gray-500 text-sm text-center">
            {file ? `Selected: ${file.name}` : "Click here to upload PDF"}
          </p>
          <input
            id="fileInput"
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Compression Level */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Compression Level
          </label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="low">Low (max compression, lower quality)</option>
            <option value="medium">Medium (balanced)</option>
            <option value="high">High (less compression, better quality)</option>
          </select>
        </div>

        {/* Compress Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`px-6 py-3 w-full rounded-lg font-semibold text-white shadow-md transition-all flex items-center justify-center gap-2
            ${
              !loading
                ? "bg-gradient-to-r from-blue-600 to-cyan-400 hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <FileDown size={18} />
          )}
          {loading ? "Compressing..." : "Compress & Download"}
        </button>
      </div>
    </div>
  );
};

export default PdfCompressor;
