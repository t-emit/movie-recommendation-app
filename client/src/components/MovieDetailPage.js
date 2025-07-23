// src/pages/MovieDetailPage.js (ADVANCED UPDATE)
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMovieDetails } from '../api/omdbApi';
import { addToList, removeFromList, getLists } from '../api/cineRecApi'; // Import new functions
import { AuthContext } from '../context/AuthContext';

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');
  const { isAuthenticated } = useContext(AuthContext);
  
  // NEW STATE: To track the user's lists for this movie
  const [userLists, setUserLists] = useState({ likes: [], dislikes: [], watchlist: [] });
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isOnWatchlist, setIsOnWatchlist] = useState(false);

  useEffect(() => {
    const getMovieAndLists = async () => {
      setLoading(true);
      try {
        // Fetch movie details and user lists in parallel
        const [movieRes, listsRes] = await Promise.all([
          fetchMovieDetails(id),
          isAuthenticated ? getLists() : Promise.resolve(null)
        ]);

        setMovie(movieRes.data);
        
        if (listsRes) {
          const lists = listsRes.data;
          setUserLists(lists);
          // Check if the current movie is in any list
          setIsLiked(lists.likes.includes(id));
          setIsDisliked(lists.dislikes.includes(id));
          setIsOnWatchlist(lists.watchlist.includes(id));
        }
      } catch (error) {
        console.error("Failed to fetch page data:", error);
      } finally {
        setLoading(false);
      }
    };
    getMovieAndLists();
  }, [id, isAuthenticated]);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleToggle = async (listType, currentState, setStateFunction) => {
    if (!isAuthenticated) {
      showNotification('Please log in to use this feature.');
      return;
    }
    
    try {
      if (currentState) {
        // If it's already in the list, remove it
        await removeFromList({ movieId: movie.imdbID, listType });
        setStateFunction(false);
        showNotification(`Removed from ${listType}`);
      } else {
        // If it's not in the list, add it
        await addToList({ movieId: movie.imdbID, listType });
        setStateFunction(true);
        showNotification(`Added to ${listType}`);

        // Handle the like/dislike opposition
        if (listType === 'likes') setIsDisliked(false);
        if (listType === 'dislikes') setIsLiked(false);
      }
    } catch (error) {
      console.error('Failed to update list', error);
      showNotification('An error occurred.');
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (!movie || movie.Response === 'False') return <div className="container">Movie not found.</div>;

  return (
    <div className="movie-detail-container container">
      {notification && <div className="notification show">{notification}</div>}
      <div className="movie-detail-content" style={{paddingTop: '2rem'}}>
        <img className="movie-detail-poster" src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/500x750?text=No+Image'} alt={movie.Title} />
        <div className="movie-detail-info">
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
              {/* Add a class 'active' if the movie is in the list */}
              <button 
                className={`like-btn ${isLiked ? 'active' : ''}`}
                onClick={() => handleToggle('likes', isLiked, setIsLiked)}
              >
                {isLiked ? '❤️ Liked' : '❤️ Like'}
              </button>
              <button 
                className={`dislike-btn ${isDisliked ? 'active' : ''}`}
                onClick={() => handleToggle('dislikes', isDisliked, setIsDisliked)}
              >
                {isDisliked ? '💔 Disliked' : '💔 Dislike'}
              </button>
              <button 
                className={`watchlist-btn ${isOnWatchlist ? 'active' : ''}`}
                onClick={() => handleToggle('watchlist', isOnWatchlist, setIsOnWatchlist)}
              >
                {isOnWatchlist ? '✓ On Watchlist' : '➕ Add to Watchlist'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;