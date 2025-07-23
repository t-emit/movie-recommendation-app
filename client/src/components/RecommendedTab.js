// src/components/RecommendedTab.js (CORRECTED)
import React, { useState, useEffect } from 'react';
import { getRecommendations } from '../api/cineRecApi';
import MovieCard from './MovieCard';
import MovieCardSkeleton from './MovieCardSkeleton';

// Receive likesCount as a prop
const RecommendedTab = ({ likesCount }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch recommendations if the user has liked movies
    if (likesCount > 0) {
      const fetchRecs = async () => {
        setLoading(true);
        try {
          const res = await getRecommendations();
          setMovies(res.data || []);
        } catch (error) {
          console.error("Failed to fetch recommendations:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchRecs();
    } else {
      // If there are no liked movies, don't bother fetching
      setLoading(false);
      setMovies([]);
    }
  }, [likesCount]); // Re-run if the number of likes changes

  if (loading) {
    return (
      <div className="movie-grid">
        {Array.from({ length: 10 }).map((_, index) => <MovieCardSkeleton key={index} />)}
      </div>
    );
  }

  // --- NEW, SMARTER MESSAGE LOGIC ---
  if (likesCount === 0) {
    return <p className="empty-list-message">Like some movies to get personalized recommendations!</p>;
  }

  if (movies.length === 0) {
    return <p className="empty-list-message">We're finding new recommendations for you. Try liking a few more diverse movies!</p>;
  }
  // --- END OF NEW LOGIC ---

  return (
    <div className="movie-grid">
      {movies.map(movie => <MovieCard key={movie.imdbID} movie={movie} />)}
    </div>
  );
};

export default RecommendedTab;