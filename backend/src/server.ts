import app from './app';
import { prisma } from './lib/prisma';
import redisClient from './lib/redis';

const PORT=process.env.PORT||3000;
app.listen(PORT,async ()=>{
    await redisClient.connect();
    console.log(`Server is running on port ${PORT}`);
    prisma.$connect();
    console.log('Prisma connected to SQL');

    const shutdown=async ()=>{
        try {
            console.log("Shutting down Server...");
            
            
        } catch (err) {
            console.error("Error shutting down Prisma client:", err);
        }
    }
})
