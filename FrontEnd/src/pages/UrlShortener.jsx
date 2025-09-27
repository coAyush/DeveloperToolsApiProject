import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Link2,
  Scissors,
  Copy,
  ExternalLink,
  AlertCircle,
  Loader2,
} from "lucide-react";

const API_BASE = "http://localhost:8080/DeveloperToolsApiProject/api"; // ← adjust if needed

const isValidUrl = (value) => {
  try {
    const u = new URL(value);
    return !!u.protocol && !!u.host;
  } catch {
    return false;
  }
};

const UrlShortener = () => {
  const [longUrl, setLongUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [result, setResult] = useState(null); // { shortUrl, code? }
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        navigate(-1); // go back to previous page
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  const handleShorten = async () => {
    setErr("");
    setResult(null);

    if (!isValidUrl(longUrl)) {
      setErr("Please enter a valid URL (including http:// or https://).");
      return;
    }

    setLoading(true);
    try {
      const payload = { url: longUrl };
      if (alias.trim()) payload.alias = alias.trim();

      const { data } = await axios.post(`${API_BASE}/shorten`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      const shortUrl = data?.shortUrl || data?.short || data?.data?.shortUrl;
      const code = data?.code || data?.id || data?.data?.code;

      if (!shortUrl) {
        setErr("No shortened URL returned from server.");
      } else {
        setResult({ shortUrl, code });
      }
    } catch (e) {
      console.error(e);
      setErr(
        e?.response?.data?.message ||
          "Failed to shorten URL. Check backend and network."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result?.shortUrl) return;
    try {
      await navigator.clipboard.writeText(result.shortUrl);
      // quick visual hint using focus ring:
      const el = document.getElementById("short-url");
      if (el) {
        el.classList.add("ring-2", "ring-cyan-400");
        setTimeout(() => el.classList.remove("ring-2", "ring-cyan-400"), 650);
      }
    } catch {}
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 px-6 py-20">
      <h1 className="text-3xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent mb-10">
        URL Shortener
      </h1>

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg transform transition-all hover:scale-[1.02] hover:shadow-2xl space-y-6">
        {/* Long URL */}
        <div>
          {/* <label className="block text-sm font-semibold text-gray-700 mb-2">
            Long URL
          </label> */}
          <div className="flex items-center gap-3">
            {/* <Link2 className="text-blue-500" size={20} /> */}
            <input
              type="url"
              placeholder="Enter your long URL"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition-all hover:border-blue-400"
            />
          </div>
        </div>

        {/* Optional custom alias */}
        <div>
          {/* <label className="block text-sm font-semibold text-gray-700 mb-2">
            Custom Alias (optional)
          </label> */}
          <input
            type="text"
            placeholder="Custom alias (optional)"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition-all hover:border-blue-400"
          />
          <p className="text-xs text-gray-500 mt-1">
            Remove later if not added in backend.
          </p>
        </div>

        {/* Error */}
        {err && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-3">
            <AlertCircle className="text-red-500 mt-[2px]" size={18} />
            <p className="text-sm text-red-700">{err}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-center">
          <button
            onClick={handleShorten}
            disabled={!longUrl || loading}
            className={`px-6 py-3 rounded-lg font-semibold text-white shadow-md transition-all flex items-center gap-2
              ${
                longUrl && !loading
                  ? "bg-gradient-to-r from-blue-600 to-cyan-400 hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Scissors size={18} />
            )}
            {loading ? "Shortening..." : "Shorten"}
          </button>
        </div>

        {/* Result */}
        {result?.shortUrl && (
          <div className="mt-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
            <p className="text-sm text-gray-600 mb-2">Your shortened URL</p>
            <div className="flex items-center gap-2">
              <input
                id="short-url"
                readOnly
                value={result.shortUrl}
                className="w-full p-3 rounded-lg bg-white border border-gray-300 text-gray-900"
              />
              <button
                onClick={handleCopy}
                className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 active:scale-95 transition shadow-sm"
                title="Copy"
              >
                <Copy size={18} />
              </button>
              <a
                href={result.shortUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 active:scale-95 transition shadow-sm"
                title="Open"
              >
                <ExternalLink size={18} />
              </a>
            </div>

            {result.code && (
              <p className="text-xs text-gray-500 mt-2">
                Code: <span className="font-mono">{result.code}</span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlShortener;
