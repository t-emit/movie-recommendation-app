// src/pages/ProfilePage.js (Updated)
import React, { useState, useEffect } from 'react';
import { getLists } from '../api/cineRecApi';
import { fetchMoviesByIds } from '../api/omdbApi';
import MovieCard from '../components/MovieCard';
import MovieCardSkeleton from '../components/MovieCardSkeleton';
import RecommendedTab from '../components/RecommendedTab';

const ProfilePage = () => {
  const [lists, setLists] = useState({ likes: [], dislikes: [], watchlist: [] });
  const [activeTab, setActiveTab] = useState('recommendations');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This useEffect for fetching lists remains the same
    const fetchUserLists = async () => {
      setLoading(true);
      try {
        const res = await getLists();
        const { likes, dislikes, watchlist } = res.data;

        const [likesDetails, dislikesDetails, watchlistDetails] = await Promise.all([
          fetchMoviesByIds(likes),
          fetchMoviesByIds(dislikes),
          fetchMoviesByIds(watchlist)
        ]);

        setLists({
          likes: likesDetails.map(r => r.data),
          dislikes: dislikesDetails.map(r => r.data),
          watchlist: watchlistDetails.map(r => r.data),
        });
      } catch (error) {
        console.error("Failed to fetch user lists:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserLists();
  }, []);
  
  const renderList = (list) => {
    if (loading) {
      return (
        <div className="movie-grid">
          {Array.from({ length: 5 }).map((_, index) => <MovieCardSkeleton key={index} />)}
        </div>
      );
    }
    if (list.length === 0) {
      return <p className="empty-list-message">This list is empty. Go explore and add some movies!</p>;
    }
    return (
      <div className="movie-grid">
        {list.map(movie => <MovieCard key={movie.imdbID} movie={movie} />)}
      </div>
    );
  };

  return (
    <div className="container">
      <h1 className="page-title">Your Profile</h1>
      <div className="profile-tabs">
        <button className={`tab-button ${activeTab === 'recommendations' ? 'active' : ''}`} onClick={() => setActiveTab('recommendations')}>
          🌟 Recommended
        </button>
        <button className={`tab-button ${activeTab === 'likes' ? 'active' : ''}`} onClick={() => setActiveTab('likes')}>
          ❤️ Likes ({lists.likes.length})
        </button>
        <button className={`tab-button ${activeTab === 'dislikes' ? 'active' : ''}`} onClick={() => setActiveTab('dislikes')}>
          💔 Dislikes ({lists.dislikes.length})
        </button>
        <button className={`tab-button ${activeTab === 'watchlist' ? 'active' : ''}`} onClick={() => setActiveTab('watchlist')}>
          ➕ Watchlist ({lists.watchlist.length})
        </button>
      </div>
      <div className="tab-content">
        {/* --- THIS IS THE KEY CHANGE --- */}
        {activeTab === 'recommendations' && <RecommendedTab likesCount={lists.likes.length} />}
        
        {activeTab === 'likes' && renderList(lists.likes)}
        {activeTab === 'dislikes' && renderList(lists.dislikes)}
        {activeTab === 'watchlist' && renderList(lists.watchlist)}
      </div>
    </div>
  );
};

export default ProfilePage;