import { createNewTask, updateTask, deleteTask } from '../src/services/taskService';
import * as taskRepository from '../src/repositories/taskRepository';

//mocking the repository layer so we dont hit real db
jest.mock('../src/repositories/taskRepository');

describe('Task Service Unit Tests', () => {
  //cleaning up mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });
  // TEST 1: SUCCESSFUL TASK CREATION
  it('should create a new task successfully', async () => {
    //arrange: preparing dummy data
    const mockTaskData = {
      title: 'Test Task',
      description: 'Testing',
      priority: 'HIGH' as const,
      dueDate: '2025-01-01'
    };
    const mockUserId = 'user-123';
    //telling the mock repo what to return when called
    (taskRepository.createTask as jest.Mock).mockResolvedValue({
      id: 'task-1',
      ...mockTaskData,
      creatorId: mockUserId,
      status: 'TO_DO'
    });

    //calling the service function
    const result = await createNewTask(mockTaskData as any, mockUserId);

    //assert: checking if result matches expectation
    expect(result).toHaveProperty('id', 'task-1');
    expect(result.title).toBe('Test Task');
    //verifying that repository was actually called
    expect(taskRepository.createTask).toHaveBeenCalledTimes(1);
  });
  // TEST 2: UNAUTHORIZED UPDATE
  it('should throw error when updating task without ownership', async () => {
    //existing task belongs to 'user-1'
    const mockExistingTask = {
      id: 'task-1',
      title: 'Old Title',
      creatorId: 'user-1', //owner
      assignedToId: 'user-2'
    };
    
    //mocking findTaskById to return the task above
    (taskRepository.findTaskById as jest.Mock).mockResolvedValue(mockExistingTask);

    //trying to update as 'user-3' (outsider)
    //we expect this to fail
    await expect(updateTask('task-1', 'user-3', { title: 'New' }))
      .rejects
      .toThrow('unauthorized: You cannot update this task');
  });
  // TEST 3: DELETE TASK NOT FOUND
  it('should throw error when deleting a non-existent task', async () => {
    //arrange: mocking repo to return null (task not found)
    (taskRepository.findTaskById as jest.Mock).mockResolvedValue(null);

    //act & assert
    await expect(deleteTask('invalid-id', 'user-1'))
      .rejects
      .toThrow('task not found');
  });

});