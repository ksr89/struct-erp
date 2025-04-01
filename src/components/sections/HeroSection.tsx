import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

import React from "react";

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative py-20 overflow-hidden bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              BIM-Integrated ERP: Revolutionizing Construction Operations
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Streamline your operations, boost efficiency, and make data-driven decisions with our intelligent ERP solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="gap-2" onClick={() => navigate("/login")}>
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
                Book a Demo
              </Button>
            </div>
          </div>
          <div className="flex-1">
            <img
              src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
              alt="BIM ERP Dashboard"
              className="rounded-lg shadow-2xl"
              width={600}
              height={400}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
