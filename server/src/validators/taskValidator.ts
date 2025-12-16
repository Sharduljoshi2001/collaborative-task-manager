import {z} from 'zod';
//values same as schema.prisma
export const TaskPriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH','URGENT']);
export const TaskStatusEnum = z.enum(['TO_DO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']);
export const createTaskSchema = z.object({
    title: z.string().min(1, {message:"title is required"}),
    description: z.string().optional(),
    dueDate : z.string().datetime({message:"invalid date format",offset:true} ).optional(),
    priority: TaskPriorityEnum.optional().default("MEDIUM"),
    status: TaskStatusEnum.optional().default("TO_DO"),
    //assignedToId will be optional cuz we can assign it later
    assignedToId: z.string().uuid({message:"invalid id format"}).optional()
});
//optional makes all fields optional during update request(put / patch)
export const updateTaskSchema = createTaskSchema.partial();

export type CreateTaskInput  = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;