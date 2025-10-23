# 📂 Complete Project Structure & Sitemap

## 🗂️ Root Directory

```
moviesmod-replica/
├── backend/              # Backend API Server
├── website/              # Public Website (Next.js)
├── admin/                # Admin Panel (Next.js)
├── README.md             # Main documentation
├── QUICK_START.md        # Quick setup guide
└── PROJECT_STRUCTURE.md  # This file
```

---

## 🔧 Backend (Express.js API)

```
backend/
├── models/                      # Database Models (Mongoose Schemas)
│   ├── Movie.js                # Movie schema with all fields
│   ├── Category.js             # Category schema
│   ├── Feedback.js             # User feedback/reviews schema
│   ├── User.js                 # Admin user schema
│   └── AdSlot.js               # AdSense slot schema
│
├── routes/                      # API Route Handlers
│   ├── movies.js               # Public movie endpoints
│   │   └── GET /api/movies                    # Get all movies (filtered, paginated)
│   │   └── GET /api/movies/trending           # Get trending movies
│   │   └── GET /api/movies/search-suggestions # Search autocomplete
│   │   └── GET /api/movies/:slug              # Get single movie
│   │   └── GET /api/movies/:slug/related      # Get related movies
│   │
│   ├── categories.js           # Public category endpoints
│   │   └── GET /api/categories                # Get all categories
│   │   └── GET /api/categories/:slug          # Get single category
│   │
│   ├── feedback.js             # Public feedback endpoints
│   │   └── POST /api/feedback                 # Submit feedback
│   │   └── GET /api/feedback/:movieId         # Get approved feedback
│   │
│   ├── auth.js                 # Authentication endpoints
│   │   └── POST /api/auth/register            # Register admin user
│   │   └── POST /api/auth/login               # Login
│   │   └── GET /api/auth/me                   # Get current user
│   │
│   ├── admin.js                # Admin CRUD endpoints (Protected)
│   │   ├── Movies Management
│   │   │   └── GET /api/admin/movies          # Get all movies (including drafts)
│   │   │   └── POST /api/admin/movies         # Create movie
│   │   │   └── PUT /api/admin/movies/:id      # Update movie
│   │   │   └── DELETE /api/admin/movies/:id   # Delete movie
│   │   │
│   │   ├── Category Management
│   │   │   └── GET /api/admin/categories      # Get all categories
│   │   │   └── POST /api/admin/categories     # Create category
│   │   │   └── PUT /api/admin/categories/:id  # Update category
│   │   │   └── DELETE /api/admin/categories/:id # Delete category
│   │   │
│   │   ├── Feedback Management
│   │   │   └── GET /api/admin/feedback        # Get all feedback
│   │   │   └── PUT /api/admin/feedback/:id/status # Update status
│   │   │   └── DELETE /api/admin/feedback/:id # Delete feedback
│   │   │
│   │   └── Ad Slot Management
│   │       └── GET /api/admin/ad-slots        # Get all ad slots
│   │       └── POST /api/admin/ad-slots       # Create ad slot
│   │       └── PUT /api/admin/ad-slots/:id    # Update ad slot
│   │       └── DELETE /api/admin/ad-slots/:id # Delete ad slot
│   │
│   └── analytics.js            # Analytics endpoints (Protected)
│       └── GET /api/analytics/dashboard       # Dashboard statistics
│       └── GET /api/analytics/movies/:id      # Movie-specific analytics
│
├── middleware/                  # Custom Middleware
│   ├── auth.js                 # JWT verification & authorization
│   └── validation.js           # Request validation handler
│
├── uploads/                     # Uploaded files (auto-created)
├── .env.example                # Example environment variables
├── .env                        # Your environment variables (create this)
├── .gitignore                  # Git ignore rules
├── package.json                # Dependencies and scripts
├── server.js                   # Express app entry point
└── README.md                   # Backend documentation
```

**Key Files Explained:**
- `server.js`: Main entry point, sets up Express, middleware, and routes
- `models/*.js`: Define database schemas and methods
- `routes/*.js`: Handle HTTP requests and responses
- `middleware/auth.js`: Protect routes and check user roles

