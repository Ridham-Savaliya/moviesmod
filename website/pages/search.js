import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout/Layout';
import MovieGrid from '@/components/Movies/MovieGrid';
import Pagination from '@/components/UI/Pagination';
import AdUnit from '@/components/AdSense/AdUnit';
import { moviesAPI } from '@/lib/api';

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const [movies, setMovies] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (q) {
      fetchMovies(1);
    }
  }, [q]);

  const fetchMovies = async (page) => {
    setLoading(true);
    try {
      const response = await moviesAPI.getAll({
        page,
        limit: 20,
        search: q,
      });
      
      if (response.data.success) {
        setMovies(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchMovies(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout
      title={`Search Results for "${q}"`}
      description={`Search results for ${q}`}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
            Search Results for "{q}"
          </h1>
          <p className="text-gray-400">
            {pagination.total} {pagination.total === 1 ? 'result' : 'results'} found
          </p>
        </div>

        {/* Top Ad */}
        <AdUnit slot="search-top" className="mb-8" />

        {/* Movies Grid */}
        <MovieGrid movies={movies} loading={loading} />

        {/* Pagination */}
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={handlePageChange}
        />

        {/* Bottom Ad */}
        <AdUnit slot="search-bottom" className="mt-8" />
      </div>
    </Layout>
  );
}
