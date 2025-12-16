import { prisma } from "../config/db";
import { CreateTaskInput, UpdateTaskInput } from "../validators/taskValidator";
//creating task
export const createTask = async (data: CreateTaskInput, creatorId: string) => {
  return await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: data.status,
      dueDate: data.dueDate,
      creator: {
        connect: {
          id: creatorId,
        },
      },
      //connecting specific task to specific creator
      ...(data.assignedToId && {
        assignedTo: {
          connect: {
            id: data.assignedToId,
          },
        },
      }),
    },
  });
};

//getting all the tasks
export const getAllTasks = async ()=>{
    return prisma.task.findMany({
        include:{
            creator:{
                select:{ id:true,name:true, email:true }
            },
            assignedTo:{ 
                select:{id:true, name:true, email:true}
            }
        },
        orderBy:{createdAt:'desc'}
    })
}
