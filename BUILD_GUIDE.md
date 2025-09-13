# Collaborative Outing Planner - Complete Build Guide

This guide will walk you through building the entire collaborative outing planner project from scratch, step by step.

## Project Overview
A full-stack React application with Node.js backend that helps groups plan outings using AI-powered suggestions and real-time voting.

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Basic knowledge of React, TypeScript, and Node.js

## Phase 1: Project Setup & Configuration

### Step 1: Initialize the main project
```bash
mkdir collaborative-outing-planner
cd collaborative-outing-planner
npm init -y
```

### Step 2: Create package.json (Main Project)
Create the main package.json with all dependencies and scripts.

### Step 3: Create TypeScript configuration files
Create these files in order:
1. `tsconfig.json` - Main TypeScript config
2. `tsconfig.app.json` - App-specific TypeScript config  
3. `tsconfig.node.json` - Node-specific TypeScript config

### Step 4: Create build configuration files
1. `vite.config.ts` - Vite configuration
2. `tailwind.config.js` - Tailwind CSS configuration
3. `postcss.config.js` - PostCSS configuration
4. `eslint.config.js` - ESLint configuration

### Step 5: Create index.html
The main HTML entry point for the React app.

## Phase 2: Core Infrastructure

### Step 6: Create src/index.css
Basic CSS imports for Tailwind.

### Step 7: Create utility functions
1. `src/utils/cn.ts` - Class name utility function

### Step 8: Create TypeScript type definitions
1. `src/types/index.ts` - All TypeScript interfaces and types
2. `src/vite-env.d.ts` - Vite environment types

## Phase 3: Redux Store Setup

### Step 9: Create Redux store structure
Create these files in order:
1. `src/store/index.ts` - Main store configuration
2. `src/store/slices/userSlice.ts` - User state management
3. `src/store/slices/roomSlice.ts` - Room state management  
4. `src/store/slices/placesSlice.ts` - Places state management
5. `src/store/slices/uiSlice.ts` - UI state management

## Phase 4: Services Layer

### Step 10: Create API services
1. `src/services/api.ts` - HTTP API client and endpoints
2. `src/services/socket.ts` - WebSocket service for real-time features

## Phase 5: Common Components

### Step 11: Create reusable UI components
Create these components in order (each depends on previous ones):
1. `src/components/common/Button.tsx` - Reusable button component
2. `src/components/common/Card.tsx` - Card container component
3. `src/components/common/Input.tsx` - Form input component
4. `src/components/common/LoadingSpinner.tsx` - Loading indicator
5. `src/components/common/NotificationToast.tsx` - Toast notifications

## Phase 6: Feature-Specific Components

### Step 12: Create preferences components
1. `src/components/preferences/PreferencesForm.tsx` - User preferences form

### Step 13: Create room components
1. `src/components/room/RoomMembersList.tsx` - Display room members
2. `src/components/room/PlaceCard.tsx` - Individual place card with voting

## Phase 7: Pages/Views

### Step 14: Create main pages
1. `src/pages/Home.tsx` - Landing page with user setup and room creation/joining
2. `src/pages/Room.tsx` - Main room interface with voting and suggestions

### Step 15: Create main App component
1. `src/main.tsx` - React app entry point
2. `src/App.tsx` - Main app component with routing

## Phase 8: Backend Server

### Step 16: Initialize server project
```bash
mkdir server
cd server
npm init -y
```

### Step 17: Create server files
1. `server/package.json` - Server dependencies
2. `server/index.js` - Main server file with Express, Socket.io, and API endpoints

## Phase 9: Installation & Setup

### Step 18: Install dependencies
```bash
# In main project directory
npm install

# In server directory
cd server
npm install
```

## Phase 10: Testing & Running

### Step 19: Start the application
```bash
# Terminal 1 - Start backend server
cd server
npm start

# Terminal 2 - Start frontend development server
npm run dev
```

## File Creation Order Summary

**Configuration Files (Create First):**
1. package.json
2. tsconfig.json
3. tsconfig.app.json  
4. tsconfig.node.json
5. vite.config.ts
6. tailwind.config.js
7. postcss.config.js
8. eslint.config.js
9. index.html

**Core Infrastructure:**
10. src/index.css
11. src/utils/cn.ts
12. src/types/index.ts
13. src/vite-env.d.ts

**State Management:**
14. src/store/index.ts
15. src/store/slices/userSlice.ts
16. src/store/slices/roomSlice.ts
17. src/store/slices/placesSlice.ts
18. src/store/slices/uiSlice.ts

**Services:**
19. src/services/api.ts
20. src/services/socket.ts

**Common Components:**
21. src/components/common/Button.tsx
22. src/components/common/Card.tsx
23. src/components/common/Input.tsx
24. src/components/common/LoadingSpinner.tsx
25. src/components/common/NotificationToast.tsx

**Feature Components:**
26. src/components/preferences/PreferencesForm.tsx
27. src/components/room/RoomMembersList.tsx
28. src/components/room/PlaceCard.tsx

**Pages:**
29. src/pages/Home.tsx
30. src/pages/Room.tsx

**Main App:**
31. src/main.tsx
32. src/App.tsx

**Backend:**
33. server/package.json
34. server/index.js

## Key Dependencies to Install

**Frontend:**
- React & React DOM
- TypeScript
- Vite
- Tailwind CSS
- Redux Toolkit & React Redux
- React Router DOM
- Axios
- Socket.io Client
- Lucide React (icons)
- UUID

**Backend:**
- Express
- Socket.io
- CORS
- UUID
- Axios
- OpenAI (optional)

## Important Notes

1. **Order Matters**: Follow the exact order above as many files depend on previous ones
2. **Dependencies**: Install all dependencies before creating components that use them
3. **TypeScript**: Set up TypeScript configuration before creating .ts/.tsx files
4. **Tailwind**: Configure Tailwind before creating components that use its classes
5. **Redux**: Set up the store before creating components that use Redux hooks
6. **API Services**: Create API services before pages that make HTTP requests
7. **Common Components**: Create reusable components before feature-specific ones

## Testing the Build

After completing all steps:
1. Backend should run on http://localhost:3001
2. Frontend should run on http://localhost:5173
3. You should be able to create rooms, join rooms, and vote on places
4. Real-time updates should work between multiple browser tabs

## Troubleshooting

- If you get import errors, check that all dependencies are installed
- If TypeScript errors occur, ensure all type definitions are created first
- If components don't render, verify that common components are created before feature components
- If API calls fail, ensure the backend server is running first

This guide ensures you build the project in the correct dependency order without missing any files!