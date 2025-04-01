import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, ROLE_PERMISSIONS } from '../types/auth';

// Mock users for demonstration
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    roles: [UserRole.ADMIN],
  },
  {
    id: '2',
    email: 'contractor@example.com',
    password: 'contractor123',
    name: 'John Contractor',
    roles: [UserRole.CONTRACTOR],
  },
  {
    id: '3',
    email: 'supplier@example.com',
    password: 'supplier123',
    name: 'Sarah Supplier',
    roles: [UserRole.SUPPLIER],
  },
  {
    id: '4',
    email: 'customer@example.com',
    password: 'customer123',
    name: 'Customer Corp',
    roles: [UserRole.CUSTOMER],
  },
  {
    id: '5',
    email: 'engineer@example.com',
    password: 'engineer123',
    name: 'Engineer Team',
    roles: [UserRole.FIELD_ENGINEER],
  },
  {
    id: '6',
    email: 'compliance@example.com',
    password: 'compliance123',
    name: 'Compliance Officer',
    roles: [UserRole.COMPLIANCE_OFFICER],
  },
];

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole) => boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('bim_erp_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('bim_erp_user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    const foundUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      // Remove password before storing user
      const { password: _, ...userWithoutPassword } = foundUser;
      const secureUser = { ...userWithoutPassword, isSuperAdmin: foundUser.email === "admin@example.com" } as User;
      
      setUser(secureUser);
      setIsAuthenticated(true);
      localStorage.setItem('bim_erp_user', JSON.stringify(secureUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('bim_erp_user');
  };

  const hasRole = (role: UserRole): boolean => {
    if (!user) return false;
    return user.roles.includes(role);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // Check if any of the user's roles have the required permission
    return user.roles.some(role => {
      const permissions = ROLE_PERMISSIONS[role];
      return permissions && permissions.includes(permission);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        hasPermission,
        hasRole,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Protected route component
export const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: UserRole;
  fallback?: React.ReactNode;
}> = ({ children, requiredPermission, requiredRole, fallback }) => {
  const { isAuthenticated, hasPermission, hasRole } = useAuth();

  if (!isAuthenticated) {
    return fallback ? <>{fallback}</> : null;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return fallback ? <>{fallback}</> : null;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
};
