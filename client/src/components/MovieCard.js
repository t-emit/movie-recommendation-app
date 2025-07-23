// src/components/MovieCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  // UPDATED FOR OMDB: Use `movie.Poster` and handle "N/A"
  const posterUrl = movie.Poster !== 'N/A'
    ? movie.Poster
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    // UPDATED FOR OMDB: Link using `movie.imdbID`
    <Link to={`/movie/${movie.imdbID}`} className="movie-card">
      <img src={posterUrl} alt={movie.Title} className="movie-card-poster" />
      <div className="movie-card-overlay">
        {/* UPDATED FOR OMDB: Use `movie.Title` and `movie.Year` */}
        <h3 className="movie-card-title">{movie.Title}</h3>
        <p className="movie-card-rating">{movie.Year}</p>
      </div>
    </Link>
  );
};

export default MovieCard;