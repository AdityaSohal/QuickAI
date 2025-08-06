# Deploying to Railway

## Prerequisites

1. Create a [Railway](https://railway.app/) account
2. Install the Railway CLI (optional): `npm i -g @railway/cli`

## Deployment Steps

### Option 1: Using the Railway Dashboard

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project" > "Deploy from GitHub repo"
3. Select your GitHub repository
4. Configure the following environment variables in the Railway dashboard:
   - `PORT`: 3000 (or your preferred port)
   - `NODE_ENV`: production
   - `CLIENT_URL`: Your frontend URL
   - `CLERK_SECRET_KEY`: Your Clerk secret key
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
   - `GEMINI_API_KEY`: Your Gemini API key
   - `CLIPDROP_API_KEY`: Your ClipDrop API key
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `DATABASE_URL`: Your database URL
5. Railway will automatically detect the `railway.json` file and deploy your application

### Option 2: Using the Railway CLI

1. Login to Railway: `railway login`
2. Link your project: `railway link`
3. Set up environment variables:
   ```
   railway variables set PORT=3000
   railway variables set NODE_ENV=production
   railway variables set CLIENT_URL=your_frontend_url
   railway variables set CLERK_SECRET_KEY=your_clerk_secret_key
   railway variables set CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   railway variables set CLOUDINARY_API_KEY=your_cloudinary_api_key
   railway variables set CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   railway variables set GEMINI_API_KEY=your_gemini_api_key
   railway variables set CLIPDROP_API_KEY=your_clipdrop_api_key
   railway variables set OPENAI_API_KEY=your_openai_api_key
   railway variables set DATABASE_URL=your_database_url
   ```
4. Deploy your application: `railway up`

## Monitoring

Once deployed, you can monitor your application using the Railway dashboard. The health check endpoint at `/health` will be used to verify that your application is running correctly.

## Troubleshooting

- If your deployment fails, check the logs in the Railway dashboard
- Ensure all required environment variables are set
- Verify that your application runs locally before deploying
- Check that your `railway.json` file is correctly configured