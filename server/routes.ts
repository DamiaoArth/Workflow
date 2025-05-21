import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProjectSchema, 
  insertSprintSchema, 
  insertTaskSchema, 
  insertAgentLogSchema,
  insertChatMessageSchema
} from "@shared/schema";
import { WebSocketServer } from "ws";
import { log } from "./vite";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // WebSocket setup for real-time updates
  const wss = new WebSocketServer({ 
    server: httpServer,
    path: "/ws" // Define specific path for WebSocket connections
  });
  
  wss.on('connection', (ws) => {
    log("WebSocket client connected", "ws");
    
    ws.on('message', (message) => {
      // Handle messages from clients
      log('Received message: ' + message.toString(), "ws");
    });
    
    ws.on('error', (error) => {
      log('WebSocket error: ' + error.message, "ws");
    });
    
    ws.on('close', () => {
      log('WebSocket client disconnected', "ws");
    });
    
    // Send initial connection confirmation
    ws.send(JSON.stringify({ type: 'connection', status: 'connected' }));
  });
  
  // Helper function to broadcast updates to all clients
  const broadcastUpdate = (type: string, data: any) => {
    const message = JSON.stringify({ type, data });
    log(`Broadcasting: ${type}`, "ws");
    
    wss.clients.forEach((client) => {
      if (client.readyState === 1) { // WebSocket.OPEN
        client.send(message);
      }
    });
  };

  // Projects API
  app.get("/api/projects", async (req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });
  
  app.get("/api/projects/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const project = await storage.getProject(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  });
  
  app.post("/api/projects", async (req, res) => {
    try {
      const validatedProject = insertProjectSchema.parse(req.body);
      const newProject = await storage.createProject(validatedProject);
      broadcastUpdate('project_created', newProject);
      res.status(201).json(newProject);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data", error });
    }
  });
  
  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      const updatedProject = await storage.updateProject(id, req.body);
      broadcastUpdate('project_updated', updatedProject);
      res.json(updatedProject);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data", error });
    }
  });
  
  app.delete("/api/projects/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteProject(id);
    if (!success) {
      return res.status(404).json({ message: "Project not found" });
    }
    broadcastUpdate('project_deleted', { id });
    res.status(204).end();
  });

  // Sprints API
  app.get("/api/projects/:projectId/sprints", async (req, res) => {
    const projectId = parseInt(req.params.projectId);
    const sprints = await storage.getSprints(projectId);
    res.json(sprints);
  });
  
  app.post("/api/sprints", async (req, res) => {
    try {
      const validatedSprint = insertSprintSchema.parse(req.body);
      const newSprint = await storage.createSprint(validatedSprint);
      broadcastUpdate('sprint_created', newSprint);
      res.status(201).json(newSprint);
    } catch (error) {
      res.status(400).json({ message: "Invalid sprint data", error });
    }
  });
  
  app.patch("/api/sprints/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const sprint = await storage.getSprint(id);
      if (!sprint) {
        return res.status(404).json({ message: "Sprint not found" });
      }
      
      const updatedSprint = await storage.updateSprint(id, req.body);
      broadcastUpdate('sprint_updated', updatedSprint);
      res.json(updatedSprint);
    } catch (error) {
      res.status(400).json({ message: "Invalid sprint data", error });
    }
  });

  // Tasks API
  app.get("/api/projects/:projectId/tasks", async (req, res) => {
    const projectId = parseInt(req.params.projectId);
    const sprintId = req.query.sprintId ? parseInt(req.query.sprintId as string) : undefined;
    const tasks = await storage.getTasks(projectId, sprintId);
    res.json(tasks);
  });
  
  app.get("/api/tasks/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const task = await storage.getTask(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  });
  
  app.post("/api/tasks", async (req, res) => {
    try {
      const validatedTask = insertTaskSchema.parse(req.body);
      const newTask = await storage.createTask(validatedTask);
      
      // Create an agent log for the task creation
      await storage.createAgentLog({
        agentName: "Project Manager",
        action: "Task created",
        details: `Created new task "${newTask.title}"`,
        projectId: newTask.projectId,
        taskId: newTask.id
      });
      
      broadcastUpdate('task_created', newTask);
      res.status(201).json(newTask);
    } catch (error) {
      res.status(400).json({ message: "Invalid task data", error });
    }
  });
  
  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const task = await storage.getTask(id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      const updatedTask = await storage.updateTask(id, req.body);
      
      // If status changed, log it
      if (updatedTask && task.status !== updatedTask.status) {
        await storage.createAgentLog({
          agentName: updatedTask.assignedAgent || "System",
          action: "Status changed",
          details: `Task "${updatedTask.title}" moved from ${task.status} to ${updatedTask.status}`,
          projectId: updatedTask.projectId,
          taskId: updatedTask.id
        });
      }
      
      broadcastUpdate('task_updated', updatedTask);
      res.json(updatedTask);
    } catch (error) {
      res.status(400).json({ message: "Invalid task data", error });
    }
  });

  // Agent Logs API
  app.get("/api/projects/:projectId/agent-logs", async (req, res) => {
    const projectId = parseInt(req.params.projectId);
    const logs = await storage.getAgentLogs(projectId);
    res.json(logs);
  });
  
  app.post("/api/agent-logs", async (req, res) => {
    try {
      const validatedLog = insertAgentLogSchema.parse(req.body);
      const newLog = await storage.createAgentLog(validatedLog);
      broadcastUpdate('agent_log_created', newLog);
      res.status(201).json(newLog);
    } catch (error) {
      res.status(400).json({ message: "Invalid log data", error });
    }
  });

  // Chat API
  app.get("/api/projects/:projectId/chat", async (req, res) => {
    const projectId = parseInt(req.params.projectId);
    const messages = await storage.getChatMessages(projectId);
    res.json(messages);
  });
  
  app.post("/api/chat", async (req, res) => {
    try {
      const validatedMessage = insertChatMessageSchema.parse(req.body);
      const newMessage = await storage.createChatMessage(validatedMessage);
      broadcastUpdate('chat_message_created', newMessage);
      res.status(201).json(newMessage);
    } catch (error) {
      res.status(400).json({ message: "Invalid message data", error });
    }
  });

  return httpServer;
}
