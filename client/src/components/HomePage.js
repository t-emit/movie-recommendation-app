import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getRecommendations } from '../api/cineRecApi';
import { searchMovies } from '../api/omdbApi';
import MovieCard from '../components/MovieCard';
import MovieCardSkeleton from '../components/MovieCardSkeleton';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [title, setTitle] = useState('Popular Movies');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    setMovies([]);
    setPage(1);
    loadMovies(1, true); // `true` indicates it's a new load
  }, [isAuthenticated]);

  const loadMovies = async (currentPage, isNewLoad = false) => {
    setLoading(true);
    try {
      let res;
      if (isAuthenticated) {
        // --- LOGIC FOR LOGGED-IN USERS (CHANGED) ---
        setTitle('Recommended For You');
        res = await getRecommendations(currentPage); // Pass the current page
        // Assumes API response is { Response: "True", recommendations: [...], totalResults: "..." }
        if (res.data.Response === "True") {
          const newMovies = res.data.recommendations;
          setMovies(prev => isNewLoad ? newMovies : [...prev, ...newMovies]);
          setTotalResults(parseInt(res.data.totalResults, 10));
        } else {
           if(isNewLoad) setMovies([]);
           setTotalResults(0);
        }
      } else {
        // --- LOGIC FOR LOGGED-OUT USERS (UNCHANGED) ---
        setTitle('Popular Movies');
        res = await searchMovies('action', currentPage);
        if (res.data.Response === "True") {
          const newMovies = res.data.Search;
          setMovies(prev => isNewLoad ? newMovies : [...prev, ...newMovies]);
          setTotalResults(parseInt(res.data.totalResults, 10));
        } else {
          if(isNewLoad) setMovies([]);
          setTotalResults(0);
        }
      }
    } catch (error) {
      console.error("Failed to load movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadMovies(nextPage, false); // false = append, don't replace
  };

  // --- SIMPLIFIED hasMore LOGIC (CHANGED) ---
  // Now works for both logged-in and logged-out users, as both provide totalResults.
  const hasMore = movies.length > 0 && movies.length < totalResults;

  if (loading && movies.length === 0) {
    return (
      <div className="container">
        <h1 className="page-title">{isAuthenticated ? 'Finding Recommendations...' : 'Loading Popular Movies...'}</h1>
        <div className="movie-grid">
          {Array.from({ length: 10 }).map((_, index) => <MovieCardSkeleton key={index} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">{title}</h1>
      {movies.length > 0 ? (
        <>
          <div className="movie-grid">
            {movies.map((movie) => <MovieCard key={`${movie.imdbID}-${Math.random()}`} movie={movie} />)}
          </div>
          {/* This will now correctly render the button for both states */}
          {hasMore && (
            <div className="load-more-container">
              <button onClick={handleLoadMore} disabled={loading} className="load-more-btn">
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      ) : (
        !loading && <p>No movies to display at the moment.</p>
      )}
    </div>
  );
};

export default HomePage;