'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import useMovieStore from '@/store/movieStore';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
}

export default function SearchBar({ 
  className = '', 
  placeholder = 'Search movies...', 
  autoFocus = false 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { searchMovies, clearSearch, searchResults, loading } = useMovieStore();

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (query.trim()) {
        searchMovies(query.trim());
        setIsOpen(true);
      } else {
        clearSearch();
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [query, searchMovies, clearSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  const handleClear = () => {
    setQuery('');
    clearSearch();
    setIsOpen(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleMovieSelect = (movieId: number) => {
    router.push(`/movie/${movieId}`);
    setIsOpen(false);
    setQuery('');
    clearSearch();
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="input-field pl-10 pr-10"
            onFocus={() => query && setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-dark-800 border border-dark-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {loading.search ? (
            <div className="p-4 text-center text-gray-400">
              <div className="animate-spin w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full mx-auto" />
              <p className="mt-2">Searching...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <>
              {searchResults.slice(0, 8).map((movie) => (
                <button
                  key={movie.id}
                  onClick={() => handleMovieSelect(movie.id)}
                  className="w-full px-4 py-3 text-left hover:bg-dark-700 transition-colors border-b border-dark-700 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-15 bg-dark-600 rounded flex-shrink-0 overflow-hidden">
                      {movie.poster_path && (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm">{movie.title}</h4>
                      <p className="text-gray-400 text-xs">
                        {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
              {searchResults.length > 8 && (
                <button
                  onClick={() => {
                    router.push(`/search?q=${encodeURIComponent(query)}`);
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-3 text-center text-primary-400 hover:text-primary-300 font-medium text-sm"
                >
                  View all {searchResults.length} results
                </button>
              )}
            </>
          ) : query && !loading.search ? (
            <div className="p-4 text-center text-gray-400">
              <p>No movies found for "{query}"</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}