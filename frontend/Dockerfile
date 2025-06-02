# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# ⬇️ 加入 ARG
ARG BUILD_MODE=production
ARG VITE_BASE_PATH=/

# ⬇️ Vite build，帶入環境變數
RUN VITE_BASE_PATH=$VITE_BASE_PATH npm run build -- --mode $BUILD_MODE

# Production stage
FROM nginx:alpine

# Copy the built app from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

