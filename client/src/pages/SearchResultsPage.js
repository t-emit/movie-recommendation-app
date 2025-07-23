// src/pages/SearchResultsPage.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { searchMovies } from '../api/omdbApi'; // UPDATED
import MovieCard from '../components/MovieCard';
import MovieCardSkeleton from '../components/MovieCardSkeleton';
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResultsPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1); // <-- State for current page
  const [totalResults, setTotalResults] = useState(0); // <-- State for total results

  const query = useQuery().get('query');

  useEffect(() => {
    // This effect runs when the search query changes, resetting everything
    if (query) {
      setMovies([]); // Clear previous results
      setPage(1); // Reset to page 1
      fetchSearchResults(query, 1, true); // `true` to indicate a new search
    } else {
      setMovies([]);
      setLoading(false);
    }
  }, [query]);

  const fetchSearchResults = async (currentQuery, currentPage, isNewSearch = false) => {
    setLoading(true);
    setError('');
    try {
      const response = await searchMovies(currentQuery, currentPage);
      if (response.data.Response === "True") {
        // If it's a new search, replace movies. Otherwise, append them.
        setMovies(prev => isNewSearch ? response.data.Search : [...prev, ...response.data.Search]);
        setTotalResults(parseInt(response.data.totalResults, 10));
      } else {
        if (isNewSearch) {
          setMovies([]);
          setError(response.data.Error);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchSearchResults(query, nextPage);
  };

  // Check if there are more movies to load
  const hasMore = movies.length < totalResults;

  if (loading && movies.length === 0) {
    return (
      <div className="container">
        <h1 className="page-title">Searching for "{query}"...</h1>
        <div className="movie-grid">
          {Array.from({ length: 10 }).map((_, index) => <MovieCardSkeleton key={index} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">
        {query ? `Search Results for "${query}"` : 'Please enter a search term'}
      </h1>

      {movies.length > 0 ? (
        <>
          <div className="movie-grid">
            {movies.map((movie) => <MovieCard key={`${movie.imdbID}-${Math.random()}`} movie={movie} />)}
          </div>
          {hasMore && (
            <div className="load-more-container">
              <button onClick={handleLoadMore} disabled={loading} className="load-more-btn">
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      ) : (
        query && !loading && <p>{error || 'No movies found.'}</p>
      )}
    </div>
  );
};

export default SearchResultsPage