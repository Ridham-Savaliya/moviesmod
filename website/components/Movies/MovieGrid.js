import MovieCard from './MovieCard';

const MovieGrid = ({ movies, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[...Array(10)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-dark-100 aspect-[2/3] rounded-lg"></div>
            <div className="mt-2 h-4 bg-dark-100 rounded"></div>
            <div className="mt-1 h-3 bg-dark-100 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No movies found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {movies.map((movie) => (
        <MovieCard key={movie._id} movie={movie} />
      ))}
    </div>
  );
};

export default MovieGrid;
