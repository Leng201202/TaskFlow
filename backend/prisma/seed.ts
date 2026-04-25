import "dotenv/config";
import { PrismaClient } from "../generated/prisma";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { randomUUID } from "crypto";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in .env");
}

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  // Clear existing data
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const adminId = randomUUID();
  const userId = randomUUID();

  const users = await prisma.user.createMany({
    data: [
      {
        id: adminId,
        name: "admin",
        email: "admin@example.com",
        password: "123456", // Use hashed password in production
      },
      {
        id: userId,
        name: "user",
        email: "user@example.com",
        password: "123456",
      },
    ],
  });


  // Manually create 40 unique tasks
  const manualTasks = [
    {
      title: "Setup project repository",
      description: "Initialize git and setup remote repository.",
      content: "Create a new git repository and push initial commit.",
      completed: false,
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      createdById: adminId,
      assignedTo: { connect: [{ id: adminId }] },
    },
    {
      title: "Install dependencies",
      description: "Install all required npm packages.",
      content: "Run npm install to get all dependencies.",
      completed: false,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      createdById: userId,
      assignedTo: { connect: [{ id: userId }] },
    },
    {
      title: "Configure TypeScript",
      description: "Setup tsconfig.json for the project.",
      content: "Adjust compiler options for best practices.",
      completed: false,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      createdById: adminId,
      assignedTo: { connect: [{ id: adminId }, { id: userId }] },
    },
    {
      title: "Setup Prisma",
      description: "Initialize Prisma and generate client.",
      content: "Run npx prisma init and setup schema.",
      completed: false,
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      createdById: userId,
      assignedTo: { connect: [{ id: userId }] },
    },
    {
      title: "Design database schema",
      description: "Draft initial database models for User and Task.",
      content: "Edit schema.prisma and define relations.",
      completed: false,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      createdById: adminId,
      assignedTo: { connect: [{ id: adminId }] },
    },
    {
      title: "Run migrations",
      description: "Apply initial migrations to the database.",
      content: "Use npx prisma migrate dev.",
      completed: true,
      dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      createdById: userId,
      assignedTo: { connect: [{ id: userId }, { id: adminId }] },
    },
    {
      title: "Seed database",
      description: "Write and run seed script for initial data.",
      content: "Create users and tasks in seed.ts.",
      completed: false,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdById: adminId,
      assignedTo: { connect: [{ id: adminId }] },
    },
    {
      title: "Setup Express server",
      description: "Create basic Express server in app.ts.",
      content: "Listen on port 3000 and add health check route.",
      completed: false,
      dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      createdById: userId,
      assignedTo: { connect: [{ id: userId }] },
    },
    {
      title: "Implement User module",
      description: "Add User CRUD endpoints.",
      content: "Create controller, service, and repository for User.",
      completed: false,
      dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
      createdById: adminId,
      assignedTo: { connect: [{ id: adminId }, { id: userId }] },
    },
    {
      title: "Implement Task module",
      description: "Add Task CRUD endpoints.",
      content: "Create controller, service, and repository for Task.",
      completed: false,
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      createdById: userId,
      assignedTo: { connect: [{ id: userId }] },
    },
    // ... 30 more unique tasks ...
  ];

  // Add 30 more unique tasks
  for (let i = 11; i <= 40; i++) {
    manualTasks.push({
      title: `Feature implementation ${i}`,
      description: `Implement feature number ${i} for the project, including edge cases and tests.`,
      content: `Detailed implementation plan for feature ${i}. Ensure code quality and add documentation.`,
      completed: i % 4 === 0,
      dueDate: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
      createdById: i % 2 === 0 ? adminId : userId,
      assignedTo: { connect: i % 3 === 0 ? [{ id: adminId }, { id: userId }] : [{ id: adminId }] },
    });
  }

  for (const task of manualTasks) {
    await prisma.task.create({ data: task });
  }

  console.log("Seed data created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
