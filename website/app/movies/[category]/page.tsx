'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import MovieGrid from '@/components/sections/MovieGrid';
import useMovieStore from '@/store/movieStore';
import { MovieCategory } from '@/types/movie';
import { TrendingUp, Clock, Star, Calendar } from 'lucide-react';

const categoryConfig = {
  'popular': {
    title: 'Popular Movies',
    description: 'Discover the most popular movies right now',
    icon: TrendingUp,
    key: 'popular' as MovieCategory,
  },
  'now-playing': {
    title: 'Now Playing',
    description: 'Movies currently in theaters',
    icon: Clock,
    key: 'now_playing' as MovieCategory,
  },
  'top-rated': {
    title: 'Top Rated Movies',
    description: 'Highest rated movies of all time',
    icon: Star,
    key: 'top_rated' as MovieCategory,
  },
  'upcoming': {
    title: 'Upcoming Movies',
    description: 'Movies coming soon to theaters',
    icon: Calendar,
    key: 'upcoming' as MovieCategory,
  },
};

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const [currentPage, setCurrentPage] = useState(1);
  
  if (!category || !(category in categoryConfig)) {
    notFound();
  }

  const config = categoryConfig[category as keyof typeof categoryConfig];
  const { movies, loading, pagination, fetchMoviesByCategory } = useMovieStore();
  const categoryMovies = movies[config.key];
  const categoryLoading = loading[config.key];
  const categoryPagination = pagination[config.key];

  useEffect(() => {
    // Fetch initial data if not already loaded
    if (categoryMovies.length === 0) {
      fetchMoviesByCategory(config.key, 1);
      setCurrentPage(1);
    }
  }, [config.key, categoryMovies.length, fetchMoviesByCategory]);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    if (nextPage <= categoryPagination.totalPages) {
      fetchMoviesByCategory(config.key, nextPage, true);
      setCurrentPage(nextPage);
    }
  };

  const IconComponent = config.icon;

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary-500/10 rounded-full">
              <IconComponent className="w-8 h-8 text-primary-500" />
            </div>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
            {config.title}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {config.description}
          </p>
          
          {/* Results Count */}
          {categoryPagination.totalPages > 0 && (
            <div className="mt-4 text-sm text-gray-500">
              Page {categoryPagination.page} of {categoryPagination.totalPages} 
              {categoryMovies.length > 0 && (
                <span className="ml-2">
                  • Showing {categoryMovies.length} movies
                </span>
              )}
            </div>
          )}
        </div>

        {/* Movies Grid */}
        <MovieGrid
          movies={categoryMovies}
          loading={categoryLoading && currentPage === 1}
          showLoadMore={currentPage < categoryPagination.totalPages}
          onLoadMore={handleLoadMore}
          loadingMore={categoryLoading && currentPage > 1}
        />

        {/* Load More Info */}
        {currentPage < categoryPagination.totalPages && (
          <div className="text-center mt-8 text-gray-400 text-sm">
            {categoryPagination.totalPages - currentPage} more pages available
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-dark-700 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 Cinema Discover. All rights reserved.</p>
            <p className="text-sm mt-2">Powered by The Movie Database (TMDB)</p>
          </div>
        </div>
      </footer>
    </div>
  );
}