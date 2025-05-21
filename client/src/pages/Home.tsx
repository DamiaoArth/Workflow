import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import KanbanBoard from "@/components/KanbanBoard";
import Dashboard from "@/components/Dashboard";
import ChatInterface from "@/components/ChatInterface";
import AgentSettings from "@/components/AgentSettings";
import { useModeState } from "@/hooks/useModeState";
import { useProjects } from "@/hooks/useProjects";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { setupInitialData } from "@/lib/mockdata";
import { ThemeProvider } from "@/components/ui/ThemeProvider";

export default function Home() {
  const { mode, setMode, workTab, setWorkTab, agentSettingsOpen, setAgentSettingsOpen } = useModeState();
  const [teamOverviewOpen, setTeamOverviewOpen] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);
  const { currentProject, projects } = useProjects(currentProjectId);
  const [initialized, setInitialized] = useState(false);

  // Initialize demo data when the app loads
  useEffect(() => {
    const initApp = async () => {
      if (initialized) return;
      
      try {
        // Check if we have any projects
        const projectsResponse = await fetch('/api/projects');
        const projectsData = await projectsResponse.json();
        
        if (projectsData.length === 0) {
          // Initialize demo data
          const demoProject = await setupInitialData();
          setCurrentProjectId(demoProject.id);
        } else {
          // Set first project as current
          setCurrentProjectId(projectsData[0].id);
        }
        
        setInitialized(true);
      } catch (error) {
        console.error("Error initializing app:", error);
      }
    };
    
    initApp();
  }, [initialized]);
  
  // Listen for the agent settings event from the ChatInterface
  useEffect(() => {
    const handleAgentSettings = (event: any) => {
      // Make sure the projectId matches our current project
      if (event.detail?.projectId === currentProjectId) {
        setAgentSettingsOpen(true);
      }
    };
    
    window.addEventListener('openAgentSettings', handleAgentSettings);
    
    // Cleanup
    return () => {
      window.removeEventListener('openAgentSettings', handleAgentSettings);
    };
  }, [currentProjectId, setAgentSettingsOpen]);

  // Handle project selection
  const handleProjectSelect = (projectId: number) => {
    setCurrentProjectId(projectId);
  };

  // Handle mode change
  const handleModeChange = (newMode: "plan" | "work") => {
    setMode(newMode);
  };

  // Add new task
  const handleAddTask = async () => {
    if (!currentProjectId) return;
    
    try {
      // Get reference count
      const tasks = await queryClient.fetchQuery({ 
        queryKey: [`/api/projects/${currentProjectId}/tasks`] 
      });
      
      const frontendTaskCount = tasks.filter((t: any) => t.reference.startsWith('FE-')).length;
      const newReference = `FE-${100 + frontendTaskCount + 1}`;
      
      // Create new task
      await apiRequest('POST', '/api/tasks', {
        title: "New Task",
        description: "Please edit this task description",
        status: "backlog",
        type: "feature",
        reference: newReference,
        projectId: currentProjectId,
        sprintId: currentProject?.currentSprintId || null
      });
      
      // Refresh tasks
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${currentProjectId}/tasks`] });
      
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header mode={mode} onModeChange={handleModeChange} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          currentProject={currentProjectId || undefined} 
          onProjectSelect={handleProjectSelect}
        />
        
        <main className="flex-1 overflow-auto bg-background">
          {/* Plan mode */}
          {mode === "plan" && currentProjectId && (
            <div id="plan-mode" className="h-full">
              <div className="px-4 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{currentProject?.name || "Project"}</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {currentProject?.description || "Project description"}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <div className="flex rounded-md shadow-sm">
                    <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 text-sm font-medium rounded-l-md hover:bg-gray-50 dark:hover:bg-gray-700">
                      <i className="fas fa-calendar mr-2"></i>Sprints
                    </button>
                    <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 text-sm font-medium border-l-0 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <i className="fas fa-chart-line mr-2"></i>Analytics
                    </button>
                    <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 text-sm font-medium rounded-r-md border-l-0 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <i className="fas fa-list-check mr-2"></i>Tasks
                    </button>
                  </div>
                  <button 
                    className="bg-primary hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-1.5 text-sm font-medium rounded-md flex items-center"
                    onClick={handleAddTask}
                  >
                    <i className="fas fa-plus mr-2"></i>New Task
                  </button>
                </div>
              </div>
              
              <KanbanBoard 
                projectId={currentProjectId} 
                sprintId={currentProject?.currentSprintId || undefined} 
              />
              
              <Dashboard projectId={currentProjectId} />
            </div>
          )}
          
          {/* Work mode */}
          {mode === "work" && currentProjectId && (
            <div id="work-mode" className="h-full">
              <div className="flex flex-col h-full">
                <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {currentProject?.name || "Project"} - Work Mode
                      </h1>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Collaborate with AI agents to complete your tasks
                      </p>
                    </div>
                    <button 
                      className="bg-indigo-50 dark:bg-indigo-900 hover:bg-indigo-100 dark:hover:bg-indigo-800 text-indigo-600 dark:text-indigo-300 px-3 py-1.5 rounded-md text-sm font-medium"
                      onClick={() => setTeamOverviewOpen(true)}
                    >
                      <i className="fas fa-users-cog mr-2"></i>
                      Team Overview
                    </button>
                  </div>
                  
                  {/* Tabs for Work Mode */}
                  <div className="mt-4">
                    <Tabs 
                      defaultValue={workTab} 
                      onValueChange={(value) => setWorkTab(value as "chat" | "coding")}
                      className="w-full"
                    >
                      <TabsList className="grid w-[400px] grid-cols-2">
                        <TabsTrigger value="chat" className="text-sm">
                          <i className="fas fa-comment-dots mr-2"></i>Chat
                        </TabsTrigger>
                        <TabsTrigger value="coding" className="text-sm">
                          <i className="fas fa-code mr-2"></i>Code Editor
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
                
                {/* Tab content */}
                <div className="flex-1 h-[calc(100%-7rem)] overflow-hidden">
                  {workTab === "chat" && <ChatInterface projectId={currentProjectId} />}
                  {workTab === "coding" && <CodeEditor projectId={currentProjectId} />}
                </div>
              </div>
            </div>
          )}
          
          {/* Team Overview Modal */}
          {teamOverviewOpen && currentProjectId && (
            <TeamOverview 
              projectId={currentProjectId} 
              onClose={() => setTeamOverviewOpen(false)} 
            />
          )}
          
          {/* Agent Settings Modal */}
          {agentSettingsOpen && currentProjectId && (
            <AgentSettings 
              projectId={currentProjectId} 
              onClose={() => setAgentSettingsOpen(false)} 
            />
          )}
          
          {/* No project selected */}
          {!currentProjectId && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-center p-8 bg-white rounded-lg shadow-sm max-w-md">
                <i className="fas fa-project-diagram text-4xl text-gray-300 mb-4"></i>
                <h2 className="text-xl font-semibold mb-2">No Project Selected</h2>
                <p className="text-gray-600 mb-4">
                  Select an existing project from the sidebar or create a new one to get started.
                </p>
                <button 
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  onClick={() => {
                    // Create a new project
                    // This would normally open a modal form
                    alert("This would open a new project form");
                  }}
                >
                  <i className="fas fa-plus mr-2"></i>
                  Create New Project
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
