# DragFolio Deployment Guide

This guide will walk you through deploying the DragFolio application with:
- Frontend: Netlify
- Backend: Vercel
- Database: MongoDB Atlas

## Prerequisites

1. Accounts on:
   - [Netlify](https://www.netlify.com/)
   - [Vercel](https://vercel.com/)
   - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (for database)
   - [GitHub](https://github.com/) (for version control)

2. Your project code pushed to a GitHub repository

## Step 1: Deploy Backend to Vercel

1. **Prepare your backend for Vercel deployment**:
   - We've already added a `vercel.json` file to your server directory
   - This file configures Vercel to properly handle your Node.js application

2. **Deploy to Vercel**:
   - Log in to your Vercel account
   - Click "New Project"
   - Import your GitHub repository
   - Configure the project:
     - Root Directory: `server`
     - Framework Preset: `Other`
   - Add Environment Variables:
     - `DATABASE_URL`: Your MongoDB connection string
     - `SESSION_SECRET`: A secure random string for session encryption
     - `NODE_ENV`: Set to `production`
     - `ALLOWED_ORIGINS`: Comma-separated list of allowed frontend domains (e.g., `https://dragfolio.netlify.app,https://your-custom-domain.com`)
     - `PORT`: Leave this blank (Vercel will handle it)
   - Click "Deploy"

3. **Note your API URL**:
   - After deployment, Vercel will provide you with a URL (e.g., `https://dragfolio-api.vercel.app`)
   - This is your backend API URL that the frontend will connect to

## Step 2: Update Frontend Configuration

1. **Update the production environment variables**:
   - Edit the `.env.production` file in your client directory
   - Replace the placeholder URL with your actual Vercel deployment URL:
   ```
   VITE_API_URL=https://your-vercel-app-name.vercel.app/api
   ```

2. **Update CORS configuration in backend** (already done):
   - We've updated the CORS configuration in your server to allow requests from your Netlify domain
   - Make sure to replace `https://dragfolio.netlify.app` and `https://your-custom-domain.com` with your actual domains

## Step 3: Deploy Frontend to Netlify

1. **Prepare your frontend for Netlify deployment**:
   - We've already added a `netlify.toml` file to your client directory
   - This file configures Netlify to properly handle your React application and routing

2. **Deploy to Netlify**:
   - Log in to your Netlify account
   - Click "New site from Git"
   - Connect to your GitHub repository
   - Configure the build settings:
     - Base directory: `client`
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Add Environment Variables:
     - `VITE_API_URL`: Your Vercel backend URL (e.g., `https://dragfolio-api.vercel.app/api`)
   - Click "Deploy site"

3. **Set up a custom domain (optional)**:
   - In your Netlify site settings, go to "Domain management"
   - Add your custom domain and follow the instructions to configure DNS

## Step 4: Test Your Deployment

1. **Test the frontend**:
   - Visit your Netlify URL (e.g., `https://dragfolio.netlify.app`)
   - Verify that the application loads correctly
   - Test user authentication and other features

2. **Monitor for errors**:
   - Check the Netlify and Vercel deployment logs for any errors
   - Use browser developer tools to identify any frontend issues
   - Check the Vercel function logs for backend errors

## Troubleshooting

### CORS Issues
If you encounter CORS errors:
1. Verify that your backend CORS configuration includes your Netlify domain
2. Check that your frontend is using the correct API URL
3. Ensure that your API requests include the necessary credentials

### Database Connection Issues
If your backend can't connect to MongoDB:
1. Verify your MongoDB Atlas connection string in Vercel environment variables
2. Check that your IP whitelist in MongoDB Atlas includes Vercel's IP ranges
3. Ensure your MongoDB user has the correct permissions

### Build Errors
If your build fails:
1. Check the build logs for specific errors
2. Verify that all dependencies are correctly listed in package.json
3. Ensure that your environment variables are correctly set

## Maintenance and Updates

When you need to update your application:
1. Push changes to your GitHub repository
2. Netlify and Vercel will automatically rebuild and deploy your changes
3. Monitor the deployment logs for any issues

## Performance Optimization

Your application has been configured with several performance optimizations:
- Code splitting and lazy loading
- Asset minification and compression
- Caching strategies for API requests
- Optimized build configuration

## Security Considerations

- Keep your environment variables secure and never commit them to your repository
- Regularly update your dependencies to patch security vulnerabilities
- Consider enabling Netlify's and Vercel's security headers
- Implement rate limiting for your API endpoints to prevent abuse
