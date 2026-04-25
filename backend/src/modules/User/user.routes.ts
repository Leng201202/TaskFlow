import { Router } from "express";
import UserController from "../User/controller/UserController";
import UserService from "../User/service/UserService";
import UserRepository from "../User/repository/UserRepository";
import { prisma } from "../../lib/prisma";

const router=Router();

const userController=new UserController(
    new UserService(
        new UserRepository(
            prisma as any
        )
    )
);

router.get('/',userController.getAll);
router.post('/get',userController.getById);
router.post('/',userController.create);
router.put('/',userController.update);
router.delete('/',userController.delete);
export default router;
