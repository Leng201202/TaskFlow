import {Request,Response} from 'express';
import UserService from '../service/UserService';

export default class UserController {
    constructor(private userService: UserService) {
    }
    getAll= async (req: Request, res: Response) => {
        try {
            return res.json(await this.userService.getAll());
        } catch (error) {
            return res.status(500).json({error: String(error)});
        }
    }
    getById= async (req: Request, res: Response) => {
        try {
            return res.json(await this.userService.getById(req.body.id));
        } catch (error) {
            return res.status(500).json({error: String(error)});
        }
    }
    create= async (req: Request, res: Response) => {
        try {
            return res.json(await this.userService.create(req.body.name, req.body.email, req.body.password));
        } catch (error) {
            return res.status(500).json({error: String(error)});
        }
    }
    update= async (req: Request, res: Response) => {
        try {
            return res.json(await this.userService.update(req.body.id, req.body));
        } catch (error) {
            return res.status(500).json({error: String(error)});
        }
    }
    delete= async (req: Request, res: Response) => {
        try {
            return res.json(await this.userService.delete(req.body.id));
        } catch (error) {
            return res.status(500).json({error: String(error)});
        }
    }

}
