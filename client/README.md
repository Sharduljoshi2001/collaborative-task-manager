🎨 Collaborative Task Manager - Frontend
Welcome to the Frontend of my Collaborative Task Manager application! This is built using React (Vite), TypeScript, and Tailwind CSS. It serves as the user interface where users can manage tasks, collaborate in real-time, and track their progress.

⚙️ Tech Stack
I chose these technologies to ensure the app is fast, type-safe, and easy to maintain:

Framework: React (via Vite) - For fast development and performance.

Language: TypeScript - To catch errors early and have better code suggestions.

Styling: Tailwind CSS - For rapid, responsive UI design.

State Management:

React Query (TanStack Query): For handling server data (caching, loading states).

Context API: For global app state like User Authentication (AuthContext) and Socket connection (SocketContext).

Real-Time: Socket.io Client - To receive instant updates from the server.

Notifications: React Hot Toast - For beautiful popup notifications.

Icons: Lucide React.

🚀 Setup Instructions (How to run locally)
Follow these steps to get the frontend running on your machine:

Navigate to the client folder:

Bash

cd client
Install Dependencies:

Bash

npm install
Environment Setup: I have included a .env file example. You need to create a file named .env in the client folder and add your backend URL.

Code snippet

VITE_API_URL=http://localhost:3000/api
Run the Project:

Bash

npm run dev
The app should now be running at http://localhost:5173.

🏗️ Architecture & Design Decisions
When building this application, I tried to follow industry standards. Here is why I made certain decisions:

1. Service Pattern in Frontend
Instead of writing fetch or axios calls directly inside my React components (like Dashboard.tsx), I created a dedicated services/ folder (e.g., taskService.ts, authService.ts).

Why? This keeps my UI code clean. The component only cares about displaying data, while the service layer handles fetching data.

AI Help: I used AI to understand how to properly structure this pattern. As a fresher, I used to write API calls inside useEffect, but AI explained that separating concerns is a better standard for scalability.

2. React Query over useEffect
For fetching data, I used React Query.

Why? It automatically handles loading states (isLoading), error states (isError), and caching. It avoids the "useEffect hell" where we have to manually manage state variables for data loading.

Collaboration: It makes real-time updates easier. When a socket event comes in, I just tell React Query to "invalidate" the data, and it automatically refetches the fresh list.

3. Context API for Auth & Sockets
I used React's Context API to wrap my application with AuthProvider and SocketProvider.

Why? This ensures that the logged-in user's data and the active socket connection are available globally to any component without passing props down manually (Prop Drilling).

⚡ Real-Time Collaboration (Socket.io)
This was the most challenging and exciting part of the project. Here is how I implemented it:

Connection: When a user logs in, the SocketContext establishes a connection to the backend.

Listening: In the Dashboard component, I set up listeners for specific events:

task created

task updated

task deleted

Reacting: When an event is received, I do two things:

I force React Query to refresh the task list immediately.

I show a Toast Notification if the task is assigned to the current user.

AI Help: I took help from AI to understand how to handle socket connections inside useEffect to avoid memory leaks (cleaning up listeners when the component unmounts).

📂 Project Structure
Bash

client/
├── src/
│   ├── components/      # Reusable UI components (Modals, ProtectedRoute)
│   ├── context/         # Global state (Auth, Socket)
│   ├── pages/           # Main pages (Login, Register, Dashboard)
│   ├── services/        # API calls logic (Service Pattern)
│   ├── types/           # TypeScript interfaces
│   ├── App.tsx          # Main entry point with Routes
│   └── main.tsx         # Providers setup (QueryClient, AuthProvider)
⚖️ Trade-offs & Assumptions
Sorting: I have implemented sorting logic in the backend (by date), but currently, the Frontend defaults to this order. I assumed explicit sorting buttons were less critical than filtering for the MVP.

Mobile Responsiveness: I used Tailwind CSS to make the app responsive. I focused primarily on the Dashboard view to ensure cards stack correctly on mobile screens.

👨‍💻 Author
Built by Shardul Joshi. I focused on writing clean, maintainable code and learning new patterns like React Query and Socket integration during this assignment.