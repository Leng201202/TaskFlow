import UserRepository from "../src/modules/User/repository/UserRepository";
import UserService from "../src/modules/User/service/UserService";
import bcrypt from "bcrypt";
import {prisma} from "../src/lib/prisma";
const userRepo=new UserRepository(prisma as any);
const userService=new UserService(userRepo);

beforeEach(async ()=>{
    
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
    
})
afterEach(async () => {

  await prisma.task.deleteMany();
  await prisma.user.deleteMany();
  

});

describe("Create User (Unit Test)", () => {
    it("should create a user", async () => {
        const user = await userService.create(
            "Test User",
            "test@example.com",
            "123456"
        );
        const hashedPassword=await bcrypt.hash("123456", 10);
        expect(user.name).toBe("Test User");
        expect(user.email).toBe("test@example.com");
        const isMatch=await bcrypt.compare("123456", user.password);
        expect(isMatch).toBe(true);
    });
});

describe("Get All Users (Unit Test)", () => {
    
    it("should get all users", async () => {
        await userService.create(
            "Test User",
            "test@example.com",
            "123456"

        );
        await userService.create(
            "Test User 2",
            "test2@example.com",
            "123456"

        );

        const users = await userService.getAll();
        expect(users.length).toBe(2);
    });
});

describe("Get User By Id (Unit Test)", () => {
    it("should get user by id", async () => {
        const user = await userService.create(
            "Test User",
            "test@example.com",
            "123456"

        );
        const userById = await userService.getById(user.id);
        expect(userById).not.toBeNull();
        expect(userById?.id).toBe(user.id);
    });
});

describe("Update User (Unit Test)", () => {
    it("should update data by id", async () => {
        const initialUser = await userService.create(
            "Original User",
            "original@example.com",
            "123456"

        );
        await new Promise((resolve) => setTimeout(resolve, 100));
        const hashedPassword=await bcrypt.hash("updatedPassword", 10);
        const updatedUser = await userService.update(initialUser.id, {
            name: "Updated User",
            email: "updated@example.com",
            password: hashedPassword,
        });
        
        const isMatch=await bcrypt.compare("updatedPassword", updatedUser.password);
        
        expect(updatedUser).not.toBeNull();
        expect(updatedUser?.id).toBe(initialUser.id);
        expect(updatedUser?.name).toBe("Updated User");
        expect(updatedUser?.email).toBe("updated@example.com");
        expect(isMatch).toBe(true);
    });
});

describe("Delete User (Unit Test)", () => {
    it("should delete a user by id", async () => {
        const user = await userService.create(
            "Test User",
            "test@example.com",
            "123456"

        );
        await userService.delete(user.id);
        const userById = await userService.getById(user.id);
        expect(userById).toBeNull();
    });
});
afterAll(async () => {
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();

});