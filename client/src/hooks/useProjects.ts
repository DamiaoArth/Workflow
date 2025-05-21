import { useQuery } from "@tanstack/react-query";
import { Project, Sprint } from "@shared/schema";
import { agents } from "@/lib/agents";

export function useProjects(projectId?: number) {
  // Fetch all projects
  const { data: projects = [] } = useQuery({
    queryKey: ['/api/projects'],
    queryFn: async ({ queryKey }) => {
      const response = await fetch(queryKey[0] as string);
      if (!response.ok) throw new Error('Failed to fetch projects');
      return response.json();
    }
  });

  // Fetch specific project if projectId is provided
  const { data: currentProject } = useQuery({
    queryKey: projectId ? [`/api/projects/${projectId}`] : null,
    queryFn: async ({ queryKey }) => {
      const response = await fetch(queryKey[0] as string);
      if (!response.ok) throw new Error('Failed to fetch project');
      return response.json();
    },
    enabled: !!projectId
  });

  // Fetch sprints for the current project
  const { data: sprints = [] } = useQuery({
    queryKey: projectId ? [`/api/projects/${projectId}/sprints`] : null,
    queryFn: async ({ queryKey }) => {
      const response = await fetch(queryKey[0] as string);
      if (!response.ok) throw new Error('Failed to fetch sprints');
      return response.json();
    },
    enabled: !!projectId
  });

  // Fetch tasks for counting agent workload
  const { data: tasks = [] } = useQuery({
    queryKey: projectId ? [`/api/projects/${projectId}/tasks`] : null,
    queryFn: async ({ queryKey }) => {
      const response = await fetch(queryKey[0] as string);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      return response.json();
    },
    enabled: !!projectId
  });

  // Get current sprint
  const currentSprint = sprints.find((sprint: Sprint) => 
    sprint.id === currentProject?.currentSprintId
  );

  // Count tasks assigned to each agent
  const activeAgents = agents.map(agent => {
    const taskCount = tasks.filter((task: any) => 
      task.assignedAgent === agent.name && 
      ['todo', 'in_progress', 'in_review'].includes(task.status)
    ).length;
    
    return {
      ...agent,
      taskCount
    };
  });

  return {
    projects,
    currentProject,
    sprints,
    currentSprint,
    agents: activeAgents
  };
}
