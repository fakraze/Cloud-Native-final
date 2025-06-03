# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
RUN npm install @heroicons/react
COPY . .

ARG BUILD_MODE=production
ARG VITE_BASE_PATH=/
ARG VITE_API_BASE_URL=http://backend-service:3000/api
ENV VITE_BASE_PATH=$VITE_BASE_PATH
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build -- --mode $BUILD_MODE

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
