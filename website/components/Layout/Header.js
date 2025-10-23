import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiSearch, FiMenu, FiX, FiChevronDown } from 'react-icons/fi';

const Header = ({ categories }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const genres = ['Action', 'Drama', 'Comedy', 'Horror', 'Thriller', 'Romance', 'Sci-Fi', 'Adventure'];
  const languages = ['Hindi', 'English', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Gujarati', 'Punjabi'];
  const years = ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'];
  const ottPlatforms = ['Netflix', 'Amazon Prime', 'Disney+ Hotstar', 'Apple TV+', 'SonyLIV', 'Zee5'];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a] shadow-lg">
      {/* Top Bar with Logo, Search, and Category Buttons */}
      <div className="bg-[#0d0d0d] border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-white">MOVIES</span>
                <div className="w-6 h-6 mx-1 rounded-full bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500"></div>
                <span className="text-2xl font-bold text-green-400">MOD</span>
              </div>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What are you looking for?"
                  className="w-full bg-[#2a2a2a] text-white px-4 py-2 pr-10 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  <FiSearch size={20} />
                </button>
              </div>
            </form>

            {/* Category Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              <Link
                href="/category/bollywood"
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded font-semibold transition-all"
              >
                Bollywood
              </Link>
              <Link
                href="/category/anime"
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded font-semibold transition-all"
              >
                AnimeFlix
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-white p-2"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="bg-[#1a1a1a] border-b border-gray-800">
        <div className="container mx-auto px-4">
          <nav className="hidden lg:flex items-center space-x-1 h-12">
            <Link
              href="/"
              className="px-4 py-2 text-white hover:bg-[#2a2a2a] rounded transition-colors font-medium"
            >
              HOME
            </Link>
            <div className="relative">
              <button 
                onClick={() => toggleDropdown('movies')}
                className="px-4 py-2 text-white hover:bg-[#2a2a2a] rounded transition-colors font-medium flex items-center space-x-1"
              >
                <span>MOVIES</span>
                <FiChevronDown size={16} />
              </button>
              {activeDropdown === 'movies' && (
                <div className="absolute top-full left-0 mt-1 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-xl py-2 min-w-[200px] z-50">
                  {categories?.slice(0, 8).map((cat) => (
                    <Link key={cat._id} href={`/category/${cat.slug}`} className="block px-4 py-2 text-white hover:bg-[#2a2a2a] transition-colors">
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <button 
                onClick={() => toggleDropdown('language')}
                className="px-4 py-2 text-white hover:bg-[#2a2a2a] rounded transition-colors font-medium flex items-center space-x-1"
              >
                <span>LANGUAGE</span>
                <FiChevronDown size={16} />
              </button>
              {activeDropdown === 'language' && (
                <div className="absolute top-full left-0 mt-1 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-xl py-2 min-w-[200px] z-50">
                  {languages.map((lang) => (
                    <Link key={lang} href={`/movies?language=${lang.toLowerCase()}`} className="block px-4 py-2 text-white hover:bg-[#2a2a2a] transition-colors">
                      {lang}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <button 
                onClick={() => toggleDropdown('genre')}
                className="px-4 py-2 text-white hover:bg-[#2a2a2a] rounded transition-colors font-medium flex items-center space-x-1"
              >
                <span>GENRE</span>
                <FiChevronDown size={16} />
              </button>
              {activeDropdown === 'genre' && (
                <div className="absolute top-full left-0 mt-1 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-xl py-2 min-w-[200px] z-50">
                  {genres.map((genre) => (
                    <Link key={genre} href={`/movies?genre=${genre}`} className="block px-4 py-2 text-white hover:bg-[#2a2a2a] transition-colors">
                      {genre}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <button 
                onClick={() => toggleDropdown('year')}
                className="px-4 py-2 text-white hover:bg-[#2a2a2a] rounded transition-colors font-medium flex items-center space-x-1"
              >
                <span>YEAR</span>
                <FiChevronDown size={16} />
              </button>
              {activeDropdown === 'year' && (
                <div className="absolute top-full left-0 mt-1 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-xl py-2 min-w-[200px] z-50">
                  {years.map((year) => (
                    <Link key={year} href={`/movies?year=${year}`} className="block px-4 py-2 text-white hover:bg-[#2a2a2a] transition-colors">
                      {year}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <button 
                onClick={() => toggleDropdown('ott')}
                className="px-4 py-2 text-white hover:bg-[#2a2a2a] rounded transition-colors font-medium flex items-center space-x-1"
              >
                <span>OTT</span>
                <FiChevronDown size={16} />
              </button>
              {activeDropdown === 'ott' && (
                <div className="absolute top-full left-0 mt-1 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-xl py-2 min-w-[200px] z-50">
                  {ottPlatforms.map((platform) => (
                    <Link key={platform} href={`/movies?ott=${platform.toLowerCase().replace(/\s+/g, '-')}`} className="block px-4 py-2 text-white hover:bg-[#2a2a2a] transition-colors">
                      {platform}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <button 
                onClick={() => toggleDropdown('webseries')}
                className="px-4 py-2 text-white hover:bg-[#2a2a2a] rounded transition-colors font-medium flex items-center space-x-1"
              >
                <span>WEB SERIES</span>
                <FiChevronDown size={16} />
              </button>
              {activeDropdown === 'webseries' && (
                <div className="absolute top-full left-0 mt-1 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-xl py-2 min-w-[200px] z-50">
                  <Link href="/web-series" className="block px-4 py-2 text-white hover:bg-[#2a2a2a] transition-colors">All Web Series</Link>
                  <Link href="/web-series?type=ongoing" className="block px-4 py-2 text-white hover:bg-[#2a2a2a] transition-colors">Ongoing</Link>
                  <Link href="/web-series?type=completed" className="block px-4 py-2 text-white hover:bg-[#2a2a2a] transition-colors">Completed</Link>
                </div>
              )}
            </div>
            <div className="relative">
              <button 
                onClick={() => toggleDropdown('tvseries')}
                className="px-4 py-2 text-white hover:bg-[#2a2a2a] rounded transition-colors font-medium flex items-center space-x-1"
              >
                <span>TV SERIES</span>
                <FiChevronDown size={16} />
              </button>
              {activeDropdown === 'tvseries' && (
                <div className="absolute top-full left-0 mt-1 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-xl py-2 min-w-[200px] z-50">
                  <Link href="/tv-series" className="block px-4 py-2 text-white hover:bg-[#2a2a2a] transition-colors">All TV Series</Link>
                  <Link href="/tv-series?type=popular" className="block px-4 py-2 text-white hover:bg-[#2a2a2a] transition-colors">Popular</Link>
                  <Link href="/tv-series?type=latest" className="block px-4 py-2 text-white hover:bg-[#2a2a2a] transition-colors">Latest</Link>
                </div>
              )}
            </div>
            <Link
              href="/pc-games"
              className="px-4 py-2 text-white hover:bg-[#2a2a2a] rounded transition-colors font-medium"
            >
              PC GAMES
            </Link>
          </nav>
        </div>
      </div>

      {/* Filter Badges */}
      <div className="bg-[#0d0d0d] border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 py-3 overflow-x-auto">
            <a
              href="https://t.me/moviesmodnews"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-sm font-medium whitespace-nowrap flex items-center space-x-1 transition-colors"
            >
              <span>📱</span>
              <span>JOIN TELEGRAM</span>
            </a>
            <button className="px-3 py-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-full text-sm font-medium whitespace-nowrap transition-colors">
              English Movies
            </button>
            <button className="px-3 py-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-full text-sm font-medium whitespace-nowrap transition-colors">
              Dual Audio
            </button>
            <button className="px-3 py-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-full text-sm font-medium whitespace-nowrap transition-colors">
              On Going Series
            </button>
            <button className="px-3 py-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-full text-sm font-medium whitespace-nowrap transition-colors">
              Anime
            </button>
            <button className="px-3 py-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-full text-sm font-medium whitespace-nowrap transition-colors">
              K-Drama Series
            </button>
            <button className="px-3 py-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-full text-sm font-medium whitespace-nowrap transition-colors">
              Web Series
            </button>
            <button className="px-3 py-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-full text-sm font-medium whitespace-nowrap transition-colors">
              Hindi Series
            </button>
            <button className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-full text-sm font-bold whitespace-nowrap transition-colors">
              📺 4K MOVIES
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-[#1a1a1a] border-t border-gray-800">
          <div className="py-4 space-y-2 px-4">
            <Link href="/" className="block py-2 text-white hover:text-primary-500" onClick={() => setIsMenuOpen(false)}>
              HOME
            </Link>
            <Link href="/movies" className="block py-2 text-white hover:text-primary-500" onClick={() => setIsMenuOpen(false)}>
              MOVIES
            </Link>
            <Link href="/web-series" className="block py-2 text-white hover:text-primary-500" onClick={() => setIsMenuOpen(false)}>
              WEB SERIES
            </Link>
            <Link href="/tv-series" className="block py-2 text-white hover:text-primary-500" onClick={() => setIsMenuOpen(false)}>
              TV SERIES
            </Link>
            <Link href="/pc-games" className="block py-2 text-white hover:text-primary-500" onClick={() => setIsMenuOpen(false)}>
              PC GAMES
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
