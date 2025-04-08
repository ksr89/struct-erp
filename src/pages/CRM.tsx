import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Clock, CalendarClock, CheckCircle, AlertCircle, MoreHorizontal, Plus } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogTrigger,
  DialogDescription
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';

// Types defined based on the original task spec
interface CrmProject {
  id: string;
  title: string;
  type: 'POSTED_RFP' | 'ACTIVE_BID';
  status: string;
  rfpId?: string;
  bidId?: string;
  description?: string;
  deadline?: string;
  client?: string;
  budget?: string;
}

// Kanban columns based on task spec
const KANBAN_COLUMNS = {
  backlog: { id: 'backlog', title: 'Backlog / Open', statuses: ['Open for Bids', 'Pending Review'] },
  inProgress: { id: 'inProgress', title: 'In Progress', statuses: ['In Progress', 'Awarded'] },
  review: { id: 'review', title: 'Review / Pending Action', statuses: ['Under Review', 'Approval Pending'] },
  done: { id: 'done', title: 'Done / Archived', statuses: ['Closed', 'Cancelled', 'Archived', 'Completed'] }
};

type ColumnId = keyof typeof KANBAN_COLUMNS;

// Sample data based on the task
const initialProjects: CrmProject[] = [
  { 
    id: "1", 
    title: "Downtown Office Tower", 
    type: "POSTED_RFP",
    status: "Open for Bids",
    rfpId: "rfp-001",
    description: "Request for bids to construct a 10-story office building in the downtown core.",
    client: "ABC Developers Inc.",
    budget: "$5,000,000",
    deadline: "2025-04-01"
  },
  { 
    id: "2", 
    title: "Suburban Housing Project", 
    type: "ACTIVE_BID",
    status: "Awarded",
    rfpId: "rfp-002",
    bidId: "bid-101",
    description: "Residential project featuring 50 units with modern amenities.",
    client: "Homestead Developers",
    budget: "$2,000,000",
    deadline: "2025-02-28"
  },
  { 
    id: "3", 
    title: "Industrial Warehouse Expansion", 
    type: "POSTED_RFP",
    status: "Pending Review",
    rfpId: "rfp-003",
    description: "Expansion project for a logistics company requiring sustainable design solutions.",
    client: "LogiTech Industries",
    budget: "$3,500,000",
    deadline: "2025-05-15"
  },
  { 
    id: "4", 
    title: "Community Center Renovation Bid", 
    type: "ACTIVE_BID",
    status: "In Progress",
    rfpId: "rfp-004",
    bidId: "bid-202",
    description: "Our bid on the renovation of the Portland community center project.",
    client: "Portland City Council",
    budget: "$1,150,000",
    deadline: "2025-06-30"
  },
  { 
    id: "5", 
    title: "Highway Overpass Repair", 
    type: "POSTED_RFP",
    status: "Closed",
    rfpId: "rfp-005",
    description: "Structural repairs to the highway overpass damaged in the recent storm.",
    client: "State DOT",
    budget: "$750,000",
    deadline: "2025-03-15"
  }
];

