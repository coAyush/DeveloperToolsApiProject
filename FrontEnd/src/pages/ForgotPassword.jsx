import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const API_AUTH_BASE =
  "http://localhost:8080/DeveloperToolsApiProject/api/auth";

const ForgotPassword = () => {
  const navigate = useNavigate();

  // STEP CONTROL
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=password

  // DATA
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // UI STATE
  const [loading, setLoading] = useState(false);

  // ================= STEP 1: REQUEST OTP =================
  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${API_AUTH_BASE}/request-otp`,
        { email }
      );

      toast.success(data.message || "OTP sent to your email");
      setStep(2);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Email not registered");
    } finally {
      setLoading(false);
    }
  };

  // ================= STEP 2: VERIFY OTP =================
  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_AUTH_BASE}/verify-otp`, {
        email,
        otp,
      });

      toast.success("OTP verified");
      setStep(3);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // ================= STEP 3: RESET PASSWORD =================
  const resetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${API_AUTH_BASE}/reset-password`,
        {
          email,
          newPassword,
        }
      );

      toast.success(data.message || "Password updated successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg mt-20">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-4">
          Forgot Password
        </h2>

        {/* ================= STEP 1: EMAIL ================= */}
        {step === 1 && (
          <>
            <p className="text-center text-gray-600 mb-6">
              Enter your registered email to receive OTP
            </p>

            <form className="space-y-5" onSubmit={sendOtp}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 text-white font-semibold rounded-lg ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          </>
        )}

        {/* ================= STEP 2: OTP ================= */}
        {step === 2 && (
          <>
            <p className="text-center text-gray-600 mb-6">
              Enter the OTP sent to <b>{email}</b>
            </p>

            <form className="space-y-5" onSubmit={verifyOtp}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  OTP
                </label>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 text-white font-semibold rounded-lg ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          </>
        )}

        {/* ================= STEP 3: NEW PASSWORD ================= */}
        {step === 3 && (
          <>
            <p className="text-center text-gray-600 mb-6">
              Enter your new password
            </p>

            <form className="space-y-5" onSubmit={resetPassword}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 text-white font-semibold rounded-lg ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {loading ? "Updating..." : "Reset Password"}
              </button>
            </form>
          </>
        )}

        <p className="text-center text-sm text-gray-600 mt-6">
          Remember your password?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
