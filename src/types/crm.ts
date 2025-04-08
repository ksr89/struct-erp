/**
 * Types for CRM functionality, providing Kanban view of marketplace activities
 */

// Project representation in Kanban view
export interface CrmProject {
  id: string;
  title: string;
  type: 'POSTED_RFP' | 'ACTIVE_BID';
  status: string; // Maps to a Kanban column
  rfpId?: string;
  bidId?: string;
  description?: string;
  budget?: number;
  dueDate?: string | Date;
  client?: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
}

// Filters for CRM projects list
export interface ListCrmProjectsFilters {
  userId: string;
  status?: string;
  type?: 'POSTED_RFP' | 'ACTIVE_BID';
  searchTerm?: string;
  priority?: string;
}

// Column definition for Kanban board
export interface KanbanColumn {
  id: string;
  title: string;
  statuses: string[];
  color?: string;
  limit?: number;
}

// Define standard Kanban columns
export const KANBAN_COLUMNS: Record<string, KanbanColumn> = {
  backlog: { 
    id: 'backlog', 
    title: 'Backlog / Open',
    statuses: ['Open for Bids', 'Pending Review'],
    color: 'bg-gray-100'
  },
  inProgress: { 
    id: 'inProgress', 
    title: 'In Progress', 
    statuses: ['In Progress', 'Awarded'],
    color: 'bg-blue-100'
  },
  review: { 
    id: 'review', 
    title: 'Review / Pending Action', 
    statuses: ['Under Review', 'Approval Pending'],
    color: 'bg-amber-100'
  },
  done: { 
    id: 'done', 
    title: 'Done / Archived', 
    statuses: ['Closed', 'Cancelled', 'Archived', 'Lost', 'Completed'],
    color: 'bg-green-100'
  }
};

// Example type for CRM contacts (leads, clients, suppliers)
export interface CrmContact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  type: 'LEAD' | 'CLIENT' | 'SUPPLIER';
  notes?: string;
  relatedUserId?: string;
  createdAt: Date | string;
  lastContact?: Date | string;
}
