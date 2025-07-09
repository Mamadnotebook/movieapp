'use client';

import { useEffect } from 'react';
import Header from '@/components/layout/Header';
import MovieCarousel from '@/components/sections/MovieCarousel';
import MovieGrid from '@/components/sections/MovieGrid';
import useMovieStore from '@/store/movieStore';
import { TrendingUp, Clock, Star, Calendar } from 'lucide-react';

export default function HomePage() {
  const {
    movies,
    loading,
    fetchMoviesByCategory,
    fetchTrendingMovies,
  } = useMovieStore();

  useEffect(() => {
    // Fetch initial data
    fetchTrendingMovies();
    fetchMoviesByCategory('popular');
    fetchMoviesByCategory('now_playing');
    fetchMoviesByCategory('top_rated');
  }, [fetchTrendingMovies, fetchMoviesByCategory]);

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Carousel */}
        <section>
          <MovieCarousel 
            movies={movies.trending.slice(0, 5)} 
            autoPlay={true}
            autoPlayInterval={6000}
          />
        </section>

        {/* Popular Movies */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-primary-500" />
              <h2 className="text-2xl lg:text-3xl font-bold text-white">Popular Movies</h2>
            </div>
            <a 
              href="/movies/popular" 
              className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              View All
            </a>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6">
            {loading.popular ? (
              Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="aspect-movie bg-dark-700 rounded-xl animate-pulse" />
              ))
            ) : (
              movies.popular.slice(0, 12).map((movie) => (
                <div key={movie.id} className="movie-card">
                  <a href={`/movie/${movie.id}`}>
                    <div className="relative aspect-movie">
                      <img
                        src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-full object-cover rounded-xl"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                      <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-white font-medium">
                            {movie.vote_average.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Now Playing */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-primary-500" />
              <h2 className="text-2xl lg:text-3xl font-bold text-white">Now Playing</h2>
            </div>
            <a 
              href="/movies/now-playing" 
              className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              View All
            </a>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
            {loading.nowPlaying ? (
              Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="flex-shrink-0 w-48 aspect-movie bg-dark-700 rounded-xl animate-pulse" />
              ))
            ) : (
              movies.nowPlaying.slice(0, 10).map((movie) => (
                <div key={movie.id} className="flex-shrink-0 w-48 movie-card">
                  <a href={`/movie/${movie.id}`}>
                    <div className="relative aspect-movie">
                      <img
                        src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-full object-cover rounded-xl"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{movie.title}</h3>
                        <div className="flex items-center gap-2 text-gray-300 text-xs">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(movie.release_date).getFullYear()}</span>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Top Rated */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Star className="w-6 h-6 text-primary-500" />
              <h2 className="text-2xl lg:text-3xl font-bold text-white">Top Rated</h2>
            </div>
            <a 
              href="/movies/top-rated" 
              className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              View All
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6">
            {loading.topRated ? (
              Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="aspect-movie bg-dark-700 rounded-xl animate-pulse" />
              ))
            ) : (
              movies.topRated.slice(0, 12).map((movie) => (
                <div key={movie.id} className="movie-card">
                  <a href={`/movie/${movie.id}`}>
                    <div className="relative aspect-movie">
                      <img
                        src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-full object-cover rounded-xl"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                      <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-white font-medium">
                            {movie.vote_average.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

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