import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TeamOverviewProps {
  projectId: number;
  onClose: () => void;
}

type TeamMember = {
  id: number;
  name: string;
  role: string;
  status: "active" | "idle" | "busy";
  model: string;
  tasks: {
    completed: number;
    total: number;
  };
};

type SprintSummary = {
  id: number;
  name: string;
  progress: number;
  timeRemaining: string;
  tasksCompleted: number;
  totalTasks: number;
};

export default function TeamOverview({ projectId, onClose }: TeamOverviewProps) {
  const [activeTab, setActiveTab] = useState("team");
  
  // This would come from the API in a real implementation
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Alex",
      role: "Frontend Developer",
      status: "active",
      model: "GPT-4o-mini",
      tasks: {
        completed: 12,
        total: 15
      }
    },
    {
      id: 2,
      name: "Morgan",
      role: "Backend Developer",
      status: "busy",
      model: "GPT-4",
      tasks: {
        completed: 8,
        total: 12
      }
    },
    {
      id: 3,
      name: "Project Manager",
      role: "Coordinator",
      status: "idle",
      model: "GPT-4o",
      tasks: {
        completed: 5,
        total: 7
      }
    }
  ];
  
  // Sprint summary data
  const sprintSummary: SprintSummary = {
    id: 1,
    name: "Sprint 1 - Initial Setup",
    progress: 65,
    timeRemaining: "3 days",
    tasksCompleted: 15,
    totalTasks: 23
  };
  
  // Activity feed
  const recentActivities = [
    { id: 1, agent: "Alex", action: "Completed task FE-101", time: "10 min ago" },
    { id: 2, agent: "Morgan", action: "Started working on BE-202", time: "25 min ago" },
    { id: 3, agent: "Project Manager", action: "Created 3 new tasks", time: "1 hour ago" },
    { id: 4, agent: "Alex", action: "Requested clarification on FE-103", time: "2 hours ago" }
  ];
  
  const getStatusColor = (status: "active" | "idle" | "busy") => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "busy":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case "idle":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Project Hub</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="team">Team Status</TabsTrigger>
              <TabsTrigger value="sprint">Sprint Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity Feed</TabsTrigger>
            </TabsList>
            
            {/* Team Status Tab */}
            <TabsContent value="team" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
                  <h3 className="text-lg font-medium mb-2">Team Overview</h3>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{teamMembers.length}</div>
                    <div className="text-gray-500 dark:text-gray-400">Active Agents</div>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <div className="text-lg font-semibold">{teamMembers.filter(m => m.status === "active").length}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Active</div>
                    </div>
                    <div className="text-center p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                      <div className="text-lg font-semibold">{teamMembers.filter(m => m.status === "busy").length}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Busy</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <div className="text-lg font-semibold">{teamMembers.filter(m => m.status === "idle").length}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Idle</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
                  <h3 className="text-lg font-medium mb-2">Task Completion</h3>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {teamMembers.reduce((sum, member) => sum + member.tasks.completed, 0)}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">Tasks Completed</div>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <div>Progress</div>
                      <div>
                        {teamMembers.reduce((sum, member) => sum + member.tasks.completed, 0)}/
                        {teamMembers.reduce((sum, member) => sum + member.tasks.total, 0)} tasks
                      </div>
                    </div>
                    <Progress
                      value={
                        (teamMembers.reduce((sum, member) => sum + member.tasks.completed, 0) / 
                        teamMembers.reduce((sum, member) => sum + member.tasks.total, 0)) * 100
                      }
                      className="h-2"
                    />
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-medium mb-2">Team Members</h3>
              <div className="space-y-3">
                {teamMembers.map(member => (
                  <Card key={member.id}>
                    <CardHeader className="py-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{member.name}</CardTitle>
                          <CardDescription>{member.role}</CardDescription>
                        </div>
                        <Badge className={`${getStatusColor(member.status)}`}>
                          {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="flex justify-between text-sm mb-1">
                        <div className="text-gray-500 dark:text-gray-400">Model: {member.model}</div>
                        <div className="text-gray-500 dark:text-gray-400">
                          {member.tasks.completed}/{member.tasks.total} tasks
                        </div>
                      </div>
                      <Progress 
                        value={(member.tasks.completed / member.tasks.total) * 100} 
                        className="h-1.5" 
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Sprint Overview Tab */}
            <TabsContent value="sprint" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{sprintSummary.name}</CardTitle>
                  <CardDescription>
                    {sprintSummary.timeRemaining} remaining • {sprintSummary.tasksCompleted}/{sprintSummary.totalTasks} tasks completed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <div>Sprint Progress</div>
                        <div>{sprintSummary.progress}%</div>
                      </div>
                      <Progress value={sprintSummary.progress} className="h-2.5" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Tasks by Type</div>
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Feature</span>
                            <span>8</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Bug Fix</span>
                            <span>5</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Documentation</span>
                            <span>3</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Enhancement</span>
                            <span>7</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Tasks by Status</div>
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>To Do</span>
                            <span>8</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>In Progress</span>
                            <span>5</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>In Review</span>
                            <span>3</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Done</span>
                            <span>7</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Team Allocation</h4>
                      <div className="space-y-2">
                        {teamMembers.map(member => (
                          <div key={member.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`w-2 h-2 rounded-full ${
                                member.status === "active" ? "bg-green-500" : 
                                member.status === "busy" ? "bg-amber-500" : "bg-gray-500"
                              } mr-2`}></div>
                              <span>{member.name}</span>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {member.tasks.completed}/{member.tasks.total} tasks
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Activity Feed Tab */}
            <TabsContent value="activity" className="space-y-4">
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-medium mb-4">Recent Activities</h3>
                <div className="space-y-4">
                  {recentActivities.map(activity => (
                    <div key={activity.id} className="flex items-start border-b border-gray-100 dark:border-gray-700 pb-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 flex items-center justify-center mr-3">
                        <i className="fas fa-robot"></i>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium">{activity.agent}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{activity.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <button className="text-sm text-primary dark:text-blue-400 hover:underline">
                    View All Activity
                  </button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}