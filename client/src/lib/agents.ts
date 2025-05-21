import { InsertTask, Task } from "@shared/schema";

export interface Agent {
  name: string;
  role: string;
  capabilities: string[];
}

export const agents: Agent[] = [
  {
    name: "Project Manager",
    role: "Breaks down user objectives into manageable features",
    capabilities: [
      "Analyze user requirements",
      "Create task breakdown",
      "Prioritize features",
      "Manage project scope"
    ]
  },
  {
    name: "Scrum Master",
    role: "Organizes features into sprints and manages Kanban",
    capabilities: [
      "Create and manage sprints",
      "Assign tasks to agents",
      "Track sprint progress",
      "Remove blockers"
    ]
  },
  {
    name: "Developer Agent",
    role: "Executes tasks and implements features",
    capabilities: [
      "Write code implementations",
      "Create UI components",
      "Implement business logic",
      "Test and debug features"
    ]
  }
];

// Simulates AI processing of user input
export async function processUserMessage(message: string, projectId: number): Promise<any> {
  // This function would normally connect to an actual AI service like OpenAI
  // For this demo, we'll simulate AI responses with pre-defined patterns
  
  // Detect intent from message
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes("create") || lowerMessage.includes("build") || lowerMessage.includes("develop")) {
    // Project creation intent
    return createProjectResponse(message, projectId);
  } else if (lowerMessage.includes("sprint") || lowerMessage.includes("organize") || lowerMessage.includes("plan")) {
    // Sprint planning intent
    return planSprintResponse(message, projectId);
  } else if (lowerMessage.includes("start") || lowerMessage.includes("work") || lowerMessage.includes("implement")) {
    // Task implementation intent
    return implementTaskResponse(message, projectId);
  } else {
    // General help response
    return generalResponse(projectId);
  }
}

// Simulated AI response for project creation
async function createProjectResponse(message: string, projectId: number) {
  const features = extractPotentialFeatures(message);
  
  // Project Manager response
  const pmResponse = {
    sender: "Project Manager",
    content: `Great! I'll help you break this down into manageable features for your project. Here's what we need to build:\n\n${features.map((f, i) => `${i+1}. ${f}`).join('\n')}\n\nWould you like me to organize these into sprints and create tasks in the Kanban board?`,
    projectId,
    metadata: null
  };
  
  return [pmResponse];
}

// Simulated AI response for sprint planning
async function planSprintResponse(message: string, projectId: number) {
  // Scrum Master response
  const smResponse = {
    sender: "Scrum Master",
    content: `I'll organize these features into sprints based on priority and dependencies:\n\nSprint 1 (1 week): Authentication and Basic Features\n• Setup project structure\n• Create login/signup screens\n• Implement authentication API\n• Create basic feature interface\n• Implement storage backend\n\nSprint 2 (1 week): Advanced Features\n• Enhance feature with advanced capabilities\n• Create dashboard with search/filter\n• Implement export functionality\n• Add user profile and settings\n• Final testing and polish\n\nI've created these tasks in the Kanban board. Would you like our developer agents to start working on Sprint 1 tasks now?`,
    projectId,
    metadata: null
  };
  
  return [smResponse];
}

// Simulated AI response for task implementation
async function implementTaskResponse(message: string, projectId: number) {
  // Developer Agent response
  const devResponse = {
    sender: "Developer Agent",
    content: `I'll get started with the implementation right away. I'm setting up the project with:`,
    projectId,
    metadata: {
      codeSnippet: `$ npx create-react-app my-app\n$ cd my-app\n$ npm install tailwindcss react-router-dom axios\n$ npx tailwindcss init`
    }
  };
  
  const taskUpdate = {
    sender: "Developer Agent",
    content: `I'll set up the project structure with folders for components, pages, services, and utilities. The authentication setup will be my next task.`,
    projectId,
    metadata: {
      taskUpdate: `Task "Setup project structure" moved to In Progress`
    }
  };
  
  return [devResponse, taskUpdate];
}

// General help response
async function generalResponse(projectId: number) {
  return [{
    sender: "Project Manager",
    content: `I can help you with your project. Here are some things I can do:\n\n• Break down a project idea into manageable features\n• Create and organize tasks in sprints\n• Help implement features through our developer agents\n\nJust let me know what you'd like to work on!`,
    projectId,
    metadata: null
  }];
}

// Helper function to extract potential features from user message
function extractPotentialFeatures(message: string): string[] {
  // This would normally use NLP to extract features
  // For demo, we'll use simple pattern matching
  
  const features = [];
  
  if (message.includes("login") || message.includes("auth") || message.includes("user")) {
    features.push("Authentication system (login/signup)");
  }
  
  if (message.includes("note") || message.includes("content") || message.includes("text")) {
    features.push("Note creation and editing interface");
    features.push("Notes dashboard with organization features");
  }
  
  if (message.includes("export") || message.includes("pdf") || message.includes("print")) {
    features.push("PDF export functionality");
  }
  
  if (message.includes("search") || message.includes("filter")) {
    features.push("Search and filtering capabilities");
  }
  
  if (message.includes("settings") || message.includes("profile")) {
    features.push("User profile and settings");
  }
  
  // Ensure we have at least some features
  if (features.length === 0) {
    features.push("Basic user interface");
    features.push("Data storage and retrieval");
    features.push("Core application functionality");
  }
  
  return features;
}
