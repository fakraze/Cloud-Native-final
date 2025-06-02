### Method 1: Development Mode (Recommended for Development)

**Requirements:** Node.js 18+ is required for modern dependencies.

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server with hot reload
npm run dev
```

The development server will start on **http://localhost:5173** with hot module replacement enabled.

**Environment Variables:**
- Uses `.env.development` configuration
- API URL: `http://localhost:3000/api`
- Mock API: `true` (uses mock services for development)

### Method 2: Docker Container (Production Build)

If you have an older Node.js version or want to run the production build:

```bash
# Navigate to frontend directory
cd frontend

# Build Docker image
docker build -t frontend-app .

# Run container on port 3000
docker run -p 3000:80 frontend-app
```

The application will be available at **http://localhost:3000**
