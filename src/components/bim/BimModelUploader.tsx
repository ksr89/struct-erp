import React, { useState } from 'react';
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { AlertCircle, FileUp, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useAuth } from "../../contexts/AuthContext";

interface Material {
  type: string;
  grade: string;
  location: string;
}

interface ComplianceTag {
  code: string;
  status: string;
}

interface Metadata {
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadDate: string;
  structureId: string;
  dimensions: {
    width: string;
    length: string;
    height: string;
  };
  materials: Material[];
  complianceTags: ComplianceTag[];
}

interface BimModelUploaderProps {
  onModelUploaded?: (modelData: Metadata) => void;
}

export function BimModelUploader({ onModelUploaded }: BimModelUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<string>("ifc");
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [structureId, setStructureId] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadStatus('idle');
    }
  };

  const handleUpload = () => {
    if (!file) return;
    
    setUploadStatus('uploading');
    
    // Simulate upload process
    setTimeout(() => {
      // Mock successful upload with metadata extraction
      const mockMetadata: Metadata = {
        fileName: file.name,
        fileType: fileType,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        uploadDate: new Date().toISOString(),
        structureId: structureId || 'STR-' + Math.floor(Math.random() * 10000),
        dimensions: {
          width: '120 ft',
          length: '85 ft',
          height: '45 ft'
        },
        materials: [
          { type: 'Concrete', grade: 'M30', location: 'Foundation' },
          { type: 'Steel', grade: 'Fe500', location: 'Columns' },
          { type: 'Glass', grade: 'Tempered', location: 'Facade' }
        ],
        complianceTags: [
          { code: 'IBC-2021', status: 'Compliant' },
          { code: 'ASHRAE 90.1', status: 'Compliant' },
          { code: 'ADA', status: 'Compliant' }
        ]
      };
      
      setMetadata(mockMetadata);
      setUploadStatus('success');
      
      if (onModelUploaded) {
        onModelUploaded(mockMetadata);
      }
    }, 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>BIM Model Integration</CardTitle>
        <CardDescription>
          Upload and integrate BIM/CAD models to enable structural analysis and compliance monitoring
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Model</TabsTrigger>
            <TabsTrigger value="metadata" disabled={!metadata}>Metadata</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-4 mt-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="structure-id">Structure ID (optional)</Label>
                <Input 
                  id="structure-id" 
                  placeholder="Enter existing structure ID or leave blank for new" 
                  value={structureId}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStructureId(e.target.value)}
                />
              </div>
              
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="file-type">File Type</Label>
                <Select value={fileType} onValueChange={setFileType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select file type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ifc">IFC (Industry Foundation Classes)</SelectItem>
                    <SelectItem value="rvt">Revit (.rvt)</SelectItem>
                    <SelectItem value="dwg">AutoCAD (.dwg)</SelectItem>
                    <SelectItem value="skp">SketchUp (.skp)</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="bim-file">BIM/CAD File</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="bim-file" 
                    type="file" 
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                </div>
                {file && (
                  <p className="text-sm text-gray-500">
                    Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                )}
              </div>
              
              {uploadStatus === 'uploading' && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <div className="animate-spin">
                    <FileUp size={20} />
                  </div>
                  <span>Uploading and processing model...</span>
                </div>
              )}
              
              {uploadStatus === 'success' && (
                <Alert variant="default" className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>
                    BIM model uploaded and processed successfully. Metadata extracted and linked to structure.
                  </AlertDescription>
                </Alert>
              )}
              
              {uploadStatus === 'error' && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    There was an error uploading your BIM model. Please try again.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="metadata">
            {metadata && (
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium">File Information</h3>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li><span className="font-medium">Name:</span> {metadata.fileName}</li>
                      <li><span className="font-medium">Type:</span> {metadata.fileType}</li>
                      <li><span className="font-medium">Size:</span> {metadata.fileSize}</li>
                      <li><span className="font-medium">Uploaded:</span> {new Date(metadata.uploadDate).toLocaleString()}</li>
                      <li><span className="font-medium">Structure ID:</span> {metadata.structureId}</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium">Building Dimensions</h3>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li><span className="font-medium">Width:</span> {metadata.dimensions.width}</li>
                      <li><span className="font-medium">Length:</span> {metadata.dimensions.length}</li>
                      <li><span className="font-medium">Height:</span> {metadata.dimensions.height}</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">Materials</h3>
                  <div className="mt-2 border rounded-md">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {metadata.materials.map((material: Material, index: number) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm">{material.type}</td>
                            <td className="px-4 py-2 text-sm">{material.grade}</td>
                            <td className="px-4 py-2 text-sm">{material.location}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">Compliance Tags</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {metadata.complianceTags.map((tag: ComplianceTag, index: number) => (
                      <div key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {tag.code}: {tag.status}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setFile(null)}>Cancel</Button>
        <Button 
          onClick={handleUpload} 
          disabled={!file || uploadStatus === 'uploading' || uploadStatus === 'success'}
        >
          {uploadStatus === 'uploading' ? 'Processing...' : 'Upload & Process Model'}
        </Button>
      </CardFooter>
    </Card>
  );
}
