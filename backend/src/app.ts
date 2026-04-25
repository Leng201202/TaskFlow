import express from 'express';
import cors from 'cors';
import userRoutes from './modules/User/user.routes';
import taskRoutes from './modules/Task/task.routes';

const app=express();

// Allow requests from frontend
app.use(cors({
    origin: ['http://localhost:5174', 'http://localhost'],
    credentials: true
}));

app.use(express.json());

app.use('/user',userRoutes);
app.use('/task',taskRoutes);



export default app;