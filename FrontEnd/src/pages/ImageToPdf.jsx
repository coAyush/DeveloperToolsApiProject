import React, { useState } from "react";
import axios from "axios";
import { Upload, FileDown, Loader2, Images } from "lucide-react";
import toast from "react-hot-toast"; // ✅ bas toast import, Toaster nahi (global App.js wala use hoga)

const API_BASE = "http://localhost:8080/DeveloperToolsApiProject/api/ImgToPdf";

const ImageToPdf = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      toast.error("Please select at least one image!");
      return;
    }

    const formData = new FormData();
    if (files.length === 1) {
      formData.append("file", files[0]); // single image endpoint ke liye
    } else {
      files.forEach((file) => formData.append("files", file)); // multiple images
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE}/${files.length === 1 ? "single" : "multiple"}`, 
        formData,
        {
          responseType: "blob",
           withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // ✅ Download PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", files.length === 1 ? "image.pdf" : "images.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("✅ PDF generated & downloaded!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to convert images. Check backend!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 px-6 py-20">

      <h1 className="text-3xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent mb-10">
        Image to PDF Converter
      </h1>

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg space-y-6 hover:shadow-2xl transition">
        {/* Upload Section */}
        <div
          className="flex flex-col items-center justify-center border border-dashed border-gray-400 rounded-lg p-8 bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
          onClick={() => document.getElementById("fileInput").click()}
        >
          <Images size={50} className="text-blue-500 mb-3" />
          <p className="text-gray-500 text-sm text-center">
            {files.length > 0
              ? `${files.length} file(s) selected`
              : "Click to upload one or multiple images"}
          </p>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            multiple
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
          {loading ? "Converting..." : "Convert & Download"}
        </button>
      </div>
    </div>
  );
};

export default ImageToPdf;
