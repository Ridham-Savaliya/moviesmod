# 🎬 MoviesHub - Admin Panel

A powerful, secure admin dashboard for managing the MoviesHub platform. Built with Next.js, React, and TailwindCSS.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [User Roles](#user-roles)
- [Features Guide](#features-guide)

## ✨ Features

- **Secure Authentication**: JWT-based login with role-based access control
- **Dashboard Analytics**: Comprehensive statistics and charts
- **Movie Management**: Full CRUD operations for movies
- **Category Management**: Create and manage movie categories
- **Feedback Moderation**: Approve, reject, or delete user reviews
- **Ad Slot Management**: Manage Google AdSense ad placements
- **Analytics**: View detailed analytics for movies and site performance
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Instant feedback on all actions

## 🛠 Tech Stack

- **Framework**: Next.js 14 (React 18)
- **Styling**: TailwindCSS
- **Charts**: Recharts
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Notifications**: React Toastify
- **Icons**: React Icons

## 📁 Project Structure

```
admin/
├── components/              # React components
│   └── Layout/             # Layout components
│       ├── Sidebar.js      # Navigation sidebar
│       ├── Header.js       # Top header bar
│       └── Layout.js       # Main layout wrapper
│
├── pages/                  # Next.js pages (routes)
│   ├── _app.js            # App wrapper with AuthProvider
│   ├── login.js           # Login page
│   ├── dashboard.js       # Dashboard with analytics
│   ├── movies/
│   │   ├── index.js       # Movies list
│   │   ├── create.js      # Create movie form
│   │   └── edit/[id].js   # Edit movie form
│   ├── categories/
│   │   └── index.js       # Categories management
│   ├── feedback/
│   │   └── index.js       # Feedback moderation
│   ├── ad-slots/
│   │   └── index.js       # Ad slots management
│   └── analytics/
│       └── index.js       # Detailed analytics
│
├── context/                # React context
│   └── AuthContext.js     # Authentication context
│
├── lib/                    # Utility libraries
│   ├── api.js             # API client with interceptors
│   └── utils.js           # Helper functions
│
├── styles/                 # Global styles
│   └── globals.css        # Global CSS with Tailwind
│
├── .env.local.example     # Example environment variables
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # TailwindCSS configuration
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Backend API** running (see backend README)
- **Admin user account** created via backend API

### Installation

1. **Navigate to the admin directory**:
   ```bash
   cd admin
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   # Copy the example env file
   cp .env.local.example .env.local
   
   # Edit .env.local with your values
   ```

4. **Configure environment variables** in `.env.local`:
   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:5000/api

   # Site Configuration
   NEXT_PUBLIC_ADMIN_NAME=MoviesHub Admin
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

   The admin panel will be available at `http://localhost:3001`

### Creating Admin Account

Before logging in, you need to create an admin account via the backend API:

```bash
# Using curl
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "secure_password",
    "role": "admin"
  }'
```

Or use Postman/Insomnia to make the request.

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 👥 User Roles

The admin panel supports three user roles with different permissions:

### Admin
- **Full Access**: Can perform all operations
- Create, edit, and delete movies
- Manage categories
- Moderate feedback
- Manage ad slots
- View analytics
- Manage other users (future feature)

### Editor
- **Content Management**: Can manage movies and categories
- Create, edit, and delete movies
- Manage categories
- View analytics
- **Cannot**: Manage ad slots or users

### Moderator
- **Content Moderation**: Can moderate user-generated content
- Approve/reject/delete feedback
- View analytics
- **Cannot**: Manage movies, categories, ad slots, or users

## 📚 Features Guide

### Dashboard

The dashboard provides an overview of your platform:
- **Statistics Cards**: Total movies, published movies, categories, views, and pending feedback
- **Most Viewed Movies**: Top 5 movies by view count
- **Movies by Category**: Bar chart showing distribution
- **Recent Movies**: Latest added movies with status
- **Recent Feedback**: Latest user reviews

### Movie Management

#### Adding a Movie

1. Click "Add Movie" button
2. Fill in the form:
   - **Basic Info**: Title, description, release year
   - **Media**: Upload poster image, add trailer URL
   - **Classification**: Select category, genres, quality
   - **Details**: Cast, director, language, duration
   - **Download Links**: Add multiple download links with quality and size
   - **SEO**: Meta title, description, and keywords
   - **Status**: Draft, Published, or Archived

3. Click "Create Movie"

#### Editing a Movie

1. Go to Movies page
2. Click edit icon on the movie you want to edit
3. Update the fields
4. Click "Update Movie"

#### Deleting a Movie

1. Go to Movies page
2. Click delete icon on the movie
3. Confirm deletion

### Category Management

1. Go to Categories page
2. View all categories in a table
3. **Add Category**: Click "Add Category", fill form, submit
4. **Edit Category**: Click edit icon, update fields, save
5. **Delete Category**: Click delete icon (only if no movies use it)

### Feedback Moderation

1. Go to Feedback page
2. View all user feedback with filters
3. **Approve**: Click approve to make feedback visible on website
4. **Reject**: Click reject to hide feedback
5. **Delete**: Click delete to permanently remove feedback

### Ad Slot Management

1. Go to Ad Slots page (Admin only)
2. View all ad slots
3. **Add Ad Slot**:
   - Enter name and position
   - Paste AdSense ad code
   - Set dimensions (optional)
   - Set order for display
4. **Edit Ad Slot**: Update ad code or settings
5. **Delete Ad Slot**: Remove ad placement

### Analytics

View detailed analytics:
- **Overview**: Key metrics and trends
- **Movie Performance**: Individual movie statistics
- **Category Distribution**: Movies per category
- **Feedback Trends**: User engagement metrics
- **Traffic Analysis**: Views over time

## 🔒 Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **Protected Routes**: All admin routes require authentication
3. **Role-Based Access**: Different permissions for different roles
4. **Auto Logout**: Automatic logout on token expiration
5. **Secure API Calls**: All API calls include auth token
6. **Input Validation**: Client-side and server-side validation
7. **HTTPS Ready**: Secure in production environments

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to customize colors:

```javascript
colors: {
  primary: {
    500: '#3b82f6', // Main brand color
    // ... other shades
  }
}
```

### Branding

Update logo and site name in:
- `components/Layout/Sidebar.js`
- `pages/login.js`
- `.env.local` (NEXT_PUBLIC_ADMIN_NAME)

## 📱 Responsive Design

The admin panel is fully responsive:
- **Mobile**: Collapsible sidebar, touch-friendly controls
- **Tablet**: Optimized layout for medium screens
- **Desktop**: Full sidebar, multi-column layouts

## 🐛 Troubleshooting

### Cannot Login
- Verify backend API is running
- Check NEXT_PUBLIC_API_URL in .env.local
- Ensure admin account is created
- Check browser console for errors

### API Errors
- Verify backend is accessible
- Check CORS settings in backend
- Ensure JWT token is valid
- Check network tab in browser dev tools

### Images Not Uploading
- Check backend uploads directory permissions
- Verify MAX_FILE_SIZE in backend .env
- Ensure file is an image (jpg, png, gif, webp)
- Check file size (default limit: 10MB)

### Build Errors
- Clear .next folder: `rm -rf .next`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for syntax errors in code

## 🔧 Development Tips

### Hot Reload
The development server supports hot reload. Changes to files will automatically refresh the browser.

### API Testing
Use the browser's Network tab to inspect API calls and responses.

### State Management
The admin panel uses React Context for authentication state. Consider adding Redux or Zustand for more complex state management.

### Form Validation
Forms use React Hook Form for validation. Add custom validation rules in form components.

## 📊 Performance

### Optimization Tips

1. **Image Optimization**: Use Next.js Image component
2. **Code Splitting**: Lazy load heavy components
3. **Caching**: Implement API response caching
4. **Pagination**: Always paginate large lists
5. **Debouncing**: Debounce search inputs

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Other Platforms

Can be deployed to:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Any Node.js hosting

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |
| `NEXT_PUBLIC_ADMIN_NAME` | Admin panel name | No |

## 🔗 API Endpoints Used

The admin panel uses these backend API endpoints:

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register (for initial setup)
- `GET /api/auth/me` - Get current user

### Movies
- `GET /api/admin/movies` - Get all movies
- `POST /api/admin/movies` - Create movie
- `PUT /api/admin/movies/:id` - Update movie
- `DELETE /api/admin/movies/:id` - Delete movie

### Categories
- `GET /api/admin/categories` - Get all categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category

### Feedback
- `GET /api/admin/feedback` - Get all feedback
- `PUT /api/admin/feedback/:id/status` - Update feedback status
- `DELETE /api/admin/feedback/:id` - Delete feedback

### Ad Slots
- `GET /api/admin/ad-slots` - Get all ad slots
- `POST /api/admin/ad-slots` - Create ad slot
- `PUT /api/admin/ad-slots/:id` - Update ad slot
- `DELETE /api/admin/ad-slots/:id` - Delete ad slot

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard data
- `GET /api/analytics/movies/:id` - Get movie analytics

## 📞 Support

For issues and questions, check the main project README or create an issue in the repository.

## 🔗 Related Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
- [Recharts Documentation](https://recharts.org/)

---

**Built with ❤️ for efficient content management**
