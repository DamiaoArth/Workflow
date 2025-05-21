# AI Project Management Workspace

This is a modern web application focused on project management with AI-assisted features. The system helps users manage projects, sprints, and tasks with integrated AI agent support for improved productivity.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Overview

This application is a full-stack web application built with:

1. **Frontend**: React (with TypeScript) + Tailwind CSS + ShadCN UI components
2. **Backend**: Express.js (Node.js) 
3. **Database**: PostgreSQL (through Drizzle ORM)
4. **State Management**: TanStack React Query
5. **Routing**: Wouter (lightweight React router)

The application follows a client-server architecture where:
- The client is a single-page application (SPA) built with React
- The server handles API requests and database operations
- The database stores all application data including projects, sprints, tasks, and agent logs

### Key Components

#### Frontend

1. **UI Framework**: The application uses ShadCN UI components (based on Radix UI) with Tailwind CSS for styling. The theme is customizable with light/dark mode support.

2. **State Management**: TanStack React Query is used for data fetching, caching, and state management, providing a clean way to handle server state.

3. **Custom Hooks**: The application uses several custom hooks for managing different state concerns:
   - `useProjects`: Manages project data and selection
   - `useTasks`: Handles task operations and organization
   - `useAgents`: Manages AI agent interactions and logs
   - `useModeState`: Toggles between planning and working modes

4. **Components Structure**:
   - Reusable UI components in `/client/src/components/ui`
   - Application-specific components in `/client/src/components`
   - Pages in `/client/src/pages`

#### Backend

1. **Express Server**: Handles HTTP requests and serves the API

2. **API Routes**: RESTful API endpoints for:
   - Projects management
   - Sprints management
   - Tasks management
   - Agent logs
   - Chat messages

3. **WebSocket Support**: Real-time updates for task changes and agent activities

#### Database

1. **Schema**: Defined in `/shared/schema.ts` using Drizzle ORM with support for:
   - Users (authentication)
   - Projects
   - Sprints
   - Tasks
   - Agent logs
   - Chat messages

2. **ORM**: Drizzle ORM for type-safe database operations with PostgreSQL

### Data Flow

1. **UI Interaction Flow**:
   - User interacts with the React UI
   - React Query hooks make API calls to the backend
   - Backend processes requests and returns responses
   - UI updates with new data

2. **Real-time Updates**:
   - WebSocket connection established when app loads
   - Server broadcasts events when data changes
   - Client receives events and updates UI accordingly

3. **AI Agent Workflow**:
   - User sends messages/requests through chat interface
   - Backend processes requests and simulates AI agent responses
   - Agent actions are logged and displayed in the UI
   - Tasks may be created or updated based on agent activities

### External Dependencies

1. **UI Components**:
   - Radix UI primitives for accessible components
   - Lucide icons for UI elements
   - TailwindCSS for styling
   - ShadCN UI component patterns

2. **Data Management**:
   - TanStack React Query for data fetching and caching
   - date-fns for date handling
   - zod for schema validation

3. **Database**:
   - Drizzle ORM for database operations
   - Neon serverless PostgreSQL client

### Deployment Strategy

The application is configured for deployment on Replit with:

1. **Build Process**:
   - Frontend: Vite builds static assets
   - Backend: esbuild bundles the server code

2. **Production Settings**:
   - Environment variables distinguish between development and production
   - Static assets are served by the Express server
   - Server renders the initial HTML and serves the bundled JavaScript

3. **Database**:
   - Connects to a PostgreSQL database (Replit DB or external)
   - Uses environment variables for database connection

## Development Workflow

1. **Local Development**:
   - Run `npm run dev` to start the development server
   - Frontend runs with HMR (Hot Module Replacement)
   - Backend auto-restarts on changes

2. **Database Management**:
   - Use `npm run db:push` to update the database schema
   - Database migrations are managed through Drizzle Kit

3. **Production Build**:
   - Run `npm run build` to build for production
   - Run `npm start` to start the production server

## Application Features

1. **Project Management**:
   - Create and manage projects
   - Organize work into sprints
   - Track tasks in a Kanban board

2. **Task Management**:
   - Create, update, and track tasks
   - Drag-and-drop interface for status updates
   - Categories and labels for organization

3. **AI Assistance**:
   - AI agents that help with project planning
   - Task creation and organization suggestions
   - Chat interface for interacting with AI

4. **Dashboard**:
   - Project overview and progress tracking
   - Sprint status visualization
   - Agent activity logs

## Key Files

- `server/index.ts`: Main server entry point
- `server/routes.ts`: API route definitions
- `server/storage.ts`: Database interaction layer
- `client/src/App.tsx`: Main React component
- `client/src/main.tsx`: React application entry point
- `shared/schema.ts`: Database schema definitions

## Future Enhancements

1. Add robust authentication system
2. Implement real AI integration (OpenAI, etc.)
3. Add project templates and presets
4. Enhance reporting and analytics features
5. Improve collaboration features with multi-user support