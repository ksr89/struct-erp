import { 
  CrmProject, 
  ListCrmProjectsFilters,
  CrmContact 
} from '@/types/crm';

// Base URL for API - reuse from marketplace API to maintain consistency
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
const CRM_URL = `${API_BASE_URL}/crm`;

// Reuse the auth headers helper and API client from marketplace-api
// Helper for getting auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Generic API client with error handling
async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = 
        errorData?.message || 
        `API Error: ${response.status} ${response.statusText}`;
      
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return null as T;
    }

    return await response.json() as T;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

// CRM API endpoints
export const crmApi = {
  // Get all CRM projects (Kanban items)
  getProjects: async (filters?: ListCrmProjectsFilters, page = 0, limit = 100): Promise<{ data: CrmProject[], total: number }> => {
    const params = new URLSearchParams();
    
    if (page) params.set("skip", (page * limit).toString());
    if (limit) params.set("take", limit.toString());
    
    // Add filters if provided
    if (filters) {
      if (filters.userId) params.set("userId", filters.userId);
      if (filters.status) params.set("status", filters.status);
      if (filters.type) params.set("type", filters.type);
      if (filters.searchTerm) params.set("searchTerm", filters.searchTerm);
      if (filters.priority) params.set("priority", filters.priority);
    }
    
    const url = `${CRM_URL}/projects?${params.toString()}`;
    return apiClient(url);
  },

  // Update a project's status (move in Kanban)
  updateProjectStatus: async (id: string, status: string): Promise<CrmProject> => {
    return apiClient(`${CRM_URL}/projects/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  // Get project details
  getProjectById: async (id: string): Promise<CrmProject> => {
    return apiClient(`${CRM_URL}/projects/${id}`);
  },

  // Update project (not just status)
  updateProject: async (id: string, data: Partial<CrmProject>): Promise<CrmProject> => {
    return apiClient(`${CRM_URL}/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  // Add notes or update project details
  addProjectNotes: async (id: string, notes: string): Promise<CrmProject> => {
    return apiClient(`${CRM_URL}/projects/${id}/notes`, {
      method: "POST",
      body: JSON.stringify({ notes }),
    });
  },

  // Create a manual project (not derived from RFP/Bid)
  createProject: async (data: Omit<CrmProject, 'id'>): Promise<CrmProject> => {
    return apiClient(`${CRM_URL}/projects`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Archive a project 
  archiveProject: async (id: string): Promise<{ message: string }> => {
    return apiClient(`${CRM_URL}/projects/${id}/archive`, {
      method: "PATCH",
    });
  },

  // Get CRM contacts
  getContacts: async (type?: CrmContact['type'], searchTerm?: string, page = 0, limit = 20): Promise<{ data: CrmContact[], total: number }> => {
    const params = new URLSearchParams();
    
    if (page) params.set("skip", (page * limit).toString());
    if (limit) params.set("take", limit.toString());
    if (type) params.set("type", type);
    if (searchTerm) params.set("searchTerm", searchTerm);
    
    return apiClient(`${CRM_URL}/contacts?${params.toString()}`);
  },

  // Create new contact
  createContact: async (data: Omit<CrmContact, 'id' | 'createdAt'>): Promise<CrmContact> => {
    return apiClient(`${CRM_URL}/contacts`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Update contact
  updateContact: async (id: string, data: Partial<Omit<CrmContact, 'id' | 'createdAt'>>): Promise<CrmContact> => {
    return apiClient(`${CRM_URL}/contacts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  // Delete contact
  deleteContact: async (id: string): Promise<void> => {
    return apiClient(`${CRM_URL}/contacts/${id}`, {
      method: "DELETE",
    });
  },

  // Get contact details
  getContactById: async (id: string): Promise<CrmContact> => {
    return apiClient(`${CRM_URL}/contacts/${id}`);
  }
};
