import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ✅ Correct final backend base URL (Confirmed working)
const API_BASE = "http://localhost:8080/DeveloperToolsApiProject/api/auth";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔐 Auto session check
  useEffect(() => {
    fetch(`${API_BASE}/me`, {
      credentials: "include", // Required so session cookie is included
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.authenticated) {
          toast.success("You're already logged in!");
          navigate("/home");
        }
      })
      .catch(() => {});
  }, [navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_BASE}/login`, form, {
        withCredentials: true, // Required for JSESSIONID cookie
      });

      if (data?.message === "Login successful!") {
        toast.success("Logged in successfully!");
        setTimeout(() => navigate("/home"), 1200);
      } else {
        toast.error(data?.message || "Invalid credentials!");
      }
    } catch (err) {
      toast.error("Server unreachable!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg mt-20">
        <h2 className="text-4xl font-bold mb-6 text-center text-blue-600">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Please sign in to your account
        </p>

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label>Email Address</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label>Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 pr-10"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-600"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-semibold py-3 rounded-lg text-white ${
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
