import { useQuery } from "@tanstack/react-query";
import { Task } from "@shared/schema";

export function useTasks(projectId: number, sprintId?: number) {
  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: [`/api/projects/${projectId}/tasks`, sprintId],
    queryFn: async ({ queryKey }) => {
      const [baseUrl, sprintIdParam] = queryKey;
      const url = sprintIdParam 
        ? `${baseUrl}?sprintId=${sprintIdParam}` 
        : baseUrl as string;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      return response.json();
    },
    enabled: !!projectId
  });

  // Group tasks by status
  const tasksByStatus = {
    backlog: tasks.filter((task: Task) => task.status === 'backlog'),
    todo: tasks.filter((task: Task) => task.status === 'todo'),
    in_progress: tasks.filter((task: Task) => task.status === 'in_progress'),
    in_review: tasks.filter((task: Task) => task.status === 'in_review'),
    done: tasks.filter((task: Task) => task.status === 'done')
  };

  // Count tasks by type
  const tasksByType = {
    feature: tasks.filter((task: Task) => task.type === 'feature').length,
    bug: tasks.filter((task: Task) => task.type === 'bug').length,
    enhancement: tasks.filter((task: Task) => task.type === 'enhancement').length,
    backend: tasks.filter((task: Task) => task.type === 'backend').length,
    setup: tasks.filter((task: Task) => task.type === 'setup').length
  };

  return {
    tasks,
    tasksByStatus,
    tasksByType,
    isLoading,
    error
  };
}
