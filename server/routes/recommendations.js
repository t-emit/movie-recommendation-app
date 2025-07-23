// server/routes/recommendations.js (FINAL, ROBUST VERSION)
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');
const axios = require('axios');

const OMDB_API_URL = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}`;

// Helper to fetch movie details from OMDb by IMDb ID
const fetchMovieDetailsById = async (imdbID) => {
    try {
        const response = await axios.get(`${OMDB_API_URL}&i=${imdbID}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch details for ${imdbID}`, error.message);
        return null; // Return null on error
    }
};

// Helper function to shuffle an array
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const { likes, dislikes, watchlist } = user;
        const allUserMovies = new Set([...likes, ...dislikes, ...watchlist]);

        // --- FALLBACK LOGIC: If user has no liked movies, return popular movies ---
        if (likes.length === 0) {
            const response = await axios.get(`${OMDB_API_URL}&s=Action&type=movie`);
            const popularMovies = (response.data.Search || []).filter(movie => !allUserMovies.has(movie.imdbID));
            return res.json(popularMovies.slice(0, 10)); // Return popular, no totalResults needed here
        }

        // --- NEW RECOMMENDATION LOGIC ---

        // 1. Get up to the last 3 liked movies
        const recentLikes = likes.slice(-3);
        const detailedLikesPromises = recentLikes.map(id => fetchMovieDetailsById(id));
        const detailedLikes = (await Promise.all(detailedLikesPromises)).filter(Boolean); // .filter(Boolean) removes any nulls from failed fetches

        // 2. Collect all unique genres from these movies
        const genres = new Set();
        detailedLikes.forEach(movie => {
            if (movie.Genre) {
                movie.Genre.split(', ').forEach(genre => genres.add(genre));
            }
        });
        
        if (genres.size === 0) {
            return res.json([]); // Return empty if no genres found
        }

        // 3. Fetch movies for each unique genre
        const recommendationPromises = Array.from(genres).map(genre => 
            axios.get(`${OMDB_API_URL}&s=${genre}&type=movie`)
        );
        const genreResults = await Promise.all(recommendationPromises);

        // 4. Aggregate all results into one big list
        const allRecommendedMovies = genreResults.flatMap(result => result.data.Search || []);

        // 5. De-duplicate the movies (since genres might overlap)
        const uniqueMoviesMap = new Map();
        allRecommendedMovies.forEach(movie => {
            if (!uniqueMoviesMap.has(movie.imdbID)) {
                uniqueMoviesMap.set(movie.imdbID, movie);
            }
        });

        // 6. Filter out movies the user has already seen and movies without posters
        let finalRecommendations = Array.from(uniqueMoviesMap.values()).filter(movie => 
            !allUserMovies.has(movie.imdbID) && movie.Poster !== 'N/A'
        );
        
        // 7. Shuffle the final list for variety
        finalRecommendations = shuffleArray(finalRecommendations);

        // 8. Send up to 12 recommendations to the frontend
        res.json(finalRecommendations.slice(0, 12));
        
    } catch (err) {
        console.error("Recommendation Error:", err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;