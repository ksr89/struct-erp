import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { crmApi } from '@/services/crm-api';
import { 
  CrmProject, 
  KanbanColumn, 
  KANBAN_COLUMNS,
  ListCrmProjectsFilters
} from '@/types/crm';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  CalendarIcon, 
  DollarSign, 
  UserIcon, 
  ClipboardListIcon, 
  Loader2, 
  PlusCircle,
  SearchIcon,
  XIcon
} from 'lucide-react';

// Handle drag and drop for kanban columns
interface DragItem {
  projectId: string;
  sourceColumn: string;
}

const CrmKanbanView: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<CrmProject[]>([]);
  const [columns, setColumns] = useState<Record<string, CrmProject[]>>({
    backlog: [],
    inProgress: [],
    review: [],
    done: []
  });
  
  // For drag and drop
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'POSTED_RFP' | 'ACTIVE_BID' | ''>('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const filters: ListCrmProjectsFilters = {
        userId: user.id,
        searchTerm: searchTerm || undefined,
        type: (typeFilter as 'POSTED_RFP' | 'ACTIVE_BID') || undefined
      };
      
      const response = await crmApi.getProjects(filters);
      setProjects(response.data);
      
      // Organize projects into columns
      distributeProjectsToColumns(response.data);
    } catch (error) {
      console.error('Failed to load CRM projects:', error);
      toast({
        title: 'Error',
        description: 'Failed to load projects',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const distributeProjectsToColumns = (projects: CrmProject[]) => {
    const newColumns: Record<string, CrmProject[]> = {
      backlog: [],
      inProgress: [],
      review: [],
      done: []
    };
    
    projects.forEach(project => {
      let assigned = false;
      
      for (const colId in KANBAN_COLUMNS) {
        const column = KANBAN_COLUMNS[colId as keyof typeof KANBAN_COLUMNS];
        if (column.statuses.includes(project.status)) {
          newColumns[colId].push(project);
          assigned = true;
          break;
        }
      }
      
      // If status doesn't match any column, place in backlog
      if (!assigned) {
        newColumns.backlog.push(project);
      }
    });
    
    setColumns(newColumns);
  };

  const handleDragStart = (projectId: string, sourceColumn: string) => {
    setDraggedItem({ projectId, sourceColumn });
  };
  
  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDrop = async (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    
    if (!draggedItem) return;
    
    // Don't do anything if dropped in same column
    if (draggedItem.sourceColumn === targetColumnId) {
      setDraggedItem(null);
      return;
    }
    
    try {
      // Find the project
      const sourceColumn = columns[draggedItem.sourceColumn];
      const projectIndex = sourceColumn.findIndex(p => p.id === draggedItem.projectId);
      
      if (projectIndex === -1) return;
      
      const project = sourceColumn[projectIndex];
      
      // Determine new status based on target column
      const targetColumn = KANBAN_COLUMNS[targetColumnId as keyof typeof KANBAN_COLUMNS];
      const newStatus = targetColumn.statuses[0]; // Default to first status in the column
      
      // Optimistically update UI
      const updatedColumns = { ...columns };
      updatedColumns[draggedItem.sourceColumn] = updatedColumns[draggedItem.sourceColumn].filter(p => p.id !== draggedItem.projectId);
      updatedColumns[targetColumnId] = [...updatedColumns[targetColumnId], { ...project, status: newStatus }];
      setColumns(updatedColumns);
      
      // Call API to update status
      await crmApi.updateProjectStatus(draggedItem.projectId, newStatus);
      
      toast({
        title: 'Status Updated',
        description: `Project moved to ${targetColumn.title}`,
        type: 'success'
      });
    } catch (error) {
      console.error('Failed to update project status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update project status',
        type: 'error'
      });
      
      // Revert the change
      loadProjects();
    } finally {
      setDraggedItem(null);
    }
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadProjects();
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('');
    loadProjects();
  };
  
  const handleCreateProject = () => {
    navigate('/crm/project/new');
  };
  
  const handleProjectClick = (projectId: string) => {
    navigate(`/crm/project/${projectId}`);
  };

  // Render project card
  const renderProjectCard = (project: CrmProject) => {
    return (
      <Card 
        key={project.id}
        className="mb-3 cursor-pointer hover:shadow-md"
        draggable
        onDragStart={() => handleDragStart(project.id, getColumnForProject(project))}
        onClick={() => handleProjectClick(project.id)}
      >
        <CardHeader className="p-3 pb-0">
          <div className="flex justify-between items-start">
            <CardTitle className="text-sm font-medium line-clamp-1">
              {project.title}
            </CardTitle>
            <Badge variant={project.type === 'POSTED_RFP' ? 'default' : 'secondary'} className="text-xs">
              {project.type === 'POSTED_RFP' ? 'RFP' : 'Bid'}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-3 pt-2">
          {project.description && (
            <p className="text-xs text-gray-600 line-clamp-2 mb-2">
              {project.description}
            </p>
          )}
          
          <div className="grid grid-cols-2 gap-1 text-xs">
            {project.budget && (
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                <span>{project.budget.toLocaleString()}</span>
              </div>
            )}
            
            {project.client && (
              <div className="flex items-center gap-1">
                <UserIcon className="h-3 w-3" />
                <span className="line-clamp-1">{project.client}</span>
              </div>
            )}
            
            {project.dueDate && (
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                <span>
                  {new Date(project.dueDate).toLocaleDateString()}
                </span>
              </div>
            )}
            
            {project.priority && (
              <div className="flex items-center gap-1">
                <ClipboardListIcon className="h-3 w-3" />
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    project.priority === 'high' ? 'bg-red-100 text-red-700' :
                    project.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}
                >
                  {project.priority}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
        
        {project.tags && project.tags.length > 0 && (
          <CardFooter className="p-3 pt-0 flex flex-wrap gap-1">
            {project.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </CardFooter>
        )}
      </Card>
    );
  };

  // Helper to find which column contains a project
  const getColumnForProject = (project: CrmProject): string => {
    for (const colId in columns) {
      if (columns[colId].some(p => p.id === project.id)) {
        return colId;
      }
    }
    return 'backlog'; // Default
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Project Management</h1>
        
        <Button onClick={handleCreateProject}>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>
      
      {/* Filters */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="flex-grow"
          />
          
          <Select 
            value={typeFilter} 
            onValueChange={(value: 'POSTED_RFP' | 'ACTIVE_BID' | '') => setTypeFilter(value)}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="POSTED_RFP">RFPs</SelectItem>
              <SelectItem value="ACTIVE_BID">Bids</SelectItem>
            </SelectContent>
          </Select>
          
          <Button type="submit" variant="default">
            <SearchIcon className="h-4 w-4 mr-2" />
            Search
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={clearFilters}
            className="sm:ml-2"
          >
            <XIcon className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </form>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading projects...</span>
        </div>
      )}
      
      {/* Kanban board */}
      {!loading && (
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {Object.entries(KANBAN_COLUMNS).map(([columnId, column]) => (
            <div
              key={columnId}
              className={`flex-shrink-0 w-72 ${column.color}`}
              onDragOver={(e) => handleDragOver(e, columnId)}
              onDrop={(e) => handleDrop(e, columnId)}
            >
              <div className="p-3 rounded-t-lg bg-white bg-opacity-90 border-b">
                <h3 className="font-medium text-sm">
                  {column.title} ({columns[columnId]?.length || 0})
                </h3>
              </div>
              
              <div className="p-3 rounded-b-lg min-h-[500px] bg-white bg-opacity-50">
                {columns[columnId]?.length === 0 ? (
                  <div className="flex items-center justify-center h-20 border border-dashed rounded-lg border-gray-300 text-gray-500 text-sm">
                    No projects
                  </div>
                ) : (
                  columns[columnId]?.map(project => renderProjectCard(project))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CrmKanbanView;
