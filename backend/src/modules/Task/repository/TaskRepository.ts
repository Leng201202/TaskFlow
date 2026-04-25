import { PrismaClient } from "../../../../generated/prisma";
import { Priority } from "../../../shared/enums/Priority";

export default class TaskRepository{
    constructor(private prisma: PrismaClient){
    }
    async create(title: string,description: string,content: string,createdById: string,completed: boolean,priority: Priority,dueDate: Date,assignedTo: string[]){
        const newTask= await this.prisma.task.create({
            data:{
                title:title,
                description:description,
                content:content,
                completed:completed,
                createdById:createdById,
                dueDate:dueDate,
                priority:priority,
                assignedTo:{
                    connect: assignedTo.map(id => ({ id }))
                }
            },
            include:{
                assignedTo:true
            }
        });
        return newTask;
    }
    async getAll(){
        console.log("getAll api called in Repository");
        return await this.prisma.task.findMany({
            include:{
                assignedTo:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                    }
                }
            }
        });
    }
    async getById(id: string){
        const task = await this.prisma.task.findUnique({
            where:{
                id:id
            },
            include:{
                assignedTo:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                    }
                }
            }
        });
        if (!task) return null;
        // Ensure assignedTo is always an array
        return {
            ...task,
            assignedTo: Array.isArray(task.assignedTo) ? task.assignedTo : [],
        };
    }
    async getByUser(id: string){
        return await this.prisma.task.findMany({
            where:{
                OR:[
                    {createdById:id},
                    {assignedTo:{some:{id:id}}}
                ]
            },
            include:{
                createdBy:true,
                assignedTo:true
            }
        });
    }
    async update(id: string, data: any){
        const {assignedTo, ...rest}=data;
        const updatedData:any={
            ...rest,
            updatedAt:new Date(Date.now())
        }
        if(assignedTo!==undefined){
            const currTask=await this.prisma.task.findUnique({
                where:{
                    id:id
                },
                include:{
                    assignedTo:{
                        select:{
                            id:true,
                            name:true,
                            email:true,
                        }
                    }
                }
            })
            const currIds=Array.isArray(currTask?.assignedTo)?
            currTask?.assignedTo.map(u=>u.id)
            :[];


            updatedData.assignedTo={
                connect: data.assignedTo
                    .filter((id:string)=>!currIds.includes(id))
                    .map((id:string)=>({id})),
                disconnect: currIds
                    .filter((id:string)=>!data.assignedTo.includes(id))
                    .map((id:string)=>({id}))
            }
            

        }
        return await this.prisma.task.update({
            where: {
                id: id
            },
            data: updatedData,
            include:{
                assignedTo:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                    }
                }
            }
        });
    }

    async delete(id: string){
        return await this.prisma.task.delete({
            where:{
                id:id
            }
        })
    }

}
