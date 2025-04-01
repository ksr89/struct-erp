import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { UserRole, PERMISSIONS } from "../types/auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

// Mock data
const dummyProjects = [
  {
    id: 1,
    title: "Downtown Office Tower",
    budget: "$5,000,000",
    status: "Open",
    location: "New York, NY",
    description: "Request for bids to construct a 10-story office building in the downtown core.",
    postedBy: "ABC Developers Inc.",
    postedDate: "2025-02-15",
    deadline: "2025-04-01",
    bids: [
      { id: 101, bidder: "Global Construction Ltd.", amount: "$4,800,000", status: "Pending" },
      { id: 102, bidder: "Urban Builders Co.", amount: "$5,200,000", status: "Pending" }
    ]
  },
  {
    id: 2,
    title: "Suburban Housing Project",
    budget: "$2,000,000",
    status: "Closed",
    location: "Austin, TX",
    description: "Residential project featuring 50 units with modern amenities.",
    postedBy: "Homestead Developers",
    postedDate: "2025-01-10",
    deadline: "2025-02-28",
    bids: [
      { id: 201, bidder: "Quality Homes Inc.", amount: "$1,950,000", status: "Accepted" },
      { id: 202, bidder: "Residential Experts", amount: "$2,100,000", status: "Rejected" }
    ]
  },
  {
    id: 3,
    title: "Industrial Warehouse Expansion",
    budget: "$3,500,000",
    status: "Open",
    location: "Chicago, IL",
    description: "Expansion project for a logistics company requiring sustainable design solutions.",
    postedBy: "LogiTech Industries",
    postedDate: "2025-03-01",
    deadline: "2025-05-15",
    bids: [
      { id: 301, bidder: "Industrial Constructors", amount: "$3,400,000", status: "Pending" }
    ]
  },
  {
    id: 4,
    title: "Community Center Renovation",
    budget: "$1,200,000",
    status: "Open",
    location: "Portland, OR",
    description: "Renovation of an existing community center with focus on accessibility and energy efficiency.",
    postedBy: "Portland City Council",
    postedDate: "2025-02-20",
    deadline: "2025-04-10",
    bids: []
  }
];

