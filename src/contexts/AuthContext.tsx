import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, ROLE_PERMISSIONS, AuthContextType } from '../types/auth';

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  hasPermission: () => false,
});

// Mock users for the demo
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'demo@bimerp.com': {
    password: 'password123',
    user: {
      id: '0',
      name: 'Demo User',
      email: 'demo@bimerp.com',
      roles: [UserRole.ADMIN, UserRole.CONTRACTOR],
    },
  },
  'admin@bim-erp.com': {
    password: 'admin123',
    user: {
      id: '1',
      name: 'Admin User',
      email: 'admin@bim-erp.com',
      roles: [UserRole.ADMIN],
    },
  },
  'contractor@bim-erp.com': {
    password: 'contractor123',
    user: {
      id: '2',
      name: 'John Builder',
      email: 'contractor@bim-erp.com',
      roles: [UserRole.CONTRACTOR],
    },
  },
  'supplier@bim-erp.com': {
    password: 'supplier123',
    user: {
      id: '3',
      name: 'Sarah Supplies',
      email: 'supplier@bim-erp.com',
      roles: [UserRole.SUPPLIER],
    },
  },
  'client@bim-erp.com': {
    password: 'client123',
    user: {
      id: '4',
      name: 'Client Corp',
      email: 'client@bim-erp.com',
      roles: [UserRole.CLIENT],
    },
  },
  'field@bim-erp.com': {
    password: 'field123',
    user: {
      id: '5',
      name: 'Field Agent',
      email: 'field@bim-erp.com',
      roles: [UserRole.FIELD_AGENT],
    },
  },
  'viewer@bim-erp.com': {
    password: 'viewer123',
    user: {
      id: '6',
      name: 'Viewer Only',
      email: 'viewer@bim-erp.com',
      roles: [UserRole.VIEWER],
    },
  },
};

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check for saved auth token on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('bim_erp_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser) as User;
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Failed to parse saved user:', err);
        localStorage.removeItem('bim_erp_user');
      }
    }
  }, []);

  // Mock login function
  const login = async (email: string, password: string): Promise<void> => {
    // In a real app, this would be an API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userRecord = MOCK_USERS[email.toLowerCase()];
        
        if (userRecord && userRecord.password === password) {
          setUser(userRecord.user);
          setIsAuthenticated(true);
          localStorage.setItem('bim_erp_user', JSON.stringify(userRecord.user));
          resolve();
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 500); // Simulate API delay
    });
  };

  // Logout function
  const logout = (): void => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('bim_erp_user');
  };

  // Check if user has a specific permission
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // Check each role the user has
    for (const role of user.roles) {
      const permissions = ROLE_PERMISSIONS[role];
      if (permissions.includes(permission)) {
        return true;
      }
    }
    
    return false;
  };

  const authValue: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    hasPermission,
  };

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
