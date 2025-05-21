import { apiRequest } from "./queryClient";
import { format, addDays } from "date-fns";

export async function setupInitialData() {
  try {
    // Create demo project
    const project = await apiRequest("POST", "/api/projects", {
      name: "Personal App Project",
      description: "A note-taking app with authentication and PDF export",
      userId: 1
    });
    
    // Create sprint
    const sprint = await apiRequest("POST", "/api/sprints", {
      name: "Sprint 1",
      projectId: project.id,
      startDate: new Date(),
      endDate: addDays(new Date(), 14),
      status: "active"
    });
    
    // Update project with current sprint
    await apiRequest("PATCH", `/api/projects/${project.id}`, {
      currentSprintId: sprint.id
    });
    
    // Create initial tasks
    const tasks = [
      // Backlog
      {
        title: "Implement password reset functionality",
        description: "Add form and backend integration for password reset via email",
        status: "backlog",
        type: "feature",
        reference: "FE-103",
        projectId: project.id,
        sprintId: sprint.id,
        assignedAgent: null,
        dueDate: addDays(new Date(), 5)
      },
      {
        title: "Improve SEO metadata",
        description: "Add dynamic meta tags and improve page descriptions",
        status: "backlog",
        type: "enhancement",
        reference: "FE-105",
        projectId: project.id,
        sprintId: sprint.id,
        assignedAgent: null,
        dueDate: addDays(new Date(), 7)
      },
      
      // To Do
      {
        title: "Create login screen",
        description: "Design and implement the authentication UI with email/password",
        status: "todo",
        type: "feature",
        reference: "FE-101",
        projectId: project.id,
        sprintId: sprint.id,
        assignedAgent: "Scrum Master",
        dueDate: addDays(new Date(), 2)
      },
      {
        title: "Setup user authentication API",
        description: "Implement JWT auth, user model and login/signup endpoints",
        status: "todo",
        type: "backend",
        reference: "BE-102",
        projectId: project.id,
        sprintId: sprint.id,
        assignedAgent: "Scrum Master",
        dueDate: addDays(new Date(), 2)
      },
      {
        title: "Create note editor component",
        description: "Implement rich text editor with formatting controls",
        status: "todo",
        type: "feature",
        reference: "FE-104",
        projectId: project.id,
        sprintId: sprint.id,
        assignedAgent: "Scrum Master",
        dueDate: addDays(new Date(), 4)
      },
      
      // In Progress
      {
        title: "Create notes API endpoints",
        description: "Implement CRUD operations for notes with user association",
        status: "in_progress",
        type: "backend",
        reference: "BE-103",
        projectId: project.id,
        sprintId: sprint.id,
        assignedAgent: "Developer Agent",
        progress: 75,
        dueDate: addDays(new Date(), 3)
      },
      {
        title: "Create notes list view",
        description: "Design and implement the notes dashboard with search and filters",
        status: "in_progress",
        type: "feature",
        reference: "FE-102",
        projectId: project.id,
        sprintId: sprint.id,
        assignedAgent: "Developer Agent",
        progress: 40,
        dueDate: addDays(new Date(), 3)
      },
      
      // In Review
      {
        title: "Fix database connection pool",
        description: "Resolve connection timeouts and optimize pool settings",
        status: "in_review",
        type: "bug",
        reference: "BE-101",
        projectId: project.id,
        sprintId: sprint.id,
        assignedAgent: "Developer Agent",
        dueDate: addDays(new Date(), 1)
      },
      
      // Done
      {
        title: "Initialize project structure",
        description: "Setup React frontend and backend repository with initial dependencies",
        status: "done",
        type: "setup",
        reference: "BE-100",
        projectId: project.id,
        sprintId: sprint.id,
        assignedAgent: null,
        dueDate: addDays(new Date(), -1)
      },
      {
        title: "Create UI component library",
        description: "Setup base components with Tailwind styling",
        status: "done",
        type: "setup",
        reference: "FE-100",
        projectId: project.id,
        sprintId: sprint.id,
        assignedAgent: null,
        dueDate: addDays(new Date(), -1)
      }
    ];
    
    // Create tasks
    for (const task of tasks) {
      await apiRequest("POST", "/api/tasks", task);
    }
    
    // Create agent logs
    const logs = [
      {
        agentName: "Developer Agent",
        action: "Task update",
        details: "Successfully completed API endpoint for note creation with validation",
        projectId: project.id,
        taskId: null
      },
      {
        agentName: "Scrum Master",
        action: "Task assignment",
        details: "Moved task BE-103 to \"In Progress\" and assigned to Developer Agent",
        projectId: project.id,
        taskId: null
      },
      {
        agentName: "Project Manager",
        action: "Task creation",
        details: "Created new task FE-105 \"Improve SEO metadata\" and added to Backlog",
        projectId: project.id,
        taskId: null
      },
      {
        agentName: "Developer Agent",
        action: "Progress update",
        details: "Started implementation of notes list view, currently at 40% completion",
        projectId: project.id,
        taskId: null
      }
    ];
    
    // Create logs
    for (const log of logs) {
      await apiRequest("POST", "/api/agent-logs", log);
    }
    
    // Create initial chat message
    await apiRequest("POST", "/api/chat", {
      projectId: project.id,
      sender: "Project Manager",
      content: "Welcome to the AI Workspace! I'm your Project Manager agent. How can I help you today?"
    });
    
    return project;
  } catch (error) {
    console.error("Error creating initial data:", error);
    throw error;
  }
}
