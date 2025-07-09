import { create } from 'zustand';
import { Movie, MovieDetails, MoviesResponse, Genre, MovieCategory } from '@/types/movie';
import tmdbApi from '@/lib/tmdb';

interface MovieStore {
  // State
  movies: {
    popular: Movie[];
    nowPlaying: Movie[];
    topRated: Movie[];
    upcoming: Movie[];
    trending: Movie[];
  };
  movieDetails: Record<number, MovieDetails>;
  searchResults: Movie[];
  genres: Genre[];
  loading: {
    popular: boolean;
    nowPlaying: boolean;
    topRated: boolean;
    upcoming: boolean;
    trending: boolean;
    search: boolean;
    details: boolean;
    genres: boolean;
  };
  error: string | null;
  searchQuery: string;
  pagination: {
    popular: { page: number; totalPages: number };
    nowPlaying: { page: number; totalPages: number };
    topRated: { page: number; totalPages: number };
    upcoming: { page: number; totalPages: number };
    trending: { page: number; totalPages: number };
    search: { page: number; totalPages: number };
  };

  // Actions
  fetchMoviesByCategory: (category: MovieCategory, page?: number, append?: boolean) => Promise<void>;
  fetchMovieDetails: (movieId: number) => Promise<void>;
  searchMovies: (query: string, page?: number, append?: boolean) => Promise<void>;
  fetchGenres: () => Promise<void>;
  fetchTrendingMovies: (timeWindow?: 'day' | 'week', page?: number) => Promise<void>;
  clearSearch: () => void;
  clearError: () => void;
  resetPagination: (category: string) => void;
}

const initialPagination = { page: 1, totalPages: 1 };

const useMovieStore = create<MovieStore>((set, get) => ({
  // Initial state
  movies: {
    popular: [],
    nowPlaying: [],
    topRated: [],
    upcoming: [],
    trending: [],
  },
  movieDetails: {},
  searchResults: [],
  genres: [],
  loading: {
    popular: false,
    nowPlaying: false,
    topRated: false,
    upcoming: false,
    trending: false,
    search: false,
    details: false,
    genres: false,
  },
  error: null,
  searchQuery: '',
  pagination: {
    popular: initialPagination,
    nowPlaying: initialPagination,
    topRated: initialPagination,
    upcoming: initialPagination,
    trending: initialPagination,
    search: initialPagination,
  },

  // Actions
  fetchMoviesByCategory: async (category: MovieCategory, page = 1, append = false) => {
    const state = get();
    
    set({
      loading: { ...state.loading, [category]: true },
      error: null,
    });

    try {
      const response: MoviesResponse = await tmdbApi.getMoviesByCategory(category, page);
      
      set((state) => ({
        movies: {
          ...state.movies,
          [category]: append 
            ? [...state.movies[category], ...response.results]
            : response.results,
        },
        pagination: {
          ...state.pagination,
          [category]: {
            page: response.page,
            totalPages: response.total_pages,
          },
        },
        loading: { ...state.loading, [category]: false },
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch movies',
        loading: { ...state.loading, [category]: false },
      });
    }
  },

  fetchMovieDetails: async (movieId: number) => {
    const state = get();
    
    // Return if already loading or already have details
    if (state.loading.details || state.movieDetails[movieId]) {
      return;
    }

    set({
      loading: { ...state.loading, details: true },
      error: null,
    });

    try {
      const details = await tmdbApi.getMovieDetails(movieId);
      
      set((state) => ({
        movieDetails: {
          ...state.movieDetails,
          [movieId]: details,
        },
        loading: { ...state.loading, details: false },
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch movie details',
        loading: { ...state.loading, details: false },
      });
    }
  },

  searchMovies: async (query: string, page = 1, append = false) => {
    const state = get();
    
    set({
      loading: { ...state.loading, search: true },
      error: null,
      searchQuery: query,
    });

    try {
      const response = await tmdbApi.searchMovies(query, page);
      
      set((state) => ({
        searchResults: append 
          ? [...state.searchResults, ...response.results]
          : response.results,
        pagination: {
          ...state.pagination,
          search: {
            page: response.page,
            totalPages: response.total_pages,
          },
        },
        loading: { ...state.loading, search: false },
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to search movies',
        loading: { ...state.loading, search: false },
      });
    }
  },

  fetchGenres: async () => {
    const state = get();
    
    if (state.loading.genres || state.genres.length > 0) {
      return;
    }

    set({
      loading: { ...state.loading, genres: true },
      error: null,
    });

    try {
      const response = await tmdbApi.getGenres();
      
      set({
        genres: response.genres,
        loading: { ...state.loading, genres: false },
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch genres',
        loading: { ...state.loading, genres: false },
      });
    }
  },

  fetchTrendingMovies: async (timeWindow = 'week', page = 1) => {
    const state = get();
    
    set({
      loading: { ...state.loading, trending: true },
      error: null,
    });

    try {
      const response = await tmdbApi.getTrendingMovies(timeWindow, page);
      
      set((state) => ({
        movies: {
          ...state.movies,
          trending: response.results,
        },
        pagination: {
          ...state.pagination,
          trending: {
            page: response.page,
            totalPages: response.total_pages,
          },
        },
        loading: { ...state.loading, trending: false },
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch trending movies',
        loading: { ...state.loading, trending: false },
      });
    }
  },

  clearSearch: () => {
    set({
      searchResults: [],
      searchQuery: '',
      pagination: {
        ...get().pagination,
        search: initialPagination,
      },
    });
  },

  clearError: () => {
    set({ error: null });
  },

  resetPagination: (category: string) => {
    set((state) => ({
      pagination: {
        ...state.pagination,
        [category]: initialPagination,
      },
    }));
  },
}));

export default useMovieStore;