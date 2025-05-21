import { db } from "./db";
import { eq, and, desc, asc } from "drizzle-orm";
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

export class DatabaseStorage implements IStorage {
  // We'll initialize a default user on first use if needed
  private async ensureDefaultUser() {
    const existingUser = await this.getUserByUsername("demo");
    if (!existingUser) {
      await this.createUser({
        username: "demo",
        password: "password"
      });
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    await this.ensureDefaultUser();
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Project operations
  async getProjects(userId?: number): Promise<Project[]> {
    await this.ensureDefaultUser();
    if (userId) {
      return await db.select().from(projects).where(eq(projects.userId, userId));
    }
    return await db.select().from(projects);
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const now = new Date();
    const projectData = {
      ...insertProject,
      description: insertProject.description || null,
      userId: insertProject.userId || null,
      currentSprintId: null,
      createdAt: now
    };
    
    const [project] = await db.insert(projects).values(projectData).returning();
    return project;
  }

  async updateProject(id: number, projectUpdate: Partial<Project>): Promise<Project | undefined> {
    const [updatedProject] = await db
      .update(projects)
      .set(projectUpdate)
      .where(eq(projects.id, id))
      .returning();
    
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    await db.delete(projects).where(eq(projects.id, id));
    return true; // In PostgreSQL with Drizzle, we'll assume success if no exception is thrown
  }

  // Sprint operations
  async getSprints(projectId: number): Promise<Sprint[]> {
    return await db.select().from(sprints).where(eq(sprints.projectId, projectId));
  }

  async getSprint(id: number): Promise<Sprint | undefined> {
    const [sprint] = await db.select().from(sprints).where(eq(sprints.id, id));
    return sprint;
  }

  async createSprint(insertSprint: InsertSprint): Promise<Sprint> {
    const sprintData = {
      ...insertSprint,
      status: insertSprint.status || null,
      startDate: insertSprint.startDate || null,
      endDate: insertSprint.endDate || null
    };
    
    const [sprint] = await db.insert(sprints).values(sprintData).returning();
    return sprint;
  }

  async updateSprint(id: number, sprintUpdate: Partial<Sprint>): Promise<Sprint | undefined> {
    const [updatedSprint] = await db
      .update(sprints)
      .set(sprintUpdate)
      .where(eq(sprints.id, id))
      .returning();
    
    return updatedSprint;
  }

  async deleteSprint(id: number): Promise<boolean> {
    await db.delete(sprints).where(eq(sprints.id, id));
    return true; // In PostgreSQL with Drizzle, we'll assume success if no exception is thrown
  }

  // Task operations
  async getTasks(projectId: number, sprintId?: number): Promise<Task[]> {
    if (sprintId) {
      return await db.select().from(tasks).where(
        and(
          eq(tasks.projectId, projectId),
          eq(tasks.sprintId, sprintId)
        )
      );
    }
    return await db.select().from(tasks).where(eq(tasks.projectId, projectId));
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const now = new Date();
    const taskData = {
      ...insertTask,
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
    
    const [task] = await db.insert(tasks).values(taskData).returning();
    return task;
  }

  async updateTask(id: number, taskUpdate: Partial<Task>): Promise<Task | undefined> {
    const [updatedTask] = await db
      .update(tasks)
      .set(taskUpdate)
      .where(eq(tasks.id, id))
      .returning();
    
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    await db.delete(tasks).where(eq(tasks.id, id));
    return true; // In PostgreSQL with Drizzle, we'll assume success if no exception is thrown
  }

  // Agent log operations
  async getAgentLogs(projectId: number): Promise<AgentLog[]> {
    return await db.select().from(agentLogs)
      .where(eq(agentLogs.projectId, projectId))
      .orderBy(desc(agentLogs.timestamp));
  }

  async createAgentLog(insertLog: InsertAgentLog): Promise<AgentLog> {
    const now = new Date();
    const logData = {
      ...insertLog,
      details: insertLog.details || null,
      taskId: insertLog.taskId || null,
      timestamp: now
    };
    
    const [log] = await db.insert(agentLogs).values(logData).returning();
    return log;
  }

  // Chat operations
  async getChatMessages(projectId: number): Promise<ChatMessage[]> {
    return await db.select().from(chatMessages)
      .where(eq(chatMessages.projectId, projectId))
      .orderBy(asc(chatMessages.timestamp));
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const now = new Date();
    const messageData = {
      ...insertMessage,
      timestamp: now,
      metadata: insertMessage.metadata || null
    };
    
    const [message] = await db.insert(chatMessages).values(messageData).returning();
    return message;
  }
}

export const storage = new DatabaseStorage();