const CRM: React.FC = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<CrmProject[]>(initialProjects);
  const [columns, setColumns] = useState<Record<ColumnId, CrmProject[]>>({} as Record<ColumnId, CrmProject[]>);
  const [selectedProject, setSelectedProject] = useState<CrmProject | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState<Partial<CrmProject>>({
    title: '',
    type: 'POSTED_RFP',
    status: 'Open for Bids',
    description: '',
    client: '',
    budget: '',
    deadline: ''
  });
  
  // Use effect to organize projects by column when they change
  useEffect(() => {
    setColumns(organizeProjectsByColumn(projects));
  }, [projects]);

  // Organize projects into columns based on their status
  function organizeProjectsByColumn(projectsList: CrmProject[]): Record<ColumnId, CrmProject[]> {
    const organized: Record<ColumnId, CrmProject[]> = {
      backlog: [],
      inProgress: [],
      review: [],
      done: []
    };

    projectsList.forEach(project => {
      let assigned = false;
      for (const colId in KANBAN_COLUMNS) {
        const column = KANBAN_COLUMNS[colId as ColumnId];
        if (column.statuses.includes(project.status)) {
          organized[colId as ColumnId].push(project);
          assigned = true;
          break;
        }
      }
      // If status doesn't match any column, put in backlog
      if (!assigned) {
        organized.backlog.push(project);
      }
    });

    return organized;
  }

  // Handle drag and drop between columns
  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    
    // Dropped outside a droppable area
    if (!destination) return;
    
    // Dropped in the same place
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    
    // Find the project being dragged
    const projectId = draggableId;
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    // Find the new status based on destination column
    const destColumn = KANBAN_COLUMNS[destination.droppableId as ColumnId];
    const newStatus = destColumn.statuses[0]; // Default to first status in the column
    
    // Update the project status
    const updatedProjects = projects.map(p => 
      p.id === projectId ? { ...p, status: newStatus } : p
    );
    
    // First update the columns state for immediate visual feedback
    const newColumns = {...columns};
    
    // Remove from source column
    const sourceColumn = [...columns[source.droppableId as ColumnId]];
    const [removed] = sourceColumn.splice(source.index, 1);
    newColumns[source.droppableId as ColumnId] = sourceColumn;
    
    // Add to destination column
    const destColumnArray = [...columns[destination.droppableId as ColumnId]];
    destColumnArray.splice(destination.index, 0, {...removed, status: newStatus});
    newColumns[destination.droppableId as ColumnId] = destColumnArray;
    
    // Update columns first for instant UI update
    setColumns(newColumns);
    
    // Then update projects (this will trigger the useEffect that reorganizes columns, but we won't see a flicker)
    setProjects(updatedProjects);
    
    // Show success toast
    toast({
      title: "Status Updated",
      description: `${project.title} moved to ${destColumn.title} status`,
    });
  };

  const handleCreateProject = () => {
    const projectId = `${Date.now()}`;
    const project: CrmProject = {
      id: projectId,
      title: newProject.title || 'Untitled Project',
      type: newProject.type as 'POSTED_RFP' | 'ACTIVE_BID',
      status: newProject.status || 'Open for Bids',
      description: newProject.description,
      client: newProject.client,
      budget: newProject.budget,
      deadline: newProject.deadline,
      rfpId: newProject.type === 'POSTED_RFP' ? `rfp-${projectId}` : undefined,
      bidId: newProject.type === 'ACTIVE_BID' ? `bid-${projectId}` : undefined
    };
    
    const updatedProjects = [...projects, project];
    setProjects(updatedProjects);
    
    // Reset form
    setNewProject({
      title: '',
      type: 'POSTED_RFP',
      status: 'Open for Bids',
      description: '',
      client: '',
      budget: '',
      deadline: ''
    });
    setIsCreateDialogOpen(false);
    
    // Show success toast
    toast({
      title: "Project Created",
      description: `${project.title} has been added to the board`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">CRM Projects - Kanban Board</h2>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" /> Add Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Add a new project to your Kanban board
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-3">
                <div className="grid gap-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input 
                    id="title" 
                    value={newProject.title}
                    onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Project Type</Label>
                    <Select 
                      value={newProject.type} 
                      onValueChange={(value) => setNewProject({...newProject, type: value as 'POSTED_RFP' | 'ACTIVE_BID'})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="POSTED_RFP">Posted RFP</SelectItem>
                        <SelectItem value="ACTIVE_BID">Active Bid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={newProject.status} 
                      onValueChange={(value) => setNewProject({...newProject, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(KANBAN_COLUMNS).flatMap(column => 
                          column.statuses.map(status => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="client">Client</Label>
                  <Input 
                    id="client" 
                    value={newProject.client}
                    onChange={(e) => setNewProject({...newProject, client: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="budget">Budget</Label>
                    <Input 
                      id="budget" 
                      value={newProject.budget}
                      onChange={(e) => setNewProject({...newProject, budget: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="deadline">Deadline</Label>
                    <Input 
                      id="deadline" 
                      type="date"
                      value={newProject.deadline}
                      onChange={(e) => setNewProject({...newProject, deadline: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProject}>
                  Create Project
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-4 overflow-x-auto">
            {Object.values(KANBAN_COLUMNS).map(column => (
              <Droppable key={column.id} droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-gray-100 rounded-lg p-4 min-h-[500px] w-full"
                  >
                    <h3 className="font-semibold text-gray-700 mb-3 flex items-center justify-between">
                      {column.title}
                      <span className="text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                        {columns[column.id as ColumnId]?.length || 0}
                      </span>
                    </h3>
                    
                    <div className="space-y-3">
                      {columns[column.id as ColumnId]?.map((project, index) => (
                        <Draggable key={project.id} draggableId={project.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white p-3 rounded-md shadow border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                              onClick={() => setSelectedProject(project)}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-gray-900">{project.title}</h4>
                                <div className={`text-xs px-1.5 py-0.5 rounded-full ${
                                  project.type === 'POSTED_RFP' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {project.type === 'POSTED_RFP' ? 'RFP' : 'Bid'}
                                </div>
                              </div>
                              {project.client && (
                                <p className="text-xs text-gray-500 mb-2">
                                  Client: {project.client}
                                </p>
                              )}
                              {project.budget && (
                                <p className="text-xs text-gray-500 mb-2">
                                  Budget: {project.budget}
                                </p>
                              )}
                              {project.deadline && (
                                <div className="flex items-center text-xs text-gray-500 mt-2">
                                  <CalendarClock className="h-3 w-3 mr-1" />
                                  Due: {new Date(project.deadline).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
        
        {/* Project Details Dialog */}
        {selectedProject && (
          <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>{selectedProject.title}</span>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    selectedProject.type === 'POSTED_RFP' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedProject.type === 'POSTED_RFP' ? 'RFP' : 'Bid'}
                  </div>
                </DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <div className="mb-4 pb-4 border-b">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                  <div className="flex items-center">
                    <div className={`px-2 py-1 rounded-md text-sm ${
                      selectedProject.status.includes('Open') || selectedProject.status.includes('Pending')
                        ? 'bg-blue-100 text-blue-800'
                        : selectedProject.status.includes('Progress') || selectedProject.status.includes('Awarded')
                        ? 'bg-yellow-100 text-yellow-800'
                        : selectedProject.status.includes('Completed') || selectedProject.status.includes('Done')
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedProject.status}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b">
                  {selectedProject.client && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Client</h3>
                      <p className="text-sm">{selectedProject.client}</p>
                    </div>
                  )}
                  {selectedProject.budget && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Budget</h3>
                      <p className="text-sm">{selectedProject.budget}</p>
                    </div>
                  )}
                </div>
                
                {selectedProject.deadline && (
                  <div className="mb-4 pb-4 border-b">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Deadline</h3>
                    <div className="flex items-center text-sm">
                      <CalendarClock className="h-4 w-4 mr-1 text-gray-400" />
                      {new Date(selectedProject.deadline).toLocaleDateString()}
                    </div>
                  </div>
                )}
                
                {selectedProject.description && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                    <p className="text-sm">{selectedProject.description}</p>
                  </div>
                )}
                
                <div className="flex items-center mt-4 pt-4 border-t">
                  <div className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {selectedProject.type === 'POSTED_RFP' 
                      ? `RFP ID: ${selectedProject.rfpId}`
                      : `Bid ID: ${selectedProject.bidId}`
                    }
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CRM;
