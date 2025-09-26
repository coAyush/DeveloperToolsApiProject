import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // hook for navigation

  // Escape key will go back to previous page
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        navigate(-1); // go back
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  const handleSignUp = (e) => {
    e.preventDefault();
    // backend api call hobe (dummy success for now)
    toast.success(" Account created successfully!");

    // Redirect to login after 1s
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg animate-fade-in-up mt-20">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-blue-600">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm md:text-base">
          Fill in your details to get started
        </p>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSignUp}>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg 
                         bg-gray-50 text-gray-800 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg 
                         bg-gray-50 text-gray-800 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          {/* Password with eye toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg 
                           bg-gray-50 text-gray-800 placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 
                       rounded-lg hover:bg-blue-700 hover:scale-[1.02] 
                       active:scale-[0.98] transition"
          >
            Sign Up
          </button>
        </form>

        {/* Extra link -> login page */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
