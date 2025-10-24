import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout/Layout';
import MovieGrid from '@/components/Movies/MovieGrid';
import Pagination from '@/components/UI/Pagination';
import AdSlotRenderer from '@/components/AdSense/AdSlotRenderer';
import { moviesAPI, categoriesAPI } from '@/lib/api';

export default function CategoryPage({ category, initialMovies, initialPagination }) {
  const router = useRouter();
  const [movies, setMovies] = useState(initialMovies);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(false);

  const fetchMovies = async (page) => {
    setLoading(true);
    try {
      const response = await moviesAPI.getAll({
        page,
        limit: 20,
        category: category.slug,
      });
      
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

  const handlePageChange = (page) => {
    fetchMovies(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!category) {
    return (
      <Layout title="Category Not Found">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Category Not Found</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title={`${category.name} Movies`}
      description={category.description || `Browse all ${category.name} movies in HD quality`}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
            {category.name} Movies
          </h1>
          {category.description && (
            <p className="text-gray-400">{category.description}</p>
          )}
        </div>

        {/* Top Ad */}
        <AdSlotRenderer position="header" className="mb-8" />

        {/* Movies Grid */}
        <MovieGrid movies={movies} loading={loading} />

        {/* Pagination */}
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={handlePageChange}
        />

        {/* Bottom Ad */}
        <AdSlotRenderer position="footer" className="mt-8" />
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const [categoryResponse, moviesResponse] = await Promise.all([
      categoriesAPI.getBySlug(params.slug),
      moviesAPI.getAll({ page: 1, limit: 20, category: params.slug }),
    ]);

    return {
      props: {
        category: categoryResponse.data.data || null,
        initialMovies: moviesResponse.data.data || [],
        initialPagination: moviesResponse.data.pagination || { page: 1, pages: 1, total: 0 },
      },
    };
  } catch (error) {
    console.error('Error fetching category:', error);
    return {
      props: {
        category: null,
        initialMovies: [],
        initialPagination: { page: 1, pages: 1, total: 0 },
      },
    };
  }
}
