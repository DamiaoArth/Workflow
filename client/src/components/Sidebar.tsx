import { useProjects } from "@/hooks/useProjects";

interface SidebarProps {
  currentProject?: number;
  onProjectSelect: (projectId: number) => void;
  className?: string;
}

export default function Sidebar({ currentProject, onProjectSelect, className = "" }: SidebarProps) {
  const { projects, currentSprint, agents } = useProjects(currentProject);

  return (
    <aside className={`hidden md:block w-64 border-r border-gray-200 bg-white ${className}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-lg">Projects</h2>
          <button className="text-sm text-primary hover:text-blue-700">
            <i className="fas fa-plus"></i>
          </button>
        </div>
        
        <div className="space-y-1">
          {projects.map((project) => (
            <button 
              key={project.id}
              onClick={() => onProjectSelect(project.id)}
              className={`w-full text-left py-2 px-3 rounded-md font-medium text-sm ${
                currentProject === project.id 
                  ? "bg-blue-50 text-primary" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <i className={`${currentProject === project.id ? "fas fa-star text-yellow-500" : "far fa-folder"} mr-2`}></i>
              {project.name}
            </button>
          ))}
          
          {projects.length === 0 && (
            <div className="text-sm text-gray-500 py-2 px-3">
              No projects yet
            </div>
          )}
        </div>
        
        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-500 mb-3">SPRINTS</h3>
          <div className="space-y-1">
            {currentSprint ? (
              <>
                <button className="w-full text-left py-2 px-3 bg-blue-50 text-primary rounded-md font-medium text-sm">
                  {currentSprint.name} <span className="text-xs bg-blue-100 py-0.5 px-2 rounded-full ml-2">Current</span>
                </button>
                <button className="w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-md font-medium text-sm">
                  Sprint 2 <span className="text-xs text-gray-500">(Upcoming)</span>
                </button>
              </>
            ) : (
              <div className="text-sm text-gray-500 py-2 px-3">
                No sprints created
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-500 mb-3">AGENTS</h3>
          <div className="space-y-1">
            {agents.map((agent, index) => (
              <div key={index} className="flex items-center py-2 px-3 text-gray-700 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                {agent.name} 
                {agent.taskCount > 0 && (
                  <span className="text-xs bg-blue-100 ml-2 px-1.5 rounded">{agent.taskCount}</span>
                )}
              </div>
            ))}
            
            {agents.length === 0 && (
              <div className="text-sm text-gray-500 py-2 px-3">
                No active agents
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
