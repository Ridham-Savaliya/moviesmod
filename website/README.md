# 🎬 MoviesHub - Website Frontend

A modern, SEO-optimized movie streaming website built with Next.js, React, and TailwindCSS.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [SEO Optimization](#seo-optimization)
- [Performance](#performance)

## ✨ Features

- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **Movie Browsing**: Browse movies by category, genre, year, and quality
- **Advanced Search**: Real-time search with autocomplete suggestions
- **Movie Details**: Comprehensive movie pages with trailers and download links
- **User Feedback**: Submit and view movie reviews and ratings
- **Google AdSense**: Integrated ad slots for monetization
- **SEO Optimized**: Schema markup, meta tags, and sitemap ready
- **Performance**: Lazy loading, image optimization, and caching
- **Responsive**: Works perfectly on mobile, tablet, and desktop

## 🛠 Tech Stack

- **Framework**: Next.js 14 (React 18)
- **Styling**: TailwindCSS
- **Icons**: React Icons
- **HTTP Client**: Axios
- **Notifications**: React Toastify
- **Carousel**: Swiper
- **Form Controls**: React Select

## 📁 Project Structure

```
website/
├── components/              # React components
│   ├── Layout/             # Layout components
│   │   ├── Header.js       # Navigation header with search
│   │   ├── Footer.js       # Footer with links
│   │   └── Layout.js       # Main layout wrapper
│   │
│   ├── Movies/             # Movie-related components
│   │   ├── MovieCard.js    # Movie card with poster and info
│   │   └── MovieGrid.js    # Grid layout for movies
│   │
│   ├── Search/             # Search components
│   │   └── SearchBar.js    # Search with autocomplete
│   │
│   ├── Feedback/           # Feedback/review components
│   │   ├── FeedbackForm.js # Submit review form
│   │   └── FeedbackList.js # Display reviews
│   │
│   ├── AdSense/            # AdSense components
│   │   └── AdUnit.js       # Google AdSense ad unit
│   │
│   └── UI/                 # UI components
│       ├── Pagination.js   # Pagination component
│       └── FilterBar.js    # Filter and sort controls
│
├── pages/                  # Next.js pages (routes)
│   ├── _app.js            # App wrapper
│   ├── _document.js       # HTML document
│   ├── index.js           # Home page
│   ├── search.js          # Search results page
│   ├── trending.js        # Trending movies page
│   ├── movie/
│   │   └── [slug].js      # Movie detail page (dynamic)
│   └── category/
│       └── [slug].js      # Category page (dynamic)
│
├── lib/                    # Utility libraries
│   ├── api.js             # API client and endpoints
│   ├── seo.js             # SEO utilities and schema generators
│   └── utils.js           # Helper functions
│
├── styles/                 # Global styles
│   └── globals.css        # Global CSS with Tailwind
│
├── public/                 # Static assets
│   └── images/            # Images and icons
│
├── .env.local.example     # Example environment variables
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # TailwindCSS configuration
├── postcss.config.js      # PostCSS configuration
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Backend API** running (see backend README)

### Installation

1. **Navigate to the website directory**:
   ```bash
   cd website
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
   NEXT_PUBLIC_SITE_URL=http://localhost:3000

   # Google AdSense (optional)
   NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx

   # Site Configuration
   NEXT_PUBLIC_SITE_NAME=MoviesHub
   NEXT_PUBLIC_SITE_DESCRIPTION=Watch and download latest movies in HD quality
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

   The website will be available at `http://localhost:3000`

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## ⚙️ Configuration

### API Integration

The website connects to the backend API. Configure the API URL in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Google AdSense

To enable Google AdSense:

1. Get your AdSense client ID from Google AdSense dashboard
2. Add it to `.env.local`:
   ```env
   NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
   ```
3. Ad units will automatically appear in designated slots

### Image Optimization

Configure allowed image domains in `next.config.js`:

```javascript
images: {
  domains: ['localhost', 'your-backend-domain.com'],
}
```

## 🔍 SEO Optimization

### Implemented SEO Features

1. **Meta Tags**: Dynamic meta tags for each page
2. **Open Graph**: Social media sharing optimization
3. **Twitter Cards**: Twitter-specific meta tags
4. **Schema Markup**: 
   - Movie schema for movie pages
   - Breadcrumb schema for navigation
   - Website schema for homepage
5. **Sitemap Ready**: Structure supports sitemap generation
6. **Robots.txt**: SEO-friendly robots configuration
7. **Semantic HTML**: Proper HTML5 semantic elements
8. **Alt Tags**: All images have descriptive alt text

### Schema Markup Examples

The website automatically generates:
- **Movie Schema**: Rich snippets for movie pages
- **Breadcrumb Schema**: Navigation breadcrumbs
- **Website Schema**: Site-wide search functionality

### SEO Best Practices

- Clean, descriptive URLs (e.g., `/movie/avengers-endgame`)
- Optimized page titles and descriptions
- Proper heading hierarchy (H1, H2, H3)
- Fast page load times
- Mobile-responsive design
- Internal linking structure

## ⚡ Performance

### Optimization Techniques

1. **Image Optimization**:
   - Next.js Image component with automatic optimization
   - Lazy loading for images
   - WebP format support
   - Responsive images with srcset

2. **Code Splitting**:
   - Automatic code splitting by Next.js
   - Dynamic imports for heavy components
   - Route-based code splitting

3. **Caching**:
   - Server-side caching with getServerSideProps
   - Browser caching for static assets
   - API response caching

4. **Bundle Optimization**:
   - Tree shaking
   - Minification
   - Compression (gzip/brotli)

5. **Loading States**:
   - Skeleton screens for better UX
   - Progressive loading
   - Optimistic UI updates

### Performance Targets

- **Lighthouse Score**: 90+ for all metrics
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme:

```javascript
colors: {
  primary: {
    500: '#0ea5e9', // Main brand color
    // ... other shades
  }
}
```

### Fonts

The website uses Inter font. Change in `pages/_document.js`:

```javascript
<link href="https://fonts.googleapis.com/css2?family=Your+Font&display=swap" />
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] All pages load correctly
- [ ] Search functionality works
- [ ] Filters and sorting work
- [ ] Pagination works
- [ ] Movie detail pages display correctly
- [ ] Feedback submission works
- [ ] Responsive design on all devices
- [ ] SEO meta tags are correct
- [ ] Images load and optimize properly

### Browser Compatibility

Tested and working on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Other Platforms

The website can be deployed to:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Any Node.js hosting

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |
| `NEXT_PUBLIC_SITE_URL` | Website URL | Yes |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | Google AdSense ID | No |
| `NEXT_PUBLIC_SITE_NAME` | Site name | No |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | Site description | No |

## 🐛 Troubleshooting

### API Connection Issues
- Verify backend is running
- Check NEXT_PUBLIC_API_URL is correct
- Check CORS settings in backend

### Images Not Loading
- Verify image domains in next.config.js
- Check backend uploads directory
- Verify image URLs are correct

### Build Errors
- Clear .next folder: `rm -rf .next`
- Delete node_modules and reinstall
- Check for TypeScript errors if using TS

## 📞 Support

For issues and questions, check the main project README or create an issue in the repository.

## 🔗 Related Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)

---

**Built with ❤️ for high-performance movie streaming platforms**
