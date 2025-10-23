# 🚀 Bulk Import Movies - Complete Guide

## ✅ What's Fixed

### **1. Sidebar Link Added**
- **Location**: Admin Sidebar → "Bulk Import" (with upload icon)
- **Position**: Right after "Movies" menu item
- **Access**: Click to go directly to bulk import page

### **2. Category Validation Fixed**
**Problem**: `"Valid category is required"` error

**Solution**: 
- ✅ Automatically converts category slug/name to ObjectId
- ✅ Fetches all categories on page load
- ✅ Shows available categories in instructions
- ✅ Matches by slug OR name (case-insensitive)
- ✅ Clear error if category doesn't exist

---

## 📝 How to Use Bulk Import

### **Step 1: Access Bulk Import**
1. Login to Admin Panel
2. Click **"Bulk Import"** in sidebar (upload icon)
3. You'll see available categories listed

### **Step 2: Prepare Your JSON**

**Basic Format**:
```json
[
  {
    "title": "Movie Title",
    "description": "Movie description",
    "posterUrl": "https://image.tmdb.org/t/p/w500/poster.jpg",
    "releaseYear": 2024,
    "duration": "2h 15m",
    "type": "movie",
    "rating": 8.5,
    "genres": ["Action", "Thriller"],
    "category": "hollywood",
    "streamingPlatforms": ["netflix", "prime"],
    "downloadLinks": [
      {
        "quality": "1080p",
        "size": "$12.99",
        "url": "https://tv.apple.com/movie/..."
      }
    ]
  }
]
```

### **Step 3: Category Field**

**You can use EITHER**:
- **Slug**: `"category": "hollywood"`
- **Name**: `"category": "Hollywood"`

**Available categories are shown on the page!**

### **Step 4: Import**
1. Paste your JSON
2. Click "Import Movies"
3. See results (success/failed)

---

## 🎯 Complete Field Reference

### **Required Fields**
```json
{
  "title": "Movie Title",              // Required
  "description": "Description here",   // Required
  "posterUrl": "https://...",          // Required (or upload)
  "releaseYear": 2024,                 // Required
  "category": "hollywood"              // Required (slug or name)
}
```

### **Optional Fields**
```json
{
  "duration": "2h 15m",
  "type": "movie",                     // or "series"
  "totalSeasons": 3,                   // if series
  "totalEpisodes": 24,                 // if series
  "rating": 8.5,
  "imdbRating": 8.2,
  "genres": ["Action", "Drama"],
  "cast": ["Actor 1", "Actor 2"],
  "director": "Director Name",
  "languages": ["English", "Hindi"],
  "quality": "1080p",
  "streamingPlatforms": ["netflix", "prime", "disney", "apple", "hotstar", "zee5", "sonyliv", "youtube"],
  "downloadLinks": [
    {
      "quality": "1080p",
      "size": "$12.99",
      "url": "https://..."
    }
  ],
  "screenshots": ["https://..."],
  "trailerUrl": "https://youtube.com/watch?v=...",
  "tags": ["action", "thriller"],
  "metaTitle": "SEO Title",
  "metaDescription": "SEO Description",
  "status": "published"               // or "draft"
}
```

---

## 🎬 Real Example (Ready to Use)

**Make sure you have a "hollywood" category first!**

