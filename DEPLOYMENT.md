# Deployment Guide

## Frontend (Netlify) & Backend (Render) Deployment

### Prerequisites
- GitHub repository with your code
- Netlify account
- Render account
- MongoDB Atlas database

### 1. Backend Deployment (Render)

#### Step 1: Prepare Backend
1. Copy `backend/.env.example` to `backend/.env` and fill in your values:
   ```bash
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/air?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-here
   ADMIN_EMAIL=your-admin-email@example.com
   ADMIN_PASSWORD=your-secure-admin-password
   PORT=10000
   NODE_ENV=production
   ```

#### Step 2: Deploy to Render
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the `backend` folder as root directory
5. Configure:
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: Free
6. Add Environment Variables (same as .env)
7. Click "Deploy"

#### Step 3: Get Backend URL
After deployment, note your backend URL (e.g., `https://your-app.onrender.com`)

### 2. Frontend Deployment (Netlify)

#### Step 1: Update Configuration
1. Update `netlify.toml` with your backend URL:
   ```toml
   [[redirects]]
   from = "/api/*"
   to = "https://your-backend-url.onrender.com/api/:splat"
   status = 200
   force = true
   ```

2. Update `.env.production`:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   VITE_ADMIN_EMAIL=thevolvoro@gmail.com
   VITE_ADMIN_PASSWORD=Aa12Aa12
   ```

3. Update CORS in `backend/server.js`:
   ```javascript
   origin: [
     'http://localhost:8080', 
     'http://localhost:3000',
     'https://your-netlify-site.netlify.app' // Your actual Netlify URL
   ]
   ```

#### Step 2: Deploy to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18
5. Add environment variables:
   - `VITE_API_URL`: `https://your-backend-url.onrender.com`
   - `VITE_ADMIN_EMAIL`: `thevolvoro@gmail.com`
   - `VITE_ADMIN_PASSWORD`: `Aa12Aa12`
6. Click "Deploy site"

### 3. Post-Deployment Steps

#### Backend (Render)
1. After deployment, run the create-admin script:
   - Go to Render dashboard → your service → "Shell"
   - Run: `npm run create-admin`

#### Frontend (Netlify)
1. Update CORS in backend with your actual Netlify URL
2. Redeploy backend if needed
3. Test all functionality:
   - Admin login
   - Product management
   - Shop page
   - Contact form

### 4. Troubleshooting

#### Common Issues:
1. **CORS Errors**: Ensure your Netlify URL is added to CORS origins in backend
2. **API Calls Failing**: Check that `VITE_API_URL` is correctly set in Netlify
3. **MongoDB Connection**: Verify MongoDB URI is accessible from Render
4. **Build Failures**: Check build logs for missing dependencies

#### Environment Variables:
- Frontend: Must start with `VITE_` to be exposed to browser
- Backend: Standard Node.js environment variables

### 5. Custom Domain (Optional)

#### Netlify:
1. Go to Site settings → Domain management
2. Add your custom domain
3. Update DNS records as instructed

#### Render:
1. Go to Service settings → Custom Domains
2. Add your custom domain
3. Update DNS records

### 6. Monitoring

#### Netlify:
- Check build logs in the Netlify dashboard
- Monitor site performance

#### Render:
- Monitor service logs
- Check service health
- Set up alerts if needed

## Local Development

To run locally with production-like settings:
```bash
# Frontend
npm run build
npm run preview

# Backend
cd backend
npm start
```
