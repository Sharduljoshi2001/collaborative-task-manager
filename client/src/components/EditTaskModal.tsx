import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, User as UserIcon, AlertCircle } from 'lucide-react';
import { taskService } from '../services/task';
import { userService } from '../services/user';
import type { Task, TaskPriority, TaskStatus } from '../types';
import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
//validation schema for updating task
const updateTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  status: z.enum(['TO_DO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']),
  dueDate: z.string().optional(),
  assignedToId: z.string().optional(),
});

type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null; //task to be edited
}

const EditTaskModal = ({ isOpen, onClose, task }: EditTaskModalProps) => {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  //fetching users for dropdown
  const { data: usersResponse } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAllUsers,
    enabled: isOpen,
  });
  const users = usersResponse?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UpdateTaskFormData>({
    resolver: zodResolver(updateTaskSchema),
  });

  //populating form when task changes
  useEffect(() => {
    if (task) {
      setValue('title', task.title);
      setValue('description', task.description || '');
      setValue('priority', task.priority);
      setValue('status', task.status);
      setValue('assignedToId', task.assignedToId || '');
      
      //formatting date for input field (yyyy-mm-dd)
      if (task.dueDate) {
        const date = new Date(task.dueDate);
        const formattedDate = date.toISOString().split('T')[0];
        setValue('dueDate', formattedDate);
      } else {
        setValue('dueDate', '');
      }
    }
  }, [task, setValue]);

  //mutation for updating task
  const updateTaskMutation = useMutation({
    mutationFn: (data: UpdateTaskFormData) => {
      if (!task) throw new Error("No task selected");
      
      return taskService.updateTask(task.id, {
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
        assignedToId: data.assignedToId === "" ? undefined : data.assignedToId
      });
    },
    onSuccess: () => {
      //invalidating query to refetch updated list
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      reset();
      onClose();
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to update task');
    }
  });

  const onSubmit = (data: UpdateTaskFormData) => {
    setError(null);
    updateTaskMutation.mutate(data);
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Edit Task</h3>
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
                <input type="text" {...register('title')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
              </div>

              {/*description input*/}
              <div>
                 <label className="block text-sm font-medium text-gray-700">Description</label>
                 <textarea {...register('description')} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/*priority select*/}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <select {...register('priority')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                {/*status select (NEW)*/}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select {...register('status')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm">
                    <option value="TO_DO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="REVIEW">Review</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/*due date input*/}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Due Date</label>
                   <input type="date" {...register('dueDate')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" />
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
                        className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm"
                    >
                        <option value="">Unassigned</option>
                        {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.name}
                        </option>
                        ))}
                    </select>
                    </div>
                </div>
              </div>

              <div className="mt-5 sm:mt-6 flex justify-end gap-3">
                <button type="button" onClick={onClose} className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:text-sm">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={updateTaskMutation.isPending}
                  className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 disabled:opacity-50 sm:text-sm"
                >
                  {updateTaskMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;