---

## 🌐 Website (Public Next.js App)

```
website/
├── components/                  # React Components
│   ├── Layout/                 # Layout Components
│   │   ├── Header.js           # Top navigation with search
│   │   ├── Footer.js           # Footer with links
│   │   └── Layout.js           # Main layout wrapper
│   │
│   ├── Movies/                 # Movie Components
│   │   ├── MovieCard.js        # Single movie card
│   │   └── MovieGrid.js        # Grid of movie cards
│   │
│   ├── Search/                 # Search Components
│   │   └── SearchBar.js        # Search with autocomplete
│   │
│   ├── Feedback/               # Feedback Components
│   │   ├── FeedbackForm.js     # Submit review form
│   │   └── FeedbackList.js     # Display reviews
│   │
│   ├── AdSense/                # AdSense Components
│   │   └── AdUnit.js           # Google AdSense ad unit
│   │
│   └── UI/                     # UI Components
│       ├── Pagination.js       # Pagination controls
│       └── FilterBar.js        # Filter and sort controls
│
├── pages/                       # Next.js Pages (Routes)
│   ├── _app.js                 # App wrapper
│   ├── _document.js            # HTML document with AdSense script
│   ├── index.js                # Homepage (/)
│   │   └── Shows: Featured movies, filters, pagination
│   │
│   ├── movie/
│   │   └── [slug].js           # Movie detail page (/movie/movie-name)
│   │       └── Shows: Full details, trailer, download links, feedback
│   │
│   ├── category/
│   │   └── [slug].js           # Category page (/category/bollywood)
│   │       └── Shows: Movies in category
│   │
│   ├── search.js               # Search results (/search?q=query)
│   │   └── Shows: Search results
│   │
│   └── trending.js             # Trending movies (/trending)
│       └── Shows: Most viewed movies
│
├── lib/                         # Utility Libraries
│   ├── api.js                  # API client and endpoints
│   ├── seo.js                  # SEO utilities and schema generators
│   └── utils.js                # Helper functions
│
├── styles/                      # Styles
│   └── globals.css             # Global CSS with Tailwind
│
├── public/                      # Static Assets
│   ├── favicon.ico             # Favicon
│   └── images/                 # Static images
│
├── .env.local.example          # Example environment variables
├── .env.local                  # Your environment variables (create this)
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # TailwindCSS configuration
├── postcss.config.js           # PostCSS configuration
├── package.json                # Dependencies and scripts
└── README.md                   # Website documentation
```

**Key Files Explained:**
- `pages/index.js`: Homepage with movie grid
- `pages/movie/[slug].js`: Dynamic movie detail page
- `components/Layout/Layout.js`: Wraps all pages with header/footer
- `lib/api.js`: All API calls to backend
- `lib/seo.js`: Generates schema markup for SEO

---

## 🔐 Admin Panel (Admin Next.js App)

```
admin/
├── components/                  # React Components
│   └── Layout/                 # Layout Components
│       ├── Sidebar.js          # Left navigation sidebar
│       ├── Header.js           # Top header bar
│       └── Layout.js           # Main layout wrapper with auth
│
├── pages/                       # Next.js Pages (Routes)
│   ├── _app.js                 # App wrapper with AuthProvider
│   ├── login.js                # Login page (/login)
│   │   └── Shows: Login form
│   │
│   ├── dashboard.js            # Dashboard (/dashboard)
│   │   └── Shows: Statistics, charts, recent activity
│   │
│   ├── movies/
│   │   ├── index.js            # Movies list (/movies)
│   │   │   └── Shows: All movies table with actions
│   │   ├── create.js           # Create movie (/movies/create)
│   │   │   └── Shows: Movie creation form
│   │   └── edit/
│   │       └── [id].js         # Edit movie (/movies/edit/123)
│   │           └── Shows: Movie edit form
│   │
│   ├── categories/
│   │   └── index.js            # Categories (/categories)
│   │       └── Shows: Categories table with CRUD
│   │
│   ├── feedback/
│   │   └── index.js            # Feedback moderation (/feedback)
│   │       └── Shows: All feedback with approve/reject
│   │
│   ├── ad-slots/
│   │   └── index.js            # Ad slots (/ad-slots)
│   │       └── Shows: AdSense slot management
│   │
│   └── analytics/
│       └── index.js            # Analytics (/analytics)
│           └── Shows: Detailed analytics and reports
│
├── context/                     # React Context
│   └── AuthContext.js          # Authentication state management
│
├── lib/                         # Utility Libraries
│   ├── api.js                  # API client with auth interceptors
│   └── utils.js                # Helper functions
│
├── styles/                      # Styles
│   └── globals.css             # Global CSS with Tailwind
│
├── .env.local.example          # Example environment variables
├── .env.local                  # Your environment variables (create this)
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # TailwindCSS configuration
├── package.json                # Dependencies and scripts
└── README.md                   # Admin documentation
```