const Marketplace = () => {
  const { user, hasPermission } = useAuth();
  const [projects, setProjects] = useState(dummyProjects);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [newProject, setNewProject] = useState({
    title: "",
    budget: "",
    location: "",
    description: "",
    deadline: ""
  });

  const canCreateProject = hasPermission(PERMISSIONS.CREATE_PROJECT);
  const canSubmitBid = hasPermission(PERMISSIONS.SUBMIT_BID);
  const canAcceptBid = hasPermission(PERMISSIONS.ACCEPT_BID);

  const handleCreateProject = () => {
    const project = {
      id: projects.length + 1,
      title: newProject.title,
      budget: `$${newProject.budget}`,
      status: "Open",
      location: newProject.location,
      description: newProject.description,
      postedBy: user?.name || "Anonymous",
      postedDate: new Date().toISOString().split('T')[0],
      deadline: newProject.deadline,
      bids: []
    };

    setProjects([project, ...projects]);
    setNewProject({
      title: "",
      budget: "",
      location: "",
      description: "",
      deadline: ""
    });
  };

  const handleSubmitBid = (projectId: number) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          bids: [
            ...project.bids,
            {
              id: Date.now(),
              bidder: user?.name || "Anonymous Bidder",
              amount: `$${bidAmount}`,
              status: "Pending"
            }
          ]
        };
      }
      return project;
    });

    setProjects(updatedProjects);
    setBidAmount("");
    setSelectedProject(null);
  };

  const handleAcceptBid = (projectId: number, bidId: number) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          status: "Closed",
          bids: project.bids.map(bid => ({
            ...bid,
            status: bid.id === bidId ? "Accepted" : "Rejected"
          }))
        };
      }
      return project;
    });

    setProjects(updatedProjects);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Construction Marketplace</h1>
          <p className="text-muted-foreground">
            Find projects, submit bids, and manage construction contracts
          </p>
        </div>
        
        {canCreateProject && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>Post New RFP</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Post a New RFP</DialogTitle>
                <DialogDescription>
                  Enter the details of your construction project to receive bids from qualified contractors.
                </DialogDescription>
              </DialogHeader>
              <div className="mb-4">
                <Label className="mb-2">Select RFP Type</Label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-1">
                    <input type="radio" name="rfpType" value="Project" defaultChecked />
                    <span>Project</span>
                  </label>
                  <label className="flex items-center space-x-1">
                    <input type="radio" name="rfpType" value="Service" />
                    <span>Service</span>
                  </label>
                  <label className="flex items-center space-x-1">
                    <input type="radio" name="rfpType" value="Rental" />
                    <span>Rental Trip</span>
                  </label>
                  <label className="flex items-center space-x-1">
                    <input type="radio" name="rfpType" value="Parts" />
                    <span>Parts/Supplies</span>
                  </label>
                </div>
              </div>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input 
                    id="title" 
                    value={newProject.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProject({...newProject, title: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="budget">Budget ($)</Label>
                    <Input 
                      id="budget" 
                      type="number"
                      value={newProject.budget}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProject({...newProject, budget: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="deadline">Bid Deadline</Label>
                    <Input 
                      id="deadline" 
                      type="date"
                      value={newProject.deadline}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProject({...newProject, deadline: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    value={newProject.location}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProject({...newProject, location: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea 
                    id="description" 
                    rows={4}
                    value={newProject.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewProject({...newProject, description: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleCreateProject}>Post Project</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="open">Open for Bids</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
          {user?.roles.includes(UserRole.CONTRACTOR) && (
            <TabsTrigger value="my-projects">My Projects</TabsTrigger>
          )}
          {user?.roles.includes(UserRole.SUPPLIER) && (
            <TabsTrigger value="my-bids">My Bids</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <ProjectCard 
                key={project.id}
                project={project}
                onViewDetails={() => setSelectedProject(project)}
                canSubmitBid={canSubmitBid}
                canAcceptBid={canAcceptBid && project.postedBy === user?.name}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="open" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.filter(p => p.status === "Open").map((project) => (
              <ProjectCard 
                key={project.id}
                project={project}
                onViewDetails={() => setSelectedProject(project)}
                canSubmitBid={canSubmitBid}
                canAcceptBid={canAcceptBid && project.postedBy === user?.name}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="closed" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.filter(p => p.status === "Closed").map((project) => (
              <ProjectCard 
                key={project.id}
                project={project}
                onViewDetails={() => setSelectedProject(project)}
                canSubmitBid={false}
                canAcceptBid={false}
              />
            ))}
          </div>
        </TabsContent>
        
        {user?.roles.includes(UserRole.CONTRACTOR) && (
          <TabsContent value="my-projects" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.filter(p => p.postedBy === user.name).map((project) => (
                <ProjectCard 
                  key={project.id}
                  project={project}
                  onViewDetails={() => setSelectedProject(project)}
                  canSubmitBid={false}
                  canAcceptBid={canAcceptBid}
                />
              ))}
            </div>
          </TabsContent>
        )}
        
        {user?.roles.includes(UserRole.SUPPLIER) && (
          <TabsContent value="my-bids" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.filter(p => p.bids.some(b => b.bidder === user.name)).map((project) => (
                <ProjectCard 
                  key={project.id}
                  project={project}
                  onViewDetails={() => setSelectedProject(project)}
                  canSubmitBid={project.status === "Open"}
                  canAcceptBid={false}
                />
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Project Details Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={(open: boolean) => !open && setSelectedProject(null)}>
        <DialogContent className="sm:max-w-[700px]">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProject.title}</DialogTitle>
                <DialogDescription>
                  Posted by {selectedProject.postedBy} on {selectedProject.postedDate}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex justify-between">
                  <div>
                    <span className="text-sm font-medium">Budget:</span>
                    <span className="ml-2">{selectedProject.budget}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Status:</span>
                    <Badge className="ml-2" variant={selectedProject.status === "Open" ? "default" : "secondary"}>
                      {selectedProject.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium">Location:</span>
                  <span className="ml-2">{selectedProject.location}</span>
                </div>
                <div>
                  <span className="text-sm font-medium">Bid Deadline:</span>
                  <span className="ml-2">{selectedProject.deadline}</span>
                </div>
                <div>
                  <span className="text-sm font-medium">Description:</span>
                  <p className="mt-1 text-sm">{selectedProject.description}</p>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Bids</h3>
                  {selectedProject.bids.length > 0 ? (
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Bidder</th>
                          <th className="text-left py-2">Amount</th>
                          <th className="text-left py-2">Status</th>
                          {canAcceptBid && selectedProject.status === "Open" && (
                            <th className="text-left py-2">Action</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {selectedProject.bids.map((bid: any) => (
                          <tr key={bid.id} className="border-b">
                            <td className="py-2">{bid.bidder}</td>
                            <td className="py-2">{bid.amount}</td>
                            <td className="py-2">
                              <Badge variant={
                                bid.status === "Accepted" ? "default" : 
                                bid.status === "Rejected" ? "destructive" : 
                                "outline"
                              }>
                                {bid.status}
                              </Badge>
                            </td>
                            {canAcceptBid && selectedProject.status === "Open" && (
                              <td className="py-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleAcceptBid(selectedProject.id, bid.id)}
                                >
                                  Accept
                                </Button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-sm text-muted-foreground">No bids have been submitted yet.</p>
                  )}
                </div>
                
                {canSubmitBid && selectedProject.status === "Open" && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Submit a Bid</h3>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          type="number"
                          placeholder="Bid amount in USD"
                          value={bidAmount}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBidAmount(e.target.value)}
                        />
                      </div>
                      <Button 
                        onClick={() => handleSubmitBid(selectedProject.id)}
                        disabled={!bidAmount}
                      >
                        Submit Bid
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface ProjectCardProps {
  project: any;
  onViewDetails: () => void;
  canSubmitBid: boolean;
  canAcceptBid: boolean;
}

const ProjectCard = ({ project, onViewDetails, canSubmitBid, canAcceptBid }: ProjectCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{project.title}</CardTitle>
          <Badge variant={project.status === "Open" ? "default" : "secondary"}>
            {project.status}
          </Badge>
        </div>
        <CardDescription>{project.location}</CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Budget:</span>
          <span>{project.budget}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Posted by:</span>
          <span>{project.postedBy}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Deadline:</span>
          <span>{project.deadline}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
          {project.description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {project.bids.length} bid{project.bids.length !== 1 ? 's' : ''}
        </div>
        <Button variant="outline" onClick={onViewDetails}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Marketplace;
