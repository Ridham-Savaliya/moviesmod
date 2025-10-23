# 🚀 Quick Start Guide

Get your MoviesHub platform running in 5 minutes!

## ⚡ Prerequisites

- Node.js installed
- MongoDB installed and running

## 📝 Step-by-Step Setup

### Step 1: Backend Setup (2 minutes)

```bash
# Open terminal 1
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` and set:
```env
MONGODB_URI=mongodb://localhost:27017/moviesmod
JWT_SECRET=your_secret_key_here
```

Start backend:
```bash
npm run dev
```

✅ Backend running on http://localhost:5000

### Step 2: Create Admin Account (30 seconds)

Open a new terminal and run:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "admin"
  }'
```

✅ Admin account created!

### Step 3: Website Setup (1 minute)

```bash
# Open terminal 2
cd website
npm install
cp .env.local.example .env.local
npm run dev
```

✅ Website running on http://localhost:3000

### Step 4: Admin Panel Setup (1 minute)

```bash
# Open terminal 3
cd admin
npm install
cp .env.local.example .env.local
npm run dev
```

✅ Admin panel running on http://localhost:3001

## 🎉 You're Done!

### Access Your Platform:

1. **Admin Panel**: http://localhost:3001
   - Login with: admin@example.com / admin123
   - Add categories and movies

2. **Website**: http://localhost:3000
   - Browse movies
   - Search and filter
   - View movie details

## 📚 Next Steps

1. **Add Categories**:
   - Go to Admin → Categories
   - Add: Bollywood, Hollywood, Web Series, etc.

2. **Add Movies**:
   - Go to Admin → Movies → Add Movie
   - Fill in details and upload poster
   - Add download links

3. **Configure AdSense** (Optional):
   - Get AdSense client ID
   - Add to `website/.env.local`:
     ```env
     NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxx
     ```

4. **Customize**:
   - Change colors in tailwind.config.js
   - Update site name in .env files
   - Add your logo

## 🐛 Troubleshooting

**MongoDB not running?**
```bash
mongod
```

**Port already in use?**
```bash
# Kill process on port 5000
npx kill-port 5000
```

**Need help?**
- Check main README.md
- Check individual folder READMEs

## 📖 Full Documentation

- [Main README](./README.md)
- [Backend README](./backend/README.md)
- [Website README](./website/README.md)
- [Admin README](./admin/README.md)

---

**Happy Streaming! 🍿**
