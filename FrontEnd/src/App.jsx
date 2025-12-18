// src/App.jsx
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatWidget from "./components/ChatWidget";

import Intro from "./pages/Intro";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import QrTool from "./pages/QrTool";
import PasswordGen from "./pages/PasswordGen";
import UrlShortener from "./pages/UrlShortener";
import UuidGenerator from "./pages/UuidGenerator";
import PdfCompressor from "./pages/PdfCompressor";
import ImagePlaceholder from "./pages/ImagePlaceholder";
import Contact from "./pages/Contact";
import About from "./pages/About";
import ImageToPdf from "./pages/ImageToPdf";
import WordToPdf from "./pages/WordToPdf";
import Redirector from "./pages/Redirector";

const API_ME =
  "http://localhost:8080/DeveloperToolsApiProject/api/auth/me";

/* ---------- Layouts ---------- */
const PublicLayout = ({ children }) => <>{children}</>;

const PrivateLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-white text-gray-900">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

/* ---------- Simple Auth Guard ---------- */
const RequireAuth = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    fetch(API_ME, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setAuth(data?.authenticated === true);
        setLoading(false);
      })
      .catch(() => {
        setAuth(false);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Checking session...
      </div>
    );
  }

  if (!auth) return <Navigate to="/login" replace />;

  return children;
};

/* ---------- Global Chat ---------- */
function GlobalChat() {
  const { pathname } = useLocation();
  const HIDE_ON = ["/", "/login", "/signup", "/forgot", "/reset-password"];
  if (HIDE_ON.includes(pathname)) return null;
  return <ChatWidget />;
}

/* ---------- App ---------- */
const App = () => {
  return (
    <>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<PublicLayout><Intro /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
        <Route path="/signup" element={<PublicLayout><SignUp /></PublicLayout>} />
        <Route path="/forgot" element={<PublicLayout><ForgotPassword /></PublicLayout>} />

        {/* PRIVATE */}
        <Route
          path="/home"
          element={
            <RequireAuth>
              <PrivateLayout><Home /></PrivateLayout>
            </RequireAuth>
          }
        />

        <Route
          path="/profile"
          element={
            <RequireAuth>
              <PrivateLayout><Profile /></PrivateLayout>
            </RequireAuth>
          }
        />

        <Route
          path="/about"
          element={
            <RequireAuth>
              <PrivateLayout><About /></PrivateLayout>
            </RequireAuth>
          }
        />

        <Route
          path="/contact"
          element={
            <RequireAuth>
              <PrivateLayout><Contact /></PrivateLayout>
            </RequireAuth>
          }
        />

        {/* TOOLS */}
        <Route path="/tools/qr" element={<RequireAuth><PrivateLayout><QrTool /></PrivateLayout></RequireAuth>} />
        <Route path="/tools/url" element={<RequireAuth><PrivateLayout><UrlShortener /></PrivateLayout></RequireAuth>} />
        <Route path="/tools/password" element={<RequireAuth><PrivateLayout><PasswordGen /></PrivateLayout></RequireAuth>} />
        <Route path="/tools/uuid" element={<RequireAuth><PrivateLayout><UuidGenerator /></PrivateLayout></RequireAuth>} />
        <Route path="/tools/placeholder" element={<RequireAuth><PrivateLayout><ImagePlaceholder /></PrivateLayout></RequireAuth>} />
        <Route path="/tools/pdf-compressor" element={<RequireAuth><PrivateLayout><PdfCompressor /></PrivateLayout></RequireAuth>} />
        <Route path="/tools/img-to-pdf" element={<RequireAuth><PrivateLayout><ImageToPdf /></PrivateLayout></RequireAuth>} />
        <Route path="/tools/word-to-pdf" element={<RequireAuth><PrivateLayout><WordToPdf /></PrivateLayout></RequireAuth>} />

        <Route
          path="/r/:code"
          element={
            <RequireAuth>
              <PrivateLayout><Redirector /></PrivateLayout>
            </RequireAuth>
          }
        />
      </Routes>

      <GlobalChat />
    </>
  );
};

export default App;