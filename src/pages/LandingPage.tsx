import React from "react";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  return (
    <div 
      className="min-h-screen flex flex-col justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: "url('https://salestracker.github.io/struct-erp/assets/images/landing-bg.jpg')" }}
    >
      <div className="bg-black bg-opacity-60 p-8 rounded-xl text-center">
        <h1 className="text-white text-5xl font-bold mb-4">BIM-Integrated ERP: Revolutionizing Construction Operations</h1>
        <p className="text-white text-xl mb-6">
          Transform your construction processes with advanced structural awareness, CRM, and a unified marketplace.
        </p>
        <div className="flex justify-center space-x-4">
          <Link 
            to="/login" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Log In
          </Link>
          <Link 
            to="/signup" 
            className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-2 px-4 rounded"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
