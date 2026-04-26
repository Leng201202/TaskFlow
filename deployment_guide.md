# TaskFlow: Ubuntu VM Deployment & Troubleshooting Guide

This document is a battle-tested guide for deploying the TaskFlow application to a production Ubuntu Virtual Machine. It includes the exact step-by-step deployment process, followed by a comprehensive list of all the roadblocks we hit during our initial deployment and how we solved them.

---

## Part 1: Deployment Steps

Here is the exact step-by-step process you should follow on a fresh Ubuntu VM.

### Step 1: Install Prerequisites
Install Git, Docker, and Docker Compose on your server.
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Grant your user Docker permissions (Log out and back in after running this)
sudo usermod -aG docker $USER
```

### Step 2: Clone the Repository
```bash
git clone https://github.com/Leng201202/TaskFlow.git
cd TaskFlow
```

### Step 3: Configure Environment Variables
Because `.env` files are securely ignored by Git, you must create them manually on the server.

**Backend `.env`**
```bash
nano backend/.env
```
*Paste this:*
```env
PORT=3000
DATABASE_URL="mysql://leng:20122002@db:3306/task"
REDIS_URL="redis://redis:6379"
```

**Frontend `.env`**
```bash
nano frontend/.env
```
*Paste this, replacing `<YOUR_UBUNTU_VM_PUBLIC_IP>` with your actual server IP:*
```env
VITE_API_URL=http://<YOUR_UBUNTU_VM_PUBLIC_IP>:3000
```

### Step 4: Configure CORS
Open `backend/src/app.ts` and ensure your production IP is whitelisted:
```typescript
app.use(cors({
    origin: ['http://<YOUR_UBUNTU_VM_PUBLIC_IP>:8080', 'http://localhost:5174'],
    credentials: true
}));
```

### Step 5: Boot the Containers
```bash
docker compose up --build -d
```

### Step 6: Initialize the Database
Push your Prisma schema to the newly created MySQL container to structure the database:
```bash
sudo docker exec -it node-backend npx prisma db push
```

---

## Part 2: Problems Faced & Solutions

During our initial deployment, we hit several common but frustrating roadblocks. Here is exactly what happened and how we fixed them permanently in the codebase and on the server.

### 1. Node.js Version Incompatibility (Prisma Error)
**The Problem:** The `backend/Dockerfile` was originally using `node:18-alpine`. However, Prisma v7+ requires Node 20 or higher, causing the Docker build to fail during `npm install`.
**The Fix:** We updated `backend/Dockerfile` to use `FROM node:22-alpine`, perfectly matching the frontend's version and satisfying Prisma's requirements.

### 2. Missing Build Script Crash
**The Problem:** The `backend/Dockerfile` attempted to run `npm run build`, but the backend uses `ts-node` for runtime execution and didn't actually have a build script defined in `package.json`.
**The Fix:** We removed the unnecessary `RUN npm run build` line from the Dockerfile.

### 3. "Address Already In Use" (Port Conflicts)
**The Problem:** When running `docker compose up`, Docker threw errors like `failed to bind host port for 0.0.0.0:3306: address already in use`. The Ubuntu server already had local instances of MySQL (`3306`), Redis (`6379`), and Nginx (`80`) running.
**The Fix:** We modified `docker-compose.yml`:
- Removed the `ports` mapping for both `db` and `redis`. These containers don't need to be exposed to the host machine; the backend can communicate with them securely over Docker's internal network using their service names (`db:3306` and `redis:6379`).
- Changed the frontend mapping from `80:80` to `8080:80` to avoid conflicts with any local Nginx servers.

### 4. Server Freezing / Infinite "Starting" State (OOM)
**The Problem:** Running `docker compose up` hung indefinitely on `Container node-backend Starting...`. Small VMs (like 512MB/1GB RAM) run out of memory trying to compile TypeScript on the fly using `ts-node`, causing the entire server to swap and freeze.
**The Fix:** We created a 2GB Swap file on the Ubuntu server to act as overflow memory:
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 5. Docker Network Corruption (`DOCKER-ISOLATION-STAGE-2 does not exist`)
**The Problem:** Docker threw a fatal `iptables` error complaining about missing stages and `nf_tables`. This happens on modern Ubuntu versions when Docker's internal firewall rules clash with Ubuntu's newer `nftables` engine, usually triggered by the server freezing or firewalls reloading.
**The Fix:** The most bulletproof solution to clear a deeply corrupted Docker network cache is to simply reboot the VM.
```bash
sudo reboot
```

### 6. Prisma "Can't reach database server at db:3306"
**The Problem:** Even though all containers were successfully running, Prisma failed to connect to the database. This was caused by Ubuntu's Uncomplicated Firewall (UFW) accidentally dropping inter-container forwarded packets on the Docker bridge network.
**The Fix:** We temporarily disabled UFW on the server (`sudo ufw disable`). For cloud-hosted VMs (AWS, DigitalOcean), it is highly recommended to leave UFW disabled and rely entirely on the Cloud Provider's Web Firewall (Security Groups) to manage port access.

---

## Part 3: Production Hardening (Nginx & SSL)

For a "Real-World" deployment, you should never expose your application ports (3000, 8080) directly to the internet. Instead, we use an **Nginx Gateway**.

### Step 1: The Gateway Architecture
Our new `docker-compose.yml` includes a `gateway` service. 
- It listens on **Port 80** (standard HTTP).
- It proxies `/api` requests to the backend.
- It serves the frontend for all other requests.

### Step 2: Update your Security Group
In your Cloud Provider (AWS, DigitalOcean, etc.):
1. **ALLOW** Port 80 (HTTP) and Port 443 (HTTPS).
2. **REMOVE/BLOCK** Port 3000 and 8080. They are now private and secure.

### Step 3: Setting up a Domain & HTTPS (SSL)
To get the "Green Lock" in the browser, you need a domain name and an SSL certificate.

1. **Point your Domain**: Update your domain's A-Record to point to your Ubuntu VM's Public IP.
2. **Install Certbot**:
   ```bash
   sudo apt install certbot
   ```
3. **Get a Certificate**:
   Stop your docker containers briefly and run:
   ```bash
   sudo certbot certonly --standalone -d yourdomain.com
   ```
4. **Update Nginx for SSL**:
   Modify `nginx/nginx.conf` to listen on port 443 and point to your new certificates in `/etc/letsencrypt/live/yourdomain.com/`. (Ask me for the exact config when you are ready to do this!)

### Step 4: Access your App
You no longer need to type a port number in your browser! Just go to:
`http://<YOUR_IP_OR_DOMAIN>`

