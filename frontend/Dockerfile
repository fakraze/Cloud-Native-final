# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
RUN npm install @heroicons/react
COPY . .

# Build arguments for environment configuration
ARG BUILD_MODE=production
ARG VITE_BASE_PATH=/dev/frontend/
ARG VITE_API_URL=http://13.218.27.133/dev/backend/api
ARG VITE_NODE_ENV=production
ARG VITE_USE_MOCK_API=false

# Set environment variables for build
ENV VITE_BASE_PATH=$VITE_BASE_PATH
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_NODE_ENV=$VITE_NODE_ENV
ENV VITE_USE_MOCK_API=$VITE_USE_MOCK_API

RUN npm run build -- --mode $BUILD_MODE

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
