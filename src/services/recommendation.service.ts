import { Rfp, SupplyChainRole, RfpType, UserProfileForMatching } from '@/types/marketplace';

/**
 * Service for calculating recommendation scores and matching RFPs to users
 * based on supply chain roles and other factors
 */
export class RecommendationService {
  /**
   * Calculate a match score (0-100) between an RFP and a user profile
   * 
   * @param rfp The RFP to evaluate
   * @param userProfile The user profile to match against
   * @returns A score from 0-100 representing match quality
   */
  static calculateMatchScore(rfp: Rfp, userProfile: UserProfileForMatching): number {
    let score = 0;
    
    // No match if user doesn't have a role
    if (!userProfile.supplyChainRole) return 0;
    
    // 1. Role Relevance - Most important factor
    // Check if the user's role is relevant for this RFP type according to upstream/downstream logic
    if (!this.isRoleRelevantForRfp(rfp.type, userProfile.supplyChainRole)) {
      return 0; // Not relevant based on supply chain position
    }
    score += 40; // Base score for role relevance
    
    // 2. Keyword Matching
    score += this.calculateKeywordScore(rfp, userProfile.supplyChainRole); // Max 30 points
    
    // 3. Region Matching
    if (rfp.region && userProfile.regionPreference) {
      const regionMatch = this.calculateRegionScore(rfp.region, userProfile.regionPreference);
      score += regionMatch; // Max 15 points
    }
    
    // 4. Certification Matching
    if (rfp.requiredCertifications?.length && userProfile.userCertifications?.length) {
      const certScore = this.calculateCertificationScore(
        rfp.requiredCertifications, 
        userProfile.userCertifications
      );
      score += certScore; // Max 15 points
    }
    
    // Ensure score is within 0-100
    return Math.min(Math.max(score, 0), 100);
  }
  
  /**
   * Determine if a user's role is relevant for a specific RFP type
   * Implements upstream/downstream supply chain logic
   */
  private static isRoleRelevantForRfp(rfpType: RfpType, userRole: SupplyChainRole): boolean {
    switch (rfpType) {
      case RfpType.PROJECT:
        // Project RFPs are typically posted by builders/clients, relevant to suppliers and service providers
        return [
          SupplyChainRole.MATERIAL_SUPPLIER,
          SupplyChainRole.EQUIPMENT_VENDOR,
          SupplyChainRole.FIELD_SERVICE,
          SupplyChainRole.PLUMBING_AGENCY,
          SupplyChainRole.FORKLIFT_PROVIDER,
          SupplyChainRole.TRUCKING_PROVIDER,
          SupplyChainRole.ARCHITECT,
          SupplyChainRole.BUILDER_CONTRACTOR, // Can be relevant for subcontracting
        ].includes(userRole);
        
      case RfpType.SERVICE:
        // Service RFPs are relevant to service providers
        return [
          SupplyChainRole.FIELD_SERVICE,
          SupplyChainRole.PLUMBING_AGENCY,
          SupplyChainRole.ARCHITECT,
        ].includes(userRole);
        
      case RfpType.RENTAL:
        // Rental RFPs are relevant to equipment vendors and rental providers
        return [
          SupplyChainRole.EQUIPMENT_VENDOR,
          SupplyChainRole.FORKLIFT_PROVIDER,
          SupplyChainRole.TRUCKING_PROVIDER,
        ].includes(userRole);
        
      case RfpType.PART_SUPPLY:
        // Parts/Supplies RFPs are relevant to material suppliers
        return [
          SupplyChainRole.MATERIAL_SUPPLIER,
        ].includes(userRole);
        
      default:
        return false;
    }
  }
  
  /**
   * Calculate a score based on keyword relevance between RFP and user role
   * @returns A score from 0-30
   */
  private static calculateKeywordScore(rfp: Rfp, role: SupplyChainRole): number {
    const roleKeywords = this.getKeywordsForRole(role);
    if (!roleKeywords.length) return 0;
    
    // Create a searchable text from the RFP
    const rfpText = `${rfp.title} ${rfp.description} ${rfp.requirements || ''}`.toLowerCase();
    
    // Count matches
    let matches = 0;
    roleKeywords.forEach(keyword => {
      if (rfpText.includes(keyword.toLowerCase())) {
        matches++;
      }
    });
    
    // Award points based on keyword matches (up to 30)
    return Math.min(matches * 5, 30);
  }
  
