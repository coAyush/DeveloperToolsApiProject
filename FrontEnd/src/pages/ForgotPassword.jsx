import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API = "http://localhost:8080/DeveloperToolsApiProject/api/auth";

export default function ForgotPasswordFlow() {
  const [step, setStep] = useState("forgot"); // forgot | verify | reset
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ============================
  // 1️⃣ SEND OTP
  // ============================
  const sendOtp = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${API}/request-otp`,
        { email },
        { withCredentials: true }
      );
      toast.success(data.message);
      setStep("verify");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    }
    setLoading(false);
  };

  // ============================
  // 2️⃣ VERIFY OTP
  // ============================
  const verifyOtp = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${API}/verify-otp`,
        { email, otp },
        { withCredentials: true }
      );

      if (data.valid) {
        toast.success("OTP verified!");
        setStep("reset");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid OTP");
    }
    setLoading(false);
  };

  // ============================
  // 3️⃣ RESET PASSWORD
  // ============================
  const resetPassword = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${API}/reset-password`,
        { email, newPassword: password },
        { withCredentials: true }
      );

      toast.success(data.message);
      setStep("done");
    } catch (err) {
      toast.error("Failed to update password");
    }
    setLoading(false);
  };

  // ---------------------------------------------------
  // SCREEN 1: ENTER EMAIL (SEND OTP)
  // ---------------------------------------------------
  if (step === "forgot") {
    return (
      <div className="page">
        <h1>Forgot Password</h1>

        <input
          type="email"
          placeholder="Enter registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button onClick={sendOtp} disabled={loading || !email}>
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </div>
    );
  }

  // ---------------------------------------------------
  // SCREEN 2: VERIFY OTP
  // ---------------------------------------------------
  if (step === "verify") {
    return (
      <div className="page">
        <h1>Verify OTP</h1>

        <p className="info">OTP sent to {email}</p>

        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button onClick={verifyOtp} disabled={loading || otp.length < 6}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <button className="back" onClick={() => setStep("forgot")}>
          Go Back
        </button>
      </div>
    );
  }

  // ---------------------------------------------------
  // SCREEN 3: RESET PASSWORD
  // ---------------------------------------------------
  if (step === "reset") {
    return (
      <div className="page">
        <h1>Reset Password</h1>

        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={resetPassword}
          disabled={loading || password.trim().length < 4}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    );
  }

  // ---------------------------------------------------
  // SCREEN 4: DONE
  // ---------------------------------------------------
  if (step === "done") {
    return (
      <div className="page">
        <h1>Password Updated Successfully</h1>
        <p>You can now login using your new password.</p>

        <button onClick={() => (window.location.href = "/login")}>
          Go to Login
        </button>
      </div>
    );
  }
}
