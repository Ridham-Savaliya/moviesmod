import { useState, useEffect } from 'react';
import Layout from '@/components/Layout/Layout';
import { moviesAPI, categoriesAPI } from '@/lib/api';
import { FiUpload, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function BulkImport() {
  const [jsonData, setJsonData] = useState('');
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const exampleJson = `[
  {
    "title": "Movie Title",
    "description": "Movie description here",
    "posterUrl": "https://example.com/poster.jpg",
    "releaseYear": 2024,
    "duration": "2h 15m",
    "type": "movie",
    "rating": 8.5,
    "imdbRating": 8.2,
    "genres": ["Action", "Thriller"],
    "category": "hollywood",
    "cast": ["Actor 1", "Actor 2"],
    "director": "Director Name",
    "languages": ["English", "Hindi"],
    "quality": "1080p",
    "streamingPlatforms": ["netflix", "prime"],
    "downloadLinks": [
      {
        "quality": "1080p",
        "size": "$12.99",
        "url": "https://tv.apple.com/movie/..."
      }
    ],
    "screenshots": ["https://example.com/ss1.jpg"],
    "trailerUrl": "https://youtube.com/watch?v=...",
    "tags": ["action", "thriller"],
    "metaTitle": "Watch Movie Title Online",
    "metaDescription": "Stream Movie Title in HD",
    "status": "published"
  }
]`;

  const handleImport = async () => {
    try {
      setImporting(true);
      setResults(null);

      // Parse JSON
      const movies = JSON.parse(jsonData);
      
      if (!Array.isArray(movies)) {
        toast.error('JSON must be an array of movies');
        return;
      }

      // Import movies one by one
      const importResults = {
        success: [],
        failed: []
      };

      for (const movieData of movies) {
        try {
          // Convert category slug to ObjectId
          let categoryId = movieData.category;
          if (typeof movieData.category === 'string') {
            const category = categories.find(cat => 
              cat.slug === movieData.category.toLowerCase() || 
              cat.name.toLowerCase() === movieData.category.toLowerCase()
            );
            if (category) {
              categoryId = category._id;
            } else {
              throw new Error(`Category "${movieData.category}" not found. Please create it first.`);
            }
          }

          // Create FormData for each movie
          const formData = new FormData();
          
          // Add all fields
          Object.keys(movieData).forEach(key => {
            if (key === 'category') {
              formData.append('category', categoryId);
            } else if (key === 'streamingPlatforms') {
              // Send each platform separately
              if (Array.isArray(movieData[key])) {
                movieData[key].forEach(platform => {
                  formData.append('streamingPlatforms[]', platform);
                });
              }
            } else if (key === 'genres' || key === 'cast' || key === 'languages' || key === 'tags' || key === 'screenshots') {
              formData.append(key, JSON.stringify(movieData[key]));
            } else if (key === 'downloadLinks') {
              formData.append(key, JSON.stringify(movieData[key]));
            } else if (key === 'posterUrl' && movieData[key]) {
              // Use poster URL instead of upload
              formData.append('poster', movieData[key]);
              formData.append('posterUrl', movieData[key]);
            } else {
              formData.append(key, movieData[key]);
            }
          });

          const response = await moviesAPI.create(formData);
          
          if (response.data.success) {
            importResults.success.push({
              title: movieData.title,
              message: 'Imported successfully'
            });
          } else {
            importResults.failed.push({
              title: movieData.title,
              error: response.data.message || 'Unknown error'
            });
          }
        } catch (error) {
          importResults.failed.push({
            title: movieData.title || 'Unknown',
            error: error.response?.data?.message || error.message
          });
        }
      }

      setResults(importResults);
      
      if (importResults.success.length > 0) {
        toast.success(`Successfully imported ${importResults.success.length} movies!`);
      }
      
      if (importResults.failed.length > 0) {
        toast.error(`Failed to import ${importResults.failed.length} movies`);
      }

    } catch (error) {
      console.error('Import error:', error);
      toast.error('Invalid JSON format: ' + error.message);
    } finally {
      setImporting(false);
    }
  };

  const loadExample = () => {
    setJsonData(exampleJson);
  };

  return (
    <Layout title="Bulk Import Movies">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Bulk Import Movies</h1>
          <p className="text-gray-600">Import multiple movies at once using JSON format</p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <FiAlertCircle className="text-blue-600 mt-1" size={20} />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-2">How to use:</h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Prepare your movies data in JSON array format</li>
                <li>Use <code className="bg-blue-100 px-1 rounded">posterUrl</code> field to add poster image URL (no upload needed)</li>
                <li>Select streaming platforms: netflix, prime, disney, apple, hotstar, zee5, sonyliv, youtube</li>
                <li>Category should be the slug or name from your existing categories</li>
                <li>Click "Load Example" to see the format</li>
                <li>Paste your JSON and click "Import Movies"</li>
              </ul>
              {categories.length > 0 && (
                <div className="mt-3 p-2 bg-blue-100 rounded">
                  <p className="text-xs font-semibold text-blue-900 mb-1">Available Categories:</p>
                  <div className="flex flex-wrap gap-1">
                    {categories.map(cat => (
                      <span key={cat._id} className="text-xs bg-white px-2 py-1 rounded text-blue-800">
                        {cat.slug}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* JSON Input */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">JSON Data</h2>
            <button
              onClick={loadExample}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              Load Example
            </button>
          </div>

          <textarea
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
            placeholder="Paste your JSON array here..."
            className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
          />

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {jsonData ? `${jsonData.split('\n').length} lines` : 'No data'}
            </p>
            <button
              onClick={handleImport}
              disabled={!jsonData || importing}
              className="flex items-center space-x-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <FiUpload size={20} />
              <span>{importing ? 'Importing...' : 'Import Movies'}</span>
            </button>
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-4">
            {/* Success */}
            {results.success.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <FiCheck className="text-green-600" size={24} />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Successfully Imported ({results.success.length})
                  </h3>
                </div>
                <div className="space-y-2">
                  {results.success.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <FiCheck className="text-green-600" size={16} />
                      <span className="text-gray-700">{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Failed */}
            {results.failed.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <FiX className="text-red-600" size={24} />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Failed to Import ({results.failed.length})
                  </h3>
                </div>
                <div className="space-y-2">
                  {results.failed.map((item, index) => (
                    <div key={index} className="text-sm">
                      <div className="flex items-start space-x-2">
                        <FiX className="text-red-600 mt-0.5" size={16} />
                        <div>
                          <p className="text-gray-700 font-medium">{item.title}</p>
                          <p className="text-red-600 text-xs">{item.error}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
