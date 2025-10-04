import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Intro from "./pages/Intro";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import QrTool from "./pages/QrTool";
import PasswordGen from "./pages/PasswordGen";
import UrlShortener from "./pages/UrlShortener";
import UuidGenerator from "./pages/UuidGenerator";
import Contact from "./pages/Contact";
import About from "./pages/About";
import PdfCompressor from "./pages/PdfCompressor";
import ImageToPdf from "./pages/ImageToPdf";


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

const App = () => {
  return (
    <>
      <Routes>
        {/* Public pages */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Intro />
            </PublicLayout>
          }
        />
        <Route
          path="/login"
          element={
            <PublicLayout>
              <Login />
            </PublicLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicLayout>
              <SignUp />
            </PublicLayout>
          }
        />

        {/* Private pages (after login) */}
        <Route
          path="/home"
          element={
            <PrivateLayout>
              <Home />
            </PrivateLayout>
          }
        />
        <Route
          path="/tools/img-to-pdf"
          element={
            <PrivateLayout>
              <ImageToPdf />
            </PrivateLayout>
          }
        />
        <Route
          path="/tools/pdf-compressor"
          element={
            <PrivateLayout>
              <PdfCompressor />
            </PrivateLayout>
          }
        />
        <Route
          path="/about"
          element={
            <PrivateLayout>
              <About />
            </PrivateLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <PrivateLayout>
              <Contact />
            </PrivateLayout>
          }
        />

        {/* Future Tools  */}

        <Route
          path="/tools/qr"
          element={
            <PrivateLayout>
              <QrTool />
            </PrivateLayout>
          }
        />
        <Route
          path="/tools/url"
          element={
            <PrivateLayout>
              <UrlShortener />
            </PrivateLayout>
          }
        />
        <Route
          path="/tools/password"
          element={
            <PrivateLayout>
              <PasswordGen />
            </PrivateLayout>
          }
        />
        <Route
          path="/tools/uuid"
          element={
            <PrivateLayout>
              <UuidGenerator />
            </PrivateLayout>
          }
        />
      </Routes>
    </>
  );
};

export default App;
