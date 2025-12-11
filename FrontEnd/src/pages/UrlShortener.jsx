import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Scissors,
  Copy,
  ExternalLink,
  AlertCircle,
  Loader2,
} from "lucide-react";

/**
 * Keep this matching your backend context path
 * (you used DeveloperToolsApiProject earlier)
 */
const API_BASE = "http://localhost:8080/DeveloperToolsApiProject/api";

const isValidUrl = (value) => {
  if (!value) return false;
  try {
    // ensure trimmed value is a proper URL
    const u = new URL(value.trim());
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
  const [copyMsg, setCopyMsg] = useState(""); // small feedback
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") navigate(-1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  const handleShorten = async () => {
    setErr("");
    setResult(null);
    setCopyMsg("");

    const urlValue = longUrl.trim();
    if (!isValidUrl(urlValue)) {
      setErr("Please enter a valid URL (including http:// or https://).");
      return;
    }

    const trimmedAlias = alias.trim();
    if (trimmedAlias && !/^[A-Za-z0-9_-]{1,64}$/.test(trimmedAlias)) {
      setErr("Alias can contain letters, numbers, _ and - only (max 64).");
      return;
    }

    setLoading(true);

    try {
      const payload = { url: urlValue };
      if (trimmedAlias) payload.alias = trimmedAlias;

      const { data } = await axios.post(`${API_BASE}/url/shorten`, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, // uncomment if your backend needs session cookie
      });

      // backend returns { shortUrl, code } (preferred)
      if (data && typeof data === "object" && data.shortUrl) {
        setResult({ shortUrl: data.shortUrl, code: data.code ?? null });
      } else if (data && typeof data === "object" && data.code) {
        // backend returned only code => construct full short URL
        const host = window.location.origin;
        setResult({ shortUrl: `${host}/api/url/${data.code}`, code: data.code });
      } else if (typeof data === "string" && data.length > 0) {
        const host = window.location.origin;
        setResult({ shortUrl: `${host}/api/url/${data}`, code: data });
      } else {
        setErr("Invalid response from server.");
      }
    } catch (e) {
      console.error(e);
      // prefer backend message if present
      const backendMsg =
        e?.response?.data?.message ||
        (typeof e?.response?.data === "string" ? e.response.data : null);

      if (backendMsg) setErr(backendMsg);
      else if (e?.response?.status === 409)
        setErr("Alias already in use — choose another one.");
      else setErr("Failed to shorten URL. Check backend / network.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result?.shortUrl) return;
    try {
      await navigator.clipboard.writeText(result.shortUrl);
      setCopyMsg("Copied!");
      setTimeout(() => setCopyMsg(""), 1200);
      const el = document.getElementById("short-url");
      if (el) {
        el.classList.add("ring-2", "ring-cyan-400");
        setTimeout(() => el.classList.remove("ring-2", "ring-cyan-400"), 650);
      }
    } catch {
      setCopyMsg("Copy failed");
      setTimeout(() => setCopyMsg(""), 1200);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 px-6 py-20">
      <h1 className="text-3xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent mb-10">
        URL Shortener
      </h1>

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg transform transition-all hover:scale-[1.02] hover:shadow-2xl space-y-6">
        <div>
          <div className="flex items-center gap-3">
            <input
              type="url"
              inputMode="url"
              placeholder="Enter your long URL (include http:// or https://)"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition-all hover:border-blue-400"
              aria-label="Long URL"
            />
          </div>
        </div>

        <div>
          <input
            type="text"
            placeholder="Custom alias (optional)"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition-all hover:border-blue-400"
            aria-label="Custom alias"
          />
          <p className="text-xs text-gray-500 mt-1">
            Use letters, numbers, _ or - (max 64). Leave empty for random.
          </p>
        </div>

        {err && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-3">
            <AlertCircle className="text-red-500 mt-[2px]" size={18} />
            <p className="text-sm text-red-700">{err}</p>
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={handleShorten}
            disabled={!longUrl.trim() || loading}
            className={`px-6 py-3 rounded-lg font-semibold text-white shadow-md transition-all flex items-center gap-2
              ${
                longUrl.trim() && !loading
                  ? "bg-gradient-to-r from-blue-600 to-cyan-400 hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            aria-disabled={!longUrl.trim() || loading}
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Scissors size={18} />}
            {loading ? "Shortening..." : "Shorten"}
          </button>
        </div>

        {result?.shortUrl && (
          <div className="mt-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
            <p className="text-sm text-gray-600 mb-2">Your shortened URL</p>
            <div className="flex items-center gap-2">
              <input
                id="short-url"
                readOnly
                value={result.shortUrl}
                className="w-full p-3 rounded-lg bg-white border border-gray-300 text-gray-900"
                aria-label="Shortened URL"
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

            <div className="flex items-center justify-between mt-2">
              {result.code ? (
                <p className="text-xs text-gray-500">
                  Code: <span className="font-mono">{result.code}</span>
                </p>
              ) : (
                <div />
              )}
              <p className="text-xs text-green-600">{copyMsg}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlShortener;
