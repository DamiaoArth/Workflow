import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model (keeping the existing one)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Project model
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  userId: integer("user_id").references(() => users.id),
  currentSprintId: integer("current_sprint_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  name: true,
  description: true,
  userId: true,
});

// Sprint model
export const sprints = pgTable("sprints", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  status: text("status").default("planned"), // planned, active, completed
});

export const insertSprintSchema = createInsertSchema(sprints).pick({
  name: true,
  projectId: true,
  startDate: true,
  endDate: true,
  status: true,
});

// Task model
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").default("backlog"), // backlog, todo, in_progress, in_review, done
  type: text("type").default("feature"), // feature, bug, enhancement, backend, setup
  reference: text("reference"), // Task reference like FE-101, BE-102
  projectId: integer("project_id").references(() => projects.id).notNull(),
  sprintId: integer("sprint_id").references(() => sprints.id),
  assignedAgent: text("assigned_agent"),
  progress: integer("progress").default(0),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  title: true,
  description: true,
  status: true,
  type: true,
  reference: true,
  projectId: true,
  sprintId: true,
  assignedAgent: true,
  dueDate: true,
});

// Agent actions log
export const agentLogs = pgTable("agent_logs", {
  id: serial("id").primaryKey(),
  agentName: text("agent_name").notNull(),
  action: text("action").notNull(),
  details: text("details"),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  taskId: integer("task_id").references(() => tasks.id),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertAgentLogSchema = createInsertSchema(agentLogs).pick({
  agentName: true,
  action: true,
  details: true,
  projectId: true,
  taskId: true,
});

// Chat message model
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  sender: text("sender").notNull(), // user or agent name
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  metadata: jsonb("metadata"), // For additional data like code snippets, actions, etc.
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  projectId: true,
  sender: true,
  content: true,
  metadata: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Sprint = typeof sprints.$inferSelect;
export type InsertSprint = z.infer<typeof insertSprintSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type AgentLog = typeof agentLogs.$inferSelect;
export type InsertAgentLog = z.infer<typeof insertAgentLogSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
