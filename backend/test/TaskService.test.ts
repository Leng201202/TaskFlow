import TaskService from "../src/modules/Task/service/TaskService";
import TaskRepository from "../src/modules/Task/repository/TaskRepository";
import { prisma } from "../src/lib/prisma";
import { randomUUID } from "crypto";
import { Priority } from "../src/shared/enums/Priority";

const taskRepo = new TaskRepository(prisma as any);
const taskService = new TaskService(taskRepo);

let adminUUID: string;
let userUUID: string;

jest.mock("../src/lib/redis", () => ({

  redisClient: {

    get: jest.fn().mockResolvedValue(null),

    set: jest.fn().mockResolvedValue("OK"),

    del: jest.fn().mockResolvedValue(1),

  },

}));

beforeEach(async () => {
  adminUUID = randomUUID();
  userUUID = randomUUID();

  await prisma.task.deleteMany();
  await prisma.user.deleteMany();
  

  await prisma.user.createMany({

    data: [
      {
        id: adminUUID,
        name: "admin",
        email: "admin@example.com",
        password: "123456",
      },
      {
        id: userUUID,
        name: "user",
        email: "user@example.com",
        password: "123456",
      },
    ],
  });
});

describe("Create Task (Unit Test)", () => {
  it("should create a task", async () => {
    const task = await taskService.create(
      "Write a test",
      "Testcase TDD",
      "Write test realated code for TDD",
      adminUUID,
      false,
      Priority.Medium,
      new Date(),
      [userUUID, adminUUID]
    );

    expect(task.title).toBe("Write a test");
    expect(task.description).toBe("Testcase TDD");
    expect(task.content).toBe("Write test realated code for TDD");
    expect(task.completed).toBe(false);
    expect(task.createdById).toBe(adminUUID);
    expect(task.dueDate).toBeInstanceOf(Date);
    expect(task.priority).toBe(Priority.Medium);
  });
});

describe("Get All Tasks (Unit Test)", () => {
  it("should get all task", async () => {
    await taskService.create(
      "Write a test",
      "Testcase TDD",
      "Write test realated code for TDD",
      adminUUID,
      false,
      Priority.Low,
      new Date(),
      [userUUID, adminUUID]
    );

    await taskService.create(
      "Write a test 2",
      "Testcase TDD 2",
      "Write test realated code for TDD",
      userUUID,
      false,
      Priority.Low,
      new Date(),
      [userUUID, adminUUID]
    );

    const tasks = await taskService.getAll();
    expect(tasks.length).toBe(2);
  });
});

describe("Get Task By Id (Unit Test)", () => {
  it("should get task by id", async () => {
    const task1 = await taskService.create(
      "Write a test",
      "Testcase TDD",
      "Write test realated code for TDD",
      adminUUID,
      false,
      Priority.Low,
      new Date(),
      [userUUID, adminUUID]
    );

    const task = await taskService.getById(task1.id);
    expect(task).not.toBeNull();
    expect(task?.id).toBe(task1.id);
  });
});

describe("Get All Tasks related to User(Unit Test)",()=>{
  it("should query all tasks related to user", async ()=>{
    const task1=await taskService.create(
      "Write a test",
      "Testcase TDD",
      "Write test realated code for TDD",
      userUUID,
      false,
      Priority.Low,
      new Date(),
      [userUUID, adminUUID]
    );
    const task2=await taskService.create(
      "Write a test 2",
      "Testcase TDD 2",
      "Write test realated code for TDD",
      adminUUID,
      false,
      Priority.Low,
      new Date(),
      [userUUID]
    )
    const tasks=await taskService.getByUser(userUUID);
    expect(tasks.length).toBe(2);
  })
})

describe("Update Task (Unit Test)", () => {
  it("should update data by id", async () => {
    const initialTask = await taskService.create(
      "Original Title",
      "Initial Desc",
      "Initial Content",
      adminUUID,
      false,
      Priority.Low,
      new Date(),
      []
    );

    const updatedTask = await taskService.update(initialTask.id, {
      title: "Updated Title",
      assignedTo: [userUUID],
    });

    expect(updatedTask).not.toBeNull();
    expect(updatedTask?.id).toBe(initialTask.id);
    expect(updatedTask?.title).toBe("Updated Title");
    expect(updatedTask?.description).toBe("Initial Desc");
    expect(updatedTask?.completed).toBe(false);
    expect(updatedTask?.assignedTo).toHaveLength(1);
    expect(updatedTask?.assignedTo?.[0]?.id).toBe(userUUID);
  });
});

describe("Delete Task (Unit Test)", () => {
  it("should delete by id", async () => {
    const task1 = await taskService.create(
      "Write a test",
      "Testcase TDD",
      "Write test realated code for TDD",
      adminUUID,
      false,
      Priority.Low,
      new Date(),
      []
    );

    await taskService.delete(task1.id);

    const task = await taskService.getById(task1.id);
    expect(task).toBeNull();
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});