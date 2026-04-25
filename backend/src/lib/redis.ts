import { createClient,RedisClientType } from "redis";

class RedisClient{
  private client:RedisClientType;

  constructor(){
    this.client=createClient({
      url: process.env.REDIS_URL, // example: redis://localhost:6379
    });
  }

  public async connect():Promise<void>{
    try{
      await this.client.connect();
      console.log("Redis connected");
    }catch(err){
      console.error("Redis Client Error:", err);
    }
  }
  public async disconnect():Promise<void>{
    await this.client.quit();
    console.log("Redis disconnected");
  }
  public async setEx(key:string,exp:number,value:any):Promise<void>{
    try{
      const valueStr=JSON.stringify(value);
      await this.client.set(key,valueStr,{EX:exp});
    }catch(err){
      console.error("Redis Set Error:", err);
    }
  }
  public async get(key:string):Promise<any>{
    try{
      const value=await this.client.get(key);
      if(value){
        return JSON.parse(value);
      }
      return null;
    }catch(err){
      console.error("Redis Get Error:", err);
      return null;
    }
  }
  public async del(key:string):Promise<number>{
    try{
      return await this.client.del(key);
    }catch(err){
      console.error("Redis Del Error:", err);
      return 0;
    }
  }

}
const redisClient=new RedisClient();
export default redisClient;

