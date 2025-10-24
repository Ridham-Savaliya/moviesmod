import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout/Layout';
import MovieGrid from '@/components/Movies/MovieGrid';
import Pagination from '@/components/UI/Pagination';
import FilterBar from '@/components/UI/FilterBar';
import AdSlotRenderer from '@/components/AdSense/AdSlotRenderer';
import { moviesAPI, categoriesAPI } from '@/lib/api';
import { generateWebsiteSchema } from '@/lib/seo';

export default function Home({ initialMovies, initialPagination, categories }) {
  const [movies, setMovies] = useState(initialMovies);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});

  const fetchMovies = async (page = 1, newFilters = {}) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 20,
        ...(newFilters.category?.value && { category: newFilters.category.value }),
        ...(newFilters.genre?.value && { genre: newFilters.genre.value }),
        ...(newFilters.year?.value && { year: newFilters.year.value }),
        ...(newFilters.quality?.value && { quality: newFilters.quality.value }),
        sort: newFilters.sort || 'latest',
      };

      const response = await moviesAPI.getAll(params);
      if (response.data.success) {
        setMovies(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchMovies(1, newFilters);
  };

  const handlePageChange = (page) => {
    fetchMovies(page, filters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'MoviesHub';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://moviesmod-virid.vercel.app';
  const description = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 
    'Watch and download latest movies in HD quality';

  const websiteSchema = generateWebsiteSchema(siteName, siteUrl, description);

  return (
    <Layout
      title="Watch & Download Latest Movies in HD Quality"
      description={description}
    >
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Header Ad */}
        <AdSlotRenderer position="header" className="mb-8" />

        {/* Filter Bar */}
        <FilterBar onFilterChange={handleFilterChange} categories={categories} />

        {/* Movies Grid */}
        <MovieGrid movies={movies} loading={loading} />

        {/* Pagination */}
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={handlePageChange}
        />

        {/* Footer Ad */}
        <AdSlotRenderer position="footer" className="mt-8" />
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const [moviesResponse, categoriesResponse] = await Promise.all([
      moviesAPI.getAll({ page: 1, limit: 20 }),
      categoriesAPI.getAll(),
    ]);

    return {
      props: {
        initialMovies: moviesResponse.data.data || [],
        initialPagination: moviesResponse.data.pagination || { page: 1, pages: 1, total: 0 },
        categories: categoriesResponse.data.data || [],
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        initialMovies: [],
        initialPagination: { page: 1, pages: 1, total: 0 },
        categories: [],
      },
    };
  }
}
