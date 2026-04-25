import bcrypt from "bcrypt";
import { PrismaClient } from "../../../../generated/prisma";

export default class UserRepository {
    constructor(private prisma: PrismaClient) {
    }

    async create(name: string, email: string, password: string) {
        const hashedPassword=await bcrypt.hash(password, 10);
        return await this.prisma.user.create({
            data: {
                name,
                email,
                password:hashedPassword
            },
        });
    }

    async getAll() {
        return await this.prisma.user.findMany();
    }

    async getById(id: string) {
        return await this.prisma.user.findUnique({
            where: {
                id:id
            }
        });
    }

    async update(id: string, data: any) {
        return await this.prisma.user.update({
            where: {
                id:id
            },
            data:data
        });
    }

    async delete(id: string) {
        return await this.prisma.user.delete({
            where: {
                id:id
            }
        });
    }
}