import React, { useState, useRef } from "react";
import { Download, QrCode } from "lucide-react";
import axios from "axios";

const QrTool = () => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [qrPreview, setQrPreview] = useState(null); // ✅ store backend QR
  const fileInputRef = useRef(null);

  // ✅ Generate QR from backend
  const handleGenerate = async () => {
    const formData = new FormData();
    if (text) formData.append("text", text);
    if (file) formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:8080/DeveloperToolsApiProject/api/qr",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("QR Response:", res.data);

      // ✅ backend already returns full dataURL → just use directly
      if (res.data.qrImageBase64) {
        setQrPreview(res.data.qrImageBase64);
      } else {
        alert("No QR returned from server.");
      }
    } catch (err) {
      console.error("Error generating QR:", err);
      alert("Failed to generate QR. Check backend logs.");
    }
  };

  // ✅ Download QR
  const handleDownload = () => {
    if (!qrPreview) return;
    const link = document.createElement("a");
    link.href = qrPreview;
    link.download = "qr-code.png";
    link.click();
  };

  const handleFileClick = () => fileInputRef.current.click();
  const handleFileChange = (e) => setFile(e.target.files[0]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 px-6 py-20">
      {/* Title */}
      <h1 className="text-3xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent mb-10">
        QR Code Generator
      </h1>

      {/* Card */}
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg transform transition-all hover:scale-[1.02] hover:shadow-2xl space-y-6">
        {/* Input Text */}
        <input
          type="text"
          placeholder="Enter text or URL"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition-all hover:border-blue-400"
        />

        {/* QR Upload Preview */}
        <div
          className="flex flex-col items-center justify-center border border-dashed border-gray-400 rounded-lg p-8 bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
          onClick={handleFileClick}
        >
          <QrCode size={90} className="text-blue-500 mb-3 hover:scale-110 transition-transform" />
          <p className="text-gray-500 text-sm text-center">
            {file ? `Uploaded: ${file.name}` : "Click QR to upload a file"}
          </p>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!text && !file}
            className={`px-6 py-3 rounded-lg font-semibold text-white shadow-md transition-all 
              ${
                text || file
                  ? "bg-gradient-to-r from-blue-600 to-cyan-400 hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            Generate
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={!qrPreview}
            className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-md transition-all
              ${
                qrPreview
                  ? "bg-gray-200 text-gray-800 hover:bg-gray-300 hover:scale-105 active:scale-95 cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            <Download size={18} /> Download
          </button>
        </div>

        {/* ✅ QR Preview */}
        {qrPreview && (
          <div className="flex justify-center mt-6 animate-fade-in">
            <img
              src={qrPreview}
              alt="QR Code"
              className="w-48 h-48 rounded-lg shadow-md"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default QrTool;
