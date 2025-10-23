# 🎬 MoviesHub - Backend API

A robust and scalable backend API for the MoviesHub platform, built with Node.js, Express, and MongoDB.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Security](#security)

## ✨ Features

- **Movie Management**: Full CRUD operations for movies
- **Category System**: Organize movies by categories
- **User Feedback**: Allow users to submit and rate movies
- **Admin Authentication**: JWT-based authentication with role-based access control
- **Ad Management**: Manage Google AdSense ad slots
- **Analytics**: Comprehensive analytics dashboard
- **Search & Filter**: Advanced search with autocomplete and filtering
- **File Upload**: Image upload for movie posters
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Comprehensive input sanitization

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **File Upload**: Multer
- **Security**: Helmet, CORS, bcryptjs
- **Logging**: Morgan

## 📁 Project Structure

```
backend/
├── models/                 # Database models
│   ├── Movie.js           # Movie schema with full details
│   ├── Category.js        # Category schema
│   ├── Feedback.js        # User feedback/reviews schema
│   ├── User.js            # Admin user schema
│   └── AdSlot.js          # AdSense slot schema
│
├── routes/                # API route handlers
│   ├── movies.js          # Movie endpoints (public)
│   ├── categories.js      # Category endpoints (public)
│   ├── feedback.js        # Feedback endpoints (public)
│   ├── auth.js            # Authentication endpoints
│   ├── admin.js           # Admin management endpoints (protected)
│   └── analytics.js       # Analytics endpoints (protected)
│
├── middleware/            # Custom middleware
│   ├── auth.js            # JWT verification & authorization
│   └── validation.js      # Request validation handler
│
├── uploads/               # Uploaded files (created automatically)
├── .env                   # Environment variables (create from .env.example)
├── .env.example           # Example environment variables
├── .gitignore             # Git ignore rules
├── package.json           # Dependencies and scripts
├── server.js              # Express app entry point
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

### Installation

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   # Copy the example env file
   cp .env.example .env
   
   # Edit .env and add your values
   # Required: MONGODB_URI, JWT_SECRET
   ```

4. **Start MongoDB**:
   ```bash
   # Make sure MongoDB is running
   mongod
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:5000`

6. **Create an admin user** (First time only):
   ```bash
   # Use a tool like Postman or curl to register an admin
   POST http://localhost:5000/api/auth/register
   
   Body:
   {
     "name": "Admin User",
     "email": "admin@example.com",
     "password": "secure_password",
     "role": "admin"
   }
   ```

### Production Deployment

```bash
npm start
```

## 📡 API Documentation

### Public Endpoints

#### Movies

- `GET /api/movies` - Get all published movies (with pagination & filters)
  - Query params: `page`, `limit`, `category`, `genre`, `year`, `quality`, `search`, `sort`
- `GET /api/movies/trending` - Get trending movies
- `GET /api/movies/search-suggestions?q=query` - Get search suggestions
- `GET /api/movies/:slug` - Get single movie by slug
- `GET /api/movies/:slug/related` - Get related movies

#### Categories

- `GET /api/categories` - Get all active categories
- `GET /api/categories/:slug` - Get single category

#### Feedback

- `POST /api/feedback` - Submit feedback for a movie
- `GET /api/feedback/:movieId` - Get approved feedback for a movie

#### Authentication

- `POST /api/auth/register` - Register new admin user
- `POST /api/auth/login` - Login admin user
- `GET /api/auth/me` - Get current logged-in user (Protected)

### Protected Endpoints (Admin)

All admin endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

#### Movie Management

- `GET /api/admin/movies` - Get all movies (including drafts)
- `POST /api/admin/movies` - Create new movie
- `PUT /api/admin/movies/:id` - Update movie
- `DELETE /api/admin/movies/:id` - Delete movie

#### Category Management

- `GET /api/admin/categories` - Get all categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category

#### Feedback Management

- `GET /api/admin/feedback` - Get all feedback
- `PUT /api/admin/feedback/:id/status` - Update feedback status
- `DELETE /api/admin/feedback/:id` - Delete feedback

#### Ad Slot Management

- `GET /api/admin/ad-slots` - Get all ad slots
- `POST /api/admin/ad-slots` - Create ad slot
- `PUT /api/admin/ad-slots/:id` - Update ad slot
- `DELETE /api/admin/ad-slots/:id` - Delete ad slot

#### Analytics

- `GET /api/analytics/dashboard` - Get dashboard statistics
- `GET /api/analytics/movies/:id` - Get analytics for specific movie

## 🔐 Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/moviesmod

# JWT Secret (CHANGE THIS!)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001

# File Upload
MAX_FILE_SIZE=10485760
```

## 🔒 Security

This API implements several security best practices:

- **Helmet**: Sets secure HTTP headers
- **CORS**: Configured for specific origins
- **Rate Limiting**: Prevents API abuse (100 requests per 15 minutes)
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs with salt rounds
- **Input Validation**: express-validator for all inputs
- **Role-Based Access Control**: Different permissions for admin, editor, moderator
- **File Upload Validation**: Only allows specific file types and sizes

### Role Permissions

- **Admin**: Full access to all features
- **Editor**: Can manage movies and categories
- **Moderator**: Can manage feedback and view analytics

## 🧪 Testing

Health check endpoint:
```bash
GET http://localhost:5000/health
```

Response:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

## 📝 Notes

1. **First Run**: Create an admin user using the registration endpoint
2. **File Uploads**: Uploaded files are stored in the `uploads/` directory
3. **MongoDB Indexes**: The application creates necessary indexes automatically
4. **Rate Limiting**: Adjust in `server.js` if needed for your use case
5. **CORS**: Update `FRONTEND_URL` and `ADMIN_URL` for production

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check MONGODB_URI in .env file
- Verify network connectivity

### JWT Errors
- Ensure JWT_SECRET is set in .env
- Check token expiration
- Verify Authorization header format

### File Upload Issues
- Check MAX_FILE_SIZE limit
- Ensure uploads/ directory has write permissions
- Verify file type is allowed (images only)

## 📞 Support

For issues and questions, please check the main project README or create an issue in the repository.

---

**Built with ❤️ for high-performance movie streaming platforms**
