// src/pages/HomePage.js (CORRECTED with Load More restored)
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
      if (isAuthenticated) {
        setTitle('Recommended For You');
        const res = await getRecommendations(); // Recommendations are a curated, non-paginated list
        setMovies(res.data || []);
        setTotalResults(res.data?.length || 0); // Total results is just the length of the list
      } else {
        // --- THIS IS THE CORRECTED LOGIC FOR LOGGED-OUT USERS ---
        setTitle('Popular Movies');
        const res = await searchMovies('action', currentPage); // Using 'action' as a popular default
        if (res.data.Response === "True") {
          const newMovies = res.data.Search;
          setMovies(prev => isNewLoad ? newMovies : [...prev, ...newMovies]);
          setTotalResults(parseInt(res.data.totalResults, 10));
        } else {
          setMovies([]);
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
    loadMovies(nextPage, false);
  };

  // The "Load More" button should only appear if the user is NOT authenticated
  // AND there are more results available from the OMDb API.
  const hasMore = !isAuthenticated && movies.length > 0 && movies.length < totalResults;

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
          {hasMore && (
            <div className="load-more-container">
              <button onClick={handleLoadMore} disabled={loading} className="load-more-btn">
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      ) : (
        <p>No movies to display at the moment.</p>
      )}
    </div>
  );
};

export default HomePage;