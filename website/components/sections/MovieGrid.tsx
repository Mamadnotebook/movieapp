import { Movie } from '@/types/movie';
import MovieCard from '@/components/ui/MovieCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface MovieGridProps {
  movies: Movie[];
  loading?: boolean;
  title?: string;
  className?: string;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
}

export default function MovieGrid({
  movies,
  loading = false,
  title,
  className = '',
  showLoadMore = false,
  onLoadMore,
  loadingMore = false,
}: MovieGridProps) {
  if (loading && movies.length === 0) {
    return (
      <div className={className}>
        {title && <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>}
        <div className="movie-grid">
          {Array.from({ length: 20 }).map((_, index) => (
            <div key={index} className="aspect-movie bg-dark-700 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!loading && movies.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        {title && <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>}
        <div className="text-gray-400">
          <p className="text-lg">No movies found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {title && <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>}
      
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {showLoadMore && onLoadMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={onLoadMore}
            disabled={loadingMore}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loadingMore ? (
              <>
                <LoadingSpinner size="sm" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}
    </div>
  );
}