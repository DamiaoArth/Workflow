import {
  users, type User, type InsertUser,
  projects, type Project, type InsertProject,
  sprints, type Sprint, type InsertSprint,
  tasks, type Task, type InsertTask,
  agentLogs, type AgentLog, type InsertAgentLog,
  chatMessages, type ChatMessage, type InsertChatMessage
} from "@shared/schema";

// Storage interface with CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Project operations
  getProjects(userId?: number): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<Project>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // Sprint operations
  getSprints(projectId: number): Promise<Sprint[]>;
  getSprint(id: number): Promise<Sprint | undefined>;
  createSprint(sprint: InsertSprint): Promise<Sprint>;
  updateSprint(id: number, sprint: Partial<Sprint>): Promise<Sprint | undefined>;
  deleteSprint(id: number): Promise<boolean>;

  // Task operations
  getTasks(projectId: number, sprintId?: number): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;

  // Agent log operations
  getAgentLogs(projectId: number): Promise<AgentLog[]>;
  createAgentLog(log: InsertAgentLog): Promise<AgentLog>;

  // Chat operations
  getChatMessages(projectId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private sprints: Map<number, Sprint>;
  private tasks: Map<number, Task>;
  private agentLogs: Map<number, AgentLog>;
  private chatMessages: Map<number, ChatMessage>;
  
  private userIdCounter: number;
  private projectIdCounter: number;
  private sprintIdCounter: number;
  private taskIdCounter: number;
  private agentLogIdCounter: number;
  private chatMessageIdCounter: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.sprints = new Map();
    this.tasks = new Map();
    this.agentLogs = new Map();
    this.chatMessages = new Map();
    
    this.userIdCounter = 1;
    this.projectIdCounter = 1;
    this.sprintIdCounter = 1;
    this.taskIdCounter = 1;
    this.agentLogIdCounter = 1;
    this.chatMessageIdCounter = 1;
    
    // Initialize with a default user
    this.createUser({
      username: "demo",
      password: "password"
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Project operations
  async getProjects(userId?: number): Promise<Project[]> {
    const projects = Array.from(this.projects.values());
    if (userId) {
      return projects.filter(project => project.userId === userId);
    }
    return projects;
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectIdCounter++;
    const now = new Date();
    const project: Project = { 
      ...insertProject, 
      id, 
      description: insertProject.description || null,
      userId: insertProject.userId || null,
      currentSprintId: null,
      createdAt: now
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, projectUpdate: Partial<Project>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject = { ...project, ...projectUpdate };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Sprint operations
  async getSprints(projectId: number): Promise<Sprint[]> {
    return Array.from(this.sprints.values()).filter(
      sprint => sprint.projectId === projectId
    );
  }

  async getSprint(id: number): Promise<Sprint | undefined> {
    return this.sprints.get(id);
  }

  async createSprint(insertSprint: InsertSprint): Promise<Sprint> {
    const id = this.sprintIdCounter++;
    const sprint: Sprint = { 
      ...insertSprint, 
      id,
      status: insertSprint.status || null,
      startDate: insertSprint.startDate || null,
      endDate: insertSprint.endDate || null
    };
    this.sprints.set(id, sprint);
    return sprint;
  }

  async updateSprint(id: number, sprintUpdate: Partial<Sprint>): Promise<Sprint | undefined> {
    const sprint = this.sprints.get(id);
    if (!sprint) return undefined;
    
    const updatedSprint = { ...sprint, ...sprintUpdate };
    this.sprints.set(id, updatedSprint);
    return updatedSprint;
  }

  async deleteSprint(id: number): Promise<boolean> {
    return this.sprints.delete(id);
  }

  // Task operations
  async getTasks(projectId: number, sprintId?: number): Promise<Task[]> {
    const projectTasks = Array.from(this.tasks.values()).filter(
      task => task.projectId === projectId
    );
    
    if (sprintId) {
      return projectTasks.filter(task => task.sprintId === sprintId);
    }
    
    return projectTasks;
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.taskIdCounter++;
    const now = new Date();
    const task: Task = { 
      ...insertTask, 
      id, 
      description: insertTask.description || null,
      type: insertTask.type || null,
      status: insertTask.status || null,
      reference: insertTask.reference || null,
      sprintId: insertTask.sprintId || null,
      assignedAgent: insertTask.assignedAgent || null,
      progress: 0,
      dueDate: insertTask.dueDate || null,
      createdAt: now
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, taskUpdate: Partial<Task>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...taskUpdate };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  // Agent log operations
  async getAgentLogs(projectId: number): Promise<AgentLog[]> {
    return Array.from(this.agentLogs.values())
      .filter(log => log.projectId === projectId)
      .sort((a, b) => {
        if (!a.timestamp || !b.timestamp) return 0;
        return b.timestamp.getTime() - a.timestamp.getTime();
      });
  }

  async createAgentLog(insertLog: InsertAgentLog): Promise<AgentLog> {
    const id = this.agentLogIdCounter++;
    const now = new Date();
    const log: AgentLog = { 
      ...insertLog, 
      id, 
      details: insertLog.details || null,
      taskId: insertLog.taskId || null,
      timestamp: now
    };
    this.agentLogs.set(id, log);
    return log;
  }

  // Chat operations
  async getChatMessages(projectId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(message => message.projectId === projectId)
      .sort((a, b) => {
        if (!a.timestamp || !b.timestamp) return 0;
        return a.timestamp.getTime() - b.timestamp.getTime();
      });
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.chatMessageIdCounter++;
    const now = new Date();
    const message: ChatMessage = { 
      ...insertMessage, 
      id, 
      timestamp: now
    };
    this.chatMessages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
