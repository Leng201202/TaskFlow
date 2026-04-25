import  UserRepository  from "../repository/UserRepository";

export default class UserService {
    constructor(private UserRepo: UserRepository) {}

    async create(name: string, email: string, password: string) {
        return await this.UserRepo.create(name, email, password);
    }
    async getAll() {
        return await this.UserRepo.getAll();
    }
    async getById(id: string) {
        return await this.UserRepo.getById(id);
    }
    async update(id: string, data: any) {
        return await this.UserRepo.update(id, data);
    }
    async delete(id: string) {
        return await this.UserRepo.delete(id);
    }
    
}