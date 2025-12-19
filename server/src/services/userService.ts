import { prisma } from "../config/db";
// service funtion to update user profile
export const updateUserProfile = async (userId: string, name: string) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { name },
    select: { id: true, name: true, email: true }
  });

  return updatedUser;
};

// service function to get all users
export const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
};