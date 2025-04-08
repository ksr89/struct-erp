// Enums
export enum RfpType {
  PROJECT = "PROJECT",
  SERVICE = "SERVICE",
  RENTAL = "RENTAL",
  PART_SUPPLY = "PART_SUPPLY"
}

export enum RfpStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  AWARDED = "AWARDED",
  CANCELLED = "CANCELLED"
}

export enum BidStatus {
  SUBMITTED = "SUBMITTED",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  WITHDRAWN = "WITHDRAWN"
}

export enum SupplyChainRole {
  BUILDER_CONTRACTOR = "BUILDER_CONTRACTOR",
  CONSTRUCTION_CLIENT = "CONSTRUCTION_CLIENT",
  OPERATIONAL_TEAM = "OPERATIONAL_TEAM",
  FIELD_SERVICE = "FIELD_SERVICE",
  COMPLIANCE_TEAM = "COMPLIANCE_TEAM",
  MATERIAL_SUPPLIER = "MATERIAL_SUPPLIER",
  EQUIPMENT_VENDOR = "EQUIPMENT_VENDOR",
  ARCHITECT = "ARCHITECT",
  PLUMBING_AGENCY = "PLUMBING_AGENCY",
  FORKLIFT_PROVIDER = "FORKLIFT_PROVIDER",
  TRUCKING_PROVIDER = "TRUCKING_PROVIDER"
}

// Interfaces
export interface Rfp {
  id: string;
  type: RfpType;
  title: string;
  description: string;
  budget?: number;
  timeline?: string;
  requirements?: string;
  region?: string;
  requiredCertifications?: string[];
  status: RfpStatus;
  sourceAttachmentUrl?: string;
  aiRecommendationScore?: number;
  posterId: string;
  poster?: {
    id: string;
    name?: string | null;
    email?: string;
  };
  createdAt: Date | string;
  updatedAt: Date | string;
  bids?: Bid[];
  matchScore?: number; // For recommendation engine
}

export interface Bid {
  id: string;
  rfpId: string;
  rfp?: Rfp;
  bidderId: string;
  bidder?: {
    id: string;
    name?: string | null;
    email?: string;
  };
  bidAmount: number;
  timeline?: string;
  details?: string;
  status: BidStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// DTOs
export interface CreateRfpDto {
  type: RfpType;
  title: string;
  description: string;
  budget?: number;
  timeline?: string;
  requirements?: string;
  region?: string;
  requiredCertifications?: string[];
  sourceAttachmentUrl?: string;
}

export interface UpdateRfpDto extends Partial<Omit<CreateRfpDto, 'type'>> {
  status?: RfpStatus;
}

export interface CreateBidDto {
  rfpId: string;
  bidAmount: number;
  timeline?: string;
  details?: string;
}

// AI Extraction Types
export interface AiExtractionSource {
  type: 'url' | 'file_ref';
  value: string;
  rfpType: RfpType;
}

export interface ExtractedRfpFields {
  description?: string;
  budget?: number;
  timeline?: string;
  requirements?: string;
  price?: number; // For RENTAL or PART_SUPPLY
}

// Filters and Queries
export interface ListRfpFilters {
  type?: RfpType;
  region?: string;
  minBudget?: number;
  maxBudget?: number;
  searchTerm?: string;
  status?: RfpStatus;
  posterId?: string;
}

export interface ListBidFilters {
  rfpId?: string;
  bidderId?: string;
  status?: BidStatus;
}

export interface UserProfileForMatching {
  userId: string;
  supplyChainRole: SupplyChainRole | null;
  regionPreference?: string;
  userCertifications?: string[];
}
