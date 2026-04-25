import { Router } from "express";
import TaskController from "./controller/TaskController";
import TaskService from "./service/TaskService";
import TaskRepository from "./repository/TaskRepository";
import { prisma } from "../../lib/prisma";
const router=Router();

const taskController=new TaskController(
    new TaskService(
        new TaskRepository(
            prisma as any
        )
    )
);

router.get('/',taskController.getAll);
router.post('/',taskController.create);
router.post('/get',taskController.getById);
router.post('/getByUser',taskController.getByUser);
router.put('/',taskController.update);
router.delete('/',taskController.delete);
export default router;
