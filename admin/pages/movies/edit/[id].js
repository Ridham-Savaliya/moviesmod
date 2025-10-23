import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout/Layout';
import { moviesAPI, categoriesAPI } from '@/lib/api';
import { toast } from 'react-toastify';
import { FiUpload, FiPlus, FiTrash2 } from 'react-icons/fi';

export default function EditMovie() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [fetchingMovie, setFetchingMovie] = useState(true);
  const [categories, setCategories] = useState([]);
  const [posterPreview, setPosterPreview] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    releaseYear: new Date().getFullYear(),
    duration: '',
    type: 'movie',
    totalSeasons: 0,
    totalEpisodes: 0,
    languages: '',
    director: '',
    cast: '',
    category: '',
    genres: [],
    quality: '1080p',
    trailerUrl: '',
    downloadLinks: [{ quality: '1080p', size: '', url: '' }],
    screenshots: '',
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    status: 'draft',
  });

  const [posterFile, setPosterFile] = useState(null);
  const [existingPoster, setExistingPoster] = useState(null);

  useEffect(() => {
    if (id) {
      fetchMovie();
      fetchCategories();
    }
  }, [id]);

  const fetchMovie = async () => {
    try {
      setFetchingMovie(true);
      const response = await moviesAPI.getById(id);
      if (response.data.success) {
        const movie = response.data.data;
        
        // Handle languages field - convert array to comma-separated string
        const languagesStr = Array.isArray(movie.languages) 
          ? movie.languages.join(', ') 
          : movie.languages || '';
        
        // Handle cast field - convert array to comma-separated string
        const castStr = Array.isArray(movie.cast) 
          ? movie.cast.join(', ') 
          : movie.cast || '';
        
        // Handle screenshots field - convert array to comma-separated string
        const screenshotsStr = Array.isArray(movie.screenshots) 
          ? movie.screenshots.join(', ') 
          : movie.screenshots || '';
        
        setFormData({
          title: movie.title || '',
          description: movie.description || '',
          releaseYear: movie.releaseYear || new Date().getFullYear(),
          duration: movie.duration || '',
          type: movie.type || 'movie',
          totalSeasons: movie.totalSeasons || 0,
          totalEpisodes: movie.totalEpisodes || 0,
          languages: languagesStr,
          director: movie.director || '',
          cast: castStr,
          category: movie.category?._id || movie.category || '',
          genres: movie.genres || [],
          quality: movie.quality || '1080p',
          trailerUrl: movie.trailerUrl || '',
          downloadLinks: movie.downloadLinks?.length > 0 
            ? movie.downloadLinks 
            : [{ quality: '1080p', size: '', url: '' }],
          screenshots: screenshotsStr,
          metaTitle: movie.metaTitle || '',
          metaDescription: movie.metaDescription || '',
          keywords: Array.isArray(movie.metaKeywords) 
            ? movie.metaKeywords.join(', ') 
            : movie.metaKeywords || '',
          status: movie.status || 'draft',
        });
        
        // Set existing poster
        if (movie.poster) {
          setExistingPoster(movie.poster);
          setPosterPreview(movie.poster.startsWith('http') 
            ? movie.poster 
            : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'}${movie.poster}`
          );
        }
      }
    } catch (error) {
      console.error('Error fetching movie:', error);
      toast.error('Failed to load movie data');
    } finally {
      setFetchingMovie(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPosterFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPosterPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenreChange = (e) => {
    const value = e.target.value;
    const genres = formData.genres.includes(value)
      ? formData.genres.filter(g => g !== value)
      : [...formData.genres, value];
    setFormData({ ...formData, genres });
  };

  const addDownloadLink = () => {
    setFormData({
      ...formData,
      downloadLinks: [...formData.downloadLinks, { quality: '1080p', size: '', url: '' }]
    });
  };

  const removeDownloadLink = (index) => {
    const links = formData.downloadLinks.filter((_, i) => i !== index);
    setFormData({ ...formData, downloadLinks: links });
  };

  const updateDownloadLink = (index, field, value) => {
    const links = [...formData.downloadLinks];
    links[index][field] = value;
    setFormData({ ...formData, downloadLinks: links });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);

    try {
      const data = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'genres' || key === 'downloadLinks') {
          data.append(key, JSON.stringify(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      });
      
      // Add poster file only if a new one is selected
      if (posterFile) {
        data.append('poster', posterFile);
      }

      const response = await moviesAPI.update(id, data);
      
      if (response.data.success) {
        toast.success('Movie updated successfully!');
        router.push('/movies');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update movie');
    } finally {
      setLoading(false);
    }
  };

  const genreOptions = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
    'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi',
    'Thriller', 'War', 'Western'
  ];

  const qualityOptions = ['480p', '720p', '1080p', '1440p', '4K'];

  if (fetchingMovie) {
    return (
      <Layout title="Edit Movie">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading movie data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Edit Movie">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Edit Movie</h1>
          <p className="text-gray-600">Update movie information</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter movie title"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter movie description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Release Year *
                </label>
                <input
                  type="number"
                  name="releaseYear"
                  value={formData.releaseYear}
                  onChange={handleInputChange}
                  required
                  min="1900"
                  max={new Date().getFullYear() + 5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="120 min or 45 min/episode"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="movie">Movie</option>
                  <option value="series">TV Series</option>
                </select>
              </div>

              {formData.type === 'series' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Seasons
                    </label>
                    <input
                      type="number"
                      name="totalSeasons"
                      value={formData.totalSeasons}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Episodes
                    </label>
                    <input
                      type="number"
                      name="totalEpisodes"
                      value={formData.totalEpisodes}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="24"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Languages (comma separated)
                </label>
                <input
                  type="text"
                  name="languages"
                  value={formData.languages}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Hindi, English, Gujarati"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quality
                </label>
                <select
                  name="quality"
                  value={formData.quality}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {qualityOptions.map(q => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Poster Upload */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Poster Image</h2>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {posterPreview ? (
                  <img
                    src={posterPreview}
                    alt="Poster preview"
                    className="w-32 h-48 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-32 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    <FiUpload className="text-gray-400" size={32} />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload New Poster {!existingPoster && '*'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePosterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <p className="text-sm text-gray-500 mt-2">
                  {existingPoster 
                    ? 'Leave empty to keep current poster' 
                    : 'Recommended: 300x450px, JPG or PNG, max 5MB'}
                </p>
              </div>
            </div>
          </div>

          {/* Category and Genres */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Classification</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Genres
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-300 rounded-lg">
                  {genreOptions.map(genre => (
                    <label key={genre} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={genre}
                        checked={formData.genres.includes(genre)}
                        onChange={handleGenreChange}
                        className="rounded text-primary-500"
                      />
                      <span className="text-sm">{genre}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cast and Crew */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Cast & Crew</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Director
                </label>
                <input
                  type="text"
                  name="director"
                  value={formData.director}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Director name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cast (comma separated)
                </label>
                <input
                  type="text"
                  name="cast"
                  value={formData.cast}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Actor 1, Actor 2, Actor 3"
                />
              </div>
            </div>
          </div>

          {/* Trailer */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Media</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trailer URL (YouTube)
                </label>
                <input
                  type="url"
                  name="trailerUrl"
                  value={formData.trailerUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Screenshots (comma separated URLs)
                </label>
                <textarea
                  name="screenshots"
                  value={formData.screenshots}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="https://example.com/screenshot1.jpg, https://example.com/screenshot2.jpg"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter screenshot URLs separated by commas
                </p>
              </div>
            </div>
          </div>

          {/* Download Links */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Download Links</h2>
              <button
                type="button"
                onClick={addDownloadLink}
                className="flex items-center space-x-2 text-primary-500 hover:text-primary-600"
              >
                <FiPlus size={20} />
                <span>Add Link</span>
              </button>
            </div>
            <div className="space-y-4">
              {formData.downloadLinks.map((link, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border border-gray-300 rounded-lg">
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quality
                    </label>
                    <select
                      value={link.quality}
                      onChange={(e) => updateDownloadLink(index, 'quality', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {qualityOptions.map(q => (
                        <option key={q} value={q}>{q}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size
                    </label>
                    <input
                      type="text"
                      value={link.size}
                      onChange={(e) => updateDownloadLink(index, 'size', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="2.5GB"
                    />
                  </div>
                  <div className="md:col-span-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL
                    </label>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateDownloadLink(index, 'url', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="md:col-span-1 flex items-end">
                    <button
                      type="button"
                      onClick={() => removeDownloadLink(index)}
                      className="w-full px-4 py-2 text-red-600 hover:text-red-700"
                      disabled={formData.downloadLinks.length === 1}
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SEO */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">SEO</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Leave empty to use movie title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Leave empty to use movie description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords (comma separated)
                </label>
                <input
                  type="text"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="action, thriller, 2024"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.push('/movies')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Movie'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