**Key Files Explained:**
- `pages/login.js`: Login page (public)
- `pages/dashboard.js`: Main dashboard with analytics
- `context/AuthContext.js`: Manages authentication state
- `components/Layout/Layout.js`: Protects routes, shows sidebar
- `lib/api.js`: API client with JWT token handling

---

## 🔄 Data Flow

### Website Flow
```
User → Website (Next.js) → Backend API → MongoDB
                ↓
         SEO Optimized Pages
         AdSense Ads
         User Feedback
```

### Admin Flow
```
Admin → Login → Admin Panel (Next.js) → Backend API (Protected) → MongoDB
                      ↓
              Dashboard Analytics
              CRUD Operations
              Content Management
```

---

## 🎯 What Each Folder Does

### Backend
**Purpose**: Provides REST API for both website and admin panel
- Handles all database operations
- Authenticates admin users
- Serves uploaded images
- Validates all inputs
- Protects admin routes

### Website
**Purpose**: Public-facing movie streaming website
- Displays movies to users
- Allows searching and filtering
- Shows movie details
- Collects user feedback
- Optimized for SEO and performance

### Admin
**Purpose**: Content management system for admins
- Manages all movies and categories
- Moderates user feedback
- Configures AdSense placements
- Views analytics and statistics
- Role-based access control

---

## 📊 Database Collections

MongoDB will have these collections:

1. **movies**: All movie data
2. **categories**: Movie categories
3. **feedbacks**: User reviews and ratings
4. **users**: Admin users
5. **adslots**: AdSense ad configurations

---

## 🚀 Port Configuration

- **Backend**: Port 5000
- **Website**: Port 3000
- **Admin**: Port 3001
- **MongoDB**: Port 27017 (default)

---

## 📝 Environment Files

Each folder needs its own `.env` file:

1. **backend/.env**: Database, JWT, CORS settings
2. **website/.env.local**: API URL, site info, AdSense
3. **admin/.env.local**: API URL, admin name

---

## 🔗 How Components Connect

```
┌─────────────┐
│   MongoDB   │
└──────┬──────┘
       │
┌──────▼──────┐
│   Backend   │ ← Express API (Port 5000)
│   (API)     │
└──┬───────┬──┘
   │       │
   │       │
┌──▼───┐ ┌─▼──────┐
│Website│ │ Admin  │
│(3000) │ │ (3001) │
└───────┘ └────────┘
```

---

## 📚 Key Technologies Used

### Backend
- Express.js (Web framework)
- Mongoose (MongoDB ODM)
- JWT (Authentication)
- Multer (File uploads)
- Helmet (Security)

### Frontend (Website & Admin)
- Next.js (React framework)
- TailwindCSS (Styling)
- Axios (HTTP client)
- React Icons (Icons)
- Recharts (Charts - Admin only)

---

This structure ensures:
- ✅ Clean separation of concerns
- ✅ Easy maintenance
- ✅ Scalable architecture
- ✅ Security best practices
- ✅ SEO optimization
- ✅ Performance optimization

---

**Need help navigating? Check the README files in each folder!**
