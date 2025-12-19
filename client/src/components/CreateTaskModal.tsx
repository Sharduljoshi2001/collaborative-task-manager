import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, User as UserIcon } from 'lucide-react';
import { taskService } from '../services/task';
import { userService } from '../services/user';
import type { Task, TaskPriority, User } from '../types';
import { useState, useEffect } from 'react';

//validation schema for the task form
const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  dueDate: z.string().optional(),
  assignedToId: z.string().optional(),
});

type CreateTaskFormData = z.infer<typeof createTaskSchema>;

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: (task: Task) => void;
}

const CreateTaskModal = ({ isOpen, onClose, onTaskCreated }: CreateTaskModalProps) => {
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      priority: 'MEDIUM',
    },
  });

  //fetching users when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchUsers = async () => {
        setIsLoadingUsers(true);
        try {
          //FIX 1: renamed variable to response to be clear
          const response = await userService.getAllUsers();
          
          //checking if data exists inside response
          if (response.data) {
            setUsers(response.data);
          }
        } catch (err) {
          console.error("Failed to load users");
        } finally {
          setIsLoadingUsers(false);
        }
      };
      fetchUsers();
    }
  }, [isOpen]);

  const onSubmit = async (data: CreateTaskFormData) => {
    try {
      setError(null);
      //FIX 2: capturing full response first
      const response = await taskService.createTask({
        title: data.title,
        description: data.description,
        priority: data.priority as TaskPriority,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
        status: 'TO_DO',
        assignedToId: data.assignedToId === "" ? undefined : data.assignedToId
      });

      //checking if task data exists inside response
      if (response.data) {
        //passing only the task object, not the full response
        onTaskCreated(response.data);
        reset();
        onClose();
      } else {
        setError("Task created but no data returned");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/*backdrop overlay*/}
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        {/*modal panel*/}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Create New Task</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <X className="h-6 w-6" />
              </button>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                 <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/*title input*/}
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  {...register('title')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
              </div>

              {/*description input*/}
              <div>
                 <label className="block text-sm font-medium text-gray-700">Description</label>
                 <textarea {...register('description')} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/*priority select*/}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <select {...register('priority')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                {/*due date input*/}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Due Date</label>
                   <input type="date" {...register('dueDate')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
              </div>

              {/*assign user dropdown*/}
              <div>
                <label className="block text-sm font-medium text-gray-700">Assign To</label>
                <div className="relative rounded-md shadow-sm mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    {...register('assignedToId')}
                    className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Select a user (Optional)</option>
                    {isLoadingUsers ? (
                      <option disabled>Loading users...</option>
                    ) : (
                      users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div className="mt-5 sm:mt-6 flex justify-end gap-3">
                <button type="button" onClick={onClose} className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 disabled:opacity-50 sm:text-sm">
                  {isSubmitting ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;