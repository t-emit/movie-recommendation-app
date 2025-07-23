// src/components/MovieCardSkeleton.js
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Don't forget to import the base CSS

const MovieCardSkeleton = () => {
  return (
    <div className="movie-card">
      <Skeleton height="100%" style={{ position: 'absolute' }} />
    </div>
  );
};

export default MovieCardSkeleton;