  /**
   * Calculate a score based on region match
   * @returns Score from 0-15
   */
  private static calculateRegionScore(rfpRegion: string, userRegion: string): number {
    // Simple region matching - can be expanded for more sophistication
    if (rfpRegion.toLowerCase().includes(userRegion.toLowerCase()) ||
        userRegion.toLowerCase().includes(rfpRegion.toLowerCase())) {
      return 15;
    }
    return 0;
  }
  
  /**
   * Calculate a score based on certification matches
   * @returns Score from 0-15
   */
  private static calculateCertificationScore(
    requiredCerts: string[], 
    userCerts: string[]
  ): number {
    // Normalize certifications
    const required = requiredCerts.map(c => c.toLowerCase());
    const possessed = userCerts.map(c => c.toLowerCase());
    
    // Find intersections
    const matches = possessed.filter(cert => required.includes(cert));
    
    if (matches.length === 0) return 0;
    if (matches.length >= required.length) return 15; // All certs matched
    
    // Partial match - scale score
    return Math.round((matches.length / required.length) * 15);
  }
  
  /**
   * Return relevant keywords for different supply chain roles
   */
  private static getKeywordsForRole(role: SupplyChainRole): string[] {
    switch (role) {
      case SupplyChainRole.MATERIAL_SUPPLIER:
        return ["concrete", "lumber", "steel", "drywall", "insulation", "brick", "sand", "gravel", "materials", "supplies"];
        
      case SupplyChainRole.EQUIPMENT_VENDOR:
        return ["equipment", "machinery", "tools", "generator", "compressor", "lift", "excavator"];
        
      case SupplyChainRole.FIELD_SERVICE:
        return ["installation", "repair", "maintenance", "service", "on-site", "technical support"];
        
      case SupplyChainRole.PLUMBING_AGENCY:
        return ["plumbing", "pipes", "water", "drainage", "sewage", "fixtures", "installation"];
        
      case SupplyChainRole.FORKLIFT_PROVIDER:
        return ["forklift", "material handling", "lifting", "logistics", "warehouse", "loading"];
        
      case SupplyChainRole.TRUCKING_PROVIDER:
        return ["transportation", "delivery", "hauling", "trucking", "logistics", "freight"];
        
      case SupplyChainRole.ARCHITECT:
        return ["design", "plans", "blueprint", "architecture", "drawings", "specification", "cad", "bim"];
        
      case SupplyChainRole.BUILDER_CONTRACTOR:
        return ["construction", "building", "renovation", "project management", "general contractor"];
        
      default:
        return ["construction", "building", "project"];
    }
  }
  
  /**
   * Generate recommendations for a user from a list of RFPs
   * 
   * @param userProfile The user to generate recommendations for
   * @param rfps List of RFPs to evaluate
   * @returns Rfps with match scores, sorted by relevance
   */
  static getRecommendationsForUser(
    userProfile: UserProfileForMatching,
    rfps: Rfp[]
  ): Rfp[] {
    // Don't recommend if no role
    if (!userProfile.supplyChainRole) return [];
    
    const scoredRfps = rfps.map(rfp => {
      // Skip user's own RFPs
      if (rfp.posterId === userProfile.userId) {
        return { ...rfp, matchScore: 0 };
      }
      
      // Calculate match score
      const score = this.calculateMatchScore(rfp, userProfile);
      return { ...rfp, matchScore: score };
    });
    
    // Filter out RFPs with low scores
    const recommendations = scoredRfps.filter(rfp => rfp.matchScore > 30);
    
    // Sort by score (highest first)
    return recommendations.sort((a, b) => {
      // Sort by score (descending)
      const scoreDiff = (b.matchScore || 0) - (a.matchScore || 0);
      if (scoreDiff !== 0) return scoreDiff;
      
      // Secondary sort by date (newest first)
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
  }
  
  /**
   * Find potential responders for an RFP
   * (For a future feature that recommends potential bidders to RFP creators)
   */
  static findPotentialRespondersForRfp(rfp: Rfp, users: UserProfileForMatching[]): UserProfileForMatching[] {
    // This would filter users by role relevance and sort by potential match quality
    return users
      .filter(user => this.isRoleRelevantForRfp(rfp.type, user.supplyChainRole!))
      .map(user => {
        const score = this.calculateMatchScore(rfp, user);
        return { ...user, matchScore: score };
      })
      .filter(user => user.matchScore! > 30)
      .sort((a, b) => (b.matchScore! - a.matchScore!));
  }
}
