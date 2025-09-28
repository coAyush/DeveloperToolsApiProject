import React from "react";
import { Users, Target, Wrench } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-blue-50 to-gray-100 px-6 pt-24 pb-16 flex justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-8 md:p-12 max-w-3xl w-full animate-fade-in">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-4 bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
          About Us
        </h1>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Welcome to <span className="font-semibold text-blue-600">DevToolBox</span> — 
          a collection of handy tools made for developers, students, and tech enthusiasts. 
          Our goal is to simplify your workflow by providing quick and reliable solutions like 
          QR Code generation, URL shortening, password generation, and more 🚀.
        </p>

        {/* Info Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {/* Our Mission */}
          <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition">
            <Target size={36} className="text-blue-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Our Mission
            </h3>
            <p className="text-sm text-gray-600">
              To empower developers with lightweight and efficient tools that save time
              and make development easier.
            </p>
          </div>

          {/* Who We Are */}
          <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition">
            <Users size={36} className="text-blue-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Who We Are
            </h3>
            <p className="text-sm text-gray-600">
              A small team of passionate developers building tools that we wish we had 
              when we started our coding journey.
            </p>
          </div>

          {/* What We Offer */}
          <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition">
            <Wrench size={36} className="text-blue-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              What We Offer
            </h3>
            <p className="text-sm text-gray-600">
              Simple, easy-to-use web utilities with a clean UI — no ads, no clutter, 
              just pure functionality.
            </p>
          </div>
        </div>

        {/* Closing Note */}
        <p className="text-center text-gray-700 mt-10 text-sm md:text-base">
          💡 We’re constantly adding new tools — stay tuned for upcoming features!
        </p>
      </div>
    </div>
  );
};

export default About;
