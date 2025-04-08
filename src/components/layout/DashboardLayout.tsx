import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useMobile } from '../../hooks/use-mobile';
import { 
  LayoutGrid, 
  Store, 
  Users, 
  Building2, 
  Settings, 
  LogOut,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const { isMobile } = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Update sidebar state when mobile status changes
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
  
  const closeSidebarIfMobile = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    // Ensure logout works properly
    if (typeof logout === 'function') {
      logout();
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100 relative">
      {/* Mobile menu button */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow-md"
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? "Close menu" : "Open menu"}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Overlay to close sidebar when clicking outside on mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } fixed lg:static lg:min-h-screen z-40 w-64 bg-white shadow-md transition-transform duration-300 ease-in-out h-full overflow-y-auto`}
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-blue-600">BIM ERP</h2>
          <p className="text-sm text-gray-500">Construction Management</p>
        </div>
        
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
              {user?.name?.[0] || 'U'}
            </div>
            <div>
              <p className="font-medium">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-1">
            <li>
              <Link 
                to="/dashboard" 
                className={`flex items-center p-2 rounded-md ${isActive('/dashboard') 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={closeSidebarIfMobile}
              >
                <LayoutGrid className="w-5 h-5 mr-3" />
                <span>Dashboard</span>
                {isActive('/dashboard') && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            </li>
            <li>
              <Link 
                to="/marketplace" 
                className={`flex items-center p-2 rounded-md ${isActive('/marketplace') 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={closeSidebarIfMobile}
              >
                <Store className="w-5 h-5 mr-3" />
                <span>Marketplace</span>
                {isActive('/marketplace') && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            </li>
            <li>
              <Link 
                to="/crm" 
                className={`flex items-center p-2 rounded-md ${isActive('/crm') 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={closeSidebarIfMobile}
              >
                <Users className="w-5 h-5 mr-3" />
                <span>CRM</span>
                {isActive('/crm') && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            </li>
            <li>
              <Link 
                to="/structural-awareness" 
                className={`flex items-center p-2 rounded-md ${isActive('/structural-awareness') 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={closeSidebarIfMobile}
              >
                <Building2 className="w-5 h-5 mr-3" />
                <span>Structural Awareness</span>
                {isActive('/structural-awareness') && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            </li>
          </ul>
          
          <div className="mt-8 pt-4 border-t">
            <ul className="space-y-1">
              <li>
                <Link 
                  to="/settings" 
                  className="flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
                  onClick={closeSidebarIfMobile}
                >
                  <Settings className="w-5 h-5 mr-3" />
                  <span>Settings</span>
                </Link>
              </li>
              <li>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto w-full">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              {location.pathname === '/dashboard' && 'Dashboard'}
              {location.pathname === '/marketplace' && 'Marketplace'}
              {location.pathname === '/crm' && 'CRM'}
              {location.pathname === '/structural-awareness' && 'Structural Awareness'}
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
