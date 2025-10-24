import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { FiStar, FiEye, FiClock, FiDownload, FiPlay } from 'react-icons/fi';
import Layout from '@/components/Layout/Layout';
import MovieGrid from '@/components/Movies/MovieGrid';
import FeedbackForm from '@/components/Feedback/FeedbackForm';
import FeedbackList from '@/components/Feedback/FeedbackList';
import AdSlotRenderer from '@/components/AdSense/AdSlotRenderer';
import { moviesAPI } from '@/lib/api';
import { getImageUrl, formatViews, getQualityColor } from '@/lib/utils';
import { generateMovieSchema, generateBreadcrumbSchema } from '@/lib/seo';

export default function MovieDetail({ movie, relatedMovies }) {
  const [activeTab, setActiveTab] = useState('details');

  // Convert YouTube URL to embed format
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    
    // Already an embed URL
    if (url.includes('youtube.com/embed/')) return url;
    
    // Extract video ID from various YouTube URL formats
    let videoId = null;
    
    // Format: https://www.youtube.com/watch?v=VIDEO_ID
    const watchMatch = url.match(/[?&]v=([^&]+)/);
    if (watchMatch) videoId = watchMatch[1];
    
    // Format: https://youtu.be/VIDEO_ID
    const shortMatch = url.match(/youtu\.be\/([^?]+)/);
    if (shortMatch) videoId = shortMatch[1];
    
    // Format: https://www.youtube.com/embed/VIDEO_ID
    const embedMatch = url.match(/youtube\.com\/embed\/([^?]+)/);
    if (embedMatch) videoId = embedMatch[1];
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  if (!movie) {
    return (
      <Layout title="Movie Not Found">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Movie Not Found</h1>
          <Link href="/" className="text-primary-500 hover:underline">
            Go back to home
          </Link>
        </div>
      </Layout>
    );
  }

  const movieSchema = generateMovieSchema(movie);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: process.env.NEXT_PUBLIC_SITE_URL || 'https://moviesmod-virid.vercel.app' },
    { name: movie.category?.name || 'Movies', url: `${process.env.NEXT_PUBLIC_SITE_URL}/category/${movie.category?.slug}` },
    { name: movie.title, url: `${process.env.NEXT_PUBLIC_SITE_URL}/movie/${movie.slug}` },
  ]);

  return (
    <Layout
      title={movie.metaTitle || movie.title}
      description={movie.metaDescription || movie.description}
      keywords={movie.metaKeywords?.join(', ')}
      ogImage={getImageUrl(movie.poster)}
    >
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(movieSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Top Ad */}
        <AdSlotRenderer position="movie-detail-top" className="mb-8" />

        {/* Movie Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={getImageUrl(movie.poster)}
                alt={movie.title}
                fill
                className="object-cover"
                priority
              />
              <div className={`absolute top-4 left-4 ${getQualityColor(movie.quality)} text-white text-sm font-bold px-3 py-1 rounded`}>
                {movie.quality}
              </div>
            </div>
          </div>

          {/* Movie Info */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              {movie.rating > 0 && (
                <div className="flex items-center space-x-2 bg-dark-100 px-4 py-2 rounded">
                  <FiStar className="text-yellow-400" size={20} />
                  <span className="text-white font-semibold">{movie.rating.toFixed(1)}</span>
                  <span className="text-gray-400 text-sm">/10</span>
                </div>
              )}

              <div className="flex items-center space-x-2 bg-dark-100 px-4 py-2 rounded">
                <FiEye className="text-primary-500" size={20} />
                <span className="text-white">{formatViews(movie.views)} views</span>
              </div>

              <div className="flex items-center space-x-2 bg-dark-100 px-4 py-2 rounded">
                <FiClock className="text-primary-500" size={20} />
                <span className="text-white">{movie.releaseYear}</span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <span className="text-gray-400">Genre: </span>
                <span className="text-white">{movie.genres?.join(', ')}</span>
              </div>

              {movie.director && (
                <div>
                  <span className="text-gray-400">Director: </span>
                  <span className="text-white">{movie.director}</span>
                </div>
              )}

              {movie.cast && movie.cast.length > 0 && (
                <div>
                  <span className="text-gray-400">Cast: </span>
                  <span className="text-white">{movie.cast.join(', ')}</span>
                </div>
              )}

              {movie.languages && movie.languages.length > 0 && (
                <div>
                  <span className="text-gray-400">Language: </span>
                  <span className="text-white">{movie.languages.join(', ')}</span>
                </div>
              )}

              {movie.duration && (
                <div>
                  <span className="text-gray-400">Duration: </span>
                  <span className="text-white">{movie.duration}</span>
                </div>
              )}

              {movie.type === 'series' && (
                <div>
                  <span className="text-gray-400">Seasons/Episodes: </span>
                  <span className="text-white">
                    {movie.totalSeasons} Season{movie.totalSeasons !== 1 ? 's' : ''} • {movie.totalEpisodes} Episode{movie.totalEpisodes !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>

            <p className="text-gray-300 leading-relaxed mb-6">
              {movie.description}
            </p>

            {/* Category Badge */}
            {movie.category && (
              <Link
                href={`/category/${movie.category.slug}`}
                className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded transition-colors"
              >
                {movie.category.name}
              </Link>
            )}
          </div>
        </div>

        {/* Sidebar Ad */}
        <AdSlotRenderer position="sidebar" className="mb-8 lg:hidden" />

        {/* Tabs */}
        <div className="bg-dark-100 rounded-lg overflow-hidden mb-8">
          <div className="flex border-b border-dark-200">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'details'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('trailer')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'trailer'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Trailer
            </button>
            <button
              onClick={() => setActiveTab('watch')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'watch'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Where to Watch
            </button>
            <button
              onClick={() => setActiveTab('screenshots')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'screenshots'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Screenshots
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'reviews'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Reviews
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'details' && (
              <div className="text-gray-300">
                <h2 className="text-2xl font-bold text-white mb-4">Movie Details</h2>
                <p className="leading-relaxed">{movie.description}</p>
              </div>
            )}

            {activeTab === 'trailer' && (
              <div>
                {movie.trailerUrl ? (
                  <div className="aspect-video">
                    <iframe
                      src={getYouTubeEmbedUrl(movie.trailerUrl)}
                      title={`${movie.title} Trailer`}
                      className="w-full h-full rounded"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">Trailer not available</p>
                )}
              </div>
            )}

            {activeTab === 'watch' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Where to Watch</h2>
                <p className="text-gray-400 mb-6">Stream this {movie.type === 'series' ? 'series' : 'movie'} legally on these platforms:</p>
                
                {/* Streaming Platforms */}
                {movie.streamingPlatforms && movie.streamingPlatforms.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {movie.streamingPlatforms.includes('netflix') && (
                      <a
                        href={`https://www.netflix.com/search?q=${encodeURIComponent(movie.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 p-4 rounded-lg transition-all group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-black rounded flex items-center justify-center">
                            <span className="text-red-600 font-bold text-xl">N</span>
                          </div>
                          <div>
                            <p className="text-white font-semibold">Netflix</p>
                            <p className="text-red-200 text-sm">HD & 4K Available</p>
                          </div>
                        </div>
                        <FiPlay className="text-white group-hover:scale-110 transition-transform" size={24} />
                      </a>
                    )}

                    {movie.streamingPlatforms.includes('prime') && (
                      <a
                        href={`https://www.primevideo.com/search?phrase=${encodeURIComponent(movie.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 p-4 rounded-lg transition-all group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-white rounded flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-xl">P</span>
                          </div>
                          <div>
                            <p className="text-white font-semibold">Prime Video</p>
                            <p className="text-blue-200 text-sm">Stream or Rent</p>
                          </div>
                        </div>
                        <FiPlay className="text-white group-hover:scale-110 transition-transform" size={24} />
                      </a>
                    )}

                    {movie.streamingPlatforms.includes('disney') && (
                      <a
                        href={`https://www.disneyplus.com/search?q=${encodeURIComponent(movie.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 p-4 rounded-lg transition-all group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-white rounded flex items-center justify-center">
                            <span className="text-indigo-600 font-bold text-xl">D+</span>
                          </div>
                          <div>
                            <p className="text-white font-semibold">Disney+ Hotstar</p>
                            <p className="text-indigo-200 text-sm">Premium Content</p>
                          </div>
                        </div>
                        <FiPlay className="text-white group-hover:scale-110 transition-transform" size={24} />
                      </a>
                    )}

                    {movie.streamingPlatforms.includes('apple') && (
                      <a
                        href={`https://tv.apple.com/search?term=${encodeURIComponent(movie.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between bg-gradient-to-r from-gray-800 to-black hover:from-gray-900 hover:to-gray-800 p-4 rounded-lg transition-all group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-white rounded flex items-center justify-center">
                            <span className="text-black font-bold text-xl">tv+</span>
                          </div>
                          <div>
                            <p className="text-white font-semibold">Apple TV+</p>
                            <p className="text-gray-300 text-sm">4K HDR</p>
                          </div>
                        </div>
                        <FiPlay className="text-white group-hover:scale-110 transition-transform" size={24} />
                      </a>
                    )}

                    {movie.streamingPlatforms.includes('hotstar') && (
                      <a
                        href={`https://www.hotstar.com/search?q=${encodeURIComponent(movie.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 p-4 rounded-lg transition-all group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-black rounded flex items-center justify-center">
                            <span className="text-yellow-500 font-bold text-xl">H</span>
                          </div>
                          <div>
                            <p className="text-white font-semibold">Hotstar</p>
                            <p className="text-yellow-200 text-sm">Stream Now</p>
                          </div>
                        </div>
                        <FiPlay className="text-white group-hover:scale-110 transition-transform" size={24} />
                      </a>
                    )}

                    {movie.streamingPlatforms.includes('zee5') && (
                      <a
                        href={`https://www.zee5.com/search?q=${encodeURIComponent(movie.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 p-4 rounded-lg transition-all group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-white rounded flex items-center justify-center">
                            <span className="text-purple-600 font-bold text-xl">Z5</span>
                          </div>
                          <div>
                            <p className="text-white font-semibold">Zee5</p>
                            <p className="text-purple-200 text-sm">Watch Now</p>
                          </div>
                        </div>
                        <FiPlay className="text-white group-hover:scale-110 transition-transform" size={24} />
                      </a>
                    )}

                    {movie.streamingPlatforms.includes('sonyliv') && (
                      <a
                        href={`https://www.sonyliv.com/search?q=${encodeURIComponent(movie.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 p-4 rounded-lg transition-all group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-white rounded flex items-center justify-center">
                            <span className="text-green-600 font-bold text-xl">SL</span>
                          </div>
                          <div>
                            <p className="text-white font-semibold">SonyLIV</p>
                            <p className="text-green-200 text-sm">Stream Now</p>
                          </div>
                        </div>
                        <FiPlay className="text-white group-hover:scale-110 transition-transform" size={24} />
                      </a>
                    )}

                    {movie.streamingPlatforms.includes('youtube') && (
                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 p-4 rounded-lg transition-all group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-white rounded flex items-center justify-center">
                            <span className="text-red-600 font-bold text-xl">▶</span>
                          </div>
                          <div>
                            <p className="text-white font-semibold">YouTube</p>
                            <p className="text-red-200 text-sm">Rent or Buy</p>
                          </div>
                        </div>
                        <FiPlay className="text-white group-hover:scale-110 transition-transform" size={24} />
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
                    <p className="text-yellow-400 text-sm">
                      ⚠️ Streaming platform information not available for this {movie.type === 'series' ? 'series' : 'movie'}. Check back later!
                    </p>
                  </div>
                )}

                {/* Download Options (Legal) */}
                {movie.downloadLinks && movie.downloadLinks.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-xl font-bold text-white mb-3">Purchase & Download</h3>
                    <p className="text-gray-400 text-sm mb-4">Buy or rent to download and watch offline</p>
                    <div className="space-y-3">
                      {movie.downloadLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between bg-dark-200 hover:bg-dark-300 p-4 rounded-lg transition-colors group"
                        >
                          <div className="flex items-center space-x-3">
                            <FiDownload className="text-primary-500 group-hover:scale-110 transition-transform" size={24} />
                            <div>
                              <p className="text-white font-semibold">{link.quality}</p>
                              {link.size && <p className="text-gray-400 text-sm">{link.size}</p>}
                            </div>
                          </div>
                          <span className="text-primary-500 font-semibold">Buy/Rent</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Legal Disclaimer */}
                <div className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <p className="text-green-400 text-sm">
                    ✓ All streaming links are official and legal. Support creators by watching on licensed platforms.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'screenshots' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Screenshots</h2>
                {movie.screenshots && movie.screenshots.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {movie.screenshots.map((screenshot, index) => (
                      <div key={index} className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer">
                        <Image
                          src={getImageUrl(screenshot)}
                          alt={`${movie.title} screenshot ${index + 1}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">Screenshots not available</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">User Reviews</h2>
                <div className="mb-6">
                  <FeedbackForm movieId={movie._id} movieTitle={movie.title} />
                </div>
                <FeedbackList movieId={movie._id} />
              </div>
            )}
          </div>
        </div>

        {/* Between Content Ad */}
        <AdSlotRenderer position="between-movies" className="mb-8" />

        {/* Related Movies */}
        {relatedMovies && relatedMovies.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Related Movies</h2>
            <MovieGrid movies={relatedMovies} />
          </div>
        )}

        {/* Bottom Ad */}
        <AdSlotRenderer position="movie-detail-bottom" className="mt-8" />
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const [movieResponse, relatedResponse] = await Promise.all([
      moviesAPI.getBySlug(params.slug),
      moviesAPI.getRelated(params.slug, 6),
    ]);

    return {
      props: {
        movie: movieResponse.data.data || null,
        relatedMovies: relatedResponse.data.data || [],
      },
    };
  } catch (error) {
    console.error('Error fetching movie:', error);
    return {
      props: {
        movie: null,
        relatedMovies: [],
      },
    };
  }
}
