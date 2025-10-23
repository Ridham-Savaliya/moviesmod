import { useState } from 'react';
import Layout from '@/components/Layout/Layout';
import MovieGrid from '@/components/Movies/MovieGrid';
import AdUnit from '@/components/AdSense/AdUnit';
import { moviesAPI } from '@/lib/api';

export default function TrendingPage({ movies }) {
  return (
    <Layout
      title="Trending Movies"
      description="Watch the most popular and trending movies right now"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
            Trending Movies
          </h1>
          <p className="text-gray-400">Most viewed movies in the last 7 days</p>
        </div>

        {/* Top Ad */}
        <AdUnit slot="trending-top" className="mb-8" />

        {/* Movies Grid */}
        <MovieGrid movies={movies} />

        {/* Bottom Ad */}
        <AdUnit slot="trending-bottom" className="mt-8" />
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const response = await moviesAPI.getTrending(30);
    
    return {
      props: {
        movies: response.data.data || [],
      },
    };
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return {
      props: {
        movies: [],
      },
    };
  }
}
