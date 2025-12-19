// data model(should match prisma schema)
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TaskStatus = 'TO_DO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  creatorId: string;
  assignedToId?: string;
  createdAt: string;
  updatedAt: string;
  creator?: User;
  assignedTo?: User;
}

//api response structure
export interface ApiResponse<T = any> {
  status: 'success' | 'fail' | 'error'; // ✅ Aapka wala status
  message: string;
  data?: T; // data is optional  (will not come up if api fails)
  token?:string;
}

//eror structure (when backend throws error)
export interface BackendError {
  status: 'fail' | 'error';
  message: string;
}

// data required to create a new task
export interface CreateTaskData {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string; // ISO Date string
  assignedToId?: string;
}

// data required to update an existing task (everything is optional)
export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  assignedToId?: string;
}
// auth specific response (will come from login/register)
// export interface AuthData {
//   user: User;
//   token: string;
// }