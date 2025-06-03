# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS prod
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=build /app/dist ./dist


ARG DB_HOST=localhost
ARG DB_PORT=3306
ARG DB_DATABASE=finaldb
ARG DB_USERNAME=finaluser
ARG DB_PASSWORD=finalpwd
ARG BACKEND_PORT=3000

ENV DB_HOST=${DB_HOST}
ENV DB_PORT=${DB_PORT}
ENV DB_DATABASE=${DB_DATABASE}
ENV DB_USERNAME=${DB_USERNAME}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV PORT=${BACKEND_PORT}

EXPOSE 3000
CMD ["npm", "run", "start:prod"]