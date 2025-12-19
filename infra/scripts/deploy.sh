#!/bin/bash

# Variables
AWS_REGION="us-east-1"
ACCOUNT_ID="757114473670"

# Images in ECR
BACKEND_IMAGE="$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/autoblog/backend:latest"
FRONTEND_IMAGE="$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/autoblog/frontend:latest"
POSTGRES_IMAGE="postgres:15-alpine"

# DB config
DB_NAME="autoblog"
DB_USER="postgres"
DB_PASSWORD="postgres"
DB_PORT="5432"
DB_CONTAINER_NAME="blog-db"

# Frontend config
FRONTEND_PORT="80"
BACKEND_PORT="4000"

# EC2 public IP (replace if needed)
EC2_PUBLIC_IP=34.203.199.185

# Login to ECR
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Pull latest images
docker pull $BACKEND_IMAGE
docker pull $FRONTEND_IMAGE
docker pull $POSTGRES_IMAGE

# Stop and remove old containers
docker stop backend frontend $DB_CONTAINER_NAME || true
docker rm backend frontend $DB_CONTAINER_NAME || true

# Run Postgres container
docker run -d \
  --name $DB_CONTAINER_NAME \
  -e POSTGRES_DB=$DB_NAME \
  -e POSTGRES_USER=$DB_USER \
  -e POSTGRES_PASSWORD=$DB_PASSWORD \
  -p $DB_PORT:5432 \
  $POSTGRES_IMAGE

# Wait for Postgres to be ready
echo "Waiting 10 seconds for Postgres to initialize..."
sleep 10

# Run backend container
docker run -d \
  --name backend \
  -p $BACKEND_PORT:4000 \
  -e DB_HOST=$DB_CONTAINER_NAME \
  -e DB_PORT=$DB_PORT \
  -e DB_NAME=$DB_NAME \
  -e DB_USERNAME=$DB_USER \
  -e DB_PASSWORD=$DB_PASSWORD \
  -e DB_DIALECT=postgres \
  --link $DB_CONTAINER_NAME:$DB_CONTAINER_NAME \
  $BACKEND_IMAGE

# Run frontend container
docker run -d \
  --name frontend \
  -p $FRONTEND_PORT:80 \
  -e VITE_API_URL="http://$EC2_PUBLIC_IP:$BACKEND_PORT" \
  $FRONTEND_IMAGE

echo "Deployment complete!"
echo "Backend: http://$EC2_PUBLIC_IP:$BACKEND_PORT"
echo "Frontend: http://$EC2_PUBLIC_IP:$FRONTEND_PORT"
