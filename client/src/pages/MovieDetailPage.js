// src/pages/MovieDetailPage.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMovieDetails } from '../api/omdbApi'; // UPDATED
import { addToList } from '../api/cineRecApi';
import { AuthContext } from '../context/AuthContext';

const MovieDetailPage = () => {
  const { id } = useParams(); // id is now the imdbID
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const getMovie = async () => {
      try {
        const res = await fetchMovieDetails(id);
        setMovie(res.data);
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      } finally {
        setLoading(false);
      }
    };
    getMovie();
  }, [id]);
  
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleListAdd = async (listType) => {
    if (!isAuthenticated) {
      showNotification('Please log in to use this feature.');
      return;
    }
    try {
      // UPDATED to send `imdbID`
      await addToList({ movieId: movie.imdbID, listType });
      showNotification(`Movie added to ${listType}!`);
    } catch (error) {
      console.error('Failed to add to list', error);
      showNotification('An error occurred. Please try again.');
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (!movie || movie.Response === 'False') return <div className="container">Movie not found.</div>;

  return (
    // Note: OMDb doesn't provide backdrop images, so we simplify the layout
    <div className="movie-detail-container container">
      {notification && <div className="notification show">{notification}</div>}
      <div className="movie-detail-content" style={{paddingTop: '2rem'}}>
        <img className="movie-detail-poster" src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/500x750?text=No+Image'} alt={movie.Title} />
        <div className="movie-detail-info">
          {/* UPDATED to use OMDb data fields */}
          <h1>{movie.Title} ({movie.Year})</h1>
          <div className="genres">
            {movie.Genre.split(', ').map(genre => <span key={genre} className="genre-tag">{genre}</span>)}
          </div>
          <p className="rating">⭐ {movie.imdbRating} / 10</p>
          <h3>Plot</h3>
          <p>{movie.Plot}</p>
          <h3>Starring</h3>
          <p>{movie.Actors}</p>
          
          {isAuthenticated && (
            <div className="action-buttons">
              <button className="like-btn" onClick={() => handleListAdd('likes')}>❤️ Like</button>
              <button className="dislike-btn" onClick={() => handleListAdd('dislikes')}>💔 Dislike</button>
              <button className="watchlist-btn" onClick={() => handleListAdd('watchlist')}>➕ Add to Watchlist</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;