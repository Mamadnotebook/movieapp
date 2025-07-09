'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Info, Star, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '@/types/movie';
import { getBackdropUrl, formatRating } from '@/lib/tmdb';

interface MovieCarouselProps {
  movies: Movie[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export default function MovieCarousel({ 
  movies, 
  autoPlay = true, 
  autoPlayInterval = 5000 
}: MovieCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay || movies.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, movies.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? movies.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (!movies.length) {
    return (
      <div className="relative h-[60vh] bg-dark-800 rounded-xl animate-pulse" />
    );
  }

  const currentMovie = movies[currentIndex];
  const backdropUrl = getBackdropUrl(currentMovie.backdrop_path, 'large');
  const releaseYear = currentMovie.release_date 
    ? new Date(currentMovie.release_date).getFullYear() 
    : 'N/A';

  return (
    <div className="relative h-[60vh] lg:h-[70vh] rounded-xl overflow-hidden group">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backdropUrl}
          alt={currentMovie.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Navigation Arrows */}
      {movies.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="Previous movie"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="Next movie"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Movie Information */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-white font-medium">{formatRating(currentMovie.vote_average)}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-300">
                <Calendar className="w-4 h-4" />
                <span>{releaseYear}</span>
              </div>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {currentMovie.title}
            </h1>

            <p className="text-lg text-gray-200 mb-6 line-clamp-3 leading-relaxed">
              {currentMovie.overview}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/movie/${currentMovie.id}`}
                className="btn-primary flex items-center gap-2 justify-center"
              >
                <Play className="w-5 h-5" />
                Watch Trailer
              </Link>
              <Link
                href={`/movie/${currentMovie.id}`}
                className="btn-secondary flex items-center gap-2 justify-center"
              >
                <Info className="w-5 h-5" />
                More Info
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      {movies.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {movies.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-primary-500 w-8' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}