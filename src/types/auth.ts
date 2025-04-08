// Role-based permissions system for BIM ERP

export enum UserRole {
  ADMIN = "ADMIN",
  CONTRACTOR = "CONTRACTOR", 
  SUPPLIER = "SUPPLIER",
  CLIENT = "CLIENT",
  FIELD_AGENT = "FIELD_AGENT",
  VIEWER = "VIEWER"
}

// Permission constants
export const PERMISSIONS = {
  // Marketplace permissions
  CREATE_PROJECT: "CREATE_PROJECT",
  VIEW_PROJECTS: "VIEW_PROJECTS",
  EDIT_PROJECT: "EDIT_PROJECT",
  DELETE_PROJECT: "DELETE_PROJECT",
  SUBMIT_BID: "SUBMIT_BID",
  ACCEPT_BID: "ACCEPT_BID",
  
  // CRM permissions
  VIEW_CRM: "VIEW_CRM",
  MANAGE_LEADS: "MANAGE_LEADS",
  
  // Structural awareness permissions
  VIEW_STRUCTURES: "VIEW_STRUCTURES",
  VIEW_SENSOR_DATA: "VIEW_SENSOR_DATA",
  VIEW_BIM_MODELS: "VIEW_BIM_MODELS",
  UPLOAD_BIM_MODEL: "UPLOAD_BIM_MODEL",
  EDIT_STRUCTURE: "EDIT_STRUCTURE",
  
  // User management
  MANAGE_USERS: "MANAGE_USERS"
};

// Role-based permission mapping
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  [UserRole.ADMIN]: Object.values(PERMISSIONS),
  
  [UserRole.CONTRACTOR]: [
    PERMISSIONS.CREATE_PROJECT,
    PERMISSIONS.VIEW_PROJECTS,
    PERMISSIONS.EDIT_PROJECT,
    PERMISSIONS.DELETE_PROJECT,
    PERMISSIONS.ACCEPT_BID,
    PERMISSIONS.VIEW_CRM,
    PERMISSIONS.MANAGE_LEADS,
    PERMISSIONS.VIEW_STRUCTURES,
    PERMISSIONS.VIEW_SENSOR_DATA,
    PERMISSIONS.VIEW_BIM_MODELS,
  ],
  
  [UserRole.SUPPLIER]: [
    PERMISSIONS.VIEW_PROJECTS,
    PERMISSIONS.SUBMIT_BID,
    PERMISSIONS.VIEW_CRM,
    PERMISSIONS.VIEW_STRUCTURES,
    PERMISSIONS.VIEW_SENSOR_DATA
  ],
  
  [UserRole.CLIENT]: [
    PERMISSIONS.CREATE_PROJECT,
    PERMISSIONS.VIEW_PROJECTS,
    PERMISSIONS.EDIT_PROJECT,
    PERMISSIONS.DELETE_PROJECT,
    PERMISSIONS.ACCEPT_BID,
    PERMISSIONS.VIEW_CRM,
    PERMISSIONS.VIEW_STRUCTURES,
    PERMISSIONS.VIEW_BIM_MODELS,
  ],
  
  [UserRole.FIELD_AGENT]: [
    PERMISSIONS.VIEW_PROJECTS,
    PERMISSIONS.VIEW_STRUCTURES,
    PERMISSIONS.VIEW_SENSOR_DATA,
    PERMISSIONS.VIEW_BIM_MODELS,
    PERMISSIONS.UPLOAD_BIM_MODEL
  ],
  
  [UserRole.VIEWER]: [
    PERMISSIONS.VIEW_PROJECTS,
    PERMISSIONS.VIEW_STRUCTURES
  ]
};

// User interface
export interface User {
  id: string;
  name: string | null;
  email: string;
  roles: UserRole[];
}

// Authentication context interface
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}
