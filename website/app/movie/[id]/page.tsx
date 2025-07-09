'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Play, Star, Calendar, Clock, Globe, ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import MovieGrid from '@/components/sections/MovieGrid';
import useMovieStore from '@/store/movieStore';
import { MovieDetails } from '@/types/movie';
import { getBackdropUrl, getPosterUrl, getProfileUrl, formatRuntime, formatReleaseDate, formatRating, formatCurrency } from '@/lib/tmdb';

export default function MovieDetailPage() {
  const params = useParams();
  const movieId = parseInt(params.id as string);
  const [showTrailer, setShowTrailer] = useState(false);
  
  const { movieDetails, loading, fetchMovieDetails } = useMovieStore();
  const movie = movieDetails[movieId];

  useEffect(() => {
    if (movieId) {
      fetchMovieDetails(movieId);
    }
  }, [movieId, fetchMovieDetails]);

  if (loading.details && !movie) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-dark-700 rounded-xl mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-8 bg-dark-700 rounded w-3/4" />
                <div className="h-4 bg-dark-700 rounded w-1/2" />
                <div className="space-y-2">
                  <div className="h-4 bg-dark-700 rounded" />
                  <div className="h-4 bg-dark-700 rounded" />
                  <div className="h-4 bg-dark-700 rounded w-5/6" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-dark-700 rounded w-3/4" />
                <div className="h-4 bg-dark-700 rounded w-1/2" />
                <div className="h-4 bg-dark-700 rounded w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-white mb-4">Movie not found</h1>
            <a href="/" className="btn-primary">
              Go back to home
            </a>
          </div>
        </div>
      </div>
    );
  }

  const backdropUrl = getBackdropUrl(movie.backdrop_path, 'large');
  const posterUrl = getPosterUrl(movie.poster_path, 'large');
  const trailer = movie.videos?.results.find(video => 
    video.type === 'Trailer' && video.site === 'YouTube'
  );

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-96 lg:h-[500px]">
        <Image
          src={backdropUrl}
          alt={movie.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Poster */}
              <div className="flex-shrink-0">
                <Image
                  src={posterUrl}
                  alt={movie.title}
                  width={300}
                  height={450}
                  className="rounded-xl shadow-2xl w-48 lg:w-72"
                />
              </div>
              
              {/* Movie Info */}
              <div className="flex-1 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <a href="/" className="text-gray-300 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                  </a>
                  <span className="text-gray-300">Back to movies</span>
                </div>
                
                <h1 className="text-3xl lg:text-5xl font-bold mb-4">{movie.title}</h1>
                
                {movie.tagline && (
                  <p className="text-xl text-gray-300 italic mb-4">{movie.tagline}</p>
                )}
                
                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">{formatRating(movie.vote_average)}</span>
                    <span className="text-gray-300">({movie.vote_count.toLocaleString()} votes)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>{formatReleaseDate(movie.release_date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{formatRuntime(movie.runtime)}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-primary-600 rounded-full text-sm font-medium"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
                
                <p className="text-lg leading-relaxed mb-6 max-w-3xl">{movie.overview}</p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  {trailer && (
                    <button
                      onClick={() => setShowTrailer(true)}
                      className="btn-primary flex items-center gap-2 justify-center"
                    >
                      <Play className="w-5 h-5" />
                      Watch Trailer
                    </button>
                  )}
                  {movie.homepage && (
                    <a
                      href={movie.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary flex items-center gap-2 justify-center"
                    >
                      <Globe className="w-5 h-5" />
                      Official Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Movie Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            {/* Cast */}
            {movie.credits?.cast && movie.credits.cast.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">Cast</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                  {movie.credits.cast.slice(0, 10).map((actor) => (
                    <div key={actor.id} className="flex-shrink-0 w-32 text-center">
                      <div className="relative w-32 h-32 mb-3">
                        <Image
                          src={getProfileUrl(actor.profile_path, 'medium')}
                          alt={actor.name}
                          fill
                          className="object-cover rounded-full"
                        />
                      </div>
                      <h3 className="text-white font-medium text-sm mb-1">{actor.name}</h3>
                      <p className="text-gray-400 text-xs">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
          
          {/* Movie Info Sidebar */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-xl font-bold text-white mb-4">Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-400">Budget:</span>
                  <span className="text-white ml-2">{formatCurrency(movie.budget)}</span>
                </div>
                <div>
                  <span className="text-gray-400">Revenue:</span>
                  <span className="text-white ml-2">{formatCurrency(movie.revenue)}</span>
                </div>
                <div>
                  <span className="text-gray-400">Status:</span>
                  <span className="text-white ml-2">{movie.status}</span>
                </div>
                <div>
                  <span className="text-gray-400">Original Language:</span>
                  <span className="text-white ml-2">{movie.original_language.toUpperCase()}</span>
                </div>
                {movie.production_companies.length > 0 && (
                  <div>
                    <span className="text-gray-400">Production:</span>
                    <div className="mt-2 space-y-1">
                      {movie.production_companies.slice(0, 3).map((company) => (
                        <div key={company.id} className="text-white text-xs">
                          {company.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && trailer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl aspect-video">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              title="Movie Trailer"
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

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