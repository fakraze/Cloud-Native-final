# Build stage
FROM node:20-alpine AS build

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

# ⬇️ 設定為真正的環境變數（Vite 會用 process.env.VITE_BASE_PATH）
ENV VITE_BASE_PATH=$VITE_BASE_PATH

# ⬇️ Build 時會使用 ENV 變數
RUN npm run build -- --mode $BUILD_MODE

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

