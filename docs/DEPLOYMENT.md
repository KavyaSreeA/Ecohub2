# EcoHub Platform - Enterprise Deployment Guide

Comprehensive guide for deploying EcoHub Platform in production environments.

## Table of Contents

- [Deployment Overview](#deployment-overview)
- [Infrastructure Requirements](#infrastructure-requirements)
- [Deployment Strategies](#deployment-strategies)
- [Container Deployment](#container-deployment)
- [Cloud Platform Deployment](#cloud-platform-deployment)
- [Database Deployment](#database-deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Disaster Recovery](#disaster-recovery)

---

## Deployment Overview

### Deployment Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    Load Balancer (ALB/NLB)                 │
│                   SSL/TLS Termination                       │
└───────────────────────┬────────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
┌───────▼────────┐              ┌───────▼────────┐
│  Web Server 1  │              │  Web Server 2  │
│  (Container)   │              │  (Container)   │
└───────┬────────┘              └───────┬────────┘
        │                               │
        └───────────────┬───────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
┌───────▼────────┐              ┌───────▼────────┐
│   MongoDB      │              │     Redis      │
│   Cluster      │              │    Cache       │
└────────────────┘              └────────────────┘
```

### Deployment Options

| Option | Complexity | Cost | Scalability | Best For |
|--------|-----------|------|-------------|----------|
| **Single Server** | Low | Low | Limited | Development, Small Teams |
| **Docker Compose** | Medium | Low | Medium | Small to Medium Production |
| **Kubernetes** | High | Medium-High | High | Large Scale, Enterprise |
| **Managed PaaS** | Low | Medium | High | Quick Launch, Startups |
| **Serverless** | Medium | Variable | Auto | Event-driven, Variable Load |

---

## Infrastructure Requirements

### Minimum Requirements

#### Development Environment
- **CPU**: 2 cores
- **RAM**: 4 GB
- **Storage**: 20 GB SSD
- **Network**: 10 Mbps

#### Production Environment (Small Scale)
- **CPU**: 4 cores per instance
- **RAM**: 8 GB per instance
- **Storage**: 100 GB SSD
- **Network**: 100 Mbps
- **Instances**: 2+ (for redundancy)

#### Production Environment (Enterprise Scale)
- **CPU**: 8+ cores per instance
- **RAM**: 16+ GB per instance
- **Storage**: 500+ GB SSD (database)
- **Network**: 1 Gbps
- **Instances**: 3+ web servers, 3+ database nodes
- **CDN**: Required
- **Cache**: Redis cluster

### Software Requirements

- **Node.js**: 20.x or later
- **Docker**: 24.x or later
- **Docker Compose**: 2.x or later
- **Kubernetes**: 1.28+ (if using K8s)
- **MongoDB**: 7.x or later
- **Redis**: 7.x or later (optional)
- **Nginx**: 1.24+ or equivalent load balancer

---

## Deployment Strategies

### 1. Blue-Green Deployment

Deploy new version alongside old version, then switch traffic.

```bash
# Deploy green environment
docker-compose -f docker-compose.green.yml up -d

# Run health checks
curl https://green.ecohub.com/api/health

# Switch load balancer to green
# Update DNS or load balancer configuration

# Keep blue environment for rollback
# After verification, terminate blue
docker-compose -f docker-compose.blue.yml down
```

**Advantages**:
- Zero downtime
- Easy rollback
- Full testing before switch

**Disadvantages**:
- Requires 2x resources
- Database migration complexity

---

### 2. Rolling Deployment

Update instances one at a time.

```bash
# Update instance 1
docker-compose up -d --no-deps --scale ecohub=3 ecohub

# Wait for health check
sleep 30

# Continue with remaining instances
```

**Advantages**:
- No additional resources needed
- Gradual rollout

**Disadvantages**:
- Longer deployment time
- Mixed versions during deployment

---

### 3. Canary Deployment

Route small percentage of traffic to new version.

```bash
# Deploy canary (10% traffic)
kubectl apply -f k8s/canary-deployment.yml

# Monitor metrics
# If successful, increase to 50%, then 100%

# Full rollout
kubectl apply -f k8s/production-deployment.yml
```

**Advantages**:
- Risk mitigation
- Real user testing
- Easy rollback

---

## Container Deployment

### Docker Deployment

#### 1. Build Docker Image

```bash
# Navigate to project root
cd Ecohub2

# Build production image
docker build -t ecohub-platform:latest .

# Tag for registry
docker tag ecohub-platform:latest your-registry/ecohub-platform:v1.0.0
```

#### 2. Push to Container Registry

```bash
# Docker Hub
docker login
docker push your-registry/ecohub-platform:v1.0.0

# AWS ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/ecohub-platform:v1.0.0

# Google Container Registry
gcloud auth configure-docker
docker push gcr.io/your-project/ecohub-platform:v1.0.0
```

#### 3. Run Container

```bash
# Run single container
docker run -d \
  --name ecohub \
  -p 4000:4000 \
  -e NODE_ENV=production \
  -e JWT_SECRET=your-secret \
  -e MONGODB_URI=mongodb://... \
  --restart unless-stopped \
  ecohub-platform:latest

# Check logs
docker logs -f ecohub

# Health check
curl http://localhost:4000/api/health
```

---

### Docker Compose Deployment

#### Production docker-compose.yml

```yaml
version: '3.8'

services:
  ecohub:
    image: your-registry/ecohub-platform:latest
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - PORT=4000
      - JWT_SECRET=${JWT_SECRET}
      - MONGODB_URI=${MONGODB_URI}
    deploy:
      replicas: 3
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:4000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - ecohub-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - ecohub
    networks:
      - ecohub-network

  mongodb:
    image: mongo:7
    volumes:
      - mongodb_data:/data/db
      - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_ROOT_USERNAME}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_ROOT_PASSWORD}
    networks:
      - ecohub-network

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    networks:
      - ecohub-network

volumes:
  mongodb_data:
  redis_data:

networks:
  ecohub-network:
    driver: bridge
```

#### Deploy with Docker Compose

```bash
# Create .env file with secrets
cat > .env << EOF
JWT_SECRET=your-production-secret
MONGODB_URI=mongodb://mongodb:27017/ecohub
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=secure-password
REDIS_PASSWORD=redis-secure-password
EOF

# Deploy
docker-compose up -d

# Scale web servers
docker-compose up -d --scale ecohub=5

# View logs
docker-compose logs -f ecohub

# Stop deployment
docker-compose down
```

---

### Kubernetes Deployment

#### 1. Create Kubernetes Manifests

**deployment.yaml**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ecohub-deployment
  labels:
    app: ecohub
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ecohub
  template:
    metadata:
      labels:
        app: ecohub
    spec:
      containers:
      - name: ecohub
        image: your-registry/ecohub-platform:latest
        ports:
        - containerPort: 4000
        env:
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "4000"
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: ecohub-secrets
              key: jwt-secret
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: ecohub-secrets
              key: mongodb-uri
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 4000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 4000
          initialDelaySeconds: 10
          periodSeconds: 5
```

**service.yaml**:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: ecohub-service
spec:
  selector:
    app: ecohub
  ports:
    - protocol: TCP
      port: 80
      targetPort: 4000
  type: LoadBalancer
```

**secrets.yaml**:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: ecohub-secrets
type: Opaque
data:
  jwt-secret: <base64-encoded-secret>
  mongodb-uri: <base64-encoded-uri>
```

**ingress.yaml**:
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ecohub-ingress
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - ecohub.com
    secretName: ecohub-tls
  rules:
  - host: ecohub.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: ecohub-service
            port:
              number: 80
```

#### 2. Deploy to Kubernetes

```bash
# Create namespace
kubectl create namespace ecohub

# Create secrets
kubectl create secret generic ecohub-secrets \
  --from-literal=jwt-secret=your-secret \
  --from-literal=mongodb-uri=mongodb://... \
  -n ecohub

# Apply manifests
kubectl apply -f k8s/ -n ecohub

# Check deployment
kubectl get pods -n ecohub
kubectl get services -n ecohub

# View logs
kubectl logs -f deployment/ecohub-deployment -n ecohub

# Scale deployment
kubectl scale deployment ecohub-deployment --replicas=5 -n ecohub
```

---

## Cloud Platform Deployment

### AWS Deployment

#### Option 1: Elastic Container Service (ECS)

```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name ecohub-cluster

# Register task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Create service
aws ecs create-service \
  --cluster ecohub-cluster \
  --service-name ecohub-service \
  --task-definition ecohub-task \
  --desired-count 3 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx]}"
```

#### Option 2: Elastic Beanstalk

```bash
# Initialize EB application
eb init -p docker ecohub-platform

# Create environment
eb create ecohub-production --scale 3

# Deploy
eb deploy

# Open application
eb open
```

#### Infrastructure as Code (Terraform)

```hcl
# main.tf
provider "aws" {
  region = "us-east-1"
}

resource "aws_ecs_cluster" "ecohub" {
  name = "ecohub-cluster"
}

resource "aws_ecs_task_definition" "ecohub" {
  family                   = "ecohub-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "1024"
  memory                   = "2048"
  
  container_definitions = jsonencode([{
    name  = "ecohub"
    image = "your-registry/ecohub-platform:latest"
    portMappings = [{
      containerPort = 4000
      protocol      = "tcp"
    }]
    environment = [
      { name = "NODE_ENV", value = "production" }
    ]
    secrets = [
      { name = "JWT_SECRET", valueFrom = aws_secretsmanager_secret.jwt.arn }
    ]
  }])
}

resource "aws_ecs_service" "ecohub" {
  name            = "ecohub-service"
  cluster         = aws_ecs_cluster.ecohub.id
  task_definition = aws_ecs_task_definition.ecohub.arn
  desired_count   = 3
  launch_type     = "FARGATE"
  
  load_balancer {
    target_group_arn = aws_lb_target_group.ecohub.arn
    container_name   = "ecohub"
    container_port   = 4000
  }
}
```

---

### Azure Deployment

#### Azure Container Instances

```bash
# Create resource group
az group create --name ecohub-rg --location eastus

# Create container
az container create \
  --resource-group ecohub-rg \
  --name ecohub \
  --image your-registry/ecohub-platform:latest \
  --cpu 2 \
  --memory 4 \
  --ports 4000 \
  --environment-variables NODE_ENV=production \
  --secure-environment-variables JWT_SECRET=your-secret
```

#### Azure Kubernetes Service (AKS)

```bash
# Create AKS cluster
az aks create \
  --resource-group ecohub-rg \
  --name ecohub-aks \
  --node-count 3 \
  --enable-addons monitoring \
  --generate-ssh-keys

# Get credentials
az aks get-credentials --resource-group ecohub-rg --name ecohub-aks

# Deploy using kubectl
kubectl apply -f k8s/
```

---

### Google Cloud Platform Deployment

#### Cloud Run

```bash
# Build and push image
gcloud builds submit --tag gcr.io/your-project/ecohub-platform

# Deploy to Cloud Run
gcloud run deploy ecohub \
  --image gcr.io/your-project/ecohub-platform \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production \
  --set-secrets JWT_SECRET=jwt-secret:latest
```

#### Google Kubernetes Engine (GKE)

```bash
# Create GKE cluster
gcloud container clusters create ecohub-cluster \
  --num-nodes=3 \
  --machine-type=e2-standard-4

# Get credentials
gcloud container clusters get-credentials ecohub-cluster

# Deploy
kubectl apply -f k8s/
```

---

## Database Deployment

### MongoDB Atlas (Recommended)

1. **Create Cluster**:
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create cluster (M10 or higher for production)
   - Choose region closest to application servers

2. **Configure Security**:
   ```bash
   # Whitelist application IPs
   # Or use VPC peering for AWS/Azure/GCP
   
   # Create database user
   Username: ecohub-app
   Password: <strong-password>
   Role: readWrite@ecohub
   ```

3. **Connection String**:
   ```
   mongodb+srv://ecohub-app:<password>@cluster0.xxxxx.mongodb.net/ecohub?retryWrites=true&w=majority
   ```

4. **Backup Configuration**:
   - Enable continuous backup
   - Set retention period: 7-30 days
   - Configure backup schedule

---

### Self-Hosted MongoDB

#### Replica Set Configuration

```yaml
# docker-compose-mongodb.yml
version: '3.8'

services:
  mongo1:
    image: mongo:7
    command: mongod --replSet rs0 --bind_ip_all
    volumes:
      - mongo1_data:/data/db
    ports:
      - "27017:27017"

  mongo2:
    image: mongo:7
    command: mongod --replSet rs0 --bind_ip_all
    volumes:
      - mongo2_data:/data/db
    ports:
      - "27018:27017"

  mongo3:
    image: mongo:7
    command: mongod --replSet rs0 --bind_ip_all
    volumes:
      - mongo3_data:/data/db
    ports:
      - "27019:27017"

volumes:
  mongo1_data:
  mongo2_data:
  mongo3_data:
```

#### Initialize Replica Set

```javascript
// mongo-init.js
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo1:27017" },
    { _id: 1, host: "mongo2:27017" },
    { _id: 2, host: "mongo3:27017" }
  ]
})
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
    
    - name: Install dependencies
      run: |
        cd ecohub-unified
        npm ci
    
    - name: Run tests
      run: |
        cd ecohub-unified
        npm test
    
    - name: Build application
      run: |
        cd ecohub-unified
        npm run build
    
    - name: Build Docker image
      run: docker build -t ecohub-platform:${{ github.sha }} .
    
    - name: Login to Container Registry
      run: echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
    
    - name: Push Docker image
      run: |
        docker tag ecohub-platform:${{ github.sha }} your-registry/ecohub-platform:latest
        docker push your-registry/ecohub-platform:latest
    
    - name: Deploy to Kubernetes
      uses: azure/k8s-deploy@v1
      with:
        manifests: |
          k8s/deployment.yaml
          k8s/service.yaml
        images: |
          your-registry/ecohub-platform:${{ github.sha }}
