import { 
  Rfp, 
  Bid, 
  CreateRfpDto, 
  UpdateRfpDto, 
  CreateBidDto, 
  AiExtractionSource, 
  ExtractedRfpFields, 
  ListRfpFilters, 
  ListBidFilters,
  RfpStatus
} from "@/types/marketplace";

// Base URL for API
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
const MARKETPLACE_URL = `${API_BASE_URL}/marketplace`;

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
      // Try to parse error response
      const errorData = await response.json().catch(() => null);
      const errorMessage = 
        errorData?.message || 
        `API Error: ${response.status} ${response.statusText}`;
      
      throw new Error(errorMessage);
    }

    // For 204 No Content responses, return null
    if (response.status === 204) {
      return null as T;
    }

    return await response.json() as T;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

// RFP API endpoints
export const marketplaceApi = {
  // Get personalized RFP feed with recommendations
  getDashboardFeed: async (params?: URLSearchParams): Promise<{ data: Rfp[], total: number }> => {
    const url = `${MARKETPLACE_URL}/rfps/feed${params ? `?${params.toString()}` : ''}`;
    return apiClient(url);
  },

  // Get all RFPs with optional filters
  listRfps: async (filters?: ListRfpFilters, page = 0, limit = 20): Promise<{ data: Rfp[], total: number }> => {
    const params = new URLSearchParams();
    
    if (page) params.set("skip", (page * limit).toString());
    if (limit) params.set("take", limit.toString());
    
    // Add filters if provided
    if (filters) {
      if (filters.type) params.set("type", filters.type);
      if (filters.region) params.set("region", filters.region);
      if (filters.minBudget) params.set("minBudget", filters.minBudget.toString());
      if (filters.maxBudget) params.set("maxBudget", filters.maxBudget.toString());
      if (filters.searchTerm) params.set("searchTerm", filters.searchTerm);
      if (filters.status) params.set("status", filters.status);
      if (filters.posterId) params.set("posterId", filters.posterId);
    }
    
    const url = `${MARKETPLACE_URL}/rfps?${params.toString()}`;
    return apiClient(url);
  },

  // Get RFP by ID
  getRfpById: async (id: string): Promise<Rfp> => {
    return apiClient(`${MARKETPLACE_URL}/rfps/${id}`);
  },

  // Create new RFP
  createRfp: async (data: CreateRfpDto): Promise<Rfp> => {
    return apiClient(`${MARKETPLACE_URL}/rfps`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Auto-populate RFP fields from URL or file
  autoPopulateRfp: async (source: AiExtractionSource): Promise<ExtractedRfpFields> => {
    return apiClient(`${MARKETPLACE_URL}/rfps/auto-populate`, {
      method: "POST",
      body: JSON.stringify(source),
    });
  },

  // Update RFP
  updateRfp: async (id: string, data: UpdateRfpDto): Promise<Rfp> => {
    return apiClient(`${MARKETPLACE_URL}/rfps/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  // Delete RFP (or cancel by changing status)
  deleteRfp: async (id: string): Promise<void> => {
    return apiClient(`${MARKETPLACE_URL}/rfps/${id}`, {
      method: "DELETE",
    });
  },

  // Cancel RFP (alternative to delete)
  cancelRfp: async (id: string): Promise<Rfp> => {
    return apiClient(`${MARKETPLACE_URL}/rfps/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: RfpStatus.CANCELLED }),
    });
  },

  // Bid API endpoints

  // List bids with filters
  listBids: async (filters?: ListBidFilters, page = 0, limit = 20): Promise<{ data: Bid[], total: number }> => {
    const params = new URLSearchParams();
    
    if (page) params.set("skip", (page * limit).toString());
    if (limit) params.set("take", limit.toString());
    
    // Add filters if provided
    if (filters) {
      if (filters.rfpId) params.set("rfpId", filters.rfpId);
      if (filters.bidderId) params.set("bidderId", filters.bidderId);
      if (filters.status) params.set("status", filters.status);
    }
    
    return apiClient(`${MARKETPLACE_URL}/bids?${params.toString()}`);
  },

  // Submit bid on RFP
  submitBid: async (rfpId: string, bidData: Omit<CreateBidDto, "rfpId">): Promise<Bid> => {
    return apiClient(`${MARKETPLACE_URL}/rfps/${rfpId}/bids`, {
      method: "POST",
      body: JSON.stringify(bidData),
    });
  },

  // Get bid by ID
  getBidById: async (id: string): Promise<Bid> => {
    return apiClient(`${MARKETPLACE_URL}/bids/${id}`);
  },

  // Accept a bid (RFP owner only)
  acceptBid: async (id: string): Promise<{ message: string }> => {
    return apiClient(`${MARKETPLACE_URL}/bids/${id}/accept`, {
      method: "PATCH",
    });
  },

  // Withdraw a bid (bidder only)
  withdrawBid: async (id: string): Promise<{ message: string }> => {
    return apiClient(`${MARKETPLACE_URL}/bids/${id}/withdraw`, {
      method: "PATCH",
    });
  },
};
