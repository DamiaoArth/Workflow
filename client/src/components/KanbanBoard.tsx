import { useState } from "react";
import TaskCard from "./TaskCard";
import { useTasks } from "@/hooks/useTasks";
import { useAgents } from "@/hooks/useAgents";
import { Task } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface KanbanBoardProps {
  projectId: number;
  sprintId?: number;
}

type Column = {
  id: string;
  title: string;
  className: string;
  headerClass: string;
  counterClass: string;
};

export default function KanbanBoard({ projectId, sprintId }: KanbanBoardProps) {
  const { tasks, isLoading } = useTasks(projectId, sprintId);
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);
  const { generateAgentActionLog } = useAgents(projectId);
  const { toast } = useToast();

  // Define columns with their styling
  const columns: Column[] = [
    { 
      id: "backlog", 
      title: "Backlog", 
      className: "bg-gray-50", 
      headerClass: "bg-gray-100",
      counterClass: "bg-gray-200 text-gray-700" 
    },
    { 
      id: "todo", 
      title: "To Do", 
      className: "bg-blue-50", 
      headerClass: "bg-blue-100",
      counterClass: "bg-blue-200 text-blue-800" 
    },
    { 
      id: "in_progress", 
      title: "In Progress", 
      className: "bg-yellow-50", 
      headerClass: "bg-yellow-100",
      counterClass: "bg-yellow-200 text-yellow-800" 
    },
    { 
      id: "in_review", 
      title: "In Review", 
      className: "bg-purple-50", 
      headerClass: "bg-purple-100",
      counterClass: "bg-purple-200 text-purple-800" 
    },
    { 
      id: "done", 
      title: "Done", 
      className: "bg-green-50", 
      headerClass: "bg-green-100",
      counterClass: "bg-green-200 text-green-800" 
    }
  ];

  // Filter tasks by column
  const getColumnTasks = (columnId: string) => {
    return tasks.filter(task => task.status === columnId);
  };

  // Handle drag start
  const handleDragStart = (taskId: number) => {
    setDraggedTaskId(taskId);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-gray-100');
  };

  // Handle drag leave
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('bg-gray-100');
  };

  // Handle drop
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, columnId: string) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-gray-100');
    
    if (draggedTaskId === null) return;
    
    const task = tasks.find(t => t.id === draggedTaskId);
    if (!task) return;
    
    if (task.status === columnId) return;
    
    try {
      // Update task status
      const updatedTask = await apiRequest('PATCH', `/api/tasks/${draggedTaskId}`, {
        status: columnId,
        assignedAgent: getAgentForColumn(columnId, task)
      });
      
      // Create agent action log
      const agent = getAgentForColumn(columnId, task) || "System";
      const action = `Task moved from ${formatColumnName(task.status)} to ${formatColumnName(columnId)}`;
      const details = `Updated status for task "${task.title}"`;
      
      await generateAgentActionLog(
        agent,
        action,
        details,
        task.id
      );
      
      // Invalidate tasks query to refresh data
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/tasks`] });
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/agent-logs`] });
      
      // Show success toast
      toast({
        title: "Task Updated",
        description: `Moved "${task.title}" to ${formatColumnName(columnId)}`,
      });
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    }
    
    setDraggedTaskId(null);
  };

  // Helper to format column name for display
  const formatColumnName = (columnId: string) => {
    return columnId
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Helper to get appropriate agent for column
  const getAgentForColumn = (columnId: string, task: Task): string | null => {
    switch (columnId) {
      case 'todo':
        return "Scrum Master";
      case 'in_progress':
        return "Developer Agent";
      case 'in_review':
        return "Developer Agent";
      case 'done':
        return null;
      default:
        return task.assignedAgent;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 overflow-x-auto">
      <div className="flex space-x-4 min-w-max">
        {columns.map((column) => (
          <div key={column.id} className="kanban-column w-72">
            <div className={`${column.headerClass} rounded-t-lg px-3 py-2 flex items-center justify-between`}>
              <h3 className="font-medium text-gray-700">{column.title}</h3>
              <span className={`${column.counterClass} text-xs font-medium px-2 py-0.5 rounded-full`}>
                {getColumnTasks(column.id).length}
              </span>
            </div>
            <div 
              className={`${column.className} rounded-b-lg p-2 space-y-2`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {getColumnTasks(column.id).map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onDragStart={() => handleDragStart(task.id)}
                />
              ))}
              
              {getColumnTasks(column.id).length === 0 && (
                <div className="bg-white p-4 rounded-lg border border-dashed border-gray-300 text-center text-gray-500 text-sm">
                  No tasks in this column
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
