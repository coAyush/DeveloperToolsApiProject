import React, { useState } from "react";
import axios from "axios";
import { Upload, FileDown, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const API_BASE = "http://localhost:8080/DeveloperToolsApiProject/convert";

const WordToPdf = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("📄 Please upload a Word (.docx) file first!");
      return;
    }

    if (!file.name.toLowerCase().endsWith(".docx")) {
      toast.error("⚠️ Invalid file format! Only .docx files allowed.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const response = await axios.post(API_BASE, formData, {
        responseType: "blob",
        headers: { "Content-Type": "multipart/form-data" },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        file.name.replace(/\.docx$/i, ".pdf") || "converted.pdf"
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("✅ Word file converted & downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Conversion failed. Please check your backend logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 px-6 py-20">
      {/* Title */}
      <h1 className="text-3xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent mb-10">
        Word to PDF Converter
      </h1>

      {/* Upload Card */}
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg space-y-6 hover:shadow-2xl transition transform hover:scale-[1.02]">
        {/* Upload Area */}
        <div
          className="flex flex-col items-center justify-center border border-dashed border-gray-400 rounded-lg p-8 bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
          onClick={() => document.getElementById("fileInput").click()}
        >
          <Upload size={40} className="text-blue-500 mb-3" />
          <p className="text-gray-500 text-sm text-center">
            {file ? `Selected File: ${file.name}` : "Click here to upload .docx file"}
          </p>
          <input
            id="fileInput"
            type="file"
            accept=".docx"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Convert Button */}
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
          {loading ? <Loader2 className="animate-spin" size={18} /> : <FileDown size={18} />}
          {loading ? "Converting..." : "Convert to PDF"}
        </button>
      </div>
    </div>
  );
};

export default WordToPdf;
