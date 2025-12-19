⚙️ Collaborative Task Manager - Backend API
Welcome to the Backend of my Collaborative Task Manager! This is a robust REST API built using Node.js, Express, and PostgreSQL. It handles data management, authentication, and real-time communication for the frontend application.

🛠️ Tech Stack
I chose this stack to build a reliable and scalable backend:

Runtime: Node.js & Express - For handling API requests.

Language: TypeScript - For type safety and catching bugs during development.

Database: PostgreSQL - A reliable relational database.

ORM: Prisma - For easier database interaction and migrations.

Real-Time: Socket.io - For pushing instant updates to clients.

Testing: Jest - For unit testing business logic.

Validation: Zod - For validating incoming request data.

🚀 Setup Instructions (How to run locally)
Follow these steps to get the backend server running:

Navigate to the server folder:

Bash

cd server
Install Dependencies:

Bash

npm install
Environment Setup: Create a .env file in the server folder. You will need a PostgreSQL database URL (you can use a local DB or a cloud provider like Neon/Render).

Code snippet

PORT=3000
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your_super_secret_key"
Database Migration: Push the schema to your database using Prisma.

Bash

npx prisma migrate dev --name init
Run the Server:

Bash

npm run dev
The server should now be running at http://localhost:3000.

Run Tests: To check the unit tests I wrote:

Bash

npm test
🏗️ Architecture & Design Decisions
This was the most important learning curve for me. Instead of writing all the logic inside the routes, I followed a Layered Architecture (Controller-Service-Repository).

1. The Service/Repository Pattern
I organized my code into three distinct layers:

Controllers: Only handle request/response and validation.

Services: Contain the business logic (e.g., checking if a user is allowed to delete a task).

Repositories: Directly talk to the database (Prisma).

AI Help: Honestly, as a fresher, I didn't know why this was necessary initially. I took AI's help to understand this pattern. It explained that separating logic makes the code testable and maintainable. If I ever want to switch from Prisma to another tool, I only have to change the Repository layer, not the whole app.

2. Database Choice (PostgreSQL vs MongoDB)
I chose PostgreSQL (Relational) over MongoDB (NoSQL).

Why? My data is highly structured. Users have Tasks, and Tasks have Creators and Assignees. SQL is perfect for handling these relationships (Foreign Keys) and ensuring data integrity.

3. Authentication (JWT)
I implemented stateless authentication using JSON Web Tokens (JWT).

Why? It scales well and allows the frontend to easily manage sessions by storing the token.

🔌 API Contract (Key Endpoints)
Here are the main endpoints exposed by the API:

Authentication
POST /api/auth/register - Create a new user account.

POST /api/auth/login - Login and receive a JWT.

Tasks
GET /api/tasks - Get all tasks (supports query filters: ?type=assigned&priority=HIGH).

POST /api/tasks - Create a new task.

PATCH /api/tasks/:id - Update a task (status, priority, assignee).

DELETE /api/tasks/:id - Delete a task.

Users
GET /api/users - Get list of users (for assignment dropdowns).

PATCH /api/users/profile - Update the logged-in user's profile name.

⚡ Real-Time Integration (Socket.io)
To make the app "Collaborative," I integrated Socket.io on the server.

How it works: Whenever a task is created, updated, or deleted in the Controller, I emit an event (e.g., io.emit('task created', data)).

The Result: All connected clients receive this event instantly and refresh their data without reloading the page.

🧪 Testing & Reliability
I implemented Unit Tests using Jest for the taskService.

What I tested: I focused on critical business logic, such as ensuring only the Creator or Assignee can update a task, and only the Creator can delete it.

AI Help: I used AI to learn about "Mocking". I learned that when testing logic, we shouldn't hit the real database. Instead, I mocked the taskRepository to return fake data, which makes tests run instantly and safely.

⚖️ Trade-offs & Assumptions
Validation: I assumed that input validation using Zod at the controller level is sufficient for data integrity.

Deployment: For the assignment, I am using free tier hosting (Render), so the server might spin down after inactivity (cold starts).

👨‍💻 Author
Built by Shardul Joshi. I focused on building a clean, scalable backend architecture and writing secure, tested code.