import { useAgents } from "@/hooks/useAgents";
import { useTasks } from "@/hooks/useTasks";
import AgentLog from "./AgentLog";
import { useProjects } from "@/hooks/useProjects";
import { format } from "date-fns";

interface DashboardProps {
  projectId: number;
}

export default function Dashboard({ projectId }: DashboardProps) {
  const { tasks } = useTasks(projectId);
  const { agentLogs } = useAgents(projectId);
  const { currentProject, currentSprint } = useProjects(projectId);

  // Calculate sprint progress
  const calculateProgress = () => {
    if (!tasks.length) return 0;
    const completedTasks = tasks.filter(task => task.status === 'done').length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  // Calculate agent efficiency (mocked)
  const calculateAgentEfficiency = () => {
    return 87;
  };

  // Get estimated completion date
  const getEstimatedCompletionDate = () => {
    if (!currentSprint?.endDate) return 'Not set';
    return format(new Date(currentSprint.endDate), 'MMM d, yyyy');
  };

  const getTimeToCompletion = () => {
    if (!currentSprint?.endDate) return 'Not set';
    const days = Math.ceil(
      (new Date(currentSprint.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return `${days} days`;
  };

  return (
    <div className="px-4 py-6 bg-white border-t border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Project Dashboard</h2>
        <div className="flex space-x-2">
          <button className="text-sm text-gray-600 hover:text-primary">
            <i className="fas fa-download mr-1"></i>Export
          </button>
          <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
            <option>Last 7 days</option>
            <option>Last 14 days</option>
            <option>Last 30 days</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Sprint Progress</h3>
          <div className="text-2xl font-semibold text-primary">{calculateProgress()}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {tasks.filter(task => task.status === 'done').length} of {tasks.length} tasks completed
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Agent Efficiency</h3>
          <div className="text-2xl font-semibold text-green-600">{calculateAgentEfficiency()}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div 
              className="bg-green-500 h-2.5 rounded-full" 
              style={{ width: `${calculateAgentEfficiency()}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {agentLogs.length} agent actions recorded
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Time to Completion</h3>
          <div className="text-2xl font-semibold text-purple-600">{getTimeToCompletion()}</div>
          <div className="flex items-center mt-2 text-xs text-gray-500">
            <i className="fas fa-calendar-alt mr-1"></i>
            Estimated completion: {getEstimatedCompletionDate()}
          </div>
        </div>
      </div>
      
      {/* Agent Activity Log */}
      <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
          <h3 className="font-medium">Agent Activity Log</h3>
        </div>
        <div className="max-h-48 overflow-y-auto p-2">
          <div className="text-xs space-y-2">
            {agentLogs.map((log) => (
              <AgentLog key={log.id} log={log} />
            ))}
            
            {agentLogs.length === 0 && (
              <div className="text-sm text-gray-500 p-4 text-center">
                No agent activity recorded yet
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Task Timeline */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
          <h3 className="font-medium">Task Timeline</h3>
        </div>
        <div className="p-4">
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            {tasks.filter(task => task.status === 'done').slice(0, 2).map((task, index) => (
              <div key={task.id} className="relative pl-10 pb-5">
                <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center">
                  <i className="fas fa-check"></i>
                </div>
                <div className="text-sm font-medium">{task.title}</div>
                <div className="text-xs text-gray-500">
                  {task.createdAt ? format(new Date(task.createdAt), 'MMM d, yyyy') : 'No date'}
                </div>
                <div className="text-xs text-gray-700 mt-1">{task.description}</div>
              </div>
            ))}
            
            {tasks.filter(task => task.status === 'in_review').slice(0, 1).map((task, index) => (
              <div key={task.id} className="relative pl-10 pb-5">
                <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center">
                  <i className="fas fa-spinner fa-spin"></i>
                </div>
                <div className="text-sm font-medium">{task.title}</div>
                <div className="text-xs text-gray-500">
                  {task.createdAt ? format(new Date(task.createdAt), 'MMM d, yyyy') : 'No date'}
                </div>
                <div className="text-xs text-gray-700 mt-1">{task.description} (awaiting review)</div>
              </div>
            ))}
            
            {tasks.filter(task => ['todo', 'in_progress'].includes(task.status)).length > 0 && (
              <div className="relative pl-10">
                <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-yellow-100 text-yellow-800 flex items-center justify-center">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="text-sm font-medium">Ongoing Tasks</div>
                <div className="text-xs text-gray-500">
                  {currentSprint?.startDate && currentSprint?.endDate
                    ? `${format(new Date(currentSprint.startDate), 'MMM d')}-${format(new Date(currentSprint.endDate), 'MMM d, yyyy')}`
                    : 'Current sprint'}
                </div>
                <div className="text-xs text-gray-700 mt-1">
                  {tasks.filter(task => ['todo', 'in_progress'].includes(task.status)).length} tasks in progress
                </div>
              </div>
            )}
            
            {tasks.length === 0 && (
              <div className="text-sm text-gray-500 py-6 text-center">
                No tasks created yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
