import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  RfpType, 
  CreateRfpDto, 
  AiExtractionSource, 
  ExtractedRfpFields 
} from '@/types/marketplace';
import { marketplaceApi } from '@/services/marketplace-api';
import { AiExtractionService } from '@/services/ai-extraction.service';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Building2, 
  Wrench, 
  Truck, 
  Package, 
  Upload, 
  Link, 
  Loader2, 
  CheckCircle2
} from 'lucide-react';

const RfpCreateForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<CreateRfpDto>({
    type: RfpType.PROJECT,
    title: '',
    description: '',
    budget: undefined,
    timeline: '',
    requirements: '',
    region: '',
    requiredCertifications: [],
  });
  
  const [aiSource, setAiSource] = useState<AiExtractionSource>({
    type: 'url',
    value: '',
    rfpType: RfpType.PROJECT,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [certInput, setCertInput] = useState('');
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleTypeChange = (value: RfpType) => {
    setFormData(prev => ({
      ...prev,
      type: value,
    }));
    
    // Update AI extraction source type when RFP type changes
    setAiSource(prev => ({
      ...prev,
      rfpType: value,
    }));
  };
  
  const handleAiSourceTypeChange = (value: 'url' | 'file_ref') => {
    setAiSource(prev => ({
      ...prev,
      type: value,
      value: '', // Reset value when changing type
    }));
  };
  
  const handleAiSourceValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAiSource(prev => ({
      ...prev,
      value: e.target.value,
    }));
  };
  
  const handleAddCertification = () => {
    if (!certInput.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      requiredCertifications: [...(prev.requiredCertifications || []), certInput.trim()],
    }));
    
    setCertInput('');
  };
  
  const handleRemoveCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requiredCertifications: prev.requiredCertifications?.filter((_, i) => i !== index),
    }));
  };
  
  const handleAutoExtract = async () => {
    if (!aiSource.value) {
      toast({
        title: 'Error',
        description: 'Please provide a URL or file reference',
        type: 'error',
      });
      return;
    }
    
    setIsExtracting(true);
    
    try {
      // Use local AI extraction service first (simulated)
      const extractedData = await AiExtractionService.extractRfpFields(aiSource);
      
      // Update form with extracted data
      setFormData(prev => ({
        ...prev,
        description: extractedData.description || prev.description,
        budget: extractedData.budget !== undefined ? extractedData.budget : 
                extractedData.price !== undefined ? extractedData.price : 
                prev.budget,
        timeline: extractedData.timeline || prev.timeline,
        requirements: extractedData.requirements || prev.requirements,
      }));
      
      toast({
        title: 'Success',
        description: 'AI successfully extracted information from the provided source',
        type: 'success',
      });
      
    } catch (error) {
      console.error('Extraction failed:', error);
      
      // Fall back to remote API if local extraction fails
      try {
        const extractedData = await marketplaceApi.autoPopulateRfp(aiSource);
        
        // Update form with extracted data
        setFormData(prev => ({
          ...prev,
          description: extractedData.description || prev.description,
          budget: extractedData.budget !== undefined ? extractedData.budget : 
                  extractedData.price !== undefined ? extractedData.price : 
                  prev.budget,
          timeline: extractedData.timeline || prev.timeline,
          requirements: extractedData.requirements || prev.requirements,
        }));
        
        toast({
          title: 'Success',
          description: 'Information extracted successfully from remote API',
          type: 'success',
        });
      } catch (fallbackError) {
        toast({
          title: 'Extraction Failed',
          description: error instanceof Error ? error.message : 'Could not extract information',
          type: 'error',
        });
      }
    } finally {
      setIsExtracting(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Title and description are required',
        type: 'error',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newRfp = await marketplaceApi.createRfp(formData);
      
      toast({
        title: 'Success',
        description: 'RFP created successfully',
        type: 'success',
      });
      
      // Navigate to the RFP details page
      navigate(`/marketplace/rfp/${newRfp.id}`);
    } catch (error) {
      console.error('RFP creation failed:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create RFP',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getTypeIcon = (type: RfpType) => {
    switch (type) {
      case RfpType.PROJECT:
        return <Building2 className="h-5 w-5" />;
      case RfpType.SERVICE:
        return <Wrench className="h-5 w-5" />;
      case RfpType.RENTAL:
        return <Truck className="h-5 w-5" />;
      case RfpType.PART_SUPPLY:
        return <Package className="h-5 w-5" />;
      default:
        return <Building2 className="h-5 w-5" />;
    }
  };
  
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Post New RFP</CardTitle>
        <CardDescription>
          Create a new Request for Proposal to find suppliers, contractors, or service providers
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* AI Extraction Section */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <div className="flex items-center mb-2">
            <h3 className="text-lg font-medium text-blue-700">AI-Assisted Form Filling</h3>
          </div>
          
          <p className="text-sm text-blue-600 mb-3">
            Let AI extract information from project documents or service pages to save you time.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                size="sm"
                variant={aiSource.type === 'url' ? 'default' : 'outline'}
                onClick={() => handleAiSourceTypeChange('url')}
                className="flex items-center"
              >
                <Link className="h-4 w-4 mr-1" />
                URL
              </Button>
              
              <Button
                type="button" 
                size="sm"
                variant={aiSource.type === 'file_ref' ? 'default' : 'outline'}
                onClick={() => handleAiSourceTypeChange('file_ref')}
                className="flex items-center"
              >
                <Upload className="h-4 w-4 mr-1" />
                Upload File
              </Button>
            </div>
            
            {aiSource.type === 'url' ? (
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter URL (e.g., project page, product listing)"
                  value={aiSource.value}
                  onChange={handleAiSourceValueChange}
                  className="flex-grow"
                />
                
                <Button 
                  type="button"
                  onClick={handleAutoExtract}
                  disabled={isExtracting || !aiSource.value}
                >
                  {isExtracting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Extract Data
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Input 
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // In a real implementation, this would upload the file and set the reference
                      setAiSource(prev => ({
                        ...prev,
                        value: file.name, // This would be a file reference in production
                      }));
                    }
                  }}
                  className="flex-grow"
                />
                
                <Button 
                  type="button"
                  onClick={handleAutoExtract}
                  disabled={isExtracting || !aiSource.value}
                >
                  {isExtracting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Extract Data
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* RFP Type */}
          <div className="space-y-2">
            <Label htmlFor="type">RFP Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleTypeChange(value as RfpType)}
            >
              <SelectTrigger id="type" className="w-full">
                <SelectValue placeholder="Select RFP Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={RfpType.PROJECT} className="flex items-center">
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 mr-2" /> Project
                  </div>
                </SelectItem>
                <SelectItem value={RfpType.SERVICE}>
                  <div className="flex items-center">
                    <Wrench className="h-4 w-4 mr-2" /> Service
                  </div>
                </SelectItem>
                <SelectItem value={RfpType.RENTAL}>
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 mr-2" /> Rental
                  </div>
                </SelectItem>
                <SelectItem value={RfpType.PART_SUPPLY}>
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-2" /> Part/Supply
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter a descriptive title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe what you're looking for..."
              value={formData.description}
              onChange={handleInputChange}
              rows={5}
              required
            />
          </div>
          
          {/* Budget */}
          <div className="space-y-2">
            <Label htmlFor="budget">
              {formData.type === RfpType.PART_SUPPLY || formData.type === RfpType.RENTAL ? 'Budget/Price' : 'Budget'}
            </Label>
            <Input
              id="budget"
              name="budget"
              type="number"
              placeholder="Enter amount in USD"
              value={formData.budget || ''}
              onChange={handleInputChange}
            />
          </div>
          
          {/* Timeline */}
          <div className="space-y-2">
            <Label htmlFor="timeline">
              {formData.type === RfpType.PART_SUPPLY ? 'Delivery Timeline' : 
               formData.type === RfpType.RENTAL ? 'Rental Period' : 'Timeline'}
            </Label>
            <Input
              id="timeline"
              name="timeline"
              placeholder={
                formData.type === RfpType.PROJECT ? "e.g., 3 months, Q2 2025, etc." :
                formData.type === RfpType.SERVICE ? "When the service is needed" :
                formData.type === RfpType.RENTAL ? "Rental duration" :
                "Delivery timeline"
              }
              value={formData.timeline || ''}
              onChange={handleInputChange}
            />
          </div>
          
          {/* Region */}
          <div className="space-y-2">
            <Label htmlFor="region">Region/Location</Label>
            <Input
              id="region"
              name="region"
              placeholder="e.g., New York, Remote, Nationwide"
              value={formData.region || ''}
              onChange={handleInputChange}
            />
          </div>
          
          {/* Requirements */}
          <div className="space-y-2">
            <Label htmlFor="requirements">Specific Requirements</Label>
            <Textarea
              id="requirements"
              name="requirements"
              placeholder="Any specific requirements or specifications..."
              value={formData.requirements || ''}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          
          {/* Required Certifications */}
          <div className="space-y-2">
            <Label>Required Certifications</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Add a certification"
                value={certInput}
                onChange={(e) => setCertInput(e.target.value)}
                className="flex-grow"
              />
              <Button 
                type="button" 
                onClick={handleAddCertification}
                disabled={!certInput.trim()}
              >
                Add
              </Button>
            </div>
            
            {formData.requiredCertifications && formData.requiredCertifications.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.requiredCertifications.map((cert, index) => (
                  <div key={index} className="bg-blue-50 text-blue-700 text-sm rounded-full px-3 py-1 flex items-center">
                    {cert}
                    <button
                      type="button"
                      onClick={() => handleRemoveCertification(index)}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-2">
        <Button 
          variant="outline" 
          onClick={() => navigate('/marketplace')}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Posting...
            </>
          ) : (
            'Post RFP'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RfpCreateForm;
