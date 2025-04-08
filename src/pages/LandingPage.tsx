import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
          BIM-Integrated ERP: Revolutionizing Construction Operations
        </h1>
        
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
          Streamline your operations, boost efficiency, and make data-driven decisions with our intelligent ERP solution.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <Link 
            to="/login" 
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
          >
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          
          <Link 
            to="/login" 
            className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-6 border border-gray-300 rounded-md transition-colors"
          >
            Book a Demo
          </Link>
        </div>
        
        <div className="rounded-lg overflow-hidden shadow-2xl max-w-3xl mx-auto">
          <img
            src="https://images.unsplash.com/photo-1555066931-4365d14bab8c"
            alt="BIM ERP Screenshot"
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
