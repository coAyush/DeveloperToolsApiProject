import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API_AUTH_BASE = "http://localhost:8080/DeveloperToolsApiProject/api/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Escape key -> go back
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && navigate(-1);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // keep using your auth forgot endpoint; adjust if backend path differs
      const { data } = await axios.post(`${API_AUTH_BASE}/forgot`, { email }, { withCredentials: true });

      // Success message
      toast.success(data?.message || "OTP sent to your email!");
      setTimeout(() => navigate("/reset-password", { state: { email } }), 900);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Email not found!";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg mt-20">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-4">Forgot Password</h2>
        <p className="text-center text-gray-600 mb-6">Enter your email to receive an OTP for password reset.</p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your registered email" className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50" />
          </div>

          <button type="submit" disabled={loading} className={`w-full py-3 text-white font-semibold rounded-lg ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Remember your password? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
