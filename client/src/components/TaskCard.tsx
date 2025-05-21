import { Task } from "@shared/schema";
import { format } from "date-fns";

interface TaskCardProps {
  task: Task;
  onDragStart: () => void;
}

export default function TaskCard({ task, onDragStart }: TaskCardProps) {
  // Map task type to a specific style
  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'feature':
        return 'bg-purple-100 text-purple-800';
      case 'bug':
        return 'bg-red-100 text-red-800';
      case 'enhancement':
        return 'bg-blue-100 text-blue-800';
      case 'setup':
        return 'bg-blue-100 text-blue-800';
      case 'backend':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get agent icon and style based on task status
  const getAgentIconStyle = () => {
    switch (task.status) {
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 fas fa-robot';
      case 'in_review':
        return 'bg-purple-100 text-purple-800 fas fa-robot';
      case 'done':
        return 'bg-green-100 text-green-800 fas fa-check';
      default:
        return 'bg-blue-100 text-blue-800 fas fa-robot';
    }
  };

  // Format the due date
  const formatDueDate = (date: Date | null) => {
    if (!date) return '';
    return format(new Date(date), 'MMM d');
  };

  return (
    <div 
      className="task-card bg-white p-3 rounded-lg shadow-sm border border-gray-200"
      draggable
      onDragStart={onDragStart}
    >
      <div className="flex justify-between items-start">
        <span className={`text-xs font-medium ${getTypeStyle(task.type)} px-1.5 py-0.5 rounded`}>
          {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
        </span>
        <div className="text-gray-400 text-sm">{task.reference}</div>
      </div>
      <h4 className="font-medium text-sm mt-2">{task.title}</h4>
      <p className="text-xs text-gray-500 mt-1">{task.description}</p>
      <div className="flex justify-between items-center mt-3">
        <div className="text-xs text-gray-500">
          <i className="fas fa-calendar text-gray-400 mr-1"></i> {formatDueDate(task.dueDate)}
        </div>
        <div className="flex items-center">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${getAgentIconStyle().split(' ').slice(0, 2).join(' ')}`}>
            <i className={getAgentIconStyle().split(' ').slice(2).join(' ')}></i>
          </div>
          
          {task.status === 'in_progress' && task.progress > 0 && (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-1.5 rounded ml-1">
              {task.progress}%
            </span>
          )}
          
          {task.status === 'in_review' && (
            <div className="flex items-center space-x-1 ml-1">
              <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                <i className="fas fa-check"></i>
              </button>
              <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
