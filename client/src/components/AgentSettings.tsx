import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/components/ui/ThemeProvider";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface AgentSettingsProps {
  projectId: number;
  onClose: () => void;
}

type AgentType = {
  id: number;
  name: string;
  role: string;
  capabilities: string[];
  active: boolean;
  efficiency: number;
};

type Assistant = {
  id: number;
  name: string;
  model: string;
  specialization: string;
  active: boolean;
};

type Team = {
  id: number;
  name: string;
  members: string[];
  description: string;
  active: boolean;
};

export default function AgentSettings({ projectId, onClose }: AgentSettingsProps) {
  const { theme } = useTheme();
  const { toast } = useToast();
  
  // Sample data for the three types of entities
  const [agents, setAgents] = useState<AgentType[]>([
    {
      id: 1,
      name: "Alex",
      role: "Frontend Developer",
      capabilities: ["React", "CSS", "UI Design"],
      active: true,
      efficiency: 85
    },
    {
      id: 2,
      name: "Morgan",
      role: "Backend Developer",
      capabilities: ["Node.js", "Express", "Databases"],
      active: true,
      efficiency: 92
    },
    {
      id: 3,
      name: "Taylor",
      role: "DevOps Engineer",
      capabilities: ["Docker", "CI/CD", "Cloud Deployment"],
      active: false,
      efficiency: 78
    }
  ]);
  
  const [assistants, setAssistants] = useState<Assistant[]>([
    {
      id: 1,
      name: "CodeHelper",
      model: "GPT-4o-mini",
      specialization: "Code generation & refactoring",
      active: true
    },
    {
      id: 2,
      name: "PlannerGPT",
      model: "GPT-4",
      specialization: "Sprint planning & task breakdown",
      active: true
    },
    {
      id: 3,
      name: "TestBuddy",
      model: "GPT-3.5",
      specialization: "Test case generation",
      active: false
    }
  ]);
  
  const [teams, setTeams] = useState<Team[]>([
    {
      id: 1,
      name: "Frontend Team",
      members: ["Alex", "CodeHelper"],
      description: "Handles all UI/UX development tasks",
      active: true
    },
    {
      id: 2,
      name: "Backend Team",
      members: ["Morgan", "PlannerGPT"],
      description: "Manages API and database architecture",
      active: true
    }
  ]);

  // Toggle agent activation
  const toggleAgentActive = (id: number) => {
    setAgents(agents.map(agent => 
      agent.id === id ? { ...agent, active: !agent.active } : agent
    ));
    
    toast({
      title: "Agent updated",
      description: `Agent status has been updated`,
    });
  };
  
  // Toggle assistant activation
  const toggleAssistantActive = (id: number) => {
    setAssistants(assistants.map(assistant => 
      assistant.id === id ? { ...assistant, active: !assistant.active } : assistant
    ));
    
    toast({
      title: "Assistant updated",
      description: `Assistant status has been updated`,
    });
  };
  
  // Toggle team activation
  const toggleTeamActive = (id: number) => {
    setTeams(teams.map(team => 
      team.id === id ? { ...team, active: !team.active } : team
    ));
    
    toast({
      title: "Team updated",
      description: `Team status has been updated`,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Agent Settings</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          <Tabs defaultValue="agents">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="agents">Agents</TabsTrigger>
              <TabsTrigger value="assistants">Assistants</TabsTrigger>
              <TabsTrigger value="teams">Teams</TabsTrigger>
            </TabsList>
            
            {/* Agents Tab */}
            <TabsContent value="agents" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">AI Development Agents</h3>
                <Button variant="outline" size="sm">
                  <i className="fas fa-plus mr-2"></i>
                  Add Agent
                </Button>
              </div>
              
              {agents.map(agent => (
                <Card key={agent.id} className={`mb-4 ${!agent.active ? 'opacity-70' : ''}`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center">
                          {agent.name}
                          {agent.active && (
                            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800">
                              Active
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>{agent.role}</CardDescription>
                      </div>
                      <Switch 
                        checked={agent.active}
                        onCheckedChange={() => toggleAgentActive(agent.id)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3">
                      <div className="text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">Capabilities</div>
                      <div className="flex flex-wrap gap-1">
                        {agent.capabilities.map((cap, idx) => (
                          <Badge key={idx} variant="secondary" className="mr-1 mb-1">
                            {cap}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">Efficiency</div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${agent.efficiency}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-right mt-1 text-gray-500 dark:text-gray-400">
                        {agent.efficiency}%
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-end">
                    <Button variant="ghost" size="sm" className="text-gray-500 dark:text-gray-400">
                      <i className="fas fa-cog mr-1.5"></i>
                      Configure
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </TabsContent>
            
            {/* Assistants Tab */}
            <TabsContent value="assistants" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">AI Assistants</h3>
                <Button variant="outline" size="sm">
                  <i className="fas fa-plus mr-2"></i>
                  Add Assistant
                </Button>
              </div>
              
              {assistants.map(assistant => (
                <Card key={assistant.id} className={`mb-4 ${!assistant.active ? 'opacity-70' : ''}`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center">
                          {assistant.name}
                          {assistant.active && (
                            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800">
                              Active
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>{assistant.specialization}</CardDescription>
                      </div>
                      <Switch 
                        checked={assistant.active}
                        onCheckedChange={() => toggleAssistantActive(assistant.id)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3">
                      <div className="text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">Model</div>
                      <Badge variant="secondary">
                        {assistant.model}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-end">
                    <Button variant="ghost" size="sm" className="text-gray-500 dark:text-gray-400">
                      <i className="fas fa-cog mr-1.5"></i>
                      Configure
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </TabsContent>
            
            {/* Teams Tab */}
            <TabsContent value="teams" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Agent Teams</h3>
                <Button variant="outline" size="sm">
                  <i className="fas fa-plus mr-2"></i>
                  Create Team
                </Button>
              </div>
              
              {teams.map(team => (
                <Card key={team.id} className={`mb-4 ${!team.active ? 'opacity-70' : ''}`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center">
                          {team.name}
                          {team.active && (
                            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800">
                              Active
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>{team.description}</CardDescription>
                      </div>
                      <Switch 
                        checked={team.active}
                        onCheckedChange={() => toggleTeamActive(team.id)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3">
                      <div className="text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">Members</div>
                      <div className="flex flex-wrap gap-1">
                        {team.members.map((member, idx) => (
                          <Badge key={idx} variant="secondary" className="mr-1 mb-1">
                            {member}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-end">
                    <Button variant="ghost" size="sm" className="text-gray-500 dark:text-gray-400 mr-2">
                      <i className="fas fa-users mr-1.5"></i>
                      Manage Members
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500 dark:text-gray-400">
                      <i className="fas fa-cog mr-1.5"></i>
                      Configure
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-end">
          <Button variant="outline" className="mr-2" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => {
            toast({
              title: "Settings saved",
              description: "Agent settings have been updated successfully",
            });
            onClose();
          }}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}