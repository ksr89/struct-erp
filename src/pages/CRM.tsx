import React, { useEffect, useState } from 'react';

interface CrmProject {
  id: string;
  title: string;
  status: string;
}

const dummyProjects: CrmProject[] = [
  { id: "1", title: "Project A", status: "Backlog" },
  { id: "2", title: "Project B", status: "In Progress" },
  { id: "3", title: "Project C", status: "Done" }
];

const CRM: React.FC = () => {
  const [projects, setProjects] = useState<CrmProject[]>([]);

  useEffect(() => {
    // Simulate fetching CRM projects
    setProjects(dummyProjects);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">CRM Projects - Kanban View</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Backlog</h2>
          {projects.filter(p => p.status === "Backlog").map(p => (
            <div key={p.id} className="p-2 border rounded mb-2 bg-white shadow">
              {p.title}
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">In Progress</h2>
          {projects.filter(p => p.status === "In Progress").map(p => (
            <div key={p.id} className="p-2 border rounded mb-2 bg-white shadow">
              {p.title}
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Done</h2>
          {projects.filter(p => p.status === "Done").map(p => (
            <div key={p.id} className="p-2 border rounded mb-2 bg-white shadow">
              {p.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CRM;