```json
[
  {
    "title": "Avengers: Endgame",
    "description": "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos' actions and restore balance to the universe.",
    "posterUrl": "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    "releaseYear": 2019,
    "duration": "3h 1m",
    "type": "movie",
    "rating": 8.4,
    "imdbRating": 8.4,
    "genres": ["Action", "Adventure", "Sci-Fi"],
    "category": "hollywood",
    "cast": ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo", "Chris Hemsworth"],
    "director": "Anthony Russo, Joe Russo",
    "languages": ["English"],
    "quality": "4K",
    "streamingPlatforms": ["disney", "prime"],
    "downloadLinks": [
      {
        "quality": "4K",
        "size": "$19.99",
        "url": "https://tv.apple.com/movie/avengers-endgame"
      },
      {
        "quality": "1080p",
        "size": "$14.99",
        "url": "https://play.google.com/store/movies/details/Avengers_Endgame"
      }
    ],
    "trailerUrl": "https://www.youtube.com/watch?v=TcMBFSGVi1c",
    "tags": ["marvel", "superhero", "avengers"],
    "metaTitle": "Watch Avengers: Endgame Online | Stream in 4K",
    "metaDescription": "Stream Avengers: Endgame in stunning 4K quality on Disney+ and Prime Video. The epic conclusion to the Infinity Saga.",
    "status": "published"
  },
  {
    "title": "The Dark Knight",
    "description": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    "posterUrl": "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    "releaseYear": 2008,
    "duration": "2h 32m",
    "type": "movie",
    "rating": 9.0,
    "imdbRating": 9.0,
    "genres": ["Action", "Crime", "Drama"],
    "category": "hollywood",
    "cast": ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    "director": "Christopher Nolan",
    "languages": ["English"],
    "quality": "1080p",
    "streamingPlatforms": ["netflix", "prime"],
    "downloadLinks": [
      {
        "quality": "1080p",
        "size": "$12.99",
        "url": "https://tv.apple.com/movie/the-dark-knight"
      }
    ],
    "trailerUrl": "https://www.youtube.com/watch?v=EXeTwQWrcwY",
    "tags": ["batman", "dc", "superhero"],
    "status": "published"
  }
]
```

---

## 🔧 Troubleshooting

### **Error: "Valid category is required"**
**Solution**: 
- Check the category slug/name exists
- Look at "Available Categories" shown on the page
- Use exact slug (e.g., "hollywood", not "Hollywood Movies")

### **Error: "Category not found"**
**Solution**:
1. Go to **Categories** page
2. Create the category first
3. Note the slug (lowercase, hyphenated)
4. Use that slug in your JSON

### **Poster not showing**
**Solution**:
- Use direct image URLs (not HTML pages)
- TMDB format: `https://image.tmdb.org/t/p/w500/POSTER_PATH.jpg`
- Test URL in browser first

### **Some movies imported, some failed**
**Solution**:
- Check the "Failed to Import" section
- Each failed movie shows specific error
- Fix those movies and re-import

---

## 💡 Pro Tips

### **1. Get Movie Data from TMDB**
```javascript
// Use TMDB API to get movie data
const API_KEY = 'your_tmdb_api_key';
const movieId = 299536; // Avengers: Endgame

fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`)
  .then(res => res.json())
  .then(data => {
    const movieData = {
      title: data.title,
      description: data.overview,
      posterUrl: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
      releaseYear: new Date(data.release_date).getFullYear(),
      rating: data.vote_average,
      genres: data.genres.map(g => g.name),
      // ... add more fields
    };
  });
```

### **2. Bulk Convert from Spreadsheet**
1. Export your movie list to CSV
2. Use online CSV to JSON converter
3. Adjust field names to match format
4. Import!

### **3. Test with Small Batch First**
- Import 2-3 movies first
- Check if everything works
- Then import larger batches

### **4. Save Your JSON**
- Keep a backup of your JSON file
- Easy to re-import if needed
- Can update and re-import

---

## 📊 Import Results

After importing, you'll see:

### **Success Section** (Green)
```
✓ Successfully Imported (45)
  ✓ Avengers: Endgame
  ✓ The Dark Knight
  ✓ Inception
  ...
```

### **Failed Section** (Red)
```
✗ Failed to Import (5)
  ✗ Movie Title
    Error: Category "sci-fi" not found. Please create it first.
  ✗ Another Movie
    Error: posterUrl is required
```

---

## 🎯 Quick Start Checklist

- [ ] Create categories first (Hollywood, Bollywood, etc.)
- [ ] Note category slugs
- [ ] Prepare JSON with movie data
- [ ] Use posterUrl (direct image links)
- [ ] Select streaming platforms
- [ ] Click "Load Example" to see format
- [ ] Paste your JSON
- [ ] Click "Import Movies"
- [ ] Check results
- [ ] Fix any failed imports

---

## 🚀 You're Ready!

The bulk import feature is now:
✅ **Working perfectly**
✅ **Category validation fixed**
✅ **Easy to access** (sidebar link)
✅ **Shows available categories**
✅ **Clear error messages**
✅ **Supports all fields**

**Start importing movies in bulk!** 🎬
