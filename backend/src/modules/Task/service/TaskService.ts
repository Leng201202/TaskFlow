import TaskRepository from "../repository/TaskRepository";
import redisClient from "../../../lib/redis";
import { Priority } from "../../../shared/enums/Priority";


export default class TaskService{
    constructor(private taskRepository: TaskRepository){
        this.taskRepository=taskRepository;
    }
    async create(title: string,description: string,content: string,createdById: string,completed: boolean,priority: Priority,dueDate: Date,assignedTo: string[]){
        return await this.taskRepository.create(title,description,content,createdById,completed,priority,dueDate,assignedTo);
    }
    async getAll(){
        const data=await this.taskRepository.getAll();
        return data;

    }
    async getById(id: string){
        return await this.taskRepository.getById(id);
    }
    async getByUser(id: string){
        const data=await this.taskRepository.getByUser(id);    
        return data;
    }
    async update(id: string, data: any){
        const updateData = {
            ...data,
            updatedAt: new Date()
        };
        return await this.taskRepository.update(id, updateData);
    }
    async delete(id: string){
        return await this.taskRepository.delete(id);
    }
}
