import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { FiSearch, FiX } from 'react-icons/fi';
import { moviesAPI } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await moviesAPI.getSearchSuggestions(query);
        if (response.data.success) {
          setSuggestions(response.data.data);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-48 md:w-64 lg:w-72 bg-dark-100 text-white placeholder-gray-400 rounded-full py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
        />
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <FiX size={18} />
          </button>
        )}
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full mt-2 w-full bg-dark-100 rounded-lg shadow-xl overflow-hidden z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-400">Searching...</div>
          ) : suggestions.length > 0 ? (
            <div>
              {suggestions.map((movie) => (
                <Link
                  key={movie._id}
                  href={`/movie/${movie.slug}`}
                  onClick={() => {
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className="flex items-center space-x-3 p-3 hover:bg-dark-200 transition-colors"
                >
                  <div className="relative w-12 h-16 flex-shrink-0">
                    <Image
                      src={getImageUrl(movie.poster)}
                      alt={movie.title}
                      fill
                      className="object-cover rounded"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {movie.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-400">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
