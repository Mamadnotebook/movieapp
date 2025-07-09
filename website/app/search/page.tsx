'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import MovieGrid from '@/components/sections/MovieGrid';
import SearchBar from '@/components/ui/SearchBar';
import useMovieStore from '@/store/movieStore';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [currentPage, setCurrentPage] = useState(1);
  
  const { 
    searchResults, 
    loading, 
    pagination, 
    searchMovies, 
    clearSearch,
    searchQuery 
  } = useMovieStore();

  useEffect(() => {
    if (query && query !== searchQuery) {
      clearSearch();
      searchMovies(query, 1);
      setCurrentPage(1);
    }
  }, [query, searchQuery, searchMovies, clearSearch]);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    if (nextPage <= pagination.search.totalPages) {
      searchMovies(query, nextPage, true);
      setCurrentPage(nextPage);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto mb-6">
            <SearchBar autoFocus placeholder="Search for movies..." />
          </div>
          
          {query && (
            <div className="text-center">
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                Search Results
              </h1>
              <p className="text-gray-400">
                {loading.search && currentPage === 1 ? (
                  'Searching...'
                ) : (
                  `Found ${pagination.search.totalPages > 0 ? 
                    ((pagination.search.page - 1) * 20 + searchResults.length) : 0
                  } results for "${query}"`
                )}
              </p>
            </div>
          )}
        </div>

        {/* Search Results */}
        {query ? (
          <MovieGrid
            movies={searchResults}
            loading={loading.search && currentPage === 1}
            showLoadMore={currentPage < pagination.search.totalPages}
            onLoadMore={handleLoadMore}
            loadingMore={loading.search && currentPage > 1}
          />
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Search for Movies
            </h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Enter a movie title, actor name, or keyword to discover movies you'll love.
            </p>
            
            {/* Popular Search Terms */}
            <div className="mt-8">
              <h3 className="text-white font-medium mb-4">Popular Searches</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  'Marvel', 'DC Comics', 'Action', 'Comedy', 'Horror', 
                  'Sci-Fi', 'Romance', 'Thriller', 'Animation', 'Documentary'
                ].map((term) => (
                  <a
                    key={term}
                    href={`/search?q=${encodeURIComponent(term)}`}
                    className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-gray-300 hover:text-white rounded-lg text-sm transition-colors"
                  >
                    {term}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* No Results */}
        {query && !loading.search && searchResults.length === 0 && currentPage === 1 && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              No results found
            </h2>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              We couldn't find any movies matching "{query}". Try different keywords or check your spelling.
            </p>
            
            <div className="space-y-2 text-sm text-gray-400">
              <p>Search tips:</p>
              <ul className="space-y-1">
                <li>• Try different keywords</li>
                <li>• Check your spelling</li>
                <li>• Use more general terms</li>
                <li>• Try searching for actors or directors</li>
              </ul>
            </div>
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