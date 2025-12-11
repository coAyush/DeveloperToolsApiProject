// src/App.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Intro from "./pages/Intro";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import QrTool from "./pages/QrTool";
import PasswordGen from "./pages/PasswordGen";
import UrlShortener from "./pages/UrlShortener";
import UuidGenerator from "./pages/UuidGenerator";
import PdfCompressor from "./pages/PdfCompressor";
import ImagePlaceholder from "./pages/ImagePlaceholder";
import Contact from "./pages/Contact";
import About from "./pages/About";
import ImageToPdf from "./pages/ImageToPdf";
import ChatWidget from "./components/ChatWidget";
import WordToPdf from "./pages/WordToPdf";
import Redirector from "./pages/Redirector";

// Public layout (without Navbar & Footer)
const PublicLayout = ({ children }) => <>{children}</>;

// Private layout (with Navbar & Footer)
const PrivateLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

function GlobalChat() {
  const { pathname } = useLocation();
  const HIDE_ON = [
    "/login",
    "/signup",
    "/",
    "/forgot",
    "/reset-password", // hide on forgot/reset too
  ];
  if (HIDE_ON.includes(pathname)) return null;
  return <ChatWidget />;
}

const App = () => {
  return (
    <>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<PublicLayout><Intro /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
        <Route path="/signup" element={<PublicLayout><SignUp /></PublicLayout>} />
        <Route path="/forgot" element={<PublicLayout><ForgotPassword /></PublicLayout>} />

        {/* Private pages (after login) */}
        <Route path="/home" element={<PrivateLayout><Home /></PrivateLayout>} />
        <Route path="/tools/word-to-pdf" element={<PrivateLayout><WordToPdf /></PrivateLayout>} />
        <Route path="/tools/img-to-pdf" element={<PrivateLayout><ImageToPdf /></PrivateLayout>} />
        <Route path="/tools/pdf-compressor" element={<PrivateLayout><PdfCompressor /></PrivateLayout>} />
        <Route path="/about" element={<PrivateLayout><About /></PrivateLayout>} />
        <Route path="/contact" element={<PrivateLayout><Contact /></PrivateLayout>} />

        {/* Tools */}
        <Route path="/tools/qr" element={<PrivateLayout><QrTool /></PrivateLayout>} />
        <Route path="/tools/url" element={<PrivateLayout><UrlShortener /></PrivateLayout>} />
        <Route path="/tools/password" element={<PrivateLayout><PasswordGen /></PrivateLayout>} />
        <Route path="/tools/uuid" element={<PrivateLayout><UuidGenerator /></PrivateLayout>} />
        <Route path="/tools/placeholder" element={<PrivateLayout><ImagePlaceholder /></PrivateLayout>} />
        <Route path="/r/:code" element={<PrivateLayout><Redirector /></PrivateLayout>} />
      </Routes>

      <GlobalChat />
    </>
  );
};

export default App;