```

---

## Monitoring & Maintenance

### Health Checks

```bash
# Application health
curl https://ecohub.com/api/health

# Expected response
{
  "status": "healthy",
  "timestamp": "2026-01-06T12:00:00.000Z",
  "services": {
    "conservation": "active",
    "energy": "active",
    "transport": "active",
    "waste": "active"
  }
}
```

### Monitoring Setup

#### Prometheus + Grafana

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'ecohub'
    static_configs:
      - targets: ['ecohub:4000']
```

#### Application Monitoring

- **New Relic**: Full-stack monitoring
- **Datadog**: Infrastructure and APM
- **Sentry**: Error tracking
- **CloudWatch**: AWS native monitoring

---

## Disaster Recovery

### Backup Strategy

```bash
# Daily MongoDB backup
mongodump --uri="mongodb+srv://..." --out=/backups/$(date +%Y%m%d)

# Weekly full backup
tar -czf backup-$(date +%Y%m%d).tar.gz /backups /config

# Upload to S3
aws s3 cp backup-$(date +%Y%m%d).tar.gz s3://ecohub-backups/
```

### Recovery Procedures

```bash
# Restore from backup
mongorestore --uri="mongodb+srv://..." /backups/20260106

# Rollback deployment
kubectl rollout undo deployment/ecohub-deployment
```

---

## Post-Deployment Checklist

- [ ] DNS configured and propagated
- [ ] SSL/TLS certificates installed
- [ ] Environment variables set
- [ ] Database connection verified
- [ ] Health checks passing
- [ ] Monitoring enabled
- [ ] Backups configured
- [ ] Logs collection enabled
- [ ] Security scan completed
- [ ] Performance testing completed
- [ ] Documentation updated
- [ ] Team notified

---

*Last Updated: January 2026*
