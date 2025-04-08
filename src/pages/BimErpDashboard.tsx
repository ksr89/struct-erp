import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Store, Users, Building2, BarChart3, Star, Sparkles, Award } from 'lucide-react';

const BimErpDashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
          <p className="text-gray-600">
            Welcome to your BIM-Integrated ERP dashboard. Access key features and monitor your construction operations from this central hub.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Active Projects</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Open RFPs</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Store className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Client Projects</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Analytics Alerts</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b">
              <h3 className="font-semibold text-lg">Marketplace Quick Access</h3>
            </div>
            <div className="p-6 space-y-4">
              {/* AI Recommendations Section */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  <h4 className="font-medium text-gray-900">Recommended for You</h4>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm text-gray-900">Industrial Storage Facility</h4>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                      <span className="text-xs font-bold text-amber-500">95% match</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">Budget: $2,800,000 • Due: May 20</p>
                  <div className="flex justify-between items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Open for Bids
                    </span>
                    <Link to="/marketplace" className="text-sm text-blue-600 hover:text-blue-800">View</Link>
                  </div>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm text-gray-900">Commercial Building Renovation</h4>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                      <span className="text-xs font-bold text-amber-500">87% match</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">Budget: $1,500,000 • Due: Jun 15</p>
                  <div className="flex justify-between items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Open for Bids
                    </span>
                    <Link to="/marketplace" className="text-sm text-blue-600 hover:text-blue-800">View</Link>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <Store className="h-5 w-5 text-blue-500" />
                <h4 className="font-medium text-gray-900">Recent RFPs</h4>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm text-gray-900 mb-1">Downtown Office Tower</h4>
                <p className="text-xs text-gray-500 mb-2">Budget: $5,000,000 • Due: Apr 1</p>
                <div className="flex justify-between items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Open for Bids
                  </span>
                  <Link to="/marketplace" className="text-sm text-blue-600 hover:text-blue-800">View</Link>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm text-gray-900 mb-1">Community Center Renovation</h4>
                <p className="text-xs text-gray-500 mb-2">Budget: $1,200,000 • Due: Apr 10</p>
                <div className="flex justify-between items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Open for Bids
                  </span>
                  <Link to="/marketplace" className="text-sm text-blue-600 hover:text-blue-800">View</Link>
                </div>
              </div>
              <Link to="/marketplace" className="block text-center text-sm text-blue-600 hover:text-blue-800 mt-2">
                View All Marketplace Listings →
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b">
              <h3 className="font-semibold text-lg">CRM Project Status</h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-600">Track your project status and client relationships</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Backlog</span>
                  <span className="text-sm text-gray-500">3 projects</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">In Progress</span>
                  <span className="text-sm text-gray-500">5 projects</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Completed</span>
                  <span className="text-sm text-gray-500">2 projects</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
              <Link to="/crm" className="block text-center text-sm text-blue-600 hover:text-blue-800 mt-2">
                Open Kanban Board →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BimErpDashboard;
