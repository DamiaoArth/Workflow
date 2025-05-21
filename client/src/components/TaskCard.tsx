import { Task } from "@shared/schema";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface TaskCardProps {
  task: Task;
  onDragStart: () => void;
  onDelete?: (taskId: number) => Promise<void>;
}

export default function TaskCard({ task, onDragStart, onDelete }: TaskCardProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Map task type to a specific style
  const getTypeStyle = (type: string | null) => {
    if (!type) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    
    switch (type) {
      case 'feature':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'bug':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'enhancement':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'setup':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'backend':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  // Get agent icon and style based on task status
  const getAgentIconStyle = () => {
    switch (task.status) {
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 fas fa-robot';
      case 'in_review':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 fas fa-robot';
      case 'done':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 fas fa-check';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 fas fa-robot';
    }
  };

  // Format the due date
  const formatDueDate = (date: Date | null) => {
    if (!date) return '';
    return format(new Date(date), 'MMM d');
  };

  // Handle task deletion
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onDelete) {
      try {
        setIsDeleting(true);
        await apiRequest('DELETE', `/api/tasks/${task.id}`);
        // Invalidate tasks query to refresh data
        queryClient.invalidateQueries({ queryKey: [`/api/projects/${task.projectId}/tasks`] });
        toast({
          title: "Task Deleted",
          description: `"${task.title}" has been removed`,
        });
      } catch (error) {
        console.error("Error deleting task:", error);
        toast({
          title: "Error",
          description: "Failed to delete task",
          variant: "destructive",
        });
      } finally {
        setIsDeleting(false);
      }
    } else {
      await onDelete(task.id);
    }
  };

  return (
    <div 
      className="task-card bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 relative group"
      draggable
      onDragStart={onDragStart}
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      {/* Delete button - shows on hover */}
      {showOptions && (
        <button 
          className="absolute top-1 right-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          onClick={handleDelete}
          disabled={isDeleting}
          aria-label="Delete task"
        >
          <i className={isDeleting ? "fas fa-spinner fa-spin" : "fas fa-trash-alt"}></i>
        </button>
      )}
      
      <div className="flex justify-between items-start pr-4">
        <span className={`text-xs font-medium ${getTypeStyle(task.type)} px-1.5 py-0.5 rounded`}>
          {task.type ? task.type.charAt(0).toUpperCase() + task.type.slice(1) : 'Task'}
        </span>
        <div className="text-gray-400 dark:text-gray-500 text-sm">{task.reference}</div>
      </div>
      <h4 className="font-medium text-sm mt-2 text-gray-800 dark:text-gray-200">{task.title}</h4>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{task.description}</p>
      <div className="flex justify-between items-center mt-3">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <i className="fas fa-calendar text-gray-400 dark:text-gray-500 mr-1"></i> {formatDueDate(task.dueDate)}
        </div>
        <div className="flex items-center">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${getAgentIconStyle().split(' ').slice(0, 2).join(' ')}`}>
            <i className={getAgentIconStyle().split(' ').slice(2).join(' ')}></i>
          </div>
          
          {task.status === 'in_progress' && task.progress && task.progress > 0 && (
            <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs px-1.5 rounded ml-1">
              {task.progress}%
            </span>
          )}
          
          {task.status === 'in_review' && (
            <div className="flex items-center space-x-1 ml-1">
              <button className="text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded">
                <i className="fas fa-check"></i>
              </button>
              <button className="text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded">
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
