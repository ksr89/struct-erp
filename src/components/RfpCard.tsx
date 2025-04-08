import React from 'react';
import { Rfp, RfpStatus, RfpType } from '@/types/marketplace';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Wrench, 
  Truck, 
  Package, 
  MapPin, 
  Calendar, 
  DollarSign,
  Award,
  User
} from 'lucide-react';

interface RfpCardProps {
  rfp: Rfp;
  onViewDetails?: (rfpId: string) => void;
  onBid?: (rfpId: string) => void;
}

const RfpCard: React.FC<RfpCardProps> = ({ rfp, onViewDetails, onBid }) => {
  const formatCurrency = (amount?: number) => {
    if (amount === undefined) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return '';
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getTypeIcon = (type: RfpType) => {
    switch (type) {
      case RfpType.PROJECT:
        return <Building2 className="h-4 w-4" />;
      case RfpType.SERVICE:
        return <Wrench className="h-4 w-4" />;
      case RfpType.RENTAL:
        return <Truck className="h-4 w-4" />;
      case RfpType.PART_SUPPLY:
        return <Package className="h-4 w-4" />;
      default:
        return <Building2 className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: RfpStatus) => {
    switch (status) {
      case RfpStatus.OPEN:
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case RfpStatus.AWARDED:
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case RfpStatus.CLOSED:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      case RfpStatus.CANCELLED:
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getTypeColor = (type: RfpType) => {
    switch (type) {
      case RfpType.PROJECT:
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case RfpType.SERVICE:
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case RfpType.RENTAL:
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case RfpType.PART_SUPPLY:
        return 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(rfp.id);
    }
  };

  const handleBid = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBid) {
      onBid(rfp.id);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-semibold line-clamp-1">{rfp.title}</h3>
          <div className="flex flex-shrink-0 gap-2">
            <Badge variant="outline" className={getStatusColor(rfp.status)}>
              {rfp.status}
            </Badge>
            <Badge variant="outline" className={getTypeColor(rfp.type)}>
              <span className="flex items-center gap-1">
                {getTypeIcon(rfp.type)}
                {rfp.type.replace('_', ' ')}
              </span>
            </Badge>
          </div>
        </div>
        {rfp.matchScore !== undefined && (
          <div className="mt-1">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              <Award className="h-3 w-3 mr-1" />
              {rfp.matchScore}% Match
            </Badge>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-4">
        <p className="text-gray-700 text-sm line-clamp-2 mb-3">{rfp.description}</p>
        
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600 font-medium">
              {formatCurrency(rfp.budget)}
            </span>
          </div>
          
          {rfp.region && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600 font-medium line-clamp-1">
                {rfp.region}
              </span>
            </div>
          )}
          
          {rfp.timeline && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600 font-medium line-clamp-1">
                {rfp.timeline}
              </span>
            </div>
          )}
          
          {rfp.poster?.name && (
            <div className="flex items-center gap-1">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600 font-medium line-clamp-1">
                {rfp.poster.name}
              </span>
            </div>
          )}
          
          {rfp.requiredCertifications && rfp.requiredCertifications.length > 0 && (
            <div className="col-span-2 mt-1 flex flex-wrap gap-1">
              {rfp.requiredCertifications.map((cert, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {cert}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-3 bg-gray-50 flex justify-between items-center">
        <span className="text-xs text-gray-500">
          Posted {formatDate(rfp.createdAt)}
        </span>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleViewDetails}
          >
            View Details
          </Button>
          
          {rfp.status === RfpStatus.OPEN && (
            <Button 
              size="sm" 
              onClick={handleBid}
            >
              Submit Bid
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default RfpCard;
