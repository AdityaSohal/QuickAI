# QuickAI - AI-Powered Content Generation Platform

A full-stack web application that provides various AI-powered tools for content generation, image processing, and document analysis.

## Features

- **Article Generation**: Create comprehensive articles on any topic
- **Blog Title Generation**: Generate catchy, SEO-friendly blog titles
- **AI Image Generation**: Create images from text descriptions
- **Background Removal**: Remove backgrounds from images automatically
- **Object Removal**: Remove specific objects from images
- **Resume Review**: Get AI-powered feedback on your resume
- **User Authentication**: Secure authentication with Clerk
- **Premium Features**: Advanced features for premium users

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hot Toast
- Lucide React Icons
- Clerk Authentication

### Backend
- Node.js
- Express.js
- OpenAI API
- Cloudinary (Image processing)
- Clerk Authentication
- Multer (File uploads)
- PDF Parse

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Clerk account for authentication
- OpenAI API key
- Cloudinary account
- Clipdrop API key (for image generation)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd QuickAI
```

### 2. Server Setup
```bash
cd server
npm install
```

Create a `.env` file in the server directory:
```env
# Server Configuration
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Clerk Authentication
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# AI APIs
OPENAI_API_KEY=your_openai_api_key_here
CLIPDROP_API_KEY=your_clipdrop_api_key_here

# Database
DATABASE_URL=your_database_url_here
```

### 3. Client Setup
```bash
cd ../client
npm install
```

Create a `.env` file in the client directory:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
VITE_BASE_URL=http://localhost:3000
```

### 4. Start the Application

In the server directory:
```bash
npm run server
```

In the client directory (new terminal):
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Health Check: http://localhost:3000/health

## API Endpoints

### Protected Routes (Require Authentication)
- `POST /api/ai/write-article` - Generate articles
- `POST /api/ai/blog-titles` - Generate blog titles
- `POST /api/ai/generate-images` - Generate AI images (Premium)
- `POST /api/ai/remove-background` - Remove image backgrounds (Premium)
- `POST /api/ai/remove-object` - Remove objects from images (Premium)
- `POST /api/ai/review-resume` - Review resumes (Premium)

## Environment Variables

### Server (.env)
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `CLIENT_URL`: Frontend URL for CORS
- `CLERK_SECRET_KEY`: Clerk secret key for authentication
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret
- `OPENAI_API_KEY`: OpenAI API key for text generation
- `CLIPDROP_API_KEY`: Clipdrop API key for image generation
- `DATABASE_URL`: Database connection string

### Client (.env)
- `VITE_CLERK_PUBLISHABLE_KEY`: Clerk publishable key
- `VITE_BASE_URL`: Backend API URL

## Project Structure

```
QuickAI/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   └── assets/        # Static assets
│   └── public/            # Public assets
├── server/                # Backend Node.js application
│   ├── configs/          # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── routes/           # API routes
│   └── uploads/          # File uploads directory
└── README.md
```

## Features by User Plan

### Free Plan
- Article generation (limited to 10 uses)
- Blog title generation (limited to 10 uses)

### Premium Plan
- Unlimited article generation
- Unlimited blog title generation
- AI image generation
- Background removal
- Object removal
- Resume review

## Error Handling

The application includes comprehensive error handling:
- Input validation
- File size limits
- File type validation
- API error handling
- User-friendly error messages
- Toast notifications

## Security Features

- JWT-based authentication with Clerk
- File upload validation
- CORS configuration
- Rate limiting (via Clerk)
- Input sanitization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the repository or contact the development team. 