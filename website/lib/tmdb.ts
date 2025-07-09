import axios from 'axios';
import { Movie, MovieDetails, MoviesResponse, SearchResponse, Genre, MovieCategory } from '@/types/movie';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
export const IMG_BASE_URL = process.env.NEXT_PUBLIC_TMDB_IMG_URL || 'https://image.tmdb.org/t/p';

// Image size configurations
export const IMG_SIZES = {
  poster: {
    small: 'w154',
    medium: 'w342',
    large: 'w500',
    xlarge: 'w780',
    original: 'original'
  },
  backdrop: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original'
  },
  profile: {
    small: 'w45',
    medium: 'w185',
    large: 'h632',
    original: 'original'
  }
};

class TMDBApi {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = BASE_URL;
    this.apiKey = API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('TMDB API key not found. Please check your environment variables.');
    }
  }

  private async request<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    try {
      const response = await axios.get(`${this.baseURL}${endpoint}`, {
        params: {
          api_key: this.apiKey,
          ...params,
        },
      });
      return response.data;
    } catch (error) {
      console.error('TMDB API Error:', error);
      throw error;
    }
  }

  // Get movies by category
  async getMoviesByCategory(category: MovieCategory, page: number = 1): Promise<MoviesResponse> {
    return this.request<MoviesResponse>(`/movie/${category}`, { page });
  }

  // Get popular movies
  async getPopularMovies(page: number = 1): Promise<MoviesResponse> {
    return this.request<MoviesResponse>('/movie/popular', { page });
  }

  // Get now playing movies
  async getNowPlayingMovies(page: number = 1): Promise<MoviesResponse> {
    return this.request<MoviesResponse>('/movie/now_playing', { page });
  }

  // Get top rated movies
  async getTopRatedMovies(page: number = 1): Promise<MoviesResponse> {
    return this.request<MoviesResponse>('/movie/top_rated', { page });
  }

  // Get upcoming movies
  async getUpcomingMovies(page: number = 1): Promise<MoviesResponse> {
    return this.request<MoviesResponse>('/movie/upcoming', { page });
  }

  // Get movie details
  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    return this.request<MovieDetails>(`/movie/${movieId}`, {
      append_to_response: 'credits,videos,images,similar,recommendations'
    });
  }

  // Search movies
  async searchMovies(query: string, page: number = 1): Promise<SearchResponse> {
    return this.request<SearchResponse>('/search/movie', { query, page });
  }

  // Get movie genres
  async getGenres(): Promise<{ genres: Genre[] }> {
    return this.request<{ genres: Genre[] }>('/genre/movie/list');
  }

  // Get similar movies
  async getSimilarMovies(movieId: number, page: number = 1): Promise<MoviesResponse> {
    return this.request<MoviesResponse>(`/movie/${movieId}/similar`, { page });
  }

  // Get movie recommendations
  async getRecommendations(movieId: number, page: number = 1): Promise<MoviesResponse> {
    return this.request<MoviesResponse>(`/movie/${movieId}/recommendations`, { page });
  }

  // Discover movies with filters
  async discoverMovies(params: {
    page?: number;
    with_genres?: string;
    sort_by?: string;
    year?: number;
    'primary_release_date.gte'?: string;
    'primary_release_date.lte'?: string;
    'vote_average.gte'?: number;
    'vote_count.gte'?: number;
  } = {}): Promise<MoviesResponse> {
    return this.request<MoviesResponse>('/discover/movie', params);
  }

  // Get trending movies
  async getTrendingMovies(timeWindow: 'day' | 'week' = 'week', page: number = 1): Promise<MoviesResponse> {
    return this.request<MoviesResponse>(`/trending/movie/${timeWindow}`, { page });
  }
}

// Utility functions for image URLs
export const getImageUrl = (path: string | null, size: string = 'medium', type: 'poster' | 'backdrop' | 'profile' = 'poster'): string => {
  if (!path) return '/placeholder-movie.jpg';
  
  let selectedSize: string;
  switch (type) {
    case 'poster':
      selectedSize = IMG_SIZES.poster[size as keyof typeof IMG_SIZES.poster] || IMG_SIZES.poster.medium;
      break;
    case 'backdrop':
      selectedSize = IMG_SIZES.backdrop[size as keyof typeof IMG_SIZES.backdrop] || IMG_SIZES.backdrop.medium;
      break;
    case 'profile':
      selectedSize = IMG_SIZES.profile[size as keyof typeof IMG_SIZES.profile] || IMG_SIZES.profile.medium;
      break;
    default:
      selectedSize = 'w500';
  }
  
  return `${IMG_BASE_URL}/${selectedSize}${path}`;
};

export const getPosterUrl = (path: string | null, size: keyof typeof IMG_SIZES.poster = 'medium'): string => {
  return getImageUrl(path, size, 'poster');
};

export const getBackdropUrl = (path: string | null, size: keyof typeof IMG_SIZES.backdrop = 'medium'): string => {
  return getImageUrl(path, size, 'backdrop');
};

export const getProfileUrl = (path: string | null, size: keyof typeof IMG_SIZES.profile = 'medium'): string => {
  return getImageUrl(path, size, 'profile');
};

// Format functions
export const formatRuntime = (minutes: number | null): string => {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

export const formatReleaseDate = (dateString: string): string => {
  if (!dateString) return 'Unknown';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

export const formatCurrency = (amount: number): string => {
  if (amount === 0) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Create singleton instance
const tmdbApi = new TMDBApi();
export default tmdbApi;