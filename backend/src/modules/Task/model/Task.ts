import { User } from "../../User/model/User";
import { Priority } from "../../../shared/enums/Priority";

export class Task{
     title: string;
     description: string;
     content: string;
     dueDate: Date;
     completed: boolean;
     priority: Priority;
     createdById: string;
     assignedTo: User[];

     constructor(title: string,description: string,content: string,completed: boolean,priority: Priority,dueDate: Date,createdById: string,assignedTo: User[]){
        this.title=title;
        this.description=description;
        this.content=content;
        this.dueDate=dueDate;
        this.completed=completed;
        this.createdById=createdById;
        this.priority=priority;
        this.assignedTo=assignedTo;
     }
}