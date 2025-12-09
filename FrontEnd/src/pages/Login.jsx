import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ✅ Corrected backend base URL
const API_BASE = "http://localhost:8080/api/auth";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔐 Auto sign-in if session active
  useEffect(() => {
    fetch(`${API_BASE}/me`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.authenticated) {
          toast.success("You're already logged in!");
          navigate("/home");
        }
      })
      .catch((err) => console.error("Session check error:", err));
  }, [navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_BASE}/login`, form, {
        withCredentials: true, // 🚀 required for session
      });

      // 🔥 Updated success check
      if (data?.message === "Login successful!") {
        toast.success("Logged in successfully!");
        setTimeout(() => navigate("/home"), 1200);
      } else {
        toast.error(data?.message || "Invalid Credentials!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Login failed! Server not responding.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg animate-fade-in-up mt-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-blue-600">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm md:text-base">
          Please sign in to your account
        </p>

        <form className="space-y-5" onSubmit={handleLogin}>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg bg-gray-50"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg bg-gray-50 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-semibold py-3 rounded-lg text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Create one
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
