import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { marketplaceApi } from '@/services/marketplace-api';
import { Rfp, RfpType, ListRfpFilters } from '@/types/marketplace';
import RfpCard from '@/components/RfpCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Filter, X, Search, Loader2 } from 'lucide-react';

const DashboardMarketplaceFeed: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [rfps, setRfps] = useState<Rfp[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  // Filter states
  const [filters, setFilters] = useState<ListRfpFilters>({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  const itemsPerPage = 10;

  const loadRfps = useCallback(async (pageNum: number = 0) => {
    setLoading(true);
    
    try {
      // Apply search term to filters if provided
      const currentFilters = { 
        ...filters,
        ...(searchTerm ? { searchTerm } : {})
      };
      
      const response = await marketplaceApi.getDashboardFeed(
        new URLSearchParams({
          skip: (pageNum * itemsPerPage).toString(),
          take: itemsPerPage.toString(),
          ...(currentFilters.type ? { type: currentFilters.type } : {}),
          ...(currentFilters.region ? { region: currentFilters.region } : {}),
          ...(currentFilters.minBudget ? { minBudget: currentFilters.minBudget.toString() } : {}),
          ...(currentFilters.maxBudget ? { maxBudget: currentFilters.maxBudget.toString() } : {}),
          ...(currentFilters.searchTerm ? { searchTerm: currentFilters.searchTerm } : {})
        })
      );
      
      setRfps(response.data);
      setTotalItems(response.total);
      setCurrentPage(pageNum);
    } catch (err) {
      console.error("Failed to fetch marketplace feed:", err);
      toast({
        title: "Error",
        description: "Failed to load marketplace opportunities",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  }, [filters, searchTerm, toast]);

  useEffect(() => {
    loadRfps(0); // Load first page on mount or when filters change
  }, [loadRfps]);

  const handlePageChange = (newPage: number) => {
    loadRfps(newPage);
  };

  const handleViewDetails = (rfpId: string) => {
    navigate(`/marketplace/rfp/${rfpId}`);
  };

  const handleBid = (rfpId: string) => {
    navigate(`/marketplace/rfp/${rfpId}/bid`);
  };

  const handleFilterChange = (key: keyof ListRfpFilters, value: any) => {
    if (value === "" || value === undefined) {
      // Remove the filter if empty value
      const newFilters = { ...filters };
      delete newFilters[key];
      setFilters(newFilters);
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadRfps(0); // Reset to first page with new search
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm("");
    // loadRfps will be triggered by the useEffect that watches filters
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Marketplace Opportunities</h2>
        <Button onClick={() => setShowFilters(!showFilters)}>
          <Filter className="h-4 w-4 mr-2" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

      {/* Search and filters */}
      <div className={`space-y-4 transition-all ${showFilters ? 'block' : 'hidden'}`}>
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <Input
            placeholder="Search opportunities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <Select 
              value={filters.type || ""} 
              onValueChange={(value) => handleFilterChange("type", value !== "" ? value : undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value={RfpType.PROJECT}>Project</SelectItem>
                <SelectItem value={RfpType.SERVICE}>Service</SelectItem>
                <SelectItem value={RfpType.RENTAL}>Rental</SelectItem>
                <SelectItem value={RfpType.PART_SUPPLY}>Part Supply</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Region</label>
            <Input 
              placeholder="Enter region"
              value={filters.region || ""}
              onChange={(e) => handleFilterChange("region", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Min Budget</label>
            <Input 
              type="number"
              placeholder="Min budget"
              value={filters.minBudget || ""}
              onChange={(e) => handleFilterChange("minBudget", e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Max Budget</label>
            <Input 
              type="number"
              placeholder="Max budget"
              value={filters.maxBudget || ""}
              onChange={(e) => handleFilterChange("maxBudget", e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            variant="outline" 
            onClick={clearFilters}
            className="flex items-center"
          >
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-lg">Loading opportunities...</span>
        </div>
      )}

      {/* No results */}
      {!loading && rfps.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No matching opportunities found</p>
          {(Object.keys(filters).length > 0 || searchTerm) && (
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Results grid */}
      {!loading && rfps.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {rfps.map(rfp => (
              <RfpCard 
                key={rfp.id} 
                rfp={rfp} 
                onViewDetails={handleViewDetails}
                onBid={handleBid}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 py-4">
              <Button 
                variant="outline" 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
              >
                Previous
              </Button>
              
              <span className="text-sm">
                Page {currentPage + 1} of {totalPages}
              </span>
              
              <Button 
                variant="outline" 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardMarketplaceFeed;
