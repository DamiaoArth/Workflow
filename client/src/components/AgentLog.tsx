import { AgentLog as AgentLogType } from "@shared/schema";
import { format, formatDistanceToNow } from "date-fns";

interface AgentLogProps {
  log: AgentLogType;
}

export default function AgentLog({ log }: AgentLogProps) {
  // Get agent icon based on agent name
  const getAgentIcon = (agentName: string) => {
    switch (agentName) {
      case "Project Manager":
        return "bg-green-100 text-green-800";
      case "Scrum Master":
        return "bg-purple-100 text-purple-800";
      case "Developer Agent":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format relative time
  const getRelativeTime = (date: Date | null) => {
    if (!date) return 'recently';
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <div className="flex items-start p-2 hover:bg-gray-50 rounded">
      <div className={`w-5 h-5 rounded-full ${getAgentIcon(log.agentName)} flex items-center justify-center text-xs mr-2 mt-0.5`}>
        <i className="fas fa-robot"></i>
      </div>
      <div>
        <div className="flex items-center">
          <span className="font-medium">{log.agentName}</span>
          <span className="text-gray-500 ml-2">{getRelativeTime(log.timestamp)}</span>
        </div>
        <p className="text-gray-700 mt-0.5">{log.details}</p>
      </div>
    </div>
  );
}
