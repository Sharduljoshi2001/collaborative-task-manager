import { useState, useEffect } from 'react'; 
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { taskService } from '../services/task';
import { LogOut, LayoutDashboard, Plus, Calendar, AlertCircle, Pencil, Trash2, Filter, Clock, User, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast'; //importing toast function
import CreateTaskModal from '../components/CreateTaskModal';
import EditTaskModal from '../components/EditTaskModal';
import type { Task } from '../types';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();
  
  //state for modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  //filter state
  const [filterType, setFilterType] = useState<'all' | 'assigned' | 'created' | 'overdue'>('all');

  //fetching tasks
  const { 
    data: tasksResponse, 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['tasks', filterType],
    queryFn: () => taskService.getAllTasks(
      filterType === 'all' ? {} : { type: filterType }
    ),
  });

  //delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      toast.success("Task deleted successfully"); //toast on delete
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete task");
    }
  });

  //socket listeners with notification logic
  useEffect(() => {
    if (!socket) return;

    //handler for task creation
    const handleTaskCreated = (newTask: Task) => {
      console.log('🔥 New task received:', newTask);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });

      //notify if assigned to me (and i didnt create it myself)
      if (newTask.assignedToId === user?.id && newTask.creatorId !== user?.id) {
        toast.success(`You have been assigned a new task: ${newTask.title}`, {
            icon: '🔔',
            duration: 5000
        });
      }
    };

    //handler for task updates
    const handleTaskUpdated = (updatedTask: Task) => {
        console.log(' Task update received:', updatedTask);
        queryClient.invalidateQueries({ queryKey: ['tasks'] });

        //notify if status changed on my task
        if (updatedTask.assignedToId === user?.id || updatedTask.creatorId === user?.id) {
            //optional: only notify on major changes like status
            //for now we just silent refresh or show small toast
            //toast.success(`Task updated: ${updatedTask.title}`);
        }
    };

    //handler for task deletion
    const handleTaskDeleted = (data: any) => {
      console.log('task deleted', data);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    };

    socket.on('task created', handleTaskCreated);
    socket.on('task updated', handleTaskUpdated);
    socket.on('task deleted', handleTaskDeleted);

    return () => {
      socket.off('task created', handleTaskCreated);
      socket.off('task updated', handleTaskUpdated);
      socket.off('task deleted', handleTaskDeleted);
    };
  }, [socket, queryClient, user]);

  const tasks = tasksResponse?.data || [];

  const handleEditClick = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTaskMutation.mutate(taskId);
    }
  };

  //helper functions for colors
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-500';
      case 'IN_PROGRESS': return 'bg-blue-500';
      case 'REVIEW': return 'bg-purple-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/*navbar*/}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <LayoutDashboard className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">TaskFlow</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-medium text-gray-900">{user?.name}</span>
                <span className="text-xs text-gray-500">{user?.email}</span>
                <span className={`text-[10px] ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                  {isConnected ? '● Live' : '○ Offline'}
                </span>
              </div>
              <button onClick={logout} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/*main content*/}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/*header*/}
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
            <p className="mt-1 text-sm text-gray-500">Manage your tasks and track progress</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              New Task
            </button>
          </div>
        </div>

        {/*filter tabs*/}
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setFilterType('all')}
              className={`${
                filterType === 'all'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <LayoutDashboard className="h-4 w-4" />
              All Tasks
            </button>

            <button
              onClick={() => setFilterType('assigned')}
              className={`${
                filterType === 'assigned'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <UserCheck className="h-4 w-4" />
              Assigned to Me
            </button>

            <button
              onClick={() => setFilterType('created')}
              className={`${
                filterType === 'created'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <User className="h-4 w-4" />
              Created by Me
            </button>

            <button
              onClick={() => setFilterType('overdue')}
              className={`${
                filterType === 'overdue'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <Clock className="h-4 w-4" />
              Overdue
            </button>
          </nav>
        </div>

        {/*content area*/}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-md bg-red-50 p-4 border border-red-200">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading tasks</h3>
                {/*@ts-ignore*/}
                <div className="mt-2 text-sm text-red-700">{error?.message || 'Something went wrong'}</div>
              </div>
            </div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
            <Filter className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
            <p className="mt-1 text-sm text-gray-500">
               {filterType === 'overdue' ? 'Great job! No overdue tasks.' : 'Try changing filters or create a new task.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-6 relative group">
                
                {/*header with actions*/}
                <div className="flex justify-between items-start mb-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button 
                        onClick={() => handleEditClick(task)}
                        className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                        title="Edit Task"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                    <button 
                        onClick={() => handleDeleteClick(task.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete Task"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${getStatusColor(task.status)}`} />
                    <span className="text-xs text-gray-500 font-medium capitalize">
                        {task.status.replace('_', ' ').toLowerCase()}
                    </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {task.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">
                  {task.description || "No description provided."}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                  </div>

                  {task.assignedTo && (
                    <div className="flex items-center" title={`Assigned to ${task.assignedTo.name}`}>
                      <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-600 border border-indigo-200">
                        {task.assignedTo.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="ml-2 text-xs text-gray-500 max-w-[100px] truncate">
                        {task.assignedTo.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/*modals*/}
        <CreateTaskModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
        
        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTask(null);
          }}
          task={selectedTask}
        />
      </div>
    </div>
  );
};

export default Dashboard;