import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const STORAGE_KEY = "devtools_local_shortlinks";

const Redirector = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      navigate("/", { replace: true });
      return;
    }

    try {
      const map = JSON.parse(raw);
      const entry = map[code];
      if (entry && entry.url) {
        // redirect to the original URL
        window.location.replace(entry.url);
      } else {
        // not found → go home
        navigate("/", { replace: true });
      }
    } catch {
      navigate("/", { replace: true });
    }
  }, [code, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-700">
      Redirecting...
    </div>
  );
};

export default Redirector;
