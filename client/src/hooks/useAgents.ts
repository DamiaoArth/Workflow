import { useQuery } from "@tanstack/react-query";
import { ApiLog } from "@shared/schema";
import { processUserMessage } from "@/lib/agents";
import { apiRequest } from "@/lib/queryClient";

export function useAgents(projectId: number) {
  // Fetch agent logs
  const { data: agentLogs = [], isLoading, error } = useQuery({
    queryKey: [`/api/projects/${projectId}/agent-logs`],
    queryFn: async ({ queryKey }) => {
      const response = await fetch(queryKey[0] as string);
      if (!response.ok) throw new Error('Failed to fetch agent logs');
      return response.json();
    },
    enabled: !!projectId
  });

  // Process user message with agents
  const processMessage = async (message: string) => {
    if (!projectId) return [];
    return await processUserMessage(message, projectId);
  };

  // Generate agent action log
  const generateAgentActionLog = async (
    agentName: string,
    action: string,
    details: string,
    taskId?: number
  ) => {
    if (!projectId) return null;
    
    try {
      const log = await apiRequest("POST", "/api/agent-logs", {
        agentName,
        action,
        details,
        projectId,
        taskId: taskId || null
      });
      
      return log;
    } catch (error) {
      console.error("Error creating agent log:", error);
      return null;
    }
  };

  return {
    agentLogs,
    isLoading,
    error,
    processUserMessage: processMessage,
    generateAgentActionLog
  };
}
