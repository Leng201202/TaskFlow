import { Request, Response } from "express";
import TaskService from "../service/TaskService";


export default class TaskController {
    constructor(private taskService: TaskService) {
    }

    getAll= async (req: Request, res: Response) => {
        try {
            console.log("getAll api called");
            return res.json(await this.taskService.getAll());
        } catch (error) {
            return res.status(500).json({error: String(error)});
        }
    }
    create= async (req: Request, res: Response) => {
        try {
            const { title, description, content, createdById, completed, priority, dueDate, assignedTo } = req.body;
            return res.json(await this.taskService.create(title, description, content, createdById, completed, priority, dueDate, assignedTo));
        } catch (error) {
            return res.status(500).json({error: String(error)});
        }
    }
    getById= async (req: Request, res: Response) => {
        try {
            return res.json(await this.taskService.getById(req.body.id));
        } catch (error) {
            return res.status(500).json({error: String(error)});
        }
    }
    getByUser= async (req: Request, res: Response) => {
        try {
            console.log(req.body.id);
            return res.json(await this.taskService.getByUser(req.body.id));
            
        } catch (error) {
            return res.status(500).json({error: String(error)});
        }
    }
    update= async (req: Request, res: Response) => {
        try {
            return res.json(await this.taskService.update(req.body.id, req.body));
        } catch (error) {
            return res.status(500).json({error: String(error)});
        }
    }
    delete= async (req: Request, res: Response) => {
        try {
            return res.json(await this.taskService.delete(req.body.id));
        } catch (error) {
            return res.status(500).json({error: String(error)});
        }
    }

}
